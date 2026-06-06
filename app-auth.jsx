/* ===========================================================================
   siberkampus — Authenticated app pages (separate Babel scope)
   Loads AFTER app.jsx. Pulls shared bits from window, registers its pages
   into the global registry window.__SK_PAGES.
   =========================================================================== */
const { useState, useRef, useEffect, useMemo } = React;
const SKFooter = window.SKFooter;
const PAGES = (window.__SK_PAGES = window.__SK_PAGES || {});

// Reactive user state — shared across all auth pages via window
function getDynamicBadges(user, solvedList) {
  const webSolved = solvedList.filter(id => id.startsWith('web-')).length;
  const netSolved = solvedList.filter(id => id.startsWith('net-')).length;
  const sysSolved = solvedList.filter(id => id.startsWith('sys-')).length;
  const totalSolved = solvedList.length;

  const solvedDetails = JSON.parse(localStorage.getItem('sk_solved_details') || '[]');
  const solvedAtNight = solvedDetails.some(s => {
    if (!s.solved_at) return false;
    const hour = new Date(s.solved_at).getHours();
    return hour >= 2 && hour < 5;
  });

  const list = [
    { icon: '🥇', name: 'Hacker Başlangıcı', desc: 'İlk laboratuvarını çöz', done: totalSolved >= 1, when: totalSolved >= 1 ? 'Aktif' : 'Kilitli' },
    { icon: '🔥', name: '7 Gün Seri', desc: '7 gün üst üste giriş yap', done: user.streak >= 7, when: user.streak >= 7 ? 'Aktif' : 'Kilitli' },
    { icon: '🌐', name: 'Web Avcısı', desc: '5 web görevini tamamla', done: webSolved >= 5, when: webSolved >= 5 ? 'Aktif' : 'Kilitli' },
    { icon: '⚡', name: 'Hızlı Parmaklar', desc: 'Bir görevi tamamla', done: totalSolved >= 2, when: totalSolved >= 2 ? 'Aktif' : 'Kilitli' },
    { icon: '🔓', name: 'İlk Kan', desc: 'Bir bayrağı yakala', done: totalSolved >= 3, when: totalSolved >= 3 ? 'Aktif' : 'Kilitli' },
    { icon: '📡', name: 'Ağ Takipçisi', desc: '5 ağ görevi tamamla', done: netSolved >= 5, when: netSolved >= 5 ? 'Aktif' : 'Kilitli' },
    { icon: '⭐', name: 'Uzman Seviyesi', desc: 'Level 8\'e ulaş', done: user.level >= 8, when: user.level >= 8 ? 'Aktif' : 'Kilitli', prog: `${user.level || 1}/8` },
    { icon: '🏆', name: "İlk 50'de", desc: 'Liderlik tablosunda ilk 50', done: user.rank <= 50, when: user.rank <= 50 ? 'Aktif' : 'Kilitli', prog: `#${user.rank || 1000}` },
    { icon: '🎯', name: 'CTF Mimarı', desc: '5 CTF zincirini tamamla', done: totalSolved >= 15, when: totalSolved >= 15 ? 'Aktif' : 'Kilitli', prog: `${totalSolved}/15` },
    { icon: '🌙', name: 'Gece Kuşu', desc: 'Gece 02:00\'de görev çöz', done: solvedAtNight, when: solvedAtNight ? 'Aktif' : 'Kilitli', prog: solvedAtNight ? '1/1' : '0/1' },
    { icon: '🛡️', name: 'Savunmacı', desc: 'Blue team görevlerini bitir', done: false, when: 'Kilitli', prog: '0/6' },
    { icon: '👑', name: 'Efsane', desc: '100.000 puana ulaş', done: user.points >= 10000, when: user.points >= 10000 ? 'Aktif' : 'Kilitli', prog: user.points || 0 },
    { icon: '💀', name: 'Root Master', desc: '10 sisteme root ol', done: sysSolved >= 10, when: sysSolved >= 10 ? 'Aktif' : 'Kilitli', prog: `${sysSolved}/10` },
    { icon: '🏅', name: '30 Gün Seri', desc: '30 gün üst üste giriş yap', done: user.streak >= 30, when: user.streak >= 30 ? 'Aktif' : 'Kilitli', prog: `${user.streak || 1}/30` },
  ];

  const earnedOthersCount = list.filter(b => b.done).length;
  list.push({
    icon: '💎',
    name: 'Tam Koleksiyon',
    desc: 'Tüm rozetleri kazan',
    done: earnedOthersCount === 14,
    when: earnedOthersCount === 14 ? 'Aktif' : 'Kilitli',
    prog: `${earnedOthersCount}/14`
  });

  return list;
}
window.getDynamicBadges = getDynamicBadges;

function syncUserFromLocalStorage() {
  const token = localStorage.getItem('sk_token');
  
  if (!window.__SK_USER) {
    window.__SK_USER = {};
  }

  if (!token) {
    Object.assign(window.__SK_USER, {
      name: 'Misafir',
      handle: 'misafir',
      avatar: 'MS',
      points: 0,
      rank: 1000,
      level: 1,
      maxLevel: 10,
      solved: 0,
      badges: 0,
      streak: 1,
      nameChanged: false,
      is_admin: false,
      is_banned: false,
      is_premium: false,
      subscription: 'free',
    });
    return;
  }
  
  const name = localStorage.getItem('sk_user_name') || 'Yeni Kullanıcı';
  const tempUser = {
    name: name,
    handle: name.replace(/\s+/g, ''),
    avatar: name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase(),
    points: parseInt(localStorage.getItem('sk_user_points')) || 0,
    rank: parseInt(localStorage.getItem('sk_user_rank')) || 1000,
    level: parseInt(localStorage.getItem('sk_user_level')) || 1,
    maxLevel: 10,
    solved: parseInt(localStorage.getItem('sk_user_solved')) || 0,
    streak: parseInt(localStorage.getItem('sk_user_streak')) || 1,
    nameChanged: localStorage.getItem('sk_name_changed') === '1',
    is_admin: localStorage.getItem('sk_user_is_admin') === 'true',
    is_banned: localStorage.getItem('sk_user_is_banned') === 'true',
    is_premium: localStorage.getItem('sk_user_is_premium') === 'true',
    subscription: localStorage.getItem('sk_user_subscription') || 'free',
  };
  
  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  const badgeCount = getDynamicBadges(tempUser, solvedList).filter(b => b.done).length;
  tempUser.badges = badgeCount;
  
  Object.assign(window.__SK_USER, tempUser);
}

// Initialize on load
syncUserFromLocalStorage();

function useUser() {
  const [, rerender] = useState(0);
  
  const update = async (patch) => {
    if (patch.name !== undefined) localStorage.setItem('sk_user_name', patch.name);
    if (patch.nameChanged !== undefined) localStorage.setItem('sk_name_changed', patch.nameChanged ? '1' : '0');
    if (patch.points !== undefined) localStorage.setItem('sk_user_points', patch.points);
    if (patch.solved !== undefined) localStorage.setItem('sk_user_solved', patch.solved);
    if (patch.level !== undefined) localStorage.setItem('sk_user_level', patch.level);
    if (patch.rank !== undefined) localStorage.setItem('sk_user_rank', patch.rank);
    if (patch.badges !== undefined) localStorage.setItem('sk_user_badges', patch.badges);
    if (patch.streak !== undefined) localStorage.setItem('sk_user_streak', patch.streak);
    if (patch.is_admin !== undefined) localStorage.setItem('sk_user_is_admin', patch.is_admin ? 'true' : 'false');
    if (patch.is_banned !== undefined) localStorage.setItem('sk_user_is_banned', patch.is_banned ? 'true' : 'false');
    if (patch.is_premium !== undefined) localStorage.setItem('sk_user_is_premium', patch.is_premium ? 'true' : 'false');
    if (patch.subscription !== undefined) localStorage.setItem('sk_user_subscription', patch.subscription);

    if (patch.name) {
      const token = localStorage.getItem('sk_token');
      if (token) {
        try {
          await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: patch.name })
          });
        } catch (e) {
          console.error("Profil güncellenemedi:", e);
        }
      }
    }
    
    syncUserFromLocalStorage();
    window.dispatchEvent(new Event('sk_user_update'));
  };

  useEffect(() => {
    const fetchFromDB = () => {
      const token = localStorage.getItem('sk_token');
      if (!token || window.__SK_USER_FETCHED) return;
      window.__SK_USER_FETCHED = true;
      
      // Fetch User Info
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          update({
            name: data.name,
            points: data.points,
            solved: data.solved_count,
            level: data.level,
            rank: data.rank_val,
            badges: data.badges,
            streak: data.streak,
            nameChanged: data.name_changed,
            is_admin: data.is_admin,
            is_banned: data.is_banned,
            is_premium: data.is_premium || false,
            subscription: data.subscription || 'free'
          });
        }
      })
      .catch(err => console.error("Kullanıcı profili senkronizasyon hatası:", err));

      // Fetch Rooms Progress
      fetch('/api/rooms/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          localStorage.setItem('sk_solved_rooms', JSON.stringify(data.solved));
          localStorage.setItem('sk_solved_details', JSON.stringify(data.solvedDetails || []));
          localStorage.setItem('sk_room_progress', JSON.stringify(data.progress));
          localStorage.setItem('sk_unlocked_hints', JSON.stringify(data.unlockedHints));
          syncUserFromLocalStorage();
          rerender(n => n + 1);
        }
      })
      .catch(err => console.error("Kullanıcı ilerlemesi senkronizasyon hatası:", err));
    };

    const handler = () => {
      syncUserFromLocalStorage();
      rerender(n => n + 1);
      // Login/register sonrası __SK_USER_FETCHED false ise DB'den çek
      fetchFromDB();
    };
    window.addEventListener('sk_user_update', handler);

    // İlk mount'ta da kontrol et
    fetchFromDB();

    return () => window.removeEventListener('sk_user_update', handler);
  }, []);

  return [window.__SK_USER, update];
}

const ME = window.__SK_USER;

/* ============ AUTHENTICATED NAVBAR ============ */
const AppHeader = ({ navigate, active }) => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useUser();
  const nav = [['Dashboard', 'dashboard', '▣'], ['Leaderboard', 'leaderboard', '🏆'], ['Sohbet', 'chat', '💬']];
  if (user && user.is_admin) {
    nav.push(['Yönetim Paneli', 'admin', '⚙️']);
  }
  return (
    <header className="sticky top-0 z-50 bg-[rgba(2,8,6,.88)] backdrop-blur-md border-b border-[#0c2719]">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-[64px]">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('dashboard')} className="flex items-center gap-2.5 font-disp font-bold text-lg text-[#eafff5]">
            <span className="w-[30px] h-[30px] border-[1.5px] border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-[13px] font-bold shadow-[0_0_14px_-4px_var(--glow)]">&gt;_</span>
            siber<b className="text-[#00ff88]">kampus</b>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(([t, p, ic]) => (
              <button key={p} onClick={() => navigate(p)} className={"px-3.5 py-2 rounded-lg text-sm font-mono transition-colors flex items-center gap-2 " + (active === p ? 'text-[#00ff88] bg-[rgba(0,255,136,.06)]' : 'text-[#74998a] hover:text-[#cdeede]')}>
                <span className="text-xs">{ic}</span>{t}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#103a26] bg-[rgba(0,255,136,.03)]">
            <span className="text-[#00ff88] text-sm">◆</span>
            <span className="font-mono text-sm text-[#eafff5] font-bold">{user.points}</span>
            <span className="text-xs text-[#74998a]">puan</span>
          </div>
          <div className="relative">
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border border-[#103a26] hover:border-[#00ff88] transition-colors">
              <span className="w-7 h-7 rounded-md grid place-items-center text-[#5cffba] font-bold text-xs border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{user.avatar}</span>
              <span className="hidden sm:inline text-sm text-[#cdeede] font-mono">{user.name}</span>
              <span className="text-[#74998a] text-[10px]">▼</span>
            </button>
            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-[#04100a] border border-[#103a26] rounded-lg p-1.5 shadow-[0_20px_50px_-20px_#000] z-50">
                {[['Profilim', 'profile'], ['Rozetlerim', 'badges'], ['Sertifikalarım', 'certificates']].map(([t, p], i) => (
                  <button key={i} onClick={() => { setOpen(false); navigate(p); }} className="w-full text-left px-3 py-2 rounded-md text-sm text-[#74998a] hover:text-[#cdeede] hover:bg-[rgba(0,255,136,.04)] transition-colors">{t}</button>
                ))}
                <div className="h-px bg-[#0c2719] my-1.5"></div>
                <button onClick={() => { 
                  setOpen(false); 
                  localStorage.removeItem('sk_token');
                  localStorage.removeItem('sk_user_name');
                  localStorage.removeItem('sk_user_points');
                  localStorage.removeItem('sk_user_solved');
                  localStorage.removeItem('sk_user_level');
                  localStorage.removeItem('sk_user_rank');
                  localStorage.removeItem('sk_name_changed');
                  localStorage.removeItem('sk_user_badges');
                  localStorage.removeItem('sk_user_streak');
                  localStorage.removeItem('sk_solved_rooms');
                  localStorage.removeItem('sk_room_progress');
                  localStorage.removeItem('sk_unlocked_hints');
                  localStorage.removeItem('sk_user_is_admin');
                  localStorage.removeItem('sk_user_is_banned');
                  window.__SK_USER_FETCHED = false;
                  Object.assign(window.__SK_USER, {
                    name: 'Misafir',
                    handle: 'misafir',
                    avatar: 'MS',
                    points: 0,
                    rank: 1000,
                    level: 1,
                    maxLevel: 10,
                    solved: 0,
                    badges: 0,
                    streak: 1,
                    nameChanged: false,
                    is_admin: false,
                    is_banned: false,
                    is_premium: false,
                    subscription: 'free'
                  });
                  window.dispatchEvent(new Event('sk_user_update'));
                  navigate('home'); 
                }} className="w-full text-left px-3 py-2 rounded-md text-sm text-[#ff2e88] hover:bg-[rgba(255,46,136,.06)] transition-colors">Çıkış Yap</button>
              </div>
            )}
          </div>
          
          <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all">
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0c2719] bg-[#04100a] px-6 py-4 flex flex-col gap-2">
          {nav.map(([t, p, ic]) => (
            <button key={p} onClick={() => { setMobileMenuOpen(false); navigate(p); }} className={`w-full text-left py-2.5 px-4 rounded-lg text-sm font-mono flex items-center gap-3 transition-colors ${active === p ? 'text-[#00ff88] bg-[rgba(0,255,136,.06)]' : 'text-[#74998a] hover:text-[#cdeede]'}`}>
              <span>{ic}</span>{t}
            </button>
          ))}
          <div className="sm:hidden mt-2 p-3 border border-[#103a26] bg-[rgba(0,255,136,.03)] rounded flex items-center justify-between text-xs">
            <span className="text-[#74998a]">Toplam Puan:</span>
            <span className="font-mono font-bold text-[#00ff88]">◆ {user.points}</span>
          </div>
        </div>
      )}
    </header>
  );
};

const SectionLabel = ({ children }) => (
  <span className="font-mono text-[12px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5 mb-4"><span className="text-[#3d564b] font-bold">//</span> {children}</span>
);

