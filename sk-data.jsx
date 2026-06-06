/* ===========================================================================
   siberkampus — Room & Category Data + Category Page
   Shared data source for rooms, categories, badges.
   =========================================================================== */

const SK_CATEGORIES = [
  {
    slug: 'web-exploitation', name: 'Web Exploitation', icon: '🌐', color: '#00ff88',
    desc: 'SQL Injection, XSS, CSRF ve daha fazlası — web uygulamalarındaki zafiyetleri keşfet ve sömür.',
    rooms: [
      { id: 'web-01', name: 'SQL Injection Temelleri', difficulty: 'Başlangıç', desc: 'Temel SQLi tekniklerini öğren ve ilk bayrağını yakala.', users: 3420, points: 50 },
      { id: 'web-04', name: 'XSS (Reflected)', difficulty: 'Başlangıç', desc: 'Reflected XSS ile cookie çalma.', users: 2890, points: 50 },
      { id: 'web-11', name: 'Varsayılan Parola Sömürüsü', difficulty: 'Başlangıç', desc: 'Router yöneticisinin varsayılan kimlik bilgileriyle giriş yapma.', users: 2340, points: 50 },
      { id: 'web-12', name: 'Komut Enjeksiyonu Temelleri', difficulty: 'Başlangıç', desc: 'Ping panelinden komut enjeksiyonu ile bayrak okuma.', users: 2100, points: 50 },
      { id: 'web-13', name: 'Kaynak Kod Analizi', difficulty: 'Başlangıç', desc: 'HTML yorum satırlarında gizlenen bayrağı bulma.', users: 1950, points: 50 },
      { id: 'web-14', name: 'Dizin Geçişi Temelleri', difficulty: 'Başlangıç', desc: '../ ile yol traversal yaparak sunucu dosyalarını okuma.', users: 1800, points: 50 },
      { id: 'web-15', name: 'Çerez Manipülasyonu', difficulty: 'Başlangıç', desc: 'İstemci tarafı çerezleri değiştirerek yetki yükseltme.', users: 1650, points: 50 },
      { id: 'web-02', name: 'UNION-Based SQLi', difficulty: 'Orta', desc: 'UNION SELECT ile çoklu tablo dump etme.', users: 2150, points: 75 },
      { id: 'web-05', name: 'XSS (Stored & DOM)', difficulty: 'Orta', desc: 'Kalıcı XSS ve DOM manipülasyonu.', users: 1670, points: 75 },
      { id: 'web-06', name: 'CSRF Saldırıları', difficulty: 'Orta', desc: 'Cross-Site Request Forgery ile işlem tetikleme.', users: 1340, points: 70 },
      { id: 'web-03', name: 'Blind SQL Injection', difficulty: 'İleri', desc: 'Boolean ve time-based blind injection.', users: 980, points: 100 },
      { id: 'web-07', name: 'File Upload Bypass', difficulty: 'İleri', desc: 'Dosya yükleme filtrelerini atlatma ve shell alma.', users: 890, points: 100 },
      { id: 'web-08', name: 'SSRF & XXE', difficulty: 'İleri', desc: 'Server-Side Request Forgery ve XML Entity injection.', users: 650, points: 120 },
      { id: 'web-09', name: 'JWT Token Exploitation', difficulty: 'Uzman', desc: 'JWT zafiyetleri: none algorithm, key confusion.', users: 420, points: 150 },
    ]
  },
  {
    slug: 'network-pentest', name: 'Ağ Sızma Testi', icon: '🔗', color: '#5cffba',
    desc: 'Ağ keşfi, port tarama, servis sömürüsü ve pivotlama — kurumsal ağlara sızma.',
    rooms: [
      { id: 'net-01', name: 'Nmap ile Ağ Keşfi', difficulty: 'Başlangıç', desc: 'Port tarama, servis tespiti ve OS fingerprinting.', users: 3100, points: 50 },
    ]
  },
];

const SK_ALL_ROOMS = SK_CATEGORIES.flatMap(c => c.rooms.map(r => ({ ...r, cat: c.name, catSlug: c.slug, catIcon: c.icon })));

