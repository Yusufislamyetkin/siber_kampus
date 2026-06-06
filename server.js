const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyber_key_2026';

// DB Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
});

app.use(cors());
app.use(express.json());

// Serving static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Oturum açılması gerekiyor.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Oturum süresi doldu veya geçersiz.' });
    req.user = user;
    
    // Update last active status in the background
    pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [user.id])
      .catch(dbErr => console.error('Error updating last active:', dbErr));

    next();
  });
};

// Helper to fetch full user payload with dynamic ranking position (excluding admins)
async function getUserPayload(userId) {
  const query = `
    WITH ranked_users AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, id ASC) as dynamic_rank
      FROM users
      WHERE is_admin = false
    )
    SELECT u.id, u.email, u.name, u.points, u.solved_count, u.level,
           COALESCE(r.dynamic_rank, 1) as rank_val,
           u.badges, u.streak, u.name_changed, u.is_admin, u.is_banned, u.is_vip
    FROM users u
    LEFT JOIN ranked_users r ON u.id = r.id
    WHERE u.id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

// ==========================================
// AUTHENTICATION APIs
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, pw } = req.body;
  if (!name || !email || !pw) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.' });
    }

    const passwordHash = await bcrypt.hash(pw, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [email.toLowerCase().trim(), passwordHash, name.trim()]
    );

    const user = await getUserPayload(result.rows[0].id);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ error: 'Kayıt esnasında sistemsel bir hata oluştu.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, pw } = req.body;
  if (!email || !pw) {
    return res.status(400).json({ error: 'E-posta ve şifre gereklidir.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Hatalı e-posta adresi veya şifre.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(pw, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Hatalı e-posta adresi veya şifre.' });
    }

    // Set last_active_at immediately on login
    await pool.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [user.id]);

    const payload = await getUserPayload(user.id);
    const token = jwt.sign({ id: payload.id, email: payload.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: payload
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ error: 'Giriş esnasında sistemsel bir hata oluştu.' });
  }
});

// ==========================================
// USER PROFILE APIs
// ==========================================

// Get Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await getUserPayload(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profil çekme hatası:', err);
    res.status(500).json({ error: 'Profil bilgileri yüklenirken hata oluştu.' });
  }
});

// Update Profile Name
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Geçerli bir isim girmelisiniz.' });
  }

  try {
    await pool.query(
      'UPDATE users SET name = $1, name_changed = true WHERE id = $2',
      [name.trim(), req.user.id]
    );
    const user = await getUserPayload(req.user.id);
    res.json(user);
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ error: 'Profil güncellenirken hata oluştu.' });
  }
});

// Simulate VIP subscription
app.post('/api/user/subscribe', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_vip = true WHERE id = $1', [req.user.id]);
    const user = await getUserPayload(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    console.error('Subscription activation error:', err);
    res.status(500).json({ error: 'Abonelik işlemi başlatılamadı.' });
  }
});

// ==========================================
// LEADERBOARD API
// ==========================================

app.get('/api/leaderboard', async (req, res) => {
  try {
    // Sort all non-admin users by points desc, id asc
    const result = await pool.query('SELECT name, points, level, solved_count FROM users WHERE is_admin = false ORDER BY points DESC, id ASC LIMIT 50');
    const countResult = await pool.query('SELECT count(*) as count FROM users WHERE is_admin = false');
    const totalUsers = parseInt(countResult.rows[0].count) || 0;
    
    const leaderboard = result.rows.map((row, idx) => ({
      rank: idx + 1,
      name: row.name,
      points: row.points,
      level: row.level,
      solved: row.solved_count
    }));
    
    res.json({
      leaderboard,
      totalUsers
    });
  } catch (err) {
    console.error('Leaderboard hatası:', err);
    res.status(500).json({ error: 'Liderlik tablosu yüklenirken hata oluştu.' });
  }
});

// Stats API
app.get('/api/stats', async (req, res) => {
  try {
    const countResult = await pool.query('SELECT count(*) as count FROM users WHERE is_admin = false');
    const totalUsers = parseInt(countResult.rows[0].count) || 0;
    
    const mentorResult = await pool.query('SELECT name FROM users WHERE email = $1 LIMIT 1', ['mentor@siberkampus.com']);
    const mentorName = mentorResult.rows.length > 0 ? mentorResult.rows[0].name : 'Siber Mentör';
    
    res.json({
      totalUsers,
      mentorName
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'İstatistik yüklenirken hata oluştu.' });
  }
});

// Heartbeat: keep the current user marked as active while they have a page open.
// authenticateToken already refreshes last_active_at, so this endpoint just acks.
app.post('/api/users/heartbeat', authenticateToken, (req, res) => {
  res.json({ ok: true });
});

// Get online users (active in the last 2 minutes)
app.get('/api/users/online', async (req, res) => {
  try {
    const result = await pool.query("SELECT name FROM users WHERE last_active_at > NOW() - INTERVAL '2 minute' ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error('Online users error:', err);
    res.status(500).json({ error: 'Online kullanıcılar yüklenirken hata oluştu.' });
  }
});

// ==========================================
// CHAT APIs
// ==========================================

// Get last 50 chat messages
app.get('/api/chat/messages', async (req, res) => {
  const isVipQuery = req.query.vip === 'true';
  let userId = null;
  
  if (isVipQuery) {
    // Validate token for VIP chat
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'VIP sohbet alanı için giriş yapmalısınız.' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
      const userCheck = await pool.query('SELECT is_vip, is_admin FROM users WHERE id = $1', [userId]);
      if (userCheck.rows.length === 0 || (!userCheck.rows[0].is_vip && !userCheck.rows[0].is_admin)) {
        return res.status(403).json({ error: 'VIP sohbet alanına sadece VIP üyeler erişebilir.' });
      }
    } catch (err) {
      return res.status(403).json({ error: 'Geçersiz oturum.' });
    }
  }

  try {
    const result = await pool.query(`
      SELECT m.id, m.message, m.created_at, m.is_vip, u.name as username, u.level, u.points
      FROM chat_messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.is_vip = $1
      ORDER BY m.created_at ASC
      LIMIT 50
    `, [isVipQuery]);

    const formatted = result.rows.map(m => {
      // Determine mock role/title based on points
      let role = 'Öğrenci';
      if (m.points > 1200) role = 'Siber Mentör';
      else if (m.points > 900) role = 'Pentester';
      else if (m.points > 700) role = 'SOC Analyst';

      const d = new Date(m.created_at);
      const t = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');

      return {
        id: m.id,
        u: m.username,
        role: role,
        t: t,
        m: m.message,
        isVip: m.is_vip,
        me: false // Frontend determines me based on username match
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Mesaj çekme hatası:', err);
    res.status(500).json({ error: 'Mesajlar yüklenirken hata oluştu.' });
  }
});

// Post a chat message
app.post('/api/chat/messages', authenticateToken, async (req, res) => {
  const { message, isVip } = req.body;
  const isVipMsg = isVip === true;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Mesaj boş olamaz.' });
  }

  try {
    // Check if banned
    const banCheck = await pool.query('SELECT is_banned, is_vip, is_admin FROM users WHERE id = $1', [req.user.id]);
    if (banCheck.rows.length > 0 && banCheck.rows[0].is_banned) {
      return res.status(403).json({ error: 'Sohbete katılımınız engellenmiştir.' });
    }

    if (isVipMsg && !banCheck.rows[0].is_vip && !banCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'VIP sohbet alanına yazabilmek için VIP üye olmalısınız.' });
    }

    const result = await pool.query(
      'INSERT INTO chat_messages (user_id, message, is_vip) VALUES ($1, $2, $3) RETURNING id, message, created_at, is_vip',
      [req.user.id, message.trim(), isVipMsg]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Mesaj kaydetme hatası:', err);
    res.status(500).json({ error: 'Mesaj gönderilirken hata oluştu.' });
  }
});

// ==========================================
// ROOMS PROGRESS & SOLVING APIs
// ==========================================

// Room Flags list (secured backend side)
const ROOM_FLAGS = {
  'web-01': 'siberkampus{sql_basic_bypass_success}',
  'web-04': 'siberkampus{reflected_xss_cookie_stolen}',
  'web-02': 'siberkampus{union_based_sqli_data_dumped}',
  'web-05': 'siberkampus{stored_xss_session_hijacked}',
  'web-06': 'siberkampus{csrf_admin_password_changed}',
  'web-03': 'siberkampus{blind_sqli_db_hash_extracted}',
  'web-07': 'siberkampus{file_upload_bypass_webshell}',
  'web-08': 'siberkampus{ssrf_internal_metadata_exposed}',
  'web-09': 'siberkampus{jwt_none_alg_bypass}',
  'web-10': 'siberkampus{web_capstone_root_compromised}',
  
  'net-01': 'siberkampus{nmap_service_scan_discovered}',
  'net-04': 'siberkampus{ssh_brute_force_credentials_cracked}',
  'net-02': 'siberkampus{arp_mitm_credentials_sniffed}',
  'net-03': 'siberkampus{eternalblue_ms17_010_exploited}',
  'net-05': 'siberkampus{dns_zone_transfer_subdomains_dumped}',
  'net-06': 'siberkampus{wpa2_handshake_cracked_keys}',
  'net-07': 'siberkampus{vlan_hopping_traffic_sniffed}',
  'net-08': 'siberkampus{pivot_socks_proxy_tunnel_established}',
  'net-09': 'siberkampus{active_directory_kerberoasting_ticket}',
  'net-10': 'siberkampus{network_compromised_domain_admin}',
  
  'sys-01': 'siberkampus{linux_command_line_basics_mastered}',
  'sys-02': 'siberkampus{suid_privesc_python_shell_achieved}',
  'sys-03': 'siberkampus{dirty_cow_kernel_compromised}',
  'sys-04': 'siberkampus{cron_job_hijack_privesc_complete}',
  'sys-05': 'siberkampus{path_variable_hijacked_tar_exploit}',
  'sys-06': 'siberkampus{windows_printspoofer_system_escalated}',
  'sys-07': 'siberkampus{stack_buffer_overflow_rip_control}',
  'sys-08': 'siberkampus{rop_chain_libc_system_bypass_nx}',
  'sys-09': 'siberkampus{container_escape_privileged_mount_breakout}',
  'sys-10': 'siberkampus{initial_access_to_root_system_compromised}'
};

// Get user progress map for rooms
app.get('/api/rooms/progress', authenticateToken, async (req, res) => {
  try {
    const solved = await pool.query('SELECT room_id, points_earned, solved_at FROM solved_rooms WHERE user_id = $1', [req.user.id]);
    const progress = await pool.query('SELECT room_id, progress_percent FROM room_progress WHERE user_id = $1', [req.user.id]);
    const hints = await pool.query('SELECT room_id, hint_index FROM unlocked_hints WHERE user_id = $1', [req.user.id]);

    const solvedList = solved.rows.map(r => r.room_id);
    
    const progressMap = {};
    progress.rows.forEach(r => {
      progressMap[r.room_id] = r.progress_percent;
    });

    const hintsMap = {};
    hints.rows.forEach(r => {
      if (!hintsMap[r.room_id]) hintsMap[r.room_id] = [];
      hintsMap[r.room_id].push(r.hint_index);
    });

    res.json({
      solved: solvedList,
      progress: progressMap,
      unlockedHints: hintsMap,
      solvedDetails: solved.rows
    });
  } catch (err) {
    console.error('İlerleme çekme hatası:', err);
    res.status(500).json({ error: 'Oda ilerlemeleri yüklenirken hata oluştu.' });
  }
});

// Update in-progress room percent
app.post('/api/rooms/progress', authenticateToken, async (req, res) => {
  const { room_id, progress_percent } = req.body;
  if (!room_id || progress_percent === undefined) {
    return res.status(400).json({ error: 'Eksik parametreler.' });
  }

  try {
    // If room is already solved, don't down-grade progress
    const isSolved = await pool.query('SELECT id FROM solved_rooms WHERE user_id = $1 AND room_id = $2', [req.user.id, room_id]);
    if (isSolved.rows.length > 0) {
      return res.json({ status: 'ignored', msg: 'Oda zaten çözüldüğü için ilerleme güncellenmedi.' });
    }

    await pool.query(
      `INSERT INTO room_progress (user_id, room_id, progress_percent, updated_at) 
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, room_id) 
       DO UPDATE SET progress_percent = GREATEST(room_progress.progress_percent, EXCLUDED.progress_percent), updated_at = NOW()`,
      [req.user.id, room_id, progress_percent]
    );

    res.json({ status: 'success' });
  } catch (err) {
    console.error('İlerleme güncelleme hatası:', err);
    res.status(500).json({ error: 'Oda ilerlemesi güncellenemedi.' });
  }
});

// Unlock hint
app.post('/api/rooms/unlock-hint', authenticateToken, async (req, res) => {
  const { room_id, hint_index } = req.body;
  if (!room_id || hint_index === undefined) {
    return res.status(400).json({ error: 'Eksik parametreler.' });
  }

  try {
    await pool.query(
      'INSERT INTO unlocked_hints (user_id, room_id, hint_index) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [req.user.id, room_id, hint_index]
    );
    res.json({ status: 'success' });
  } catch (err) {
    console.error('İpucu açma hatası:', err);
    res.status(500).json({ error: 'İpucu açılamadı.' });
  }
});

// Submit/Check flag
app.post('/api/rooms/solve', authenticateToken, async (req, res) => {
  const { room_id, flag } = req.body;
  if (!room_id || !flag) {
    return res.status(400).json({ error: 'Oda ID ve bayrak gereklidir.' });
  }

  const expectedFlag = ROOM_FLAGS[room_id];
  if (!expectedFlag) {
    return res.status(404).json({ error: 'Hedef oda sistemde kayıtlı değil.' });
  }

  if (flag.trim() !== expectedFlag) {
    return res.status(400).json({ error: 'Hatalı bayrak!' });
  }

  try {
    // Check if user already solved it
    const solvedCheck = await pool.query('SELECT id FROM solved_rooms WHERE user_id = $1 AND room_id = $2', [req.user.id, room_id]);
    if (solvedCheck.rows.length > 0) {
      return res.json({ status: 'already_solved', msg: 'Bu odayı zaten çözdünüz.' });
    }

    // Get max points of room from sk-data (handled dynamically, standard is 50/75/100/120/150 etc.)
    // Let's deduce default points by room ID prefix/suffix if not provided
    let roomBasePoints = 50;
    if (room_id.endsWith('-02') || room_id.endsWith('-05') || room_id.endsWith('-06')) roomBasePoints = 75;
    else if (room_id.endsWith('-03') || room_id.endsWith('-07')) roomBasePoints = 100;
    else if (room_id.endsWith('-08')) roomBasePoints = 120;
    else if (room_id.endsWith('-09')) roomBasePoints = 150;
    else if (room_id.endsWith('-10')) roomBasePoints = 200;

    // Get hints used count
    const hintsCount = await pool.query('SELECT count(*) as count FROM unlocked_hints WHERE user_id = $1 AND room_id = $2', [req.user.id, room_id]);
    const usedHints = parseInt(hintsCount.rows[0].count) || 0;
    const earnedPoints = Math.max(0, roomBasePoints - (usedHints) * 20);

    // Save solve
    await pool.query(
      'INSERT INTO solved_rooms (user_id, room_id, points_earned) VALUES ($1, $2, $3)',
      [req.user.id, room_id, earnedPoints]
    );

    // Clear progress status
    await pool.query('DELETE FROM room_progress WHERE user_id = $1 AND room_id = $2', [req.user.id, room_id]);

    // Fetch user current points to recalculate points, solved count, level
    const userResult = await pool.query('SELECT points, solved_count, level FROM users WHERE id = $1', [req.user.id]);
    const oldUser = userResult.rows[0];

    const newPoints = oldUser.points + earnedPoints;
    const newSolvedCount = oldUser.solved_count + 1;
    const newLevel = Math.min(10, Math.max(oldUser.level, Math.floor(newPoints / 100)));

    // Update user stats
    await pool.query(
      'UPDATE users SET points = $1, solved_count = $2, level = $3 WHERE id = $4',
      [newPoints, newSolvedCount, newLevel, req.user.id]
    );

    const userPayload = await getUserPayload(req.user.id);

    res.json({
      status: 'success',
      earned: earnedPoints,
      user: {
        points: userPayload.points,
        solved_count: userPayload.solved_count,
        level: userPayload.level,
        rank_val: userPayload.rank_val
      }
    });
  } catch (err) {
    console.error('Oda çözme hatası:', err);
    res.status(500).json({ error: 'Bayrak onaylanırken sunucuda bir hata oluştu.' });
  }
});

// ==========================================
// BLOG APIs
// ==========================================

// Get all blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, slug, excerpt, category, author, read_time, created_at FROM blogs ORDER BY created_at DESC');
    const blogs = result.rows.map(b => {
      const d = new Date(b.created_at);
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        category: b.category,
        author: b.author,
        readTime: b.read_time,
        date: dateStr
      };
    });
    res.json(blogs);
  } catch (err) {
    console.error('Blog listesi hatası:', err);
    res.status(500).json({ error: 'Blog listesi yüklenirken hata oluştu.' });
  }
});

// Get blog detail by slug (public)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Makale bulunamadı.' });
    }
    const b = result.rows[0];
    const d = new Date(b.created_at);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    res.json({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      category: b.category,
      author: b.author,
      readTime: b.read_time,
      date: dateStr
    });
  } catch (err) {
    console.error('Blog detayı hatası:', err);
    res.status(500).json({ error: 'Blog detayı yüklenirken hata oluştu.' });
  }
});

// Create a new blog post (authenticated, admin only)
app.post('/api/blogs', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const { title, excerpt, content, category, author, readTime } = req.body;
    if (!title || !content || !category || !author) {
      return res.status(400).json({ error: 'Lütfen zorunlu alanları doldurun.' });
    }

    const slug = title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const result = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content, category, author, read_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, slug, excerpt || '', content, category, author, readTime || '5 dk']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Blog oluşturma hatası:', err);
    res.status(500).json({ error: 'Blog oluşturulurken hata oluştu.' });
  }
});

// ==========================================
// ADMIN APIs
// ==========================================

// Get all users list (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const query = `
      WITH ranked_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, id ASC) as dynamic_rank
        FROM users
        WHERE is_admin = false
      )
      SELECT u.id, u.name, u.email, u.points, u.solved_count, u.level,
             COALESCE(r.dynamic_rank, 1) as rank_val,
             u.badges, u.streak, u.is_admin, u.is_banned, u.is_vip, u.created_at
      FROM users u
      LEFT JOIN ranked_users r ON u.id = r.id
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Kullanıcı listesi hatası:', err);
    res.status(500).json({ error: 'Kullanıcı listesi yüklenirken hata oluştu.' });
  }
});

