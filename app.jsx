const { useState, useRef, useEffect } = React;

/* ============ SCROLL REVEAL HOOK ============ */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    // Reveal = remove the JS-applied hidden state. Base CSS is already visible,
    // so any failure below still leaves content on screen.
    const reveal = (el) => el.classList.remove('reveal-hidden');

    if (!('IntersectionObserver' in window)) return; // stay visible, no anim

    // Apply the pre-animation hidden state via JS only.
    els.forEach((el) => el.classList.add('reveal-hidden'));

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {if (e.isIntersecting) {reveal(e.target);io.unobserve(e.target);}});
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });

    els.forEach((el) => io.observe(el));

    // Safety net: reveal anything still hidden shortly after mount.
    const fallback = setTimeout(() => els.forEach(reveal), 600);

    return () => {io.disconnect();clearTimeout(fallback);};
  });
}

/* ============ HEADER ============ */
/* ============ HEADER ============ */
const Header = ({ navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = [['Anasayfa', 'home'], ['Eğitim Programı', 'pricing'], ['Blog', 'blogs'], ['Hakkımızda', 'about'], ['İletişim', 'contact']];
  return (
    <header className="sticky top-0 z-50 bg-[rgba(2,8,6,.88)] backdrop-blur-md border-b border-[#0c2719]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between h-[72px]">
        <a href={getPagePath('home')} onClick={(e) => { e.preventDefault(); navigate('home'); }} className="flex items-center gap-3 font-disp font-bold text-xl text-[#eafff5] tracking-tight">
          <span className="w-[34px] h-[34px] border-[1.5px] border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-[15px] font-bold shadow-[0_0_18px_-4px_var(--glow),inset_0_0_12px_-6px_var(--glow)]">&gt;_</span>
          Siber Kampüs<b className="text-[#00ff88]">Akademi</b>
        </a>
        <nav className="hidden md:flex gap-9 items-center">
          {menuItems.map(([t, p]) => (
            <a key={p} href={getPagePath(p)} onClick={(e) => { e.preventDefault(); navigate(p); }} className="text-sm text-[#74998a] hover:text-[#cdeede] transition-colors relative group">
              {t}
              {p === 'pricing' && (
                <span className="absolute -top-5 -right-8 bg-[#00ff88] text-[#021008] text-[11px] font-black px-2 py-0.5 rounded-lg font-mono shadow-[0_0_12px_#00ff88]">
                  🔥 YENİ
                </span>
              )}
              <span className="absolute left-0 -bottom-2 h-[1.5px] w-0 bg-[#00ff88] group-hover:w-full transition-all duration-200"></span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          <a href={getPagePath('login')} onClick={(e) => { e.preventDefault(); navigate('login'); }} className="hidden sm:inline-flex font-mono text-sm text-[#cdeede] px-[18px] py-[11px] border border-[#103a26] bg-transparent hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Giriş Yap</a>
          <a href={getPagePath('pricing')} onClick={(e) => { e.preventDefault(); navigate('pricing'); }} className="hidden sm:inline-flex font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-[22px] py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] hover:-translate-y-px transition-all">Eğitime Başla</a>
          
          <button onClick={() => setMobileMenuOpen(o => !o)} aria-label="Mobil Menüyü Aç/Kapat" className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all">
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[#00ff88] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0c2719] bg-[#04100a] px-6 py-4 flex flex-col gap-4">
          {menuItems.map(([t, p]) => (
            <a key={p} href={getPagePath(p)} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate(p); }} className="text-left py-2 text-sm text-[#74998a] hover:text-[#00ff88] transition-colors flex items-center justify-between">
              <span>{t}</span>
              {p === 'pricing' && <span className="bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-[10px] font-bold px-1.5 py-0.5 rounded font-mono scale-90">Yeni Program</span>}
            </a>
          ))}
          <div className="h-px bg-[#0c2719] my-1"></div>
          <div className="flex gap-4">
            <a href={getPagePath('login')} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('login'); }} className="flex-1 text-center py-2.5 text-sm text-[#cdeede] border border-[#103a26] rounded">Giriş Yap</a>
            <a href={getPagePath('pricing')} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('pricing'); }} className="flex-1 text-center py-2.5 text-sm font-bold text-[#021008] bg-[#00ff88] rounded">Eğitime Başla</a>
          </div>
        </div>
      )}
    </header>
  );
};