const SK_ALL_BADGES = [
  // Rozet tanımları — durum bilgisi getDynamicBadges() ile runtime'da hesaplanır
  { icon: '🥇', name: 'Hacker Başlangıcı', desc: 'İlk laboratuvarını çöz' },
  { icon: '🔥', name: '7 Gün Seri', desc: '7 gün üst üste giriş yap' },
  { icon: '🌐', name: 'Web Avcısı', desc: '5 web görevini tamamla' },
  { icon: '⚡', name: 'Hızlı Parmaklar', desc: 'Bir görevi tamamla' },
  { icon: '🔓', name: 'İlk Kan', desc: 'Bir bayrağı yakala' },
  { icon: '📡', name: 'Ağ Takipçisi', desc: '5 ağ görevi tamamla' },
  { icon: '⭐', name: 'Uzman Seviyesi', desc: 'Level 8\'e ulaş' },
  { icon: '🏆', name: "İlk 50'de", desc: 'Liderlik tablosunda ilk 50' },
  { icon: '🎯', name: 'CTF Mimarı', desc: '5 CTF zincirini tamamla' },
  { icon: '🌙', name: 'Gece Kuşu', desc: 'Gece 02:00\'de görev çöz' },
  { icon: '🛡️', name: 'Savunmacı', desc: 'Blue team görevlerini bitir' },
  { icon: '👑', name: 'Efsane', desc: '100.000 puana ulaş' },
  { icon: '💀', name: 'Root Master', desc: '10 sisteme root ol' },
  { icon: '🏅', name: '30 Gün Seri', desc: '30 gün üst üste giriş yap' },
  { icon: '💎', name: 'Tam Koleksiyon', desc: 'Tüm rozetleri kazan' },
];

