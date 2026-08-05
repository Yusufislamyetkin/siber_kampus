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

      // Fetch Doc Progress
      fetch('/api/docs/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          localStorage.setItem('sk_completed_docs', JSON.stringify(data));
          syncUserFromLocalStorage();
          rerender(n => n + 1);
        }
      })
      .catch(err => console.error("Döküman ilerlemesi senkronizasyon hatası:", err));
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
  const [showVIPMentorModal, setShowVIPMentorModal] = useState(false);
  const [user] = useUser();

  useEffect(() => {
    const handleOpen = () => setShowVIPMentorModal(true);
    window.addEventListener('open_vip_mentor_modal', handleOpen);
    return () => window.removeEventListener('open_vip_mentor_modal', handleOpen);
  }, []);

  const nav = [['Dashboard', 'dashboard', '▣']];
  if (user && user.is_admin) {
    nav.push(['Yönetim Paneli', 'admin', '⚙️']);
  }
  return (
    <>
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

            <div className="relative">
              <button onClick={() => setOpen(o => !o)} aria-label="Kullanıcı Menüsü" className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border border-[#103a26] hover:border-[#00ff88] transition-colors">
                <span className="w-7 h-7 rounded-md grid place-items-center text-[#5cffba] font-bold text-xs border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{user.avatar}</span>
                <span className="hidden sm:inline text-sm text-[#cdeede] font-mono">{user.name}</span>
                <span className="text-[#74998a] text-[10px]">▼</span>
              </button>
              {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-[#04100a] border border-[#103a26] rounded-lg p-1.5 shadow-[0_20px_50px_-20px_#000] z-50">
                  {[['Sertifikalarım', 'certificates']].map(([t, p], i) => (
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
            
            <button onClick={() => setMobileMenuOpen(o => !o)} aria-label="Mobil Menüyü Aç/Kapat" className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all">
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

          </div>
        )}
      </header>

      {showVIPMentorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowVIPMentorModal(false)}>
          <div 
            className="border border-[#103a26] rounded-2xl max-w-[560px] w-full overflow-hidden shadow-[0_0_80px_rgba(255,209,102,.15)]" 
            style={{ background: 'linear-gradient(165deg,#07150e,#020806)', animation: 'modalScaleIn .4s cubic-bezier(0.16,1,0.3,1) both' }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Header branding */}
            <div className="bg-[#ffd166]/10 border-b border-[#ffd166]/20 px-6 py-3.5 flex items-center justify-between">
              <span className="font-mono text-xs text-[#ffd166] tracking-[0.2em] uppercase font-bold">👑 BİRE BİR EĞİTİM VE MENTÖRLÜK</span>
              <button onClick={() => setShowVIPMentorModal(false)} className="text-[#ffd166] hover:text-white transition-colors text-sm font-mono">[X]</button>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Tutor Image Panel */}
              <div className="relative w-[140px] h-[180px] rounded-xl overflow-hidden border border-[#ffd166]/30 bg-black/40 shadow-[0_0_30px_-5px_rgba(255,209,102,.3)] flex-none">
                <img src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" alt="Siber Mentör" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,209,102,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40 z-10"></div>
                <div className="absolute top-2 left-2 font-disp font-bold text-[8px] tracking-widest text-[#ffd166] bg-black/75 px-1.5 py-0.5 border border-[#ffd166]/20 rounded uppercase z-10">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#ffd166] mr-1 sk-pulse"></span> Çevrimiçi
                </div>
                <div className="absolute bottom-2 left-2 right-2 z-10 text-left">
                  <div className="font-disp font-bold text-xs text-white">Siber Mentör</div>
                  <div className="text-[8px] font-mono text-[#74998a]">VIP Yol Arkadaşın</div>
                </div>
              </div>

              {/* Speech Box */}
              <div className="flex-1 text-left">
                <div className="relative bg-[#07150e] border border-[#103a26] rounded-xl p-5 shadow-inner">
                  {/* Small arrow for speech bubble */}
                  <div className="hidden md:block absolute left-[-8px] top-8 w-4 h-4 bg-[#07150e] border-l border-b border-[#103a26] rotate-45"></div>
                  
                  {user.is_vip ? (
                    <>
                      <div className="font-disp font-bold text-base text-[#ffd166] mb-3">Hoş geldin VIP Siber Mentorluk Öğrencim! 👑</div>
                      <p className="text-xs text-[#cdeede] leading-relaxed mb-3">
                        Bire bir mentörlük desteğin aktif durumdadır!
                      </p>
                      <p className="text-xs text-[#9fc4b5] leading-relaxed mb-3">
                        Kişisel öğrenme hedeflerine göre hazırlanmış ders programımız doğrultusunda canlı pentest seanslarımıza devam edebiliriz.
                      </p>
                      <p className="text-xs text-[#9fc4b5] leading-relaxed mb-3">
                        Bire bir canlı dersler ve mülakat simülasyonları için Discord kanallarımız veya Canlı Destek üzerinden doğrudan bana yazabilirsin.
                      </p>
                    </>
                  ) : user.is_premium ? (
                    <>
                      <div className="font-disp font-bold text-base text-[#ffd166] mb-3">Hoş geldin VIP Platform Öğrencim! 👑</div>
                      <p className="text-xs text-[#cdeede] leading-relaxed mb-3">
                        Siber Kampüs VIP Platform erişim üyeliğiniz aktif durumdadır!
                      </p>
                      <p className="text-xs text-[#9fc4b5] leading-relaxed mb-3">
                        60 interaktif ders, 600+ test sorusu ve pratik video kütüphanemize tam erişiminiz bulunmaktadır.
                      </p>
                      <p className="text-xs text-[#9fc4b5] leading-relaxed">
                        <strong>Not:</strong> Bu üyelik modeli 1'e 1 canlı dersleri veya direkt eğitmen chat desteğini kapsamaz. Haftalık birebir canlı dersler ve 7/24 soru sorma hakkı elde etmek isterseniz, mentorluk paketine geçebilirsiniz.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-disp font-bold text-base text-[#ffd166] mb-3">Selam Geleceğin Hacker'ı! 👋</div>
                      <p className="text-xs text-[#cdeede] leading-relaxed mb-3">
                        Siber Kampüs Platformu ile siber güvenlik kariyerini en üst seviyeye taşımaya hazır mısın?
                      </p>
                      <ul className="text-xs text-[#9fc4b5] leading-relaxed mb-3 space-y-1.5 list-disc pl-4">
                        <li><strong>60 Konu Anlatımı & 600+ Soru:</strong> Kendi laboratuvar ortamında pratik yaparak sızma testlerini deneyimleyin.</li>
                        <li><strong>10+ Saldırı & Savunma Videosu:</strong> Sektör uzmanlarının gerçek sistemlerdeki pentest kayıtlarını izleyin.</li>
                        <li><strong>Resmi Başarı Sertifikası:</strong> Eğitimleri tamamladığınızda doğrulanabilir sertifika kazanın.</li>
                        <li><strong>Canlı Ön Görüşme (Hediye):</strong> Platforma yıllık kayıt olan VIP üyelerimize özel birebir kariyer yol haritası seansı.</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
 
            {/* Actions Panel */}
            <div className="bg-[#020806]/60 border-t border-[#0c2719] px-6 py-4 flex flex-col sm:flex-row gap-2.5 justify-end">
              <button 
                onClick={() => setShowVIPMentorModal(false)}
                className="order-2 sm:order-1 px-4 py-2.5 border border-[#103a26] text-[#74998a] hover:text-[#eafff5] hover:border-[#74998a] rounded-xl text-xs font-mono transition-colors"
              >
                Kapat
              </button>
              {user.is_vip ? (
                <button 
                  onClick={() => {
                    setShowVIPMentorModal(false);
                    const supportLauncher = document.querySelector('[aria-label="Destek Sohbetini Aç/Kapat"]');
                    if (supportLauncher) {
                      supportLauncher.click();
                    }
                  }}
                  className="order-1 sm:order-2 px-4 py-2.5 rounded-xl bg-[#00ff88] text-[#021008] font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all font-mono text-xs"
                >
                  💬 Canlı Desteğe Yaz
                </button>
              ) : user.is_premium ? (
                <button 
                  onClick={() => {
                    setShowVIPMentorModal(false);
                    navigate('pricing');
                  }}
                  className="order-1 sm:order-2 px-4 py-2.5 rounded-xl bg-[#ffd166] text-[#021008] font-bold hover:bg-[#ff9500] hover:shadow-[0_0_20px_rgba(255,209,102,0.3)] transition-all font-mono text-xs animate-pulse"
                >
                  ⚡ Birebir Mentorluğa Yükselt
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setShowVIPMentorModal(false);
                    navigate('pricing');
                  }}
                  className="order-1 sm:order-2 px-4 py-2.5 rounded-xl bg-[#00ff88] text-[#021008] font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all font-mono text-xs animate-pulse"
                >
                  ⚡ VIP Platforma Katıl (900 TL)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SectionLabel = ({ children }) => (
  <span className="font-mono text-[12px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5 mb-4"><span className="text-[#5c8a74] font-bold">//</span> {children}</span>
);

/* ============ DASHBOARD ============ */
const DashboardPage = ({ navigate, data }) => {
  const [user, updateUser] = useUser();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([null, null, null]);

  // Progress state: index of the highest unlocked lesson (0 to 30)
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('sk_lessons_progress');
      return saved ? JSON.parse(saved) : { 'ag-guvenligi': 0, 'uyg-guvenligi': 0 };
    } catch (e) {
      return { 'ag-guvenligi': 0, 'uyg-guvenligi': 0 };
    }
  });

  const saveProgress = (newProg) => {
    setProgress(newProg);
    localStorage.setItem('sk_lessons_progress', JSON.stringify(newProg));
  };

  // When active category changes, default to the highest unlocked lesson (clamped to 0-29)
  useEffect(() => {
    if (activeCategory) {
      const currentProg = progress[activeCategory] || 0;
      const defaultIdx = Math.min(currentProg, 29);
      setSelectedLessonIdx(defaultIdx);
      setQuizAnswers([null, null, null]);
    }
  }, [activeCategory]);

  // Reset quiz state when changing lesson
  useEffect(() => {
    setQuizAnswers([null, null, null]);
  }, [selectedLessonIdx]);

  const lessons = window.SK_LESSONS ? window.SK_LESSONS[activeCategory] : [];
  const currentLesson = lessons ? lessons[selectedLessonIdx] : null;

  // Calculate progress percentages for category cards
  const getCatProgressPercent = (catKey) => {
    const progVal = progress[catKey] || 0;
    return Math.min(Math.round((progVal / 30) * 100), 100);
  };

  const handleOptionClick = (qIdx, optIdx) => {
    const newAnswers = [...quizAnswers];
    newAnswers[qIdx] = optIdx;
    setQuizAnswers(newAnswers);
  };

  const handleNextLesson = () => {
    const nextIdx = selectedLessonIdx + 1;
    const currentProg = progress[activeCategory] || 0;

    let newProgVal = currentProg;
    if (nextIdx > currentProg) {
      newProgVal = nextIdx;
      const newProgress = { ...progress, [activeCategory]: newProgVal };
      saveProgress(newProgress);
      
      // Award user points as encouragement
      if (updateUser) {
        updateUser({ points: user.points + 10 });
      }
    }

    if (nextIdx < 30) {
      setSelectedLessonIdx(nextIdx);
    } else {
      alert("Tebrikler! Bu kategorideki tüm dersleri başarıyla tamamladınız! 🎉");
      setActiveCategory(null);
    }
  };

  // If no category selected, show the 2 Category Cards
  if (!activeCategory) {
    return (
      <>
        <AppHeader navigate={navigate} active="dashboard" />
        <main className="max-w-[1280px] mx-auto px-6 py-12">
          {/* welcome section */}
          <div className="mb-10 text-center md:text-left">
            <p className="font-mono text-sm text-[#74998a] mb-2">root@siberkampus: <span className="text-[#00ff88]">~/dashboard</span></p>
            <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] font-disp font-bold">
              Hoş geldin, <span className="text-[#00ff88]">{user.name}</span>
            </h1>
            <p className="text-sm text-[#74998a] mt-2 font-mono">Lütfen devam etmek istediğiniz eğitim rotasını seçin.</p>
          </div>

          {/* 2 Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {/* Card 1: Ağ Güvenliği */}
            <div 
              onClick={() => setActiveCategory('ag-guvenligi')}
              className="rounded-2xl border border-[#0c2719] p-8 flex flex-col justify-between bg-gradient-to-br from-[#07150e] to-[#04100a] hover:border-[#00ff88] transition-all cursor-pointer group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl border border-[#00ff88]/20 bg-[#00ff88]/5 group-hover:scale-105 transition-transform mb-6">
                  📡
                </div>
                <h2 className="text-2xl text-[#eafff5] font-disp font-bold group-hover:text-[#00ff88] transition-colors">
                  Ağ Güvenliği
                </h2>
                <p className="text-sm text-[#74998a] mt-3 leading-relaxed font-mono">
                  TCP/IP, OSI modeli, Nmap keşif taramaları, Wireshark paket analizi, ARP spoofing ve kablosuz ağ saldırıları gibi temel ağ güvenliği konularını uygulamalı olarak öğrenin.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#0c2719]">
                <div className="flex justify-between text-xs font-mono text-[#74998a] mb-2">
                  <span>Ders İlerlemesi: {progress['ag-guvenligi'] || 0} / 30</span>
                  <span className="text-[#00ff88]">{getCatProgressPercent('ag-guvenligi')}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden">
                  <div 
                    className="transition-all duration-500" 
                    style={{ 
                      width: `${getCatProgressPercent('ag-guvenligi')}%`, 
                      height: '100%', 
                      backgroundColor: '#00ff88', 
                      borderRadius: '9999px',
                      minWidth: (progress['ag-guvenligi'] || 0) > 0 ? '6px' : '0'
                    }}
                  ></div>
                </div>
                <button className="w-full mt-6 py-3 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-xl group-hover:shadow-[0_0_20px_var(--glow)] transition-all uppercase tracking-wider text-sm text-center">
                  Eğitime Git ⚡
                </button>
              </div>
            </div>

            {/* Card 2: Uygulama Güvenliği */}
            <div 
              onClick={() => setActiveCategory('uyg-guvenligi')}
              className="rounded-2xl border border-[#0c2719] p-8 flex flex-col justify-between bg-gradient-to-br from-[#07150e] to-[#04100a] hover:border-[#ffd166] transition-all cursor-pointer group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl border border-[#ffd166]/20 bg-[#ffd166]/5 group-hover:scale-105 transition-transform mb-6">
                  💻
                </div>
                <h2 className="text-2xl text-[#eafff5] font-disp font-bold group-hover:text-[#ffd166] transition-colors">
                  Uygulama Güvenliği
                </h2>
                <p className="text-sm text-[#74998a] mt-3 leading-relaxed font-mono">
                  OWASP Top 10 standartları, SQLi, XSS, CSRF, LFI/RFI, dosya yükleme açıkları, JWT manipülasyonu, CORS zafiyetleri ve API güvenliğini adım adım keşfedin.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#0c2719]">
                <div className="flex justify-between text-xs font-mono text-[#74998a] mb-2">
                  <span>Ders İlerlemesi: {progress['uyg-guvenligi'] || 0} / 30</span>
                  <span className="text-[#ffd166]">{getCatProgressPercent('uyg-guvenligi')}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden">
                  <div 
                    className="transition-all duration-500" 
                    style={{ 
                      width: `${getCatProgressPercent('uyg-guvenligi')}%`, 
                      height: '100%', 
                      backgroundColor: '#ffd166', 
                      borderRadius: '9999px',
                      minWidth: (progress['uyg-guvenligi'] || 0) > 0 ? '6px' : '0'
                    }}
                  ></div>
                </div>
                <button className="w-full mt-6 py-3 font-mono font-bold text-[#021008] bg-[#ffd166] rounded-xl group-hover:shadow-[0_0_20px_rgba(255,209,102,0.3)] transition-all uppercase tracking-wider text-sm text-center">
                  Eğitime Git ⚡
                </button>
              </div>
            </div>
          </div>
        </main>
        <SKFooter navigate={navigate} />
      </>
    );
  }

  // Split-screen Workspace view
  const categoryTitle = activeCategory === 'ag-guvenligi' ? 'Ağ Güvenliği Eğitimi' : 'Uygulama Güvenliği Eğitimi';
  const catProgressVal = progress[activeCategory] || 0;

  return (
    <>
      <AppHeader navigate={navigate} active="dashboard" />
      
      {/* Category workspace header */}
      <div className="bg-[#04100a] border-b border-[#0c2719] py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveCategory(null)}
              className="px-4 py-2 border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] rounded-xl font-mono text-xs transition-all flex items-center gap-1.5"
            >
              <span>←</span> Kategoriler
            </button>
            <h1 className="text-lg md:text-xl text-[#eafff5] font-disp font-bold flex items-center gap-2">
              <span>{activeCategory === 'ag-guvenligi' ? '📡' : '💻'}</span>
              {categoryTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono text-[#5c8a74] uppercase">Toplam İlerleme</div>
              <div className="text-xs font-mono font-bold text-[#eafff5]">
                {catProgressVal} / 30 Ders ({getCatProgressPercent(activeCategory)}%)
              </div>
            </div>
            <div className="w-36 h-2 rounded-full bg-[#0c2719] overflow-hidden">
              <div 
                className="transition-all duration-500" 
                style={{ 
                  width: `${getCatProgressPercent(activeCategory)}%`, 
                  height: '100%', 
                  backgroundColor: activeCategory === 'ag-guvenligi' ? '#00ff88' : '#ffd166', 
                  borderRadius: '9999px',
                  minWidth: (progress[activeCategory] || 0) > 0 ? '6px' : '0'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[290px_1fr] h-[calc(100vh-140px)] overflow-hidden">
        {/* Left Panel: Lessons List */}
        <div className="border-r border-[#0c2719] bg-[#020806] overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs font-mono text-[#5c8a74] uppercase tracking-wider px-2 mb-2">Müfredat Konuları</div>
          {lessons.map((lesson, idx) => {
            const isUnlocked = idx <= catProgressVal;
            const isCompleted = idx < catProgressVal;
            const isActive = idx === selectedLessonIdx;

            let statusIcon = "🔒";
            let itemClass = "border-transparent opacity-50 cursor-not-allowed";
            if (isUnlocked) {
              statusIcon = isCompleted ? "✅" : "⚡";
              itemClass = isActive 
                ? "border-[#00ff88] bg-[rgba(0,255,136,0.06)] text-[#eafff5] cursor-pointer"
                : "border-[#103a26] hover:border-[#00ff88]/50 hover:bg-[rgba(0,255,136,0.02)] text-[#9fc4b5] cursor-pointer";
            }

            return (
              <div 
                key={lesson.id}
                onClick={() => isUnlocked && setSelectedLessonIdx(idx)}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 select-none ${itemClass}`}
              >
                <span className="text-sm shrink-0">{statusIcon}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#5c8a74] uppercase">DERS {String(idx + 1).padStart(2, '0')}</div>
                  <div className="text-xs font-disp font-semibold truncate mt-0.5" title={lesson.title}>{lesson.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Content & Quiz Workspace */}
        <div className="bg-[#030e09] overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
          {currentLesson ? (
            <div className="max-w-[850px] mx-auto w-full space-y-8">
              {/* Lesson Metadata */}
              <div>
                <span className="font-mono text-xs text-[#00ff88] uppercase tracking-wider">
                  // {categoryTitle} — DERS {String(selectedLessonIdx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl md:text-3xl text-[#eafff5] font-disp font-bold mt-2">
                  {currentLesson.title}
                </h2>
              </div>

              {/* Lesson HTML Content */}
              <div 
                className="prose prose-invert max-w-none text-[#cdeede] text-sm md:text-base leading-relaxed space-y-4 font-sans"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />

              {/* Lesson Example Box */}
              <div 
                className="rounded-xl border border-[#103a26] bg-[#020806] p-5 font-mono text-xs md:text-sm text-[#9fc4b5]"
                dangerouslySetInnerHTML={{ __html: currentLesson.example }}
              />

              {/* Quiz Section */}
              <div className="pt-8 border-t border-[#0c2719] space-y-8">
                <div>
                  <h3 className="text-lg text-[#eafff5] font-disp font-bold flex items-center gap-2">
                    <span>📝</span> Değerlendirme Testi
                  </h3>
                  <p className="text-xs text-[#74998a] mt-1 font-mono">
                    Bir sonraki dersi açabilmek için aşağıdaki {currentLesson.questions.length} soruyu da doğru yanıtlamanız gerekmektedir.
                  </p>
                </div>

                <div className="space-y-6">
                  {currentLesson.questions.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[qIdx];
                    const isAnswered = selectedOpt !== null;
                    const isCorrect = isAnswered && selectedOpt === q.correct;

                    return (
                      <div key={qIdx} className="p-5 rounded-xl border border-[#103a26] bg-[#04100a] space-y-4">
                        <div className="text-sm font-semibold text-[#eafff5]">
                          Soru {qIdx + 1}: {q.q}
                        </div>
                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isThisSelected = selectedOpt === optIdx;
                            const isCorrectOpt = optIdx === q.correct;
                            
                            let optClass = "border-[#103a26] text-[#9fc4b5] hover:border-[#00ff88]/50 hover:bg-[rgba(0,255,136,0.02)]";
                            if (isThisSelected) {
                              optClass = isCorrectOpt
                                ? "border-[#00ff88] bg-[rgba(0,255,136,0.08)] text-[#00ff88] font-bold"
                                : "border-red-500 bg-red-500/10 text-red-500 font-bold";
                            } else if (isAnswered && isCorrectOpt) {
                              optClass = "border-[#00ff88]/30 text-[#00ff88]/70";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleOptionClick(qIdx, optIdx)}
                                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${optClass}`}
                              >
                                <span>{opt}</span>
                                {isThisSelected && (
                                  <span>{isCorrectOpt ? "✓" : "✗"}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Success / Next button */}
                {(() => {
                  const allQuestionsAnswered = quizAnswers.every(ans => ans !== null);
                  const allQuestionsCorrect = currentLesson.questions.every((q, qIdx) => quizAnswers[qIdx] === q.correct);

                  if (allQuestionsCorrect) {
                    const isAlreadyCompleted = selectedLessonIdx < catProgressVal;
                    return (
                      <div className="p-5 rounded-xl border border-[#00ff88]/30 bg-[rgba(0,255,136,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-[#00ff88] flex items-center gap-1.5">
                            <span>🎉</span> Harika! Tüm soruları doğru yanıtladınız!
                          </div>
                          <p className="text-xs text-[#74998a] mt-1 font-mono">
                            {isAlreadyCompleted ? "Bu dersi daha önce tamamladınız." : "Tebrikler! +10 Puan kazandınız ve sonraki dersin kilidi açıldı."}
                          </p>
                        </div>
                        <button
                          onClick={handleNextLesson}
                          className="px-6 py-3 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-xl hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] transition-all flex items-center gap-1.5 uppercase text-xs self-start sm:self-auto"
                        >
                          {selectedLessonIdx < 29 ? "Sonraki Derse Geç" : "Eğitimi Tamamla"} <span>→</span>
                        </button>
                      </div>
                    );
                  } else if (allQuestionsAnswered) {
                    return (
                      <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 text-center">
                        <div className="text-sm font-bold text-red-500 flex items-center justify-center gap-1.5">
                          <span>✗</span> Maalesef bazı soruları yanlış cevapladınız.
                        </div>
                        <p className="text-xs text-[#74998a] mt-1 font-mono">
                          Lütfen konu anlatımını tekrar inceleyip doğru cevapları bulun.
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#74998a] font-mono">
              Ders yükleniyor...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ============ CATEGORY PAGE (odaları listele) ============ */
const CategoryPage = ({ navigate, data }) => {
  const cat = data || window.SK_CATEGORIES[0];
  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };
  const total = cat.rooms.reduce((a, r) => a + r.points, 0);
  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  const [user] = useUser();
  const [premiumModal, setPremiumModal] = useState(false);

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
          {cat.rooms.map((room, i) => {
            const isPremiumLocked = room.premium && !user.is_premium;
            return (
              <div 
                key={room.id} 
                onClick={() => {
                  if (isPremiumLocked) {
                    setPremiumModal(true);
                  } else {
                    navigate('roomArticle', { ...room, cat: cat.name });
                  }
                }} 
                className={`group cursor-pointer border rounded-xl p-7 hover:shadow-[0_24px_50px_-28px_rgba(0,255,136,.35)] transition-all ${
                  isPremiumLocked 
                    ? 'border-[#ffd166]/20 hover:border-[#ffd166] hover:shadow-[0_24px_50px_-28px_rgba(255,209,102,.12)]' 
                    : 'border-[#0c2719] hover:border-[#00ff88]'
                }`}
                style={{ background: isPremiumLocked ? 'linear-gradient(165deg,#0d1a12,#04100a)' : 'linear-gradient(165deg,#07150e,#04100a)' }}
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-[#5c8a74]">{room.id.toUpperCase()}</span>
                      {room.premium && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-[#ffd166] bg-[#ffd166]/10 border border-[#ffd166]/20 font-mono tracking-wider">👑 VIP</span>
                      )}
                    </div>
                    <h2 className={`text-lg transition-colors ${isPremiumLocked ? 'text-[#eafff5] group-hover:text-[#ffd166]' : 'text-[#eafff5] group-hover:text-[#00ff88]'}`} style={{ lineHeight: 1.25 }}>{room.name}</h2>
                    <p className="text-sm text-[#74998a] mt-1.5">{room.desc}</p>
                  </div>
                  <span className={"text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap " + (dc[room.difficulty] || '')}>{room.difficulty}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#0c2719] text-xs text-[#5c8a74]">
                  <div className="flex items-center gap-4">
                    <span>👥 {room.users.toLocaleString('tr-TR')}</span>
                    <span className={isPremiumLocked ? 'font-mono text-[#ffd166]' : 'font-mono text-[#00ff88]'}>◆ {room.points}</span>
                  </div>
                  {solvedList.includes(room.id) ? (
                    <span className="text-[#00ff88] font-bold">✓ Çözüldü</span>
                  ) : isPremiumLocked ? (
                    <span className="text-[#ffd166] font-bold group-hover:text-[#ffe082] transition-colors flex items-center gap-1">🔒 VIP Kilit Aç →</span>
                  ) : (
                    <span className="group-hover:text-[#00ff88] transition-colors">Başla →</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <SKFooter navigate={navigate} />

      {premiumModal && (
        <div className="fixed inset-0 bg-[#020806]/90 z-[999] grid place-items-center p-4 overflow-y-auto" onClick={() => setPremiumModal(false)}>
          <div 
            className="relative max-w-2xl w-full border border-[#ffd166]/30 bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(255,209,102,.15)] overflow-hidden" 
            style={{ background: 'linear-gradient(165deg,#07150e,#020806)', animation: 'modalScaleIn .4s cubic-bezier(0.16,1,0.3,1) both' }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Header branding */}
            <div className="bg-[#ffd166]/10 border-b border-[#ffd166]/20 px-6 py-3.5 flex items-center justify-between">
              <span className="font-mono text-xs text-[#ffd166] tracking-[0.2em] uppercase font-bold">👑 UZMANIN YOLU · VIP MENTÖRLÜK</span>
              <button onClick={() => setPremiumModal(false)} className="text-[#ffd166] hover:text-white transition-colors text-sm font-mono">[X]</button>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Tutor Image Panel */}
              <div className="relative w-[180px] h-[220px] rounded-xl overflow-hidden border border-[#ffd166]/30 bg-black/40 shadow-[0_0_30px_-5px_rgba(255,209,102,.3)] flex-none">
                <img src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" alt="Siber Mentör" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,209,102,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40 z-10"></div>
                <div className="absolute top-2 left-2 font-disp font-bold text-[8px] tracking-widest text-[#ffd166] bg-black/75 px-1.5 py-0.5 border border-[#ffd166]/20 rounded uppercase z-10">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#ffd166] mr-1 sk-pulse"></span> Çevrimiçi
                </div>
                <div className="absolute bottom-2 left-2 right-2 z-10 text-left">
                  <div className="font-disp font-bold text-xs text-white">Siber Mentör</div>
                  <div className="text-[8px] font-mono text-[#74998a]">VIP Yol Arkadaşın</div>
                </div>
              </div>

              {/* Speech Box */}
              <div className="flex-1 text-left">
                <div className="relative bg-[#07150e] border border-[#103a26] rounded-xl p-5 md:p-6 shadow-inner">
                  {/* Small arrow for speech bubble */}
                  <div className="hidden md:block absolute left-[-8px] top-10 w-4 h-4 bg-[#07150e] border-l border-b border-[#103a26] rotate-45"></div>
                  
                  <div className="font-disp font-bold text-lg text-[#ffd166] mb-3">Merhaba Siber Kampüslü! 👋</div>
                  <p className="text-sm text-[#cdeede] leading-relaxed mb-4">
                    Bu muhteşem yolculukta ilerlemek ve bu laboratuvara erişmek için <strong>VIP üye</strong> olman gerekiyor.
                  </p>
                  <p className="text-sm text-[#9fc4b5] leading-relaxed mb-4">
                    VIP üyeliğinde seninle <strong>bire bir mentörlük</strong> yapacağız. Çözdüğün laboratuvarları inceleyecek, hatalarını analiz edecek ve takıldığın yerlerde sana özel rehberlik edeceğim.
                  </p>
                  <p className="text-sm text-[#9fc4b5] leading-relaxed">
                    Ayrıca, <strong>gerçekçi hedef sitelerde</strong> (E-Ticaret, Bankacılık ve Kurumsal Ağlar) canlı hacking ve sızma testi çalışmalarını beraber yürüteceğiz!
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-[#020806]/60 border-t border-[#0c2719] px-6 py-5 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => setPremiumModal(false)}
                className="order-2 sm:order-1 px-5 py-3 border border-[#103a26] text-[#74998a] hover:text-[#eafff5] hover:border-[#74998a] rounded-xl text-xs font-mono transition-colors"
              >
                Daha Sonra
              </button>
              <button 
                onClick={() => {
                  setPremiumModal(false);
                  navigate('pricing');
                }} 
                className="order-1 sm:order-2 px-6 py-3 font-mono text-xs font-bold text-[#021008] bg-[#ffd166] rounded-xl hover:shadow-[0_0_24px_rgba(255,209,102,0.4)] hover:bg-[#ffe082] transition-all uppercase tracking-wider"
              >
                VIP Üyeliğe Yükselt 👑
              </button>
            </div>
          </div>
        </div>
      )}
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
                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Mantıksal OR Koşulu Ekleme
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-[#74998a]">
                        Sorgunun her zaman doğru (True) dönmesini sağlamak için mantıksal bir VEYA ifadesi ekleyin: <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">OR 1=1</code>.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-4 rounded-xl border transition-all ${step3Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step2Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step3Done ? "text-[#00ff88]" : step2Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step3Done ? "✓ Adım 3:" : "○ Adım 3:"}</span>
                          Şifre Kontrolünü Yorum Yapmak
                        </span>
                        {step3Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step2Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
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
      "Payload: <script>alert(document.cookie)</script> veya <img src=x onerror=alert(document.cookie)>"
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const qVal = target.q || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const hasTag = /<[a-z]/i.test(qVal);
      const hasScript = /<script>/i.test(qVal) && /<\/script>/i.test(qVal);
      const hasEventHandler = /on(error|load|click|mouseover)\s*=/i.test(qVal);
      const hasAlert = /alert\s*\(/i.test(qVal);
      const hasCookie = /document\.cookie/i.test(qVal);

      const step1Done = hasTag;
      const step2Done = hasTag && (hasScript || hasEventHandler) && hasAlert;
      const step3Done = step2Done && hasCookie;

      let feedbackMsg = "Arama kutusuna bir ürün adı veya HTML etiketi girerek başlayın.";
      let isError = false;
      let isSuccess = false;

      if (!qVal) {
        feedbackMsg = "E-ticaret arama kutusuna bir girdi yazıp 'Ara' butonuna basın. Normal metin mi yoksa HTML/JS kodu mu kabul edildiğini test edin.";
      } else if (hasTag && !hasAlert) {
        feedbackMsg = "💡 HTML etiketi algılandı! Girdiniz sayfaya filtresiz yansıtıldı. Şimdi tarayıcıda JavaScript çalıştırmayı deneyin: <script>alert(1)</script>";
        isError = true;
      } else if (hasAlert && !hasCookie) {
        feedbackMsg = "⚠️ JavaScript tetiklendi! alert() çalıştı. Şimdi admin oturum çerezlerini çalmak için alert içine document.cookie yazın.";
        isError = true;
      } else if (step3Done) {
        feedbackMsg = "🔥 Mükemmel XSS Saldırısı! Payload sayfaya yansıtıldı, tarayıcı scripti çalıştırdı ve admin çerezleri ele geçirildi!";
        isSuccess = true;
      }

      const renderSearchResult = () => {
        if (!qVal && !(resp)) return null;
        return (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-400 font-mono">// Arama sonuçları:</div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              Aranan: <span className="font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: qVal || '...' }}></span>
            </div>
            {!step2Done && qVal && (
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 space-y-1">
                <div>📦 Laptop Pro X1 — ₺24.999</div>
                <div>📦 Wireless Mouse Z3 — ₺349</div>
                <div className="text-gray-400 italic">"{qVal}" için 2 sonuç bulundu</div>
              </div>
            )}
            {step2Done && !step3Done && (
              <div className="p-2.5 border border-amber-300 rounded-lg bg-amber-50 text-amber-700 text-xs font-mono">
                ⚠️ JavaScript Alert Tetiklendi!<br/>
                <span className="text-amber-900 font-bold">alert() çalıştı</span> — şimdi document.cookie ile çerez verilerini çalın.
              </div>
            )}
            {step3Done && (
              <div className="p-3 border border-red-300 rounded-lg bg-red-50 text-xs font-mono space-y-2">
                <div className="text-red-600 font-bold">🚨 XSS BAŞARILI — Çerez Verileri Ele Geçirildi!</div>
                <div className="p-2 bg-white border border-red-200 rounded text-red-800">
                  session_id=a8f3k2m9x; admin_token=eyJhbGciOi...; role=administrator
                </div>
                <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-blue-800 font-bold">🎉 Bayrak:</span>
                  <span className="text-blue-600 font-mono font-bold ml-1 select-all">siberkampus{'{reflected_xss_cookie_stolen}'}</span>
                </div>
              </div>
            )}
          </div>
        );
      };

      const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (!step3Done) {
          if (step2Done) {
            setTarget(t => ({ ...t, alertShown: true }));
          }
          runTarget(e);
          return;
        }
        setTarget(t => ({ ...t, isSearching: true }));
        setTimeout(() => {
          setTarget(t => ({ ...t, isSearching: false }));
          runTarget(e);
        }, 1200);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></span>
                    <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">SALDIRGAN SUNUCUSU</span>
                  </div>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">XSS Log</span>
                </div>
                <div className="text-sm font-bold text-red-600">🚨 Admin Oturum Çerezleri Yakalandı!</div>
                <div className="space-y-2 p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed overflow-y-auto" style={{ height: '160px' }}>
                  <div className="text-gray-500">[{new Date().toLocaleTimeString()}] İstek alındı: GET /log</div>
                  <div className="text-yellow-400">[+] Cookie verisi yakalandı:</div>
                  <div className="text-green-400 pl-3">session_id=a8f3k2m9x7p4w1</div>
                  <div className="text-green-400 pl-3">admin_token=eyJhbGciOiJIUzI1NiJ9...</div>
                  <div className="text-green-400 pl-3">role=administrator</div>
                  <div className="text-red-400 mt-2">[!] Admin hesabına erişim sağlandı!</div>
                  <div className="text-yellow-400">[+] Flag: siberkampus{'{reflected_xss_cookie_stolen}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">🎉 Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{reflected_xss_cookie_stolen}'}
                  </div>
                </div>
              </div>
              <div className="pt-2.5 border-t border-gray-100 text-xs text-gray-400 font-mono flex justify-between">
                <span>evil-server.attacker.com</span>
                <span>Port: 8080</span>
              </div>
            </div>
          );
        }

        if (target.isSearching) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">XSS Payload yürütülüyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// Tarayıcı scripti çalıştırıyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🛒</span>
                  <div className="font-sans font-bold text-lg text-gray-800">ShopZone</div>
                </div>
                <p className="text-xs text-gray-400 font-mono">// E-Ticaret Arama Modülü v2.1</p>
              </div>
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5">// Ürün Arama (XSS Test)</label>
                  <div className="flex gap-2">
                    <input
                      value={qVal}
                      onChange={e => setTarget(t => ({ ...t, q: e.target.value }))}
                      placeholder="<script>alert(document.cookie)</script>"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none font-mono text-sm transition-colors"
                    />
                    <button type="submit" className="font-sans text-sm font-bold text-white bg-orange-500 px-4 rounded-xl hover:bg-orange-600 transition-all shadow-sm">
                      Ara
                    </button>
                  </div>
                </div>
              </form>
              {renderSearchResult()}
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono leading-relaxed space-y-0.5">
              <div>Sunucu: Nginx/1.18.0 (Ubuntu)</div>
              <div>IP / Port: 192.168.1.55:443</div>
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
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('http')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'http' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> HTTP & DOM GÖZLEMCİSİ
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm md:text-base text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-4">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// Reflected XSS Görevi Çözüm Adımları:</div>

                    <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step1Done ? "text-[#00ff88]" : "text-[#ffd166]"}>{step1Done ? "✓ Adım 1:" : "○ Adım 1:"}</span>
                          Girdi Yansıtmasını Test Et
                        </span>
                        {step1Done ? (
                          <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : (
                          <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#74998a]">
                        Arama kutusuna bir HTML etiketi girin (örn: <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<b>test</b>"}</code>). Eğer metin kalın görünüyorsa, girdi filtrelenmeden sayfaya yansıtılıyor demektir.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          JavaScript Çalıştır
                        </span>
                        {step2Done ? (
                          <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#74998a]">
                        Sayfada JS çalıştırmak için <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<script>alert(1)</script>"}</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<img src=x onerror=alert(1)>"}</code> deneyin.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${step3Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step2Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step3Done ? "text-[#00ff88]" : step2Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step3Done ? "✓ Adım 3:" : "○ Adım 3:"}</span>
                          Çerez (Cookie) Çalma
                        </span>
                        {step3Done ? (
                          <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step2Done ? (
                          <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#74998a]">
                        <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">alert(1)</code> yerine <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">alert(document.cookie)</code> yazarak oturum çerezlerini ekrana yazdırın.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// HTTP İstek URL'si:</div>
                      <div className="p-2.5 bg-black/60 rounded-lg font-mono text-xs break-all">
                        <span className="text-[#569cd6]">GET</span>{" "}
                        <span className="text-[#74998a]">https://shopzone.lab/search?q=</span>
                        <span className="text-[#ffd166] font-bold">{qVal || '...'}</span>
                      </div>
                    </div>

                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Sayfa HTML Çıktısı (DOM):</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed">
                        <div className="text-[#74998a]">{"<div class=\"search-results\">"}</div>
                        <div className="pl-4">
                          <span className="text-[#74998a]">{"<p>Aranan: "}</span>
                          <span className={`font-bold ${hasTag ? 'text-[#ff2e88]' : 'text-[#5cffba]'}`}>{qVal || '...'}</span>
                          <span className="text-[#74998a]">{"</p>"}</span>
                        </div>
                        <div className="text-[#74998a]">{"</div>"}</div>
                        {hasTag && (
                          <div className="mt-2 pt-2 border-t border-[#0c2719] text-[#ff2e88] text-xs">
                            ⚠️ Girdi HTML olarak render edildi — XSS zafiyeti doğrulandı!
                          </div>
                        )}
                      </div>
                    </div>

                    {step2Done && (
                      <div className="border border-[#ff2e88]/30 rounded-xl p-4 bg-[#ff2e88]/5">
                        <div className="text-xs text-[#ff2e88] font-mono mb-2">// Tarayıcı Konsol Çıktısı:</div>
                        <div className="p-2.5 bg-black/60 rounded-lg font-mono text-xs text-[#ffd166]">
                          {hasCookie
                            ? '> alert("session_id=a8f3k2m9x7p4w1; admin_token=eyJhbGci...; role=administrator")'
                            : '> alert(1)  // Tarayıcı JS çalıştırdı!'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    run: (target) => {
      const q = (target.q || '').toLowerCase();
      const hasScript = q.includes('<script>') && q.includes('alert(') && q.includes('</script>');
      const hasEvent = (q.includes('onerror=') || q.includes('onload=') || q.includes('onclick=') || q.includes('onmouseover=')) && q.includes('alert(');
      const hasCookie = q.includes('document.cookie');
      if ((hasScript || hasEvent) && hasCookie) {
        return { ok: true, msg: "XSS Başarılı! Admin oturum çerezleri ele geçirildi!" };
      } else if (hasScript || hasEvent) {
        return { ok: 'warn', msg: "JavaScript tetiklendi fakat document.cookie verileri okunmadı. alert() içine document.cookie yazın." };
      } else if (/<[a-z]/i.test(target.q || '')) {
        return { ok: 'info', msg: "HTML etiketi yansıtıldı. Şimdi JavaScript çalıştırmayı deneyin." };
      } else {
        return { ok: false, msg: "Arama sonuçları: 0 ürün bulundu." };
      }
    }
  },
  'web-02': {
    title: 'UNION-Based SQLi',
    desc: 'Sorgu çıktılarının doğrudan tabloda görüntülendiği bu modülde, UNION SELECT enjeksiyonu yaparak users tablosundaki admin şifre hash\'iyle birlikte bayrağı dökün.',
    flag: 'siberkampus{union_based_sqli_data_dumped}',
    hints: [
      "Tabloda 3 sütun listelenmektedir. UNION SELECT sorgunuzda da tam 3 sütun bulunmalıdır.",
      "ID alanına tek tırnak atarak SQL sorgusunu kırın, ardından ORDER BY ile sütun sayısını belirleyin."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const idVal = target.id || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = idVal.toLowerCase();

      const hasQuote = idVal.includes("'");
      const hasOrderBy = lower.includes('order by');
      const hasUnion = lower.includes('union') && lower.includes('select');
      const hasTarget = lower.includes('users') || lower.includes('password') || lower.includes('flag');
      const hasComment = lower.includes('--');

      const step1Done = hasQuote;
      const step2Done = hasQuote && hasOrderBy;
      const step3Done = hasQuote && hasUnion && hasComment;
      const step4Done = hasQuote && hasUnion && hasTarget && hasComment;

      let feedbackMsg = "ID alanına bir sayı girerek sorgu yapısını inceleyin.";
      let isError = false;
      let isSuccess = false;

      if (!idVal) {
        feedbackMsg = "Kullanıcı ID alanına 1 veya 2 yazarak normal sorgu sonuçlarını gözlemleyin. Tabloda kaç sütun döndüğüne dikkat edin.";
      } else if (hasQuote && !hasOrderBy && !hasUnion) {
        feedbackMsg = "⚠️ SQL Syntax Error! Tek tırnak sorguyu bozdu. Şimdi ORDER BY ile sütun sayısını bulun: 1' ORDER BY 3 --";
        isError = true;
      } else if (hasOrderBy && !hasUnion) {
        feedbackMsg = "💡 ORDER BY başarılı! Tablo 3 sütunlu. Şimdi UNION SELECT ile veri sızdırın: 1' UNION SELECT 1,2,3 --";
      } else if (hasUnion && !hasTarget) {
        feedbackMsg = "💡 UNION SELECT çalıştı! Şimdi sütunlardan birini users tablosunun password alanıyla değiştirin.";
      } else if (step4Done) {
        feedbackMsg = "🔥 Veritabanı Dump Başarılı! UNION sorgusuyla admin şifre hash'i ve bayrak sızdırıldı!";
        isSuccess = true;
      }

      const renderSQL = () => {
        const baseSql = "SELECT id, username, email FROM products WHERE id = ";
        if (!idVal) return (
          <div className="font-mono text-xs leading-relaxed">
            <span className="text-[#569cd6]">SELECT</span> id, username, email <span className="text-[#569cd6]">FROM</span> products <span className="text-[#569cd6]">WHERE</span> id = <span className="text-[#ce9178]">'...'</span>;
          </div>
        );
        return (
          <div className="font-mono text-xs leading-relaxed break-all">
            <span className="text-[#569cd6]">SELECT</span> id, username, email <span className="text-[#569cd6]">FROM</span> products <span className="text-[#569cd6]">WHERE</span> id = <span className="text-[#ce9178]">'{idVal}'</span>
            {hasComment && <span className="text-[#6a9955]"> {"// şifre kontrolü devre dışı"}</span>}
            {hasUnion && <div className="text-[#ff2e88] mt-1 text-xs">⚠️ UNION enjeksiyonu algılandı — ek satırlar döndürülüyor!</div>}
          </div>
        );
      };

      const renderTable = () => {
        if (step4Done && resp && resp.ok === true) {
          return (
            <div className="overflow-hidden border border-gray-150 rounded-lg bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-150 font-bold">
                  <tr><th className="p-2">ID</th><th className="p-2">User</th><th className="p-2">Pass / Flag</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-mono">
                  <tr><td className="p-2">1</td><td className="p-2">admin</td><td className="p-2">admin@siberkampus.lab</td></tr>
                  <tr className="bg-red-50 text-red-800 font-bold">
                    <td className="p-2">1</td><td className="p-2">admin</td><td className="p-2 select-all">siberkampus{'{union_based_sqli_data_dumped}'}</td>
                  </tr>
                  <tr className="bg-red-50/50 text-red-700">
                    <td className="p-2">2</td><td className="p-2">editor</td><td className="p-2 font-mono text-[10px]">d033e22ae348aeb5660fc2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        if (resp && resp.ok === 'warn') {
          return (
            <div className="p-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-700 text-xs font-mono">
              ⚠️ MySQL Error: {resp.msg}
            </div>
          );
        }
        if (idVal === '1' || idVal === '2') {
          return (
            <div className="overflow-hidden border border-gray-150 rounded-lg bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-150 font-bold">
                  <tr><th className="p-2">ID</th><th className="p-2">User</th><th className="p-2">Email</th></tr>
                </thead>
                <tbody className="text-gray-700 font-mono">
                  {idVal === '1' ? (
                    <tr><td className="p-2">1</td><td className="p-2">admin</td><td className="p-2">admin@siberkampus.lab</td></tr>
                  ) : (
                    <tr><td className="p-2">2</td><td className="p-2">editor</td><td className="p-2">editor@siberkampus.lab</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      };

      const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (step4Done) {
          setTarget(t => ({ ...t, isQuerying: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, isQuerying: false }));
            runTarget(e);
          }, 1200);
        } else {
          runTarget(e);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-gray-800">📊 Veritabanı Dump</span>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">UNION SQLi</span>
                </div>
                {renderTable()}
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">🎉 Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{union_based_sqli_data_dumped}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono flex justify-between">
                <span>MySQL 8.0.28</span><span>Port: 3306</span>
              </div>
            </div>
          );
        }

        if (target.isQuerying) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Veritabanı sorgulanıyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-5">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 grid place-items-center mx-auto mb-2 text-indigo-600">
                  <span className="text-lg">🗂️</span>
                </div>
                <div className="font-sans font-bold text-lg text-gray-800">Kullanıcı Bilgi Portalı</div>
                <p className="text-xs text-gray-400 font-mono mt-1">// ID ile kullanıcı verileri sorgulama</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5">// Kullanıcı ID (SQLi Test)</label>
                  <div className="flex gap-2">
                    <input
                      value={idVal}
                      onChange={e => setTarget(t => ({ ...t, id: e.target.value }))}
                      placeholder="1' UNION SELECT 1,2,password FROM users --"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none font-mono text-sm transition-colors"
                    />
                    <button type="submit" className="font-sans text-sm font-bold text-white bg-indigo-600 px-4 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                      Sorgula
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-4">{renderTable()}</div>
            </div>
            <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono space-y-0.5">
              <div>Sunucu: Apache/2.4.41 · MySQL 8.0</div>
              <div>IP / Port: 192.168.1.42:80</div>
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
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step4Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('sql')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'sql' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> CANLI SQL GÖZLEMCİSİ
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// UNION-Based SQL Injection Çözüm Adımları:</div>

                    {[
                      { done: step1Done, prev: true, num: 1, title: "SQL Sorgusunu Kır", desc: <>ID alanına tek tırnak (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">'</code>) girerek SQL sorgusunun yapısını bozun.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "Sütun Sayısını Bul", desc: <><code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">1' ORDER BY 3 --</code> ile tablonun 3 sütunlu olduğunu doğrulayın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "UNION SELECT Enjeksiyonu", desc: <><code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"1' UNION SELECT 1,2,3 --"}</code> ile UNION sorgusunun çalıştığını doğrulayın.</> },
                      { done: step4Done, prev: step3Done, num: 4, title: "Hassas Veri Sızdırma", desc: <>Sütunlardan birini <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">password FROM users</code> ile değiştirerek admin hash'ini ve bayrağı dökün.</> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !s.prev ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Hedef Veritabanı Tabloları:</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#00ff88] text-xs font-mono">products (id, name, email)</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ff2e88] text-xs font-mono">users (id, username, password)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-[#74998a] font-mono">// Veritabanında Derlenen Canlı SQL:</div>
                      <div className="p-4 bg-black/85 border border-[#103a26] rounded-xl font-mono leading-relaxed shadow-inner">
                        {renderSQL()}
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-3 bg-black/20">
                      <div className="text-xs text-[#74998a] font-mono mb-1">// Feedback:</div>
                      <div className={`text-xs font-mono ${isSuccess ? 'text-[#00ff88]' : isError ? 'text-[#ffd166]' : 'text-[#74998a]'}`}>{feedbackMsg}</div>
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
      const id = (target.id || '').toLowerCase();
      if (id.includes('union') && id.includes('select') && (id.includes('users') || id.includes('password') || id.includes('flag')) && id.includes('--')) {
        return { ok: true, msg: "Veritabanı dump başarılı!" };
      } else if (id.includes('union') && id.includes('select')) {
        return { ok: 'warn', msg: "UNION SELECT çalıştı fakat hedef tablo/sütun belirtilmedi." };
      } else if (id.includes('order by')) {
        return { ok: 'info', msg: "ORDER BY başarılı — sütun sayısı doğrulandı." };
      } else if (id.includes("'") || id.includes('--')) {
        return { ok: 'warn', msg: "SQL syntax error — Sorgu yapısı bozuldu." };
      } else {
        return { ok: false };
      }
    }
  },
  'web-05': {
    title: 'XSS (Stored & DOM)',
    desc: 'Girdi filtresi bulunmayan yorum paneli, zararlı girdileri kalıcı olarak veritabanına kaydediyor. Admin oturumunu ele geçirecek bir script yorumu bırakın (Stored XSS).',
    flag: 'siberkampus{stored_xss_session_hijacked}',
    hints: [
      "Yorum alanına eklenen HTML/JS etiketlerinin sayfada çalışıp çalışmadığını izleyin.",
      "Admin kullanıcısı yorumları onaylamak için paneli periyodik olarak incelemektedir."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const txtVal = target.txt || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = txtVal.toLowerCase();

      const hasHTML = /<[a-z]/i.test(txtVal);
      const hasScript = lower.includes('<script>') && lower.includes('</script>');
      const hasEvent = /(onerror|onload|onclick)\s*=/i.test(txtVal);
      const hasCookie = lower.includes('document.cookie');
      const hasFetch = lower.includes('fetch(') || lower.includes('xmlhttprequest') || lower.includes('.src=');

      const step1Done = hasHTML;
      const step2Done = (hasScript || hasEvent);
      const step3Done = step2Done && (hasCookie || hasFetch);

      const [comments, setComments] = useState([
        { author: 'Can M.', text: 'Harika bir siber güvenlik platformu!' },
        { author: 'Selin O.', text: 'SQLi odaları çok öğreticiydi, ellerinize sağlık.' }
      ]);

      const addComment = (e) => {
        if (e) e.preventDefault();
        if (!txtVal) return;
        setComments(prev => [...prev, { author: target.auth || 'Misafir', text: txtVal }]);
        if (step3Done) {
          setTarget(t => ({ ...t, adminChecking: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, adminChecking: false }));
            runTarget(e);
          }, 2000);
        } else {
          runTarget(e);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-red-700">🚨 XSS OLAY RAPORU</span>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">Stored XSS</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1 overflow-y-auto" style={{ height: '140px' }}>
                  <div className="text-gray-500">[{new Date().toLocaleTimeString()}] Admin yorum panelini açtı</div>
                  <div className="text-yellow-400">[!] Stored XSS payload tetiklendi!</div>
                  <div className="text-red-400">[!] Cookie verisi sızdırıldı:</div>
                  <div className="text-green-400 pl-3">admin_session=x9k2m4p7w1; role=super_admin</div>
                  <div className="text-red-400">[!] Admin oturumu ele geçirildi!</div>
                  <div className="text-yellow-400">[+] Flag: siberkampus{'{stored_xss_session_hijacked}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">🎉 Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{stored_xss_session_hijacked}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Stored XSS → Admin Session Hijack</div>
            </div>
          );
        }

        if (target.adminChecking) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-300 grid place-items-center mb-4 animate-pulse">
                <span className="text-2xl">👤</span>
              </div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Admin yorumları inceliyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// Stored payload tetiklenecek...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-4">
                <div className="font-sans font-bold text-lg text-gray-800">💬 Ziyaretçi Defteri</div>
                <p className="text-xs text-gray-400 font-mono">// Yorum bırakın (HTML filtreleme: YOK)</p>
              </div>
              <div className="space-y-2 mb-3 max-h-[120px] overflow-y-auto">
                {comments.map((c, i) => (
                  <div key={i} className="p-2 rounded-lg border border-gray-100 bg-gray-50 text-xs">
                    <span className="font-bold text-indigo-600">@{c.author}: </span>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: c.text }}></span>
                  </div>
                ))}
              </div>
              <form onSubmit={addComment} className="space-y-2">
                <input value={target.auth || ''} onChange={e => setTarget(t => ({ ...t, auth: e.target.value }))} placeholder="Adınız" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none font-mono text-sm" />
                <textarea value={txtVal} onChange={e => setTarget(t => ({ ...t, txt: e.target.value }))} placeholder="<script>fetch('/log?c='+document.cookie)</script>" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none font-mono text-xs h-14 resize-none" />
                <button type="submit" className="w-full font-sans text-sm font-bold text-white bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition-all">Yorum Gönder</button>
              </form>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">PHP/7.4 · MySQL 5.7 · Girdi Filtresi: Devre Dışı</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('dom')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'dom' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> DOM GÖZLEMCİSİ
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// Stored XSS Çözüm Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "HTML Enjeksiyon Testi", desc: <>Yorum alanına <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<b>test</b>"}</code> yazıp filtre var mı kontrol edin.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "JavaScript Enjeksiyonu", desc: <><code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<script>alert(1)</script>"}</code> veya onerror event handler ile JS çalıştırın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "Admin Cookie Sızdırma", desc: <>Script içinde <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">document.cookie</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"fetch('/log?c='+document.cookie)"}</code> ile çerezi sızdırın.</>}
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Yorumun DOM'daki HTML Çıktısı:</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed break-all">
                        <span className="text-[#74998a]">{"<div class=\"comment\">"}</span><br/>
                        <span className="pl-4 text-[#74998a]">{"<span class=\"author\">@"}{target.auth || 'Misafir'}{"</span>: "}</span>
                        <span className={`font-bold ${hasHTML ? 'text-[#ff2e88]' : 'text-[#5cffba]'}`}>{txtVal || '...'}</span><br/>
                        <span className="text-[#74998a]">{"</div>"}</span>
                        {hasHTML && <div className="mt-2 pt-2 border-t border-[#0c2719] text-[#ff2e88] text-xs">⚠️ HTML render edildi — Stored XSS zafiyeti!</div>}
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Saldırı Akışı:</div>
                      <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#5cffba]">1. Saldırgan yorum yazar</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ffd166]">2. DB'ye kaydedilir</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ff2e88]">3. Admin sayfayı açar</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ff2e88]">4. Script otomatik çalışır!</span>
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
      const txt = (target.txt || '').toLowerCase();
      const hasScript = (txt.includes('<script>') && txt.includes('</script>'));
      const hasEvent = (txt.includes('onerror=') || txt.includes('onload=')) && txt.includes('alert');
      const hasCookie = txt.includes('document.cookie') || txt.includes('fetch(');
      if ((hasScript || hasEvent) && hasCookie) {
        return { ok: true };
      } else if (hasScript || hasEvent) {
        return { ok: 'warn', msg: "JS çalıştı fakat çerez sızdırılmadı. document.cookie veya fetch() kullanın." };
      } else if (/<[a-z]/i.test(target.txt || '')) {
        return { ok: 'info', msg: "HTML yansıtıldı. Şimdi script enjekte edin." };
      } else {
        return { ok: false };
      }
    }
  },
  'web-06': {
    title: 'CSRF Saldırıları',
    desc: 'Şifre değiştirme fonksiyonu hiçbir CSRF Token veya kimlik denetimi içermiyor. Kurban kullanıcının şifresini değiştiren sahte bir HTML exploit tasarlayıp gönderin.',
    flag: 'siberkampus{csrf_admin_password_changed}',
    hints: [
      "Kurban tarayıcısının şifre güncelleme endpoint'ine (/change-password) istek atmasını sağlayın.",
      "Kullanıcının haberi olmadan çalışan iframe, img veya otomatik form yapısı kurgulayın."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const expVal = target.exploit || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = expVal.toLowerCase();

      const hasEndpoint = lower.includes('change-password');
      const hasParam = lower.includes('new=') || lower.includes('password=');
      const hasDelivery = lower.includes('iframe') || lower.includes('img') || lower.includes('form') || lower.includes('fetch') || lower.includes('xmlhttprequest');

      const step1Done = hasEndpoint;
      const step2Done = hasEndpoint && hasDelivery;
      const step3Done = hasEndpoint && hasParam && hasDelivery;

      const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (step3Done) {
          setTarget(t => ({ ...t, sending: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, sending: false }));
            runTarget(e);
          }, 2000);
        } else {
          runTarget(e);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-red-700">🚨 CSRF BAŞARILI</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1" style={{ height: '130px' }}>
                  <div className="text-green-400">[+] Exploit kurbana iletildi</div>
                  <div className="text-yellow-400">[+] Kurban tarayıcısında form otomatik tetiklendi</div>
                  <div className="text-green-400">[+] POST /change-password → 200 OK</div>
                  <div className="text-red-400">[!] Admin şifresi değiştirildi: admin123</div>
                  <div className="text-yellow-400">[+] Flag: siberkampus{'{csrf_admin_password_changed}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">🎉 Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{csrf_admin_password_changed}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">CSRF Token: YOK · SameSite: None</div>
            </div>
          );
        }

        if (target.sending) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Exploit kurbana gönderiliyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// Admin tarayıcısında form tetikleniyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-4">
                <div className="font-sans font-bold text-lg text-gray-800">⚔️ Exploit Editörü</div>
                <p className="text-xs text-gray-400 font-mono">// Admin tarayıcısına gönderilecek HTML exploit</p>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 mb-3">
                <strong>Hedef:</strong> /change-password endpoint'i · CSRF Token: Yok · Method: POST/GET
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea value={expVal} onChange={e => setTarget(t => ({ ...t, exploit: e.target.value }))} placeholder={"<form action='/change-password' method='POST'>\n  <input name='new' value='hacked123'/>\n</form>\n<script>document.forms[0].submit()</script>"} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-red-500 focus:outline-none font-mono text-xs h-32 resize-none" />
                <button type="submit" className={`w-full font-sans text-sm font-bold py-2.5 rounded-xl transition-all ${step3Done ? 'text-white bg-red-600 hover:bg-red-700 shadow-sm' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'}`}>
                  {step3Done ? '🚀 Exploit Gönder' : 'Exploit Hazırla'}
                </button>
              </form>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Kurban: admin@siberkampus.lab</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('http')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'http' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> HTTP AKIŞ GÖZLEMCİSİ
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// CSRF Saldırı Çözüm Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "Hedef Endpoint'i Belirle", desc: <>Exploit'te şifre değiştirme endpoint'ini (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">/change-password</code>) hedefleyin.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "Tetikleme Mekanizması Ekle", desc: <>Kurbana farkettirmeden istek göndermek için <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<form>"}</code>, <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<iframe>"}</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">fetch()</code> kullanın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "Yeni Şifre Parametresi", desc: <>İsteğe yeni şifreyi içeren parametreyi ekleyin: <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">new=hacked123</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">password=admin123</code></> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// CSRF Saldırı Akışı:</div>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-center gap-2"><span className="text-[#5cffba]">1.</span> <span className="text-[#cdeede]">Saldırgan → Exploit sayfası hazırlar</span></div>
                        <div className="flex items-center gap-2"><span className="text-[#ffd166]">2.</span> <span className="text-[#cdeede]">Kurban → Exploit linkini açar</span></div>
                        <div className="flex items-center gap-2"><span className="text-[#ff2e88]">3.</span> <span className="text-[#cdeede]">Tarayıcı → /change-password otomatik istek</span></div>
                        <div className="flex items-center gap-2"><span className="text-[#ff2e88]">4.</span> <span className="text-[#cdeede]">Sunucu → Şifre değişir (CSRF token YOK!)</span></div>
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Exploit Kodunuzun Analizi:</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed break-all">
                        {expVal ? (
                          <span className={hasEndpoint && hasParam && hasDelivery ? 'text-[#00ff88]' : 'text-[#ffd166]'}>{expVal}</span>
                        ) : (
                          <span className="text-[#5c8a74]">// Henüz exploit kodu girilmedi...</span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded ${hasEndpoint ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#0c2719] text-[#5c8a74]'}`}>Endpoint {hasEndpoint ? '✓' : '✗'}</span>
                        <span className={`px-2 py-0.5 rounded ${hasDelivery ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#0c2719] text-[#5c8a74]'}`}>Tetikleyici {hasDelivery ? '✓' : '✗'}</span>
                        <span className={`px-2 py-0.5 rounded ${hasParam ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#0c2719] text-[#5c8a74]'}`}>Şifre Param {hasParam ? '✓' : '✗'}</span>
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
      const exp = (target.exploit || '').toLowerCase();
      if (exp.includes('change-password') && (exp.includes('new=') || exp.includes('password=')) && (exp.includes('iframe') || exp.includes('img') || exp.includes('form') || exp.includes('fetch') || exp.includes('xmlhttprequest'))) {
        return { ok: true, msg: "Admin şifresi değiştirildi!" };
      } else if (exp.includes('change-password')) {
        return { ok: 'warn', msg: "Endpoint doğru fakat tetikleme mekanizması veya şifre parametresi eksik." };
      } else {
        return { ok: false, msg: "Exploit gönderildi fakat şifre değiştirme isteği tetiklenemedi." };
      }
    }
  },
  'web-03': {
    title: 'Blind SQL Injection',
    desc: 'Sorgular doğrudan veri döndürmüyor, sadece kullanıcının varlığını True/False olarak belirtiyor. SQL koşulları oluşturarak admin bayrağının ilk karakterini test edin.',
    flag: 'siberkampus{blind_sqli_db_hash_extracted}',
    hints: [
      "Sorgularınızın sonucunun doğruluğuna göre dönen True/False durum mesajlarını analiz edin.",
      "ASCII kodları ve SUBSTRING metodunu birleştirerek harf kontrolü yapın."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const qVal = target.q || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = qVal.toLowerCase();

      const hasQuote = qVal.includes("'");
      const hasBoolLogic = hasQuote && (lower.includes(' and ') || lower.includes(' or '));
      const hasSubstring = lower.includes('substring') || lower.includes('substr');
      const hasFlag = lower.includes('flag') || lower.includes('secret');
      const hasFullPayload = hasSubstring && hasFlag && lower.includes('=');

      const step1Done = hasQuote;
      const step2Done = hasBoolLogic;
      const step3Done = hasSubstring && hasFlag;
      const step4Done = hasFullPayload && (lower.includes("'s'") || lower.includes("= 's") || lower.includes("='s"));

      const [queryLog, setQueryLog] = useState([]);

      const handleQuery = (e) => {
        if (e) e.preventDefault();
        let result = 'FALSE';
        if (hasFullPayload && lower.includes("'s'")) result = 'TRUE';
        else if (hasBoolLogic && (lower.includes('1=1') || lower.includes("'a'='a"))) result = 'TRUE';
        setQueryLog(prev => [...prev.slice(-6), { q: qVal, r: result, t: new Date().toLocaleTimeString() }]);
        runTarget(e);
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true && step4Done) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-green-700">Blind SQLi Başarılı</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-mono font-bold">Extracted</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1 overflow-y-auto" style={{ height: '140px' }}>
                  <div className="text-gray-500">// Blind SQLi ile karakter çıkarma tamamlandı</div>
                  <div className="text-green-400">[+] Pozisyon 1: 's' → TRUE</div>
                  <div className="text-green-400">[+] Pozisyon 2: 'i' → TRUE</div>
                  <div className="text-green-400">[+] Pozisyon 3: 'b' → TRUE</div>
                  <div className="text-yellow-400">[...] 30+ karakter çıkartıldı</div>
                  <div className="text-green-400">[+] Tam bayrak: siberkampus{'{blind_sqli_db_hash_extracted}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{blind_sqli_db_hash_extracted}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Blind Boolean-based SQLi · MySQL 5.7</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-3">
                <div className="font-sans font-bold text-lg text-gray-800">🔍 Kullanıcı Sorgulama</div>
                <p className="text-xs text-gray-400 font-mono">// API: /api/user?id=</p>
              </div>
              <form onSubmit={handleQuery} className="space-y-2 mb-3">
                <input value={qVal} onChange={e => setTarget(t => ({ ...t, q: e.target.value }))} placeholder="1' AND SUBSTRING(...)='s' -- -" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono text-xs" />
                <button type="submit" className="w-full font-sans text-sm font-bold text-white bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-all">Sorgula</button>
              </form>
              {resp && (
                <div className={`p-3 rounded-lg border text-center text-sm font-bold font-mono ${
                  resp.ok === true ? 'border-green-200 bg-green-50 text-green-700' : resp.ok === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'
                }`}>
                  {resp.ok === true || (resp.msg && resp.msg.includes('TRUE')) ? '✓ TRUE — Kullanıcı mevcut' : '✗ FALSE — Kullanıcı mevcut değil'}
                </div>
              )}
              <div className="mt-3 space-y-1 max-h-[90px] overflow-y-auto">
                {queryLog.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-mono text-gray-500 p-1 bg-gray-50 rounded">
                    <span className="truncate max-w-[60%]">{l.q}</span>
                    <span className={l.r === 'TRUE' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{l.r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">MySQL 5.7 · Boolean-based · Verbose: OFF</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step4Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('sql')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'sql' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> SQL GÖZLEMCİSİ
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// Blind SQLi Çözüm Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "SQL Enjeksiyon Noktası", desc: <>Girdinin SQL'e dahil edildiğini doğrulamak için tek tırnak <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">'</code> ekleyin ve yanıt farkını gözlemleyin.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "Boolean Mantığı Testi", desc: <><code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">1' AND 1=1 -- -</code> (TRUE) ve <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">1' AND 1=2 -- -</code> (FALSE) karşılaştırın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "SUBSTRING ile Veri Çıkarma", desc: <><code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">SUBSTRING((SELECT flag FROM flags),1,1)</code> ile hedef tablo ve sütunu tespit edin.</> },
                      { done: step4Done, prev: step3Done, num: 4, title: "Karakter Eşleştirme", desc: <>İlk karakteri <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">='s'</code> ile test edin. TRUE dönmesi bayrağın çıkartıldığını kanıtlar.</> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Sunucudaki SQL Sorgusu:</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed break-all">
                        <span className="text-[#74998a]">SELECT * FROM users WHERE id = '</span>
                        <span className={`font-bold ${hasQuote ? 'text-[#ff2e88]' : 'text-[#5cffba]'}`}>{qVal || '...'}</span>
                        <span className="text-[#74998a]">'</span>
                        {hasBoolLogic && <div className="mt-2 pt-2 border-t border-[#0c2719] text-[#ffd166] text-xs">⚠️ SQL koşulu enjekte edildi!</div>}
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Veritabanı Şeması:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 bg-black/40 rounded-lg">
                          <div className="text-[#00ff88] font-bold mb-1">users</div>
                          <div className="text-[#74998a]">id, username, email</div>
                        </div>
                        <div className="p-2 bg-black/40 rounded-lg border border-[#ffd166]/30">
                          <div className="text-[#ffd166] font-bold mb-1">flags 🎯</div>
                          <div className="text-[#74998a]">id, flag, room_id</div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Blind SQLi Tekniği:</div>
                      <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#5cffba]">Sorgu gönder</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ffd166]">TRUE / FALSE</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#ff2e88]">Karakter çıkar</span>
                        <span className="text-[#74998a]">→</span>
                        <span className="px-2 py-1 rounded bg-[#103a26]/40 text-[#00ff88]">Tekrarla!</span>
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
      const q = (target.q || '').toLowerCase();
      const hasSubstring = q.includes('substring') || q.includes('substr');
      const hasFlag = q.includes('flag') || q.includes('secret');
      if (hasSubstring && hasFlag && (q.includes("'s'") || q.includes("= 's") || q.includes("='s"))) {
        return { ok: true, msg: "TRUE" };
      } else if (hasSubstring && hasFlag) {
        return { ok: 'warn', msg: "SUBSTRING doğru tabloya yöneldi ama karakter eşleşmedi. İlk karakter 's' olmalı." };
      } else if (q.includes("'") && (q.includes(' and ') || q.includes(' or '))) {
        if (q.includes('1=1') || q.includes("'a'='a") || q.includes('true')) {
          return { ok: 'info', msg: "TRUE — Boolean mantığı çalışıyor. Şimdi SUBSTRING ile veri çıkarın." };
        }
        return { ok: false, msg: "FALSE — Koşul yanlış." };
      } else {
        return { ok: false, msg: "FALSE — Kullanıcı mevcut değil." };
      }
    }
  },
  'web-07': {
    title: 'File Upload Bypass',
    desc: 'Profil resmi yükleme alanı dosya uzantısını client-side kontrol ediyor. Çift uzantı, MIME manipülasyonu veya phtml bypass yöntemleriyle sunucuya bir PHP shell yükleyin.',
    flag: 'siberkampus{file_upload_bypass_webshell}',
    hints: [
      "Client-side kontrolleri aşmak için dosya ismini shell.php.png veya shell.phtml yapmayı deneyin.",
      "Content-Type değerini image/png olarak değiştirmeyi deneyin."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const fnVal = target.fname || '';
      const ctVal = target.ctype || 'image/png';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = fnVal.toLowerCase();

      const hasPhpExt = lower.includes('.php') || lower.includes('.phtml') || lower.includes('.php5');
      const hasImgExt = lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg');
      const isDoubleExt = hasPhpExt && hasImgExt;
      const isAltExt = lower.endsWith('.phtml') || lower.endsWith('.php5');
      const hasMIME = ctVal.includes('image/');

      const step1Done = fnVal.length > 0;
      const step2Done = hasPhpExt;
      const step3Done = (isDoubleExt && hasMIME) || isAltExt;

      const handleUpload = (e) => {
        if (e) e.preventDefault();
        if (step3Done) {
          setTarget(t => ({ ...t, uploading: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, uploading: false }));
            runTarget(e, fnVal);
          }, 1800);
        } else {
          runTarget(e, fnVal);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-red-700">Web Shell Aktif!</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1" style={{ height: '140px' }}>
                  <div className="text-green-400">[+] Dosya yüklendi: /uploads/{fnVal}</div>
                  <div className="text-green-400">[+] PHP motoru dosyayı işledi</div>
                  <div className="text-yellow-400">[+] Web shell aktif: /uploads/{fnVal}?cmd=id</div>
                  <div className="text-green-400">uid=33(www-data) gid=33(www-data)</div>
                  <div className="text-red-400">[!] Sunucu ele geçirildi!</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{file_upload_bypass_webshell}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Apache/2.4 · PHP/7.4 · mod_php</div>
            </div>
          );
        }

        if (target.uploading) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Dosya yükleniyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// WAF bypass deneniyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-3">
                <div className="font-sans font-bold text-lg text-gray-800">📁 Profil Resmi Yükle</div>
                <p className="text-xs text-gray-400 font-mono">// İzin verilen: .png, .jpg, .jpeg</p>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 mb-3">
                <strong>Filtre:</strong> Client-side JS uzantı kontrolü · Server-side: MIME check
              </div>
              <form onSubmit={handleUpload} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">Dosya Adı:</label>
                  <input value={fnVal} onChange={e => setTarget(t => ({ ...t, fname: e.target.value }))} placeholder="shell.php.png" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono text-xs" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">Content-Type:</label>
                  <select value={ctVal} onChange={e => setTarget(t => ({ ...t, ctype: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none font-mono text-xs">
                    <option value="image/png">image/png</option>
                    <option value="image/jpeg">image/jpeg</option>
                    <option value="application/x-php">application/x-php</option>
                    <option value="text/plain">text/plain</option>
                  </select>
                </div>
                <button type="submit" className="w-full font-sans text-sm font-bold text-white bg-blue-600 py-2.5 rounded-xl hover:bg-blue-700 transition-all">Yükle</button>
              </form>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Apache/2.4 · upload_max: 2MB</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('http')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'http' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> HTTP GÖZLEMCİSİ
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// File Upload Bypass Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "Dosya Adı Belirleme", desc: <>Yüklenecek dosyanın adını girin. PHP kodu çalıştırmak için <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">.php</code> uzantısı gerekir.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "PHP Uzantısı Ekleme", desc: <>Dosya adına <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">.php</code>, <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">.phtml</code> veya <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">.php5</code> ekleyin.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "Filtreyi Aşma", desc: <>Çift uzantı (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">shell.php.png</code>) ile WAF'ı atlatın veya alternatif uzantı (<code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">.phtml</code>) kullanın.</> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// HTTP Upload İsteği:</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed break-all space-y-1">
                        <div className="text-[#5cffba]">POST /upload HTTP/1.1</div>
                        <div className="text-[#74998a]">Content-Type: multipart/form-data</div>
                        <div className="text-[#74998a]">---</div>
                        <div>filename: <span className={`font-bold ${hasPhpExt ? 'text-[#ff2e88]' : 'text-[#5cffba]'}`}>{fnVal || '...'}</span></div>
                        <div>content-type: <span className={`font-bold ${hasMIME ? 'text-[#5cffba]' : 'text-[#ff2e88]'}`}>{ctVal}</span></div>
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Sunucu Filtre Analizi:</div>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between p-2 bg-black/40 rounded">
                          <span className="text-[#74998a]">JS uzantı kontrolü (.png/.jpg)</span>
                          <span className={isDoubleExt || isAltExt ? 'text-[#00ff88]' : hasPhpExt ? 'text-[#ff2e88]' : 'text-[#74998a]'}>{isDoubleExt ? 'BYPASS ✓' : isAltExt ? 'BYPASS ✓' : hasPhpExt ? 'ENGELLENDİ' : 'BEKLENİYOR'}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-black/40 rounded">
                          <span className="text-[#74998a]">MIME type kontrolü</span>
                          <span className={hasMIME ? 'text-[#00ff88]' : 'text-[#ff2e88]'}>{hasMIME ? 'GEÇER ✓' : 'REDDEDİLİR'}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-black/40 rounded">
                          <span className="text-[#74998a]">Apache PHP modülü</span>
                          <span className={hasPhpExt ? 'text-[#00ff88]' : 'text-[#74998a]'}>{hasPhpExt ? 'ÇALIŞTIRIR ✓' : 'BEKLENİYOR'}</span>
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
    run: (target, customArg) => {
      const fname = (customArg || '').toLowerCase();
      if (!fname) return { ok: false, msg: "Dosya adı girilmedi!" };
      if (fname.endsWith('.phtml') || fname.endsWith('.php5')) {
        return { ok: true };
      }
      if ((fname.endsWith('.png') || fname.endsWith('.jpg') || fname.endsWith('.jpeg')) && (fname.includes('.php.') || fname.includes('.phtml.'))) {
        return { ok: true };
      }
      if (fname.endsWith('.php')) {
        return { ok: 'warn', msg: "WAF .php uzantısını engelledi! Çift uzantı (.php.png) veya alternatif (.phtml) deneyin." };
      }
      return { ok: false, msg: "Dosya yüklendi ama PHP kodu çalıştırılamadı." };
    }
  },
  'web-08': {
    title: 'SSRF & XXE',
    desc: 'Sunucu, gönderilen XML girdilerini analiz ediyor ve dış entity\'leri işliyor. Sunucunun dahili dosyalarını (`file:///etc/passwd`) okumak için zararlı bir XML Entity (XXE) payload\'u gönderin.',
    flag: 'siberkampus{ssrf_internal_metadata_exposed}',
    hints: [
      "XML dökümanlarının en üstünde SYSTEM entity tanımlayarak sunucu yerel sistem dosyalarını okumayı hedefleyin.",
      "Payload XML formatında bir entity ve bunu çağıran bir etiket içermelidir."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const xmlVal = target.xml || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));
      const lower = xmlVal.toLowerCase();

      const hasDoctype = lower.includes('<!doctype') || lower.includes('<!DOCTYPE');
      const hasEntity = lower.includes('!entity');
      const hasSystem = lower.includes('system');
      const hasFile = lower.includes('file:///') || lower.includes('passwd') || lower.includes('/etc/');
      const hasRef = xmlVal.includes('&') && xmlVal.includes(';');

      const step1Done = hasDoctype || hasEntity;
      const step2Done = hasEntity && hasSystem;
      const step3Done = hasEntity && hasSystem && hasFile;
      const step4Done = step3Done && hasRef;

      const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (step4Done) {
          setTarget(t => ({ ...t, parsing: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, parsing: false }));
            runTarget(e);
          }, 2000);
        } else {
          runTarget(e);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-red-700">XXE Başarılı!</span>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">LFI</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1 overflow-y-auto" style={{ height: '150px' }}>
                  <div className="text-gray-500">// /etc/passwd içeriği:</div>
                  <div className="text-green-400">root:x:0:0:root:/root:/bin/bash</div>
                  <div className="text-green-400">daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin</div>
                  <div className="text-green-400">www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin</div>
                  <div className="text-yellow-400">flag_user:x:1001:1001::/home/flag:/bin/bash</div>
                  <div className="text-red-400"># FLAG: siberkampus{'{ssrf_internal_metadata_exposed}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{ssrf_internal_metadata_exposed}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">libxml2 · External Entities: ENABLED</div>
            </div>
          );
        }

        if (target.parsing) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">XML parse ediliyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// External entity çözümleniyor...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-3">
                <div className="font-sans font-bold text-lg text-gray-800">📄 XML Veri API'si</div>
                <p className="text-xs text-gray-400 font-mono">// POST /api/parse-xml</p>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 mb-3">
                <strong>API:</strong> XML verisini parse eder ve sonucu döndürür. External entities aktif!
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea value={xmlVal} onChange={e => setTarget(t => ({ ...t, xml: e.target.value }))} placeholder={"<?xml version=\"1.0\"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<data>&xxe;</data>"} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:outline-none font-mono text-xs h-36 resize-none" />
                <button type="submit" className="w-full font-sans text-sm font-bold text-white bg-orange-600 py-2.5 rounded-xl hover:bg-orange-700 transition-all">XML Gönder</button>
              </form>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">Java/SAX Parser · DTD: enabled</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step4Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('xml')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'xml' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> XML GÖZLEMCİSİ
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// XXE Saldırı Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "DOCTYPE Tanımı", desc: <>XML'in başına <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<!DOCTYPE foo [...]>"}</code> ekleyerek DTD tanımı oluşturun.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "SYSTEM Entity Tanımla", desc: <>DTD içinde <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"<!ENTITY xxe SYSTEM \"...\">"}</code> ile harici kaynak tanımlayın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "Dosya Yolu Belirle", desc: <>SYSTEM değerini <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">file:///etc/passwd</code> yaparak sunucu dosyasını hedefleyin.</> },
                      { done: step4Done, prev: step3Done, num: 4, title: "Entity Referansı Çağır", desc: <>XML gövdesinde <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{"&xxe;"}</code> referansıyla entity'yi tetikleyin.</> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// XML Parse Süreci:</div>
                      <div className="p-3 bg-black/60 rounded-lg font-mono text-xs leading-relaxed break-all">
                        <span className="text-[#74998a]">Input XML → </span>
                        <span className={hasDoctype || hasEntity ? 'text-[#ffd166]' : 'text-[#5c8a74]'}>DTD Parse{hasDoctype || hasEntity ? ' ✓' : ''}</span>
                        <span className="text-[#74998a]"> → </span>
                        <span className={hasSystem ? 'text-[#ffd166]' : 'text-[#5c8a74]'}>Entity Resolve{hasSystem ? ' ✓' : ''}</span>
                        <span className="text-[#74998a]"> → </span>
                        <span className={hasFile ? 'text-[#ff2e88]' : 'text-[#5c8a74]'}>File Read{hasFile ? ' ⚠️' : ''}</span>
                        <span className="text-[#74998a]"> → </span>
                        <span className={hasRef ? 'text-[#00ff88]' : 'text-[#5c8a74]'}>Output{hasRef ? ' ✓' : ''}</span>
                      </div>
                    </div>
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// Hedef Sunucu Dosya Sistemi:</div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="text-[#5cffba]">/etc/passwd <span className="text-[#74998a]">→ Kullanıcı listesi</span></div>
                        <div className="text-[#5cffba]">/etc/shadow <span className="text-[#74998a]">→ Şifre hash'leri (root gerekir)</span></div>
                        <div className="text-[#ffd166]">/var/www/html/config.php <span className="text-[#74998a]">→ DB bilgileri</span></div>
                        <div className="text-[#ff2e88]">/home/flag/flag.txt <span className="text-[#74998a]">→ CTF Bayrağı</span></div>
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
      const xml = (target.xml || '').toLowerCase();
      const hasEntity = xml.includes('!entity');
      const hasSystem = xml.includes('system');
      const hasFile = xml.includes('passwd') || xml.includes('etc') || xml.includes('file:///');
      const hasRef = (target.xml || '').includes('&') && (target.xml || '').includes(';');
      if (hasEntity && hasSystem && hasFile && hasRef) {
        return { ok: true };
      } else if (hasEntity && hasSystem && hasFile) {
        return { ok: 'warn', msg: "Entity tanımlı fakat referans (&xxe;) çağrılmadı! XML gövdesine &xxe; ekleyin." };
      } else if (hasEntity && hasSystem) {
        return { ok: 'info', msg: "Entity tanımlı fakat dosya yolu eksik. SYSTEM değerini file:///etc/passwd yapın." };
      } else {
        return { ok: false, msg: "XML parse edildi fakat External Entity tanımı bulunamadı." };
      }
    }
  },
  'web-09': {
    title: 'JWT Token Exploitation',
    desc: 'JWT imza doğrulaması kütüphanesinde kritik bir zafiyet var. Header içindeki algoritmik korumayı `None` yaparak imza kontrolünü atlatın ve admin yetkisi kazanın.',
    flag: 'siberkampus{jwt_none_alg_bypass}',
    hints: [
      "JWT token'larının üç bölümden (Header, Payload, Signature) oluştuğunu ve noktalarla ayrıldığını unutmayın.",
      "Token header'ını base64'ten çözüp 'alg': 'none' yapın ve geri kodlayın."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
      const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSGFja2VyIiwicm9sZSI6InVzZXIifQ.signature_here";
      const tokenVal = target.token || '';
      const devTab = target.devTab || 'guide';
      const setDevTab = (tab) => setTarget(t => ({ ...t, devTab: tab }));

      const safeAtob = (str) => { try { let b = str.replace(/-/g,'+').replace(/_/g,'/'); while(b.length%4) b+='='; return atob(b); } catch(e){ return ''; } };

      let headerObj = null, payloadObj = null, parseError = false;
      const parts = tokenVal.split('.');
      if (parts.length >= 2) {
        try { headerObj = JSON.parse(safeAtob(parts[0])); } catch(e){ parseError = true; }
        try { payloadObj = JSON.parse(safeAtob(parts[1])); } catch(e){ parseError = true; }
      }

      const hasNoneAlg = headerObj && (headerObj.alg === 'none' || headerObj.alg === 'NONE' || headerObj.alg === 'None');
      const hasAdminRole = payloadObj && (payloadObj.role === 'admin' || payloadObj.role === 'ADMIN');
      const noSignature = parts.length >= 3 && parts[2] === '' || parts.length === 2;

      const step1Done = parts.length >= 2 && headerObj !== null;
      const step2Done = hasNoneAlg;
      const step3Done = hasNoneAlg && hasAdminRole;

      const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (step3Done) {
          setTarget(t => ({ ...t, verifying: true }));
          setTimeout(() => {
            setTarget(t => ({ ...t, verifying: false }));
            runTarget(e);
          }, 1500);
        } else {
          runTarget(e);
        }
      };

      const renderLeftPanel = () => {
        if (resp && resp.ok === true) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm font-sans text-sm text-gray-800" style={{ height: '420px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-disp font-bold text-sm uppercase tracking-wider text-red-700">Admin Yetkisi Kazanıldı!</span>
                </div>
                <div className="p-3 bg-[#1e1e1e] border border-gray-300 rounded-lg text-xs text-gray-300 font-mono leading-relaxed space-y-1" style={{ height: '130px' }}>
                  <div className="text-green-400">[+] JWT Token kabul edildi</div>
                  <div className="text-yellow-400">[!] Algorithm: none → İmza kontrolü atlandı!</div>
                  <div className="text-green-400">[+] Role: admin → Yetki yükseltme başarılı</div>
                  <div className="text-red-400">[!] Admin paneline erişim sağlandı</div>
                  <div className="text-green-400">[+] Flag: siberkampus{'{jwt_none_alg_bypass}'}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">Tebrikler! Bayrağınız:</p>
                  <div className="inline-block text-base font-bold text-blue-600 font-mono px-3 py-2 bg-white rounded border border-blue-300 shadow-sm select-all mt-1">
                    siberkampus{'{jwt_none_alg_bypass}'}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">JWT None Algorithm Bypass · CVE-2015-9235</div>
            </div>
          );
        }

        if (target.verifying) {
          return (
            <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-sans font-bold text-sm text-gray-800 animate-pulse">Token doğrulanıyor...</div>
              <div className="font-mono text-xs text-gray-400 mt-2">// İmza kontrolü: alg=none...</div>
            </div>
          );
        }

        return (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm" style={{ height: '420px' }}>
            <div>
              <div className="text-center mb-3">
                <div className="font-sans font-bold text-lg text-gray-800">🔐 Admin Paneli</div>
                <p className="text-xs text-gray-400 font-mono">// Kimlik doğrulama: JWT Bearer Token</p>
              </div>
              <div className="mb-3">
                <label className="text-xs text-gray-500 font-mono block mb-1">Mevcut Token (user yetkili):</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-mono text-gray-500 break-all select-all">{defaultToken}</div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">Modifiye Token:</label>
                  <textarea value={tokenVal} onChange={e => setTarget(t => ({ ...t, token: e.target.value }))} placeholder="Düzenlenmiş JWT token'ınız..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none font-mono text-[10px] h-16 resize-none" />
                </div>
                <button type="submit" className="w-full font-sans text-sm font-bold text-white bg-purple-600 py-2.5 rounded-xl hover:bg-purple-700 transition-all">Token Gönder</button>
              </form>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 font-mono">jsonwebtoken@8.5.1 · HS256</div>
          </div>
        );
      };

      return (
        <div className="p-6 bg-[#f0f2f5] min-h-[380px] rounded-b-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            {renderLeftPanel()}
            <div className="border border-[#103a26] bg-[#04100a]/90 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <div className="flex bg-black/45 border-b border-[#0c2719] text-sm">
                <button type="button" onClick={() => setDevTab('guide')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'guide' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>📖</span> ADIM ADIM REHBER {!step3Done && <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166] animate-pulse"></span>}
                </button>
                <button type="button" onClick={() => setDevTab('jwt')}
                  className={`flex-1 py-3.5 text-center font-disp font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${devTab === 'jwt' ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5' : 'border-transparent text-[#74998a] hover:text-[#cdeede]'}`}>
                  <span>🔍</span> JWT DECODER
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start gap-4 text-sm text-[#cdeede]">
                {devTab === 'guide' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#cdeede] font-bold mb-2">// JWT Bypass Adımları:</div>
                    {[
                      { done: step1Done, prev: true, num: 1, title: "Token Yapısını Anla", desc: <>JWT = <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">Header.Payload.Signature</code> (Base64URL encoded). Mevcut token'ı decode edin.</> },
                      { done: step2Done, prev: step1Done, num: 2, title: "Algorithm'i None Yap", desc: <>Header'daki <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{'"alg":"HS256"'}</code> değerini <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{'"alg":"none"'}</code> yapın.</> },
                      { done: step3Done, prev: step2Done, num: 3, title: "Rol Yükseltme", desc: <>Payload'daki <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{'"role":"user"'}</code> değerini <code className="text-[#ffd166] font-bold bg-[#ffd166]/10 px-1 rounded font-mono">{'"role":"admin"'}</code> yapıp imzayı silin.</> }
                    ].map((s) => (
                      <div key={s.num} className={`p-3.5 rounded-xl border transition-all ${s.done ? 'border-[#00ff88]/30 bg-[#00ff88]/5' : !s.prev ? 'border-[#0c2719] opacity-40' : 'border-[#103a26] bg-black/25'}`}>
                        <div className="flex items-center justify-between font-bold text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <span className={s.done ? "text-[#00ff88]" : s.prev ? "text-[#ffd166]" : "text-[#5c8a74]"}>{s.done ? `✓ Adım ${s.num}:` : `○ Adım ${s.num}:`}</span>
                            {s.title}
                          </span>
                          {s.done ? <span className="text-xs text-[#00ff88] font-mono bg-[#00ff88]/10 px-2 py-0.5 rounded font-bold">Başarılı</span>
                            : s.prev ? <span className="text-xs text-[#ffd166] font-mono bg-[#ffd166]/10 px-2 py-0.5 rounded font-bold animate-pulse">Aktif</span>
                            : <span className="text-xs text-[#5c8a74] font-mono border border-[#0c2719] px-2 py-0.5 rounded font-bold">Kilitli</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-[#74998a]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#0c2719] rounded-xl p-4 bg-black/30">
                      <div className="text-xs text-[#74998a] font-mono mb-2">// JWT Token Decode:</div>
                      <div className="space-y-3">
                        <div className="p-3 bg-black/60 rounded-lg">
                          <div className="text-[10px] text-[#ff2e88] font-mono font-bold mb-1">HEADER</div>
                          <pre className="text-xs font-mono text-[#cdeede] break-all">{headerObj ? JSON.stringify(headerObj, null, 2) : '// Token girin...'}</pre>
                          {hasNoneAlg && <div className="mt-1 text-[10px] text-[#ff2e88] font-bold">⚠️ alg: none → İmza kontrolü devre dışı!</div>}
                        </div>
                        <div className="p-3 bg-black/60 rounded-lg">
                          <div className="text-[10px] text-[#5cffba] font-mono font-bold mb-1">PAYLOAD</div>
                          <pre className="text-xs font-mono text-[#cdeede] break-all">{payloadObj ? JSON.stringify(payloadObj, null, 2) : '// Token girin...'}</pre>
                          {hasAdminRole && <div className="mt-1 text-[10px] text-[#00ff88] font-bold">✓ role: admin → Yetki yükseltildi</div>}
                        </div>
                        <div className="p-3 bg-black/60 rounded-lg">
                          <div className="text-[10px] text-[#ffd166] font-mono font-bold mb-1">SIGNATURE</div>
                          <pre className="text-xs font-mono text-[#74998a] break-all">{parts.length >= 3 ? (parts[2] || '(boş — none alg)') : '// Token girin...'}</pre>
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
      const t = target.token || '';
      const parts = t.split('.');
      if (parts.length < 2) return { ok: false, msg: "Geçersiz Token formatı! JWT 3 bölümden oluşmalıdır." };

      const safeAtob = (str) => {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        return atob(b64);
      };

      try {
        const header = JSON.parse(safeAtob(parts[0]));
        const payload = JSON.parse(safeAtob(parts[1]));

        if (header.alg === 'none' || header.alg === 'NONE' || header.alg === 'None') {
          if (payload.role === 'admin' || payload.role === 'ADMIN') {
            return { ok: true };
          }
          return { ok: 'warn', msg: "Algorithm none kabul edildi fakat rolünüz admin değil. Payload'da role: admin yapın." };
        } else {
          return { ok: false, msg: "İmza doğrulanamadı! Header'daki alg değerini none yapın." };
        }
      } catch (e) {
        return { ok: false, msg: "JWT Base64 çözümlenemedi veya hatalı JSON yapısı!" };
      }
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

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Varsayılan Şifreyi Girin
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
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

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Bayrak Dosyasını Okuyun
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
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
                      className={`w-full font-bold py-2 rounded transition-all text-xs ${step3Ready ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,.3)]' : 'text-[#5c8a74] bg-[#103a26] cursor-not-allowed'}`}
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

                    <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#cdeede]' : !step1Done ? 'border-[#0c2719] opacity-40 text-[#5c8a74]' : 'border-[#103a26] bg-black/25 text-[#74998a]'}`}>
                      <div className="flex items-center justify-between font-bold text-sm md:text-base mb-1.5">
                        <span className="flex items-center gap-2">
                          <span className={step2Done ? "text-[#00ff88]" : step1Done ? "text-[#ffd166]" : "text-[#5c8a74]"}>{step2Done ? "✓ Adım 2:" : "○ Adım 2:"}</span>
                          Sunucu Dosyasını Okuyun
                        </span>
                        {step2Done ? (
                          <span className="text-sm text-[#00ff88] font-mono bg-[#00ff88]/10 px-2.5 py-1 rounded font-bold">Başarılı</span>
                        ) : step1Done ? (
                          <span className="text-sm text-[#ffd166] font-mono bg-[#ffd166]/10 px-2.5 py-1 rounded font-bold animate-pulse">Aktif Adım</span>
                        ) : (
                          <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
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
                        className={`w-full font-bold py-2 rounded transition-all text-xs ${step3Ready ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,.3)]' : 'text-[#5c8a74] bg-[#103a26] cursor-not-allowed'}`}
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
            : <span className="text-sm text-[#5c8a74] font-mono border border-[#0c2719] px-2.5 py-1 rounded font-bold">Kilitli</span>
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
                          <span className={s2 ? 'text-[#00ff88]' : s1 ? 'text-[#ffd166]' : 'text-[#5c8a74]'}>{s2 ? '✓ Adım 2:' : '○ Adım 2:'}</span>
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
                          <span className={s3 ? 'text-[#00ff88]' : s2 ? 'text-[#ffd166]' : 'text-[#5c8a74]'}>{s3 ? '✓ Adım 3:' : '○ Adım 3:'}</span>
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
                        <div className="text-[#5c8a74] mt-1">// İlk komutu dene: nmap -sn 10.10.84.0/24</div>
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

  const [user] = useUser();

  if (room.premium && !user.is_premium) {
    return (
      <>
        <AppHeader navigate={navigate} active="dashboard" />
        <div className="border-b border-[#0c2719] bg-[#04100a]">
          <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sm md:text-base">
              <button onClick={() => navigate('dashboard')} className="text-[#74998a] hover:text-[#00ff88] transition-colors">← Dashboard</button>
              <span className="text-[#5c8a74]">/</span>
              <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
              <span className="text-[#5c8a74]">/</span>
              <span className="text-[#eafff5] font-mono">{room.name}</span>
            </div>
          </div>
        </div>

        <section className="py-20 px-6 max-w-[800px] mx-auto text-center">
          <div 
            className="border border-[#ffd166]/30 bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(255,209,102,.12)] p-8 md:p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(165deg,#07150e,#020806)' }}
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,rgba(255,209,102,0.08),transparent_70%)] pointer-events-none"></div>
            
            <span className="w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl border border-[#ffd166]/30 bg-[#ffd166]/10 text-[#ffd166] mb-6 animate-bounce">👑</span>
            
            <h2 className="text-2xl md:text-3xl font-disp font-bold text-[#eafff5] mb-4">VIP Üyelik Gerekli</h2>
            
            <p className="text-[#9fc4b5] text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
              <strong>{room.name}</strong> laboratuvarı ve ders brifingi VIP Uzmanlık Programı kapsamındadır. Ücretsiz üyeler bu laboratuvar ortamlarına erişemezler.
            </p>

            <div className="flex flex-col md:flex-row gap-5 items-center justify-center p-6 border border-[#ffd166]/10 bg-[#ffd166]/[0.02] rounded-xl mb-8 text-left max-w-xl mx-auto">
              <img src="/ogretici.jpg" className="w-20 h-24 object-cover rounded-lg border border-[#ffd166]/20 flex-none bg-black/40" alt="Siber Mentör" />
              <div>
                <span className="font-disp font-bold text-sm text-[#ffd166] block mb-1">Mentör Mesajı:</span>
                <p className="text-xs text-[#74998a] leading-relaxed">
                  "Bu odadaki senaryoları çözerken sana bire bir mentörlük yapacağım, kodunu ve yaklaşımlarını inceleyeceğim. Gerçek sistem sızma testleri için hazır mısın?"
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('category', parentCat)}
                className="px-6 py-3.5 border border-[#103a26] text-[#74998a] hover:text-[#eafff5] hover:border-[#74998a] rounded-xl text-xs font-mono transition-all"
              >
                Geri Dön
              </button>
              <button 
                onClick={() => navigate('pricing')} 
                className="px-8 py-3.5 font-mono text-xs font-bold text-[#021008] bg-[#ffd166] rounded-xl hover:shadow-[0_0_24px_rgba(255,209,102,0.4)] hover:bg-[#ffe082] transition-all uppercase tracking-wider"
              >
                VIP Planları İncele & Katıl ⚡
              </button>
            </div>
          </div>
        </section>
        <SKFooter navigate={navigate} />
      </>
    );
  }

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
            <span className="text-[#5c8a74]">/</span>
            <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
            <span className="text-[#5c8a74]">/</span>
            <span className="text-[#eafff5] font-mono">{room.name}</span>
            <span className="text-[#5c8a74]">/</span>
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
              {!instantAll && (
                <button 
                  onClick={() => setInstantAll(true)} 
                  className="px-3.5 py-1.5 rounded border border-[#00ff88]/50 text-[#00ff88] bg-[rgba(0,255,136,.03)] hover:bg-[rgba(0,255,136,.12)] text-xs font-mono font-bold uppercase transition-all"
                >
                  ⏩ Brifingin Tamamını Gör
                </button>
              )}
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

  const config = WEB_ROOM_CONFIGS[room.id] || {
    title: room.name,
    desc: room.desc,
    flag: `siberkampus{${room.id}_flag_solved}`,
    hints: [
      "Bu odanın CTF görevini tamamlamak için hedefin zafiyetlerini sömürün.",
      "Bayrağı elde ettikten sonra aşağıdaki formdan doğrulayın.",
      "Çözüm ve ipuçları için mentör desteği alabilirsiniz."
    ],
    renderApp: (target, setTarget, runTarget, resp) => {
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

  if (room.premium && !user.is_premium) {
    return (
      <>
        <AppHeader navigate={navigate} active="dashboard" />
        <div className="border-b border-[#0c2719] bg-[#04100a]">
          <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sm md:text-base">
              <button onClick={() => navigate('dashboard')} className="text-[#74998a] hover:text-[#00ff88] transition-colors">← Dashboard</button>
              <span className="text-[#5c8a74]">/</span>
              <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
              <span className="text-[#5c8a74]">/</span>
              <span className="text-[#eafff5] font-mono">{room.name}</span>
            </div>
          </div>
        </div>

        <section className="py-20 px-6 max-w-[800px] mx-auto text-center">
          <div 
            className="border border-[#ffd166]/30 bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(255,209,102,.12)] p-8 md:p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(165deg,#07150e,#020806)' }}
          >
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,rgba(255,209,102,0.08),transparent_70%)] pointer-events-none"></div>
            
            <span className="w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl border border-[#ffd166]/30 bg-[#ffd166]/10 text-[#ffd166] mb-6 animate-bounce">👑</span>
            
            <h2 className="text-2xl md:text-3xl font-disp font-bold text-[#eafff5] mb-4">VIP Üyelik Gerekli</h2>
            
            <p className="text-[#9fc4b5] text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
              <strong>{room.name}</strong> laboratuvar ortamı VIP Uzmanlık Programı kapsamındadır. Ücretsiz üyeler bu laboratuvar ortamlarına erişemezler.
            </p>

            <div className="flex flex-col md:flex-row gap-5 items-center justify-center p-6 border border-[#ffd166]/10 bg-[#ffd166]/[0.02] rounded-xl mb-8 text-left max-w-xl mx-auto">
              <img src="/ogretici.jpg" className="w-20 h-24 object-cover rounded-lg border border-[#ffd166]/20 flex-none bg-black/40" alt="Siber Mentör" />
              <div>
                <span className="font-disp font-bold text-sm text-[#ffd166] block mb-1">Mentör Mesajı:</span>
                <p className="text-xs text-[#74998a] leading-relaxed">
                  "Bu odadaki senaryoları çözerken sana bire bir mentörlük yapacağım, kodunu ve yaklaşımlarını inceleyeceğim. Gerçek sistem sızma testleri için hazır mısın?"
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('category', parentCat)}
                className="px-6 py-3.5 border border-[#103a26] text-[#74998a] hover:text-[#eafff5] hover:border-[#74998a] rounded-xl text-xs font-mono transition-all"
              >
                Geri Dön
              </button>
              <button 
                onClick={() => navigate('pricing')} 
                className="px-8 py-3.5 font-mono text-xs font-bold text-[#021008] bg-[#ffd166] rounded-xl hover:shadow-[0_0_24px_rgba(255,209,102,0.4)] hover:bg-[#ffe082] transition-all uppercase tracking-wider"
              >
                VIP Planları İncele & Katıl ⚡
              </button>
            </div>
          </div>
        </section>
        <SKFooter navigate={navigate} />
      </>
    );
  }
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
            <span className="text-[#5c8a74]">/</span>
            <button onClick={() => navigate('category', parentCat)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">{parentCat.name}</button>
            <span className="text-[#5c8a74]">/</span>
            <h1 className="text-[#eafff5] font-mono inline text-sm md:text-base font-normal">{config.title}</h1>
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
                  <button type="button" className="text-[#5c8a74] hover:text-[#74998a] font-bold ml-1 text-xs">×</button>
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
                    <span className="text-[#5c8a74] font-bold">|</span>
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
    tag: u.tag || null,
    solved: u.solved,
    badges: u.badges,
    streak: u.streak
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
                    {earned.length < 5 && Array.from({ length: Math.min(3, 5 - earned.length) }).map((_, i) => (<span key={'l'+i} className="w-11 h-11 rounded-lg grid place-items-center text-lg border border-[#0c2719] text-[#5c8a74]">?</span>))}
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
  const isFirstLoad = useRef(true);
  const prevMsgsCount = useRef(0);
  const prevLastMsgId = useRef(null);
  const userJustSentMessage = useRef(false);
  const [activeChat, setActiveChat] = useState('general');
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [vipCount, setVipCount] = useState(0);

  const fetchMessages = () => {
    const token = localStorage.getItem('sk_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/chat/messages?vip=${activeChat === 'vip'}`, { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const marked = data.map(m => ({
            ...m,
            me: m.u === user.name
          }));
          setMsgs(marked);
          if (activeChat === 'vip') setVipCount(marked.length);
        }
      })
      .catch(err => console.error("Mesaj yükleme hatası:", err));
  };

  useEffect(() => {
    if (activeChat !== 'vip') {
      const token = localStorage.getItem('sk_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch('/api/chat/messages?vip=true', { headers })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setVipCount(data.length); })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [user.name, activeChat]);

  useEffect(() => {
    isFirstLoad.current = true;
  }, [activeChat]);

  useEffect(() => {
    if (scrollRef.current && msgs.length > 0) {
      const el = scrollRef.current;
      const lastMsg = msgs[msgs.length - 1];
      const lastMsgId = lastMsg.id || (lastMsg.u + '_' + lastMsg.t + '_' + (lastMsg.m ? lastMsg.m.slice(0, 10) : ''));
      
      const countChanged = msgs.length !== prevMsgsCount.current;
      const lastMsgChanged = lastMsgId !== prevLastMsgId.current;
      
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      
      if (isFirstLoad.current || userJustSentMessage.current || (isNearBottom && (countChanged || lastMsgChanged))) {
        el.scrollTop = el.scrollHeight;
        isFirstLoad.current = false;
        userJustSentMessage.current = false;
      }
      
      prevMsgsCount.current = msgs.length;
      prevLastMsgId.current = lastMsgId;
    }
  }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const tStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Add locally for snappiness
    const newMsg = { u: user.name, role: user.points > 1200 ? 'Siber Mentör' : 'Öğrenci', t: tStr, m: input, me: true };
    userJustSentMessage.current = true;
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
          body: JSON.stringify({ message: originalInput, isVip: activeChat === 'vip' })
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
  const [shuffledOnline, setShuffledOnline] = useState([]);

  // Shuffle online users to only display 40 at a time, swapping them periodically
  useEffect(() => {
    if (onlineUsers.length === 0) return;
    
    const selectRandomUsers = () => {
      const listWithoutMe = onlineUsers.filter(u => u !== user.name);
      const shuffled = [...listWithoutMe].sort(() => 0.5 - Math.random());
      setShuffledOnline(shuffled.slice(0, 10));
    };

    selectRandomUsers();
    const interval = setInterval(selectRandomUsers, 30000);
    return () => clearInterval(interval);
  }, [onlineUsers, user.name]);

  useEffect(() => {
    const token = localStorage.getItem('sk_token');

    const fetchOnline = () => {
      fetch(`/api/users/online?t=${Date.now()}`)
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

  const displayedOnlineCount = (shuffledOnline.length > 0 ? shuffledOnline.length : Math.min(10, online.filter(u => u !== user.name).length)) + 1;
  const extraOnlineCount = totalOnlineCount - displayedOnlineCount;

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
                  {activeChat !== 'vip' && vipCount > 0 && (
                    <span className="w-4 h-4 bg-[#ff2e88] text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px]">{vipCount}</span>
                  )}
                </button>
              </div>
              <span className="text-xs text-[#5c8a74] ml-auto font-mono">{totalOnlineCount || 1} aktif</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {msgs.map((m, i) => (
                m.sys ? (
                  <div key={i} className="text-center"><span className="inline-block font-mono text-xs text-[#00ff88] bg-[rgba(0,255,136,.05)] border border-[#103a26] px-3 py-1.5 rounded-full">⚙ {m.m}</span></div>
                ) : (
                  <div key={i} className={"flex gap-3 " + (m.me ? 'flex-row-reverse' : '')}>
                    {(() => {
                      const isVipUser = m.isSenderVip || (m.me && (user.is_premium || user.is_vip));
                      return (
                        <div className="relative flex-none">
                          <span 
                            className={"w-9 h-9 rounded-lg grid place-items-center font-bold text-xs border " + (
                              isVipUser
                                ? (m.me ? 'border-[#ffd166] text-[#021008] shadow-[0_0_12px_rgba(255,209,102,0.45)]' : 'border-[#ffd166] text-[#ffd166] shadow-[0_0_12px_rgba(255,209,102,0.3)]')
                                : (m.me ? 'bg-[#00ff88] text-[#021008] border-[#00ff88]' : 'text-[#5cffba] border-[#103a26]')
                            )} 
                            style={
                              isVipUser
                                ? (m.me ? { background: 'linear-gradient(135deg,#ffd166,#b38f1d)' } : { background: 'linear-gradient(135deg,#241c09,#120e03)' })
                                : (m.me ? {} : { background: 'linear-gradient(135deg,#0a3a24,#052b18)' })
                            }
                          >
                            {m.u.slice(0, 2).toUpperCase()}
                          </span>
                          {isVipUser && (
                            <span className="absolute -top-1.5 -right-1.5 text-xs animate-bounce" style={{ animationDuration: '3s' }}>👑</span>
                          )}
                        </div>
                      );
                    })()}
                    <div className={"max-w-[78%] " + (m.me ? 'text-right' : '')}>
                      <div className={"flex items-center gap-2 mb-1 " + (m.me ? 'justify-end' : '')}>
                        <span className="text-sm text-[#eafff5] font-medium">{m.u}</span>
                        <span className="text-[10px] text-[#5c8a74] font-mono px-1.5 py-0.5 rounded bg-[#04100a] border border-[#0c2719]">{m.role}</span>
                        <span className="text-[10px] text-[#5c8a74]">{m.t}</span>
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
                {(shuffledOnline.length > 0 ? shuffledOnline : online.slice(0, 10)).map((u, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-md grid place-items-center text-[#5cffba] font-bold text-[10px] border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{u.slice(0, 2).toUpperCase()}</span>
                    <span className="text-sm text-[#cdeede]">{u}</span>
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 pt-1.5 border-t border-[#103a26]/30 mt-1.5">
                  <span className="w-7 h-7 rounded-md grid place-items-center text-[#021008] font-bold text-[10px] bg-[#00ff88]">{(user.name || 'SE').slice(0, 2).toUpperCase()}</span>
                  <span className="text-sm text-[#00ff88] font-medium">{user.name || 'Sen'} (Sen)</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#ffd166]"></span>
                </div>
                <p className="text-xs text-[#5c8a74] pt-2">{extraOnlineCount > 0 ? '+' + extraOnlineCount + ' kişi daha…' : ''}</p>
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
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogMetaDescription, setBlogMetaDescription] = useState('');
  const [blogFocusKeywords, setBlogFocusKeywords] = useState('');
  const [blogCanonicalUrl, setBlogCanonicalUrl] = useState('');
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [showSeoPanel, setShowSeoPanel] = useState(false);

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

  const handleDeleteUser = async (userId, name) => {
    const token = localStorage.getItem('sk_token');
    if (!confirm(`${name} adlı kullanıcıyı tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kullanıcının tüm çözümleri silinecektir!`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        alert(data.error || 'Kullanıcı silinemedi.');
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
    const isEdit = editingBlogId !== null;
    const url = isEdit ? `/api/blogs/${editingBlogId}` : '/api/blogs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
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
          readTime: blogReadTime.trim(),
          seoTitle: blogSeoTitle.trim(),
          metaDescription: blogMetaDescription.trim(),
          focusKeywords: blogFocusKeywords.trim(),
          canonicalUrl: blogCanonicalUrl.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBlogSuccess(isEdit ? 'Blog yazısı başarıyla güncellendi!' : 'Yeni blog yazısı başarıyla eklendi!');
        handleCancelEditBlog();
        fetchBlogs();
      } else {
        setBlogError(data.error || 'İşlem gerçekleştirilirken hata oluştu.');
      }
    } catch (err) {
      setBlogError('Ağ hatası oluştu.');
    }
  };

  const handleStartEditBlog = async (blog) => {
    setBlogSuccess('');
    setBlogError('');
    try {
      // Fetch full details including content
      const res = await fetch(`/api/blogs/${blog.slug}`);
      const data = await res.json();
      if (res.ok) {
        setEditingBlogId(data.id);
        setBlogTitle(data.title || '');
        setBlogExcerpt(data.excerpt || '');
        setBlogCategory(data.category || '');
        setBlogAuthor(data.author || '');
        setBlogReadTime(data.readTime || data.read_time || '5 dk');
        setBlogContent(data.content || '');
        setBlogSeoTitle(data.seo_title || '');
        setBlogMetaDescription(data.meta_description || '');
        setBlogFocusKeywords(data.focus_keywords || '');
        setBlogCanonicalUrl(data.canonical_url || '');
        setShowSeoPanel(true);
        
        // Scroll smoothly to form header
        const formEl = document.getElementById('blog-form-title');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        alert(data.error || 'Makale detayları yüklenemedi.');
      }
    } catch (err) {
      alert('Makale yüklenirken ağ hatası oluştu.');
    }
  };

  const handleCancelEditBlog = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogCategory('');
    setBlogAuthor('');
    setBlogReadTime('5 dk');
    setBlogContent('');
    setBlogSeoTitle('');
    setBlogMetaDescription('');
    setBlogFocusKeywords('');
    setBlogCanonicalUrl('');
    setShowSeoPanel(false);
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
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c8a74]">🔍</span>
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
                              <div className="text-xs text-[#5c8a74]">ID: {u.id} {u.is_admin && <span className="text-[#ffd166]">[Yönetici]</span>}</div>
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
                          {u.is_vip ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#ffd166]/10 text-[#ffd166] border border-[#ffd166]/20">👑 VIP Mentor</span>
                          ) : u.is_premium ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">💎 Platform</span>
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
                              if (confirm(`${u.name} adlı kullanıcının platform (premium) durumunu değiştirmek istediğinize emin misiniz?`)) {
                                fetch(`/api/admin/users/${u.id}/premium`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  }
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
                              u.is_premium && !u.is_vip
                                ? 'text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/10'
                                : 'text-[#74998a] border-[#74998a]/30 hover:bg-[#74998a]/10'
                            }`}
                          >
                            {u.is_premium && !u.is_vip ? '💎 Platform Kapat' : '💎 Platform Ver'}
                          </button>
                          <button
                            onClick={() => {
                              const token = localStorage.getItem('sk_token');
                              if (confirm(`${u.name} adlı kullanıcının mentor (VIP) durumunu değiştirmek istediğinize emin misiniz?`)) {
                                fetch(`/api/admin/users/${u.id}/vip`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  }
                                }).then(res => {
                                  if (res.ok) {
                                    fetchUsers();
                                  } else {
                                    alert('VIP durumu değiştirilemedi.');
                                  }
                                }).catch(() => alert('Ağ hatası.'));
                              }
                            }}
                            className={`font-mono text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                              u.is_vip
                                ? 'text-[#ffd166] border-[#ffd166]/30 hover:bg-[#ffd166]/10'
                                : 'text-[#74998a] border-[#74998a]/30 hover:bg-[#74998a]/10'
                            }`}
                          >
                            {u.is_vip ? '👑 VIP Kapat' : '👑 VIP Ver'}
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
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={u.id === user.id}
                            className="font-mono text-xs px-3.5 py-1.5 rounded-lg border border-[#ff2e88]/30 text-[#ff2e88] hover:bg-[#ff2e88]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                          >
                            Sil 🗑️
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
            {/* Create/Edit Blog Form */}
            <div className="rounded-2xl border border-[#0c2719] p-6 bg-gradient-to-br from-[#07150e] to-[#04100a] h-fit">
              <h3 id="blog-form-title" className="text-lg text-[#eafff5] font-bold mb-5 flex items-center gap-2">
                <span>{editingBlogId ? '✏️' : '✍️'}</span> {editingBlogId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
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

                {/* Collapsible advanced SEO panel (All-In-One SEO style) */}
                <div className="border border-[#103a26] rounded-lg overflow-hidden bg-[#020806]/40">
                  <button
                    type="button"
                    onClick={() => setShowSeoPanel(!showSeoPanel)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#0c2719]/40 hover:bg-[#0c2719]/60 transition-colors font-mono text-xs text-[#00ff88]"
                  >
                    <span>⚙️ GELİŞMİŞ SEO AYARLARI (ALL-IN-ONE SEO)</span>
                    <span>{showSeoPanel ? '▲ Göster' : '▼ Gizle'}</span>
                  </button>
                  {showSeoPanel && (
                    <div className="p-4 space-y-4 border-t border-[#103a26]">
                      <div>
                        <label className="block text-xs text-[#74998a] mb-1.5 font-mono">META BAŞLIĞI (SEO TITLE)</label>
                        <input
                          type="text"
                          placeholder="Boş bırakılırsa makale başlığı kullanılır..."
                          value={blogSeoTitle}
                          onChange={e => setBlogSeoTitle(e.target.value)}
                          className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#74998a] mb-1.5 font-mono">META AÇIKLAMASI (META DESCRIPTION)</label>
                        <textarea
                          rows="2"
                          placeholder="Boş bırakılırsa makale özeti kullanılır..."
                          value={blogMetaDescription}
                          onChange={e => setBlogMetaDescription(e.target.value)}
                          className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#74998a] mb-1.5 font-mono">ODAK ANAHTAR KELİMELER (FOCUS KEYWORDS)</label>
                        <input
                          type="text"
                          placeholder="örn: wifi kırma, wpa2 kırma, aircrack-ng"
                          value={blogFocusKeywords}
                          onChange={e => setBlogFocusKeywords(e.target.value)}
                          className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#74998a] mb-1.5 font-mono">KANONİK URL (CANONICAL URL)</label>
                        <input
                          type="url"
                          placeholder="örn: https://siberkampus.org/blogs/wifi-el-sikismasi-kirma"
                          value={blogCanonicalUrl}
                          onChange={e => setBlogCanonicalUrl(e.target.value)}
                          className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3 rounded-lg hover:shadow-[0_0_24px_-4px_var(--glow)] transition-all"
                  >
                    {editingBlogId ? 'Makaleyi Güncelle 💾' : 'Yayınla 🚀'}
                  </button>
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={handleCancelEditBlog}
                      className="border border-[#ff2e88]/30 text-[#ff2e88] hover:bg-[#ff2e88]/10 px-5 rounded-lg text-sm font-mono transition-all"
                    >
                      Vazgeç
                    </button>
                  )}
                </div>
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
                        <p className="text-xs text-[#5c8a74] mt-1 font-mono">
                          Yazar: {b.author} • {b.date || 'Bugün'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEditBlog(b)}
                          className="flex-none font-mono text-xs text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/10 px-3 py-2 rounded-lg transition-all"
                        >
                          Düzenle ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="flex-none font-mono text-xs text-[#ff2e88] border border-[#ff2e88]/30 hover:bg-[#ff2e88]/10 px-3 py-2 rounded-lg transition-all"
                        >
                          Sil 🗑️
                        </button>
                      </div>
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
                            <span className="text-[10px] text-[#5c8a74] font-mono px-1.5 py-0.5 rounded bg-[#04100a] border border-[#0c2719]">
                              {msg.role}
                            </span>
                            <span className="text-[10px] text-[#5c8a74]">{msg.t}</span>
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

/* ============ PATHWAY PAGE (İlerleme Haritası) ============ */
const PathwayPage = ({ navigate, data }) => {
  const pathway = (typeof data === 'string'
    ? (window.SK_PATHWAYS && window.SK_PATHWAYS.find(p => p.slug === data))
    : data) || (window.SK_PATHWAYS && window.SK_PATHWAYS[0]);
  if (!pathway) return <div className="text-center py-20 text-[#74998a]">Pathway bulunamadı.</div>;

  const [user] = useUser();
  const [solvedList, setSolvedList] = useState(() => JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]'));
  const [completedDocs, setCompletedDocs] = useState(() => JSON.parse(localStorage.getItem('sk_completed_docs') || '[]'));
  const [progressMap, setProgressMap] = useState(() => JSON.parse(localStorage.getItem('sk_room_progress') || '{}'));
  const [premiumModal, setPremiumModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoadingProgress(true);
      const token = localStorage.getItem('sk_token');
      try {
        const res = await fetch('/api/pathway/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          localStorage.setItem('sk_solved_rooms', JSON.stringify(result.solvedRooms));
          localStorage.setItem('sk_completed_docs', JSON.stringify(result.completedDocs));
          setSolvedList(result.solvedRooms);
          setCompletedDocs(result.completedDocs);
        }
      } catch (err) {
        console.error('Pathway progress fetch error:', err);
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [pathway.slug]);

  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };

  const phaseStats = pathway.phases.map(phase => {
    const items = phase.items.map((item, idx) => {
      const detail = window.getPathwayItemDetails(item);
      const isSolved = item.type === 'room' ? solvedList.includes(item.id) : item.type === 'doc' ? completedDocs.includes(item.id) : item.type === 'target' ? solvedList.includes(item.id) : false;
      const progress = item.type === 'room' ? (progressMap[item.id] || 0) : 0;
      const unlocked = window.isItemUnlocked(pathway, phase.id, idx, solvedList, completedDocs);
      return { ...detail, isSolved, progress, unlocked, idx, targetUrl: item.targetUrl };
    });
    const completed = items.filter(i => i.isSolved).length;
    const total = items.length;
    const unlocked = window.isPhaseUnlocked(pathway, phase.id, solvedList, completedDocs);
    const premiumLocked = phase.premium && !user.is_premium;
    return { ...phase, items, completed, total, unlocked, premiumLocked };
  });

  const overallCompleted = phaseStats.reduce((a, p) => a + p.completed, 0);
  const overallTotal = phaseStats.reduce((a, p) => a + p.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  const handleItemClick = (phase, item) => {
    if (pathway.slug === 'web-pentest' && !user.is_premium) {
      setPremiumModal(true);
      return;
    }
    if (phase.premiumLocked) {
      setPremiumModal(true);
      return;
    }
    if (!phase.unlocked || !item.unlocked) return;
    if (item.type === 'room') {
      const roomObj = window.SK_ROOMS_MAP[item.id];
      if (roomObj) navigate('roomArticle', { ...roomObj, cat: pathway.name });
    } else if (item.type === 'doc') {
      navigate('doc', { id: item.id, pathwaySlug: pathway.slug });
    } else if (item.type === 'target') {
      if (item.targetUrl) {
        window.open(item.targetUrl, '_blank');
      }
    }
  };

  return (
    <>
      <AppHeader navigate={navigate} active="dashboard" />

      {/* Hero */}
      <section className="py-16 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.10),transparent 62%)' }}></div>
        <div className="max-w-[900px] mx-auto px-6 relative z-[2]">
          <button onClick={() => navigate('dashboard')} className="text-sm text-[#74998a] hover:text-[#00ff88] transition-colors mb-5">← Dashboard'a dön</button>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-14 h-14 rounded-xl grid place-items-center text-2xl border border-[#103a26] bg-[rgba(0,255,136,.04)]">{pathway.icon}</span>
            <div>
              <h1 className="text-[clamp(26px,4vw,38px)] text-[#eafff5] font-disp">{pathway.name}</h1>
              <p className="text-[#74998a] text-sm mt-1">{pathway.desc}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#74998a]">Genel İlerleme</span>
              <span className="text-[#00ff88] font-mono font-bold">{overallCompleted}/{overallTotal} Adım · %{overallPct}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#0c2719] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg,#00ff88,#5cffba)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Uzmanlık Programı Card */}
      {pathway.slug === 'web-pentest' && (
        <section className="pt-10 pb-4 max-w-[900px] mx-auto px-6">
          <div className="rounded-2xl border border-[#ffd166]/30 bg-gradient-to-br from-[#0b1b14] to-[#04100a] p-6 shadow-[0_0_50px_rgba(255,209,102,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,rgba(255,209,102,0.1),transparent_70%)] pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl animate-bounce">👑</span>
              <div>
                <h2 className="text-lg font-disp font-bold text-[#ffd166] tracking-wide">VIP Uzmanlık Programı</h2>
                <span className="text-[10px] font-mono font-bold text-[#ffd166]/80 px-2 py-0.5 rounded bg-[#ffd166]/10 border border-[#ffd166]/20">PROFESYONEL</span>
              </div>
            </div>
            <p className="text-sm text-[#eafff5] font-medium leading-relaxed mb-5">
              Sıradan laboratuvarların ötesine geçin. Bire bir uzman mentör öğretmen eşliğinde gerçek senaryolarla sızma testi yapın.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-[#103a26]/50 bg-black/10">
                <span className="text-[#ffd166] font-bold text-sm block mb-1">✓ 4 Canlı Hedef Ağ</span>
                <p className="text-[11px] text-[#74998a] leading-relaxed">E-Ticaret, Bankacılık, Kurumsal Ağlar ve API altyapıları üzerinde canlı hacking deneyimi.</p>
              </div>
              <div className="p-4 rounded-xl border border-[#103a26]/50 bg-black/10">
                <span className="text-[#ffd166] font-bold text-sm block mb-1">✓ Bire Bir Mentör</span>
                <p className="text-[11px] text-[#74998a] leading-relaxed">Hatalarınızı analiz eden ve bire bir yol gösteren uzman öğretmen desteği.</p>
              </div>
              <div className="p-4 rounded-xl border border-[#103a26]/50 bg-black/10">
                <span className="text-[#ffd166] font-bold text-sm block mb-1">✓ Zengin Eğitim Kaynakları</span>
                <p className="text-[11px] text-[#74998a] leading-relaxed">Sektör standardı ileri düzey metodolojiler ve sızma testi makaleleri.</p>
              </div>
            </div>
            {!user.is_premium && (
              <button 
                onClick={() => navigate('pricing')} 
                className="w-full text-center font-mono text-xs font-bold text-[#021008] bg-[#ffd166] py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,209,102,0.4)] transition-all uppercase tracking-wider"
              >
                VIP Planları İncele & Katıl ⚡
              </button>
            )}
          </div>
        </section>
      )}

      {/* Phase Map */}
      <section className="py-10">
        <div className="max-w-[900px] mx-auto px-6">
          {phaseStats.map((phase, pi) => {
            const isLocked = !phase.unlocked;
            const isPremium = phase.premiumLocked;
            const isComplete = phase.completed === phase.total;
            const lineColor = isComplete ? 'border-[#00ff88]' : isLocked ? 'border-[#0c2719]' : 'border-[#103a26]';

            return (
              <div key={phase.id} className={`relative ${pi < phaseStats.length - 1 ? 'pb-2' : ''}`}>
                {/* Phase Header */}
                <div 
                  onClick={() => isPremium && setPremiumModal(true)}
                  className={`flex items-center gap-4 p-5 rounded-xl border mb-1 ${isPremium ? 'cursor-pointer border-[#ffd166]/30 bg-[#ffd166]/[0.02] hover:border-[#ffd166]/50 transition-colors' : isLocked ? 'opacity-50 border-[#0c2719]' : isComplete ? 'border-[#00ff88]/40 bg-[rgba(0,255,136,.03)]' : 'border-[#103a26] bg-[rgba(7,21,14,.6)]'}`}
                >
                  <span className="w-12 h-12 rounded-lg grid place-items-center text-xl border border-[#103a26] bg-[#020806] flex-none">{isPremium ? '👑' : phase.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg text-[#eafff5] font-disp font-bold">FAZ {phase.order}: {phase.name}</h2>
                      {isPremium && <span className="text-xs font-bold text-[#ffd166] bg-[rgba(255,209,102,.1)] px-2 py-0.5 rounded">PREMIUM</span>}
                    </div>
                    <p className="text-xs text-[#74998a] mt-0.5">{phase.desc}</p>
                  </div>
                  <div className="text-right flex-none">
                    {isPremium ? (
                      <span className="text-xs text-[#ffd166] font-mono">👑 Premium</span>
                    ) : isLocked ? (
                      <span className="text-xs text-[#5c8a74] font-mono">🔒 Kilitli</span>
                    ) : isComplete ? (
                      <span className="text-xs text-[#00ff88] font-bold font-mono">✅ {phase.completed}/{phase.total}</span>
                    ) : (
                      <span className="text-xs text-[#74998a] font-mono">⏳ {phase.completed}/{phase.total}</span>
                    )}
                  </div>
                </div>

                {/* Items with connecting line */}
                <div className={`ml-[29px] border-l-2 ${lineColor} pl-7 py-3 space-y-2`}>
                  {phase.items.map((item, ii) => {
                    const isPremiumItem = (pathway.slug === 'web-pentest' || item.type === 'doc' || item.type === 'target') && !user.is_premium;
                    const locked = !isPremiumItem && (!phase.unlocked || isPremium || !item.unlocked);
                    const solved = item.isSolved;
                    const inProgress = !solved && item.progress > 0 && item.progress < 100;
                    const isDoc = item.type === 'doc';
                    const isTarget = item.type === 'target';

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isPremiumItem) {
                            setPremiumModal(true);
                          } else if (!locked) {
                            handleItemClick(phase, item);
                          }
                        }}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          isPremiumItem
                            ? 'border-[#ffd166]/20 bg-[rgba(255,209,102,.02)] hover:border-[#ffd166]/40 cursor-pointer shadow-[0_0_15px_rgba(255,209,102,.02)] hover:shadow-[0_0_25px_rgba(255,209,102,.06)]'
                            : locked
                              ? 'opacity-35 border-[#0c2719] cursor-not-allowed'
                              : solved
                                ? 'border-[#00ff88]/30 bg-[rgba(0,255,136,.03)] cursor-pointer'
                                : inProgress
                                  ? 'border-[#00ff88]/50 bg-[rgba(0,255,136,.05)] shadow-[0_0_20px_rgba(0,255,136,.08)] cursor-pointer'
                                  : 'border-[#103a26] hover:border-[#00ff88]/40 hover:shadow-[0_0_20px_rgba(0,255,136,.06)] cursor-pointer'
                        }`}
                      >
                        {/* Connector dot */}
                        <div className={`absolute -left-[37px] w-3 h-3 rounded-full border-2 ${solved ? 'bg-[#00ff88] border-[#00ff88]' : inProgress ? 'bg-[#020806] border-[#00ff88]' : isPremiumItem ? 'bg-[#020806] border-[#ffd166]' : locked ? 'bg-[#020806] border-[#0c2719]' : 'bg-[#020806] border-[#103a26]'}`}></div>

                        {/* Icon */}
                        <span className="w-9 h-9 rounded-lg grid place-items-center text-sm flex-none border border-[#103a26] bg-[#020806]">
                          {isPremiumItem ? '👑' : locked ? '🔒' : solved ? '✅' : inProgress ? '⏳' : isDoc ? '📄' : isTarget ? '🎯' : '▶'}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-[#eafff5] font-medium truncate">{item.name || item.id}</span>
                            {isDoc && <span className="text-[10px] text-[#5c8a74] bg-[#04100a] border border-[#0c2719] px-1.5 py-0.5 rounded font-mono">DÖKÜMAN</span>}
                            {isTarget && <span className="text-[10px] text-[#ffd166] bg-[rgba(255,209,102,.08)] border border-[#ffd166]/20 px-1.5 py-0.5 rounded font-mono">HEDEF SİTE</span>}
                            {isPremiumItem && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-[#ffd166] bg-[#ffd166]/10 border border-[#ffd166]/20 font-mono">VIP GEREKLİ</span>}
                            {!isPremiumItem && item.difficulty && <span className={"text-[10px] font-bold px-2 py-0.5 rounded " + (dc[item.difficulty] || '')}>{item.difficulty}</span>}
                          </div>
                          {inProgress && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-[#0c2719] overflow-hidden">
                                <div className="h-full rounded-full bg-[#00ff88]" style={{ width: `${item.progress}%` }}></div>
                              </div>
                              <span className="text-[10px] text-[#5cffba] font-mono">%{item.progress}</span>
                            </div>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="text-right flex-none">
                          {isDoc && <span className="text-[10px] text-[#5c8a74] font-mono">{item.readTime}</span>}
                          {item.points && <span className="text-xs text-[#00ff88] font-mono font-bold">◆ {item.points}</span>}
                          {isTarget && item.flagCount && <span className="text-[10px] text-[#5c8a74] font-mono">{item.flagCount} bayrak</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {premiumModal && (
        <div className="fixed inset-0 bg-[#020806]/90 z-[999] grid place-items-center p-4 overflow-y-auto" onClick={() => setPremiumModal(false)}>
          <div 
            className="relative max-w-2xl w-full border border-[#ffd166]/30 bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(255,209,102,.15)] overflow-hidden" 
            style={{ background: 'linear-gradient(165deg,#07150e,#020806)', animation: 'modalScaleIn .4s cubic-bezier(0.16,1,0.3,1) both' }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Header branding */}
            <div className="bg-[#ffd166]/10 border-b border-[#ffd166]/20 px-6 py-3.5 flex items-center justify-between">
              <span className="font-mono text-xs text-[#ffd166] tracking-[0.2em] uppercase font-bold">👑 UZMANIN YOLU · VIP MENTÖRLÜK</span>
              <button onClick={() => setPremiumModal(false)} className="text-[#ffd166] hover:text-white transition-colors text-sm font-mono">[X]</button>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Tutor Image Panel */}
              <div className="relative w-[180px] h-[220px] rounded-xl overflow-hidden border border-[#ffd166]/30 bg-black/40 shadow-[0_0_30px_-5px_rgba(255,209,102,.3)] flex-none">
                <img src="/ogretici.jpg" className="w-full h-full object-cover opacity-90 mix-blend-lighten" alt="Siber Mentör" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020806] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,209,102,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40 z-10"></div>
                <div className="absolute top-2 left-2 font-disp font-bold text-[8px] tracking-widest text-[#ffd166] bg-black/75 px-1.5 py-0.5 border border-[#ffd166]/20 rounded uppercase z-10">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#ffd166] mr-1 sk-pulse"></span> Çevrimiçi
                </div>
                <div className="absolute bottom-2 left-2 right-2 z-10 text-left">
                  <div className="font-disp font-bold text-xs text-white">Siber Mentör</div>
                  <div className="text-[8px] font-mono text-[#74998a]">VIP Yol Arkadaşın</div>
                </div>
              </div>

              {/* Speech Box */}
              <div className="flex-1 text-left">
                <div className="relative bg-[#07150e] border border-[#103a26] rounded-xl p-5 md:p-6 shadow-inner">
                  {/* Small arrow for speech bubble */}
                  <div className="hidden md:block absolute left-[-8px] top-10 w-4 h-4 bg-[#07150e] border-l border-b border-[#103a26] rotate-45"></div>
                  
                  <div className="font-disp font-bold text-lg text-[#ffd166] mb-3">Merhaba Siber Kampüslü! 👋</div>
                  <p className="text-sm text-[#cdeede] leading-relaxed mb-4">
                    Bu muhteşem yolculukta ilerlemek ve bu dökümana erişmek için <strong>VIP üye</strong> olman gerekiyor.
                  </p>
                  <p className="text-sm text-[#9fc4b5] leading-relaxed mb-4">
                    VIP üyeliğinde seninle <strong>bire bir mentörlük</strong> yapacağız. Çözdüğün laboratuvarları inceleyecek, hatalarını analiz edecek ve takıldığın yerlerde sana özel rehberlik edeceğim.
                  </p>
                  <p className="text-sm text-[#9fc4b5] leading-relaxed">
                    Ayrıca, <strong>gerçekçi hedef sitelerde</strong> (E-Ticaret, Bankacılık ve Kurumsal Ağlar) canlı hacking ve sızma testi çalışmalarını beraber yürüteceğiz!
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-[#020806]/60 border-t border-[#0c2719] px-6 py-5 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => setPremiumModal(false)}
                className="order-2 sm:order-1 px-5 py-3 border border-[#103a26] text-[#74998a] hover:text-[#eafff5] hover:border-[#74998a] rounded-xl text-xs font-mono transition-colors"
              >
                Daha Sonra
              </button>
              <button 
                onClick={() => {
                  setPremiumModal(false);
                  navigate('pricing');
                }} 
                className="order-1 sm:order-2 px-6 py-3 font-mono text-xs font-bold text-[#021008] bg-[#ffd166] rounded-xl hover:shadow-[0_0_24px_rgba(255,209,102,0.4)] hover:bg-[#ffe082] transition-all uppercase tracking-wider"
              >
                ⚡ VIP Üyeliğe Yükselt
              </button>
            </div>
          </div>
        </div>
      )}

      {SKFooter && <SKFooter navigate={navigate} />}
    </>
  );
};

/* ============ DOC PAGE ============ */
const DocPage = ({ navigate, data }) => {
  const docId = typeof data === 'string' ? data : data?.id || '';
  const pathwaySlug = data?.pathwaySlug || 'web-pentest';
  
  const doc = (window.SK_DOCS && window.SK_DOCS[docId]) || { title: 'Döküman', tagline: '', intro: '', sections: [], closing: '' };
  
  const [step, setStep] = useState(0);
  const [instantAll, setInstantAll] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setStep(0);
    const completed = JSON.parse(localStorage.getItem('sk_completed_docs') || '[]');
    setInstantAll(completed.includes(docId));
    window.scrollTo(0, 0);
  }, [docId]);

  const handleComplete = async () => {
    setLoading(true);
    const token = localStorage.getItem('sk_token');
    try {
      const res = await fetch('/api/docs/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doc_id: docId })
      });
      if (res.ok) {
        const completed = JSON.parse(localStorage.getItem('sk_completed_docs') || '[]');
        if (!completed.includes(docId)) {
          completed.push(docId);
          localStorage.setItem('sk_completed_docs', JSON.stringify(completed));
        }
        window.dispatchEvent(new Event('sk_user_update'));
      }
    } catch (e) {
      console.error('Döküman tamamlanamadı:', e);
    } finally {
      setLoading(false);
      navigate('pathway', pathwaySlug);
    }
  };

  const cards = [];
  cards.push({ key: 'intro', kind: 'intro', body: doc.intro });
  (doc.sections || []).forEach((s, i) => cards.push({ key: 'sec' + i, kind: 'prose', icon: s.icon, heading: s.h, body: (s.body || []).join('\n') }));
  cards.push({ key: 'closing', kind: 'closing', body: doc.closing });

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
          <button 
            disabled={loading}
            onClick={handleComplete} 
            className="mt-6 font-mono text-base font-bold text-[#021008] bg-[#00ff88] px-8 py-4 rounded-xl hover:shadow-[0_0_40px_-4px_var(--glow)] transition-all uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : '✅ Okundu Olarak İşaretle'}
          </button>
        )}
      </section>
    );
  };

  return (
    <>
      <AppHeader navigate={navigate} active="dashboard" />

      {/* Breadcrumb */}
      <div className="border-b border-[#0c2719] bg-[#04100a]">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <button onClick={() => navigate('dashboard')} className="text-[#74998a] hover:text-[#00ff88] transition-colors">← Dashboard</button>
            <span className="text-[#5c8a74]">/</span>
            <button onClick={() => navigate('pathway', pathwaySlug)} className="text-[#74998a] hover:text-[#00ff88] transition-colors">Öğrenme Yolu</button>
            <span className="text-[#5c8a74]">/</span>
            <span className="text-[#eafff5] font-mono">{doc.title}</span>
          </div>
          <span className="font-mono text-xs text-[#74998a]">{doc.readTime}</span>
        </div>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-[#0c2719]" style={{ background: 'radial-gradient(900px 380px at 20% -10%, rgba(0,255,136,.10), transparent 60%), linear-gradient(165deg,#07150e,#020806)' }}>
        <div className="grid-floor" style={{ opacity: .35 }}></div>
        <div className="relative max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="font-mono text-[11px] font-medium tracking-[.2em] uppercase text-[#00ff88] inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] sk-pulse"></span>
              <HeroGlowType text="// ÖĞRENME REHBERİ — TEORİK BRİFİNG" speed={8} instant={instantAll} />
            </span>
            <h1 className="text-[clamp(26px,4vw,42px)] font-disp font-bold text-[#eafff5] leading-tight mb-3 min-h-[46px]">
              <HeroGlowType text={doc.title} speed={15} instant={instantAll} />
            </h1>
            <p className="text-[#74998a] text-base md:text-lg leading-relaxed max-w-[640px]">
              <HeroGlowType text={doc.tagline} speed={18} instant={instantAll} />
            </p>
          </div>
          {!instantAll && (
            <button 
              onClick={() => setInstantAll(true)} 
              className="px-5 py-2.5 rounded-lg border border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,.04)] hover:bg-[rgba(0,255,136,.12)] text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0"
            >
              ⏩ Brifingin Tamamını Gör
            </button>
          )}
        </div>
      </div>

      {/* BODY */}
      <main className="max-w-[820px] mx-auto px-6 py-10 pb-28 space-y-6">
        {cards.map((c, i) => {
          const reveal = instantAll || i <= step;
          if (!reveal) return null;
          const isActive = !instantAll && i === step;

          const content = isActive
            ? <GlowType text={c.body} speed={isActive ? 20 : 0} onDone={advance} big={c.kind === 'intro'} />
            : <GlowType text={c.body} instant big={c.kind === 'intro'} />;
            
          return (
            <ArticleCard key={c.key} active={isActive} scroll={i > 0}>
              {renderProseCard(c, i, isActive, content)}
            </ArticleCard>
          );
        })}
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
  pathway: PathwayPage,
  admin: AdminPage,
  doc: DocPage,
});

/* ============ SHARED EXPORTS (for app-pages.jsx, separate babel scope) ============ */
Object.assign(window, { SKAppHeader: AppHeader, SKME: ME, SKSectionLabel: SectionLabel, SKuseUser: useUser });