// Toggle user ban status (admin only)
app.put('/api/admin/users/:id/ban', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Kendinizi banlayamazsınız.' });
    }

    const user = await pool.query('SELECT is_banned FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const newStatus = !user.rows[0].is_banned;
    await pool.query('UPDATE users SET is_banned = $1 WHERE id = $2', [newStatus, userId]);

    res.json({ success: true, is_banned: newStatus });
  } catch (err) {
    console.error('Kullanıcı banlama hatası:', err);
    res.status(500).json({ error: 'Kullanıcı ban durumu güncellenirken hata oluştu.' });
  }
});

// Toggle user VIP status (admin only)
app.put('/api/admin/users/:id/vip', authenticateToken, async (req, res) => {
  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const userId = parseInt(req.params.id);
    const user = await pool.query('SELECT is_vip FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const nextVip = !user.rows[0].is_vip;
    await pool.query('UPDATE users SET is_vip = $1 WHERE id = $2', [nextVip, userId]);
    res.json({ success: true, is_vip: nextVip });
  } catch (err) {
    console.error('Kullanıcı VIP hatası:', err);
    res.status(500).json({ error: 'Kullanıcı VIP durumu güncellenirken hata oluştu.' });
  }
});

// Delete a blog post (admin only)
app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const blogId = parseInt(req.params.id);
    await pool.query('DELETE FROM blogs WHERE id = $1', [blogId]);

    res.json({ success: true });
  } catch (err) {
    console.error('Blog silme hatası:', err);
    res.status(500).json({ error: 'Blog silinirken hata oluştu.' });
  }
});