/* ============ FOOTER ============ */
const Footer = ({ navigate }) =>
<footer className="bg-[#04100a] border-t border-[#0c2719] pt-16 pb-9">
    <div className="max-w-[1280px] mx-auto px-8">
      <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] gap-10 pb-12 border-b border-[#0c2719]">
        <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
          <a href={getPagePath('home')} onClick={(e) => { e.preventDefault(); navigate('home'); }} className="flex items-center gap-3 font-disp font-bold text-xl text-[#eafff5] whitespace-nowrap">
            <span className="w-[34px] h-[34px] border-[1.5px] border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-[15px] font-bold">&gt;_</span>
            Siber Kampüs<b className="text-[#00ff88]">Akademi</b>
          </a>
          <p className="text-[#74998a] text-sm mt-[18px] max-w-[300px] leading-relaxed">Birebir canlı eğitim ve gerçek saldırı senaryolarıyla Türkiye'nin siber güvenlik uzmanlarını yetiştiriyoruz.</p>
          <div className="mt-4 text-[11px] text-[#5c8a74] leading-relaxed">
            <p>Evliya Çelebi Mah. Şener Sok. No:11</p>
            <p>Tuzla/İstanbul</p>
            <p className="mt-1">destek@siberkampus.org</p>
            <p>0538 935 11 89</p>
          </div>
        </div>
        {[
      { h: 'Platform', items: [['Eğitim Programı', 'pricing'], ['Blog', 'blogs'], ['Hakkımızda', 'about'], ['İletişim', 'contact']] },
      { h: 'Kurumsal & Yasal', items: [['Hakkımızda', 'about'], ['İletişim', 'contact'], ['Kullanım Şartları', 'terms'], ['Gizlilik & KVKK', 'privacy'], ['İade ve İptal', 'refund-policy'], ['Teslimat Koşulları', 'delivery-policy']] },
      { h: 'Güvenlik Araçları I', items: [['Reverse Shell Oluşturucu', 'tools/reverse-shell'], ['Encoder/Decoder', 'tools/encoder-decoder'], ['Parola Güvenliği', 'tools/password-strength'], ['Subnet Hesaplayıcı', 'tools/subnet-calc'], ['Hash Oluşturucu & Tan', 'tools/hash-tool']] },
      { h: 'Güvenlik Araçları II', items: [['XSS Payload Oluşturucu', 'tools/xss-generator'], ['SQLi Payload Oluşturucu', 'tools/sqli-generator'], ['Cron Zamanlayıcı', 'tools/cron-explainer'], ['Base64 Dosya/Görsel', 'tools/base64-file'], ['DNS Güvenlik Sorgulama', 'tools/dns-lookup']] }].
      map((col, i) =>
      <div key={i}>
            <div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-[18px]">{col.h}</div>
            {col.items.map(([t, p], j) => {
              let hrefVal = '/';
              let navigatePage = 'home';
              let navigateData = null;
              if (p) {
                if (p.startsWith('tools/')) {
                  const slug = p.split('/')[1];
                  hrefVal = getPagePath('tools', { slug });
                  navigatePage = 'tools';
                  navigateData = { slug };
                } else {
                  hrefVal = getPagePath(p);
                  navigatePage = p;
                }
              }
              return (
                <a key={j} href={hrefVal} onClick={(e) => { e.preventDefault(); navigate(navigatePage, navigateData); }} className="block text-left text-[#74998a] text-sm py-1.5 hover:text-[#00ff88] transition-colors">{t}</a>
              );
            })}
          </div>
      )}
      </div>
      <div className="flex justify-between items-center pt-7 flex-wrap gap-4 border-t border-[#0c2719]/50 mt-6">
        <p className="text-[13px] text-[#5c8a74]">© 2026 Siber Kampüs Akademi — Tüm hakları saklıdır. | 💳 PCI-DSS 256-Bit Güvenli Ödeme Altyapısı</p>
        <img src="/visa-mastercard-troypng.png" alt="Visa, Mastercard, Troy" className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  </footer>;


/* ============ HOMEPAGE ============ */
const HomePage = ({ navigate }) => {
  const matrixRef = useRef(null);
  const sphereRef = useRef(null);
  const termRef = useRef(null);
  const statsRef = useRef(null);
  useReveal();

  const [onlineCount, setOnlineCount] = useState(250);
  const [totalUsers, setTotalUsers] = useState(12400);

  useEffect(() => {
    const fetchOnline = () => {
      fetch(`/api/users/online?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            setOnlineCount(data.length);
          }
        })
        .catch(() => {});
    };
    fetchOnline();
    const interval = setInterval(fetchOnline, 20000);

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.totalUsers) {
          setTotalUsers(data.totalUsers);
        }
      })
      .catch(() => {});

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let io;
    if (statsRef.current) {
      const nums = statsRef.current.querySelectorAll('[data-count]');
      io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target,end = +el.dataset.count,sx = el.dataset.suffix || '';
            let cur = 0;const step = end / 60;
            (function up() {
              cur += step;
              if (cur < end) {el.textContent = Math.floor(cur).toLocaleString('tr-TR') + sx;requestAnimationFrame(up);} else
              el.textContent = end.toLocaleString('tr-TR') + sx;
            })();
            io.unobserve(el);
          }
        });
      }, { threshold: .5 });
      nums.forEach((n) => io.observe(n));
    }
    return () => {
      if (io) io.disconnect();
    };
  }, [totalUsers]);

  useEffect(() => {
    const cleanups = [];

    /* ---- MATRIX RAIN ---- */
    if (matrixRef.current) {
      const cv = matrixRef.current,ctx = cv.getContext('2d'),hero = cv.parentElement;
      let cols, drops;const fs = 15;
      const chars = 'アカサタナハマヤラ0123456789ABCDEF<>{}#$%&*ANGRSU01'.split('');
      const size = () => {
        cv.width = hero.offsetWidth;cv.height = hero.offsetHeight;
        cols = Math.floor(cv.width / fs);
        drops = new Array(cols).fill(0).map(() => Math.random() * -50);
      };
      size();window.addEventListener('resize', size);
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let raf;
      const draw = () => {
        ctx.fillStyle = 'rgba(2,8,6,.10)';ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = fs + 'px JetBrains Mono, monospace';
        for (let i = 0; i < cols; i++) {
          const t = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fs,y = drops[i] * fs;
          ctx.fillStyle = Math.random() > .975 ? '#eafff5' : 'rgba(0,255,136,' + (Math.random() * .5 + .35) + ')';
          ctx.fillText(t, x, y);
          if (y > cv.height && Math.random() > .975) drops[i] = 0;
          drops[i] += 1;
        }
        raf = requestAnimationFrame(draw);
      };
      if (!reduce) draw();
      cleanups.push(() => {cancelAnimationFrame(raf);window.removeEventListener('resize', size);});
    }

    /* ---- WIREFRAME SPHERE ---- */
    if (sphereRef.current) {
      const cv = sphereRef.current,ctx = cv.getContext('2d');
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const size = () => {
        const r = cv.getBoundingClientRect();
        const w = Math.round(r.width * dpr);
        const h = Math.round(r.height * dpr);
        if (cv.width !== w || cv.height !== h) {
          cv.width = w;
          cv.height = h;
        }
      };
      size();window.addEventListener('resize', size);
      const N = 240,pts = [];const off = 2 / N,inc = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {const y = i * off - 1 + off / 2;const r = Math.sqrt(1 - y * y);const phi = i * inc;pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);}
      let a = 0,raf;const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const frame = () => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        const cx = cv.width / 2,cy = cv.height / 2,R = Math.min(cv.width, cv.height) * .40;
        a += reduce ? 0 : .0035;
        const ca = Math.cos(a),sa = Math.sin(a),cb = Math.cos(a * .6),sb = Math.sin(a * .6);
        const proj = pts.map((p) => {
          let [x, y, z] = p;
          let x1 = x * ca - z * sa,z1 = x * sa + z * ca;
          let y1 = y * cb - z1 * sb,z2 = y * sb + z1 * cb;
          const persp = 1.7 / (1.7 + z2);
          return { sx: cx + x1 * R * persp, sy: cy + y1 * R * persp, z: z2 };
        });
        for (let i = 0; i < proj.length; i++) for (let j = i + 1; j < proj.length; j++) {
          const dx = proj[i].sx - proj[j].sx,dy = proj[i].sy - proj[j].sy,d = dx * dx + dy * dy;
          if (d < 38 * dpr * (38 * dpr)) {
            const al = (1 - Math.sqrt(d) / (38 * dpr)) * .28 * ((proj[i].z + 1) / 2);
            ctx.strokeStyle = 'rgba(0,255,136,' + al + ')';ctx.lineWidth = dpr * .6;
            ctx.beginPath();ctx.moveTo(proj[i].sx, proj[i].sy);ctx.lineTo(proj[j].sx, proj[j].sy);ctx.stroke();
          }
        }
        proj.forEach((p) => {
          const depth = (p.z + 1) / 2;
          ctx.beginPath();ctx.arc(p.sx, p.sy, (1.1 + depth * 2) * dpr, 0, 7);
          ctx.fillStyle = 'rgba(' + (180 - depth * 180) + ',255,' + (180 + depth * 40) + ',' + (.35 + depth * .6) + ')';
          ctx.fill();
        });
        raf = requestAnimationFrame(frame);
      };
      frame();
      cleanups.push(() => {cancelAnimationFrame(raf);window.removeEventListener('resize', size);});
    }

    /* ---- TERMINAL TYPING ---- */
    if (termRef.current) {
      const el = termRef.current;el.innerHTML = '';
      const lines = [
      { t: '$ ', c: '#00ff88', x: 'nmap -sV hedef-sistem', d: 55 },
      { t: '', c: '#74998a', x: '  PORT     STATE  SERVICE', d: 8 },
      { t: '', c: '#74998a', x: '  22/tcp   open   ssh', d: 8 },
      { t: '', c: '#74998a', x: '  80/tcp   open   http', d: 8 },
      { t: '$ ', c: '#00ff88', x: 'guvenlik-tarama --web /login', d: 50 },
      { t: '', c: '#ffd166', x: '  [!] zafiyet tespit edildi: SQLi', d: 8 },
      { t: '', c: '#00ff88', x: '  [+] rapor olusturuldu', d: 8 },
      { t: '$ ', c: '#00ff88', x: 'mentor ile birebir oturum', d: 55 },
      { t: '', c: '#00ff88', x: '  [✓] egitim oturumu aktif', d: 8 },
      { t: '$ ', c: '#00ff88', x: '_', d: 0, cur: true }];

      let li = 0,stopped = false;
      const typeLine = () => {
        if (stopped || li >= lines.length) return;
        const L = lines[li];
        const div = document.createElement('div');
        const pre = document.createElement('span');pre.style.color = '#00ff88';pre.textContent = L.t;div.appendChild(pre);
        const span = document.createElement('span');span.style.color = L.c;div.appendChild(span);el.appendChild(div);
        if (L.cur) {const cu = document.createElement('span');cu.className = 'term-cursor';div.appendChild(cu);li++;return;}
        let i = 0;
        (function ch() {
          if (stopped) return;
          if (i <= L.x.length) {span.textContent = L.x.slice(0, i);i++;setTimeout(ch, L.d);} else
          {li++;setTimeout(typeLine, L.d > 20 ? 260 : 60);}
        })();
      };
      typeLine();
      cleanups.push(() => {stopped = true;});
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);



  const testimonials = [
  { text: "Üniversitede 4 yıl okudum ama ilk defa Siber Kampüs'te gerçek bir sisteme sızma testi yaptım. 3 ay sonra SOC analisti olarak işe başladım. Birebir eğitim olmasa bu kadar hızlı olmazdı.", name: 'Arda K.', role: 'SOC Analisti · eski öğrenci', av: 'AK' },
  { text: 'Muhasebeden geliyorum, kod bile bilmiyordum. Mentörüm adım adım gösterdi, her hafta gerçek senaryolar çözdük. Şimdi sızma testi uzmanı olarak çalışıyorum.', name: 'Melis Y.', role: 'Sızma Testi Uzmanı · kariyer değiştirdi', av: 'MY' },
  { text: "Birebir eğitimin farkı inanılmaz. Soru sorduğun anda cevap alıyorsun, takıldığın yerde mentörün ekranı paylaşıp gösteriyor. Online kurslarla kıyaslanamaz.", name: 'Emre Ç.', role: 'Bilgisayar Müh. öğrencisi', av: 'EÇ' }];


  return (
    <>
      <Header navigate={navigate} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#0c2719]">
        <canvas ref={matrixRef} className="absolute inset-0 w-full h-full z-0 opacity-[.32]"></canvas>
        <div className="grid-floor"></div>
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[900px] h-[560px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.16),transparent 62%)' }}></div>

        <div className="max-w-[1280px] mx-auto px-8 relative z-[2] grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-14 items-center pt-24 pb-[104px]">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[12.5px] tracking-[.12em] uppercase text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-3.5 py-[7px] rounded-full mb-[26px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] sk-pulse"></span>
              Birebir siber güvenlik eğitimi
            </span>
            <h1 className="text-[clamp(40px,6vw,78px)] text-[#eafff5] mb-[18px] tracking-[-.025em]">
              <span className="glitch" data-text="Siber Güvenlik">Siber Güvenlik</span><br /><span className="text-[clamp(20px,3vw,38px)] text-[#00ff88]">Uzmanı Ol, Sektörde Yerini Al</span>
            </h1>
            <div className="text-[15.5px] text-[#74998a] max-w-[560px] mb-8 leading-[1.8] space-y-[13px]">
              <p className="text-[#cdeede] text-[16px]">Siber güvenlikte "level" atlamaya hazır mısın?</p>
              <p>Sıkıcı teorilerle vakit kaybetmek yerine seni <strong className="text-[#00ff88]">doğrudan aksiyonun içine çeken</strong>, <strong className="text-[#cdeede] font-medium">tamamen uygulamalı</strong> bir eğitim platformu.</p>
              <p>Kurulumlarla veya ağır sanal makinelerle uğraşmadan <strong className="text-[#cdeede] font-medium">sadece tarayıcını açarak</strong> anında gerçek saldırı ve savunma laboratuvarlarına bağlanabilirsin. Web zafiyetlerinden ağ trafiğine, zararlı yazılımlardan dijital adli bilişime kadar her şeyi <strong className="text-[#00ff88]">bizzat sistemlere sızarak</strong> öğreneceksin.</p>
              <p>Siber güvenlik sektöründe şirketlerin peşinden koştuğu <strong className="text-[#00ff88]">aranan bir profesyonele dönüş.</strong></p>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <button onClick={() => navigate('pricing')} className="font-mono text-[15px] font-bold text-[#021008] bg-[#00ff88] px-[30px] py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] hover:-translate-y-px transition-all">Eğitim Programını İncele →</button>
              <button onClick={() => navigate('level-test')} className="font-mono text-[15px] text-[#5cffba] px-[30px] py-4 border border-[#103a26] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Seviyeni Test Et</button>
            </div>
            <div className="flex items-center gap-3.5 mt-[26px] text-[13px] text-[#5c8a74]">
              <div className="flex">
                {['AK', 'MY', 'EÇ', '+9'].map((a, i) =>
                <span key={i} className={"w-[30px] h-[30px] rounded-full border-[1.5px] border-[#020806] grid place-items-center text-[11px] font-bold text-[#5cffba] " + (i ? '-ml-2 ' : '')} style={{ background: 'linear-gradient(135deg,#0a3a24,#063018)' }}>{a}</span>
                )}
              </div>
              <span>{totalUsers}+ mezun siber güvenlik kariyerine başladı</span>
            </div>
          </div>

          {/* TERMINAL */}
          <div className="rounded-xl overflow-hidden border border-[#103a26] text-[13.5px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.9),0_0_60px_-20px_var(--glow)]" style={{ background: 'linear-gradient(160deg,#06140d,#040d08)' }}>
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-[#0c2719] bg-black/25">
              <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]"></span>
              <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]"></span>
              <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]"></span>
              <span className="ml-2 text-xs text-[#5c8a74]">root@siberkampus: ~/pentest-session</span>
            </div>
            <div ref={termRef} className="p-[18px] min-h-[240px] leading-[1.85] font-mono" style={{ letterSpacing: "1px", height: "340px", padding: "12px" }}></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} className="border-b border-[#0c2719]" style={{ background: 'linear-gradient(180deg,#04100a,#020806)' }}>
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4">
          {[
          { c: 1227, s: '+', l: 'Eğitim Alan Öğrenci' },
          { c: 10000, s: '+', l: 'Saat Canlı Eğitim' },
          { c: 98, s: '+', l: 'Saldırı Senaryosu' },
          { c: 96, s: '%', l: 'Öğrenci Memnuniyeti' }].
          map((st, i) =>
          <div key={i} className={"py-11 px-7 text-center " + (i ? 'border-l border-[#0c2719]' : '')}>
              <div key={st.c} data-count={st.c} data-suffix={st.s} className="font-disp font-bold text-[clamp(32px,4vw,52px)] text-[#00ff88] tracking-[-.02em] drop-shadow-[0_0_26px_rgba(0,255,136,.3)]">0</div>
              <div className="text-[13px] text-[#74998a] mt-2 tracking-wide">{st.l}</div>
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg,#020806,#04100a)' }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center max-w-[540px] mx-auto mb-12 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Eğitim Formatı</span>
            <h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5] mt-4">Nasıl işleniyor?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
            {[
              { n: '01', title: 'Sisteme Dahil Ol', desc: 'Paketini seç, hesabını aktifleştir ve serüveni başlat. Deneyimli mentörün seninle hemen iletişime geçer.' },
              { n: '02', title: 'Strateji Belirleme', desc: 'Mentörün kariyer hedeflerini dinler, seviyeni analiz eder ve tamamen sana özel yol haritasını kurgular.' },
              { n: '03', title: 'Simülasyon Hazırlanır', desc: 'O derse özel saldırı odası ve laboratuvar ortamın saniyeler içinde ayağa kaldırılır.' },
              { n: '04', title: 'Omuz Omuza Uzmanlaş', desc: 'Mentörünle bire bir canlı görüşme başlar, gerçek saldırı/savunma senaryolarıyla uzmanlaşırsın.' },
            ].map((s, i) => (
              <div key={i} className="reveal relative border border-[#0c2719] rounded-2xl p-6" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <span className="font-mono text-[11px] text-[#5c8a74] mb-4 block">{s.n}</span>
                <h3 className="text-[16px] text-[#00ff88] mb-3">{s.title}</h3>
                <p className="text-[13px] text-[#74998a] leading-[1.7]">{s.desc}</p>
                {i < 3 && <span className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-[#103a26] text-xl font-bold z-10">›</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENARIOS */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center max-w-[580px] mx-auto mb-12 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Örnek Ders Konuları</span>
            <h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5] mt-4">Saldırı Senaryoları</h2>
            <p className="text-[#74998a] mt-3 text-[14px]">Her ders, gerçek bir saldırı senaryosu üzerine kurulur. Mentörünle birlikte kontrollü lab ortamında bizzat uygularsın.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {[
              { tag: 'Sosyal Medya', title: 'Sosyal Medya Pentest', desc: 'Instagram ve benzeri platformlara yönelik kimlik doğrulama açıklarını simülasyon ortamında incelersin.', accent: '#ffd166' },
              { tag: 'Web Uygulaması', title: 'SQL Injection & XSS', desc: 'Gerçekçi bir hedef web uygulamasında SQL injection, XSS ve IDOR zafiyetlerini tespit edip sömürürsün.', accent: '#00ff88' },
              { tag: 'Sosyal Mühendislik', title: 'Phishing & Pretexting', desc: 'Phishing kampanyası hazırlama, pretexting senaryoları ve insan faktörü temelli saldırı teknikleri.', accent: '#a78bfa' },
              { tag: 'Ağ Güvenliği', title: 'Ağ Sızma Testi', desc: 'Nmap ile port tarama, servis tespiti ve izole ağ ortamında sızma testi metodolojisi.', accent: '#00ff88' },
              { tag: 'API Güvenliği', title: 'Token & Auth Bypass', desc: 'JWT token manipülasyonu, yetkilendirme bypass teknikleri ve API uç nokta güvenliği.', accent: '#ffd166' },
              { tag: 'E-posta Güvenliği', title: 'Kimlik Avı Analizi', desc: 'Phishing e-postalarını analiz etme, başlık inceleme ve sosyal mühendislik göstergelerini tespit etme.', accent: '#a78bfa' },
            ].map((sc, i) => (
              <div key={i} className="reveal group border border-[#0c2719] rounded-2xl p-6 hover:border-[#103a26] hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] text-[#5c8a74] border border-[#0c2719] px-2.5 py-1 rounded-full">{sc.tag}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: sc.accent }}></span>
                </div>
                <h3 className="text-[16px] text-[#eafff5] mb-2">{sc.title}</h3>
                <p className="text-[13px] text-[#74998a] leading-[1.65]">{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* OUTCOMES */}
      <section className="py-20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center max-w-[560px] mx-auto mb-12 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Eğitim Çıktıları</span>
            <h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5] mt-4">Eğitim sonunda ne kazanırsın?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {[
              { icon: '◎', title: 'Sektör Sertifikası', desc: 'Siber Kampüs onaylı, iş başvurularında ve LinkedIn profilinde kullanabileceğin dijital sertifika.' },
              { icon: '⊞', title: 'Gerçek Senaryo Portföyü', desc: 'Sızma testi raporları, zafiyet analizleri ve uygulama çıktılarından derlenen somut portföy.' },
              { icon: '⟁', title: 'Mentör Referansı', desc: 'Birlikte çalıştığın güvenlik uzmanından, iş başvurularında fark yaratacak kişisel referans mektubu.' },
              { icon: '⬡', title: 'VIP Kaynak Arşivi', desc: 'Eğitim süresince ve sonrasında erişebileceğin teknik dökümanlar, saldırı rehberleri ve vaka incelemeleri.' },
              { icon: '◈', title: 'Pratik Yetkinlik', desc: 'Gerçek sistemlerde deneyim kazanarak sektörde güvenle iş yapabilecek seviyeye ulaşırsın.' },
              { icon: '⌖', title: 'CV & Mülakat Desteği', desc: 'Siber güvenlik CV\'ni hazırlamana, teknik mülakatlara hazırlanmana ve kariyer yolunu planlamana destek.' },
            ].map((item, i) => (
              <div key={i} className="reveal border border-[#0c2719] rounded-2xl p-6 hover:border-[#103a26] hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="text-[#00ff88] text-xl mb-3">{item.icon}</div>
                <h3 className="text-[15px] text-[#eafff5] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[#74998a] leading-[1.65]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-[108px]" style={{ background: 'linear-gradient(180deg,#020806,#04100a)' }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-12 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Öğrenci Deneyimleri</span>
            <h2 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] mt-4">Kariyerini Değiştirenler Ne Diyor?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {testimonials.map((q, i) =>
            <div key={i} className="reveal bg-[#07150e] border border-[#0c2719] rounded-2xl p-[30px]">
                <div className="font-disp text-[54px] leading-[.4] text-[#00ff88] opacity-35 h-[26px]">”</div>
                <p className="text-[14.5px] text-[#cdeede] leading-[1.75] my-[14px] mb-[22px]">{q.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full grid place-items-center text-[#5cffba] font-bold text-[15px] border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{q.av}</div>
                  <div>
                    <div className="text-sm text-[#eafff5] font-medium">{q.name}</div>
                    <div className="text-xs text-[#74998a]">{q.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden border-y border-[#0c2719]">
        <div className="grid-floor !opacity-50" style={{ animation: 'none' }}></div>
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[900px] h-[560px] z-0 pointer-events-none opacity-70" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.16),transparent 62%)' }}></div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-[2] text-center py-24 reveal">
          <h2 className="text-[clamp(32px,5vw,56px)] text-[#eafff5] mb-[18px]">Siber Güvenlik <em className="not-italic text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,.4)]">Uzmanı Ol.</em></h2>
          <p className="text-[#74998a] max-w-[520px] mx-auto mb-[34px] text-[15.5px]">Gerçek saldırı senaryolarını kontrollü lab ortamında, uzman mentör eşliğinde bizzat uygula.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('pricing')} className="font-mono text-[15px] font-bold text-[#021008] bg-[#00ff88] px-[30px] py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Eğitime Başla →</button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>);

};

/* ============ BLOG LIST ============ */
const BlogListPage = ({ navigate }) => {
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useReveal();

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  const filtered = blogs.filter((b) => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header navigate={navigate} />
      <section className="py-20 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.10),transparent 62%)' }}></div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-[2]">
          <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Blog</span>
          <h1 className="text-[clamp(36px,5vw,56px)] text-[#eafff5] my-5">Siber Güvenlik Makaleleri</h1>
          <p className="text-[#74998a] max-w-[600px] mb-10">Defansif güvenlik, sızma testi ve siber güvenliğin derinlerine inen yazılar. Alanında uzmanlar tarafından kaleme alınmış en güncel içerikler.</p>
          <div className="relative max-w-[480px]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Makale veya kategori ara..." className="w-full bg-[#07150e] border border-[#103a26] rounded-lg pl-4 pr-10 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors font-mono text-sm" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c8a74]">⌕</span>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 grid gap-5">
          {loading ? (
            <div className="py-20 text-center text-[#74998a]">Makaleler yükleniyor...</div>
          ) : (
            filtered.map((b) =>
              <article key={b.id} onClick={() => navigate('blog-detail', b)} className="reveal group cursor-pointer border border-[#0c2719] rounded-xl p-8 hover:border-[#00ff88] hover:-translate-y-1 transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{b.category}</span>
                  <span className="text-xs text-[#5c8a74]">{b.readTime}</span>
                </div>
                <h2 className="text-2xl text-[#eafff5] mb-3 group-hover:text-[#00ff88] transition-colors">{b.title}</h2>
                <p className="text-[#74998a] mb-6 text-[15px]">{b.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-[#5c8a74]">
                  <div className="flex items-center gap-3"><span>{b.author}</span><span>•</span><span>{b.date}</span></div>
                  <span className="group-hover:text-[#00ff88] transition-colors">Oku →</span>
                </div>
              </article>
            )
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-[#74998a] py-10">Sonuç bulunamadı.</p>}
        </div>
      </section>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ BLOG DETAIL ============ */
const BlogDetailPage = ({ blog, navigate }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  useReveal();

  useEffect(() => {
    if (blog && blog.slug) {
      setLoading(true);
      fetch(`/api/blogs/${blog.slug}`)
        .then(res => {
          if (!res.ok) throw new Error("Blog not found");
          return res.json();
        })
        .then(data => {
          setDetail(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching blog details:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [blog]);

  useEffect(() => {
    if (blog) {
      fetch('/api/blogs')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const filtered = data
              .filter(b => b.slug !== blog.slug)
              .slice(0, 2);
            setRelated(filtered);
          }
        })
        .catch(err => console.error("Error fetching related blogs:", err));
    }
  }, [blog]);

  if (!blog) return <><Header navigate={navigate} /><div className="py-32 text-center text-[#74998a]">Makale bulunamadı.</div><Footer navigate={navigate} /></>;

  if (loading) {
    return (
      <>
        <Header navigate={navigate} />
        <div className="py-32 text-center text-[#74998a]">
          <div className="w-10 h-10 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Makale yükleniyor...
        </div>
        <Footer navigate={navigate} />
      </>
    );
  }

  const displayBlog = detail || blog;

  return (
    <>
      <Header navigate={navigate} />
      <article className="py-20">
        <div className="max-w-[760px] mx-auto px-8">
          <button onClick={() => navigate('blogs')} className="text-[#00ff88] hover:text-[#5cffba] transition-colors text-sm mb-8">← Tüm Makalelere Dön</button>
          <header className="mb-12">
            <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{displayBlog.category}</span>
            <h1 className="text-[clamp(32px,5vw,52px)] text-[#eafff5] my-6">{displayBlog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[#74998a]"><span>{displayBlog.author}</span><span>•</span><span>{displayBlog.date}</span><span>•</span><span>{displayBlog.readTime}</span></div>
          </header>
          <div className="space-y-6">
            <p className="text-[#cdeede] text-lg leading-relaxed">{displayBlog.excerpt}</p>
            <div className="border border-[#103a26] rounded-lg p-6 bg-[#07150e] font-mono text-sm text-[#5cffba] leading-relaxed">
              // Bu konuyu birebir eğitimlerimizde uygulamalı olarak işliyoruz.<br />// Daha derine inmek için eğitmenimizle çalışmaya başlayabilirsin.
            </div>
            {loading ? (
              <div className="py-10 text-center text-[#74998a]">İçerik yükleniyor...</div>
            ) : displayBlog.content ? (
              <div className="blog-content text-[#b8d5c8] leading-relaxed text-[16px]" dangerouslySetInnerHTML={{ __html: displayBlog.content }}></div>
            ) : (
              <p className="text-[#74998a] leading-relaxed">Bu makalenin detay içeriği bulunmamaktadır.</p>
            )}
          </div>
          <div className="border-t border-[#0c2719] mt-14 pt-12">
            <h2 className="text-2xl text-[#eafff5] mb-8">İlgili Makaleler</h2>
            <div className="grid gap-4">
              {related.map((p) =>
                <div key={p.id} onClick={() => navigate('blog-detail', p)} className="cursor-pointer group bg-[#07150e] border border-[#0c2719] rounded-lg p-6 hover:border-[#00ff88] hover:bg-[#0a1d13] transition-all">
                  <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{p.category}</span>
                  <h3 className="text-lg text-[#eafff5] my-3 group-hover:text-[#00ff88] transition-colors">{p.title}</h3>
                  <span className="text-xs text-[#5c8a74] group-hover:text-[#00ff88] transition-colors">Oku →</span>
                </div>
              )}
              {related.length === 0 && <p className="text-[#74998a] text-sm">İlgili başka makale bulunamadı.</p>}
            </div>
          </div>
          <div className="mt-12 rounded-xl border border-[#103a26] p-10 text-center" style={{ background: 'linear-gradient(90deg,#07150e,#04100a)' }}>
            <h2 className="text-2xl text-[#eafff5] mb-4">Bu Konuyu Pratik Yapmak İster misin?</h2>
            <p className="text-[#74998a] mb-6 max-w-[520px] mx-auto">Bu makaledeki teknikleri bir eğitmenle birebir, gerçek senaryolar üzerinde uygulamalı öğrenmek ister misin? Eğitim programımıza göz at.</p>
            <button onClick={() => navigate('pricing')} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-7 py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Eğitim Programını Gör →</button>
          </div>
        </div>
      </article>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ ROOMS ============ */
const RoomsPage = ({ navigate }) => {
  const [selected, setSelected] = useState(null);
  useReveal();
  
  // Gerçek sistemdeki odaları karışık sırada göster
  const allRooms = (window.SK_ALL_ROOMS || []).map(r => ({ ...r }));
  const shuffled = [...allRooms].sort(() => Math.random() - 0.5);

  const dc = { 'Başlangıç': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Kolay': 'text-[#5cffba] bg-[rgba(92,255,186,.1)]', 'Orta': 'text-[#ffd166] bg-[rgba(255,209,102,.1)]', 'İleri': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Zor': 'text-[#ff8c42] bg-[rgba(255,140,66,.1)]', 'Uzman': 'text-[#ff2e88] bg-[rgba(255,46,136,.1)]' };
  return (
    <>
      <Header navigate={navigate} />
      <section className="py-20 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.10),transparent 62%)' }}></div>
        <div className="max-w-[1280px] mx-auto px-8 relative z-[2]">
          <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Laboratuvarlar</span>
          <h1 className="text-[clamp(36px,5vw,56px)] text-[#eafff5] my-5">Siber Güvenlik Laboratuvarları</h1>
          <p className="text-[#74998a] max-w-[600px]">{allRooms.length} adet uygulamalı laboratuvarla sıfırdan uzman seviyesine kadar çıkmanı sağlayacak CTF görevleri. Kayıt ol ve hemen başla!</p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {shuffled.map((r) =>
          <div key={r.id} onClick={() => setSelected(r)} className="reveal group cursor-pointer border border-[#0c2719] rounded-xl p-8 hover:border-[#00ff88] hover:shadow-[0_24px_50px_-28px_rgba(0,255,136,.35)] transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2"><span className="font-mono text-xs text-[#5c8a74]">{r.id.toUpperCase()}</span><span className="text-xs text-[#5c8a74]">·</span><span className="text-xs text-[#5c8a74]">{r.cat}</span></div>
                  <h2 className="text-xl text-[#eafff5] group-hover:text-[#00ff88] transition-colors mb-2">{r.name}</h2>
                  <p className="text-sm text-[#74998a]">{r.desc}</p>
                </div>
                <span className={"text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap " + (dc[r.difficulty] || dc['Orta'])}>{r.difficulty}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#0c2719] text-xs text-[#5c8a74]">
                <span>◆ {r.points} puan</span>
                <span className="group-hover:text-[#00ff88] transition-colors">Detay →</span>
              </div>
            </div>
          )}
        </div>
      </section>
      {selected &&
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={() => setSelected(null)}>
          <div className="border border-[#103a26] rounded-xl max-w-[520px] w-full p-10 shadow-[0_0_60px_-20px_var(--glow)]" style={{ background: '#020806' }} onClick={(e) => e.stopPropagation()}>
            <span className="font-mono text-xs text-[#5c8a74]">{selected.id.toUpperCase()} · {selected.cat}</span>
            <h2 className="text-3xl text-[#eafff5] mt-2 mb-4">{selected.name}</h2>
            <p className="text-[#74998a] mb-6">{selected.desc}</p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-4 bg-[#07150e] border border-[#0c2719] rounded-lg"><span className="text-sm text-[#74998a]">Zorluk Seviyesi</span><span className={"font-bold text-sm px-3 py-1 rounded " + (dc[selected.difficulty] || dc['Orta'])}>{selected.difficulty}</span></div>
              <div className="flex items-center justify-between p-4 bg-[#07150e] border border-[#0c2719] rounded-lg"><span className="text-sm text-[#74998a]">Kazanılacak Puan</span><span className="font-bold text-[#00ff88]">◆ {selected.points}</span></div>
              <div className="flex items-center justify-between p-4 bg-[#07150e] border border-[#0c2719] rounded-lg"><span className="text-sm text-[#74998a]">Kategori</span><span className="font-bold text-[#eafff5]">{selected.cat}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('register')} className="flex-1 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Kayıt Ol & Başla</button>
              <button onClick={() => setSelected(null)} className="flex-1 border border-[#103a26] text-[#cdeede] py-3 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors text-sm">Kapat</button>
            </div>
          </div>
        </div>
      }
      <Footer navigate={navigate} />
    </>);

};

/* ============ AUTH SHARED ============ */
const AuthShell = ({ children }) => (
  <section className="min-h-[calc(100vh-72px)] flex items-center justify-center py-20 px-4 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.08),transparent 62%)' }}></div>
    <div className="w-full max-w-[420px] relative z-[2]">{children}</div>
  </section>
);

const Field = ({ label, hint, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-[#cdeede] mb-2">{label}</label>
    <input {...props} className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors font-mono text-sm" />
    {hint && <p className="text-xs text-[#5c8a74] mt-2">{hint}</p>}
  </div>
);

/* ============ LOGIN ============ */
const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (userEmail, userPassword) => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, pw: userPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Giriş yapılamadı.');
      }
      
      // Eski kullanıcının tüm verilerini temizle
      localStorage.removeItem('sk_solved_rooms');
      localStorage.removeItem('sk_room_progress');
      localStorage.removeItem('sk_unlocked_hints');
      window.__SK_USER_FETCHED = false;
      
      localStorage.setItem('sk_token', data.token);
      localStorage.setItem('sk_user_name', data.user.name);
      localStorage.setItem('sk_user_points', data.user.points);
      localStorage.setItem('sk_user_solved', data.user.solved_count);
      localStorage.setItem('sk_user_level', data.user.level);
      localStorage.setItem('sk_user_rank', data.user.rank_val);
      localStorage.setItem('sk_user_badges', data.user.badges !== undefined ? data.user.badges : 0);
      localStorage.setItem('sk_user_streak', data.user.streak !== undefined ? data.user.streak : 1);
      localStorage.setItem('sk_name_changed', data.user.name_changed ? '1' : '0');
      localStorage.setItem('sk_user_is_admin', data.user.is_admin ? 'true' : 'false');
      localStorage.setItem('sk_user_is_banned', data.user.is_banned ? 'true' : 'false');
      
      window.dispatchEvent(new Event('sk_user_update'));
      navigate('dashboard');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pw) {
      setErr('Tüm alanları doldurunuz.');
      return;
    }
    handleLogin(email, pw);
  };

  return (
    <><Header navigate={navigate} />
      <AuthShell>
        <div className="text-center mb-10">
          <span className="w-[52px] h-[52px] border-[1.5px] border-[#00ff88] rounded-xl grid place-items-center text-[#00ff88] font-mono text-lg font-bold mx-auto mb-5 shadow-[0_0_24px_-4px_var(--glow)]">&gt;_</span>
          <h1 className="text-4xl text-[#eafff5] mb-2">VIP Üye Girişi</h1>
          <p className="text-[#74998a] text-sm">Eğitim paketi sahibi VIP üyeler için giriş ekranı</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          {err && <div className="bg-[rgba(255,46,136,.08)] border border-[#ff2e88]/50 rounded-lg p-3.5"><p className="text-sm text-[#ff2e88]">{err}</p></div>}
          <Field label="E-posta Adresi" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seni@example.com" disabled={loading} />
          <Field label="Şifre" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" disabled={loading} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#74998a]"><input type="checkbox" className="w-4 h-4 accent-[#00ff88]" /> Beni hatırla</label>
            <a href="#" className="text-[#00ff88] hover:text-[#5cffba] transition-colors">Şifremi Unuttum?</a>
          </div>
          <button type="submit" disabled={loading} className="w-full font-mono font-bold text-[#021008] bg-[#00ff88] py-3 rounded-lg hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all disabled:opacity-50">
            {loading ? 'Lütfen bekleyin...' : 'Giriş Yap'}
          </button>
        </form>
        <p className="text-center text-[#74998a] text-sm mt-7">Henüz VIP üye değil misin? <button onClick={() => navigate('pricing')} className="text-[#00ff88] hover:text-[#5cffba] transition-colors font-medium">Eğitim Paketlerini İncele</button></p>
      </AuthShell>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ REGISTER ============ */
const RegisterPage = ({ navigate, data }) => {
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '', terms: false });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const ch = (e) => {const { name, value, type, checked } = e.target;setF((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));};
  
  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.pw || !f.pw2) return setErr('Tüm alanları doldurunuz.');
    if (f.pw !== f.pw2) return setErr('Şifreler eşleşmiyor.');
    if (f.pw.length < 8) return setErr('Şifre en az 8 karakter olmalıdır.');
    if (!f.terms) return setErr('Şartları ve koşulları kabul etmelisiniz.');
    
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, pw: f.pw })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Kayıt olunamadı.');
      }
      
      // Yeni hesap — eski verileri temizle
      localStorage.removeItem('sk_solved_rooms');
      localStorage.removeItem('sk_room_progress');
      localStorage.removeItem('sk_unlocked_hints');
      window.__SK_USER_FETCHED = false;
      
      localStorage.setItem('sk_token', data.token);
      localStorage.setItem('sk_user_name', data.user.name);
      localStorage.setItem('sk_user_points', data.user.points);
      localStorage.setItem('sk_user_solved', data.user.solved_count);
      localStorage.setItem('sk_user_level', data.user.level);
      localStorage.setItem('sk_user_rank', data.user.rank_val);
      localStorage.setItem('sk_user_badges', data.user.badges !== undefined ? data.user.badges : 0);
      localStorage.setItem('sk_user_streak', data.user.streak !== undefined ? data.user.streak : 1);
      localStorage.setItem('sk_name_changed', '0');
      localStorage.setItem('sk_user_is_admin', data.user.is_admin ? 'true' : 'false');
      localStorage.setItem('sk_user_is_banned', data.user.is_banned ? 'true' : 'false');
      
      window.dispatchEvent(new Event('sk_user_update'));
      navigate('dashboard');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Header navigate={navigate} />
      <AuthShell>
        <div className="text-center mb-10">
          <span className="w-[52px] h-[52px] border-[1.5px] border-[#00ff88] rounded-xl grid place-items-center text-[#00ff88] font-mono text-lg font-bold mx-auto mb-5 shadow-[0_0_24px_-4px_var(--glow)]">&gt;_</span>
          <h1 className="text-4xl text-[#eafff5] mb-2">Kayıt Ol</h1>
          <p className="text-[#74998a] text-sm">Siber Kampüs Akademi'ye katıl ve siber güvenlik uzmanı ol</p>
        </div>
        {(data && data.fromFreeBasic || window.__SK_REGISTER_INFO) && (
          <div className="bg-[rgba(0,255,136,.06)] border border-[#00ff88]/30 rounded-xl p-4 mb-6 text-center text-sm text-[#00ff88] font-mono leading-relaxed shadow-[0_0_15px_rgba(0,255,136,0.05)] animate-pulse">
            🚀 <strong>{window.__SK_REGISTER_INFO || 'Kayıt olarak platformdaki ücretsiz eğitimlere erişebilirsiniz!'}</strong>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          {err && <div className="bg-[rgba(255,46,136,.08)] border border-[#ff2e88]/50 rounded-lg p-3.5"><p className="text-sm text-[#ff2e88]">{err}</p></div>}
          <Field label="Ad Soyad" type="text" name="name" value={f.name} onChange={ch} placeholder="Adını Gir" disabled={loading} />
          <Field label="E-posta Adresi" type="email" name="email" value={f.email} onChange={ch} placeholder="seni@example.com" disabled={loading} />
          <Field label="Şifre" type="password" name="pw" value={f.pw} onChange={ch} placeholder="••••••••" hint="En az 8 karakter" disabled={loading} />
          <Field label="Şifreyi Onayla" type="password" name="pw2" value={f.pw2} onChange={ch} placeholder="••••••••" disabled={loading} />
          <label className="flex items-start gap-3"><input type="checkbox" name="terms" checked={f.terms} onChange={ch} className="w-4 h-4 accent-[#00ff88] mt-1" disabled={loading} /><span className="text-xs text-[#74998a]"><button type="button" onClick={() => navigate('terms')} className="text-[#00ff88] hover:text-[#5cffba]">Kullanım Şartları</button> ve <button type="button" onClick={() => navigate('privacy')} className="text-[#00ff88] hover:text-[#5cffba]">Gizlilik Politikası</button>'nı kabul ediyorum.</span></label>
          <button type="submit" disabled={loading} className="w-full font-mono font-bold text-[#021008] bg-[#00ff88] py-3 rounded-lg hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all disabled:opacity-50">
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>
        <p className="text-center text-[#74998a] text-sm mt-7">Zaten hesabın var mı? <button onClick={() => navigate('login')} className="text-[#00ff88] hover:text-[#5cffba] transition-colors font-medium">Giriş Yap</button></p>
      </AuthShell>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ SHARED EXPORTS (for app-auth.jsx, separate babel scope) ============ */
Object.assign(window, { SKHeader: Header, SKFooter: Footer, SKAuthShell: AuthShell, SKField: Field, SKuseReveal: useReveal });

/* ============ PAGE REGISTRY ============ */
// Marketing pages register here; authenticated pages (app-auth.jsx) add themselves
// to the same global registry so the router can resolve them after load.
const PAGES = window.__SK_PAGES = window.__SK_PAGES || {};
Object.assign(PAGES, {
  home: HomePage,
  blogs: BlogListPage,
  'blog-detail': BlogDetailPage,
  rooms: RoomsPage,
  login: LoginPage,
  register: RegisterPage,
  product: window.SKProductDetailPage || (() => null)
});

/* ============ WHATSAPP İLETİŞİM BUTONU ============ */
const WhatsAppButton = () => {
  const phone = '905389351189';
  const msg = encodeURIComponent('Merhaba Siber Kampüs Eğitimi Bire Bir eğitim için bilgi almak istiyorum');
  const href = `https://wa.me/${phone}?text=${msg}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 group"
    >
      <span className="hidden sm:block bg-[#04100a] border border-[#103a26] text-[#cdeede] text-sm font-mono px-4 py-2 rounded-full shadow-[0_10px_30px_-10px_#000] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap">
        Birebir eğitim için yazın →
      </span>
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,.6)] hover:scale-105 transition-transform">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white relative z-10" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.943-5.359 11.946-11.893a11.821 11.821 0 00-3.48-8.45z" />
        </svg>
      </span>
    </a>
  );
};

/* ============ APP ROOT ============ */
const pageTitles = {
  home: "Siber Kampüs Akademi | Siber Güvenlik Eğitimi",
  about: "Hakkımızda | Siber Kampüs Akademi",
  contact: "İletişim | Siber Kampüs Akademi",
  blogs: "Blog | Siber Kampüs Akademi — Güncel Siber Güvenlik Makaleleri",
  'blog-detail': "Blog Detay | Siber Kampüs Akademi",
  rooms: "Siber Güvenlik Laboratuvarları | Siber Kampüs Akademi",
  login: "Giriş Yap | Siber Kampüs Akademi",
  register: "Kayıt Ol | Siber Kampüs Akademi",
  dashboard: "Kontrol Paneli | Siber Kampüs Akademi",
  chat: "Siber Güvenlik Soru Cevap & Sohbet | Siber Kampüs Akademi",
  leaderboard: "Liderlik Sıralaması | Siber Kampüs Akademi",
  admin: "Yönetim Paneli | Siber Kampüs Akademi",
  category: "Kategori | Siber Kampüs Akademi",
  roomArticle: "Ders Brifingi | Siber Kampüs Akademi",
  profile: "Profilim | Siber Kampüs Akademi",
  terms: "Kullanım Şartları & Mesafeli Satış Sözleşmesi | Siber Kampüs Akademi",
  privacy: "Gizlilik Politikası & KVKK | Siber Kampüs Akademi",
  'delivery-policy': "Teslimat Koşulları | Siber Kampüs Akademi",
  tools: "Siber Güvenlik Araçları & Hesaplayıcılar | Siber Kampüs Akademi",
  pricing: "Eğitim Paketleri & Fiyatlandırma | Siber Kampüs Akademi",
  product: "Eğitim Detayı & Satın Al | Siber Kampüs Akademi",
  'refund-policy': "İade ve İptal Koşulları | Siber Kampüs Akademi",
};

const updateSEOMeta = (p, d) => {
  let title = "Siber Kampüs Akademi | Siber Güvenlik Eğitimi";
  let desc = "Siber Kampüs Akademi ile siber güvenliği uygulamalı öğren. Uygulamalı eğitimler, gerçek senaryolar ve adım adım rehberlerle siber güvenlik kariyerine ilk adımını at. Hemen başla!";
  let keys = "siber kampüs, siber güvenlik eğitimi, uygulamalı siber güvenlik, siber güvenlik kursu, siber güvenlik öğren, siber güvenlik nedir, siber güvenlik başlangıç, bilgi güvenliği, online güvenlik eğitimi";
  const slug = p === 'tools' && d && d.slug;

  if (p === 'home') {
    title = "Siber Kampüs Akademi | Siber Güvenlik Eğitimi";
    desc = "Siber Kampüs Akademi ile siber güvenliği uygulamalı öğren. Uygulamalı eğitimler, gerçek senaryolar ve adım adım rehberlerle siber güvenlik kariyerine ilk adımını at. Hemen başla!";
  } else if (p === 'blogs') {
    title = "Blog | Siber Kampüs Akademi — Güncel Siber Güvenlik Makaleleri";
    desc = "Güncel siber güvenlik açıkları, web güvenliği, network güvenliği ve siber güvenlik rehberlerine dair teknik blog yazıları.";
  } else if (p === 'blog-detail' && d && d.title) {
    title = d.seo_title ? d.seo_title : `${d.title} | Siber Kampüs Akademi`;
    desc = d.meta_description ? d.meta_description : `${d.excerpt || d.title + ' hakkında detaylı siber güvenlik makalesi.'}`;
    if (d.focus_keywords) {
      keys = d.focus_keywords;
    }
  } else if (p === 'category' && d) {
    const catName = typeof d === 'string' ? d : d.name || '';
    title = `${catName} | Siber Kampüs Akademi`;
    desc = `${catName} kategorisindeki uygulamalı siber güvenlik eğitim laboratuvarları. Sıfırdan siber güvenlik öğren.`;
  } else if (p === 'tools') {
    if (slug === 'reverse-shell') {
      title = "Online Reverse Shell Oluşturucu | Siber Kampüs Akademi";
      desc = "Sızma testlerinde hedef makineye bağlantı sağlamak için Bash, Python, PHP, PowerShell ve Netcat reverse shell komutlarını online oluşturun.";
      keys = "reverse shell oluşturucu, reverse shell jeneratörü, bash reverse shell, python reverse shell, powershell reverse shell, netcat dinleyici";
    } else if (slug === 'encoder-decoder') {
      title = "Cyber Encoder/Decoder — Base64, Hex, URL, Binary ve HTML | Siber Kampüs Akademi";
      desc = "Metinlerinizi Base64, Hexadecimal, URL, Binary ve HTML formatlarında online olarak şifreleyin ve çözün. Güvenli, hızlı ve tarayıcı tabanlı.";
      keys = "base64 çevirici, url encode decode, hex dönüştürücü, binary çevirici, html entity encode, cyber encoder decoder";
    } else if (slug === 'password-strength') {
      title = "Parola Güvenlik Testi & Entropi Hesaplama | Siber Kampüs Akademi";
      desc = "Şifrenizin brute force (kaba kuvvet) denemelerine karşı kırılma süresini online hesaplayın ve kriptografik olarak güvenli, güçlü parolalar üretin.";
      keys = "şifre gücü testi, parola entropi hesaplama, şifre kırılma süresi, güvenli şifre oluşturucu, brute force testi";
    } else if (slug === 'subnet-calc') {
      title = "CIDR & Subnet Hesaplayıcı (IP Alt Ağ Maskesi) | Siber Kampüs Akademi";
      desc = "IP adresinizi ve CIDR değerini girerek ağ adresini, yayım adresini, IP aralığını ve kullanılabilir cihaz sayısını online hesaplayın.";
      keys = "subnet hesaplayıcı, cidr hesaplayıcı, ip alt ağ hesaplama, alt ağ maskesi, network ip hesaplama";
    } else if (slug === 'hash-tool') {
      title = "Online Hash Oluşturucu ve Tanımlayıcı (MD5, SHA-256) | Siber Kampüs Akademi";
      desc = "Metinlerinizin MD5, SHA-1, SHA-256 ve SHA-512 özet çıktılarını online oluşturun veya bilinmeyen hash formatlarını anında tespit edin.";
      keys = "md5 oluşturucu, sha256 hesaplama, hash tanımlayıcı, hash tespit etme, hash jeneratörü, online hash tool";
    } else if (slug === 'xss-generator') {
      title = "XSS Payload Oluşturucu ve Filtre Atlatma Kiti | Siber Kampüs Akademi";
      desc = "HTML, img, svg, iframe ve öznitelik bağlamlarında çalışan XSS payload'larını online oluşturun ve WAF filtre atlatma yöntemlerini test edin.";
      keys = "xss payload oluşturucu, xss jeneratörü, waf bypass payload, html entity xss, xss bypass kiti";
    } else if (slug === 'sqli-generator') {
      title = "SQL Injection (SQLi) Payload ve Bypass Jeneratörü | Siber Kampüs Akademi";
      desc = "MySQL, PostgreSQL, MSSQL ve Oracle veritabanlarına yönelik Union, Error, Time ve Auth bypass SQL Injection test payload'larını online oluşturun.";
      keys = "sqli payload oluşturucu, sql injection jeneratörü, union based sqli, error based sqli, sql bypass payload";
    } else if (slug === 'cron-explainer') {
      title = "Cron Job Zamanlayıcı ve Türkçe Açıklayıcı | Siber Kampüs Akademi";
      desc = "Linux cron job zaman ifadelerini Türkçe doğal dilde analiz edin veya görsel seçicilerle sıfırdan cron zamanlamaları tasarlayın.";
      keys = "cron zamanlayıcı, cron job açıklaması, cron ifadesi oluşturucu, crontab editör, cron türkçe açıklayıcı";
    } else if (slug === 'base64-file') {
      title = "Base64 Dosya & Görsel Dönüştürücü (Encoder/Decoder) | Siber Kampüs Akademi";
      desc = "Görsellerinizi ve dosyalarınızı sunucuya göndermeden yerel tarayıcınızda Base64 koduna dönüştürün veya Base64 kodlarını dosyaya çevirip indirin.";
      keys = "dosyayı base64e çevirme, base64 dosya dönüştürücü, görsel base64 encoder, base64 to file, base64 decode";
    } else if (slug === 'dns-lookup') {
      title = "Online DNS Sorgulama ve E-posta Güvenlik Analizi | Siber Kampüs Akademi";
      desc = "Alan adınızın A, MX, TXT kayıtlarını sorgulayın; mail sahteciliğini önleyen SPF ve DMARC güvenlik yapılandırmalarını online analiz edin.";
      keys = "dns sorgulama, spf sorgula, dmarc testi, mail güvenliği analizi, mx kaydı kontrolü, online dns lookup";
    } else {
      title = "Siber Güvenlik Araçları & Online Hesaplayıcılar | Siber Kampüs Akademi";
      desc = "Tamamen tarayıcınızda çalışan, 100% istemci taraflı çalışan, SEO uyumlu siber güvenlik araç kiti. Reverse Shell, Subnet, Encoder, Hash, SQLi ve DNS araçları.";
      keys = "siber güvenlik araçları, online siber araçlar, siber güvenlik araçları, network hesaplayıcılar, web güvenliği araçları";
    }
  } else if (p === 'pricing') {
    title = "Eğitim Paketleri & Fiyatlandırma | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi birebir canlı siber güvenlik eğitim paketleri ve fiyatlandırma planları. Ücretsiz tanışma görüşmesinden 1'e 1 canlı mentörlük eğitimlerimize kadar inceleyin.";
    keys = "siber kampüs eğitimleri, siber güvenlik eğitim fiyatları, siber güvenlik kursu ücreti, siber güvenlik mentörlük";
  } else if (p === 'product' && d && d.id) {
    if (d.id === 'free-basic') {
      title = "Ücretsiz Tanışma Görüşmesi | Siber Kampüs Akademi";
      desc = "Siber Kampüs Akademi ile ücretsiz ön görüşme yapın. Seviye tespiti, hedef belirleme ve size özel eğitim yol haritası.";
    } else if (d.id === 'one-on-one') {
      title = "1'e 1 Canlı Siber Güvenlik Eğitimi | Siber Kampüs Akademi";
      desc = "Sektörden uzman mentörler eşliğinde birebir canlı dersler ve özel sızma testi eğitimi.";
    }
  } else if (p === 'rooms') {
    title = "Siber Güvenlik Laboratuvarları | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi uygulamalı siber güvenlik laboratuvarları ile siber güvenliği sıfırdan deneyimleyin. Web zafiyetlerinden ağ analizine kadar düzinelerce laboratuvar.";
  } else if (p === 'login') {
    title = "VIP Üye Girişi | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi VIP üye girişi. Eğitim paketi sahibi üyeler için birebir sohbet ve VIP kaynak erişimi.";
  } else if (p === 'register') {
    title = "Eğitim Paketleri | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi birebir canlı siber güvenlik eğitim paketlerini inceleyin ve kariyerinize başlayın.";
  } else if (p === 'dashboard') {
    title = "VIP Panel | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi VIP panel: birebir eğitmen sohbeti ve uzmanlık kaynak arşivinize erişin.";
  } else if (p === 'leaderboard') {
    title = "Liderlik Sıralaması | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi genel sıralamasında en yüksek puanı alan öğrencileri görün ve rekabete katılın.";
  } else if (p === 'terms') {
    title = "Kullanım Şartları | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi eğitim platformu kullanım şartları ve kuralları.";
  } else if (p === 'privacy') {
    title = "Gizlilik Politikası | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi kullanıcı gizliliği ve veri güvenliği politikası.";
  } else if (p === 'refund-policy') {
    title = "İade ve İptal Koşulları | Siber Kampüs Akademi";
    desc = "Siber Kampüs Akademi dijital eğitim programları ve üyelik paketleri iptal ve iade koşulları.";
  } else {
    const pageTitle = pageTitles[p] || "Siber Kampüs Akademi";
    title = `${pageTitle}`;
  }

  document.title = title;
  
  let descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', desc);
  
  let keyMeta = document.querySelector('meta[name="keywords"]');
  if (keyMeta) keyMeta.setAttribute('content', keys);

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  const currentPath = getPagePath(p, d);
  const canonicalUrl = (p === 'blog-detail' && d && d.canonical_url) ? d.canonical_url : `https://www.siberkampus.org${currentPath}`;
  canonicalLink.setAttribute('href', canonicalUrl);

  // Open Graph / Twitter dinamik güncellemeleri
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', desc);
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);
  let twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', desc);
  let twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.setAttribute('content', canonicalUrl);

  // Robots meta tag for sensitive or non-indexed pages
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  if (['dashboard', 'chat', 'admin', 'profile', 'room', 'set-password'].includes(p)) {
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  } else {
    robotsMeta.setAttribute('content', 'index, follow');
  }

  let ldJsonScript = document.getElementById('seo-structured-data');
  if (ldJsonScript) ldJsonScript.remove();

  ldJsonScript = document.createElement('script');
  ldJsonScript.id = 'seo-structured-data';
  ldJsonScript.type = 'application/ld+json';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "url": canonicalUrl,
    "description": desc,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5."
  };

  ldJsonScript.textContent = JSON.stringify(structuredData);
  document.head.appendChild(ldJsonScript);
};

