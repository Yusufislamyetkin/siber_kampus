import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = ({ navigate }) => {
  const matrixRef = useRef(null);
  const sphereRef = useRef(null);
  const termBodyRef = useRef(null);

  useEffect(() => {
    // Matrix rain animation
    if (matrixRef.current) {
      const cv = matrixRef.current;
      const ctx = cv.getContext('2d');
      const hero = cv.parentElement;
      let cols, drops;
      const fs = 15;
      const chars = 'アカサタナハマヤラ0123456789ABCDEF<>{}#$%&*ANGRSU01'.split('');

      const size = () => {
        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        cv.width = w;
        cv.height = h;
        cols = Math.floor(w / fs);
        drops = new Array(cols).fill(0).map(() => Math.random() * -50);
      };
      size();
      window.addEventListener('resize', size);

      const draw = () => {
        ctx.fillStyle = 'rgba(2,8,6,.10)';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = `${fs}px JetBrains Mono, monospace`;
        for (let i = 0; i < cols; i++) {
          const t = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fs;
          const y = drops[i] * fs;
          ctx.fillStyle = Math.random() > 0.975 ? '#eafff5' : `rgba(0,255,136,${Math.random() * 0.5 + 0.35})`;
          ctx.fillText(t, x, y);
          if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 1;
        }
        requestAnimationFrame(draw);
      };
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw();
      }
    }

    // Wireframe sphere
    if (sphereRef.current) {
      const cv = sphereRef.current;
      const ctx = cv.getContext('2d');
      let w = cv.parentElement.offsetWidth;
      let h = cv.parentElement.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr;
      cv.height = h * dpr;

      const N = 240;
      const pts = [];
      const off = 2 / N;
      const inc = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = i * off - 1 + off / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * inc;
        pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
      }

      let a = 0;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const frame = () => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        const cx = cv.width / 2;
        const cy = cv.height / 2;
        const R = Math.min(cv.width, cv.height) * 0.4;
        a += reduce ? 0 : 0.0035;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const cb = Math.cos(a * 0.6);
        const sb = Math.sin(a * 0.6);

        const proj = pts.map(p => {
          let [x, y, z] = p;
          let x1 = x * ca - z * sa;
          let z1 = x * sa + z * ca;
          let y1 = y * cb - z1 * sb;
          let z2 = y * sb + z1 * cb;
          const persp = 1.7 / (1.7 + z2);
          return {
            sx: cx + x1 * R * persp,
            sy: cy + y1 * R * persp,
            z: z2,
            s: persp
          };
        });

        for (let i = 0; i < proj.length; i++) {
          for (let j = i + 1; j < proj.length; j++) {
            const dx = proj[i].sx - proj[j].sx;
            const dy = proj[i].sy - proj[j].sy;
            const d = dx * dx + dy * dy;
            if (d < (38 * dpr) * (38 * dpr)) {
              const al = (1 - Math.sqrt(d) / (38 * dpr)) * 0.28 * ((proj[i].z + 1) / 2);
              ctx.strokeStyle = `rgba(0,255,136,${al})`;
              ctx.lineWidth = dpr * 0.6;
              ctx.beginPath();
              ctx.moveTo(proj[i].sx, proj[i].sy);
              ctx.lineTo(proj[j].sx, proj[j].sy);
              ctx.stroke();
            }
          }
        }

        proj.forEach(p => {
          const depth = (p.z + 1) / 2;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, (1.1 + depth * 2) * dpr, 0, 7);
          ctx.fillStyle = `rgba(${180 - depth * 180},255,${180 + depth * 40},${0.35 + depth * 0.6})`;
          ctx.fill();
        });

        requestAnimationFrame(frame);
      };
      frame();
    }

    // Terminal typing
    if (termBodyRef.current) {
      const el = termBodyRef.current;
      const lines = [
        { t: '$ ', c: 'text-[#00ff88]', x: 'nmap -sV target.lab', d: 55 },
        { t: '', c: 'text-[#74998a]', x: '  PORT     STATE  SERVICE', d: 8 },
        { t: '', c: 'text-[#74998a]', x: '  22/tcp   open   ssh', d: 8 },
        { t: '', c: 'text-[#74998a]', x: '  80/tcp   open   http', d: 8 },
        { t: '$ ', c: 'text-[#00ff88]', x: 'sqlmap -u "/login" --dump', d: 50 },
        { t: '', c: 'text-[#ffd166]', x: '  [!] injectable parameter found', d: 8 },
        { t: '', c: 'text-[#00ff88]', x: '  [+] admin hash extracted', d: 8 },
        { t: '$ ', c: 'text-[#00ff88]', x: 'cat /root/flag.txt', d: 55 },
        { t: '', c: 'text-[#00ff88]', x: '  FLAG{s1ber_kampus_pwn3d}', d: 8 },
        { t: '$ ', c: 'text-[#00ff88]', x: '_', d: 0, cur: true }
      ];

      let li = 0;
      const typeLine = () => {
        if (li >= lines.length) return;
        const L = lines[li];
        const div = document.createElement('div');
        const pre = document.createElement('span');
        pre.textContent = L.t;
        div.appendChild(pre);

        const span = document.createElement('span');
        span.className = L.c;
        div.appendChild(span);
        el.appendChild(div);

        if (L.cur) {
          const cu = document.createElement('span');
          cu.className = 'inline-block w-2 h-4 bg-[#00ff88] animate-pulse';
          div.appendChild(cu);
          li++;
          return;
        }

        let i = 0;
        const ch = () => {
          if (i <= L.x.length) {
            span.textContent = L.x.slice(0, i);
            i++;
            setTimeout(ch, L.d);
          } else {
            li++;
            setTimeout(typeLine, L.d > 20 ? 260 : 60);
          }
        };
        ch();
      };
      typeLine();
    }
  }, []);

  return (
    <>
      <Header navigate={navigate} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#0c2719]">
        <canvas ref={matrixRef} className="absolute inset-0 w-full h-full z-0 opacity-30" />
        
        <div className="absolute left-1/2 -bottom-[10%] w-[240%] h-[70%] -translate-x-1/2 z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.16) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
            transform: 'translateX(-50%) perspective(420px) rotateX(62deg)',
            maskImage: 'linear-gradient(to top,#000 0%,transparent 75%)',
            animation: 'floor 7s linear infinite'
          }} />

        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[900px] h-[560px] z-0 pointer-events-none"
          style={{background: 'radial-gradient(ellipse at center,rgba(0,255,136,.16),transparent 62%)'}} />

        <div className="max-w-5xl mx-auto px-8 relative z-10 grid grid-cols-[1.15fr_.85fr] gap-14 items-center py-24">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-pulse"></span>
              Türkiye'nin uygulamalı hacking kampüsü
            </div>
            
            <h1 className="text-6xl font-bold text-[#eafff5] mb-4 tracking-tight">
              <span className="text-[#00ff88] drop-shadow-[0_0_32px_rgba(0,255,136,.45)]">Siber Güvenlik</span><br />
              Uzmanı
            </h1>

            <div className="text-base text-[#74998a] max-w-xl mb-8 leading-relaxed space-y-4">
              <p>siberkampus, <strong className="text-[#cdeede] font-medium">siber güvenlik uzmanı</strong> olmak isteyen herkes için tasarlanmış, tamamen uygulamalı bir öğrenme kampüsüdür. Sıkıcı teori ezberlemek yerine gerçek saldırı senaryolarını birebir canlandıran <strong className="text-[#cdeede] font-medium">CTF görevleri</strong> ve <strong className="text-[#cdeede] font-medium">hacking laboratuvarları</strong> üzerinde çalışırsın.</p>
              <p>İster siber güvenliğe yeni başlayan bir öğrenci ol, ister kariyerini bu alana taşımak isteyen biri; sıfırdan başlayıp adım adım gerçek bir uzmana dönüşmen için gereken her şeyi tek bir platformda bulursun.</p>
              <p>Web zafiyetlerinden ağ analizine, zararlı yazılım incelemesinden dijital adli bilişime kadar onlarca konuyu tarayıcının içinde, hiçbir kurulum yapmadan deneyimlersin.</p>
            </div>

            <div className="flex gap-4 flex-wrap items-center">
              <button className="bg-[#00ff88] text-[#021008] px-7 py-4 font-bold text-sm rounded-none hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] hover:-translate-y-0.5 transition-all"
                style={{clipPath: 'polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)'}}>
                İlk Laboratuvarını Çöz →
              </button>
              <button className="border border-[#103a26] text-[#cdeede] px-7 py-4 text-sm hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">
                CTF Görevlerini Gör
              </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-gradient-to-br from-[#06140d] to-[#040d08] border border-[#103a26] rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-[#0c2719] bg-black bg-opacity-25">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              <span className="ml-2 text-xs text-[#3d564b]">root@siberkampus: ~/lab-07-web-exploit</span>
            </div>
            <div ref={termBodyRef} className="p-4.5 min-h-[240px] text-sm leading-7 font-mono"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-[#0c2719] bg-gradient-to-b from-[#04100a] to-[#020806]">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-4 gap-0">
          {[
            { num: '12.400', label: 'Aktif Öğrenci', suffix: '+' },
            { num: '380', label: 'Hacking Laboratuvarı', suffix: '+' },
            { num: '90', label: 'CTF Görevi', suffix: '+' },
            { num: '94', label: 'Tamamlama Oranı', suffix: '%' }
          ].map((stat, i) => (
            <div key={i} className="py-11 px-7 text-center border-l border-[#0c2719] first:border-l-0">
              <div className="text-4xl font-bold text-[#00ff88] drop-shadow-[0_0_26px_rgba(0,255,136,.3)]">{stat.num}{stat.suffix}</div>
              <div className="text-xs text-[#74998a] mt-2 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-28 bg-gradient-to-b from-[#020806] to-[#04100a]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-widest text-[#00ff88] uppercase mb-4">// Neden siberkampus</p>
            <h2 className="text-4xl font-bold text-[#eafff5] mb-4">Seni Gerçekten Uzman Yapan Kampüs</h2>
            <p className="text-[#74998a]">Video izleyip unuttuğun kurslardan değil; her gün kendini test ettiğin, savaştığın ve kazandığın canlı bir laboratuvardan bahsediyoruz.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { num: '01', icon: '⚡', title: 'Kurulumsuz Laboratuvar', desc: 'Sanal makine, dual boot, bozuk yapılandırma yok. Tarayıcını aç, "Başlat" de ve saniyeler içinde canlı bir hedef sistemin karşısında ol.' },
              { num: '02', icon: '⌖', title: 'Gerçek Saldırı Senaryoları', desc: 'Her görev, sahada karşına çıkacak gerçek zafiyetlerden üretildi. Sahte sorular değil, gerçek sistemleri ele geçirme deneyimi.' },
              { num: '03', icon: '↯', title: 'Anlık Geri Bildirim', desc: 'Bayrağı yakaladığın an puanın artar, ilerlemen kaydedilir. Nerede hata yaptığını anında görür, eksiğini hemen kapatırsın.' },
              { num: '04', icon: '◈', title: 'Mentör Desteği', desc: 'Takıldığın yerde alanında çalışan gerçek pentester\'lardan ipucu ve geri bildirim al. Yalnız öğrenmek zorunda değilsin.' },
              { num: '05', icon: '⬡', title: 'Rozet & Sertifika', desc: 'Tamamladığın her yol için doğrulanabilir rozetler ve sertifikalar kazan. CV\'ne ve LinkedIn\'ine ekleyebileceğin somut kanıtlar.' },
              { num: '06', icon: '⟁', title: 'Kariyer Yönlendirme', desc: 'Beceri profilin işe alım yapan şirketlere açılır. Hangi pozisyona hazır olduğunu görür, doğru fırsatlarla eşleşirsin.' }
            ].map((card, i) => (
              <div key={i} className="bg-gradient-to-br from-[#07150e] to-[#04100a] border border-[#0c2719] rounded-2xl p-7 hover:border-[#103a26] hover:-translate-y-1 transition-all relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff88] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform"></div>
                <span className="absolute top-6 right-6 text-xs text-[#3d564b]">{card.num}</span>
                <div className="w-11 h-11 border border-[#103a26] rounded-lg flex items-center justify-center text-[#00ff88] mb-5 bg-[rgba(0,255,136,.04)]">{card.icon}</div>
                <h3 className="text-lg text-[#eafff5] mb-3 font-bold">{card.title}</h3>
                <p className="text-sm text-[#74998a] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-gradient-to-b from-[#04100a] to-[#020806]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs tracking-widest text-[#00ff88] uppercase mb-4">// Topluluk</p>
            <h2 className="text-4xl font-bold text-[#eafff5]">Klavyenin Başına Geçenler Ne Diyor?</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { mark: '"', text: 'Üniversitede teori öğrendim ama ilk defa siberkampus\'ta gerçek bir sistemi ele geçirdim. 3 ay sonra ilk SOC analisti işime başladım. Laboratuvarlar olmasa bu hızda olmazdı.', name: 'Arda K.', role: 'SOC Analisti · eski öğrenci', av: 'AK' },
              { mark: '"', text: 'Muhasebeden geliyorum, kod bile bilmiyordum. Yol haritası beni elimden tutup götürdü. Her CTF görevini çözdükçe özgüvenim arttı. Şimdi pentester olarak çalışıyorum.', name: 'Melis Y.', role: 'Sızma Testi Uzmanı · kariyer değiştirdi', av: 'MY' },
              { mark: '"', text: 'Kurulumla uğraşmadan tarayıcıdan her şeye erişebilmek inanılmaz. Gece 2\'de laboratuvar açıp bayrak avlıyorum. Bağımlılık yapıyor ama en iyi türden.', name: 'Emre Ç.', role: 'Bilgisayar Müh. öğrencisi', av: 'EÇ' }
            ].map((q, i) => (
              <div key={i} className="bg-[#07150e] border border-[#0c2719] rounded-2xl p-7">
                <p className="text-4xl text-[#00ff88] opacity-35 leading-none h-7 mb-3">{q.mark}</p>
                <p className="text-[#cdeede] text-sm leading-relaxed mb-6">{q.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0a3a24] to-[#052b18] flex items-center justify-center text-[#5cffba] font-bold text-xs border border-[#103a26]">{q.av}</div>
                  <div>
                    <div className="text-sm text-[#eafff5] font-medium">{q.name}</div>
                    <div className="text-xs text-[#74998a]">{q.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-y border-[#0c2719]">
        <div className="absolute left-1/2 bottom-0 w-[240%] h-[70%] -translate-x-1/2 z-0 opacity-50"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.16) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
            transform: 'translateX(-50%) perspective(420px) rotateX(62deg)'
          }} />

        <div className="max-w-5xl mx-auto px-8 relative z-10 text-center py-24">
          <h2 className="text-5xl font-bold text-[#eafff5] mb-4">Bugün İlk <span className="text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,.4)]">Bayrağını</span> Yakala.</h2>
          <p className="text-[#74998a] max-w-2xl mx-auto mb-8">Kredi kartı yok, kurulum yok, bahane yok. Tarayıcını aç ve ilk hacking laboratuvarını ücretsiz çöz.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-[#00ff88] text-[#021008] px-7 py-4 font-bold text-sm rounded-none hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
              style={{clipPath: 'polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)'}}>
              Ücretsiz Hesap Aç →
            </button>
            <button className="border border-[#103a26] text-[#cdeede] px-7 py-4 text-sm hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">
              Görevleri İncele
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>
  );
};

export default HomePage;