// Export to window for cross-scope access
const MENTOR_LESSONS_INFO = {
  // web exploitation
  'web-01': {
    scenario: "Merhaba {name}. Hedef uygulamanın giriş panelinde girdilerin parametrik olmayan sorgularla doğrudan SQL motoruna gönderildiğini fark ettik. Bu giriş formunu manipüle etmeli ve admin paneline erişim sağlamalısın.",
    goals: [
      "SQL sorgularının backend mantığını anlamak",
      "Kimlik doğrulama bypass tekniklerini kavramak",
      "Giriş formlarında SQL enjeksiyon açıklarını test etmek"
    ],
    realWorld: "Gerçek sızma testlerinde bu tür bypass açıkları sistemlerin saniyeler içinde ele geçirilmesine yol açar. Geliştiricilere Parametrik Sorgular (Prepared Statements) kullanmalarını tavsiye etmelisin.",
    learned: [
      "SQL enjeksiyon zafiyetini tespit etmeyi öğrendin.",
      "Giriş formlarında SQL mantıksal sorgularını (`OR 1=1`) kullanarak bypass yapabildin."
    ]
  },
  'web-04': {
    scenario: "Merhaba {name}. Arama kutusuna yazılan girdilerin hiçbir filtrelemeden geçirilmeden sayfaya yansıtıldığını (reflected) gördük. Bir javascript kodu enjekte ederek kurbanın tarayıcısında çalıştırmalı ve oturum anahtarını (cookie) ele geçirmelisin.",
    goals: [
      "Reflected XSS zafiyetinin çalışma mantığı",
      "JavaScript enjeksiyonu ile cookie çalma",
      "Girdi temizleme ve çıktı kodlama prensipleri"
    ],
    realWorld: "Reflected XSS, kimlik avı (phishing) saldırılarıyla birleştiğinde kurbanların oturumlarını çalmak için birebirdir. Çözüm için HttpOnly cookie bayrağını ve CSP (Content Security Policy) politikalarını önermelisin.",
    learned: [
      "Reflected XSS açığı barındıran parametreleri keşfetmeyi öğrendin.",
      "Kurbanın oturum bilgilerini çalmak için JavaScript payload'ları geliştirdin."
    ]
  },
  'web-02': {
    scenario: "Merhaba {name}. Web sayfasındaki ürün listeleme parametresinin SQL enjeksiyonuna açık olduğunu gördük. SQL sorgularına `UNION SELECT` ekleyerek veritabanındaki diğer tablolardan (örneğin kullanıcılar ve şifreler) veri sızdırmalısın.",
    goals: [
      "Sorgu sütun sayısını tespit etme (`ORDER BY`)",
      "UNION SELECT ile veri birleştirme",
      "Veritabanı şeması, tablo ve kolon isimlerini dökme"
    ],
    realWorld: "UNION-based SQLi, bir hacker'ın veritabanındaki tüm hassas verileri (kullanıcılar, şifreler, kredi kartları) saniyeler içinde indirmesine (dump) olanak tanır. Çözüm kesinlikle ORM kullanmak ya da parametrik sorgulara geçmektir.",
    learned: [
      "Sütun sayısını ve veri tiplerini eşleştirmeyi öğrendin.",
      "Veritabanındaki gizli tabloları dökerek admin şifrelerini sızdırdın."
    ]
  },
  'web-05': {
    scenario: "Merhaba {name}. Yorum yapma alanında gönderilen yorumların veritabanına kaydedildiğini ve sayfayı ziyaret eden herkese gösterildiğini tespit ettik. Kalıcı (stored) bir XSS payload'u yazarak admin panelini ziyaret eden adminin oturumunu ele geçirmelisin.",
    goals: [
      "Stored ve DOM tabanlı XSS arasındaki farklar",
      "Veritabanına javascript kodu enjekte etme",
      "DOM manipülasyonu ile client-side sömürü"
    ],
    realWorld: "Stored XSS, en tehlikeli XSS türüdür çünkü tek bir enjeksiyonla sayfaya giren yüzlerce kullanıcının oturumu çalınabilir veya tarayıcıları exploit kitlere yönlendirilebilir.",
    learned: [
      "Kalıcı XSS zafiyetlerini veritabanı girdileri üzerinden sömürmeyi öğrendin.",
      "DOM nesnelerini manipüle ederek istemci taraflı siber saldırı gerçekleştirdin."
    ]
  },
  'web-06': {
    scenario: "Merhaba {name}. Kullanıcı şifre değiştirme formunda CSRF koruma token'larının bulunmadığını veya doğrulanmadığını fark ettik. Kurbana sahte bir istek tetikleterek onun haberi olmadan şifresini değiştirecek bir HTML payload'u hazırlamalısın.",
    goals: [
      "CSRF (Cross-Site Request Forgery) mantığı",
      "Otomatik tetiklenen sahte form hazırlama",
      "SameSite çerez politikaları"
    ],
    realWorld: "CSRF, kullanıcıların tarayıcılarında açık olan oturumları kullanarak onların adına yetkisiz işlemler (para transferi, e-posta değiştirme vb.) yapılmasına neden olur. Çözüm olarak benzersiz Anti-CSRF Token'ları kullanılmalıdır.",
    learned: [
      "CSRF açığı barındıran hassas işlem formlarını tespit etmeyi öğrendin.",
      "Oturum açıkken arka planda istek tetikleyen sahte form senaryoları tasarladın."
    ]
  },
  'web-03': {
    scenario: "Merhaba {name}. Hedef uygulamanın girişinde SQL hataları gösterilmiyor ve veri ekrana yansımıyor. Ancak sorgunun doğru veya yanlış olmasına göre sayfa farklı yanıtlar veriyor (veya gecikiyor). Boolean ve Time-based tekniklerle karakter karakter veri sızdırmalısın.",
    goals: [
      "Kör (Blind) SQL enjeksiyon kavramı",
      "SUBSTRING, ASCII ve SLEEP fonksiyonları kullanımı",
      "Koşullu mantıkla veritabanından harf harf veri sızdırma"
    ],
    realWorld: "Blind SQLi, ekranda çıktı veya hata vermeyen sessiz sistemlerde bile tüm veritabanını dökebilmeyi sağlar. Otomatize araçlar (sqlmap gibi) arka planda binlerce boolean/time sorgusu atarak çalışır.",
    learned: [
      "Hata mesajı vermeyen sistemlerde SQLi varlığını doğrulamayı öğrendin.",
      "Zaman gecikmesi (time-based) veya mantıksal farklar (boolean-based) ile veri sızdırma algoritmasını kavradın."
    ]
  },
  'web-07': {
    scenario: "Merhaba {name}. Profil resmi yükleme alanında dosya uzantısı kontrolünün yalnızca istemci tarafında veya yetersiz yapıldığını belirledik. Filtreleri atlatarak (bypass) sisteme bir PHP Web Shell yüklemeli ve sunucuda kod çalıştırmalısın.",
    goals: [
      "Client-side filtreleri atlatma",
      "MIME-Type ve Double Extension (çift uzantı) bypass",
      "Web Shell kullanarak sunucuda uzaktan kod çalıştırma (RCE)"
    ],
    realWorld: "File Upload bypass zafiyetleri, saldırganların sunucunun tam kontrolünü ele geçirmesine (RCE) yol açar. Sunucu tarafında dosya uzantısı, içerik tipi doğrulanmalı ve yüklenen dosyalar çalıştırılamayan bir dizine atılmalıdır.",
    learned: [
      "Farklı dosya yükleme filtreleme yöntemlerini (uzantı, MIME, magic numbers) aşmayı öğrendin.",
      "Web shell yükleyerek sunucu işletim sistemi düzeyinde komut çalıştırma yetkisi kazandın."
    ]
  },
  'web-08': {
    scenario: "Merhaba {name}. Web uygulaması dışarıdan aldığı URL veya XML verilerini sunucu tarafında işliyor. SSRF ile sunucuya içerideki gizli ağ servislerini taratmalı, XXE ile XML parser'ı manipüle edip sunucu üzerindeki `/etc/passwd` dosyasını okumalısın.",
    goals: [
      "Server-Side Request Forgery (SSRF) ile iç ağ keşfi",
      "XML External Entity (XXE) zafiyeti ile dosya okuma",
      "Dış entity tanımları ile veri sızdırma"
    ],
    realWorld: "SSRF ve XXE, bulut altyapılarında (AWS, GCP metadata servisleri vb.) internal anahtarları ele geçirmek ve iç ağdaki korumalı sistemlere sızmak için son derece kritik açıklardır.",
    learned: [
      "Sunucu üzerinden iç ağa yönelik istekler göndermeyi öğrendin.",
      "Güvensiz XML kütüphanelerinin yerel dosyaları sızdırmak için nasıl sömürüldüğünü anladın."
    ]
  },
  'web-09': {
    scenario: "Merhaba {name}. Uygulamanın kullandığı JSON Web Token (JWT) mekanizmasında imza doğrulamasının `none` algoritmasıyla bypass edilebildiğini veya zayıf bir anahtar kullanıldığını gördük. Token'ı manipüle ederek admin rolünü almalı ve içeri sızmalısın.",
    goals: [
      "JWT yapısı (Header, Payload, Signature)",
      "Algoritma karıştırma ve `none` algoritması açığı",
      "Token manipülasyonu ve yetki yükseltme"
    ],
    realWorld: "JWT zafiyetleri, API tabanlı modern uygulamalarda en çok karşılaşılan yetkilendirme hatalarındandır. Güçlü imza algoritmaları (RS256) seçilmeli ve sunucu tarafında imza asla boş geçilmemelidir.",
    learned: [
      "JWT yapısını decode edip içindeki parametreleri manipüle etmeyi öğrendin.",
      "`none` algoritması kullanarak imza doğrulamasını tamamen devre dışı bırakmayı başardın."
    ]
  },
  'web-11': {
    scenario: "Merhaba {name}. Şirketteki ağ router'ının yönetim paneline erişmemiz gerekiyor. Cihazın varsayılan fabrika ayarları hiç değiştirilmemiş. Varsayılan kimlik bilgilerini (admin/admin) kullanarak kontrol paneline giriş yap ve router bayrağını oku.",
    goals: [
      "Varsayılan kimlik bilgilerin risklerini anlamak",
      "Ortak varsayılan parolaları bilmek (admin/admin, root/root vb.)",
      "Ağ cihazlarının yönetim panellerine erişim sağlamak"
    ],
    realWorld: "Güvenlik incelemelerde kurumsal ağ cihazlarının (switch, router, firewall) hiç güncellenmemiş ve varsayılan parolaları kullanıyor olduğu sıkça görülür. Bu durumda tüm ağ altyapısı ele geçirilebilir. Varsayılan parolaları değiştirmek temel güvenlik uygulamalarından biridir.",
    learned: [
      "Varsayılan kimlik bilgileriyle ağ cihazlarına erişmeyi öğrendin.",
      "Router yönetim panelinde ayrıcalıklı bilgilere ulaştın."
    ]
  },

  'web-12': {
    scenario: "Merhaba {name}. Şirketteki ağ yöneticileri bir ping atma utility'si geliştirmişler. Kullanıcı girdisini hiçbir doğrulama yapılmadan doğrudan shell komutuna aktarıyorlar. Komut ayırıcı karakterler kullanarak ek komutlar enjekte et ve flag.txt dosyasını oku.",
    goals: [
      "Komut enjeksiyonu zafiyetinin çalışma mekanizması",
      "Shell komut ayırıcılarını kullanma (;, |, &&, ||)",
      "Arka planda istemci olmadan komut çalıştırma"
    ],
    realWorld: "Komut enjeksiyonu zafiyetleri, saldırganın sunucu üzerinde doğrudan işletim sistemi komutları çalıştırmasına (RCE) olanak tanır. Bu tür açıklar en tehlikeli olanlarındandır. Tüm kullanıcı girdileri düzenlenmelidir (whitelist/blacklist) veya sistem komutları hiç çağrılmamalıdır.",
    learned: [
      "Shell komut ayırıcılarıyla komut enjeksiyonu gerçekleştirmeyi öğrendin.",
      "Bir sistem komutunun yan etkisini kullanarak rastgele kod çalıştırmayı başardın."
    ]
  },

  'web-13': {
    scenario: "Merhaba {name}. Web sitesinin HTML kaynak kodlarında geliştiriciler tarafından gizlenen yorum satırları var. Tarayıcının geliştirici araçlarını (DevTools) açıp sayfa kaynağını inceleyerek, HTML yorumların içinden bayrak kısıtını oku.",
    goals: [
      "Tarayıcı geliştirici araçlarını kullanmak",
      "HTML kaynak kodunu incelemek",
      "Gizli yazıları ve açıklamaları yorumlarda bulma"
    ],
    realWorld: "Geliştiriciler test sırasında kod içerisine geçici notlar, API anahtarları, veya test bayraklarıyla birlikte yorum satırları bırakabilirler. Proje yayına çıkmadan önce bu tür hassas bilgilerin dikkatli şekilde temizlenmesi şarttır. Kaynak kod analizi, sızma testlerinin ilk adımlarından biridir.",
    learned: [
      "Tarayıcı DevTools ile sayfa kaynağını analiz etmeyi öğrendin.",
      "HTML yorum satırlarında gizlenen hassas bilgileri bulmayı başardın."
    ]
  },

  'web-14': {
    scenario: "Merhaba {name}. Dosya indirme modülünde bir dizin geçişi (directory traversal) zafiyeti var. Kullanıcıdan alınan dosya adı parametresi hiçbir doğrulama yapılmadan dosya sistemi yoluna katılıyor. Üst dizinlere tırmanarak sunucu kök dizininde bulunan flag.txt dosyasını oku.",
    goals: [
      "Dizin geçişi (path traversal) mekanizması",
      "Göreli yol (./) ve üst dizin (..) notasyonunun kullanımı",
      "Dosya sistemi yapısını keşfetme"
    ],
    realWorld: "Dizin geçişi zafiyetleri, saldırganın sunucu dosya sisteminderesim, yapılandırma, veya şifre dosyaları gibi hassas dosyalara erişmesini sağlar. Belirtilen dizin dışına çıkılmasını engellemeyen güvensiz yapılandırmalara örnek olarak index dosyaları da verilebilebilir.",
    learned: [
      "Dosya indirme parametreleri aracılığıyla dizin yapısını traverse etmeyi öğrendin.",
      "Sunucu kök dizinine erişerek korumalı dosyaları okumayı başardın."
    ]
  },

  'web-15': {
    scenario: "Merhaba {name}. E-ticaret sitesinin giriş sayfası, kullanıcının rolünü (guest/admin) şifrelenmemiş bir çerezde saklamaktadır. Tarayıcı DevTools'u açıp çerez değerini admin olarak değiştir ve yönetim paneline erişim sağla.",
    goals: [
      "Çerez yönetimi ve istemci tarafı depolama mekanizmaları",
      "Şifrelenmemiş çerezlerin riskleri",
      "Yetkilendirme bypass tekniklerini anlamak"
    ],
    realWorld: "Yetkilendirme verileri hiçbir şekilde istemci tarafında saklanmamalıdır. Sunucu tarafında tutulan oturum bilgileri, şifreleme, ve dijital imza olmadan istemci verilerine hiç güvenilmemelidir. Çerez manipülasyonu, çoğu web sitesinde yetkisiz erişimin en kolay yollarından biridir.",
    learned: [
      "DevTools aracılığıyla çerez bilgilerini incelemek ve düzenlemeyi öğrendin.",
      "Çerez manipülasyonuyla yetki yükseltme (privilege escalation) başardın."
    ]
  },

  // network pentest
  'net-01': {
    scenario: "Merhaba {name}. Sızma testinin ilk adımı keşiftir. Nmap aracını kullanarak hedef sistemin açık portlarını, çalışan servislerini ve işletim sistemini tespit etmelisin.",
    goals: [
      "Port tarama ve servis sürümü tespiti (`-sV`)",
      "İşletim sistemi tespiti (`-O`) ve hızlı tarama (`-F`)",
      "Nmap Scripting Engine (NSE) kullanımı"
    ],
    realWorld: "Pentest projelerinde ağ keşfi yapılmadan hiçbir saldırı planlanamaz. Açık servislerin ve versiyonların tespiti, doğrudan bilinen exploit'leri aramaya yönlendirir.",
    learned: [
      "Açık portları ve servis versiyonlarını doğru analiz etmeyi öğrendin.",
      "İşletim sistemi analizi ve agresif tarama yöntemlerini kavradın."
    ]
  }
};