const getPagePath = (p, d) => {
  if (p === 'home') return '/';
  if (p === 'about') return '/hakkimizda';
  if (p === 'contact') return '/iletisim';
  if (p === 'blogs') return '/blog';
  if (p === 'login') return '/giris';
  if (p === 'register') return '/kayit';
  if (p === 'terms') return '/kullanim-sartlari';
  if (p === 'privacy') return '/gizlilik';
  if (p === 'refund-policy') return '/iade-ve-iptal-kosullari';
  if (p === 'delivery-policy') return '/teslimat-kosullari';
  if (p === 'blog-detail' && d) {
    const slug = typeof d === 'string' ? d : d.slug || '';
    return `/blogs/${slug}`;
  }
  if (p === 'category' && d) {
    const catName = typeof d === 'string' ? d : d.name || '';
    return `/category/${encodeURIComponent(catName)}`;
  }
  if (p === 'room' && d) {
    const roomId = typeof d === 'string' ? d : d.id || '';
    return `/rooms/${roomId}`;
  }
  if (p === 'roomArticle' && d) {
    const roomId = typeof d === 'string' ? d : d.id || '';
    return `/brief/${roomId}`;
  }
  if (p === 'pathway' && d) {
    const slug = typeof d === 'string' ? d : d.slug || '';
    return `/pathway/${slug}`;
  }
  if (p === 'doc' && d) {
    const docId = typeof d === 'string' ? d : d.id || '';
    return `/docs/${docId}`;
  }
  if (p === 'tools') {
    return d && d.slug ? `/tools/${d.slug}` : `/tools`;
  }
  if (p === 'product' && d) {
    const id = typeof d === 'string' ? d : d.id || '';
    return `/product/${id}`;
  }
  return `/${p}`;
};