/* ============ DASHBOARD ============ */
const DashboardPage = ({ navigate, data }) => {
  const [user, updateUser] = useUser();

  useEffect(() => {
    if (data && data.scrollTo === 'categories') {
      setTimeout(() => {
        document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [data]);

  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  const progressMap = JSON.parse(localStorage.getItem('sk_room_progress') || '{}');
  const inProgress = window.SK_ALL_ROOMS
    .map(r => ({
      ...r,
      progress: progressMap[r.id] || 0
    }))
    .filter(r => r.progress > 0 && r.progress < 100);

  const categories = window.SK_CATEGORIES.map(c => {
    const solvedInCat = c.rooms.filter(r => solvedList.includes(r.id)).length;
    return {
      ...c,
      count: c.rooms.length,
      solvedCount: solvedInCat
    };
  });
  const dynamicBadges = window.getDynamicBadges ? window.getDynamicBadges(user, solvedList) : [];
  const badges = dynamicBadges.slice(0, 7);

  // daily activity chart (last 14 days)
  const solvedDetails = JSON.parse(localStorage.getItem('sk_solved_details') || '[]');
  let daily = Array(14).fill(0);
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const targetDate = new Date(now.getTime() - (13 - i) * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    let pointsSum = 0;
    solvedDetails.forEach(s => {
      if (s.solved_at) {
        const solvedTime = new Date(s.solved_at).getTime();
        if (solvedTime >= startOfDay.getTime() && solvedTime <= endOfDay.getTime()) {
          pointsSum += s.points_earned;
        }
      }
    });
    daily[i] = pointsSum;
  }
  const dayLabels = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz','Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const w = 620, h = 160, pad = 8;
  const max = Math.max(...daily), min = Math.min(...daily);
  const pts = daily.map((val, i) => {
    const x = pad + (i * (w - pad * 2)) / 13;
    const y = h - pad - (max > 0 ? (val / max) * (h - pad * 2) : 0);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${(w - pad).toFixed(1)} ${h - pad} L${pad} ${h - pad} Z`;

  return (
    <>
      <AppHeader navigate={navigate} active="dashboard" />
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        {/* welcome */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="font-mono text-sm text-[#74998a] mb-1">root@siberkampus: <span className="text-[#00ff88]">~/dashboard</span></p>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5]">Hoş geldin, <span className="text-[#00ff88]">{user.name}</span></h1>
            </div>
          </div>
          <button onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-6 py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Yeni Görev Başlat →</button>
        </div>

        {/* summary + goals */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 mb-10">
          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <SectionLabel>Özet İstatistik</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { l: 'Toplam Puan', v: user.points, c: '#00ff88' },
                { l: 'Sıralama', v: '#' + user.rank, c: '#eafff5' },
                { l: 'Çözülen Görev', v: user.solved, c: '#eafff5' },
                { l: 'Level', v: user.level + '/' + user.maxLevel, c: '#5cffba' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-disp font-bold text-3xl tracking-tight" style={{ color: s.c, textShadow: s.c === '#00ff88' ? '0 0 22px rgba(0,255,136,.3)' : 'none' }}>{s.v}</div>
                  <div className="text-xs text-[#74998a] mt-1.5 tracking-wide">{s.l}</div>
                </div>
              ))}
            </div>
            {/* level progress */}
            <div className="mt-6 pt-5 border-t border-[#0c2719]">
              <div className="flex justify-between text-xs text-[#74998a] mb-2"><span>Level {user.level} ilerlemesi</span><span className="text-[#00ff88]">{user.points % 100}%</span></div>
              <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88] shadow-[0_0_12px_var(--glow)]" style={{ width: (user.points % 100) + '%' }}></div></div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <SectionLabel>Hedefler</SectionLabel>
            <div className="space-y-4">
              {[
                { l: 'Bu ay kazanılan', v: '+' + user.points + ' puan', ic: '📈' },
                { l: 'Toplam rozet', v: user.badges + ' / 32', ic: '🏅' },
                { l: 'Günlük seri', v: user.streak + ' gün 🔥', ic: '⚡' },
              ].map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-[#04100a] border border-[#0c2719]">
                  <span className="flex items-center gap-3 text-sm text-[#74998a]"><span>{g.ic}</span>{g.l}</span>
                  <span className="font-mono text-sm font-bold text-[#eafff5]">{g.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* recommendations or in progress */}
        <div className="mb-10">
          <h2 className="text-2xl text-[#eafff5] mb-5">{inProgress.length > 0 ? 'Başlanmış Görevler' : 'Sana Uygun Görevler'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {inProgress.length > 0 ? (
              inProgress.map((t, i) => (
                <div key={i} className="rounded-xl border border-[#0c2719] p-6 hover:border-[#00ff88] transition-all group" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2"><span className="text-lg">🎮</span><h3 className="text-lg text-[#eafff5] group-hover:text-[#00ff88] transition-colors" style={{ lineHeight: 1.25 }}>{t.name}</h3></div>
                      <span className="text-xs text-[#74998a]">{t.cat}</span>
                    </div>
                    <span className="font-mono text-sm text-[#ffd166]">{'⭐'.repeat(t.stars || 2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#74998a] mb-2"><span>İlerleme</span><span className="text-[#00ff88]">{t.progress}%</span></div>
                  <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden mb-5"><div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88]" style={{ width: t.progress + '%' }}></div></div>
                  <button onClick={() => navigate('roomArticle', t)} className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all">Devam Et →</button>
                </div>
              ))
            ) : (
              (() => {
                const allRooms = window.SK_ALL_ROOMS || [];
                const solved = solvedList;
                const unsolvedBeginnerRooms = allRooms.filter(r => r.difficulty === 'Başlangıç' && !solved.includes(r.id)).slice(0, 2);
                return unsolvedBeginnerRooms.length > 0 ? (
                  unsolvedBeginnerRooms.map((t, i) => (
                    <div key={i} className="rounded-xl border border-[#0c2719] p-6 hover:border-[#5cffba] transition-all group" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2"><span className="text-lg">💡</span><h3 className="text-lg text-[#eafff5] group-hover:text-[#5cffba] transition-colors" style={{ lineHeight: 1.25 }}>{t.name}</h3></div>
                          <span className="text-xs text-[#74998a]">{t.catSlug === 'web-exploitation' ? '🌐 Web' : t.catSlug === 'network-pentest' ? '🔗 Ağ' : '💻 Sistem'}</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-[#5cffba]/10 text-[#5cffba] border border-[#5cffba]/20">Yeni</span>
                      </div>
                      <p className="text-xs text-[#74998a] mb-4">{t.desc}</p>
                      <div className="flex items-center justify-between text-xs text-[#3d564b]">
                        <span>◆ {t.points} Puan</span>
                        <span>👥 {(t.users || 0).toLocaleString('tr-TR')}</span>
                      </div>
                      <button onClick={() => navigate('roomArticle', t)} className="w-full font-mono text-sm font-bold text-[#021008] bg-[#5cffba] py-2.5 rounded-lg hover:shadow-[0_0_24px_-4px_rgba(92,255,186,.4)] transition-all mt-4">Başla →</button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center border border-dashed border-[#103a26] rounded-xl bg-[#020806]/40">
                    <span className="text-3xl block mb-2">🎓</span>
                    <p className="text-sm text-[#74998a] mb-1">Harika! Başlangıç seviyesi görevlerin hepsi çözülmüş.</p>
                    <button onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-xs text-[#00ff88] hover:underline">Orta seviye görevlere geç →</button>
                  </div>
                );
              })()
            )}
          </div>
        </div>

        {/* categories */}
        <div id="categories-section" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl text-[#eafff5] mb-5">Kategori Seç & Başla</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <button key={i} onClick={() => navigate('category', c)} className="text-left rounded-xl border border-[#0c2719] p-6 hover:border-[#00ff88] hover:-translate-y-1 transition-all group" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-11 h-11 rounded-lg grid place-items-center text-xl border border-[#103a26] bg-[rgba(0,255,136,.04)]">{c.icon}</span>
                  <span className="font-mono text-xs text-[#3d564b] group-hover:text-[#00ff88] transition-colors">→</span>
                </div>
                <h3 className="text-[15px] text-[#eafff5] mb-1 group-hover:text-[#00ff88] transition-colors">{c.name}</h3>
                <p className="text-xs text-[#74998a]">{c.solvedCount} / {c.count} tamamlandı</p>
              </button>
            ))}
          </div>
        </div>

        {/* badges + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-5">
          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <SectionLabel>Rozetler & Başarımlar</SectionLabel>
            <div className="space-y-2.5">
              {badges.map((b, i) => (
                <div key={i} className={"flex items-center justify-between p-3 rounded-lg border " + (b.done ? 'border-[#103a26] bg-[rgba(0,255,136,.03)]' : 'border-[#0c2719] opacity-60')}>
                  <span className="flex items-center gap-3"><span className="text-lg grayscale-0" style={{ filter: b.done ? 'none' : 'grayscale(1)' }}>{b.icon}</span><span className={"text-sm " + (b.done ? 'text-[#eafff5]' : 'text-[#74998a]')}>{b.name}</span></span>
                  <span className={"font-mono text-xs " + (b.done ? 'text-[#00ff88]' : 'text-[#3d564b]')}>{b.done ? '✓ ' + b.when : '✗ ' + b.when}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5 pt-5 border-t border-[#0c2719]">
              <button onClick={() => navigate('badges')} className="flex-1 text-xs text-[#cdeede] border border-[#103a26] py-2.5 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Tüm Rozetler →</button>
              <button onClick={() => navigate('certificates')} className="flex-1 text-xs text-[#cdeede] border border-[#103a26] py-2.5 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Sertifikalarım →</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <SectionLabel>Günlere Göre Aktivite</SectionLabel>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-disp font-bold text-3xl text-[#00ff88]">+{daily.reduce((a, b) => a + b, 0)}</span>
              <span className="text-xs text-[#74998a]">son 14 günde kazanılan puan</span>
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
              <defs>
                <linearGradient id="actFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g, i) => (<line key={i} x1={pad} x2={w - pad} y1={pad + g * (h - pad * 2)} y2={pad + g * (h - pad * 2)} stroke="#0c2719" strokeWidth="1" />))}
              <path d={area} fill="url(#actFill)" />
              <path d={line} fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,.5))' }} />
              {pts.map((p, i) => (<circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2.5} fill={i === pts.length - 1 ? '#eafff5' : '#00ff88'} />))}
            </svg>
            <div className="flex justify-between mt-2 text-[10px] text-[#3d564b] font-mono px-1">
              {dayLabels.map((m, i) => (<span key={i} className={i % 2 ? 'opacity-0 md:opacity-100' : ''}>{m}</span>))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#0c2719] my-6"></div>

            {/* Weekly Target / Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="text-[11px] text-[#74998a] mb-2.5 font-mono">// HAFTALIK HEDEF</div>
                <div className="rounded-xl border border-[#103a26] p-4 bg-[#020806]/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[#eafff5] font-medium">3 Web Görevi Çöz</span>
                    <span className="text-xs font-mono text-[#00ff88] font-bold">{(() => {
                      const webSolvedCount = solvedList.filter(id => id.startsWith('web-')).length;
                      return `${webSolvedCount % 3}/3`;
                    })()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" style={{ width: `${Math.min(100, (solvedList.filter(id => id.startsWith('web-')).length % 3) * 33.3)}%` }}></div>
                  </div>
                  <div className="text-[11px] text-[#74998a]">Ödül: <span className="text-[#5cffba] font-mono font-bold">◆ {50 * (Math.floor(solvedList.filter(id => id.startsWith('web-')).length / 3) + 1)} Puan</span></div>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#74998a] mb-2.5 font-mono">// AKTİVİTE ANALİZİ</div>
                <div className="rounded-xl border border-[#103a26] p-4 bg-[#020806]/40 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#74998a]">En Aktif Gün</span>
                    <span className="text-[#eafff5] font-mono font-bold">{user.streak > 0 && solvedList.length > 0 ? ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'][new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] : 'Veri yok'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#74998a]">Çözüm Oranı</span>
                    <span className={"font-mono font-bold " + (solvedList.length > 0 ? 'text-[#00ff88]' : 'text-[#3d564b]')}>{solvedList.length > 0 ? '+%' + Math.min(99, Math.round(solvedList.length * 5)) + ' artış' : '%0'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#74998a]">Ort. Süre / Gün</span>
                    <span className="text-[#eafff5] font-mono font-bold">{solvedList.length > 0 ? Math.round(solvedList.length * 3.5) + ' dk' : '0 dk'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ CATEGORY PAGE (odaları listele) ============ */
const CategoryPage = ({ navigate, data }) => {
  const cat = data || window.SK_CATEGORIES[0];
  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };
  const total = cat.rooms.reduce((a, r) => a + r.points, 0);
  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  return (
    <>
      <AppHeader navigate={navigate} active="dashboard" />
      <section className="py-16 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.10),transparent 62%)' }}></div>
        <div className="max-w-[1280px] mx-auto px-6 relative z-[2]">
          <button onClick={() => navigate('dashboard')} className="text-sm text-[#74998a] hover:text-[#00ff88] transition-colors mb-5">← Dashboard'a dön</button>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-14 h-14 rounded-xl grid place-items-center text-2xl border border-[#103a26] bg-[rgba(0,255,136,.04)]">{cat.icon}</span>
            <div>
              <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5]">{cat.name}</h1>
              <p className="text-[#74998a] text-sm mt-1">{cat.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-5 text-sm text-[#74998a]">
            <span><span className="text-[#00ff88] font-bold font-mono">{cat.rooms.length}</span> Oda</span>
            <span><span className="text-[#00ff88] font-bold font-mono">◆ {total}</span> Toplam Puan</span>
            <span><span className="text-[#00ff88] font-bold font-mono">{cat.rooms.filter(r=>r.difficulty==='Başlangıç').length}</span> Başlangıç</span>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {cat.rooms.map((room, i) => (
            <div key={room.id} onClick={() => navigate('roomArticle', { ...room, cat: cat.name })} className="group cursor-pointer border border-[#0c2719] rounded-xl p-7 hover:border-[#00ff88] hover:shadow-[0_24px_50px_-28px_rgba(0,255,136,.35)] transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5"><span className="font-mono text-xs text-[#3d564b]">{room.id.toUpperCase()}</span></div>
                  <h2 className="text-lg text-[#eafff5] group-hover:text-[#00ff88] transition-colors" style={{ lineHeight: 1.25 }}>{room.name}</h2>
                  <p className="text-sm text-[#74998a] mt-1.5">{room.desc}</p>
                </div>
                <span className={"text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap " + (dc[room.difficulty] || '')}>{room.difficulty}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#0c2719] text-xs text-[#3d564b]">
                <div className="flex items-center gap-4">
                  <span>👥 {room.users.toLocaleString('tr-TR')}</span>
                  <span className="font-mono text-[#00ff88]">◆ {room.points}</span>
                </div>
                {solvedList.includes(room.id) ? (
                  <span className="text-[#00ff88] font-bold">✓ Çözüldü</span>
                ) : (
                  <span className="group-hover:text-[#00ff88] transition-colors">Başla →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ ROOM / TASK SOLVING ============ */
const WEB_ROOM_CONFIGS = {
  'web-01': {
    title: 'SQL Injection Temelleri',
    desc: 'Giriş panelinde bir SQL injection açığı var. Kullanıcı adı alanına basit bir bypass payload\'u göndererek şifre kontrolünü atlayın ve admin olarak giriş yapın.',
    flag: 'siberkampus{sql_basic_bypass_success}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const uVal = target.u || '';
      const pVal = target.p || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const hasQuote = uVal.includes("'");
      const hasOrCondition = uVal.toLowerCase().includes("or") || uVal.includes("||");
      const hasAlwaysTrue = uVal.includes("1=1");
      const hasComment = uVal.includes("--");

      const step1Done = hasQuote;
      const step2Done = hasQuote && hasOrCondition && hasAlwaysTrue;
      const step3Done = hasQuote && hasOrCondition && hasAlwaysTrue && hasComment;
      const step4Ready = step3Done;

      let feedbackMsg = "Giriş yapabilmek için admin sorgusunu bypass etmelisiniz.";
      let isError = false;
      let isSuccess = false;

      if (!uVal) {
        feedbackMsg = "Veritabanı sorgusunu bozmak için Kullanıcı Adı kutusuna bir tek tırnak (') girerek başlayın.";
      } else if (hasQuote && !hasOrCondition) {
        feedbackMsg = "⚠️ SQL Syntax Hatası! Giriş alanına girdiğiniz tek tırnak ('), veritabanı sorgusundaki dizeyi erkenden sonlandırdı ve sorgu yapısını bozdu. Şimdi sorguya her zaman DOĞRU (TRUE) dönecek bir mantıksal OR koşulu eklemeliyiz.";
        isError = true;
      } else if (hasQuote && hasOrCondition && !hasAlwaysTrue) {
        feedbackMsg = "💡 OR koşulunu eklediniz ancak yazdığınız koşulun her zaman doğru (True) olması gerekiyor (örneğin: 1=1 gibi bir matematiksel eşitlik).";
      } else if (hasQuote && hasOrCondition && hasAlwaysTrue && !hasComment) {
        feedbackMsg = "💡 Arka tarafta çalışan şifre kontrolünü (AND password = ...) yok saymak için girdinin sonuna yorum işareti olan '--' eklemelisiniz.";
      } else if (hasQuote && hasOrCondition && hasAlwaysTrue && hasComment) {
        feedbackMsg = "🔥 Mükemmel Bypass! 'OR 1=1' sorguyu her zaman doğru yapar, '--' ise şifre kontrolünü devre dışı bırakır. Artık 'Giriş Yap' butonuna basabilirsiniz!";
        isSuccess = true;
      }

      const renderHighlightedSQL = () => {
        const selectPart = "SELECT * FROM users WHERE username = ";
        const andPasswordPart = " AND password = ";
        
        if (hasComment) {
          const commentIdx = uVal.indexOf('--');
          const beforeComment = uVal.substring(0, commentIdx);
          const commentContent = uVal.substring(commentIdx);
          
          return (
            <div className="font-mono text-sm md:text-base leading-relaxed break-all select-none">
              <span className="text-[#569cd6]">SELECT</span> * <span className="text-[#569cd6]">FROM</span> users <span className="text-[#569cd6]">WHERE</span> username = 
              <span className="text-[#ce9178]"> '{beforeComment}</span>
              <span className="text-[#6a9955] font-semibold">{commentContent}'</span> 
              <span className="text-[#888888] line-through decoration-[#ff2e88] opacity-50">{andPasswordPart}'{pVal}';</span>
              <div className="text-xs md:text-sm text-[#6a9955] mt-2.5 font-mono italic">// Not: 'OR 1=1' ifadesi sorgunun her zaman DOĞRU (TRUE) dönmesini sağlar. Çünkü 1 her zaman 1'e eşittir! Veritabanı girilen şifreye bakmasa bile bu mantıksal eşitlik sayesinde sorgudan veri döner. Girdinin sonundaki yeşil kısım yorumdur; kırmızı çizgili kısım (şifre kontrolü) veritabanı tarafından tamamen yok sayılır!</div>
            </div>
          );
        }
        
        return (
          <div className="font-mono text-sm md:text-base leading-relaxed break-all select-none">
            <span className="text-[#569cd6]">SELECT</span> * <span className="text-[#569cd6]">FROM</span> users <span className="text-[#569cd6]">WHERE</span> username = 
            <span className="text-[#ce9178]"> '{uVal}'</span> 
            <span className="text-[#569cd6]">{andPasswordPart}</span>
            <span className="text-[#ce9178]">'{pVal}'</span>;
          </div>
        );
      };

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step4Ready) return;
        
        setTarget(t => ({ ...t, isLoggingIn: true }));
        
        setTimeout(() => {
          setTarget(t => ({ ...t, isLoggingIn: false }));
          runTarget(e);
        }, 1500);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          const activeTab = target.activeTab || 'sys';
          const setActiveTab = (tab) => setTarget(t => ({ ...t, activeTab: tab }));
          
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm md:text-base text-gray-800" style={{ height: '390px' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                    <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">ADMİN KONTROL PANELİ</span>
                  </div>
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 font-mono font-bold">admin</span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800">Hoş geldiniz, Admin 👋</h3>
                </div>

                <div className="flex border-b border-gray-200 text-sm gap-1 bg-gray-200/60 p-0.5 rounded-md">
                  {[
                    { id: 'sys', l: 'Sistem' },
                    { id: 'db', l: 'Veri' },
                    { id: 'log', l: 'Log' },
                    { id: 'flag', l: 'Flag' }
                  ].map((t) => (
                    <button type="button" key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-1.5 rounded font-bold transition-all text-center ${activeTab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>{t.l}</button>
                  ))}
                </div>

                {activeTab === 'sys' && (
                  <div className="space-y-2 p-3 border border-gray-150 rounded-lg bg-white shadow-sm">
                    <div className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Durum: Aktif
                    </div>
                    <div className="text-gray-500 space-y-1.5 text-sm font-mono leading-relaxed">
                      <p>⚙️ Apache/2.4.41 (Ubuntu)</p>
                      <p>📁 PostgreSQL 14.2</p>
                      <p>⏱️ Uptime: 48 gün</p>
                    </div>
                  </div>
                )}
                {activeTab === 'db' && (
                  <div className="overflow-hidden border border-gray-150 rounded-lg bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600 border-b border-gray-150 font-bold">
                        <tr><th className="p-2">id</th><th className="p-2">Kullanıcı</th><th className="p-2">Rol</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700 font-mono">
                        <tr className="bg-blue-50/40 text-blue-900 font-semibold">
                          <td className="p-2">1</td><td className="p-2">admin</td><td className="p-2">super</td>
                        </tr>
                        <tr>
                          <td className="p-2">2</td><td className="p-2">mentor</td><td className="p-2">mentor</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === 'log' && (
                  <div className="space-y-1.5 p-3.5 bg-[#1e1e1e] border border-gray-300 rounded-lg text-sm text-gray-300 font-mono leading-relaxed h-[110px] overflow-y-auto shadow-inner">
                    <div>[+] DB bağlantısı açıldı.</div>
                    <div className="text-red-400">[!] SQL bypass algılandı.</div>
                    <div className="text-emerald-400">[+] Oturum açıldı: admin.</div>
                    <div className="text-yellow-400">[+] Flag: siberkampus{"{sql_basic_bypass_success}"}</div>
                  </div>
                )}
                {activeTab === 'flag' && (
                  <div className="text-center p-3.5 bg-blue-50 border border-blue-200 rounded-lg space-y-2.5 shadow-sm">
                    <p className="text-blue-800 text-sm font-medium font-sans">🎉 Tebrikler! Bayrağınız:</p>
                    <div className="inline-block text-base font-bold text-blue-600 font-mono px-3.5 py-2.5 bg-white rounded border border-blue-300 shadow-sm select-all">
                      siberkampus{'{sql_basic_bypass_success}'}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-2.5 border-t border-gray-100 text-sm text-gray-400 font-mono flex justify-between">
                <span>Apache/2.4.41</span>
                <span>Port: 80</span>
              </div>
            </div>
          );
        }

        if (target.isLoggingIn) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '390px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Giriş yapılıyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2 text-center">// Oturum başlatılıyor, yönlendiriliyorsunuz...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">🔒</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">Yönetici Giriş Paneli</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// Yetkili personel giriş arayüzü</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// Kullanıcı Adı (Bypass Girdisi)</label>
                  <input 
                    value={uVal} 
                    onChange={e => setTarget(t => ({ ...t, u: e.target.value }))} 
                    placeholder="' OR 1=1 --" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-base transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// Şifre (Password Bypass)</label>
                  <input 
                    value={pVal} 
                    onChange={e => setTarget(t => ({ ...t, p: e.target.value }))} 
                    placeholder="Atlanacağı için boş kalabilir" 
                    type="password" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono text-base transition-colors" 
                  />
                </div>
                <button 
                  type="submit" 
                  className={`w-full font-sans text-base font-bold py-4 rounded-xl transition-all ${step4Ready ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}
                >
                  Giriş Yap (Oturum Aç)
                </button>
              </form>
            </div>
            
            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Sunucu: Apache/2.4.41 (Ubuntu)</div>
              <div>IP / Port: 192.168.1.42:80</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {/* Sol: Giriş Ekranı veya Admin Paneli */}
            {renderLeftPanel()}

            {/* Sağ: Hacker Geliştirici Konsolu */}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              {/* Tab Header */}
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button 
                  type="button" 
                  onClick={() => setDevTab('guide')} 
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button 
                  type="button" 
                  onClick={() => setDevTab('sql')} 
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'sql' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🔍</span> CANLI SQL GÖZLEMCİSİ
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-2">// Yeniler İçin SQL Injection Görevi Çözüm Adımları:</div>
                    
                    {/* Step 1 */}
                    <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step1Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step1Done ? "✓ Adım 1:" : "○ Adım 1:"}</span>
                          SQL Sözdizimini Kırmak
                        </span>
                        {step1Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Kullanıcı adı alanına tek tırnak (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">'</code>) girerek SQL sorgusunun yapısını bozun.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#3d564b]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#3d564b]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Mantıksal OR Koşulu Ekleme
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Sorgunun her zaman doğru (True) dönmesini sağlamak için mantıksal bir VEYA ifadesi ekleyin: <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">OR 1=1</code>.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-4 rounded-xl border transition-all ${step3Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step2Done ? 'border-[#0c2719] opacity-40 text-[#3d564b]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step3Done ? "text-[#00ff88]" : step2Done ? "text-[#ffd166]" : "text-[#3d564b]"}>{step3Done ? "✓ Adım 3:" : "○ Adım 3:"}</span>
                          Şifre Kontrolünü Yorum Yapmak
                        </span>
                        {step3Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step2Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Arka planda çalışan şifre kontrolünü devre dışı bırakmak için girdinin sonuna boşlukla birlikte SQL yorum işareti (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">--</code>) ekleyin.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-sm text-[#74998a] font-mono mb-2">// Hedef Veritabanı Tablosu (users):</div>
                      <div className="flex items-center gap-3.5 flex-wrap">
                        <span className="px-2.5 py-1.5 rounded bg-[#103a26]/40 text-[#00ff88] text-sm font-mono">id (INT)</span>
                        <span className="px-2.5 py-1.5 rounded bg-[#103a26]/40 text-[#eafff5] text-sm font-mono">username (VARCHAR)</span>
                        <span className="px-2.5 py-1.5 rounded bg-[#103a26]/40 text-[#eafff5] text-sm font-mono">password (VARCHAR)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-[#74998a] font-mono">// Veritabanında Derlenen Canlı SQL:</div>
                      <div className="p-4 bg-black/85 border border-[#103a26] rounded-xl font-mono leading-relaxed shadow-inner">
                        {renderHighlightedSQL()}
                      </div>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
},
    run: (target) => {
      const u = (target.u || '').toLowerCase();
      if (u.includes("'") && (u.includes("or") || u.includes("||")) && u.includes("1=1") && u.includes("--")) {
        return { ok: true, msg: "Giriş Başarılı!" };
      } else if (u.includes("'")) {
        return { ok: 'warn', msg: "SQL syntax error near '" + target.u + "' - Sorgu mantığı bozuldu, bypass için OR koşulu ekleyin." };
      } else {
        return { ok: false, msg: "Hata: Geçersiz kullanıcı adı veya şifre." };
      }
    }
  },
  'web-04': {
    title: 'XSS (Reflected)',
    desc: 'Arama modülündeki arama parametresi filtrelenmeden ekrana yazılıyor. Sayfada alert tetikleyen bir payload göndererek çerezleri (cookie) ele geçirin.',
    flag: 'siberkampus{reflected_xss_cookie_stolen}',
    hints: [
      "Arama kutusuna yazdığınız HTML girdilerinin sayfaya kaçış karakteri olmadan yansıyıp yansımadığına bakın.",
      "HTML script etiketlerini kullanarak JavaScript çalıştırın.",
      "Payload: <script>alert(1)</script> veya <img src=x onerror=alert(1)>"
    ],
    renderApp: (target, setTarget, runTarget, resp) => (
      <div className="p-7">
        <div className="text-center mb-6">
          <div className="font-disp font-bold text-lg text-[#cdeede]">Ürün Arama</div>
          <p className="text-xs text-[#74998a] mt-1">Siber Kampüs E-Ticaret Paneli</p>
        </div>
        <form onSubmit={runTarget} className="space-y-3 max-w-[320px] mx-auto">
          <div className="flex gap-2">
            <input value={target.q || ''} onChange={e => setTarget(t => ({ ...t, q: e.target.value }))} placeholder="Aranacak kelime..." className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" />
            <button type="submit" className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-4 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Ara</button>
          </div>
        </form>
        {resp && (
          <div className="mt-5 max-w-[320px] mx-auto">
            <div className="p-3 rounded-lg border border-[#103a26] bg-[#020806]/40 text-xs font-mono">
              Arama Sonucu: <span className="text-[#00ff88]" dangerouslySetInnerHTML={{ __html: target.q }}></span>
              {resp.ok === true && (
                <div className="mt-3 p-2.5 border border-[#ffd166] rounded bg-[#ffd166]/5 text-[#ffd166] leading-relaxed">
                  🚨 POP-UP TETİKLENDİ! Tarayıcı scripti çalıştı ve admin oturum çerezleri okundu:<br/>
                  <strong className="text-white block mt-1">siberkampus{'{reflected_xss_cookie_stolen}'}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    run: (target) => {
      const q = (target.q || '').toLowerCase();
      if ((q.includes('<script>') && q.includes('alert(') && q.includes('</script>')) || (q.includes('onerror=') && q.includes('alert(')) || (q.includes('onload=') && q.includes('alert('))) {
        return { ok: true };
      } else {
        return { ok: 'info' };
      }
    }
  },
  'web-02': {
    title: 'UNION-Based SQLi',
    desc: 'Sorgu çıktılarının doğrudan tabloda görüntülendiği bu modülde, UNION SELECT enjeksiyonu yaparak users tablosundaki admin şifre hash\'iyle birlikte bayrağı dökün.',
    flag: 'siberkampus{sql_union_admin_database_dump}',
    hints: [
      "Tabloda 3 sütun listelenmektedir. UNION SELECT sorgunuzda da tam 3 sütun bulunmalıdır.",
      "Bypass için ID alanına tek tırnak atıp UNION SELECT ekleyin.",
      "Payload: 1' UNION SELECT 1, 2, password FROM users -- -"
    ],
    renderApp: (target, setTarget, runTarget, resp) => (
      <div className="p-7">
        <div className="text-center mb-6">
          <div className="font-disp font-bold text-lg text-[#cdeede]">Kullanıcı Bilgi Portalı</div>
          <p className="text-xs text-[#74998a] mt-1">ID parametresi ile veri çekin</p>
        </div>
        <form onSubmit={runTarget} className="space-y-3 max-w-[320px] mx-auto">
          <div className="flex gap-2">
            <input value={target.id || ''} onChange={e => setTarget(t => ({ ...t, id: e.target.value }))} placeholder="Kullanıcı ID (örn: 1)" className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" />
            <button type="submit" className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-4 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Sorgula</button>
          </div>
        </form>
        {resp && (
          <div className="mt-5 max-w-[320px] mx-auto">
            <div className="p-3.5 rounded-lg border border-[#103a26] bg-[#020806]/40 text-xs font-mono space-y-2">
              {resp.ok === true ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#103a26] text-[#74998a]"><th className="pb-1">ID</th><th className="pb-1">User</th><th className="pb-1">Pass / Flag</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#0c2719]"><td>1</td><td>admin</td><td>siberkampus{'{sql_union_admin_database_dump}'}</td></tr>
                    <tr><td>2</td><td>editor</td><td>d033e22ae348aeb5660fc2140aec35850c4da997</td></tr>
                  </tbody>
                </table>
              ) : resp.ok === 'warn' ? (
                <div className="text-[#ffd166]">{resp.msg}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#103a26] text-[#74998a]"><th className="pb-1">ID</th><th className="pb-1">User</th><th className="pb-1">Email</th></tr>
                  </thead>
                  <tbody>
                    {target.id === '1' ? (
                      <tr><td>1</td><td>admin</td><td>admin@siberkampus.lab</td></tr>
                    ) : target.id === '2' ? (
                      <tr><td>2</td><td>editor</td><td>editor@siberkampus.lab</td></tr>
                    ) : (
                      <tr><td colSpan="3" className="text-center text-[#74998a]">Kayıt bulunamadı.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    run: (target) => {
      const id = (target.id || '').toLowerCase();
      if (id.includes('union') && id.includes('select') && (id.includes('users') || id.includes('password') || id.includes('flag'))) {
        return { ok: true };
      } else if (id.includes("'") || id.includes('--')) {
        return { ok: 'warn', msg: "SQL syntax error near '" + target.id + "' - Sütun sayısı uyuşmuyor veya sorgu sonlandırılamadı." };
      } else {
        return { ok: false };
      }
    }
  },
  'web-05': {
    title: 'XSS (Stored & DOM)',
    desc: 'Girdi filtresi bulunmayan yorum paneli, zararlı girdileri kalıcı olarak veritabanına kaydediyor. Admin oturumunu ele geçirecek bir script yorumu bırakın (Stored XSS).',
    flag: 'siberkampus{stored_xss_admin_session_hijacked}',
    hints: [
      "Yorum alanına eklenen HTML/JS etiketlerinin sayfada çalışıp çalışmadığını izleyin.",
      "Admin kullanıcısı yorumları onaylamak için paneli periyodik olarak incelemektedir.",
      "Payload: <script>fetch('/log?c=' + document.cookie)</script> veya <img src=x onerror=alert(document.cookie)>"
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const [comments, setComments] = useState([
        { author: 'Can M.', text: 'Harika bir siber güvenlik platformu!' },
        { author: 'Selin O.', text: 'SQLi odaları çok öğreticiydi, ellerinize sağlık.' }
      ]);
      const addComment = (e) => {
        e.preventDefault();
        if (!target.txt) return;
        setComments([...comments, { author: target.auth || 'Misafir', text: target.txt }]);
        runTarget(e);
      };
      return (
        <div className="p-7">
          <div className="text-center mb-5">
            <div className="font-disp font-bold text-lg text-[#cdeede]">Ziyaretçi Defteri</div>
            <p className="text-xs text-[#74998a] mt-1">Yorum bırakın (HTML etiketleri aktiftir)</p>
          </div>
          <form onSubmit={addComment} className="space-y-2 max-w-[320px] mx-auto mb-5">
            <input value={target.auth || ''} onChange={e => setTarget(t => ({ ...t, auth: e.target.value }))} placeholder="Adınız" className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-1.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" />
            <textarea value={target.txt || ''} onChange={e => setTarget(t => ({ ...t, txt: e.target.value }))} placeholder="Yorumunuz..." className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-1.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm h-16 resize-none" />
            <button type="submit" className="w-full font-mono text-xs font-bold text-[#021008] bg-[#00ff88] py-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Gönder</button>
          </form>
          <div className="max-w-[320px] mx-auto space-y-2.5">
            <div className="text-xs text-[#74998a] font-mono">// Kayıtlı Yorumlar:</div>
            {comments.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-[#0c2719] bg-[#020806]/40 text-xs font-mono">
                <span className="text-[#00ff88] font-bold">@{c.author}: </span>
                <span dangerouslySetInnerHTML={{ __html: c.text }}></span>
              </div>
            ))}
          </div>
          {resp && resp.ok === true && (
            <div className="mt-5 max-w-[320px] mx-auto p-3.5 border border-[#ff2e88] rounded bg-[#ff2e88]/5 text-[#ff2e88] text-xs font-mono">
              🚨 STORED XSS TETİKLENDİ! Admin yorumunuzu inceledi ve admin cookie bilgileri çalındı:<br/>
              <strong className="text-white mt-1 block">siberkampus{'{stored_xss_admin_session_hijacked}'}</strong>
            </div>
          )}
        </div>
      );
    },
    run: (target) => {
      const txt = (target.txt || '').toLowerCase();
      if ((txt.includes('<script>') && txt.includes('</script>')) || (txt.includes('onerror=') && txt.includes('alert')) || (txt.includes('onload=') && txt.includes('alert')) || txt.includes('document.cookie')) {
        return { ok: true };
      } else {
        return { ok: 'info' };
      }
    }
  },
  'web-06': {
    title: 'CSRF Saldırıları',
    desc: 'Şifre değiştirme fonksiyonu hiçbir CSRF Token veya kimlik denetimi içermiyor. Kurban kullanıcının şifresini değiştiren sahte bir HTML exploit tasarlayıp gönderin.',
    flag: 'siberkampus{csrf_token_missing_state_compromised}',
    hints: [
      "Kurban tarayıcısının şifre güncelleme endpoint'ine (/change-password) istek atmasını sağlayın.",
      "Kullanıcının haberi olmadan çalışan iframe, img veya otomatik form yapısı kurgulayın.",
      "Payload: <iframe src='/change-password?new=admin123'> veya JS submit scripti."
    ],
    renderApp: (target, setTarget, runTarget, resp) => (
      <div className="p-7">
        <div className="text-center mb-5">
          <div className="font-disp font-bold text-lg text-[#cdeede]">CSRF Gönderim Paneli</div>
          <p className="text-xs text-[#74998a] mt-1">Admin tarayıcısına exploit kodunuzu gönderin</p>
        </div>
        <form onSubmit={runTarget} className="space-y-3 max-w-[320px] mx-auto">
          <textarea value={target.exploit || ''} onChange={e => setTarget(t => ({ ...t, exploit: e.target.value }))} placeholder="HTML / JS Exploit Kodunuz (örn: <img src='/change-password...'>)" className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm h-28 resize-none" />
          <button type="submit" className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Exploit'i Gönder</button>
        </form>
        {resp && (
          <div className={"mt-5 max-w-[320px] mx-auto p-3.5 rounded-lg border font-mono text-xs leading-relaxed break-all " + (resp.ok === true ? 'border-[#103a26] bg-[rgba(0,255,136,.05)] text-[#00ff88]' : 'border-[#ff2e88]/40 bg-[rgba(255,46,136,.05)] text-[#ff2e88]')}>
            {resp.msg}
          </div>
        )}
      </div>
    ),
    run: (target) => {
      const exp = (target.exploit || '').toLowerCase();
      if (exp.includes('change-password') && (exp.includes('new=') || exp.includes('password=')) && (exp.includes('iframe') || exp.includes('img') || exp.includes('form') || exp.includes('fetch') || exp.includes('xmlhttprequest'))) {
        return { ok: true, msg: "Tebrikler! Admin exploit sayfanızı görüntüledi ve şifresi değiştirildi! Bayrak: siberkampus{csrf_token_missing_state_compromised}" };
      } else {
        return { ok: false, msg: "Exploit gönderildi fakat şifre değiştirme isteği tetiklenemedi. Parametreleri ve etiketleri kontrol edin." };
      }
    }
  },
  'web-03': {
    title: 'Blind SQL Injection',
    desc: 'Sorgular doğrudan veri döndürmüyor, sadece kullanıcının varlığını True/False olarak belirtiyor. SQL koşulları oluşturarak admin bayrağının ilk karakterini test edin.',
    flag: 'siberkampus{blind_sqli_boolean_extraction}',
    hints: [
      "Sorgularınızın sonucunun doğruluğuna göre dönen True/False durum mesajlarını analiz edin.",
      "ASCII kodları ve SUBSTRING metodunu birleştirerek harf kontrolü yapın.",
      "Payload: 1' AND SUBSTRING((SELECT flag FROM flags), 1, 1) = 's' -- -"
    ],
    renderApp: (target, setTarget, runTarget, resp) => (
      <div className="p-7">
        <div className="text-center mb-6">
          <div className="font-disp font-bold text-lg text-[#cdeede]">Blind SQLi Arama</div>
          <p className="text-xs text-[#74998a] mt-1">Yalnızca veritabanı kullanıcı varlığı kontrol edilebilir</p>
        </div>
        <form onSubmit={runTarget} className="space-y-3 max-w-[320px] mx-auto">
          <div className="flex gap-2">
            <input value={target.q || ''} onChange={e => setTarget(t => ({ ...t, q: e.target.value }))} placeholder="Kullanıcı adı veya ID sorgusu..." className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" />
            <button type="submit" className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-4 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Sorgula</button>
          </div>
        </form>
        {resp && (
          <div className="mt-5 max-w-[320px] mx-auto">
            <div className={"p-3.5 rounded-lg border font-mono text-xs leading-relaxed break-all " + (resp.ok === true ? 'border-[#103a26] bg-[rgba(0,255,136,.05)] text-[#00ff88]' : 'border-[#ff2e88]/40 bg-[rgba(255,46,136,.05)] text-[#ff2e88]')}>
              {resp.msg}
            </div>
          </div>
        )}
      </div>
    ),
    run: (target) => {
      const q = (target.q || '').toLowerCase();
      if (q.includes('substring') && q.includes('flags') && q.includes('s')) {
        return { ok: true, msg: "True (Doğru): Kullanıcı veritabanında mevcut! Bayrağın ilk harfinin 's' olduğunu doğruladınız. Bayrak: siberkampus{blind_sqli_boolean_extraction}" };
      } else if (q.includes("'") && (q.includes('and') || q.includes('or')) && q.includes('=')) {
        if (q.includes('1=1') || q.includes('true')) {
          return { ok: true, msg: "True (Doğru): Kullanıcı veritabanında mevcut!" };
        } else {
          return { ok: false, msg: "False (Yanlış): Kullanıcı mevcut değil." };
        }
      } else {
        return { ok: false, msg: "False (Yanlış): Kullanıcı mevcut değil." };
      }
    }
  },
  'web-07': {
    title: 'File Upload Bypass',
    desc: 'Profil resmi yükleme alanı dosya uzantısını client-side kontrol ediyor. Çift uzantı, MIME manipülasyonu veya phtml bypass yöntemleriyle sunucuya bir PHP shell yükleyin.',
    flag: 'siberkampus{rce_via_file_upload_bypass_achieved}',
    hints: [
      "Client-side kontrolleri aşmak için dosya ismini shell.php.png veya shell.phtml yapmayı deneyin.",
      "Sunucu PHP kodlarını derleyebilir, ancak .php uzantısını filtreleyebilir. .phtml veya .php5 uzantısını deneyin.",
      "Content-Type değerini image/png olarak değiştirmeyi deneyin."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const fileInputRef = useRef(null);
      const [fileName, setFileName] = useState('');
      const handleFileChange = (e) => {
        if (e.target.files[0]) setFileName(e.target.files[0].name);
      };
      return (
        <div className="p-7">
          <div className="text-center mb-5">
            <div className="font-disp font-bold text-lg text-[#cdeede]">Resim Yükleme Paneli</div>
            <p className="text-xs text-[#74998a] mt-1">Sadece resim formatlarına izin verilir (.png, .jpg)</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); runTarget(e, fileName); }} className="space-y-3 max-w-[320px] mx-auto text-center">
            <div className="border-2 border-dashed border-[#103a26] rounded-xl p-5 hover:border-[#00ff88] transition-colors cursor-pointer" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <span className="text-3xl block mb-2">📁</span>
              <span className="text-xs text-[#74998a] block truncate">{fileName || "Dosya Seçin"}</span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <button type="submit" className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Sunucuya Yükle</button>
          </form>
          {resp && (
            <div className={"mt-5 max-w-[320px] mx-auto p-3.5 rounded-lg border font-mono text-xs leading-relaxed break-all " + (resp.ok === true ? 'border-[#103a26] bg-[rgba(0,255,136,.05)] text-[#00ff88]' : 'border-[#ff2e88]/40 bg-[rgba(255,46,136,.05)] text-[#ff2e88]')}>
              {resp.msg}
            </div>
          )}
        </div>
      );
    },
    run: (target, customArg) => {
      const fname = (customArg || '').toLowerCase();
      if (!fname) return { ok: false, msg: "Hata: Dosya seçilmedi!" };
      if (fname.endsWith('.png') || fname.endsWith('.jpg') || fname.endsWith('.jpeg')) {
        if (fname.includes('.php.png') || fname.includes('.php.jpg')) {
          return { ok: true, msg: "Bypass Başarılı! Çift uzantı filtresi aşıldı ve PHP shell /uploads/" + fname + " adresinde çalıştırıldı. Bayrak: siberkampus{rce_via_file_upload_bypass_achieved}" };
        }
        return { ok: false, msg: "Dosya başarıyla yüklendi: /uploads/" + fname + ". Ancak bu dosya çalıştırılabilir PHP kodları barındırmıyor." };
      } else if (fname.endsWith('.phtml') || fname.endsWith('.php5') || fname.endsWith('.php.phtml')) {
        return { ok: true, msg: "Bypass Başarılı! .php uzantı engeli alternatif uzantı ile aşıldı. Web shell aktif! Bayrak: siberkampus{rce_via_file_upload_bypass_achieved}" };
      } else {
        return { ok: false, msg: "Hata: Güvenlik duvarı (WAF) uzantıyı engelledi! Sadece .png veya .jpg izin verilmektedir." };
      }
    }
  },
  'web-08': {
    title: 'SSRF & XXE',
    desc: 'Sunucu, gönderilen XML girdilerini analiz ediyor ve dış entity\'leri işliyor. Sunucunun dahili dosyalarını (`file:///etc/passwd`) okumak için zararlı bir XML Entity (XXE) payload\'u gönderin.',
    flag: 'siberkampus{ssrf_xxe_internal_recon_success}',
    hints: [
      "XML dökümanlarının en üstünde SYSTEM entity tanımlayarak sunucu yerel sistem dosyalarını okumayı hedefleyin.",
      "Payload XML formatında bir entity ve bunu çağıran bir etiket içermelidir.",
      "Payload: <!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]><foo>&xxe;</foo>"
    ],
    renderApp: (target, setTarget, runTarget, resp) => (
      <div className="p-7">
        <div className="text-center mb-5">
          <div className="font-disp font-bold text-lg text-[#cdeede]">XML Veri Ayrıştırıcı API</div>
          <p className="text-xs text-[#74998a] mt-1">Sisteme göndermek istediğiniz XML girdisini yazın</p>
        </div>
        <form onSubmit={runTarget} className="space-y-3 max-w-[320px] mx-auto">
          <textarea value={target.xml || ''} onChange={e => setTarget(t => ({ ...t, xml: e.target.value }))} placeholder="XML Payload'ınız..." className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm h-28 resize-none" />
          <button type="submit" className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">XML Gönder</button>
        </form>
        {resp && (
          <div className="mt-5 max-w-[320px] mx-auto">
            <div className="text-xs text-[#74998a] mb-2 font-mono">// API Yanıtı:</div>
            <div className={"p-3.5 rounded-lg border font-mono text-xs leading-relaxed break-all " + (resp.ok === true ? 'border-[#103a26] bg-[rgba(0,255,136,.05)] text-[#00ff88]' : 'border-[#ff2e88]/40 bg-[rgba(255,46,136,.05)] text-[#ff2e88]')}>
              {resp.msg}
            </div>
          </div>
        )}
      </div>
    ),
    run: (target) => {
      const xml = (target.xml || '').toLowerCase();
      if (xml.includes('!entity') && xml.includes('system') && (xml.includes('passwd') || xml.includes('etc') || xml.includes('file:///'))) {
        return { ok: true, msg: "XXE Başarılı! Sunucu /etc/passwd içeriğini okudu:\n\nroot:x:0:0:root:/root:/bin/bash\nflag: siberkampus{ssrf_xxe_internal_recon_success}" };
      } else {
        return { ok: false, msg: "Hata: XML girdisi parse edildi fakat harici dosya entitesi (External Entity) çağrısı algılanamadı." };
      }
    }
  },
  'web-09': {
    title: 'JWT Token Exploitation',
    desc: 'JWT imza doğrulaması kütüphanesinde kritik bir zafiyet var. Header içindeki algoritmik korumayı `None` yaparak imza kontrolünü atlatın ve admin yetkisi kazanın.',
    flag: 'siberkampus{jwt_none_algorithm_signature_bypass}',
    hints: [
      "JWT token'larının üç bölümden (Header, Payload, Signature) oluştuğunu ve noktalarla ayrıldığını unutmayın.",
      "Token header'ını base64'ten çözüp 'alg': 'none' yapın ve geri kodlayın.",
      "Payload'da user rolünü admin yapın, token sonundaki imza alanını silip sunucuya gönderin."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSGFja2VyIiwicm9sZSI6InVzZXIifQ.signature_here";
      return (
        <div className="p-7">
          <div className="text-center mb-5">
            <div className="font-disp font-bold text-lg text-[#cdeede]">Admin Kontrol Paneli</div>
            <p className="text-xs text-[#74998a] mt-1">Kimlik doğrulaması için JWT token gönderin</p>
          </div>
          <div className="max-w-[320px] mx-auto space-y-3 text-left">
            <div className="text-[10px] text-[#74998a] font-mono">// Varsayılan Token'ınız (Kullanıcı yetkili):</div>
            <textarea value={defaultToken} readOnly className="w-full bg-[#020806]/40 border border-[#0c2719] rounded-lg px-2.5 py-2 text-[#74998a] font-mono text-[10px] h-14 resize-none focus:outline-none" />
            
            <form onSubmit={runTarget} className="space-y-3">
              <textarea value={target.token || ''} onChange={e => setTarget(t => ({ ...t, token: e.target.value }))} placeholder="Modifiye edilmiş JWT Token'ınız..." className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-[11px] h-20 resize-none" />
              <button type="submit" className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Token Gönder</button>
            </form>
          </div>
          {resp && (
            <div className="mt-5 max-w-[320px] mx-auto">
              <div className={"p-3.5 rounded-lg border font-mono text-xs leading-relaxed break-all " + (resp.ok === true ? 'border-[#103a26] bg-[rgba(0,255,136,.05)] text-[#00ff88]' : 'border-[#ff2e88]/40 bg-[rgba(255,46,136,.05)] text-[#ff2e88]')}>
                {resp.msg}
              </div>
            </div>
          )}
        </div>
      );
    },
    run: (target) => {
      const t = target.token || '';
      const parts = t.split('.');
      if (parts.length < 2) return { ok: false, msg: "Geçersiz Token formatı! JWT 3 bölümden oluşmalıdır." };
      
      const safeAtob = (str) => {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) {
          b64 += '=';
        }
        return atob(b64);
      };

      try {
        const header = JSON.parse(safeAtob(parts[0]));
        const payload = JSON.parse(safeAtob(parts[1]));
        
        if (header.alg === 'none' || header.alg === 'NONE') {
          if (payload.role === 'admin' || payload.role === 'ADMIN') {
            return { ok: true, msg: "Bypass Başarılı! Sunucu token imzasını kontrol etmedi (None Algorithm) ve yetkileriniz admin olarak yükseltildi! Bayrak: siberkampus{jwt_none_algorithm_signature_bypass}" };
          }
          return { ok: false, msg: "Token kabul edildi fakat payload üzerinde rolünüz 'admin' olarak set edilmemiş." };
        } else {
          return { ok: false, msg: "Hata: İmza doğrulanamadı! HS256 gizli anahtarı olmadan imzalanmış token kabul edilmiyor." };
        }
      } catch (e) {
        return { ok: false, msg: "Hata: JWT Base64 çözümlenemedi veya hatalı JSON yapısı!" };
      }
    }
  },
  'web-10': {
    title: 'Web App Pentest Capstone',
    desc: 'Final Sınavı: Terminal konsoluna komut yazarak sırasıyla SQLi bypass gerçekleştirin, JWT yetkinizi admin yapın ve dosya yükleme zafiyetiyle shell alarak flag.txt okuyun.',
    flag: 'siberkampus{ultimate_web_pentest_capstone_mastered}',
    hints: [
      "Aşama 1: SQLi ile portal girişini bypass edin. Komut: `sqli ' or 1=1 -- -`",
      "Aşama 2: Elde edilen token algoritmasını `none` ve rolünü `admin` yaparak gönderin. Komut: `jwt token.none.admin`",
      "Aşama 3: Sunucuya RCE için shell dosyasını yükleyin ve flag.txt dosyasını okuyun. Komut: `upload shell.phtml` ardından `cat flag.txt`"
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const [step, setStep] = useState(1);
      const [history, setHistory] = useState([
        'Siber Kampüs Capstone Terminali [Sürüm 1.0.0]',
        'Sızma testi hedefine bağlantı başarılı: target.capstone.lab',
        'Zafiyet zincirini başlatmak için komutları yürütün.',
        'Aşama 1/3: Giriş bypass için SQLi zafiyetini sömürün (ipucu: sqli <payload>)'
      ]);
      const executeCommand = (e) => {
        e.preventDefault();
        const cmd = target.cmd || '';
        if (!cmd.trim()) return;
        
        const newHistory = [...history, `$ ${cmd}`];
        const val = cmd.toLowerCase();
        
        if (step === 1) {
          if (val.includes('sqli') && val.includes("'") && val.includes('1=1') && val.includes('--')) {
            newHistory.push('   [+] SQL Injection başarılı! Admin portalına giriş yapıldı.');
            newHistory.push('   [+] Geçici JWT Token alındı: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoidXNlciJ9.signature');
            newHistory.push('   Aşama 2/3: Token rolünü admin yapmak için zafiyetli JWT sömürün (ipucu: jwt <token_cmd>)');
            setStep(2);
          } else {
            newHistory.push('   [-] Giriş başarısız. SQL Injection payload\'unu kontrol edin.');
          }
        } else if (step === 2) {
          if (val.includes('jwt') && val.includes('none') && val.includes('admin')) {
            newHistory.push('   [+] JWT Bypass başarılı! Yetkileriniz Admin (Yönetici) olarak güncellendi.');
            newHistory.push('   [+] Dosya Yükleme Paneli aktif edildi.');
            newHistory.push('   Aşama 3/3: PHP kod yürütme bypass ile shell dosyasını yükleyin (ipucu: upload <shell_uzantisi>)');
            setStep(3);
          } else {
            newHistory.push('   [-] Token reddedildi. İmza kontrolünü alg=none ve role=admin ile bypass edin.');
          }
        } else if (step === 3) {
          if (val.includes('upload') && (val.includes('.phtml') || val.includes('.php5') || val.includes('.php.png'))) {
            newHistory.push('   [+] Web shell başarıyla yüklendi: /uploads/shell.phtml');
            newHistory.push('   [+] Komut satırı yetkisi alındı. flag.txt dosyasını okuyun.');
            setStep(4);
          } else {
            newHistory.push('   [-] Dosya tipi güvenlik engeline takıldı. php filtresini aşan bir uzantı kullanın.');
          }
        } else if (step === 4) {
          if (val.includes('cat') && val.includes('flag.txt')) {
            newHistory.push('   [+] Tebrikler! Capstone bayrağı ele geçirildi:');
            newHistory.push('   👉 siberkampus{ultimate_web_pentest_capstone_mastered}');
            runTarget(e); 
          } else {
            newHistory.push('   [-] Dosya bulunamadı veya yetersiz yetki. cat flag.txt komutunu kullanın.');
          }
        }
        setHistory(newHistory);
        setTarget(t => ({ ...t, cmd: '' }));
      };
      return (
        <div className="p-5 font-mono text-[11px] leading-relaxed text-[#cdeede] bg-[#020806] rounded-xl border border-[#103a26]">
          <div className="h-64 overflow-y-auto space-y-1 p-2 bg-black/40 border border-[#0c2719] rounded-lg mb-4 text-left">
            {history.map((line, i) => (
              <div key={i} className={line.startsWith('$') ? 'text-[#00ff88]' : line.includes('[+]') ? 'text-[#5cffba]' : line.includes('[-]') ? 'text-[#ff2e88]' : 'text-[#74998a]'}>{line}</div>
            ))}
          </div>
          <form onSubmit={executeCommand} className="flex gap-2">
            <span className="text-[#00ff88] font-bold text-sm">$</span>
            <input value={target.cmd || ''} onChange={e => setTarget(t => ({ ...t, cmd: e.target.value }))} placeholder="Komut yazın..." className="flex-1 bg-transparent border-b border-[#103a26] text-[#00ff88] focus:border-[#00ff88] focus:outline-none font-mono text-xs" />
            <button type="submit" className="text-xs font-bold text-[#021008] bg-[#00ff88] px-3 py-1 rounded hover:shadow-[0_0_10px_#00ff88] transition-all">Gönder</button>
          </form>
        </div>
      );
    },
    run: () => {
      return { ok: true };
    }
  },
  'web-11': {
    title: 'Varsayılan Parola Sömürüsü',
    desc: 'Router yönetim paneline varsayılan kimlik bilgileriyle erişin.',
    flag: 'siberkampus{default_credentials_router_admin}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const uVal = target.u || '';
      const pVal = target.p || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const step1Done = uVal.toLowerCase() === 'admin';
      const step2Done = step1Done && pVal === 'admin';
      const step3Done = step2Done;
      const step4Ready = step3Done;

      let feedbackMsg = "Router yönetim paneline giriş yapmak için varsayılan kimlik bilgilerini kullanın.";
      let isError = false;
      let isSuccess = false;

      if (!uVal) {
        feedbackMsg = "Adım 1: Varsayılan yönetici kullanıcı adını (admin) giriş alanına yazın.";
      } else if (!step1Done) {
        feedbackMsg = "⚠️ Yanlış kullanıcı adı! Varsayılan yönetici adı 'admin' olmalıdır.";
        isError = true;
      } else if (!pVal) {
        feedbackMsg = "Adım 2: Varsayılan şifreyi (admin) şifre alanına yazın.";
      } else if (!step2Done) {
        feedbackMsg = "⚠️ Yanlış şifre! Varsayılan şifre 'admin' olmalıdır.";
        isError = true;
      } else if (step3Done) {
        feedbackMsg = "🔥 Mükemmel! Varsayılan kimlik bilgileri doğru. 'Giriş Yap' butonuna basarak router paneline erişin!";
        isSuccess = true;
      }

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step4Ready) return;

        setTarget(t => ({ ...t, isLoggingIn: true }));

        setTimeout(() => {
          setTarget(t => ({ ...t, isLoggingIn: false }));
          runTarget(e);
        }, 1500);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm md:text-base text-gray-800" style={{ height: '390px' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"></span>
                    <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">ROUTER KONTROL PANELİ</span>
                  </div>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-150 font-mono font-bold">ASUS RT-3200</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border border-gray-150 rounded-lg bg-gray-50">
                    <div className="text-sm font-bold text-gray-700 mb-2">Ağ Bilgisi</div>
                    <div className="text-xs text-gray-500 font-mono space-y-1">
                      <p>IP Adresi: 192.168.1.1</p>
                      <p>Versiyon: Asuswrt 388.1</p>
                      <p>Uptime: 142 gün</p>
                    </div>
                  </div>

                  <div className="p-3 border border-gray-150 rounded-lg bg-blue-50">
                    <div className="text-sm font-bold text-blue-700 mb-2">Flag</div>
                    <div className="inline-block text-sm font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300">
                      siberkampus{'{default_credentials_router_admin}'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2.5 border-t border-gray-100 text-sm text-gray-400 font-mono flex justify-between">
                <span>Bağlantı Yapıldı</span>
                <span>192.168.1.1:80</span>
              </div>
            </div>
          );
        }

        if (target.isLoggingIn) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '390px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Giriş yapılıyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2 text-center">// Router ayarları yükleniyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">📶</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">Router Yönetim Paneli</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// ASUS RT-3200 İdaresi</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// Kullanıcı Adı</label>
                  <input
                    value={uVal}
                    onChange={e => setTarget(t => ({ ...t, u: e.target.value }))}
                    placeholder="admin"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-base transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// Şifre</label>
                  <input
                    value={pVal}
                    onChange={e => setTarget(t => ({ ...t, p: e.target.value }))}
                    placeholder="••••••••"
                    type="password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono text-base transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full font-sans text-base font-bold py-4 rounded-xl transition-all ${step4Ready ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}
                >
                  Giriş Yap
                </button>
              </form>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Cihaz: ASUS RT-3200</div>
              <div>Adres: 192.168.1.1:80</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button
                  type="button"
                  onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📖</span> ADIM ADIM REHBER {!step2Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setDevTab('http')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'http' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🔍</span> HTTP GÖZLEMCİSİ
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-2">// Varsayılan Parola Sömürüsü Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step1Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step1Done ? "✓ Adım 1:" : "○ Adım 1:"}</span>
                          Varsayılan Kullanıcı Adını Girin
                        </span>
                        {step1Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Çoğu router ve ağ cihazı varsayılan yönetici adı olarak <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">admin</code> kullanır.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#3d564b]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#3d564b]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Varsayılan Şifreyi Girin
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Çoğu zaman varsayılan şifre de <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">admin</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">password</code> olur.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-sm text-[#74998a] font-mono mb-2">// HTTP POST İsteği:</div>
                      <div className="text-xs text-[#cdeede] font-mono leading-relaxed">
                        POST /login HTTP/1.1<br/>
                        Host: 192.168.1.1<br/>
                        Content-Type: application/x-www-form-urlencoded<br/>
                        <br/>
                        <span className="text-[#ffd166]">username={uVal || 'admin'}&password={pVal || 'admin'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/85 border border-[#103a26] rounded-xl font-mono text-xs leading-relaxed space-y-2">
                      <div className="text-[#5cffba]">[+] Router'a bağlantı kuruldu</div>
                      <div className="text-[#00ff88]">[+] Giriş Yanıtı:</div>
                      <div className="text-[#cdeede] ml-4">HTTP/1.1 200 OK</div>
                      <div className="text-[#cdeede] ml-4">Set-Cookie: sessionid=xyz123abc</div>
                      <div className={step2Done ? "text-[#00ff88]" : "text-[#74998a]"}>[+] Yönetici Paneli Erişimi: {step2Done ? "GRANTELENDİ ✓" : "BEKLEMEDE..."}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const u = (target.u || '').toLowerCase();
      const p = target.p || '';
      if (u === 'admin' && p === 'admin') {
        return { ok: true, msg: "Giriş Başarılı!" };
      } else {
        return { ok: false, msg: "Hata: Geçersiz kimlik bilgileri." };
      }
    }
  },
  'web-12': {
    title: 'Komut Enjeksiyonu Temelleri',
    desc: 'Ping aracında komut enjeksiyonu yaparak sistem üzerinde rasgele komut çalıştırın.',
    flag: 'siberkampus{command_injection_shell_execution}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const ipVal = target.ip || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const hasSemicolon = ipVal.includes(';');
      const hasCat = ipVal.toLowerCase().includes('cat');
      const hasFlag = ipVal.toLowerCase().includes('flag');
      const step1Done = hasSemicolon;
      const step2Done = hasSemicolon && hasCat && hasFlag;
      const step3Ready = step2Done;

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step3Ready) return;

        setTarget(t => ({ ...t, isPinging: true }));

        setTimeout(() => {
          setTarget(t => ({ ...t, isPinging: false }));
          runTarget(e);
        }, 1500);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-[#0a0e0a] rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#00ff88] mb-2">🎯 KOMUT ÇIKTI (Command Output)</div>
                  <p className="text-xs text-[#74998a] font-mono">// Flag'ı başarıyla okudunuz!</p>
                </div>

                <div className="p-3 border border-[#103a26] rounded-lg bg-black/60 font-mono text-xs text-[#cdeede] leading-relaxed space-y-2 h-64 overflow-y-auto">
                  <div className="text-[#00ff88]">$ ping -c 3 {ipVal.split(';')[0]}</div>
                  <div className="text-[#74998a]">PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.</div>
                  <div className="text-[#74998a]">64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.021 ms</div>
                  <div className="text-[#74998a] mt-3">$ cat flag.txt</div>
                  <div className="text-[#00ff88] font-bold">siberkampus{'{command_injection_shell_execution}'}</div>
                  <div className="text-[#5cffba] mt-3">[+] Sistem komutu başarıyla çalıştırıldı!</div>
                </div>
              </div>
            </div>
          );
        }

        if (target.isPinging) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '390px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Komut Çalıştırılıyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2 text-center">// Sistem çıktısı alınıyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">🌐</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">Ping Utility Aracı</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// Ağ Diagnosis Paneli</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// Hedef IP Adresi</label>
                  <input
                    value={ipVal}
                    onChange={e => setTarget(t => ({ ...t, ip: e.target.value }))}
                    placeholder="127.0.0.1 ; cat flag.txt"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-base transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full font-sans text-base font-bold py-4 rounded-xl transition-all ${step3Ready ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}
                >
                  Ping Gönder
                </button>
              </form>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Utility: ping (v4.4.1)</div>
              <div>Protokol: ICMP</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button
                  type="button"
                  onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📖</span> ADIM ADIM REHBER {!step2Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setDevTab('cmd')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'cmd' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🔍</span> KOMUT GÖZLEMCİSİ
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-2">// Komut Enjeksiyonu Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step1Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step1Done ? "✓ Adım 1:" : "○ Adım 1:"}</span>
                          Komut Ayırıcısı Ekleyin
                        </span>
                        {step1Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        IP adresinin sonuna <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">;</code> ekleyerek iki komutunu ayırın.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#3d564b]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#3d564b]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Bayrak Dosyasını Okuyun
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        İkinci komut olarak <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">cat flag.txt</code> yazarak sunucu dosyasını okuyun.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-sm text-[#74998a] font-mono mb-2">// Derlenmiş Sistem Komutu:</div>
                      <div className="text-xs text-[#cdeede] font-mono leading-relaxed bg-black/80 p-3 rounded border border-[#103a26]">
                        ping -c 3 {ipVal || '127.0.0.1 ; cat flag.txt'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-[#74998a] font-mono">// Komut Sözdizimi Analizi:</div>
                      <div className="p-4 bg-black/85 border border-[#103a26] rounded-xl font-mono text-xs leading-relaxed">
                        <div className="text-[#5cffba]">Komut 1 (Normal):</div>
                        <div className="text-[#cdeede] ml-4 mb-3">ping -c 3 127.0.0.1</div>
                        <div className="text-[#00ff88]">Komut 2 (Enjekte):</div>
                        <div className="text-[#ffd166] ml-4">cat flag.txt</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const ip = (target.ip || '').toLowerCase();
      if (ip.includes(';') && ip.includes('cat') && ip.includes('flag')) {
        return { ok: true, msg: "Komut başarıyla çalıştırıldı!" };
      } else {
        return { ok: false, msg: "Hata: Geçersiz komut enjeksiyonu." };
      }
    }
  },
  'web-13': {
    title: 'Kaynak Kod Analizi',
    desc: 'HTML kaynak kodunda gizlenen yorum satırlarından bayrağı bulun.',
    flag: 'siberkampus{html_comments_developer_secrets}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const devTab = target.devTab || 'source';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const flagInput = target.flag || '';
      const correctFlag = 'siberkampus{html_comments_developer_secrets}';
      const step1Done = devTab === 'source';
      const step2Done = step1Done && flagInput.toLowerCase().includes('html_comments');
      const step3Ready = step2Done;

      const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step3Ready) return;

        setTarget(t => ({ ...t, isSubmitting: true }));

        setTimeout(() => {
          setTarget(t => ({ ...t, isSubmitting: false }));
          runTarget(e);
        }, 1000);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-center items-center shadow-sm" style={{ height: '390px' }}>
              <div className="text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <div className="font-sans font-bold text-lg text-gray-800">Tebrikler!</div>
                <div className="text-sm text-gray-600">HTML yorum satırlarında gizlenen bayrağı bulunuz.</div>
                <div className="inline-block text-sm font-bold text-blue-600 font-mono px-4 py-3 bg-blue-50 rounded border border-blue-200">
                  {correctFlag}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">💻</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">Kurumsal Web Sitesi</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// Şirket Hakkında Sayfası</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-150 rounded-lg bg-gray-50">
                  <h3 className="font-bold text-sm text-gray-700 mb-2">Şirket Bilgisi</h3>
                  <p className="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <div className="p-4 border border-blue-150 rounded-lg bg-blue-50">
                  <p className="text-xs text-blue-700 font-mono">💡 İpucu: Sayfanın HTML kaynağını incelemek için Sağ → Kaynak Kodu Görüntüle sekmesine tıklayın.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Versiyon: 1.2.4</div>
              <div>Son Güncelleme: 2024-05-15</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button
                  type="button"
                  onClick={() => setDevTab('source')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'source' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📄</span> HTML KAYNAK KODU {!step2Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setDevTab('flag')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'flag' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🚩</span> BAYRAK DOĞRULAMA
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto text-xs md:text-sm text-[#cdeede]">
                {devTab === 'source' ? (
                  <div className="font-mono leading-relaxed space-y-1">
                    <div className="text-[#569cd6]">&lt;!DOCTYPE html&gt;</div>
                    <div className="text-[#569cd6]">&lt;html&gt;</div>
                    <div className="text-[#569cd6]">&lt;head&gt;</div>
                    <div className="text-[#74998a]">  &lt;!-- Sayfanın ana başlığı --&gt;</div>
                    <div>&nbsp;&nbsp;&lt;title&gt;Kurumsal Hakkında&lt;/title&gt;</div>
                    <div className="text-[#74998a]">  &lt;!-- TODO: SEO meta tagları ekle --&gt;</div>
                    <div>&nbsp;&nbsp;&lt;meta charset="utf-8"&gt;</div>
                    <div className="text-[#569cd6]">&lt;/head&gt;</div>
                    <div className="text-[#569cd6]">&lt;body&gt;</div>
                    <div className="text-[#74998a]">  &lt;!-- DEVELOPER KEY: siberkampus{html_comments_developer_secrets} --&gt;</div>
                    <div>&nbsp;&nbsp;&lt;h1&gt;Kurumsal Bilgiler&lt;/h1&gt;</div>
                    <div className="text-[#74998a]">  &lt;!-- BUG FIXED: Session management patched --&gt;</div>
                    <div>&nbsp;&nbsp;&lt;p&gt;Şirket hakkında bilgi metni...&lt;/p&gt;</div>
                    <div className="text-[#569cd6]">&lt;/body&gt;</div>
                    <div className="text-[#569cd6]">&lt;/html&gt;</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="text-[#cdeede] font-bold">Bulunan Bayrağı Girin:</div>
                    <input
                      value={flagInput}
                      onChange={e => setTarget(t => ({ ...t, flag: e.target.value }))}
                      placeholder="siberkampus{...}"
                      className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#00ff88] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs"
                    />
                    <button
                      type="submit"
                      className={`w-full font-bold py-2 rounded transition-all text-xs ${step3Ready ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,.3)]' : 'text-[#3d564b] bg-[#103a26] cursor-not-allowed'}`}
                    >
                      Doğrula
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const flag = (target.flag || '').toLowerCase();
      if (flag.includes('html_comments') && flag.includes('developer_secrets')) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    }
  },
  'web-14': {
    title: 'Dizin Geçişi Temelleri',
    desc: 'Dosya indirme parametresinde ../.. kullanarak üst dizinlere erişin.',
    flag: 'siberkampus{directory_traversal_root_access}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const filePath = target.file || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const hasDotDot = filePath.includes('..');
      const hasSlash = filePath.includes('/');
      const hasFlag = filePath.toLowerCase().includes('flag');
      const step1Done = hasDotDot;
      const step2Done = hasDotDot && hasSlash && hasFlag;
      const step3Ready = step2Done;

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step3Ready) return;

        setTarget(t => ({ ...t, isDownloading: true }));

        setTimeout(() => {
          setTarget(t => ({ ...t, isDownloading: false }));
          runTarget(e);
        }, 1500);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-[#0a0e0a] rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#00ff88] mb-2">📥 DOSYA İNDİRİMİ</div>
                  <p className="text-xs text-[#74998a] font-mono">// Sunucu dosyası başarıyla indirildi</p>
                </div>

                <div className="p-3 border border-[#103a26] rounded-lg bg-black/60 font-mono text-xs text-[#cdeede] leading-relaxed space-y-2">
                  <div className="text-[#00ff88]">[+] İndirme başarılı!</div>
                  <div className="text-[#5cffba]">[+] Dosya: flag.txt</div>
                  <div className="text-[#5cffba]">[+] Boyut: 52 bayt</div>
                  <div className="text-[#5cffba]">[+] Yol: /var/www/flag.txt</div>
                  <div className="border-t border-[#103a26] pt-2 mt-3 text-[#00ff88]">siberkampus{'{directory_traversal_root_access}'}</div>
                </div>
              </div>
            </div>
          );
        }

        if (target.isDownloading) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '390px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Dosya İndiriliyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2 text-center">// Sunucudan dosya okunuyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">📂</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">Dosya İndirme Servisi</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// Downloads Modülü</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 font-mono mb-2">// İndirilecek Dosya Adı</label>
                  <input
                    value={filePath}
                    onChange={e => setTarget(t => ({ ...t, file: e.target.value }))}
                    placeholder="../../flag.txt"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none font-mono text-base transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-2 font-mono">// /var/www/downloads/ tabanlı yol</p>
                </div>
                <button
                  type="submit"
                  className={`w-full font-sans text-base font-bold py-4 rounded-xl transition-all ${step3Ready ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}
                >
                  İndir
                </button>
              </form>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Sunucu: Apache/2.4.41</div>
              <div>Tabanı: /var/www/downloads/</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button
                  type="button"
                  onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📖</span> ADIM ADIM REHBER {!step2Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setDevTab('resolver')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'resolver' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🔍</span> YOL ÇÖZÜMLEYİCİ
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-2">// Dizin Geçişi Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step1Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step1Done ? "✓ Adım 1:" : "○ Adım 1:"}</span>
                          Üst Dizine Tırmanma
                        </span>
                        {step1Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Dosya adında <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">..</code> yazarak bir üst dizine gidin.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#3d564b]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#3d564b]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Sunucu Dosyasını Okuyun
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Yeterince tırmanarak sunucu kök dizinine ulaşın ve <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">flag.txt</code> dosyasını okuyun.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-sm text-[#74998a] font-mono mb-3">// Dosya Yolu Çözümü:</div>
                      <div className="text-xs text-[#cdeede] font-mono leading-relaxed space-y-2">
                        <div><span className="text-[#5cffba]">Taban Yolu:</span> /var/www/downloads/</div>
                        <div><span className="text-[#5cffba]">Kullanıcı Girdisi:</span> <span className="text-[#ffd166]">{filePath || '../../flag.txt'}</span></div>
                        <div className="border-t border-[#103a26] pt-2 mt-2">
                          <span className="text-[#00ff88]">Çözümlenen Yol:</span>
                          <div className="text-[#ffd166] mt-1">/var/www/downloads/ + {filePath || '../../flag.txt'}</div>
                          <div className="text-[#00ff88] mt-2">→ /var/www/flag.txt</div>
                          <div className={`text-sm mt-3 px-2 py-1 rounded inline-block ${step2Done ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#ff2e88]/10 text-[#ff2e88]'}`}>
                            {step2Done ? '✓ Erişim İzni Verildi' : '⚠️ Erişim Kontrol Beklemede'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const file = (target.file || '').toLowerCase();
      if (file.includes('..') && file.includes('flag')) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    }
  },
  'web-15': {
    title: 'Çerez Manipülasyonu',
    desc: 'İstemci tarafı çerezlerini değiştirerek yetki yükseltme yapın.',
    flag: 'siberkampus{cookie_tampering_privilege_escalation}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const cookieVal = target.cookie || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const hasAdmin = cookieVal.toLowerCase().includes('admin');
      const step1Done = true;
      const step2Done = hasAdmin;
      const step3Ready = step2Done;

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step3Ready) return;

        setTarget(t => ({ ...t, isRefreshing: true }));

        setTimeout(() => {
          setTarget(t => ({ ...t, isRefreshing: false }));
          runTarget(e);
        }, 1500);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></span>
                    <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">ADMIN KONTROL PANELI</span>
                  </div>
                  <span className="text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-150 font-mono font-bold">root</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border border-gray-150 rounded-lg bg-red-50">
                    <div className="text-sm font-bold text-red-700 mb-2">⚠️ Sistem Uyarısı</div>
                    <div className="text-xs text-red-600 font-mono">Yetkisiz giriş tespit edildi. Sistem administrators'a bildiriliyor...</div>
                  </div>

                  <div className="p-3 border border-gray-150 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 font-mono space-y-1">
                      <p>Kimlik: root (admin)</p>
                      <p>İzin Seviyesi: Maksimum</p>
                      <p>Son Giriş: şimdi</p>
                    </div>
                  </div>

                  <div className="p-3 border border-green-150 rounded-lg bg-green-50">
                    <div className="text-sm font-bold text-green-700 mb-1">🚩 Bayrak Elde Edildi</div>
                    <div className="inline-block text-xs font-bold text-green-600 font-mono px-2 py-1 bg-white rounded border border-green-200">
                      siberkampus{'{cookie_tampering_privilege_escalation}'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (target.isRefreshing) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '390px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Sayfa Yenileniyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2 text-center">// Çerez doğrulanıyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '390px' }}>
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 grid place-items-center mx-auto mb-2.5 text-blue-600">
                  <span className="text-lg">🛒</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800 tracking-wide">E-Ticaret Sitesi</div>
                <p className="text-sm text-gray-400 mt-1.5 font-mono">// Hoş Geldiniz, Misafir</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-700 font-bold mb-2">Mevcut Rol: <span className="text-red-600">Misafir</span></p>
                  <p className="text-xs text-gray-600">Admin paneline erişim yetkiniz yok.</p>
                </div>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 font-mono text-xs">
                  <div className="text-blue-700 font-bold mb-2">💡 İpucu:</div>
                  <div className="text-blue-600">Tarayıcı DevTools (F12) → Application → Cookies sekmesinde "role" çerezini düzenleyin.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-400 font-mono leading-relaxed space-y-1">
              <div>Rol: guest</div>
              <div>Session: active</div>
            </div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button
                  type="button"
                  onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>📖</span> ADIM ADIM REHBER {!step2Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setDevTab('cookie')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'cookie' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}
                >
                  <span>🔍</span> ÇEREZ DURUMU
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-2">// Çerez Manipülasyonu Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all border-[#103a26] bg-black/25 text-[#74998a]`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className="text-[#ffd166]">○ Adım 1:</span>
                          Çerezleri Analiz Edin
                        </span>
                        <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Tarayıcı DevTools (F12) açarak Application → Cookies kısmında <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">role=guest</code> çerezini bulun.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Çerez Değerini Değiştirin
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">role=guest</code> değerini <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">role=admin</code> olarak değiştirin.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]">
                      <div className="flex items-center gap-2 text-sm font-bold mb-2">
                        <span className="text-[#00ff88]">○ Adım 3:</span>
                        Sayfayı Yenileyin
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Aşağıdaki "Çerezi Güncelle ve Yenile" butonunu tıklayarak değişiklikleri uygulandığında admin paneline erişin.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-sm text-[#74998a] font-mono mb-3">// İstemci Tarafı Çerez Depolaması:</div>
                      <div className="text-xs text-[#cdeede] font-mono leading-relaxed space-y-2">
                        <div><span className="text-[#5cffba]">Başlangıç:</span> <span className="text-[#ff2e88]">role=guest; session=abc123</span></div>
                        <div className="border-t border-[#103a26] pt-2 mt-2">
                          <span className="text-[#ffd166]">DevTools Düzenleme Sonrası:</span>
                          <div className="text-[#00ff88] mt-1">{cookieVal || 'role=admin; session=abc123'}</div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      <div className="text-[#74998a] font-mono text-xs">// Çerez Değerini Girin:</div>
                      <input
                        value={cookieVal}
                        onChange={e => setTarget(t => ({ ...t, cookie: e.target.value }))}
                        placeholder="role=admin"
                        className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#00ff88] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs"
                      />
                      <button
                        type="submit"
                        className={`w-full font-bold py-2 rounded transition-all text-xs ${step3Ready ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,.3)]' : 'text-[#3d564b] bg-[#103a26] cursor-not-allowed'}`}
                      >
                        Çerezi Güncelle ve Yenile
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const cookie = (target.cookie || '').toLowerCase();
      if (cookie.includes('admin')) {
        return { ok: true };
      } else {
        return { ok: false };
      }
    }
  },
  'net-01': {
    title: 'Nmap ile Ağ Keşfi',
    desc: 'Sızma testinin ilk adımı keşiftir. Nmap konsolunu kullanarak hedef sistemin (10.10.84.22) açık portlarını ve servis sürümlerini tespit edin, ardından NSE scriptleriyle FTP banner\'ında gizlenen bayrağı açığa çıkarın.',
    flag: 'siberkampus{nmap_service_scan_discovered}',
    renderApp: (target, setTarget, runTarget, resp) => {
      const TARGET_IP = '10.10.84.22';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const hist = target.hist || [];
      const s1 = !!target.s1;
      const s2 = !!target.s2;
      const s3 = !!target.s3;
      const doneCount = (s1 ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0);

      const OUT_HOST =
`Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${TARGET_IP}
Host is up (0.012s latency).
MAC Address: 08:00:27:A1:B2:C3 (Oracle VirtualBox)
Nmap done: 256 IP addresses (1 host up) scanned in 2.31s`;

      const OUT_SV =
`Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${TARGET_IP}
Host is up (0.011s latency).

PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.3.4
22/tcp   open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
3306/tcp open  mysql   MySQL 5.7.21-0ubuntu0.16.04.1

Service detection performed. Nmap done: 1 IP address (1 host up) scanned in 11.40s`;

      const OUT_NSE =
`Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${TARGET_IP}
Host is up (0.011s latency).

PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.3.4
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_  banner: siberkampus{nmap_service_scan_discovered}
22/tcp   open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8
| ssh-hostkey:
|_  2048 a1:b2:c3:d4:e5:f6:07:18 (RSA)
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: SiberKampus Lab Index
3306/tcp open  mysql   MySQL 5.7.21-0ubuntu0.16.04.1

Service detection performed. Nmap done: 1 IP address (1 host up) scanned in 18.22s`;

      const runCmd = (e) => {
        if (e) e.preventDefault();
        const line = (target.cmd || '').trim();
        if (!line) return;
        const low = line.toLowerCase();
        let out = '';
        let n1 = s1, n2 = s2, n3 = s3;

        if (low === 'clear' || low === 'cls') {
          setTarget(t => ({ ...t, hist: [], cmd: '' }));
          return;
        }
        if (low === 'help') {
          out = "Bu laboratuvar 'nmap' tarama komutlarini destekler.\nAdim 1 -> nmap -sn 10.10.84.0/24   (host kesfi)\nAdim 2 -> nmap -sV 10.10.84.22      (servis/surum taramasi)\nAdim 3 -> nmap -sC -sV 10.10.84.22  (NSE scriptleri)";
        } else if (!low.startsWith('nmap')) {
          out = `'${line.split(/\s+/)[0]}' komutu bulunamadi. Kesif icin 'nmap' ile baslayan bir komut girin. ('help' yazabilirsiniz)`;
        } else if ((low.includes('-sc') || low.includes('-a') || low.includes('--script')) && low.includes(TARGET_IP)) {
          if (!n2) {
            out = `Once acik portlari ve servis surumlerini taramalisin.\nAdim 2'yi calistir: nmap -sV ${TARGET_IP}`;
          } else {
            n3 = true;
            out = OUT_NSE;
          }
        } else if (low.includes('-sv') && low.includes(TARGET_IP)) {
          n2 = true;
          out = OUT_SV;
        } else if (low.includes('-sn')) {
          n1 = true;
          out = OUT_HOST;
        } else if (low.includes(TARGET_IP)) {
          out = `Acik portlar bulundu fakat servis SURUMLERI bilinmiyor.\nSurum tespiti icin '-sV' parametresini ekle: nmap -sV ${TARGET_IP}\n\nPORT     STATE SERVICE\n21/tcp   open  ftp\n22/tcp   open  ssh\n80/tcp   open  http\n3306/tcp open  mysql`;
        } else {
          out = `Taranacak bir hedef belirtmelisin. Ornek: nmap -sV ${TARGET_IP}`;
        }
        setTarget(t => ({ ...t, hist: [...(t.hist || []), { cmd: line, out }], cmd: '', s1: n1, s2: n2, s3: n3 }));
      };

      const StepBadge = ({ done, active }) => (
        done
          ? <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
          : active
            ? <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
            : <span className="text-sm text-[#3d564b] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
      );

      const renderLeftPanel = () => (
        <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '390px' }}>
          <div className="space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s1 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`}></span>
                <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">HEDEF AĞ HARİTASI</span>
              </div>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-150 font-mono font-bold">{TARGET_IP}</span>
            </div>

            <div className="p-3 border border-gray-150 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">🖥️ {TARGET_IP}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${s1 ? 'text-emerald-600 bg-emerald-50 border border-emerald-150' : 'text-gray-400 bg-gray-100 border border-gray-200'}`}>
                  {s1 ? 'AKTİF · Host up' : 'Keşfedilmedi'}
                </span>
              </div>
            </div>

            {s2 ? (
              <div className="overflow-hidden border border-gray-150 rounded-lg bg-white shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-150 font-bold">
                    <tr><th className="p-2">PORT</th><th className="p-2">SERVİS</th><th className="p-2">SÜRÜM</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className={s3 ? 'bg-blue-50/60 text-blue-900 font-semibold' : ''}>
                      <td className="p-2">21</td><td className="p-2">ftp</td><td className="p-2">vsftpd 2.3.4 {s3 && '🚩'}</td>
                    </tr>
                    <tr><td className="p-2">22</td><td className="p-2">ssh</td><td className="p-2">OpenSSH 7.2p2</td></tr>
                    <tr><td className="p-2">80</td><td className="p-2">http</td><td className="p-2">Apache 2.4.18</td></tr>
                    <tr><td className="p-2">3306</td><td className="p-2">mysql</td><td className="p-2">MySQL 5.7.21</td></tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50 text-center text-xs text-gray-400 font-mono leading-relaxed">
                {s1
                  ? '// Host aktif. Şimdi -sV ile portları ve servis sürümlerini tara (Adım 2).'
                  : '// Henüz tarama yapılmadı. NMAP KONSOLU sekmesinde -sn ile başla (Adım 1).'}
              </div>
            )}

            {s3 && (
              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 text-center space-y-1.5">
                <div className="text-xs text-blue-800 font-medium">🎉 NSE ftp-anon scripti banner içeriğini sızdırdı:</div>
                <div className="inline-block text-sm font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 select-all">
                  siberkampus{'{nmap_service_scan_discovered}'}
                </div>
              </div>
            )}
          </div>
          <div className="pt-2.5 border-t border-gray-100 text-xs text-gray-400 font-mono flex justify-between">
            <span>Nmap 7.94</span>
            <span>Tamamlanan adım: {doneCount}/3</span>
          </div>
        </div>
      );

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}

            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm md:text-base">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!s3 && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('console')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'console' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>⌨️</span> NMAP KONSOLU
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm md:text-base text-[#cdeede] font-bold mb-1">// Ağ Keşfi (Nmap) Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all ${s1 ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : 'border-[#103a26] bg-black/25'}`}>
                      <div className="flex items-center justify-between font-bold mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={s1 ? 'text-[#00ff88]' : 'text-[#ffd166]'}>{s1 ? '✓ Adım 1:' : '○ Adım 1:'}</span>
                          Host Keşfi (Ping Taraması)
                        </span>
                        <StepBadge done={s1} active={!s1} />
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Saldırıdan önce hedefin ayakta olup olmadığını öğren. <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">-sn</code> parametresi port taramadan yalnızca ping atar ve canlı hostları bulur.
                      </p>
                      <div className="mt-2 p-2 bg-black/60 border border-[#103a26] rounded font-mono text-xs text-[#5cffba]">nmap -sn 10.10.84.0/24</div>
                      <p className="text-xs text-[#6a9955] mt-2 italic">// Gerçek hayatta: Bir /24 ağda hangi IPlerin canlı olduğunu saniyeler içinde haritalamak için kullanılır.</p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${s2 ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s1 ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                      <div className="flex items-center justify-between font-bold mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={s2 ? 'text-[#00ff88]' : s1 ? 'text-[#ffd166]' : 'text-[#3d564b]'}>{s2 ? '✓ Adım 2:' : '○ Adım 2:'}</span>
                          Port ve Servis Sürümü Taraması
                        </span>
                        <StepBadge done={s2} active={s1 && !s2} />
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">-sV</code> açık portların üzerinde çalışan <b>servis sürümlerini</b> tespit eder. Sürüm bilgisi (örn. vsftpd 2.3.4) doğrudan bilinen exploit aramanın anahtarıdır.
                      </p>
                      <div className="mt-2 p-2 bg-black/60 border border-[#103a26] rounded font-mono text-xs text-[#5cffba]">nmap -sV 10.10.84.22</div>
                      <p className="text-xs text-[#6a9955] mt-2 italic">// Gerçek hayatta: Eski sürümler (vsftpd 2.3.4 gibi) çoğu zaman herkese açık bir CVEye sahiptir.</p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${s3 ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s2 ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                      <div className="flex items-center justify-between font-bold mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={s3 ? 'text-[#00ff88]' : s2 ? 'text-[#ffd166]' : 'text-[#3d564b]'}>{s3 ? '✓ Adım 3:' : '○ Adım 3:'}</span>
                          NSE Scriptleri ile Derin Tarama
                        </span>
                        <StepBadge done={s3} active={s2 && !s3} />
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">-sC</code> varsayılan NSE scriptlerini çalıştırır. <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">ftp-anon</code> scripti anonim FTP girişini test eder ve <b>banner içinde gizlenen bayrağı</b> açığa çıkarır.
                      </p>
                      <div className="mt-2 p-2 bg-black/60 border border-[#103a26] rounded font-mono text-xs text-[#5cffba]">nmap -sC -sV 10.10.84.22</div>
                      <p className="text-xs text-[#6a9955] mt-2 italic">// Gerçek hayatta: NSE scriptleri bannerları, anonim erişimi ve zafiyetleri otomatik tespit ederek manuel işi azaltır.</p>
                    </div>

                    <button type="button" onClick={() => setDevTab('console')} className="w-full mt-1 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_18px_rgba(0,255,136,.3)] transition-all">
                      ⌨️ NMAP KONSOLUNA GEÇ →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-[#74998a] font-mono">// kali@siberkampus — nmap konsolu</div>
                      <div className="font-mono text-xs text-[#ffd166]">İlerleme: {doneCount}/3</div>
                    </div>
                    <div className="flex-1 min-h-[260px] max-h-[300px] overflow-y-auto p-3.5 bg-black/85 border border-[#103a26] rounded-xl font-mono text-xs leading-relaxed shadow-inner">
                      <div className="text-[#5cffba]">Nmap interaktif konsolu hazır. 'help' yazabilirsin.</div>
                      {hist.length === 0 && (
                        <div className="text-[#3d564b] mt-1">// İlk komutu dene: nmap -sn 10.10.84.0/24</div>
                      )}
                      {hist.map((h, i) => (
                        <div key={i} className="mt-2">
                          <div className="text-[#00ff88]"><span className="text-[#74998a]">$</span> {h.cmd}</div>
                          <pre className="text-[#cdeede] whitespace-pre-wrap break-all mt-0.5">{h.out}</pre>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={runCmd} className="mt-3 flex gap-2">
                      <span className="grid place-items-center text-[#00ff88] font-mono font-bold px-1">$</span>
                      <input
                        value={target.cmd || ''}
                        onChange={e => setTarget(t => ({ ...t, cmd: e.target.value }))}
                        placeholder="nmap -sn 10.10.84.0/24"
                        autoComplete="off" spellCheck="false"
                        className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                      />
                      <button type="submit" className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-4 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,.3)] transition-all">Çalıştır</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => (target && target.s3) ? { ok: true } : { ok: 'info' }
  }
};

const SysTerminalSim = ({ roomId }) => {
  const isWin = roomId === 'sys-06';
  const initialPrompt = isWin ? 'C:\\Users\\editor>' : (roomId === 'sys-09' ? 'root@docker-container:/# ' : 'editor@ubuntu:~$ ');
  const [history, setHistory] = useState([
    `Siber Kampüs Sistem Sömürüsü Laboratuvarı [Sürüm 2.4.1]`,
    `Hedef sistem bağlantısı kuruldu.`,
    isWin 
      ? `Microsoft Windows [Version 10.0.19044] (c) Microsoft Corporation. All rights reserved.\nC:\\Users\\editor> (Yardım için 'type hint.txt' yazın)`
      : `Linux ubuntu-server 4.15.0-142-generic #146-Ubuntu SMP x86_64 x86_64 GNU/Linux\neditor@ubuntu:~$ (Yardım için 'cat hint.txt' yazın)`,
  ]);
  const [currentDir, setCurrentDir] = useState(isWin ? 'C:\\Users\\editor' : (roomId === 'sys-09' ? '/' : '/home/editor'));
  const [username, setUsername] = useState(isWin ? 'editor' : (roomId === 'sys-09' ? 'root' : 'editor'));
  const [cmdInput, setCmdInput] = useState('');
  const [pathEnv, setPathEnv] = useState('/usr/bin:/bin');
  const [cronJobWritten, setCronJobWritten] = useState(false);
  const [tmpTarPayload, setTmpTarPayload] = useState('');
  const [tarExecutable, setTarExecutable] = useState(false);

  const getPrompt = () => {
    if (isWin) {
      return `${currentDir}${username === 'SYSTEM' ? '#' : '>'}`;
    }
    return `${username}@ubuntu:${currentDir}${username === 'root' ? '#' : '$'} `;
  };

  const handleCommandSubmit = (e) => {
    if (e) e.preventDefault();
    const line = cmdInput.trim();
    if (!line) return;

    const newHistory = [...history, getPrompt() + line];
    const parts = line.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    
    const print = (text) => {
      newHistory.push(text);
    };

    if (isWin) {
      // Windows CMD simulation
      switch (cmd.toLowerCase()) {
        case 'help':
          print("Desteklenen komutlar: dir, cd, type, whoami, cls, PrintSpoofer.exe");
          break;
        case 'cls':
          setHistory([]);
          setCmdInput('');
          return;
        case 'whoami':
          if (args[0] === '/priv') {
            print("Privilege Name                Description                               State\n============================= ========================================= ========\nSeChangeNotifyPrivilege       Bypass traverse checking                  Enabled\nSeImpersonatePrivilege        Impersonate a client after authentication Enabled");
          } else {
            print(username === 'SYSTEM' ? 'nt authority\\system' : 'desktop-a128\\editor');
          }
          break;
        case 'dir':
          if (currentDir === 'C:\\Users\\editor') {
            print(" Directory of C:\\Users\\editor\n\n06/05/2026  19:28    <DIR>          .\n06/05/2026  19:28    <DIR>          ..\n06/05/2026  19:28                64 hint.txt\n06/05/2026  19:28            24,576 PrintSpoofer.exe\n               2 File(s)         24,640 bytes");
          } else if (currentDir === 'C:\\Users\\Administrator\\Desktop') {
            if (username === 'SYSTEM') {
              print(" Directory of C:\\Users\\Administrator\\Desktop\n\n06/05/2026  19:28    <DIR>          .\n06/05/2026  19:28    <DIR>          ..\n06/05/2026  19:28                52 flag.txt");
            } else {
              print("Access is denied.");
            }
          } else {
            print(" Directory of " + currentDir + "\n\n06/05/2026  19:28    <DIR>          .\n06/05/2026  19:28    <DIR>          ..");
          }
          break;
        case 'cd':
          const targetDir = args.join(' ');
          if (!targetDir) {
            print(currentDir);
          } else if (targetDir === '..' || targetDir === '../') {
            if (currentDir === 'C:\\Users\\editor') setCurrentDir('C:\\Users');
            else if (currentDir === 'C:\\Users\\Administrator\\Desktop') setCurrentDir('C:\\Users\\Administrator');
            else if (currentDir === 'C:\\Users\\Administrator') setCurrentDir('C:\\Users');
            else if (currentDir === 'C:\\Users') setCurrentDir('C:\\');
          } else if (targetDir.toLowerCase() === 'administrator') {
            if (currentDir === 'C:\\Users') {
              if (username === 'SYSTEM') setCurrentDir('C:\\Users\\Administrator');
              else print("Access is denied.");
            } else {
              print("The system cannot find the path specified.");
            }
          } else if (targetDir.toLowerCase() === 'desktop' && currentDir === 'C:\\Users\\Administrator') {
            setCurrentDir('C:\\Users\\Administrator\\Desktop');
          } else if (targetDir.toLowerCase() === 'editor' && currentDir === 'C:\\Users') {
            setCurrentDir('C:\\Users\\editor');
          } else if (targetDir.toLowerCase() === 'c:\\') {
            setCurrentDir('C:\\');
          } else {
            print("The system cannot find the path specified.");
          }
          break;
        case 'type':
          const fileToType = args[0] || '';
          if (fileToType.toLowerCase() === 'hint.txt' && currentDir === 'C:\\Users\\editor') {
            print("Sisteme Administrator olarak sızmak için SeImpersonatePrivilege zafiyetinden yararlan.\nKlasörde PrintSpoofer.exe aracı bulunmaktadır.\nKullanım: PrintSpoofer.exe -i -c cmd");
          } else if (fileToType.toLowerCase() === 'flag.txt' && currentDir === 'C:\\Users\\Administrator\\Desktop') {
            if (username === 'SYSTEM') {
              print("TEBRİKLER! Windows Privilege Escalation Başarılı!\nBayrak: siberkampus{windows_printspoofer_system_escalated}");
            } else {
              print("Access is denied.");
            }
          } else if (fileToType.toLowerCase() === 'c:\\users\\administrator\\desktop\\flag.txt') {
            if (username === 'SYSTEM') {
              print("TEBRİKLER! Windows Privilege Escalation Başarılı!\nBayrak: siberkampus{windows_printspoofer_system_escalated}");
            } else {
              print("Access is denied.");
            }
          } else {
            print("The system cannot find the file specified.");
          }
          break;
        case 'printspoofer.exe':
          if (args.join(' ') === '-i -c cmd') {
            setUsername('SYSTEM');
            setCurrentDir('C:\\Windows\\system32');
            print("[+] Impersonation token active.\n[+] Spawned SYSTEM command prompt successfully.");
          } else {
            print("PrintSpoofer v1.0 - Impersonate SYSTEM via Named Pipes\nUsage: PrintSpoofer.exe -i -c cmd");
          }
          break;
        default:
          print(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
      }
    } else {
      // Linux Shell Simulation
      switch (cmd.toLowerCase()) {
        case 'help':
          print("Desteklenen komutlar: ls, cd, cat, whoami, find, gcc, echo, export, chmod, uname, clear");
          break;
        case 'clear':
          setHistory([]);
          setCmdInput('');
          return;
        case 'whoami':
          print(username);
          break;
        case 'uname':
          if (args[0] === '-a') {
            print("Linux ubuntu 3.19.0-73-generic #81-Ubuntu SMP Wed Oct 12 20:19:08 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux");
          } else {
            print("Linux");
          }
          break;
        case 'ls':
          if (currentDir === '/home/editor') {
            if (roomId === 'sys-01') {
              print("hint.txt  gizli_dizin");
            } else if (roomId === 'sys-02') {
              print("find_me.txt");
            } else if (roomId === 'sys-03') {
              print("exploit.c");
            } else if (roomId === 'sys-05') {
              print("run_backup");
            } else if (roomId === 'sys-07') {
              print("vuln.c  vuln");
            } else if (roomId === 'sys-08') {
              print("vuln");
            } else {
              print("hint.txt");
            }
          } else if (currentDir === '/home/editor/gizli_dizin' && roomId === 'sys-01') {
            print("flag.txt");
          } else if (currentDir === '/root') {
            if (username === 'root') {
              print("flag.txt");
            } else {
              print("ls: cannot open directory '/root': Permission denied");
            }
          } else if (currentDir === '/etc') {
            print("passwd  crontab  hosts");
          } else if (currentDir === '/opt') {
            if (roomId === 'sys-04') {
              print("cleanup.sh");
            } else if (roomId === 'sys-05') {
              print("run_backup");
            } else {
              print("");
            }
          } else if (currentDir === '/tmp') {
            let tmpFiles = [];
            if (tmpTarPayload) tmpFiles.push("tar");
            print(tmpFiles.join("  "));
          } else if (currentDir === '/') {
            print("bin  boot  dev  etc  home  lib  mnt  opt  root  sys  tmp  usr  var");
          } else if (currentDir === '/mnt' && roomId === 'sys-09') {
            print("host");
          } else if (currentDir === '/mnt/host' && roomId === 'sys-09') {
            print("root  etc  home  var");
          } else if (currentDir === '/mnt/host/root' && roomId === 'sys-09') {
            print("flag.txt");
          } else {
            print("");
          }
          break;
        case 'cd':
          const target = args[0] || '~';
          if (target === '~') {
            setCurrentDir('/home/editor');
          } else if (target === '..') {
            if (currentDir === '/home/editor/gizli_dizin') setCurrentDir('/home/editor');
            else if (currentDir === '/home/editor') setCurrentDir('/home');
            else if (currentDir === '/home') setCurrentDir('/');
            else if (currentDir === '/root') setCurrentDir('/');
            else if (currentDir === '/etc') setCurrentDir('/');
            else if (currentDir === '/opt') setCurrentDir('/');
            else if (currentDir === '/tmp') setCurrentDir('/');
            else if (currentDir === '/mnt/host/root') setCurrentDir('/mnt/host');
            else if (currentDir === '/mnt/host') setCurrentDir('/mnt');
            else if (currentDir === '/mnt') setCurrentDir('/');
          } else if (target === '/' || target === '/etc' || target === '/opt' || target === '/tmp' || target === '/root' || target === '/mnt') {
            if (target === '/root' && username !== 'root') {
              print("-bash: cd: /root: Permission denied");
            } else {
              setCurrentDir(target);
            }
          } else if (target === 'gizli_dizin' && currentDir === '/home/editor' && roomId === 'sys-01') {
            setCurrentDir('/home/editor/gizli_dizin');
          } else if (target === 'host' && currentDir === '/mnt' && roomId === 'sys-09') {
            setCurrentDir('/mnt/host');
          } else if (target === 'root' && currentDir === '/mnt/host' && roomId === 'sys-09') {
            setCurrentDir('/mnt/host/root');
          } else {
            print(`-bash: cd: ${target}: No such file or directory`);
          }
          break;
        case 'cat':
          const filename = args[0] || '';
          if (!filename) {
            print("Usage: cat <filename>");
            break;
          }
          // Path resolution
          let fullpath = filename;
          if (!filename.startsWith('/')) {
            fullpath = currentDir + (currentDir === '/' ? '' : '/') + filename;
          }

          if (fullpath === '/home/editor/hint.txt') {
            if (roomId === 'sys-01') print("Bayrak gizli_dizin/flag.txt dosyasında. 'cd gizli_dizin' ve 'cat flag.txt' kullan.");
            else print("Bu laboratuvarın amacına göre sistemde zafiyet araştır.");
          } else if (fullpath === '/home/editor/find_me.txt' && roomId === 'sys-02') {
            print("SUID izinli python dosyasını bul ve exploit et: python -c \"import os; os.setuid(0); os.system('/bin/sh')\"");
          } else if (fullpath === '/home/editor/gizli_dizin/flag.txt' && roomId === 'sys-01') {
            print("siberkampus{linux_command_line_basics_mastered}");
          } else if (fullpath === '/root/flag.txt') {
            if (username === 'root') {
              if (roomId === 'sys-02') print("siberkampus{suid_privesc_python_shell_achieved}");
              else if (roomId === 'sys-03') print("siberkampus{dirty_cow_kernel_compromised}");
              else if (roomId === 'sys-04') print("siberkampus{cron_job_hijack_privesc_complete}");
              else if (roomId === 'sys-05') print("siberkampus{path_variable_hijacked_tar_exploit}");
              else if (roomId === 'sys-08') print("siberkampus{rop_chain_libc_system_bypass_nx}");
              else if (roomId === 'sys-09') print("siberkampus{container_escape_privileged_mount_breakout}");
              else if (roomId === 'sys-10') print("siberkampus{initial_access_to_root_system_compromised}");
              else print("siberkampus{root_flag_solved}");
            } else {
              print("cat: /root/flag.txt: Permission denied");
            }
          } else if (fullpath === '/home/editor/exploit.c' && roomId === 'sys-03') {
            print("#include <stdio.h>\n#include <unistd.h>\n// DirtyCOW Linux Kernel Exploit\n// Compiling: gcc exploit.c -o exploit\nvoid main() {\n  setuid(0); setgid(0);\n  printf(\"[+] Exploiting DirtyCOW kernel...\\n\");\n  printf(\"[+] Spawned root shell!\\n\");\n  execl(\"/bin/sh\", \"sh\", NULL);\n}");
          } else if (fullpath === '/etc/crontab' && roomId === 'sys-04') {
            print("SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n# m h dom mon dow user  command\n*/1 * * * * root /opt/cleanup.sh");
          } else if (fullpath === '/opt/cleanup.sh' && roomId === 'sys-04') {
            print("#!/bin/sh\n# Her dakika root yetkisiyle çalışan temizlik betiği\nrm -rf /tmp/cache/*");
          } else if (fullpath === '/tmp/flag' && roomId === 'sys-04') {
            print("siberkampus{cron_job_hijack_privesc_complete}");
          } else if (fullpath === '/mnt/host/root/flag.txt' && roomId === 'sys-09') {
            print("siberkampus{container_escape_privileged_mount_breakout}");
          } else {
            print(`cat: ${filename}: No such file or directory`);
          }
          break;
        case 'find':
          const findArgs = args.join(' ');
          if (findArgs.includes('-perm') && (findArgs.includes('-u=s') || findArgs.includes('-4000')) && roomId === 'sys-02') {
            print("/usr/bin/passwd\n/usr/bin/chsh\n/usr/bin/gpasswd\n/usr/bin/python\n/usr/bin/sudo");
          } else {
            print("find: paths must precede expression");
          }
          break;
        case 'gcc':
          if (roomId === 'sys-03' && args.join(' ').includes('exploit.c') && args.join(' ').includes('-o exploit')) {
            print("[+] Compiling DirtyCOW exploit...\n[+] Compiled successfully. Output: ./exploit");
          } else {
            print("gcc: error: no input files");
          }
          break;
        case './exploit':
          if (roomId === 'sys-03') {
            setUsername('root');
            print("[+] Exploiting DirtyCOW kernel...\n[+] Spawned root shell! (Prompt changed to root@ubuntu:~#)");
          } else {
            print("-bash: ./exploit: No such file or directory");
          }
          break;
        case 'python':
        case 'python3':
          const pyArgs = args.join(' ');
          if (roomId === 'sys-02' && pyArgs.includes('setuid(0)') && pyArgs.includes('system') && (pyArgs.includes('/bin/sh') || pyArgs.includes('bash'))) {
            setUsername('root');
            print("[+] uid=0(root) gid=0(root) groups=0(root)\n[+] Spawned root python interactive shell.");
          } else {
            print("Python 3.8.10 (default, Nov 26 2021, 20:14:08)\n>>> ");
          }
          break;
        case 'echo':
          const echoArgs = args.join(' ');
          if (roomId === 'sys-04' && (echoArgs.includes('>> /opt/cleanup.sh') || echoArgs.includes('> /opt/cleanup.sh'))) {
            setCronJobWritten(true);
            print("[+] Wrote payload to /opt/cleanup.sh. (It will execute next minute as root)");
          } else if (roomId === 'sys-05' && (echoArgs.includes('> /tmp/tar') || echoArgs.includes('>> /tmp/tar'))) {
            setTmpTarPayload(echoArgs);
            print("[+] Created mock tar script in /tmp/tar");
          } else {
            print(args.join(' ').replace(/['"]/g, ''));
          }
          break;
        case 'chmod':
          if (roomId === 'sys-05' && args[0] === '+x' && args[1] === '/tmp/tar') {
            setTarExecutable(true);
            print("[+] /tmp/tar is now executable.");
          } else {
            print("");
          }
          break;
        case 'export':
          if (roomId === 'sys-05' && args[0].includes('PATH=')) {
            setPathEnv(args[0].split('=')[1]);
            print(`[+] PATH updated to: ${args[0].split('=')[1]}`);
          } else {
            print(`declare -x PATH="${pathEnv}"`);
          }
          break;
        case '/opt/run_backup':
        case './run_backup':
          if (roomId === 'sys-05') {
            print("[+] Initializing system backup...");
            if (pathEnv.startsWith('/tmp') && tarExecutable) {
              print("[+] Hijacked! Executing custom tar binary as root:");
              print("siberkampus{path_variable_hijacked_tar_exploit}");
            } else {
              print("[+] Creating backup archive of /home/editor in /tmp/backup.tar...");
              print("tar: /tmp/backup.tar: Created successfully.");
            }
          } else {
            print("-bash: run_backup: command not found");
          }
          break;
        case './vuln':
          if (roomId === 'sys-07') {
            const vulnArg = args.join(' ');
            if (vulnArg.length > 70 && (vulnArg.includes('\\x') || vulnArg.includes('0x'))) {
              print("[+] Overwriting RIP...\n[+] Jump to win() successful!\nFlag: siberkampus{stack_buffer_overflow_rip_control}");
            } else {
              print("Enter input: ");
              if (vulnArg) {
                if (vulnArg.length > 64) print("*** stack smashing detected ***: terminated\nAborted (core dumped)");
                else print("Input received: " + vulnArg);
              }
            }
          } else if (roomId === 'sys-08') {
            const vulnArg = args.join(' ');
            if (vulnArg.length > 70 && (vulnArg.includes('pop') || vulnArg.includes('system') || vulnArg.includes('libc'))) {
              setUsername('root');
              print("[+] Libc leaked successfully. system() address: 0x7ffff7a3f4e0\n[+] Overwriting RIP with libc chain...\n[+] Spawned root shell!");
            } else {
              print("Enter input: ");
            }
          } else {
            print("-bash: ./vuln: No such file or directory");
          }
          break;
        case 'fdisk':
        case 'lsblk':
          if (roomId === 'sys-09') {
            print("NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT\nsda       8:0    0   80G  0 disk \n├─sda1    8:1    0   79G  0 part / (host system)\nsr0      11:0    1 1024M  0 rom  ");
          } else {
            print("fdisk: command not found");
          }
          break;
        case 'mount':
          if (roomId === 'sys-09' && args[0] === '/dev/sda1' && args[1] === '/mnt') {
            setCurrentDir('/mnt');
            print("[+] Mounted /dev/sda1 onto /mnt successfully.\n[+] Escape path active.");
          } else {
            print("mount: permission denied");
          }
          break;
        default:
          print(`-bash: ${cmd}: command not found`);
      }
    }

    // Cron job simulation check for sys-04
    if (roomId === 'sys-04' && cronJobWritten && cmd !== 'echo') {
      newHistory.push("[+] *Cron daemon ran /opt/cleanup.sh as root*");
      newHistory.push("[+] /tmp/flag created with flag content.");
      setCronJobWritten(false); // only run once
    }

    setHistory(newHistory);
    setCmdInput('');
  };

  return (
    <div className="p-5 font-mono text-[11px] leading-relaxed text-[#cdeede] bg-[#020806] rounded-xl border border-[#103a26]">
      <div className="h-64 overflow-y-auto space-y-1 p-2 bg-black/40 border border-[#0c2719] rounded-lg mb-4 text-left">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap text-[#74998a]">
            {line.startsWith('editor@') || line.startsWith('root@') || line.startsWith('C:\\') ? (
              <span className="text-[#00ff88]">{line}</span>
            ) : line.includes('siberkampus{') || line.includes('TEBRİKLER') ? (
              <span className="text-[#5cffba] font-bold">{line}</span>
            ) : line.includes('error') || line.includes('denied') || line.includes('not found') ? (
              <span className="text-[#ff2e88]">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommandSubmit} className="flex gap-2">
        <span className="text-[#00ff88] font-bold text-xs">{getPrompt()}</span>
        <input 
          value={cmdInput} 
          onChange={e => setCmdInput(e.target.value)} 
          placeholder="Komut yazın (örn: help)..." 
          className="flex-1 bg-transparent border-b border-[#103a26] text-[#00ff88] focus:border-[#00ff88] focus:outline-none font-mono text-xs" 
        />
        <button type="submit" className="text-xs font-bold text-[#021008] bg-[#00ff88] px-3 py-1 rounded hover:shadow-[0_0_10px_#00ff88] transition-all">Gönder</button>
      </form>
    </div>
  );
};

const ChallengeRunner = ({ roomId, config, target, setTarget, runTarget, resp, isWin }) => {
  return config.renderApp(target, setTarget, runTarget, resp, isWin);
};

const TypingText = ({ text, speed = 15, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setShowCursor(true);
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setShowCursor(false);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {showCursor && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#00ff88] animate-pulse align-middle font-mono">█</span>
      )}
    </span>
  );
};

/* ============ DERS ÖNCESİ MAKALE (Eğitici Brifing) ============ */
const ROOM_ARTICLES = window.ROOM_ARTICLES || {};

const buildArticleFromInfo = (room, info) => ({
  title: room.name,
  readTime: "~1 dk okuma",
  tagline: "Göreve başlamadan önce ne yapacağını ve neden yapacağını anla.",
  intro: "Bu göreve dalmadan önce kısa bir hazırlık yapalım. Aşağıda bu derste tam olarak ne öğreneceğini, bunu neden yaptığını ve öğrendiklerini gerçek bir sızma testinde nerede kullanacağını bulacaksın. Hazır olduğunda operasyonu başlat.",
  sections: [
    { icon: "🎯", h: "Bu Derste Ne Öğreneceksin?", body: (info.goals && info.goals.length ? info.goals.map(g => "• " + g) : ["• Hedef sistemdeki zafiyeti keşfetmek", "• Zafiyeti güvenli bir ortamda sömürmek", "• Bayrağı ele geçirip doğrulamak"]) },
    { icon: "⚡", h: "Gerçek Hayatta Nerede İşine Yarar?", body: [info.realWorld || "Bu teknik gerçek sızma testlerinde sıkça karşına çıkar ve sistemleri savunurken nelere dikkat etmen gerektiğini öğretir."] }
  ],
  glossary: [],
  closing: "Hazırsan operasyonu başlat ve öğrendiklerini uygula. Bol şans! 🚀"
});

// Karakter-karakter, siber decode/matrix temalı üst seviye yazım efekti
const GlowType = ({ text, speed = 12, instant = false, onDone, big = false }) => {
  const [n, setN] = useState(instant ? text.length : 0);
  const [scrambleTick, setScrambleTick] = useState(0);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    if (instant) { setN(text.length); if (doneRef.current) doneRef.current(); return; }
    setN(0);
    let active = true;
    let index = 0;

    const typeNext = () => {
      if (!active) return;
      if (index >= text.length) {
        if (doneRef.current) doneRef.current();
        return;
      }
      index++;
      setN(index);

      const char = text[index - 1];
      let delay = speed;
      if (char === '.' || char === '?' || char === '!') {
        delay = 280;
      } else if (char === ',' || char === ';') {
        delay = 140;
      } else if (char === ' ') {
        delay = speed / 2;
      } else {
        delay = Math.max(4, speed + (Math.random() * 8 - 3));
      }
      setTimeout(typeNext, delay);
    };

    const scrambleId = setInterval(() => {
      setScrambleTick(t => t + 1);
    }, 45);

    typeNext();
    return () => {
      active = false;
      clearInterval(scrambleId);
    };
  }, [text, speed, instant]);

  const finished = n >= text.length;
  const scrambleChars = ['0', '1', 'X', '#', '%', '&', '*', '_', '?', '$', '@', '█', '░', '▒'];
  let processedText = text.slice(0, n);
  if (!finished && !instant) {
    let charArr = processedText.split('');
    const len = charArr.length;
    for (let j = Math.max(0, len - 3); j < len; j++) {
      if (charArr[j] && charArr[j] !== ' ' && charArr[j] !== '\n') {
        const randIdx = (j + scrambleTick) % scrambleChars.length;
        charArr[j] = scrambleChars[randIdx];
      }
    }
    processedText = charArr.join('');
  }

  const lines = processedText.length ? processedText.split('\n') : [''];
  return (
    <div className="space-y-2.5">
      {lines.map((ln, idx) => {
        const isLastLine = idx === lines.length - 1;
        const bullet = ln.trim().startsWith('•');
        const content = bullet ? ln.replace(/^\s*•\s*/, '') : ln;
        const cursor = (!finished && isLastLine) ? <span className="art-cursor">▍</span> : null;
        if (bullet) {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-[#cdeede] text-[15px] leading-relaxed">
              <span className="text-[#00ff88] mt-0.5">▸</span><span>{content}{cursor}</span>
            </div>
          );
        }
        return (
          <p key={idx} className={(big ? "text-[#cdeede] text-[17px] md:text-[19px] font-disp" : "text-[#9fc4b5] text-[15px]") + " leading-relaxed"}>
            {content}{cursor}
          </p>
        );
      })}
    </div>
  );
};

// Sıralı kart sarmalayıcı: belirir, aktifken görünüme kayar, yapı kartlarında otomatik ilerler
const ArticleCard = ({ active, scroll = true, autoAdvance = null, onAdvance, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (active && scroll && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [active]);
  useEffect(() => {
    if (active && autoAdvance != null && onAdvance) {
      const t = setTimeout(onAdvance, autoAdvance);
      return () => clearTimeout(t);
    }
  }, [active]);
  return <div ref={ref} className="art-card-in">{children}</div>;
};

// Matrix tarzı parçalı gelip birleşen deşifre efekti ile görsel yükleme bileşeni
const MatrixImageReveal = ({ src, className }) => {
  const cols = 8;
  const rows = 10;
  const [assembled, setAssembled] = useState(false);
  const [flickerTick, setFlickerTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 80);
    const interval = setInterval(() => {
      setFlickerTick(tick => tick + 1);
    }, 75);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const cells = useMemo(() => {
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const startX = (Math.random() - 0.5) * 350;
        const startY = (Math.random() - 0.5) * 350;
        const startRotate = (Math.random() - 0.5) * 360;
        const startScale = 0.1 + Math.random() * 0.3;
        const delay = Math.random() * 500;
        const duration = 800 + Math.random() * 800;
        list.push({
          id, r, c, startX, startY, startRotate, startScale, delay, duration
        });
      }
    }
    return list;
  }, []);

  const chars = ['0', '1', 'X', '#', '%', '&', '*', '_', '?', '$', '@', '█', '░', '▒'];

  return (
    <div className="relative w-full h-full bg-[#020806] overflow-hidden">
      {cells.map(cell => {
        const cellDelay = cell.delay;
        const cellDuration = cell.duration;

        const cellStyle = {
          position: 'absolute',
          width: `${100 / cols}%`,
          height: `${100 / rows}%`,
          left: `${cell.c * (100 / cols)}%`,
          top: `${cell.r * (100 / rows)}%`,
          overflow: 'hidden',
          border: assembled ? '1px solid transparent' : '1px solid rgba(0, 255, 136, 0.35)',
          boxShadow: assembled ? 'none' : '0 0 10px rgba(0, 255, 136, 0.45)',
          transform: assembled 
            ? 'translate3d(0px, 0px, 0) rotate(0deg) scale(1)' 
            : `translate3d(${cell.startX}px, ${cell.startY}px, 0) rotate(${cell.startRotate}deg) scale(${cell.startScale})`,
          opacity: assembled ? 1 : 0,
          transition: `
            transform ${cellDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${cellDelay}ms,
            opacity ${cellDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${cellDelay}ms,
            border-color ${cellDuration * 0.4}ms ease-out ${cellDelay + cellDuration * 0.6}ms,
            box-shadow ${cellDuration * 0.4}ms ease-out ${cellDelay + cellDuration * 0.6}ms
          `
        };

        const imgStyle = {
          position: 'absolute',
          width: `${cols * 100}%`,
          height: `${rows * 100}%`,
          left: `-${cell.c * 100}%`,
          top: `-${cell.r * 100}%`,
          backgroundImage: `url(${src})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        };

        const overlayStyle = {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(2, 8, 6, 0.6)',
          color: '#00ff88',
          fontFamily: 'monospace',
          fontSize: '9px',
          textShadow: '0 0 5px #00ff88',
          pointerEvents: 'none',
          opacity: assembled ? 0 : 1,
          transition: `opacity ${cellDuration * 0.6}ms ease-out ${cellDelay + cellDuration * 0.4}ms`
        };

        const char = chars[(cell.id + flickerTick) % chars.length];

        return (
          <div key={cell.id} style={cellStyle}>
            <div style={imgStyle} className="opacity-90 mix-blend-lighten" />
            <div style={overlayStyle}>
              {char}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Düz metinleri JSX etiketleri dışı sade biçimde yazan raw span typist
const HeroGlowType = ({ text, speed = 12, instant = false, onDone }) => {
  const [n, setN] = useState(instant ? text.length : 0);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    if (instant) { setN(text.length); if (doneRef.current) doneRef.current(); return; }
    setN(0);
    let active = true;
    let index = 0;
    const typeNext = () => {
      if (!active) return;
      if (index >= text.length) {
        if (doneRef.current) doneRef.current();
        return;
      }
      index++;
      setN(index);
      setTimeout(typeNext, speed);
    };
    typeNext();
    return () => { active = false; };
  }, [text, speed, instant]);

  return <span>{text.slice(0, n)}{n < text.length && <span className="art-cursor">▍</span>}</span>;
};

const RoomArticlePage = ({ navigate, data }) => {
  const room = data || { name: 'SQL Injection Temelleri', cat: 'Web Exploitation', difficulty: 'Başlangıç', stars: 2, points: 50, id: 'web-01' };
  const parentCat = window.SK_CATEGORIES.find(c => c.rooms.some(r => r.id === room.id)) || window.SK_CATEGORIES[0];
  const info = (window.MENTOR_LESSONS_INFO && window.MENTOR_LESSONS_INFO[room.id]) || { goals: [], realWorld: '' };
  const article = ROOM_ARTICLES[room.id] || buildArticleFromInfo(room, info);

  const [step, setStep] = useState(0);
  const [instantAll, setInstantAll] = useState(false);
  const [mentorName, setMentorName] = useState('Siber Mentör');
  const [titleDone, setTitleDone] = useState(false);
  const [taglineDone, setTaglineDone] = useState(false);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { if (d && d.mentorName) setMentorName(d.mentorName); }).catch(() => {});
  }, []);
  useEffect(() => { 
    setStep(0); 
    setInstantAll(false); 
    setTitleDone(false);
    setTaglineDone(false);
    window.scrollTo(0, 0); 
  }, [room.id]);

  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };
  const startOp = () => navigate('room', { ...room, cameFromArticle: true });

  // Sıralı yazılacak kartları kur (her biri tek tek yazılarak gelir)
  const cards = [];
  cards.push({ key: 'intro', kind: 'intro', body: article.intro });
  (article.sections || []).forEach((s, i) => cards.push({ key: 'sec' + i, kind: 'prose', icon: s.icon, heading: s.h, body: (s.body || []).join('\n') }));
  if (article.commandAnatomy) cards.push({ key: 'cmd', kind: 'cmd' });
  if (article.glossary && article.glossary.length) cards.push({ key: 'gloss', kind: 'gloss' });
  cards.push({ key: 'closing', kind: 'closing', body: article.closing });

  const total = cards.length;
  const advance = () => setStep(s => Math.min(total, s + 1));
  const shownCount = instantAll ? total : Math.min(step + 1, total);

  const renderProseCard = (c, i, isActive, content) => {
    const typing = isActive && !instantAll;
    if (c.kind === 'intro') {
      return (
        <div className={"relative border-l-2 pl-5 transition-colors duration-500 " + (typing ? "border-[#00ff88]" : "border-[#00ff88]/40")}>
          {content}
        </div>
      );
    }
    return (
      <section className={"rounded-2xl border p-6 transition-all duration-500 " + (c.kind === 'closing' ? (typing ? "border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.15)] text-center" : "border-[#00ff88]/25 text-center") : (typing ? "border-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.12)]" : "border-[#103a26]")) + (typing ? " art-typing" : "")} style={{ background: c.kind === 'closing' ? 'radial-gradient(600px 200px at 50% 0%, rgba(0,255,136,.08), transparent), linear-gradient(165deg,#07150e,#04100a)' : 'linear-gradient(165deg,#07150e,#04100a)' }}>
        {c.heading && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{c.icon}</span>
            <h2 className="text-xl font-disp font-bold text-[#eafff5]">{c.heading}</h2>
          </div>
        )}
        <div className={c.kind === 'closing' ? "max-w-[620px] mx-auto" : ""}>{content}</div>
        {c.kind === 'closing' && (instantAll || i < step) && (
          <button onClick={startOp} className="mt-6 font-mono text-base font-bold text-[#021008] bg-[#00ff88] px-8 py-4 rounded-xl hover:shadow-[0_0_40px_-4px_var(--glow)] transition-all uppercase tracking-wider">⚡ Operasyonu Başlat →</button>
        )}
      </section>
    );
  };

  return (
    <>
      <style>{`
        @keyframes artCardIn { from { opacity:0; transform: translateY(28px); filter: blur(4px); } to { opacity:1; transform:none; filter:none; } }
        .art-card-in { animation: artCardIn .6s cubic-bezier(.16,1,.3,1) both; }
        @keyframes artGlow { 0%,100%{ box-shadow:0 0 0 1px rgba(0,255,136,.12), 0 0 24px -10px rgba(0,255,136,.5);} 50%{ box-shadow:0 0 0 1px rgba(0,255,136,.35), 0 0 38px -8px rgba(0,255,136,.75);} }
        .art-typing { animation: artGlow 1.5s ease-in-out infinite; }
        @keyframes artBlink { 0%,49%{opacity:1;} 50%,100%{opacity:0;} }
        .art-cursor { display:inline-block; color:#00ff88; margin-left:1px; font-weight:bold; text-shadow:0 0 8px rgba(0,255,136,.9); animation: artBlink .9s steps(1) infinite; }
      `}</style>
      <AppHeader navigate={navigate} active="dashboard" />

      {/* Breadcrumb */}
      <div className="border-b border-[#0c2719] bg-[#04100a]">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <button onClick={() => navigate('dashboard')} className="text-[#74998a] hover:text-[#00ff88] transition-colors">← Dashboard</button>
            <span className="text-[#3d564b]">/</span>
            <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
            <span className="text-[#3d564b]">/</span>
            <span className="text-[#eafff5] font-mono">{room.name}</span>
            <span className="text-[#3d564b]">/</span>
            <span className="text-[#00ff88] font-mono">Brifing</span>
          </div>
          <span className="font-mono text-xs text-[#74998a]">{article.readTime}</span>
        </div>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-[#0c2719]" style={{ background: 'radial-gradient(900px 380px at 20% -10%, rgba(0,255,136,.10), transparent 60%), linear-gradient(165deg,#07150e,#020806)' }}>
        <div className="grid-floor" style={{ opacity: .35 }}></div>
        <div className="relative max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] font-medium tracking-[.2em] uppercase text-[#00ff88] inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] sk-pulse"></span>
              <HeroGlowType text="// DERS ÖNCESİ BRİFİNG — TEMEL KAVRAMLAR" speed={8} instant={instantAll} />
            </span>
            <h1 className="text-[clamp(26px,4vw,42px)] font-disp font-bold text-[#eafff5] leading-tight mb-3 min-h-[46px]">
              <HeroGlowType text={article.title} speed={15} instant={instantAll} onDone={() => setTitleDone(true)} />
            </h1>
            {(titleDone || instantAll) && (
              <p className="text-[#74998a] text-base md:text-lg leading-relaxed max-w-[640px] min-h-[28px]">
                <HeroGlowType text={article.tagline} speed={18} instant={instantAll} onDone={() => setTaglineDone(true)} />
              </p>
            )}
            <div className={`flex items-center gap-2.5 mt-5 flex-wrap transition-all duration-700 transform ${
              (taglineDone || instantAll) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              <span className={"font-bold text-sm px-3 py-1.5 rounded " + (dc[room.difficulty] || dc['Başlangıç'])}>{room.difficulty}</span>
              <span className="text-sm text-[#74998a] px-3 py-1.5 rounded border border-[#103a26]">{parentCat.icon} {parentCat.name}</span>
              {room.points ? <span className="font-mono text-sm text-[#00ff88] px-3 py-1.5 rounded border border-[#103a26]">◆ {room.points} Puan</span> : null}
            </div>
          </div>

          {/* Eğitmen görseli */}
          <div className="relative w-[220px] h-[260px] rounded-2xl overflow-hidden border border-[#103a26] hover:border-[#00ff88]/50 bg-black/40 shadow-[0_0_60px_-15px_rgba(0,255,136,.35)] mx-auto md:mx-0 hidden sm:block transition-all duration-500 hover:scale-[1.02]">
            <MatrixImageReveal src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent z-20"></div>
            {/* Cybersecurity digital grid overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,136,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40 z-20"></div>
            <div className="absolute top-3 left-3 font-disp font-bold text-[10px] tracking-widest text-[#00ff88] bg-black/75 px-2.5 py-1 border border-[#103a26] rounded uppercase z-20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff88] mr-1.5 sk-pulse"></span> Çevrimiçi
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-20">
              <div className="font-disp font-bold text-base text-white">{mentorName}</div>
              <div className="text-[10px] font-mono text-[#74998a] mt-0.5">Siber Kampüs Eğitmeni</div>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE BODY — sıralı, tamamı yazılarak akan kartlar */}
      <main className="max-w-[820px] mx-auto px-6 py-10 pb-28 space-y-6">
        {cards.map((c, i) => {
          const reveal = instantAll || i <= step;
          if (!reveal) return null;
          const isActive = !instantAll && i === step;

          if (c.kind === 'cmd') {
            const ca = article.commandAnatomy;
            return (
              <ArticleCard key={c.key} active={isActive} autoAdvance={isActive ? 650 : null} onAdvance={advance}>
                <section className="rounded-2xl border border-[#103a26] p-6" style={{ background: 'linear-gradient(165deg,#06140d,#020806)' }}>
                  <div className="flex items-center gap-3 mb-4"><span className="text-2xl">🧬</span><h2 className="text-xl font-disp font-bold text-[#eafff5]">{ca.title}</h2></div>
                  <div className="p-4 bg-black/70 border border-[#103a26] rounded-xl font-mono text-base mb-4 break-all">
                    {ca.parts.map((p, k) => (<span key={k} style={{ color: p.c }} className="font-bold">{p.t}{k < ca.parts.length - 1 ? ' ' : ''}</span>))}
                  </div>
                  <div className="space-y-2.5 mb-5">
                    {ca.parts.map((p, k) => (
                      <div key={k} className="flex items-start gap-3 text-sm">
                        <code style={{ color: p.c }} className="font-mono font-bold bg-black/40 px-2 py-0.5 rounded shrink-0">{p.t}</code>
                        <span className="text-[#9fc4b5] leading-relaxed">{p.d}</span>
                      </div>
                    ))}
                  </div>
                  {ca.params && (
                    <div className="pt-4 border-t border-[#0c2719]">
                      <div className="text-xs font-mono text-[#74998a] uppercase tracking-wider mb-3">▸ Parametre Sözlüğü</div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {ca.params.map((p, k) => (
                          <div key={k} className="flex flex-col gap-1.5 p-3 rounded-lg border border-[#0c2719] bg-black/20 overflow-hidden break-words">
                            <code className="text-[#ffd166] font-mono font-bold text-[11px] self-start bg-[#ffd166]/10 px-2 py-0.5 rounded border border-[#ffd166]/20 break-all">{p.flag}</code>
                            <span className="text-[#74998a] text-[12px] leading-relaxed break-words">{p.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </ArticleCard>
            );
          }

          if (c.kind === 'gloss') {
            return (
              <ArticleCard key={c.key} active={isActive} autoAdvance={isActive ? 650 : null} onAdvance={advance}>
                <section className="rounded-2xl border border-[#103a26] p-6" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                  <div className="flex items-center gap-3 mb-4"><span className="text-2xl">📖</span><h2 className="text-xl font-disp font-bold text-[#eafff5]">Terimler Sözlüğü</h2></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {article.glossary.map((g, k) => (
                      <div key={k} className="p-3.5 rounded-xl border border-[#0c2719] bg-black/20">
                        <div className="font-mono font-bold text-[#00ff88] text-sm mb-1">{g.term}</div>
                        <div className="text-[#74998a] text-[13px] leading-relaxed">{g.def}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </ArticleCard>
            );
          }

          // intro / prose / closing — yazılarak akar
          const content = isActive
            ? <GlowType text={c.body} speed={c.kind === 'intro' ? 22 : 26} onDone={advance} big={c.kind === 'intro'} />
            : <GlowType text={c.body} instant big={c.kind === 'intro'} />;
          return (
            <ArticleCard key={c.key} active={isActive} scroll={i > 0}>
              {renderProseCard(c, i, isActive, content)}
            </ArticleCard>
          );
        })}
      </main>

      {/* Sticky alt aksiyon çubuğu — Floating cyberpunk glass panel */}
      {!instantAll && shownCount < total && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-2rem)] max-w-[420px] rounded-xl border border-[#00ff88]/20 bg-[#04100a]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,255,136,0.05)] transition-all duration-300">
          <div className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#74998a]">// Brifing:</span>
              <span className="text-[#00ff88] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">{shownCount}/{total}</span>
            </div>
            <button onClick={() => setInstantAll(true)} className="font-bold text-[#021008] bg-[#00ff88] px-3.5 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all uppercase tracking-wider">⏩ Tüm Brifingi Getir</button>
          </div>
        </div>
      )}

      {SKFooter && <SKFooter navigate={navigate} />}
    </>
  );
};

const RoomPage = ({ navigate, data }) => {
  const room = data || { name: 'SQL Injection Temelleri', cat: 'Web Exploitation', difficulty: 'Başlangıç', stars: 2, points: 50, slug: 'web-sql-injection', id: 'web-01' };
  
  const parentCat = window.SK_CATEGORIES.find(c => c.rooms.some(r => r.id === room.id)) || window.SK_CATEGORIES[0];

  const getSysFlag = (id) => {
    const flags = {
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
    return flags[id] || `siberkampus{${id}_flag_solved}`;
  };

  const config = WEB_ROOM_CONFIGS[room.id] || {
    title: room.name,
    desc: room.desc,
    flag: getSysFlag(room.id),
    hints: [
      "Bu odanın CTF görevini tamamlamak için hedefin zafiyetlerini sömürün.",
      "Bayrağı elde ettikten sonra aşağıdaki formdan doğrulayın.",
      "Çözüm ve ipuçları için mentör desteği alabilirsiniz."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      if (room.id.startsWith('sys-')) {
        return <SysTerminalSim roomId={room.id} />;
      }
      return (
        <div className="p-7">
          <div className="text-center mb-5">
            <div className="font-disp font-bold text-lg text-[#cdeede]">{room.name}</div>
            <p className="text-xs text-[#74998a] mt-1">Simülasyon Çözümü Bekleniyor</p>
          </div>
          <div className="p-4 border border-[#103a26] bg-[#020806]/40 rounded-xl text-center text-xs leading-relaxed text-[#74998a]">
            Bu laboratuvar ortamı için pratik bayrağı: <br/>
            <strong className="text-white font-mono mt-2 block">siberkampus{`{${room.id || 'room'}_flag_solved}`}</strong>
          </div>
        </div>
      );
    },
    run: () => ({ ok: true })
  };

  const [user, updateUser] = useUser();
  if (!config.hints) {
    config.hints = [];
  }
  const [hints, setHints] = useState(
    config.hints.map((h, i) => ({ t: h, open: i === 0 }))
  );
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState(null); 
  const [target, setTarget] = useState({});
  const [resp, setResp] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introTyped, setIntroTyped] = useState(false);
  const [successTyped, setSuccessTyped] = useState(false);
  const [isCheckingFlag, setIsCheckingFlag] = useState(false);
  const [mentorName, setMentorName] = useState('Siber Mentör');

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.mentorName) {
          setMentorName(data.mentorName);
        }
      })
      .catch(() => {});
  }, []);

  const info = (window.MENTOR_LESSONS_INFO && window.MENTOR_LESSONS_INFO[room.id]) || {
    scenario: "Merhaba {name}. Bu odaya sızıp bayrağı yakalaman gerekiyor.",
    goals: ["Zafiyetleri keşfetmek", "Sistemi sömürmek", "Bayrağı doğrulamak"],
    realWorld: "Bu zafiyet gerçek sızma testlerinde kritik derecede önemlidir.",
    learned: ["Bu konudaki yetkinliklerini geliştirdin."]
  };
  const nameVal = user.name || 'Kullanıcı';
  const scenarioText = info.scenario ? info.scenario.replace(/{name}/g, nameVal) : '';
  const roomIndex = parentCat.rooms.findIndex(r => r.id === room.id);
  const nextRoom = parentCat.rooms[roomIndex + 1];

  useEffect(() => {
    setHints(config.hints.map((h, i) => ({ t: h, open: i === 0 })));
    setFlag('');
    setStatus(null);
    setTarget({});
    setResp(null);
    setShowIntro(false);
    setIntroTyped(false);
    setSuccessTyped(false);
    setIsCheckingFlag(false);
 
    // Initialize progress map & fetch room-specific progress if authenticated
    const token = localStorage.getItem('sk_token');
    if (token) {
      fetch('/api/rooms/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const unlockedForThisRoom = data.unlockedHints[room.id] || [];
          setHints(config.hints.map((h, i) => ({
            t: h,
            open: i === 0 || unlockedForThisRoom.includes(i)
          })));
        }
      })
      .catch(err => console.error("Oda ilerleme yükleme hatası:", err));
    } else {
      // LocalStorage fallback
      const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
      if (!solvedList.includes(room.id)) {
        const progressMap = JSON.parse(localStorage.getItem('sk_room_progress') || '{}');
        if (!progressMap[room.id]) {
          progressMap[room.id] = 10;
          localStorage.setItem('sk_room_progress', JSON.stringify(progressMap));
        }
      }
    }

    const t = setTimeout(() => {
      if (!data?.cameFromArticle) {
        setShowIntro(true);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [room.id, data?.cameFromArticle]);

  const updateRoomProgress = async (amt) => {
    const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
    if (!solvedList.includes(room.id)) {
      const progressMap = JSON.parse(localStorage.getItem('sk_room_progress') || '{}');
      if ((progressMap[room.id] || 0) < amt) {
        progressMap[room.id] = amt;
        localStorage.setItem('sk_room_progress', JSON.stringify(progressMap));
        
        const token = localStorage.getItem('sk_token');
        if (token) {
          try {
            await fetch('/api/rooms/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ room_id: room.id, progress_percent: amt })
            });
          } catch (e) {
            console.error("İlerleme api hatası:", e);
          }
        }
      }
    }
  };

  const usedHints = hints.filter(h => h.open).length;
  const earned = Math.max(0, room.points - (usedHints > 0 ? (usedHints - 1) * 20 : 0));

  const unlock = async (i) => {
    setHints(hs => hs.map((h, j) => j === i ? { ...h, open: true } : h));
    updateRoomProgress(40);
    
    const token = localStorage.getItem('sk_token');
    if (token) {
      try {
        await fetch('/api/rooms/unlock-hint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ room_id: room.id, hint_index: i })
        });
      } catch (e) {
        console.error("İpucu kilidi api hatası:", e);
      }
    }
  };

  const runTarget = (e, customArg = null) => {
    if (e) e.preventDefault();
    const result = config.run(target, customArg);
    setResp(result);
    updateRoomProgress(60);
  };

  const checkFlag = async () => {
    if (isCheckingFlag) return;
    setIsCheckingFlag(true);
    
    const token = localStorage.getItem('sk_token');
    if (token) {
      try {
        const res = await fetch('/api/rooms/solve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ room_id: room.id, flag: flag.trim() })
        });
        const data = await res.json();
        
        setIsCheckingFlag(false);
        if (res.ok) {
          setStatus('win');
          updateUser({
            points: data.user.points,
            solved: data.user.solved_count,
            level: data.user.level,
            rank: data.user.rank_val
          });
          
          const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
          if (!solvedList.includes(room.id)) {
            solvedList.push(room.id);
            localStorage.setItem('sk_solved_rooms', JSON.stringify(solvedList));
          }
          const progressMap = JSON.parse(localStorage.getItem('sk_room_progress') || '{}');
          progressMap[room.id] = 100;
          localStorage.setItem('sk_room_progress', JSON.stringify(progressMap));
        } else {
          setStatus('wrong');
          setTimeout(() => setStatus(null), 1800);
        }
      } catch (err) {
        console.error("Bayrak gönderme hatası:", err);
        setIsCheckingFlag(false);
        setStatus('wrong');
        setTimeout(() => setStatus(null), 1800);
      }
    } else {
      // Offline fallback
      setTimeout(() => {
        setIsCheckingFlag(false);
        if (flag.trim() === config.flag) { 
          setStatus('win'); 
          
          const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
          if (!solvedList.includes(room.id)) {
            solvedList.push(room.id);
            localStorage.setItem('sk_solved_rooms', JSON.stringify(solvedList));
            
            const progressMap = JSON.parse(localStorage.getItem('sk_room_progress') || '{}');
            progressMap[room.id] = 100;
            localStorage.setItem('sk_room_progress', JSON.stringify(progressMap));

            const newPoints = user.points + earned;
            const newSolvedCount = user.solved + 1;
            const newLevel = Math.min(10, Math.max(user.level, Math.floor(newPoints / 100)));
            const newRank = Math.max(1, user.rank - Math.floor(Math.random() * 5 + 1));

            updateUser({
              points: newPoints,
              solved: newSolvedCount,
              level: newLevel,
              rank: newRank
            });
          }
        } else { 
          setStatus('wrong'); 
          setTimeout(() => setStatus(null), 1800); 
        }
      }, 1500);
    }
  };

  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes modalScaleIn {
          from { transform: scale(0.9) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modal-fade {
          animation: modalFadeIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-modal-scale {
          animation: modalScaleIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
      <AppHeader navigate={navigate} active="dashboard" />
      <div className="border-b border-[#0c2719] bg-[#04100a]">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <button onClick={() => navigate('dashboard')} className="text-[#74998a] hover:text-[#00ff88] transition-colors">← Dashboard</button>
            <span className="text-[#3d564b]">/</span>
            <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
            <span className="text-[#3d564b]">/</span>
            <span className="text-[#eafff5] font-mono">{config.title}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <span className={"font-bold px-3 py-1.5 rounded " + (dc[room.difficulty] || dc['Başlangıç'])}>{room.difficulty}</span>
            <span className="text-[#74998a]">{room.cat}</span>
            <span className="font-mono text-[#00ff88]">◆ {room.points} puan</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1550px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-8">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#103a26] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <div className="flex items-center gap-2 mb-4"><span className="text-xl">🎯</span><h2 className="text-xl text-[#eafff5]">Hedef: {config.title}</h2></div>
            <p className="text-[#74998a] text-sm md:text-base leading-relaxed mb-5">{config.desc}</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[['Zorluk', '⭐'.repeat(room.stars || 2)], ['Kategori', room.cat], ['Ödül', '◆ ' + room.points]].map(([l, v], i) => (
                <div key={i} className="p-3 rounded-lg bg-[#04100a] border border-[#0c2719]"><div className="text-sm text-[#74998a] mb-1">{l}</div><div className="text-base text-[#eafff5] font-mono">{v}</div></div>
              ))}
            </div>
          </div>

          {config.hints && config.hints.length > 0 && (
            <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#eafff5] font-disp font-bold">İpuçları</h3>
                <span className="font-mono text-xs text-[#ffd166]">{usedHints} açık · olası ödül ◆{earned}</span>
              </div>
              <div className="space-y-3">
                {hints.map((h, i) => (
                  <div key={i} className={"p-4 rounded-lg border text-sm " + (h.open ? 'border-[#103a26] bg-[rgba(0,255,136,.03)]' : 'border-[#0c2719]')}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-[#74998a]">Hint {i + 1}</span>
                      {h.open ? <span className="text-xs text-[#00ff88]">✓ açık</span>
                        : <button onClick={() => unlock(i)} className="text-xs text-[#ffd166] border border-[#103a26] px-2.5 py-1 rounded hover:border-[#ffd166] transition-colors">🔓 Aç (−20 puan)</button>}
                    </div>
                    {h.open && <p className="text-[#cdeede] mt-2 leading-relaxed">{h.t}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#103a26] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-all hover:border-[#00ff88]/30" style={{ background: 'linear-gradient(165deg,#06140d,#040d08)' }}>
            <div className="bg-[#030c08] border-b border-[#0c2719] select-none">
              {/* Row 1: Chrome Style Tab Bar */}
              <div className="flex items-end px-3 pt-2 gap-1.5 h-[38px] bg-black/40">
                {/* Active Tab */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#07150e] border-t border-x border-[#0c2719] rounded-t-lg text-sm text-[#eafff5] font-sans font-medium h-[32px] min-w-[170px] max-w-[220px]">
                  <span className="text-red-500 font-bold text-xs">⚠</span>
                  <span className="truncate flex-1 font-mono text-xs">{room.name}</span>
                  <button type="button" className="text-[#74998a] hover:text-red-400 font-bold ml-1 text-xs">×</button>
                </div>
                {/* Inactive Tab */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/35 border-t border-x border-transparent rounded-t-lg text-sm text-[#74998a] h-[32px] min-w-[140px] max-w-[180px] cursor-pointer transition-colors">
                  <span className="text-xs">🌐</span>
                  <span className="truncate flex-1 font-mono text-xs">Yeni Sekme</span>
                  <button type="button" className="text-[#3d564b] hover:text-[#74998a] font-bold ml-1 text-xs">×</button>
                </div>
                {/* Add Tab Button */}
                <button type="button" className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center text-[#74998a] text-sm font-sans mb-1 font-bold">+</button>
              </div>

              {/* Row 2: Navigation & Address Bar */}
              <div className="flex items-center gap-3.5 px-4 py-2.5 bg-[#07150e]">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 text-[#74998a] text-base">
                  <button type="button" className="hover:text-[#00ff88] transition-colors font-bold">←</button>
                  <button type="button" className="hover:text-[#00ff88] transition-colors font-bold">→</button>
                  <button type="button" className="hover:text-[#00ff88] transition-colors text-sm font-bold">🔄</button>
                  <button type="button" className="hover:text-[#00ff88] transition-colors text-sm font-bold">🏠</button>
                </div>

                {/* Address Bar */}
                <div className="flex-1 flex items-center justify-between gap-3 bg-[#020806] border border-[#103a26] rounded-full px-4 py-1.5 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    {/* Warning Indicator */}
                    <span className="text-[#ff5f57] font-sans font-medium text-xs tracking-wide bg-[#ff5f57]/10 px-2.5 py-0.5 rounded-full border border-[#ff5f57]/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57] animate-ping"></span>
                      ⚠ Güvenli değil
                    </span>
                    <span className="text-[#3d564b] font-bold">|</span>
                    {/* Dynamic Host and Path URL Highlight */}
                    <span className="text-[#74998a] tracking-wide select-all">
                      https://<span className="text-[#00ff88] font-bold">hedefsite.com</span>/{room.slug === 'web-sql-injection' ? 'admingiris' : (room.slug || 'exploit')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#74998a] text-sm">
                    <span className="cursor-pointer hover:text-[#00ff88] transition-colors">⭐</span>
                    <span className="cursor-pointer hover:text-[#00ff88] transition-colors">🔍</span>
                  </div>
                </div>

                {/* Browser Actions */}
                <div className="hidden md:flex items-center gap-2.5 text-[#74998a]">
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs font-sans font-bold text-[#5cffba]">U</span>
                  <span className="cursor-pointer hover:text-[#00ff88] transition-colors text-sm">🧩</span>
                  <span className="cursor-pointer hover:text-[#00ff88] transition-colors text-base font-bold leading-none">⁝</span>
                </div>
              </div>
            </div>
            <ChallengeRunner key={room.id} roomId={room.id} config={config} target={target} setTarget={setTarget} runTarget={runTarget} resp={resp} isWin={status === 'win'} />
          </div>

          <div className="rounded-2xl border border-[#103a26] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <h3 className="text-[#eafff5] font-disp font-bold text-lg mb-1">Bayrağını Gir</h3>
            <p className="text-sm text-[#74998a] mb-4 font-mono">format: <span className="text-[#5cffba]">siberkampus{'{...}'}</span></p>
            <div className="flex gap-2">
              <input 
                value={flag} 
                onChange={e => setFlag(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && checkFlag()} 
                disabled={isCheckingFlag}
                placeholder={isCheckingFlag ? "Bayrak Doğrulanıyor..." : "siberkampus{...}"} 
                className={"flex-1 bg-[#020806] border rounded-lg px-3.5 py-3 text-[#cdeede] placeholder-[#3d564b] focus:outline-none font-mono text-base transition-colors " + (status === 'wrong' ? 'border-[#ff2e88]' : 'border-[#103a26] focus:border-[#00ff88]')} 
              />
              <button 
                onClick={checkFlag} 
                disabled={isCheckingFlag}
                className="font-mono text-base font-bold text-[#021008] bg-[#00ff88] px-5 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingFlag ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Kontrol...
                  </span>
                ) : '✓ Kontrol'}
              </button>
            </div>
            {status === 'wrong' && <p className="text-sm text-[#ff2e88] mt-3">✗ Yanlış bayrak. Hedef uygulamadan doğru değeri dök ve tekrar dene.</p>}
          </div>
        </div>
      </main>

      {showIntro && (
          <div className="fixed inset-0 bg-[#020806]/85 z-[100] grid place-items-center p-4 overflow-y-auto animate-modal-fade" onClick={() => setShowIntro(false)}>
            <div className="relative max-w-4xl w-full border border-[#103a26] bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(0,255,136,.15)] overflow-hidden flex flex-col md:flex-row min-h-[480px] animate-modal-scale" onClick={e => e.stopPropagation()}>
              
              {/* Mentör Görsel Alanı */}
              <div className="relative w-full md:w-[320px] bg-black/40 border-r border-[#103a26] flex-none overflow-hidden h-[240px] md:h-auto">
                <img src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 font-disp font-bold text-xs tracking-widest text-[#00ff88] bg-black/75 px-3 py-1.5 border border-[#103a26] rounded uppercase">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] mr-2 sk-pulse"></span>
                  Çevrimiçi
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-disp font-bold text-lg text-white">{mentorName}</div>
                  <div className="text-[11px] font-mono text-[#74998a] mt-0.5">Siber Kampüs Eğitmeni</div>
                </div>
              </div>

              {/* Brifing Detayları */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2 mb-2">// MİSYON BRİFİNGİ</span>
                  <h2 className="text-[28px] font-disp font-bold text-[#eafff5] leading-tight mb-4">{room.name}</h2>
                  
                  {/* Senaryo */}
                  <div className="text-xs text-[#cdeede] leading-relaxed italic bg-black/25 p-4 rounded-xl border border-[#0c2719] mb-4 min-h-[70px]">
                    "<TypingText text={scenarioText} speed={12} onComplete={() => setIntroTyped(true)} />"
                  </div>

                  {/* Hedefler & Gerçek Dünya - Fade-in when typed */}
                  <div className={`transition-all duration-700 transform ${introTyped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Hedefler */}
                    <div className="mb-4">
                      <h4 className="text-[11px] font-bold text-[#00ff88] uppercase tracking-wider mb-2">◆ NELER ÖĞRENECEKSİN?</h4>
                      <ul className="space-y-1.5">
                        {info.goals.map((g, idx) => (
                          <li key={idx} className="text-xs text-[#74998a] flex items-start gap-2">
                            <span className="text-[#00ff88] mt-0.5">▸</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gerçek Dünya */}
                    <div className="mb-6 p-4 rounded-xl border border-[#ffd166]/20 bg-[#ffd166]/5">
                      <h4 className="text-[11px] font-bold text-[#ffd166] uppercase tracking-wider mb-1.5">⚡ GERÇEK PENTEST UYGULAMASI</h4>
                      <p className="text-xs text-[#74998a] leading-relaxed">{info.realWorld}</p>
                    </div>
                  </div>
                </div>

                <div className={`transition-all duration-700 delay-300 ${introTyped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  <button onClick={() => setShowIntro(false)} className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3.5 px-6 rounded-xl hover:shadow-[0_0_32px_rgba(0,255,136,.4)] transition-all uppercase tracking-wider">Operasyonu Başlat →</button>
                </div>
              </div>

            </div>
          </div>
      )}

      {status === 'win' && (
          <div className="fixed inset-0 bg-[#020806]/85 z-[100] grid place-items-center p-4 overflow-y-auto animate-modal-fade" onClick={() => setStatus(null)}>
            <div className="relative max-w-4xl w-full border border-[#103a26] bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(0,255,136,.15)] overflow-hidden flex flex-col md:flex-row min-h-[480px] animate-modal-scale" onClick={e => e.stopPropagation()}>
              
              {/* Mentör Görsel Alanı */}
              <div className="relative w-full md:w-[320px] bg-black/40 border-r border-[#103a26] flex-none overflow-hidden h-[240px] md:h-auto">
                <img src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 font-disp font-bold text-xs tracking-widest text-[#00ff88] bg-black/75 px-3 py-1.5 border border-[#103a26] rounded uppercase">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] mr-2 sk-pulse"></span>
                  GÖREV BAŞARILI
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-disp font-bold text-lg text-white">{mentorName}</div>
                  <div className="text-[11px] font-mono text-[#74998a] mt-0.5">Tebrik Brifingi</div>
                </div>
              </div>

              {/* Başarı Detayları */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2 mb-2">// GÖREV TAMAMLANDI</span>
                  <h2 className="text-[28px] font-disp font-bold text-[#eafff5] leading-tight mb-4">Harika İş, {nameVal}!</h2>
                  
                  <p className="text-xs text-[#74998a] leading-relaxed mb-4 min-h-[40px]">
                    <TypingText text={`Sistemi başarıyla hackledin ve bayrağı ele geçirdin. Bu dersi tamamlayarak önemli bir aşama kaydettin, ${nameVal}.`} speed={15} onComplete={() => setSuccessTyped(true)} />
                  </p>

                  <div className={`transition-all duration-700 transform ${successTyped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    {/* Öğrenilenler */}
                    <div className="mb-6">
                      <h4 className="text-[11px] font-bold text-[#00ff88] uppercase tracking-wider mb-2.5">✓ BU GÖREVDE NELER ÖĞRENDİN?</h4>
                      <ul className="space-y-2">
                        {info.learned.map((l, idx) => (
                          <li key={idx} className="text-xs text-[#cdeede] flex items-start gap-2 bg-[#00ff88]/5 p-3 rounded-lg border border-[#00ff88]/10">
                            <span className="text-[#00ff88] font-bold">✓</span>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Kazanımlar */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-[#04100a]/50 border border-[#103a26] text-center">
                        <div className="text-[10px] text-[#74998a] mb-1">Kazanılan Puan</div>
                        <div className="text-base font-mono font-bold text-[#00ff88]">+{earned} Puan</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#04100a]/50 border border-[#103a26] text-center">
                        <div className="text-[10px] text-[#74998a] mb-1">Kategori</div>
                        <div className="text-xs font-mono font-bold text-[#5cffba] truncate">{parentCat.name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Butonlar */}
                <div className={`transition-all duration-700 delay-300 ${successTyped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  <div className="flex flex-col gap-3">
                    {nextRoom ? (
                      <button onClick={() => { setStatus(null); navigate('roomArticle', nextRoom); }} className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3 rounded-xl hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">
                        Sonraki Göreve Git: {nextRoom.name} →
                      </button>
                    ) : (
                      <button onClick={() => { setStatus(null); navigate('dashboard'); }} className="w-full font-mono text-sm font-bold text-[#021008] bg-[#ffd166] py-3 rounded-xl hover:shadow-[0_0_28px_-4px_rgba(255,209,102,.4)] transition-all">
                        Kategoriyi Bitirdin! Dashboard'a Dön 🏆
                      </button>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => { setStatus(null); navigate('category', parentCat); }} className="flex-1 border border-[#103a26] text-[#cdeede] py-2.5 rounded-xl hover:border-[#00ff88] hover:text-[#00ff88] transition-colors text-xs text-center">
                        Kategori Listesi
                      </button>
                      <button onClick={() => { setStatus(null); navigate('chat'); }} className="flex-1 border border-[#103a26] text-[#cdeede] py-2.5 rounded-xl hover:border-[#00ff88] hover:text-[#00ff88] transition-colors text-xs text-center">
                        Sohbette Paylaş
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
      )}
      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ LEADERBOARD ============ */
const LeaderboardPage = ({ navigate }) => {
  const [user] = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
          setTotalUsersCount(data.totalUsers || 0);
        } else if (Array.isArray(data)) {
          setLeaderboard(data);
          setTotalUsersCount(data.length);
        }
      })
      .catch(err => console.error("Liderlik tablosu hatası:", err));
  }, []);

  const rawTop = leaderboard;
  const totalUsers = totalUsersCount || rawTop.length;
  const getBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const items = rawTop.map(u => ({
    r: u.rank,
    name: u.name,
    pts: u.points,
    lvl: u.level,
    badge: getBadge(u.rank),
    tag: u.tag || null
  }));

  const first = items[0] || { r: 1, name: user.name || 'Henüz yok', pts: 0, lvl: 1, badge: '🥇' };
  const second = items[1] || { r: 2, name: '-', pts: 0, lvl: 1, badge: '🥈' };
  const third = items[2] || { r: 3, name: '-', pts: 0, lvl: 1, badge: '🥉' };
  const top = [second, first, third].concat(items.slice(3));
  const isCurrentUserInList = items.some(item => item.name === user.name);
  return (
    <>
      <AppHeader navigate={navigate} active="leaderboard" />
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-8">
          <SectionLabel>Rekabet</SectionLabel>
          <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5]">Liderlik Tablosu</h1>
          <p className="text-[#74998a] mt-2">{totalUsers > 0 ? totalUsers + ' kullanıcı arasında yerini gör.' : 'İlk sıralamayı sen başlat!'} Her çözülen bayrak seni yukarı taşır.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6">
          {/* list */}
          <div className="rounded-2xl border border-[#0c2719] overflow-hidden" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            {/* podium */}
            <div className="grid grid-cols-3 gap-3 p-6 border-b border-[#0c2719]">
              {[top[1], top[0], top[2]].map((u, i) => {
                const place = u.r;
                const tall = place === 1;
                const isMe = u.name === user.name;
                return (
                  <div key={u.r} onClick={() => navigate('profile', u)} className={"cursor-pointer rounded-xl border p-4 text-center transition-all hover:-translate-y-1 " + (isMe ? 'border-[#00ff88] bg-[rgba(0,255,136,.1)]' : tall ? 'border-[#00ff88] bg-[rgba(0,255,136,.05)] -mt-3' : 'border-[#103a26] bg-[#04100a] hover:border-[#00ff88]')}>
                    <div className="text-2xl mb-1">{u.badge}</div>
                    <div className="w-12 h-12 mx-auto rounded-full grid place-items-center text-[#5cffba] font-bold border border-[#103a26] mb-2" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{u.name.split(' ').map(s => s[0]).join('')}</div>
                    <div className="text-sm text-[#eafff5] font-medium truncate">{u.name} {isMe && <span className="text-[10px] text-[#00ff88] block mt-0.5">(Sen)</span>}</div>
                    <div className="text-xs text-[#74998a] font-mono">Lvl {u.lvl}</div>
                    <div className="font-mono text-sm text-[#00ff88] font-bold mt-1">◆ {(u.pts || 0).toLocaleString('tr-TR')}</div>
                  </div>
                );
              })}
            </div>
            {/* rows */}
            <div className="divide-y divide-[#0c2719]">
              {top.slice(3).map(u => {
                const isMe = u.name === user.name;
                return (
                  <div key={u.r} onClick={() => navigate('profile', u)} className={"flex items-center gap-4 px-6 py-3.5 hover:bg-[rgba(0,255,136,.04)] transition-colors cursor-pointer " + (isMe ? 'bg-[rgba(0,255,136,.08)] border-y border-[#103a26]' : '')}>
                    <span className={"font-mono text-sm w-8 " + (isMe ? 'text-[#00ff88]' : 'text-[#74998a]')}>#{u.r}</span>
                    <span className={"w-9 h-9 rounded-full grid place-items-center font-bold text-xs border " + (isMe ? 'bg-[#00ff88] text-[#021008] border-[#00ff88]' : 'text-[#5cffba] border-[#103a26]')} style={isMe ? {} : { background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{u.name.split(' ').map(s => s[0]).join('')}</span>
                    <span className={"flex-1 text-sm " + (isMe ? 'text-[#00ff88] font-bold' : 'text-[#eafff5]')}>{u.name} {isMe && <span className="text-[10px] text-[#74998a] ml-1">(Sen)</span>} {u.tag && <span className="text-[10px] text-[#ffd166] ml-1">🔥 {u.tag}</span>}</span>
                    <span className="text-xs text-[#74998a] font-mono hidden sm:block">Lvl {u.lvl}</span>
                    <span className={"font-mono text-sm font-bold w-20 text-right " + (isMe ? 'text-[#00ff88]' : 'text-[#cdeede]')}>{u.pts.toLocaleString('tr-TR')}</span>
                  </div>
                );
              })}
              {/* current user - only shown if they are not already in the top visible list */}
              {!isCurrentUserInList && (
                <div className="flex items-center gap-4 px-6 py-4 bg-[rgba(0,255,136,.05)] border-y border-[#103a26]">
                  <span className="font-mono text-sm text-[#00ff88] w-8">#{user.rank}</span>
                  <span className="w-9 h-9 rounded-full grid place-items-center text-[#021008] font-bold text-xs bg-[#00ff88]">{user.avatar}</span>
                  <span className="flex-1 text-sm text-[#00ff88] font-bold">{user.name} <span className="text-[10px] text-[#74998a] ml-1">(Sen)</span></span>
                  <span className="text-xs text-[#74998a] font-mono hidden sm:block">Lvl {user.level}</span>
                  <span className="font-mono text-sm text-[#00ff88] font-bold w-20 text-right">{user.points.toLocaleString('tr-TR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#103a26] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <SectionLabel>Senin Sıralaman</SectionLabel>
              <div className="space-y-3">
                {[['Sıralama', '#' + user.rank + (totalUsers > 0 ? ' / ' + totalUsers : '')], ['Puan', user.points.toLocaleString('tr-TR')], ['Rozet', user.badges + ' / 15'], ['Seri', user.streak + ' gün 🔥']].map(([l, v], i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#04100a] border border-[#0c2719]"><span className="text-sm text-[#74998a]">{l}</span><span className="font-mono text-sm text-[#eafff5] font-bold">{v}</span></div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-[#0c2719]">
                {(() => {
                  const isTop50 = user.rank <= 50;
                  const isFirst = user.rank === 1;
                  
                  if (isFirst) {
                    return (
                      <>
                        <div className="flex justify-between text-xs text-[#74998a] mb-2">
                          <span>Sıralama Durumu</span>
                          <span className="text-[#00ff88] font-bold">🥇 Zirvedesin!</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88]" style={{ width: '100%' }}></div>
                        </div>
                      </>
                    );
                  }

                  if (isTop50) {
                    const firstPts = first.pts || 0;
                    const remainingToFirst = Math.max(0, firstPts - user.points);
                    const pct = firstPts > 0 ? Math.min(100, Math.round((user.points / firstPts) * 100)) : 100;
                    return (
                      <>
                        <div className="flex justify-between text-xs text-[#74998a] mb-2">
                          <span>Zirveye (1.liğe) kalan</span>
                          <span className="text-[#ffd166]">{remainingToFirst > 0 ? '~' + remainingToFirst.toLocaleString('tr-TR') + ' puan' : 'Hedefe ulaştın!'}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88]" style={{ width: pct + '%' }}></div>
                        </div>
                      </>
                    );
                  }

                  const target50 = 950;
                  const remaining = Math.max(0, target50 - user.points);
                  const pct = Math.min(100, Math.round((user.points / target50) * 100));
                  return (
                    <>
                      <div className="flex justify-between text-xs text-[#74998a] mb-2">
                        <span>İlk 50'ye kalan</span>
                        <span className="text-[#ffd166]">{remaining > 0 ? '~' + remaining.toLocaleString('tr-TR') + ' puan' : 'Hedefe ulaştın!'}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88]" style={{ width: pct + '%' }}></div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button onClick={() => navigate('dashboard')} className="w-full mt-5 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-2.5 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all">Sıranı Yükselt →</button>
            </div>
            <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <h3 className="text-[#eafff5] font-disp font-bold mb-4">Son Rozetlerin</h3>
              <div className="flex flex-wrap gap-2.5">
                {(() => {
                  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
                  const dynBadges = window.getDynamicBadges ? window.getDynamicBadges(user, solvedList) : [];
                  const earned = dynBadges.filter(b => b.done);
                  const locked = dynBadges.filter(b => !b.done);
                  return (<>
                    {earned.slice(0, 5).map((b, i) => (<span key={i} className="w-11 h-11 rounded-lg grid place-items-center text-lg border border-[#103a26] bg-[rgba(0,255,136,.03)]">{b.icon}</span>))}
                    {earned.length < 5 && Array.from({ length: Math.min(3, 5 - earned.length) }).map((_, i) => (<span key={'l'+i} className="w-11 h-11 rounded-lg grid place-items-center text-lg border border-[#0c2719] text-[#3d564b]">?</span>))}
                  </>);
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ CHAT ============ */
const ChatPage = ({ navigate }) => {
  const [user] = useUser();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const [activeChat, setActiveChat] = useState('general');
  const [showVIPModal, setShowVIPModal] = useState(false);

  const fetchMessages = () => {
    fetch('/api/chat/messages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const marked = data.map(m => ({
            ...m,
            me: m.u === user.name
          }));
          setMsgs(marked);
        }
      })
      .catch(err => console.error("Mesaj yükleme hatası:", err));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [user.name]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const tStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Add locally for snappiness
    const newMsg = { u: user.name, role: user.points > 1200 ? 'Siber Mentör' : 'Öğrenci', t: tStr, m: input, me: true };
    setMsgs(m => [...m, newMsg]);
    const originalInput = input;
    setInput('');

    const token = localStorage.getItem('sk_token');
    if (token) {
      try {
        await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message: originalInput })
        });
        fetchMessages();
      } catch (e) {
        console.error("Mesaj gönderilemedi:", e);
      }
    } else {
      // Giriş yapılmamışsa mesaj gönderilemez
      console.warn('Mesaj göndermek için giriş yapmalısınız.');
    }
  };

  // Çevrimiçi listesi: aktif kullanıcıları çek (gerçek DB verisi)
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [totalOnlineCount, setTotalOnlineCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('sk_token');

    const fetchOnline = () => {
      fetch('/api/users/online')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOnlineUsers(data.map(u => u.name));
            setTotalOnlineCount(data.length);
          }
        })
        .catch(() => {});
    };

    // Heartbeat: keeps the logged-in user marked active while the chat is open,
    // so the online list reflects people actually present (not just recent logins).
    const heartbeat = () => {
      if (!token) return;
      fetch('/api/users/heartbeat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    };

    heartbeat();
    fetchOnline();
    const hbInterval = setInterval(heartbeat, 30000);
    const onlineInterval = setInterval(fetchOnline, 20000);
    return () => { clearInterval(hbInterval); clearInterval(onlineInterval); };
  }, []);
  const online = onlineUsers.length > 0 ? onlineUsers : [user.name || 'Sen'];
  const token = localStorage.getItem('sk_token');
  const isGuest = !token;

  return (
    <>
      <AppHeader navigate={navigate} active="chat" />
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            <SectionLabel>Topluluk</SectionLabel>
            <h1 className="text-[clamp(26px,4vw,38px)] text-[#eafff5]">Global Sohbet</h1>
          </div>
          <span className="flex items-center gap-2 text-sm text-[#74998a]"><span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] sk-pulse"></span>{totalOnlineCount || online.length} kişi çevrimiçi</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* chat column */}
          <div className="rounded-2xl border border-[#0c2719] flex flex-col overflow-hidden" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)', height: '600px' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#0c2719]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveChat('general')}
                  className={`pb-2 px-2 border-b-2 font-mono text-sm transition-all ${
                    activeChat === 'general'
                      ? 'border-[#00ff88] text-[#00ff88]'
                      : 'border-transparent text-[#74998a] hover:text-[#cdeede]'
                  }`}
                >
                  Genel Sohbet
                </button>
                <button
                  onClick={() => {
                    if (!user.is_premium) {
                      setShowVIPModal(true);
                    } else {
                      setActiveChat('vip');
                    }
                  }}
                  className={`pb-2 px-2 border-b-2 font-mono text-sm transition-all flex items-center gap-2 ${
                    activeChat === 'vip'
                      ? 'border-[#ffd166] text-[#ffd166]'
                      : 'border-transparent text-[#74998a] hover:text-[#cdeede]'
                  }`}
                >
                  👑 VIP Sohbet
                  {msgs.length > 0 && (
                    <span className="w-4 h-4 bg-[#ff2e88] text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px]">{msgs.length}</span>
                  )}
                </button>
              </div>
              <span className="text-xs text-[#3d564b] ml-auto font-mono">{totalOnlineCount || 1} aktif</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {msgs.map((m, i) => (
                m.sys ? (
                  <div key={i} className="text-center"><span className="inline-block font-mono text-xs text-[#00ff88] bg-[rgba(0,255,136,.05)] border border-[#103a26] px-3 py-1.5 rounded-full">⚙ {m.m}</span></div>
                ) : (
                  <div key={i} className={"flex gap-3 " + (m.me ? 'flex-row-reverse' : '')}>
                    <span className={"w-9 h-9 flex-none rounded-lg grid place-items-center font-bold text-xs border " + (m.me ? 'bg-[#00ff88] text-[#021008] border-[#00ff88]' : 'text-[#5cffba] border-[#103a26]')} style={m.me ? {} : { background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{m.u.slice(0, 2).toUpperCase()}</span>
                    <div className={"max-w-[78%] " + (m.me ? 'text-right' : '')}>
                      <div className={"flex items-center gap-2 mb-1 " + (m.me ? 'justify-end' : '')}>
                        <span className="text-sm text-[#eafff5] font-medium">{m.u}</span>
                        <span className="text-[10px] text-[#3d564b] font-mono px-1.5 py-0.5 rounded bg-[#04100a] border border-[#0c2719]">{m.role}</span>
                        <span className="text-[10px] text-[#3d564b]">{m.t}</span>
                      </div>
                      <div className={"px-3.5 py-2.5 rounded-xl text-sm leading-relaxed break-words " + (m.me ? 'bg-[rgba(0,255,136,.08)] border border-[#103a26] text-[#cdeede] rounded-tr-sm' : 'bg-[#04100a] border border-[#0c2719] text-[#cdeede] rounded-tl-sm')}>{m.m}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="p-3 border-t border-[#0c2719] flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={isGuest ? "Sohbete katılmak için giriş yapmalısınız..." : "Mesajını yaz…"} disabled={isGuest} className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm disabled:opacity-50" />
              <button onClick={send} disabled={isGuest} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-5 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Gönder ↵</button>
            </div>
          </div>

          {/* online sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#0c2719] p-6" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <h3 className="text-[#eafff5] font-disp font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]"></span>Çevrimiçi</h3>
              <div className="space-y-2.5">
                {online.map((u, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-md grid place-items-center text-[#5cffba] font-bold text-[10px] border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{u.slice(0, 2).toUpperCase()}</span>
                    <span className="text-sm text-[#cdeede]">{u}</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="w-7 h-7 rounded-md grid place-items-center text-[#021008] font-bold text-[10px] bg-[#00ff88]">{ME.avatar}</span>
                  <span className="text-sm text-[#00ff88] font-medium">{ME.name} (Sen)</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#ffd166]"></span>
                </div>
                <p className="text-xs text-[#3d564b] pt-2">{totalOnlineCount > 8 ? '+' + (totalOnlineCount - 8) + ' kişi daha…' : ''}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#0c2719] p-6" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <h3 className="text-[#eafff5] font-disp font-bold text-sm mb-3">💡 Sohbet Kuralları</h3>
              <ul className="text-xs text-[#74998a] space-y-2 leading-relaxed">
                <li>• Birbirinize saygılı olun</li>
                <li>• Spam ve reklam linkleri yasak</li>
                <li>• Admin moderasyonu aktiftir ⚠️</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {showVIPModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#04100a] border border-[#103a26] rounded-2xl p-8 max-w-[420px] shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-[#eafff5] mb-3">Premium Üyelik Gerekli</h2>
              <p className="text-[#74998a] text-sm mb-6 leading-relaxed">
                VIP Sohbet bölümüne erişmek için premium abonelik bulunması gerekmektedir.
              </p>

              <div className="space-y-3 mb-6">
                <div className="border border-[#103a26] rounded-lg p-4 bg-[#020806]/50">
                  <div className="font-bold text-[#00ff88] mb-1">💎 Premium Aylık</div>
                  <div className="text-sm text-[#74998a]">₺99 / ay</div>
                </div>
                <div className="border border-[#103a26] rounded-lg p-4 bg-[#020806]/50">
                  <div className="font-bold text-[#5cffba] mb-1">👑 Premium Yıllık</div>
                  <div className="text-sm text-[#74998a]">₺899 / yıl</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowVIPModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#103a26] text-[#74998a] hover:text-[#cdeede] transition-colors font-mono text-sm"
                >
                  Kapat
                </button>
                <button
                  onClick={() => setShowVIPModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#ffd166] text-[#021008] font-bold hover:bg-[#ff9500] transition-colors font-mono text-sm"
                >
                  Premium Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ ADMIN PANEL ============ */
const AdminPage = ({ navigate }) => {
  const [user] = useUser();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'blogs', 'chat'

  // Tab 1: Kullanıcı Yönetimi
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Tab 2: Blog Yönetimi
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 dk');
  const [blogContent, setBlogContent] = useState('');
  const [blogSuccess, setBlogSuccess] = useState('');
  const [blogError, setBlogError] = useState('');

  // Tab 3: Sohbet Moderasyonu
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    const token = localStorage.getItem('sk_token');
    if (!token || !user || !user.is_admin) {
      navigate('dashboard');
    }
  }, [user, navigate]);

  // Fetch functions
  const fetchUsers = async () => {
    const token = localStorage.getItem('sk_token');
    if (!token) return;
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setUsersError(data.error || 'Kullanıcılar yüklenemedi.');
      }
    } catch (err) {
      setUsersError('Ağ hatası oluştu.');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (res.ok) {
        setBlogs(data);
      }
    } catch (err) {
      console.error('Blog yüklenirken hata:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (res.ok) {
        setChatMessages(data);
      }
    } catch (err) {
      console.error('Mesajlar yüklenirken hata:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Effect to load data based on active tab
  useEffect(() => {
    if (!user || !user.is_admin) return;
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'chat') {
      // In chat view, we also need users for mapping usernames to IDs when banning
      fetchUsers();
      fetchChatMessages();
    }
  }, [activeTab, user]);

  // Action handlers
  const handleToggleBan = async (userId, name, isBanned) => {
    const token = localStorage.getItem('sk_token');
    if (!confirm(`${name} adlı kullanıcının yasaklanma durumunu değiştirmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh lists
        fetchUsers();
        if (activeTab === 'chat') {
          fetchChatMessages();
        }
      } else {
        alert(data.error || 'Yasaklama işlemi başarısız.');
      }
    } catch (err) {
      alert('Ağ hatası.');
    }
  };

  const handleDeleteBlog = async (blogId, title) => {
    const token = localStorage.getItem('sk_token');
    if (!confirm(`"${title}" başlıklı makaleyi silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        const data = await res.json();
        alert(data.error || 'Makale silinemedi.');
      }
    } catch (err) {
      alert('Ağ hatası.');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setBlogSuccess('');
    setBlogError('');
    if (!blogTitle.trim() || !blogContent.trim() || !blogCategory.trim() || !blogAuthor.trim()) {
      setBlogError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    const token = localStorage.getItem('sk_token');
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogTitle.trim(),
          excerpt: blogExcerpt.trim(),
          content: blogContent.trim(),
          category: blogCategory.trim(),
          author: blogAuthor.trim(),
          readTime: blogReadTime.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBlogSuccess('Yeni blog yazısı başarıyla eklendi!');
        // Reset form
        setBlogTitle('');
        setBlogExcerpt('');
        setBlogCategory('');
        setBlogAuthor('');
        setBlogReadTime('5 dk');
        setBlogContent('');
        fetchBlogs();
      } else {
        setBlogError(data.error || 'Makale oluşturulurken hata oluştu.');
      }
    } catch (err) {
      setBlogError('Ağ hatası oluştu.');
    }
  };

  const handleBanFromChat = (msg) => {
    // Lookup user by name in users list
    const foundUser = users.find(u => u.name === msg.u);
    if (foundUser) {
      handleToggleBan(foundUser.id, foundUser.name, foundUser.is_banned);
    } else {
      alert(`"${msg.u}" adlı kullanıcı sistemde bulunamadı.`);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!user || !user.is_admin) return null;

  return (
    <>
      <AppHeader navigate={navigate} active="admin" />
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6">
          <SectionLabel>Yönetim Arayüzü</SectionLabel>
          <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] font-disp font-bold">Yönetim Paneli</h1>
          <p className="text-sm text-[#74998a] mt-1 font-mono">
            Sistem yöneticisi: <span className="text-[#00ff88]">{user.name}</span>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#0c2719] mb-8 overflow-x-auto">
          {[
            { id: 'users', name: 'Kullanıcı Yönetimi', icon: '👥' },
            { id: 'blogs', name: 'Blog Yönetimi', icon: '📝' },
            { id: 'chat', name: 'Sohbet Moderasyonu', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 border-b-2 font-mono text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,.04)]'
                  : 'border-transparent text-[#74998a] hover:text-[#cdeede] hover:bg-[rgba(0,255,136,.01)]'
              }`}
            >
              <span>{tab.icon}</span>{tab.name}
            </button>
          ))}
        </div>

        {/* TAB 1: KULLANICI YÖNETİMİ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-[400px]">
                <input
                  type="text"
                  placeholder="Kullanıcı adı veya e-posta ile ara..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-[#020806] border border-[#103a26] rounded-lg pl-4 pr-10 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3d564b]">🔍</span>
              </div>
              <button
                onClick={fetchUsers}
                className="font-mono text-xs border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] px-4 py-2.5 rounded-lg transition-all"
              >
                🔄 Yenile
              </button>
            </div>

            {usersLoading ? (
              <div className="text-center py-12 text-[#74998a] font-mono">Kullanıcılar yükleniyor...</div>
            ) : usersError ? (
              <div className="text-center py-12 text-[#ff2e88] font-mono">{usersError}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-[#74998a] font-mono">Kullanıcı bulunamadı.</div>
            ) : (
              <div className="overflow-x-auto border border-[#0c2719] rounded-xl bg-black/25">
                <table className="w-full text-left text-sm font-mono whitespace-nowrap">
                  <thead className="bg-[#05150e] text-[#74998a] border-b border-[#0c2719]">
                    <tr>
                      <th className="p-4">Kullanıcı</th>
                      <th className="p-4">E-posta</th>
                      <th className="p-4 text-center">Seviye / Puan</th>
                      <th className="p-4 text-center">Seri / Rozet</th>
                      <th className="p-4 text-center">Abonelik</th>
                      <th className="p-4 text-center">Durum</th>
                      <th className="p-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0c2719]">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-[#00ff88]/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded bg-[#0a3a24] text-[#5cffba] font-bold text-xs grid place-items-center border border-[#103a26]">
                              {u.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <div className="text-[#eafff5] font-medium">{u.name}</div>
                              <div className="text-xs text-[#3d564b]">ID: {u.id} {u.is_admin && <span className="text-[#ffd166]">[Yönetici]</span>}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#74998a]">{u.email}</td>
                        <td className="p-4 text-center">
                          <div className="text-[#eafff5]">Lvl {u.level}</div>
                          <div className="text-xs text-[#00ff88]">◆ {u.points} Puan</div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-[#eafff5]">{u.streak} Gün 🔥</div>
                          <div className="text-xs text-[#74998a]">{u.badges} Rozet</div>
                        </td>
                        <td className="p-4 text-center">
                          {u.is_premium ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#ffd166]/10 text-[#ffd166] border border-[#ffd166]/20">👑 Premium</span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#3d564b]/10 text-[#74998a] border border-[#3d564b]/20">Free</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {u.is_banned ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#ff2e88]/10 text-[#ff2e88] border border-[#ff2e88]/20">Yasaklı</span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">Aktif</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2 flex justify-end">
                          <button
                            onClick={() => {
                              const token = localStorage.getItem('sk_token');
                              if (confirm(`${u.name} adlı kullanıcının premium durumunu değiştirmek istediğinize emin misiniz?`)) {
                                fetch(`/api/admin/users/${u.id}/premium`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ is_premium: !u.is_premium })
                                }).then(res => {
                                  if (res.ok) {
                                    fetchUsers();
                                  } else {
                                    alert('Premium durumu değiştirilemedi.');
                                  }
                                }).catch(() => alert('Ağ hatası.'));
                              }
                            }}
                            className={`font-mono text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                              u.is_premium
                                ? 'text-[#ffd166] border-[#ffd166]/30 hover:bg-[#ffd166]/10'
                                : 'text-[#74998a] border-[#74998a]/30 hover:bg-[#74998a]/10'
                            }`}
                          >
                            {u.is_premium ? '👑 Premium' : 'Premium Ver'}
                          </button>
                          <button
                            onClick={() => handleToggleBan(u.id, u.name, u.is_banned)}
                            disabled={u.id === user.id}
                            className={`font-mono text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                              u.is_banned
                                ? 'text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/10'
                                : 'text-[#ff2e88] border-[#ff2e88]/30 hover:bg-[#ff2e88]/10 disabled:opacity-30 disabled:hover:bg-transparent'
                            }`}
                          >
                            {u.is_banned ? 'Engeli Kaldır' : 'Yasakla'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BLOG YÖNETİMİ */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-8">
            {/* Create Blog Form */}
            <div className="rounded-2xl border border-[#0c2719] p-6 bg-gradient-to-br from-[#07150e] to-[#04100a] h-fit">
              <h3 className="text-lg text-[#eafff5] font-bold mb-5 flex items-center gap-2">
                <span>✍️</span> Yeni Blog Yazısı Oluştur
              </h3>
              {blogSuccess && <div className="p-3 mb-4 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 text-xs font-mono">{blogSuccess}</div>}
              {blogError && <div className="p-3 mb-4 rounded bg-[#ff2e88]/10 text-[#ff2e88] border border-[#ff2e88]/20 text-xs font-mono">{blogError}</div>}
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#74998a] mb-1.5 font-mono">BAŞLIK *</label>
                  <input
                    required
                    type="text"
                    placeholder="örn: Wi-Fi El Sıkışması Kırma (WPA2 Crack)"
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#74998a] mb-1.5 font-mono">KATEGORİ *</label>
                    <input
                      required
                      type="text"
                      placeholder="örn: Ağ Güvenliği"
                      value={blogCategory}
                      onChange={e => setBlogCategory(e.target.value)}
                      className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#74998a] mb-1.5 font-mono">OKUMA SÜRESİ</label>
                    <input
                      type="text"
                      placeholder="örn: 7 dk"
                      value={blogReadTime}
                      onChange={e => setBlogReadTime(e.target.value)}
                      className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#74998a] mb-1.5 font-mono">YAZAR *</label>
                    <input
                      required
                      type="text"
                      placeholder="örn: Siber Mentör"
                      value={blogAuthor}
                      onChange={e => setBlogAuthor(e.target.value)}
                      className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#74998a] mb-1.5 font-mono">ÖZET (EXCERPT)</label>
                  <textarea
                    rows="2"
                    placeholder="Makalenin kısa bir açıklaması..."
                    value={blogExcerpt}
                    onChange={e => setBlogExcerpt(e.target.value)}
                    className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#74998a] mb-1.5 font-mono">İÇERİK (MARKDOWN / TEXT) *</label>
                  <textarea
                    required
                    rows="8"
                    placeholder="Makalenin tam içeriği buraya yazılır..."
                    value={blogContent}
                    onChange={e => setBlogContent(e.target.value)}
                    className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all"
                >
                  Yayınla 🚀
                </button>
              </form>
            </div>

            {/* List Existing Blogs */}
            <div className="space-y-4">
              <h3 className="text-lg text-[#eafff5] font-bold mb-1 flex items-center gap-2">
                <span>📚</span> Mevcut Blog Yazıları
              </h3>
              {blogsLoading ? (
                <div className="text-center py-12 text-[#74998a] font-mono">Makaleler yükleniyor...</div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-12 text-[#74998a] font-mono border border-dashed border-[#103a26] rounded-xl bg-[#020806]/40">
                  Henüz makale yayınlanmamış.
                </div>
              ) : (
                <div className="space-y-3 max-h-[660px] overflow-y-auto pr-1">
                  {blogs.map(b => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#0c2719] p-4 bg-gradient-to-br from-[#07150e] to-[#04100a] flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2 py-0.5 rounded-full">
                            {b.category}
                          </span>
                          <span className="text-[10px] text-[#74998a] font-mono">{b.readTime || b.read_time}</span>
                        </div>
                        <h4 className="text-[#eafff5] font-medium text-sm truncate">{b.title}</h4>
                        <p className="text-xs text-[#3d564b] mt-1 font-mono">
                          Yazar: {b.author} • {b.date || 'Bugün'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteBlog(b.id, b.title)}
                        className="flex-none font-mono text-xs text-[#ff2e88] border border-[#ff2e88]/30 hover:bg-[#ff2e88]/10 px-3 py-2 rounded-lg transition-all"
                      >
                        Sil 🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SOHBET MODERASYONU */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg text-[#eafff5] font-bold flex items-center gap-2">
                <span>💬</span> Son Sohbet Mesajları
              </h3>
              <button
                onClick={fetchChatMessages}
                className="font-mono text-xs border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] px-4 py-2.5 rounded-lg transition-all"
              >
                🔄 Sohbeti Yenile
              </button>
            </div>

            {chatLoading ? (
              <div className="text-center py-12 text-[#74998a] font-mono">Mesajlar yükleniyor...</div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center py-12 text-[#74998a] font-mono border border-dashed border-[#103a26] rounded-xl bg-[#020806]/40">
                Sohbet geçmişi bulunmuyor.
              </div>
            ) : (
              <div className="rounded-2xl border border-[#0c2719] bg-gradient-to-br from-[#07150e] to-[#04100a] p-5 space-y-4 max-h-[500px] overflow-y-auto">
                {chatMessages.map((msg, i) => {
                  const matchingUser = users.find(u => u.name === msg.u);
                  const isUserBanned = matchingUser ? matchingUser.is_banned : false;
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex items-start justify-between gap-4 p-3 rounded-lg border transition-all ${
                        isUserBanned ? 'border-[#ff2e88]/20 bg-[#ff2e88]/[0.02]' : 'border-[#103a26]/30 bg-black/10'
                      }`}
                    >
                      <div className="flex gap-3 min-w-0">
                        <span className="w-8 h-8 rounded bg-[#0a3a24] text-[#5cffba] font-bold text-xs grid place-items-center flex-none">
                          {msg.u.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm text-[#eafff5] font-medium">{msg.u}</span>
                            <span className="text-[10px] text-[#3d564b] font-mono px-1.5 py-0.5 rounded bg-[#04100a] border border-[#0c2719]">
                              {msg.role}
                            </span>
                            <span className="text-[10px] text-[#3d564b]">{msg.t}</span>
                            {isUserBanned && (
                              <span className="text-[10px] text-[#ff2e88] font-mono font-bold">[YASAKLI]</span>
                            )}
                          </div>
                          <div className="text-sm text-[#cdeede] break-words leading-relaxed font-mono">
                            {msg.m}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBanFromChat(msg)}
                        disabled={matchingUser?.id === user.id}
                        className={`flex-none font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          isUserBanned
                            ? 'text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/10'
                            : 'text-[#ff2e88] border-[#ff2e88]/30 hover:bg-[#ff2e88]/10 disabled:opacity-30 disabled:hover:bg-transparent'
                        }`}
                      >
                        {isUserBanned ? 'Engeli Kaldır' : 'Banla 🚫'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
      <SKFooter navigate={navigate} />
    </>
  );
};

/* ============ REGISTER PAGES ============ */
Object.assign(PAGES, {
  dashboard: DashboardPage,
  room: RoomPage,
  roomArticle: RoomArticlePage,
  leaderboard: LeaderboardPage,
  chat: ChatPage,
  category: CategoryPage,
  admin: AdminPage,
});

/* ============ SHARED EXPORTS (for app-pages.jsx, separate babel scope) ============ */
Object.assign(window, { SKAppHeader: AppHeader, SKME: ME, SKSectionLabel: SectionLabel, SKuseUser: useUser });