// ======== LEARNING PATHWAYS (İlerleme Haritası) ========

const SK_PATHWAYS = [
  {
    slug: 'web-pentest',
    name: 'Web Pentest Uzmanı Yolu',
    icon: '🌐',
    color: '#00ff88',
    desc: 'Sıfırdan web sızma testi uzmanına — teori, pratik ve gerçek hedef sitelerde pentest.',
    phases: [
      {
        id: 'phase-1',
        name: 'Teori & Ortam Kurulumu',
        desc: 'Araçlarını kur, temel kavramları öğren.',
        icon: '📚',
        order: 1,
        type: 'theory',
        items: [
          { type: 'doc', id: 'doc-kali-setup', name: 'Kali Linux & Burp Suite Kurulumu', readTime: '15 dk', required: true },
          { type: 'doc', id: 'doc-http-basics', name: 'HTTP Protokolü & Web Mimarisi', readTime: '12 dk', required: true },
          { type: 'doc', id: 'doc-devtools', name: 'Tarayıcı DevTools Kullanımı', readTime: '8 dk', required: true },
        ]
      },
      {
        id: 'phase-2',
        name: 'Temel Zafiyetler',
        desc: 'Başlangıç seviyesi web zafiyetlerini keşfet ve sömür.',
        icon: '🔓',
        order: 2,
        type: 'practice',
        requires: ['phase-1'],
        items: [
          { type: 'room', id: 'web-13' },
          { type: 'room', id: 'web-11' },
          { type: 'room', id: 'web-15' },
          { type: 'room', id: 'web-01' },
          { type: 'room', id: 'web-04' },
          { type: 'room', id: 'web-14' },
          { type: 'room', id: 'web-12' },
        ]
      },
      {
        id: 'phase-3',
        name: 'Orta Seviye Saldırılar',
        desc: 'Daha karmaşık zafiyet zincirleri ve istek manipülasyonu.',
        icon: '⚡',
        order: 3,
        type: 'practice',
        requires: ['phase-2'],
        items: [
          { type: 'doc', id: 'doc-burp-proxy', name: 'Burp Suite Proxy ile İstek Manipülasyonu', readTime: '10 dk', required: true },
          { type: 'room', id: 'web-02' },
          { type: 'room', id: 'web-05' },
          { type: 'room', id: 'web-06' },
        ]
      },
      {
        id: 'phase-4',
        name: 'İleri Seviye Saldırılar',
        desc: 'Shell alma, dosya yükleme bypass, SSRF ve JWT sömürüsü.',
        icon: '🔥',
        order: 4,
        type: 'practice',
        requires: ['phase-3'],
        items: [
          { type: 'doc', id: 'doc-shells', name: 'Web Shell & Reverse Shell Temelleri', readTime: '10 dk', required: true },
          { type: 'room', id: 'web-03' },
          { type: 'room', id: 'web-07' },
          { type: 'room', id: 'web-08' },
          { type: 'room', id: 'web-09' },
        ]
      },
      {
        id: 'phase-5',
        name: 'Gerçek Pentest Operasyonu',
        desc: 'Canlı hedef sitelerde tam sızma testi gerçekleştir.',
        icon: '💀',
        order: 5,
        type: 'pentest',
        requires: ['phase-4'],
        premium: true,
        items: [
          { type: 'doc', id: 'doc-pentest-methodology', name: 'Pentest Metodolojisi & Raporlama', readTime: '15 dk', required: true },
          { type: 'target', id: 'target-01', name: 'Hedef Site 1: Keşif & Temel Zafiyetler', targetUrl: 'https://target1.siberkampus.org', flagCount: 5 },
          { type: 'target', id: 'target-02', name: 'Hedef Site 2: Orta Seviye Sömürü', targetUrl: 'https://target2.siberkampus.org', flagCount: 4 },
          { type: 'target', id: 'target-03', name: 'Hedef Site 3: İleri Seviye & Shell', targetUrl: 'https://target3.siberkampus.org', flagCount: 3 },
          { type: 'target', id: 'target-04', name: 'Hedef Site 4: Tam Pentest Operasyonu', targetUrl: 'https://target4.siberkampus.org', flagCount: 6 },
        ]
      }
    ]
  }
];