const parseLocation = () => {
  let path = window.location.pathname;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  if (path === '/' || path === '') {
    return { page: 'home', data: null };
  }
  if (path === '/hakkimizda') {
    return { page: 'about', data: null };
  }
  if (path === '/iletisim') {
    return { page: 'contact', data: null };
  }
  if (path === '/blog') {
    return { page: 'blogs', data: null };
  }
  if (path === '/giris') {
    return { page: 'login', data: null };
  }
  if (path === '/kayit') {
    return { page: 'register', data: null };
  }
  if (path === '/kullanim-sartlari') {
    return { page: 'terms', data: null };
  }
  if (path === '/gizlilik') {
    return { page: 'privacy', data: null };
  }
  if (path === '/iade-ve-iptal-kosullari') {
    return { page: 'refund-policy', data: null };
  }
  if (path === '/teslimat-kosullari') {
    return { page: 'delivery-policy', data: null };
  }
  if (path.startsWith('/blogs/')) {
    const slug = path.substring(7);
    return { page: 'blog-detail', data: { slug } };
  }
  if (path.startsWith('/tools/')) {
    const slug = path.substring(7);
    return { page: 'tools', data: { slug } };
  }
  if (path === '/tools') {
    return { page: 'tools', data: null };
  }
  if (path === '/seviye-testi') {
    return { page: 'level-test', data: null };
  }
  if (path === '/set-password') {
    const params = new URLSearchParams(window.location.search);
    return { page: 'set-password', data: { token: params.get('token') || '' } };
  }
  if (path.startsWith('/product/')) {
    const id = path.substring(9);
    return { page: 'product', data: { id } };
  }
  const pageName = path.substring(1);
  return { page: pageName, data: null };
};