// ==========================================
// SPA ROUTING FALLBACK
// ==========================================
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// INIT DATABASE AND SEED DATA
// ==========================================
async function initDatabase() {
  try {
    console.log('⏳ Veritabanı şeması doğrulanıyor...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'db_schema.sql'), 'utf8');
    await pool.query(schemaSql);
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE');
    await pool.query('ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE');
    console.log('✓ Veritabanı şeması hazır.');

    // Check if we need to seed data
    const usersCount = await pool.query('SELECT count(*) FROM users');
    if (parseInt(usersCount.rows[0].count) === 0) {
      console.log('🌱 Veritabanı boş, admin kullanıcısı ekleniyor...');
      
      const mentorPwHash = await bcrypt.hash('mentor123', 10);

      // Only seed the admin user Siber Mentör
      await pool.query(`
        INSERT INTO users (email, password_hash, name, points, solved_count, level, is_admin) VALUES 
        ('mentor@siberkampus.com', $1, 'Siber Mentör', 0, 0, 1, true)
      `, [mentorPwHash]);

      console.log('✓ Admin kullanıcısı başarıyla eklendi.');
    }

    // Seed default blogs if empty
    const blogsCount = await pool.query('SELECT count(*) FROM blogs');
    if (parseInt(blogsCount.rows[0].count) === 0) {
      console.log('🌱 Veritabanı blogs tablosu boş, varsayılan makaleler ekleniyor...');
      await pool.query(`
        INSERT INTO blogs (title, slug, excerpt, content, category, author, read_time) VALUES
        ('SQLi ile Veritabanına Sızmak', 'sqli-ile-veritabanina-sizmak', 
         'SQL Injection saldırılarının temelini ve gerçek dünyada nasıl kullanıldığını adım adım öğren.', 
         'Siber güvenlik alanındaki SQL Injection (SQLi), saldırganların veri tabanı sorgularını manipüle etmelerine olanak tanıyan en kritik zafiyetlerden biridir. Giriş alanlarına filtre edilmemiş SQL ifadeleri yerleştirilerek kullanıcı doğrulama mekanizmaları aşılabilir, veri tabanındaki tüm tablolar dökülebilir veya sunucuda komut koşturulabilir.',
         'Web Güvenliği', 'Ahmet Yılmaz', '8 dk'),
        ('Reverse Shell ve Backdoor Teknikleri', 'reverse-shell-ve-backdoor-teknikleri',
         'Sistem ele geçirildikten sonra kalıcı erişim sağlamanın yöntemlerini keşfet.',
         'Hedef sistem üzerinde kod çalıştırıldıktan sonra, saldırganın sistemle sürekli iletişim halinde kalabilmesi için reverse shell (tersine kabuk) veya backdoor (arka kapı) kurulması gerekir. Bu makalede kalıcı erişim elde etmenin yöntemlerini ve tespit mekanizmalarını inceleyeceğiz.',
         'Post-Exploitation', 'Zeynep Kara', '12 dk'),
        ('Linux Ayrıcalık Yükseltme Rehberi', 'linux-ayricalik-yukseltme-rehberi',
         'Sınırlı kullanıcı hesabından root erişimi almak için kullanılan yöntemler.',
         'Linux sistemlerde sızma sonrasında düşük yetkili bir kullanıcıdan tam yetkili root kullanıcısına geçiş aşaması "Privilege Escalation" olarak adlandırılır. SUID dosyaları, cron görevleri ve kernel zafiyetleri (örneğin Dirty COW) ayrıcalık yükseltmek için en sık sömürülen alanlardır.',
         'Privilege Escalation', 'Can Demir', '15 dk'),
        ('Phishing Kampanyalarını Analiz Etmek', 'phishing-kampanyalarini-analiz-etmek',
         'Sosyal mühendislik saldırılarının anatomisi ve savunma mekanizmaları.',
         'Sosyal mühendislik, insan faktörünü hedef alarak kurumların en zayıf halkasını sömürmeyi hedefler. Phishing (oltalama) kampanyaları, sahte e-postalar ve giriş sayfalarıyla kullanıcı şifrelerini çalmak için kullanılır. Makalemizde bu kampanyaların nasıl analiz edileceğini göreceğiz.',
         'Sosyal Mühendislik', 'Fatih Eren', '10 dk'),
        ('XSS Saldırılarından Korunma', 'xss-saldirilarindan-korunma',
         'Tarayıcı tabanlı saldırıların çeşitleri ve web uygulamalarını güvenli hale getirme.',
         'Cross-Site Scripting (XSS), tarayıcı taraflı enjeksiyon zafiyetidir. Reflected, Stored ve DOM-based olmak üzere 3 temel türü vardır. JavaScript kodlarının kurbanın tarayıcısında çalıştırılmasıyla oturum çerezleri (cookies) çalınabilir veya sahte yönlendirmeler yapılabilir. Korunmak için girdi sanitizasyonu ve CSP şarttır.',
         'Web Güvenliği', 'Selin Öz', '9 dk'),
        ('Kriptografi Temel Kavramları', 'kriptografi-temel-kavramlari',
         'Şifreleme algoritmaları, anahtarlar ve modern kriptografi yöntemleri.',
         'Kriptografi, verinin gizliliğini, bütünlüğünü ve kimlik doğrulamasını sağlamak için matematiksel algoritmalar kullanan bilim dalıdır. Simetrik ve asimetrik şifreleme yöntemleri, hash fonksiyonları ve SSL/TLS protokolleri siber güvenliğin bel kemiğini oluşturur.',
         'Kriptografi', 'Murat Sönmez', '11 dk')
      `);
      console.log('✓ Varsayılan makaleler eklendi.');
    }
  } catch (err) {
    console.error('Veritabanı başlatma hatası:', err);
  }
}

// Start Server after DB Check
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Express yerel sunucu basariyla baslatildi!`);
      console.log(`   Siber Kampus sitesine erismek icin tiklayin:`);
      console.log(`   👉 http://localhost:${PORT}/index.html (Dinamik React Sürümü)`);
      console.log(`   👉 http://localhost:${PORT}/siberkampus%20Anasayfa.html (Statik Landing Page)\n`);
      console.log(`Kapatmak için terminalde Ctrl+C tuşlarına basın.\n`);
    });
  });
} else {
  initDatabase();
}

module.exports = app;
