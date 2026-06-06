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
  const menuItems = [['Anasayfa', 'home'], ['Hakkımızda', 'about'], ['İletişim', 'contact'], ['Blog', 'blogs']];
  return (
    <header className="sticky top-0 z-50 bg-[rgba(2,8,6,.88)] backdrop-blur-md border-b border-[#0c2719]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between h-[72px]">
        <button onClick={() => navigate('home')} className="flex items-center gap-3 font-disp font-bold text-xl text-[#eafff5] tracking-tight">
          <span className="w-[34px] h-[34px] border-[1.5px] border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-[15px] font-bold shadow-[0_0_18px_-4px_var(--glow),inset_0_0_12px_-6px_var(--glow)]">&gt;_</span>
          siber<b className="text-[#00ff88]">kampus</b>
        </button>
        <nav className="hidden md:flex gap-9 items-center">
          {menuItems.map(([t, p]) => (
            <button key={p} onClick={() => navigate(p)} className="text-sm text-[#74998a] hover:text-[#cdeede] transition-colors relative group">
              {t}<span className="absolute left-0 -bottom-2 h-[1.5px] w-0 bg-[#00ff88] group-hover:w-full transition-all duration-200"></span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          <button onClick={() => navigate('login')} className="hidden sm:inline-flex font-mono text-sm text-[#cdeede] px-[18px] py-[11px] border border-[#103a26] bg-transparent hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Giriş Yap</button>
          <button onClick={() => navigate('register')} className="hidden sm:inline-flex font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-[22px] py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] hover:-translate-y-px transition-all">Ücretsiz Başla</button>
          
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
            <button key={p} onClick={() => { setMobileMenuOpen(false); navigate(p); }} className="text-left py-2 text-sm text-[#74998a] hover:text-[#00ff88] transition-colors">
              {t}
            </button>
          ))}
          <div className="h-px bg-[#0c2719] my-1"></div>
          <div className="flex gap-4">
            <button onClick={() => { setMobileMenuOpen(false); navigate('login'); }} className="flex-1 text-center py-2.5 text-sm text-[#cdeede] border border-[#103a26] rounded">Giriş Yap</button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('register'); }} className="flex-1 text-center py-2.5 text-sm font-bold text-[#021008] bg-[#00ff88] rounded">Kayıt Ol</button>
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
        <div className="col-span-2 md:col-span-1">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 font-disp font-bold text-xl text-[#eafff5]">
            <span className="w-[34px] h-[34px] border-[1.5px] border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-[15px] font-bold">&gt;_</span>
            siber<b className="text-[#00ff88]">kampus</b>
          </button>
          <p className="text-[#74998a] text-sm mt-[18px] max-w-[300px] leading-relaxed">Uygulamalı CTF görevleri ve hacking laboratuvarlarıyla yeni nesil siber güvenlik uzmanlarını yetiştiriyoruz.</p>
        </div>
        {[
      { h: 'Platform', items: [['Laboratuvarlar', 'rooms'], ['Blog', 'blogs'], ['CTF Görevleri', 'rooms'], ['Liderlik Tablosu', 'leaderboard']] },
      { h: 'Kurumsal & Yasal', items: [['Hakkımızda', 'about'], ['İletişim', 'contact'], ['Kullanım Şartları', 'terms'], ['Gizlilik Politikası', 'privacy']] },
      { h: 'Güvenlik Araçları I', items: [['Reverse Shell Oluşturucu', 'tools/reverse-shell'], ['Encoder/Decoder', 'tools/encoder-decoder'], ['Parola Güvenliği', 'tools/password-strength'], ['Subnet Hesaplayıcı', 'tools/subnet-calc'], ['Hash Oluşturucu & Tan', 'tools/hash-tool']] },
      { h: 'Güvenlik Araçları II', items: [['XSS Payload Oluşturucu', 'tools/xss-generator'], ['SQLi Payload Oluşturucu', 'tools/sqli-generator'], ['Cron Zamanlayıcı', 'tools/cron-explainer'], ['Base64 Dosya/Görsel', 'tools/base64-file'], ['DNS Güvenlik Sorgulama', 'tools/dns-lookup']] }].
      map((col, i) =>
      <div key={i}>
            <div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-[18px]">{col.h}</div>
            {col.items.map(([t, p], j) =>
        <button key={j} onClick={() => p && navigate(p)} className="block text-left text-[#74998a] text-sm py-1.5 hover:text-[#00ff88] transition-colors">{t}</button>
        )}
          </div>
      )}
      </div>
      <div className="flex justify-between items-center pt-7 flex-wrap gap-4">
        <p className="text-[13px] text-[#5c8a74]">© 2026 siberkampus — Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-2.5 text-[13px] text-[#74998a]">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] sk-pulse"></span>
          Tüm sistemler çalışıyor<span className="term-cursor !h-[13px] ml-1"></span>
        </div>
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
      const size = () => {const r = cv.getBoundingClientRect();cv.width = r.width * dpr;cv.height = r.height * dpr;};
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
      { t: '$ ', c: '#00ff88', x: 'nmap -sV target.lab', d: 55 },
      { t: '', c: '#74998a', x: '  PORT     STATE  SERVICE', d: 8 },
      { t: '', c: '#74998a', x: '  22/tcp   open   ssh', d: 8 },
      { t: '', c: '#74998a', x: '  80/tcp   open   http', d: 8 },
      { t: '$ ', c: '#00ff88', x: 'sqlmap -u "/login" --dump', d: 50 },
      { t: '', c: '#ffd166', x: '  [!] injectable parameter found', d: 8 },
      { t: '', c: '#00ff88', x: '  [+] admin hash extracted', d: 8 },
      { t: '$ ', c: '#00ff88', x: 'cat /root/flag.txt', d: 55 },
      { t: '', c: '#00ff88', x: '  FLAG{s1ber_kampus_pwn3d}', d: 8 },
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

    /* ---- COUNT UP ---- */
    if (statsRef.current) {
      const nums = statsRef.current.querySelectorAll('[data-count]');
      const io = new IntersectionObserver((es) => {
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
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const features = [
  { num: '01', icon: '⚡', title: 'Kurulumsuz Laboratuvar', desc: 'Sanal makine, dual boot, bozuk yapılandırma yok. Tarayıcını aç, "Başlat" de ve saniyeler içinde canlı bir hedef sistemin karşısında ol.' },
  { num: '02', icon: '⌖', title: 'Gerçek Saldırı Senaryoları', desc: 'Her görev, sahada karşına çıkacak gerçek zafiyetlerden üretildi. Sahte sorular değil, gerçek sistemleri ele geçirme deneyimi.' },
  { num: '03', icon: '↯', title: 'Anlık Geri Bildirim', desc: 'Bayrağı yakaladığın an puanın artar, ilerlemen kaydedilir. Nerede hata yaptığını anında görür, eksiğini hemen kapatırsın.' },
  { num: '04', icon: '◈', title: 'Mentör Desteği', desc: "Takıldığın yerde alanında çalışan gerçek pentester'lardan ipucu ve geri bildirim al. Yalnız öğrenmek zorunda değilsin." },
  { num: '05', icon: '⬡', title: 'Rozet & Sertifika', desc: "Tamamladığın her yol için doğrulanabilir rozetler ve sertifikalar kazan. CV'ne ve LinkedIn'ine ekleyebileceğin somut kanıtlar." },
  { num: '06', icon: '⟁', title: 'Kariyer Yönlendirme', desc: 'Beceri profilin işe alım yapan şirketlere açılır. Hangi pozisyona hazır olduğunu görür, doğru fırsatlarla eşleşirsin.' }];


  const roadmap = [
  { n: '01', h: 'Temeller & Linux', p: 'Komut satırı, ağ temelleri ve güvenlik zihniyetiyle sağlam bir başlangıç.', tag: '~2 hafta' },
  { n: '02', h: 'Web & Sistem Güvenliği', p: 'Gerçek zafiyetleri sömürerek SQLi, XSS ve ayrıcalık yükseltmeyi öğren.', tag: '~4 hafta' },
  { n: '03', h: 'CTF & İleri Sızma Testi', p: 'Çok adımlı senaryolarda pivotlama, raporlama ve metodolojiyi ustalaştır.', tag: '~6 hafta' },
  { n: '04', h: 'Portföy & Kariyer', p: 'Beceri profilini işverenlere aç, doğru pozisyonlarla eşleş.', tag: 'sürekli' }];


  const testimonials = [
  { text: "Üniversitede teori öğrendim ama ilk defa siberkampus'ta gerçek bir sistemi ele geçirdim. 3 ay sonra ilk SOC analisti işime başladım. Laboratuvarlar olmasa bu hızda olmazdı.", name: 'Arda K.', role: 'SOC Analisti · eski öğrenci', av: 'AK' },
  { text: 'Muhasebeden geliyorum, kod bile bilmiyordum. Yol haritası beni elimden tutup götürdü. Her CTF görevini çözdükçe özgüvenim arttı. Şimdi pentester olarak çalışıyorum.', name: 'Melis Y.', role: 'Sızma Testi Uzmanı · kariyer değiştirdi', av: 'MY' },
  { text: "Kurulumla uğraşmadan tarayıcıdan her şeye erişebilmek inanılmaz. Gece 2'de laboratuvar açıp bayrak avlıyorum. Bağımlılık yapıyor ama en iyi türden.", name: 'Emre Ç.', role: 'Bilgisayar Müh. öğrencisi', av: 'EÇ' }];


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
              Türkiye'nin uygulamalı hacking kampüsü
            </span>
            <h1 className="text-[clamp(40px,6vw,78px)] text-[#eafff5] mb-[18px] tracking-[-.025em]">
              <span className="glitch" data-text="Siber Güvenlik">Siber Güvenlik</span><br />Uzmanı
            </h1>
            <div className="text-[16.5px] text-[#74998a] max-w-[560px] mb-8 leading-[1.75] space-y-[15px]">
              <p>siberkampus, <strong className="text-[#cdeede] font-medium">siber güvenlik uzmanı</strong> olmak isteyen herkes için tasarlanmış, tamamen uygulamalı bir öğrenme kampüsüdür. Sıkıcı teori ezberlemek yerine gerçek saldırı senaryolarını birebir canlandıran <strong className="text-[#cdeede] font-medium">CTF görevleri</strong> ve <strong className="text-[#cdeede] font-medium">hacking laboratuvarları</strong> üzerinde çalışırsın.</p>
              <p>İster siber güvenliğe yeni başlayan bir öğrenci ol, ister kariyerini bu alana taşımak isteyen biri; sıfırdan başlayıp adım adım gerçek bir uzmana dönüşmen için gereken her şeyi tek bir platformda bulursun.</p>
              <p>Web zafiyetlerinden ağ analizine, zararlı yazılım incelemesinden dijital adli bilişime kadar onlarca konuyu tarayıcının içinde, hiçbir kurulum yapmadan deneyimlersin.</p>
              <p>Her görevde puan toplar, rozet kazanır ve seni işverenlere gösterecek bir beceri profili oluşturursun. Binlerce öğrenciyle birlikte öğrenir, mentörlerden geri bildirim alırsın. Yolculuğun ilk laboratuvarını çözdüğün anda başlar.</p>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <button onClick={() => navigate('rooms')} className="font-mono text-[15px] font-bold text-[#021008] bg-[#00ff88] px-[30px] py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] hover:-translate-y-px transition-all">İlk Laboratuvarını Çöz →</button>
              <button onClick={() => navigate('rooms')} className="font-mono text-[15px] text-[#cdeede] px-[30px] py-4 border border-[#103a26] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">CTF Görevlerini Gör</button>
            </div>
            <div className="flex items-center gap-3.5 mt-[26px] text-[13px] text-[#5c8a74]">
              <div className="flex">
                {['AK', 'MY', 'EÇ', '+9'].map((a, i) =>
                <span key={i} className={"w-[30px] h-[30px] rounded-full border-[1.5px] border-[#020806] grid place-items-center text-[11px] font-bold text-[#5cffba] " + (i ? '-ml-2 ' : '')} style={{ background: 'linear-gradient(135deg,#0a3a24,#063018)' }}>{a}</span>
                )}
              </div>
              <span>12.400+ öğrenci şu anda saldırı altında 🟢</span>
            </div>
          </div>

          {/* TERMINAL */}
          <div className="rounded-xl overflow-hidden border border-[#103a26] text-[13.5px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.9),0_0_60px_-20px_var(--glow)]" style={{ background: 'linear-gradient(160deg,#06140d,#040d08)' }}>
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-[#0c2719] bg-black/25">
              <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]"></span>
              <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]"></span>
              <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]"></span>
              <span className="ml-2 text-xs text-[#5c8a74]">root@siberkampus: ~/lab-07-web-exploit</span>
            </div>
            <div ref={termRef} className="p-[18px] min-h-[240px] leading-[1.85] font-mono" style={{ letterSpacing: "1px", height: "340px", padding: "12px" }}></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} className="border-b border-[#0c2719]" style={{ background: 'linear-gradient(180deg,#04100a,#020806)' }}>
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4">
          {[
          { c: 12400, s: '+', l: 'Aktif Öğrenci' },
          { c: 380, s: '+', l: 'Hacking Laboratuvarı' },
          { c: 90, s: '+', l: 'CTF Görevi' },
          { c: 94, s: '%', l: 'Tamamlama Oranı' }].
          map((st, i) =>
          <div key={i} className={"py-11 px-7 text-center " + (i ? 'border-l border-[#0c2719]' : '')}>
              <div data-count={st.c} data-suffix={st.s} className="font-disp font-bold text-[clamp(32px,4vw,52px)] text-[#00ff88] tracking-[-.02em] drop-shadow-[0_0_26px_rgba(0,255,136,.3)]">0</div>
              <div className="text-[13px] text-[#74998a] mt-2 tracking-wide">{st.l}</div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: CTF / LABS + SPHERE */}
      <section className="py-[108px]">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Pratik &gt; Teori</span>
            <h2 className="text-[clamp(30px,4vw,46px)] text-[#eafff5] my-[18px]">CTF ve Hacking <em className="not-italic text-[#00ff88]">Laboratuvarlarıyla</em> Pratik Yap</h2>
            <div className="text-[15.5px] text-[#74998a] leading-[1.85] max-w-[560px] space-y-[15px]">
              <p>siberkampus'ta öğrenmenin merkezinde gerçek dünyayı taklit eden <strong className="text-[#cdeede] font-medium">hacking laboratuvarları</strong> ve <strong className="text-[#cdeede] font-medium">CTF (Capture The Flag) görevleri</strong> bulunur. Her laboratuvar, izole edilmiş güvenli bir ortamda canlanan gerçek bir sistemdir; sızma testi adımlarını birebir uygular, açıkları kendi ellerinle keşfeder ve gizlenmiş bayrağı yakalamak için düşünmen gerekir.</p>
              <p>SQL injection, XSS, ayrıcalık yükseltme, ağ pivotlama ve tersine mühendislik gibi konuları okuyarak değil, bizzat sömürerek öğrenirsin. Her görev zorluk seviyesine göre etiketlenir; başlangıç seviyesinden uzman seviyesine kadar kademeli ilerlersin.</p>
              <p>Takıldığında ipuçları, çözüm videoları ve topluluğun desteği bir tık uzağındadır. Tarayıcı tabanlı altyapımız sayesinde sanal makine kurmakla, yapılandırmayla ya da bozulan ortamlarla uğraşmazsın; tek yapman gereken "Başlat" demek. Çözdüğün her bayrak puanını yükseltir, liderlik tablosunda seni yukarı taşır ve gerçek bir <strong className="text-[#cdeede] font-medium">siber güvenlik uzmanının</strong> reflekslerini sana kazandırır.</p>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-[30px]">
              {['Web Exploitation', 'Ağ Sızma Testi', 'Sistem Sömürüsü'].map((p, i) =>
              <span key={i} className="text-[12.5px] text-[#5cffba] border border-[#103a26] px-3.5 py-2 rounded-full bg-[rgba(0,255,136,.03)]"><span className="text-[#00ff88]">›</span> {p}</span>
              )}
            </div>
          </div>
          <div className="reveal">
            <div className="sphere-wrap relative aspect-square grid place-items-center">
              <canvas ref={sphereRef} className="w-full h-full"></canvas>
              <span className="absolute top-[6%] left-0 font-mono text-[11.5px] text-[#5cffba] border border-[#103a26] bg-[rgba(2,8,6,.85)] px-2.5 py-[5px] rounded-md backdrop-blur-sm">scan: 0xA3F1 ✓</span>
              <span className="absolute bottom-[10%] -right-[4%] font-mono text-[11.5px] text-[#5cffba] border border-[#103a26] bg-[rgba(2,8,6,.85)] px-2.5 py-[5px] rounded-md backdrop-blur-sm">node_active: 380</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-[108px]" style={{ background: 'linear-gradient(180deg,#020806,#04100a)' }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-14 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Neden siberkampus</span>
            <h2 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] mt-4">Seni Gerçekten Uzman Yapan Kampüs</h2>
            <p className="text-[#74998a] mt-4 text-[15px]">Video izleyip unuttuğun kurslardan değil; her gün kendini test ettiğin, savaştığın ve kazandığın canlı bir laboratuvardan bahsediyoruz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {features.map((f, i) =>
            <div key={i} className="reveal group relative overflow-hidden rounded-2xl border border-[#0c2719] p-[30px] hover:border-[#103a26] hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(0,255,136,.35)] transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <span className="absolute top-0 left-0 w-full h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ background: 'linear-gradient(90deg,#00ff88,transparent)' }}></span>
                <span className="absolute top-[22px] right-6 font-mono text-xs text-[#5c8a74]">{f.num}</span>
                <div className="w-[46px] h-[46px] border border-[#103a26] rounded-[10px] grid place-items-center text-[#00ff88] text-xl mb-5 bg-[rgba(0,255,136,.04)]">{f.icon}</div>
                <h3 className="text-[19px] text-[#eafff5] mb-2.5">{f.title}</h3>
                <p className="text-sm text-[#74998a] leading-[1.7]">{f.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: CAREER PATH + ROADMAP */}
      <section className="py-[108px]">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal lg:order-2">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Yol Haritası</span>
            <h2 className="text-[clamp(30px,4vw,46px)] text-[#eafff5] my-[18px]">Sıfırdan <em className="not-italic text-[#00ff88]">Kariyere</em> Giden Net Bir Yol</h2>
            <div className="text-[15.5px] text-[#74998a] leading-[1.85] max-w-[560px] space-y-[15px]">
              <p>Çoğu insan siber güvenliğe başlamak ister ama nereden başlayacağını bilemediği için kaybolur. siberkampus tam da bu sorunu çözmek için kuruldu. Sana dağınık videolar değil, <strong className="text-[#cdeede] font-medium">uçtan uca bir yol haritası</strong> sunuyoruz: ilk gün hangi komutu yazacağından başlayarak, ileri seviye sızma testi metodolojilerine kadar her adım sıralı ve mantıklı bir şekilde önüne geliyor.</p>
              <p>Temel Linux ve ağ bilgisiyle ısınır, ardından web güvenliği, sistem sömürüsü ve raporlama becerilerini gerçek görevlerle pekiştirirsin. İlerledikçe profilin güçlenir; tamamladığın laboratuvarlar, kazandığın rozetler ve liderlik tablosundaki yerin senin için konuşan bir portföye dönüşür.</p>
              <p>Kariyer değiştirmek isteyen biri ya da üniversite öğrencisi olman fark etmez; bu yol, seni izleyici koltuğundan çıkarıp klavyenin başına oturtur. Mezun olduğunda elinde sadece bir sertifika değil, gerçekten sistem ele geçirmiş bir <strong className="text-[#cdeede] font-medium">siber güvenlik uzmanının</strong> özgüveni olur.</p>
            </div>
            <div className="mt-[30px]">
              <button onClick={() => navigate('rooms')} className="font-mono text-[15px] font-bold text-[#021008] bg-[#00ff88] px-[30px] py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] hover:-translate-y-px transition-all">Yol Haritasını Aç</button>
            </div>
          </div>
          <div className="reveal lg:order-1 flex flex-col gap-3.5">
            {roadmap.map((r, i) =>
            <div key={i} className="relative flex gap-[18px] items-start border border-[#0c2719] rounded-xl px-[22px] py-5 hover:border-[#103a26] transition-colors" style={{ background: 'linear-gradient(160deg,#07150e,#04100a)' }}>
                <span className="w-[38px] h-[38px] flex-none rounded-[9px] border border-[#103a26] text-[#00ff88] grid place-items-center font-mono font-bold bg-[rgba(0,255,136,.04)]">{r.n}</span>
                <div>
                  <h3 className="font-disp text-[16.5px] text-[#eafff5] mb-1">{r.h}</h3>
                  <p className="text-[13px] text-[#74998a] leading-[1.6]">{r.p}</p>
                </div>
                <span className="absolute top-[18px] right-5 font-mono text-[11px] text-[#5c8a74]">{r.tag}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-[108px]" style={{ background: 'linear-gradient(180deg,#020806,#04100a)' }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-12 reveal">
            <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center justify-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> Topluluk</span>
            <h2 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] mt-4">Klavyenin Başına Geçenler Ne Diyor?</h2>
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
          <h2 className="text-[clamp(32px,5vw,56px)] text-[#eafff5] mb-[18px]">Bugün İlk <em className="not-italic text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,.4)]">Bayrağını</em> Yakala.</h2>
          <p className="text-[#74998a] max-w-[520px] mx-auto mb-[34px] text-[15.5px]">Kredi kartı yok, kurulum yok, bahane yok. Tarayıcını aç ve ilk hacking laboratuvarını ücretsiz çöz.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('register')} className="font-mono text-[15px] font-bold text-[#021008] bg-[#00ff88] px-[30px] py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Ücretsiz Hesap Aç →</button>
            <button onClick={() => navigate('rooms')} className="font-mono text-[15px] text-[#cdeede] px-[30px] py-4 border border-[#103a26] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Görevleri İncele</button>
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
          <p className="text-[#74998a] max-w-[600px] mb-10">Hacking, sızma testi ve siber güvenliğin derinlerine inen yazılar. Alanında uzmanlar tarafından kaleme alınmış en güncel içerikler.</p>
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
              // Bu makale siberkampus'taki laboratuvarlarla uyumludur.<br />// Öğrendiklerini hemen uygulamak için platformu ziyaret et.
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
            <p className="text-[#74998a] mb-6 max-w-[520px] mx-auto">Siberkampus'ta bu makaleyle ilgili laboratuvarlar ve CTF görevleri seni bekliyor. Hemen başla ve gerçek bir sistem üzerinde çalışarak öğren.</p>
            <button onClick={() => navigate('rooms')} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-7 py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Laboratuvarları Gör →</button>
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
          <h1 className="text-[clamp(36px,5vw,56px)] text-[#eafff5] my-5">Hacking Laboratuvarları</h1>
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
          <h1 className="text-4xl text-[#eafff5] mb-2">Giriş Yap</h1>
          <p className="text-[#74998a] text-sm">siberkampus hesabına erişim sağla</p>
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
        <p className="text-center text-[#74998a] text-sm mt-7">Hesabın yok mu? <button onClick={() => navigate('register')} className="text-[#00ff88] hover:text-[#5cffba] transition-colors font-medium">Kayıt Ol</button></p>
      </AuthShell>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ REGISTER ============ */
const RegisterPage = ({ navigate }) => {
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
          <p className="text-[#74998a] text-sm">siberkampus'a katıl ve siber güvenlik uzmanı ol</p>
        </div>
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
  register: RegisterPage
});

/* ============ CANLI DESTEK WIDGET ============ */
const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([
  { me: false, t: 'Selam! 👋 Ben Eylül, siberkampus canlı destek ekibinden. Sana nasıl yardımcı olabilirim?' }]
  );
  const bodyRef = useRef(null);

  useEffect(() => {if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;}, [msgs, typing, open]);

  const quick = ['Nasıl başlarım?', 'Ücretsiz mi?', 'Sertifika veriyor musunuz?', 'Bir lab açılmıyor'];
  const replyFor = (q) => {
    const s = q.toLowerCase();
    if (s.includes('kurucu') || s.includes('yusuf') || s.includes('yetkin')) return 'Siber Kampüs\'ün kurucusu Yusuf İslam Yetkin\'dir. Kendisi uzun yıllar finans ve enterprise sistemlerde çalışmış deneyimli bir yazılım mimarıdır. 💻';
    if (s.includes('fiyat') || s.includes('ücret') || s.includes('para') || s.includes('kaç tl') || s.includes('satın al') || s.includes('öde')) return 'Siber Kampüs\'te temel laboratuvar odaları tamamen ücretsizdir! Pentest web sitemizle ilgili uzman eğitim paketimiz ise 1200 TL\'dir. 💚';
    if (s.includes('başla') || s.includes('nasıl')) return 'Çok kolay! Ücretsiz bir hesap aç, ardından "Laboratuvarlar" sayfasından başlangıç seviyesi bir görev seç ve "Başlat" de. Kurulum gerekmez, her şey tarayıcıda çalışır. 🚀';
    if (s.includes('oda') || s.includes('laboratuvar') || s.includes('makine') || s.includes('lab')) return 'Oda sistemimiz; Web, Linux ve Ağ kategorilerinde interaktif hacking laboratuvarlarından oluşur. Her odanın kendine ait siberkampus{...} şeklinde flag\'i (bayrağı) bulunur. 🔍';
    if (s.includes('sertifika')) return 'Evet! Bir öğrenme yolunu tamamladığında doğrulanabilir bir sertifika kazanırsın — CV ve LinkedIn\'ine ekleyebilirsin. "Sertifikalarım" sayfasından takip edebilirsin. 🎖️';
    if (s.includes('açılm') || s.includes('hata') || s.includes('sorun') || s.includes('çalışm')) return 'Bunu duyduğuma üzüldüm! Önce laboratuvarı sıfırlamayı dene. Sorun sürerse görev adını yazar mısın, hemen ekibe iletip kontrol ettireyim. 🛠️';
    return 'Anladım! Ben canlı destek botu Eylül. Siber Kampüs, kurucumuz Yusuf İslam Yetkin, ücretsiz odalarımız veya 1200 TL değerindeki Pentest eğitimimiz hakkında sorularınızı yanıtlayabilirim. 🙂';
  };

  const push = async (text) => {
    if (!text.trim()) return;
    const userMsg = { me: true, t: text };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...msgs, userMsg]
        })
      });
      if (!res.ok) throw new Error('API status: ' + res.status);
      const data = await res.json();
      setTyping(false);
      setMsgs((m) => [...m, { me: false, t: data.reply }]);
      if (!open) setUnread((u) => u + 1);
    } catch (err) {
      console.warn('Chatbot API error, using client fallback:', err);
      setTyping(false);
      setMsgs((m) => [...m, { me: false, t: replyFor(text) }]);
      if (!open) setUnread((u) => u + 1);
    }
  };

  const toggle = () => {setOpen((o) => !o);setUnread(0);};

  return (
    <div className="fixed bottom-5 right-5 z-[90] font-mono">
      {/* PANEL */}
      {open &&
      <div className="mb-3 w-[350px] max-w-[calc(100vw-40px)] rounded-2xl border border-[#103a26] overflow-hidden shadow-[0_30px_70px_-20px_#000,0_0_50px_-20px_var(--glow)] flex flex-col" style={{ height: '460px', background: 'linear-gradient(170deg,#06140d,#040d08)' }}>
          {/* header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#0c2719] bg-black/25">
            <div className="relative">
              <span className="w-9 h-9 rounded-lg grid place-items-center text-[#5cffba] font-bold text-xs border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>EY</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ff88] border-2 border-[#06140d] shadow-[0_0_8px_#00ff88]"></span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#eafff5] font-medium font-disp">Canlı Destek</div>
              <div className="text-[11px] text-[#00ff88] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>Eylül · çevrimiçi</div>
            </div>
            <button onClick={toggle} aria-label="Kapat" className="w-7 h-7 grid place-items-center rounded-lg text-[#74998a] hover:text-[#eafff5] hover:bg-white/5 transition-colors text-lg">×</button>
          </div>
          {/* body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) =>
          <div key={i} className={"flex " + (m.me ? 'justify-end' : 'justify-start')}>
                <div className={"max-w-[82%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed " + (m.me ? 'bg-[rgba(0,255,136,.1)] border border-[#103a26] text-[#cdeede] rounded-br-sm' : 'bg-[#04100a] border border-[#0c2719] text-[#cdeede] rounded-bl-sm')}>{m.t}</div>
              </div>
          )}
            {typing &&
          <div className="flex justify-start"><div className="px-4 py-3 rounded-xl rounded-bl-sm bg-[#04100a] border border-[#0c2719] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div></div>
          }
            {msgs.length <= 1 && !typing &&
          <div className="pt-1 flex flex-wrap gap-2">
                {quick.map((q, i) => <button key={i} onClick={() => push(q)} className="text-[11px] text-[#5cffba] border border-[#103a26] px-2.5 py-1.5 rounded-full bg-[rgba(0,255,136,.03)] hover:border-[#00ff88] transition-colors">{q}</button>)}
              </div>
          }
          </div>
          {/* input */}
          <div className="p-3 border-t border-[#0c2719] flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && push(input)} placeholder="Mesajını yaz…" className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-3.5 py-2.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none text-[13px]" />
            <button onClick={() => push(input)} aria-label="Mesaj Gönder" className="w-10 flex-none grid place-items-center font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">↑</button>
          </div>
        </div>
      }
      {/* LAUNCHER — hidden when panel is open */}
      {!open &&
      <button onClick={toggle} aria-label="Destek Sohbetini Aç/Kapat" className="ml-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00ff88] text-[#021008] shadow-[0_10px_30px_-6px_var(--glow)] hover:scale-105 transition-transform relative">
          {unread > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 grid place-items-center rounded-full bg-[#ff2e88] text-white text-[11px] font-bold border-2 border-[#020806]">{unread}</span>}
          <span className="absolute inset-0 rounded-2xl bg-[#00ff88] animate-ping opacity-20"></span>
          <span className="text-2xl">💬</span>
        </button>
      }
    </div>);

};

/* ============ APP ROOT ============ */
const pageTitles = {
  home: "Siber Güvenlik Uzmanı Ol | siberkampus — CTF & Hacking Laboratuvarları",
  blogs: "Blog | siberkampus — Güncel Siber Güvenlik Makaleleri",
  'blog-detail': "Blog Detay | siberkampus",
  rooms: "Hacking Laboratuvarları | siberkampus",
  login: "Giriş Yap | siberkampus",
  register: "Kayıt Ol | siberkampus",
  dashboard: "Kontrol Paneli | siberkampus",
  chat: "Sohbet | siberkampus",
  leaderboard: "Liderlik Sıralaması | siberkampus",
  admin: "Yönetim Paneli | siberkampus",
  category: "Kategori | siberkampus",
  roomArticle: "Ders Brifingi | siberkampus",
  profile: "Profilim | siberkampus",
  terms: "Kullanım Şartları | siberkampus",
  privacy: "Gizlilik Politikası | siberkampus",
  tools: "Siber Güvenlik Araçları & Hesaplayıcılar | siberkampus",
};

const updateSEOMeta = (p, d) => {
  let title = "Siber Güvenlik Uzmanı Ol | siberkampus — CTF & Hacking Laboratuvarları";
  let desc = "siberkampus, uygulamalı CTF görevleri ve hacking laboratuvarlarıyla sıfırdan siber güvenlik uzmanı olmanı sağlayan eğitim kampüsüdür.";
  let keys = "siber güvenlik, ctf, hacking laboratuvarı, siber ctf, ethical hacking, sızma testi, pentest, siber eğitim";
  const slug = p === 'tools' && d && d.slug;

  if (p === 'home') {
    title = "Siber Güvenlik Uzmanı Ol | siberkampus — CTF & Hacking Laboratuvarları";
    desc = "siberkampus, uygulamalı CTF görevleri ve hacking laboratuvarlarıyla sıfırdan siber güvenlik uzmanı olmanı sağlayan eğitim kampüsüdür.";
  } else if (p === 'blogs') {
    title = "Blog | siberkampus — Güncel Siber Güvenlik Makaleleri";
    desc = "Güncel siber güvenlik açıkları, web güvenliği, network güvenliği ve hacking rehberlerine dair teknik blog yazıları.";
  } else if (p === 'blog-detail' && d && d.title) {
    title = d.seo_title ? d.seo_title : `${d.title} | siberkampus`;
    desc = d.meta_description ? d.meta_description : `${d.excerpt || d.title + ' hakkında detaylı siber güvenlik makalesi.'}`;
    if (d.focus_keywords) {
      keys = d.focus_keywords;
    }
  } else if (p === 'category' && d) {
    const catName = typeof d === 'string' ? d : d.name || '';
    title = `${catName} | siberkampus`;
    desc = `${catName} kategorisindeki uygulamalı hacking ve CTF laboratuvarları. Sıfırdan pentest uzmanı ol.`;
  } else if (p === 'tools') {
    if (slug === 'reverse-shell') {
      title = "Online Reverse Shell Oluşturucu | siberkampus";
      desc = "Sızma testlerinde hedef makineye bağlantı sağlamak için Bash, Python, PHP, PowerShell ve Netcat reverse shell komutlarını online oluşturun.";
      keys = "reverse shell oluşturucu, reverse shell jeneratörü, bash reverse shell, python reverse shell, powershell reverse shell, netcat dinleyici";
    } else if (slug === 'encoder-decoder') {
      title = "Cyber Encoder/Decoder — Base64, Hex, URL, Binary ve HTML | siberkampus";
      desc = "Metinlerinizi Base64, Hexadecimal, URL, Binary ve HTML formatlarında online olarak şifreleyin ve çözün. Güvenli, hızlı ve tarayıcı tabanlı.";
      keys = "base64 çevirici, url encode decode, hex dönüştürücü, binary çevirici, html entity encode, cyber encoder decoder";
    } else if (slug === 'password-strength') {
      title = "Parola Güvenlik Testi & Entropi Hesaplama | siberkampus";
      desc = "Şifrenizin brute force (kaba kuvvet) saldırılarına karşı kırılma süresini online hesaplayın ve kriptografik olarak güvenli, güçlü parolalar üretin.";
      keys = "şifre gücü testi, parola entropi hesaplama, şifre kırılma süresi, güvenli şifre oluşturucu, brute force testi";
    } else if (slug === 'subnet-calc') {
      title = "CIDR & Subnet Hesaplayıcı (IP Alt Ağ Maskesi) | siberkampus";
      desc = "IP adresinizi ve CIDR değerini girerek ağ adresini, yayım adresini, IP aralığını ve kullanılabilir cihaz sayısını online hesaplayın.";
      keys = "subnet hesaplayıcı, cidr hesaplayıcı, ip alt ağ hesaplama, alt ağ maskesi, network ip hesaplama";
    } else if (slug === 'hash-tool') {
      title = "Online Hash Oluşturucu ve Tanımlayıcı (MD5, SHA-256) | siberkampus";
      desc = "Metinlerinizin MD5, SHA-1, SHA-256 ve SHA-512 özet çıktılarını online oluşturun veya bilinmeyen hash formatlarını anında tespit edin.";
      keys = "md5 oluşturucu, sha256 hesaplama, hash tanımlayıcı, hash tespit etme, hash jeneratörü, online hash tool";
    } else if (slug === 'xss-generator') {
      title = "XSS Payload Oluşturucu ve Filtre Atlatma Kiti | siberkampus";
      desc = "HTML, img, svg, iframe ve öznitelik bağlamlarında çalışan XSS payload'larını online oluşturun ve WAF filtre atlatma yöntemlerini test edin.";
      keys = "xss payload oluşturucu, xss jeneratörü, waf bypass payload, html entity xss, xss bypass kiti";
    } else if (slug === 'sqli-generator') {
      title = "SQL Injection (SQLi) Payload ve Bypass Jeneratörü | siberkampus";
      desc = "MySQL, PostgreSQL, MSSQL ve Oracle veritabanlarına yönelik Union, Error, Time ve Auth bypass SQL Injection test payload'larını online oluşturun.";
      keys = "sqli payload oluşturucu, sql injection jeneratörü, union based sqli, error based sqli, sql bypass payload";
    } else if (slug === 'cron-explainer') {
      title = "Cron Job Zamanlayıcı ve Türkçe Açıklayıcı | siberkampus";
      desc = "Linux cron job zaman ifadelerini Türkçe doğal dilde analiz edin veya görsel seçicilerle sıfırdan cron zamanlamaları tasarlayın.";
      keys = "cron zamanlayıcı, cron job açıklaması, cron ifadesi oluşturucu, crontab editör, cron türkçe açıklayıcı";
    } else if (slug === 'base64-file') {
      title = "Base64 Dosya & Görsel Dönüştürücü (Encoder/Decoder) | siberkampus";
      desc = "Görsellerinizi ve dosyalarınızı sunucuya göndermeden yerel tarayıcınızda Base64 koduna dönüştürün veya Base64 kodlarını dosyaya çevirip indirin.";
      keys = "dosyayı base64e çevirme, base64 dosya dönüştürücü, görsel base64 encoder, base64 to file, base64 decode";
    } else if (slug === 'dns-lookup') {
      title = "Online DNS Sorgulama ve E-posta Güvenlik Analizi | siberkampus";
      desc = "Alan adınızın A, MX, TXT kayıtlarını sorgulayın; mail sahteciliğini önleyen SPF ve DMARC güvenlik yapılandırmalarını online analiz edin.";
      keys = "dns sorgulama, spf sorgula, dmarc testi, mail güvenliği analizi, mx kaydı kontrolü, online dns lookup";
    } else {
      title = "Siber Güvenlik Araçları & Online Hesaplayıcılar | siberkampus";
      desc = "Tamamen tarayıcınızda çalışan, 100% istemci taraflı çalışan, SEO uyumlu siber güvenlik araç kiti. Reverse Shell, Subnet, Encoder, Hash, SQLi ve DNS araçları.";
      keys = "siber güvenlik araçları, online siber araçlar, hacking araçları, network hesaplayıcılar, web güvenliği araçları";
    }
  } else {
    const pageTitle = pageTitles[p] || "siberkampus";
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
  const canonicalUrl = (p === 'blog-detail' && d && d.canonical_url) ? d.canonical_url : `https://siberkampus.com${currentPath}`;
  canonicalLink.setAttribute('href', canonicalUrl);

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
  return `/${p}`;
};

const parseLocation = () => {
  const path = window.location.pathname;
  if (path === '/' || path === '') {
    return { page: 'home', data: null };
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
  if (path.startsWith('/pathway/')) {
    const slug = path.substring(9);
    return { page: 'pathway', data: slug };
  }
  if (path.startsWith('/docs/')) {
    const docId = path.substring(6);
    return { page: 'doc', data: { id: docId } };
  }
  if (path.startsWith('/category/')) {
    const catName = decodeURIComponent(path.substring(10));
    let catObj = null;
    if (window.SK_CATEGORIES) {
      catObj = window.SK_CATEGORIES.find(c => c.name === catName || c.slug === catName);
    }
    return { page: 'category', data: catObj || { name: catName, rooms: [] } };
  }
  if (path.startsWith('/rooms/') || path.startsWith('/brief/')) {
    const roomId = path.substring(7);
    const targetPage = path.startsWith('/brief/') ? 'roomArticle' : 'room';
    let roomObj = null;
    if (window.SK_CATEGORIES) {
      for (const cat of window.SK_CATEGORIES) {
        const found = cat.rooms.find(r => r.id === roomId);
        if (found) {
          roomObj = found;
          break;
        }
      }
    }
    return { page: targetPage, data: roomObj || { id: roomId } };
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
    const protectedPages = ['dashboard', 'room', 'leaderboard', 'chat', 'category', 'admin', 'profile'];
    let initialPage = parsed.page;
    let initialData = parsed.data;
    
    if (protectedPages.includes(initialPage) && !token) {
      initialPage = 'login';
      initialData = null;
    } else if ((initialPage === 'rooms' || initialPage === 'login' || initialPage === 'register') && token) {
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
    // Auth guards
    const protectedPages = ['dashboard', 'room', 'leaderboard', 'chat', 'category', 'admin', 'profile'];
    
    if (protectedPages.includes(p) && !token) {
      p = 'login';
      d = null;
    } else if ((p === 'rooms' || p === 'login' || p === 'register') && token) {
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
      window.gtag('config', 'G-E6M979Y8C4', {
        'page_path': path,
        'page_title': pageTitle
      });
    }
  };

  // Track initial page view and bind popstate listener
  useEffect(() => {
    // Replace initial state to sync history object
    const path = getPagePath(page, data);
    window.history.replaceState({ page, data }, "", path);

    // Dynamic Title, Meta Tags, Canonical URL & JSON-LD Structured Data for Initial Load
    updateSEOMeta(page, data);

    if (window.gtag) {
      window.gtag('config', 'G-E6M979Y8C4', {
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
      <LiveChat />
      
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