const App = () => {
  const [trainingPromptRoom, setTrainingPromptRoom] = useState(null);
  // Synchronous initial parse to avoid home page flash
  const getInitialState = () => {
    const parsed = parseLocation();
    const token = localStorage.getItem('sk_token');
    const protectedPages = ['dashboard', 'chat', 'admin', 'certificates'];
    let initialPage = parsed.page;
    let initialData = parsed.data;

    // Açık kayıt kaldırıldı: VIP üyelik yalnızca eğitim paketi satın alınarak edinilir.
    if (initialPage === 'register' || initialPage === 'rooms') {
      initialPage = 'pricing';
      initialData = null;
    }

    if (protectedPages.includes(initialPage) && !token) {
      initialPage = 'login';
      initialData = null;
    } else if ((initialPage === 'login') && token) {
      initialPage = 'dashboard';
      initialData = null;
    }
    return { page: initialPage, data: initialData };
  };

  const initialState = getInitialState();
  const [page, setPage] = useState(initialState.page);
  const [data, setData] = useState(initialState.data);

  // Scroll to top on page change to prevent clamping scroll to the footer on shorter pages
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    return () => clearTimeout(t);
  }, [page, data]);

  const navigate = (p, d = null, fromPopState = false) => {
    const token = localStorage.getItem('sk_token');
    if (p === 'roomArticle' && token && d && !d.forceNoPrompt && !fromPopState) {
      let roomObj = null;
      if (typeof d === 'string') {
        if (window.SK_CATEGORIES) {
          for (const cat of window.SK_CATEGORIES) {
            const found = cat.rooms.find(r => r.id === d);
            if (found) { roomObj = found; break; }
          }
        }
        if (!roomObj) roomObj = { id: d, name: d };
      } else {
        roomObj = d;
      }
      setTrainingPromptRoom(roomObj);
      return;
    }

    if (typeof p === 'string' && p.startsWith('tools/')) {
      d = { slug: p.substring(6) };
      p = 'tools';
    }
    // Açık kayıt kaldırıldı: VIP üyelik yalnızca eğitim paketi satın alınarak edinilir.
    if (p === 'register' || p === 'rooms') {
      p = 'pricing';
      d = null;
    }

    // Auth guards
    const protectedPages = ['dashboard', 'chat', 'admin'];

    if (protectedPages.includes(p) && !token) {
      p = 'login';
      d = null;
    } else if ((p === 'login') && token) {
      p = 'dashboard';
      d = null;
    }

    setPage(p);
    setData(d);
    window.scrollTo(0, 0);

    // Dynamic SEO Titles, Meta Tags, Canonical URL & JSON-LD Structured Data
    updateSEOMeta(p, d);
    const pageTitle = document.title;

    // Resolve URL path and update browser history
    const path = getPagePath(p, d);
    if (!fromPopState) {
      window.history.pushState({ page: p, data: d }, "", path);
    } else {
      if (window.location.pathname !== path) {
        window.history.replaceState({ page: p, data: d }, "", path);
      }
    }

    if (window.gtag) {
      window.gtag('config', 'G-QFXKTX2HD3', {
        'page_path': path,
        'page_title': pageTitle
      });
    }
  };

  // Track initial page view and bind popstate listener
  useEffect(() => {
    // Force state refresh if initial mount was rendered before page scripts loaded
    const initLoc = parseLocation();
    if (initLoc.page !== page) {
      navigate(initLoc.page, initLoc.data, true);
    }
    // Replace initial state to sync history object
    const path = getPagePath(page, data);
    window.history.replaceState({ page, data }, "", path);

    // Dynamic Title, Meta Tags, Canonical URL & JSON-LD Structured Data for Initial Load
    updateSEOMeta(page, data);

    if (window.gtag) {
      window.gtag('config', 'G-QFXKTX2HD3', {
        'page_path': path,
        'page_title': document.title
      });
    }

    const handlePopState = (event) => {
      const state = event.state;
      if (state && state.page) {
        navigate(state.page, state.data, true);
      } else {
        const fallback = parseLocation();
        navigate(fallback.page, fallback.data, true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const Cmp = PAGES[page] || PAGES.notfound || PAGES.home;
  // pass `blog` too so BlogDetailPage's existing prop name keeps working
  return (
    <div className="min-h-screen">
      <Cmp navigate={navigate} data={data} blog={data} />
      <WhatsAppButton />
      
      {trainingPromptRoom && (
        <div className="fixed inset-0 bg-[#020806]/85 z-[999] grid place-items-center p-4 overflow-y-auto" style={{ animation: 'modalFadeIn .4s cubic-bezier(0.16,1,0.3,1) both' }} onClick={() => setTrainingPromptRoom(null)}>
          <div className="relative max-w-md w-full border border-[#103a26] bg-[#04100a] rounded-2xl shadow-[0_0_80px_rgba(0,255,136,.25)] p-8 text-center" style={{ background: 'linear-gradient(165deg,#07150e,#020806)', animation: 'modalScaleIn .5s cubic-bezier(0.16,1,0.3,1) both' }} onClick={e => e.stopPropagation()}>
            <span className="font-mono text-xs text-[#00ff88] tracking-[0.2em] uppercase mb-2 block">// GÖREV HAZIRLIĞI</span>
            <h3 className="text-2xl font-disp font-bold text-[#eafff5] mb-4">{trainingPromptRoom.name || trainingPromptRoom.title}</h3>
            <p className="text-[#9fc4b5] text-sm leading-relaxed mb-8">
              Operasyona başlamadan önce mentörünüz tarafından hazırlanan mini eğitimi (Ders Brifingi) okumak ister misiniz? Temel kavramları önceden öğrenmek çözümü kolaylaştıracaktır.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  const r = trainingPromptRoom;
                  setTrainingPromptRoom(null);
                  navigate('roomArticle', { ...r, forceNoPrompt: true });
                }} 
                className="w-full font-mono text-sm font-bold text-[#021008] bg-[#00ff88] py-3.5 rounded-xl hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] transition-all uppercase tracking-wider animate-pulse hover:animate-none"
              >
                🎓 Evet, Eğitimi Al (Önerilen)
              </button>
              <button 
                onClick={() => {
                  const r = trainingPromptRoom;
                  setTrainingPromptRoom(null);
                  navigate('room', { ...r, cameFromArticle: false });
                }} 
                className="w-full font-mono text-sm font-bold text-[#74998a] border border-[#103a26] py-3 rounded-xl hover:border-[#ffd166] hover:text-[#ffd166] transition-all uppercase tracking-wider"
              >
                ⚡ Hayır, Direkt Odaya Geç
              </button>
              <button 
                onClick={() => setTrainingPromptRoom(null)} 
                className="text-[#5c8a74] hover:text-[#74998a] text-xs transition-colors mt-2 underline"
              >
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);