// Resolve room details from SK_CATEGORIES into pathway items
const SK_ROOMS_MAP = {};
SK_ALL_ROOMS.forEach(r => { SK_ROOMS_MAP[r.id] = r; });

function getPathwayItemDetails(item) {
  if (item.type === 'room') {
    const r = SK_ROOMS_MAP[item.id];
    return r ? { ...item, name: r.name, difficulty: r.difficulty, points: r.points, users: r.users, desc: r.desc } : item;
  }
  return item;
}

function isPhaseComplete(pathway, phaseId, solvedRooms, completedDocs) {
  const phase = pathway.phases.find(p => p.id === phaseId);
  if (!phase) return false;
  return phase.items.every(item => {
    if (item.type === 'room') return solvedRooms.includes(item.id);
    if (item.type === 'doc' && item.required) return completedDocs.includes(item.id);
    if (item.type === 'target') return solvedRooms.includes(item.id);
    return true;
  });
}

function isPhaseUnlocked(pathway, phaseId, solvedRooms, completedDocs) {
  const phase = pathway.phases.find(p => p.id === phaseId);
  if (!phase || !phase.requires) return true;
  return phase.requires.every(reqId => isPhaseComplete(pathway, reqId, solvedRooms, completedDocs));
}

function isItemUnlocked(pathway, phaseId, itemIndex, solvedRooms, completedDocs) {
  if (!isPhaseUnlocked(pathway, phaseId, solvedRooms, completedDocs)) return false;
  const phase = pathway.phases.find(p => p.id === phaseId);
  if (!phase || itemIndex <= 0) return true;
  const prev = phase.items[itemIndex - 1];
  if (prev.type === 'room') return solvedRooms.includes(prev.id);
  if (prev.type === 'doc') return completedDocs.includes(prev.id);
  if (prev.type === 'target') return solvedRooms.includes(prev.id);
  return true;
}

Object.assign(window, {
  SK_CATEGORIES, SK_ALL_ROOMS, SK_ALL_BADGES, MENTOR_LESSONS_INFO,
  SK_PATHWAYS, SK_ROOMS_MAP, getPathwayItemDetails, isPhaseComplete, isPhaseUnlocked, isItemUnlocked
});

