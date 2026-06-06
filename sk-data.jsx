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
      { id: 'web-10', name: 'Web App Pentest Capstone', difficulty: 'Uzman', desc: 'Gerçekçi bir web uygulamasında tam sızma testi.', users: 310, points: 200 },
    ]
  },
  {
    slug: 'network-pentest', name: 'Ağ Sızma Testi', icon: '🔗', color: '#5cffba',
    desc: 'Ağ keşfi, port tarama, servis sömürüsü ve pivotlama — kurumsal ağlara sızma.',
    rooms: [
      { id: 'net-01', name: 'Nmap ile Ağ Keşfi', difficulty: 'Başlangıç', desc: 'Port tarama, servis tespiti ve OS fingerprinting.', users: 3100, points: 50 },
      { id: 'net-04', name: 'SSH Brute Force & Key Attacks', difficulty: 'Başlangıç', desc: 'SSH şifre kırma ve anahtar tabanlı saldırılar.', users: 2340, points: 50 },
      { id: 'net-02', name: 'ARP Spoofing & MITM', difficulty: 'Orta', desc: 'ARP zehirleme ve Man-in-the-Middle saldırıları.', users: 1890, points: 75 },
      { id: 'net-03', name: 'SMB Exploitation', difficulty: 'Orta', desc: 'SMB paylaşım zafiyetleri ve EternalBlue.', users: 1560, points: 80 },
      { id: 'net-05', name: 'DNS Zone Transfer', difficulty: 'Orta', desc: 'DNS zone transfer ve subdomain keşfi.', users: 1200, points: 70 },
      { id: 'net-06', name: 'WiFi Hacking Simülasyonu', difficulty: 'İleri', desc: 'WPA2 handshake yakalama ve kırma.', users: 890, points: 100 },
      { id: 'net-07', name: 'VLAN Hopping', difficulty: 'İleri', desc: 'VLAN atlama ve ağ segmentasyonu bypass.', users: 540, points: 110 },
      { id: 'net-08', name: 'Pivotlama & Tunneling', difficulty: 'Uzman', desc: 'Çoklu ağ segmentleri arası pivotlama.', users: 430, points: 150 },
      { id: 'net-09', name: 'Active Directory Recon', difficulty: 'Uzman', desc: 'AD ortamında keşif ve bilgi toplama.', users: 380, points: 160 },
      { id: 'net-10', name: 'Full Network Pentest', difficulty: 'Uzman', desc: 'Tam bir kurumsal ağ sızma testi senaryosu.', users: 250, points: 200 },
    ]
  },
  {
    slug: 'system-exploitation', name: 'Sistem Sömürüsü', icon: '💻', color: '#ffd166',
    desc: 'Linux ve Windows ayrıcalık yükseltme, exploit geliştirme ve post-exploitation.',
    rooms: [
      { id: 'sys-01', name: 'Linux Temel Komutlar', difficulty: 'Başlangıç', desc: 'Güvenlik odaklı Linux komut satırı temelleri.', users: 4200, points: 40 },
      { id: 'sys-02', name: 'SUID/SGID Exploitation', difficulty: 'Başlangıç', desc: 'SUID bit zafiyetleriyle root olma.', users: 2890, points: 50 },
      { id: 'sys-03', name: 'Linux Kernel Exploits', difficulty: 'Orta', desc: 'Dirty COW ve benzeri kernel zafiyetleri.', users: 1450, points: 80 },
      { id: 'sys-04', name: 'Cron Job Exploitation', difficulty: 'Orta', desc: 'Zamanlanmış görev zafiyetleri.', users: 1670, points: 70 },
      { id: 'sys-05', name: 'Path Hijacking', difficulty: 'Orta', desc: 'PATH değişkeni manipülasyonu ile root.', users: 1320, points: 75 },
      { id: 'sys-06', name: 'Windows Privilege Escalation', difficulty: 'İleri', desc: 'Windows servis zafiyetleri ve UAC bypass.', users: 890, points: 100 },
      { id: 'sys-07', name: 'Buffer Overflow Basics', difficulty: 'İleri', desc: 'Stack-based buffer overflow temelleri.', users: 650, points: 120 },
      { id: 'sys-08', name: 'Shellcode & ROP Chains', difficulty: 'Uzman', desc: 'Custom shellcode yazma ve ROP teknikleri.', users: 340, points: 160 },
      { id: 'sys-09', name: 'Container Escape', difficulty: 'Uzman', desc: 'Docker container escape senaryoları.', users: 280, points: 170 },
      { id: 'sys-10', name: 'Full System Compromise', difficulty: 'Uzman', desc: 'Tam bir sistemin initial access → root zinciri.', users: 210, points: 200 },
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
  'web-10': {
    scenario: "Merhaba {name}. Bu senin son ve en büyük web sınavın. Karşında birden fazla zafiyeti (SQLi, File Upload, CSRF vb.) zincirleme kullanman gereken gerçekçi bir kurumsal web portalı var. Tüm adımları geçerek sistemde root bayrağını okumalısın.",
    goals: [
      "Zafiyet zinciri (Vulnerability Chaining) oluşturma",
      "Keşiften sisteme sızmaya kadar tam sızma testi adımları",
      "Gerçekçi bir sızma testi senaryosunun tamamlanması"
    ],
    realWorld: "Gerçek dünyada tek bir zafiyet bazen yetersizdir; ancak bir SQLi ile elde edilen parola, dosya yükleme alanıyla birleştiğinde tüm şirketi ele geçirmenizi sağlar. Bu yetenek üst düzey sızma testi uzmanlığının temelidir.",
    learned: [
      "Çoklu zafiyetleri birleştirerek (chaining) sistem üzerinde tam kontrol kurmayı öğrendin.",
      "Bir web uygulamasında uçtan uca sızma testi metodolojisini uyguladın."
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
  'net-04': {
    scenario: "Merhaba {name}. SSH servisinin açık olduğunu gördük. Sözlük saldırısı (brute force) veya sızdırılmış özel anahtar (private key) dosyalarını kullanarak SSH üzerinden sisteme sızmalısın.",
    goals: [
      "Hydra veya benzeri araçlarla brute force mantığı",
      "SSH private key (id_rsa) izinleri ve kullanımı",
      "Zayıf parola politikalarının tespiti"
    ],
    realWorld: "Gerçek dünyada zayıf parolalar veya yanlış yapılandırılmış SSH anahtarları, saldırganların sisteme doğrudan erişmesine yol açar. Parola politikaları sıkılaştırılmalı ve SSH anahtarları şifrelenmelidir.",
    learned: [
      "Sözlük saldırısı ile zayıf kimlik bilgilerini kırmayı öğrendin.",
      "Özel anahtar dosyalarını kullanarak güvenli SSH oturumları başlatmayı başardın."
    ]
  },
  'net-02': {
    scenario: "Merhaba {name}. Aynı yerel ağda (LAN) bulunan bir kurban ve bir router var. ARP Spoofing yaparak kendini kurban ile router arasına konumlandırmalı, ağ trafiğini dinleyerek (MITM) şifreleri ele geçirmelisin.",
    goals: [
      "ARP protokolünün çalışması ve zafiyeti",
      "Ettercap/Arpspoof ile trafik yönlendirme",
      "Wireshark/Cain ile şifresiz HTTP verilerini koklama"
    ],
    realWorld: "Yerel ağ sızma testlerinde MITM saldırıları, şifrelenmemiş (HTTP, FTP, Telnet) protokollerdeki kimlik bilgilerini anında ele geçirmek için kullanılır. Korunmak için dinamik ARP denetimi (DAI) uygulanmalıdır.",
    learned: [
      "ARP tablolarını zehirleyerek trafiği kendi üzerine çekmeyi öğrendin.",
      "Ortadaki Adam (MITM) pozisyonunda şifresiz ağ verilerini analiz etmeyi kavradın."
    ]
  },
  'net-03': {
    scenario: "Merhaba {name}. Hedef sistemde eski bir SMB (Server Message Block) servisi çalışıyor. Bu servisin zafiyetlerini (örneğin EternalBlue - MS17-010) sömürerek doğrudan en yüksek yetkili kullanıcı (SYSTEM/root) olarak sızmalısın.",
    goals: [
      "SMB paylaşım izinleri ve bilgi toplama (enum)",
      "EternalBlue zafiyetinin sömürülmesi",
      "Metasploit framework ve reverse shell bağlantısı"
    ],
    realWorld: "EternalBlue gibi SMB açıkları, WannaCry gibi fidye yazılımlarının ağlarda hızla yayılmasına neden olmuştur. Bu tür kritik açıklar tespit edildiğinde sistemler derhal yamalanmalıdır.",
    learned: [
      "SMB servislerindeki paylaşımları ve izinleri incelemeyi öğrendin.",
      "EternalBlue zafiyetini sömürerek hedef makinede yetkili shell elde ettin."
    ]
  },
  'net-05': {
    scenario: "Merhaba {name}. Hedef kurumun DNS sunucusunda hatalı yapılandırma nedeniyle Zone Transfer işlemine izin verildiğini gördük. Tüm subdomain bilgilerini ve IP adreslerini tek bir sorgu ile çekmelisin.",
    goals: [
      "DNS protokolü ve kayıt türleri (A, NS, MX, TXT)",
      "Dig ve nslookup ile zone transfer (`AXFR`) sorgusu",
      "Kurumsal ağ haritalama"
    ],
    realWorld: "DNS Zone Transfer açığı, şirketin iç ağındaki tüm sunucuların, test ortamlarının ve gizli servislerin isimlerini ortaya döker. Bu durum saldırganın hedef listesini devasa ölçüde genişletir.",
    learned: [
      "DNS Zone Transfer zafiyetini tetiklemeyi öğrendin.",
      "Şirketin tüm subdomain envanterini hızlıca haritalamayı başardın."
    ]
  },
  'net-06': {
    scenario: "Merhaba {name}. Hedef ofisin WPA2 korumalı kablosuz ağına sızmamız gerekiyor. Havaya yayılan paketleri dinleyip bir cihazın ağa bağlanma aşamasını (handshake) yakalamalı ve bu handshake dosyasını kırarak şifreyi bulmalısın.",
    goals: [
      "Aircrack-ng ailesi araçlarının kullanımı",
      "WPA2 4-Way Handshake yakalama mantığı",
      "Hashcat veya John ile parola kırma"
    ],
    realWorld: "WiFi şifrelerinin kırılması, saldırganın şirket içi kablolu/kablosuz ağa sızarak iç sistemleri doğrudan tehdit etmesini sağlar. Güçlü parolalar ve kurumsal WPA3/802.1X protokolleri kullanılmalıdır.",
    learned: [
      "Kablosuz ağ trafiğini dinlemeyi ve deauthentication paketleriyle handshake yakalamayı öğrendin.",
      "Yakaladığın hash dosyasını sözlük saldırısıyla kırarak WiFi şifresine ulaştın."
    ]
  },
  'net-07': {
    scenario: "Merhaba {name}. Şirket içi ağda misafir VLAN'ındasın fakat yönetim (admin) VLAN'ına erişmek istiyorsun. VLAN Hopping (Double Tagging) yöntemiyle paketlerini diğer VLAN segmentine atlatmalısın.",
    goals: [
      "802.1Q VLAN etiketleme mantığı",
      "Double Tagging (çift etiketleme) saldırısı",
      "Switchport trunking modlarının analizi"
    ],
    realWorld: "VLAN segmentasyonu, kritik ağları izole etmek için kullanılır. VLAN Hopping, bu segmentasyonu aşarak saldırganın hassas sunucuların bulunduğu ağlara paket göndermesini sağlar.",
    learned: [
      "VLAN etiketlerinin switchler tarafından nasıl işlendiğini öğrendin.",
      "Çift etiketli paketler göndererek ağ segmentasyonunu aşmayı başardın."
    ]
  },
  'net-08': {
    scenario: "Merhaba {name}. İlk ele geçirdiğimiz sunucu çift ağ kartına sahip: hem dış dünyaya hem de dışarıdan erişilemeyen iç ağa bağlı. Bu sunucuyu bir proxy (pivot) olarak kullanarak iç ağdaki gizli veritabanına erişmelisin.",
    goals: [
      "Chisel, SSH Dynamic Port Forwarding veya Proxychains kullanımı",
      "İç ağa yönelik tünel (tunneling) oluşturma",
      "Çoklu ağ segmentlerinde pivotlama"
    ],
    realWorld: "Gerçek sızma testlerinde iç ağa doğrudan erişim yoktur. Ele geçirilen ilk makine üzerinden tünel açarak (pivotlama) ağın derinliklerine sızılır. Bu yetenek sızma testi uzmanlarının en kritik becerilerindendir.",
    learned: [
      "Socks proxy tüneli oluşturarak trafiği ele geçirilen makine üzerinden yönlendirmeyi öğrendin.",
      "İç ağda kapalı olan servislere dışarıdan erişim sağladın."
    ]
  },
  'net-09': {
    scenario: "Merhaba {name}. Bir Active Directory (AD) ağındayız. Etki alanı (Domain) içerisindeki kullanıcıları, grupları, bilgisayarları ve yetki ilişkilerini analiz ederek etki alanı yöneticisine (Domain Admin) giden yolu planlamalısın.",
    goals: [
      "LDAP sorguları ve BloodHound aracı mantığı",
      "Kerberoasting ve AS-REP Roasting kavramları",
      "AD kullanıcı ve yetki analizi"
    ],
    realWorld: "Kurumsal ağların %90'ı Active Directory kullanır. AD ortamında yapılan keşif, saldırganın en az yetkili kullanıcıdan tüm domain kontrolünü ele geçireceği yolu (attack path) çizmesini sağlar.",
    learned: [
      "AD ortamında LDAP üzerinden kullanıcı ve yetki envanteri çıkarmayı öğrendin.",
      "BloodHound grafikleri ile Domain Admin yetkisine giden yolları analiz etmeyi kavradın."
    ]
  },
  'net-10': {
    scenario: "Merhaba {name}. Bu senin ağ kategorisindeki capstone sınavın. Dış ağ keşfinden başlayıp, bulduğun bir servisi sömürecek, ardından iç ağa sızıp pivotlama yaparak Active Directory etki alanını ele geçireceksin. Tüm adımları tamamla!",
    goals: [
      "Dış ağdan iç ağa sızma metodolojisi",
      "Pivotlama ile çoklu ağ aşamalarını geçme",
      "Active Directory ortamında tam yetki (Domain Admin) elde etme"
    ],
    realWorld: "Gerçek bir pentest projesi tam olarak bu senaryodan ibarettir. Şirketin dışarıya açık zayıf bir noktasından girilip, iç ağdaki tüm veritabanları ve domain controller sistemleri ele geçirilir.",
    learned: [
      "Dış ağ keşfinden başlayıp iç ağın derinliklerine uzanan tam bir sızma testi gerçekleştirdin.",
      "Zincirleme ağ saldırıları ile hedef altyapının tamamını ele geçirmeyi öğrendin."
    ]
  },

  // system exploitation
  'sys-01': {
    scenario: "Merhaba {name}. Terminale hoş geldin! Sistem sömürüsü ve yetki yükseltme işlemlerine başlamadan önce temel Linux dosya sistemi komutlarını (`ls`, `cd`, `cat`, `grep`, `find`) etkin kullanmayı öğrenmelisin.",
    goals: [
      "Linux dizin yapısı ve dosya izinleri",
      "Temel arama ve filtreleme komutları",
      "Gizli dosyaları ve sistem bilgilerini bulma"
    ],
    realWorld: "Bir sisteme sızdığınızda elinizde genellikle sadece sihirli siyah bir ekran (terminal) olur. Komut satırına hakim olmak, sistemdeki gizli yapılandırma dosyalarını hızlıca bulmanızı sağlar.",
    learned: [
      "Dosya sistemi navigasyonunu ve gizli dosyaları okumayı öğrendin.",
      "`grep` ve `find` ile hassas verileri filtreleyip bulmayı başardın."
    ]
  },
  'sys-02': {
    scenario: "Merhaba {name}. Sistemde normal bir kullanıcısın. Ancak bazı çalıştırılabilir dosyaların üzerinde SUID (Set Owner User ID) biti set edilmiş. Bu dosyalardan (örneğin python veya find) yararlanarak root yetkisine yükselmelisin.",
    goals: [
      "SUID/SGID bitinin çalışma mantığı",
      "GTFOBins kullanarak yetki yükseltme yöntemleri",
      "Root sahipliğindeki izinli dosyaları sömürme"
    ],
    realWorld: "Sistem yöneticileri bazen normal kullanıcılara kolaylık olsun diye bazı araçlara SUID biti verir. Sızma testlerinde bu durum, sistemin saniyeler içinde tamamen ele geçirilmesiyle sonuçlanır.",
    learned: [
      "SUID biti ayarlanmış tehlikeli sistem dosyalarını tespit etmeyi öğrendin.",
      "GTFOBins teknikleriyle SUID dosyalarını sömürüp root shell aldın."
    ]
  },
  'sys-03': {
    scenario: "Merhaba {name}. Sistemde çalışan Linux çekirdeğinin (kernel) eski ve bilinen bir zafiyeti (örneğin Dirty COW) var. Kernel exploit kodunu derleyip çalıştırarak doğrudan root yetkilerini almalısın.",
    goals: [
      "Kernel sürümü tespiti (`uname -a`)",
      "Exploit-DB ve local exploit arama",
      "C dilindeki exploit kodunu derleme (`gcc`) ve çalıştırma"
    ],
    realWorld: "Kernel güncellemelerinin yapılmadığı sunucular siber saldırganlar için en kolay hedeflerdir. Sistemlerin düzenli olarak güncellenmesi ve zafiyet taramalarının yapılması kritiktir.",
    learned: [
      "Sistem çekirdek sürümünü analiz edip uygun exploiti bulmayı öğrendin.",
      "C kodunu derleyerek kernel düzeyinde yetki yükseltme gerçekleştirdin."
    ]
  },
  'sys-04': {
    scenario: "Merhaba {name}. Sistemde root yetkisiyle düzenli olarak çalışan zamanlanmış bir görev (cron job) var. Bu görevin çalıştırdığı script dosyasına yazma iznimiz olduğunu gördük. Script'i manipüle ederek kendine root reverse shell vermelisin.",
    goals: [
      "Cron tablosunu okuma (`/etc/crontab`)",
      "Zamanlanmış görevlerin izin analizi",
      "Script dosyasına payload yazma ve yetki yükseltme"
    ],
    realWorld: "Arka planda çalışan zamanlanmış script'lerin izinlerinin zayıf olması (world-writable), sistemde arka kapı (backdoor) oluşturmak veya yetki yükseltmek için en yaygın kullanılan hatalardan biridir.",
    learned: [
      "Root yetkisiyle çalışan zamanlanmış görevleri listelemeyi öğrendin.",
      "Script dosyalarını manipüle ederek arka planda yetkili komut çalıştırmayı başardın."
    ]
  },
  'sys-05': {
    scenario: "Merhaba {name}. SUID yetkisine sahip bir program, çalışırken sistemdeki başka bir komutu (örneğin `tar` veya `ls`) mutlak yol (absolute path) vermeden çağırıyor. PATH değişkenini manipüle ederek programın kendi yazdığın sahte komutu çalıştırmasını sağlamalısın.",
    goals: [
      "PATH çevre değişkeninin çalışma mantığı",
      "Mutlak yol (Absolute Path) verilmeden çağrılan ikili dosyalar",
      "Sahte komut yazarak yetki yükseltme"
    ],
    realWorld: "Yazılım geliştiriciler sistem komutlarını çağırırken tam yol (örn: `/usr/bin/tar`) belirtmediklerinde, saldırganlar çevre değişkenlerini ezerek sisteme kendi zararlı kodlarını çalıştırtabilir.",
    learned: [
      "Çevre değişkenlerinin çalışma ve arama sırası mantığını öğrendin.",
      "PATH değişkenini manipüle ederek SUID uygulamasının sahte komutu çalıştırmasını sağladın."
    ]
  },
  'sys-06': {
    scenario: "Merhaba {name}. Windows işletim sisteminde sıradan bir kullanıcısın. PrintSpoofer veya benzeri bir lokal zafiyet kullanarak sistemdeki en yüksek yetkili hesap olan `NT AUTHORITY\\SYSTEM` seviyesine yükselmelisin.",
    goals: [
      "Windows servis hesapları ve token yapısı",
      "Printspoofer veya JuicyPotato gibi patates ailesi exploitleri",
      "Windows terminal komutları (`whoami /priv`)"
    ],
    realWorld: "Windows sistemlerinde servis hesaplarının token'larının sızdırılması (Token Impersonation), yerel ağlarda sistem yöneticisi yetkilerine ulaşmak için en kritik yollardan biridir.",
    learned: [
      "Windows üzerindeki kullanıcı yetkilerini (`SeImpersonatePrivilege` vb.) listelemeyi öğrendin.",
      "Token Impersonation saldırısıyla NT AUTHORITY\\SYSTEM yetkilerine ulaştın."
    ]
  },
  'sys-07': {
    scenario: "Merhaba {name}. C dilinde yazılmış bir uygulamanın bellek sınır kontrolü yapmadığını gördük. Girdi alanına kapasitesinin üzerinde veri göndererek bellek yığınını (stack) taşırmalı ve programın akışını değiştirerek bayrağı okumalısın.",
    goals: [
      "Buffer Overflow (Yığın Taşması) kavramı",
      "Bellek adres yapısı, EIP/RIP ve ESP kayıtçıları",
      "Girdi uzunluğu ile bellek taşırma analizi"
    ],
    realWorld: "Yığın taşması, yazılımların çökmesine veya saldırganların bellek üzerinde doğrudan makine kodu (shellcode) çalıştırmasına yol açar. Güvenli kod yazımında `strcpy` yerine `strncpy` gibi sınır kontrollü fonksiyonlar tercih edilmelidir.",
    learned: [
      "Bellek sınır kontrollerinin yapılmamasının yol açtığı taşmaları öğrendin.",
      "EIP yazmacını kontrol ederek programın akışını manipüle etmeyi başardın."
    ]
  },
  'sys-08': {
    scenario: "Merhaba {name}. Güvenlik önlemleri (NX/DEP gibi) nedeniyle bellek üzerinde doğrudan kod çalıştırmak engellenmiş. ROP (Return Oriented Programming) zincirleri kurarak, libc içindeki sistem fonksiyonlarını çağırıp bu korumayı aşmalı ve shell almalısın.",
    goals: [
      "DEP (Data Execution Prevention) / NX (No-Execute) korumaları",
      "ROP gadget bulma ve zincir oluşturma",
      "Libc tabanlı saldırılar ve `system('/bin/sh')` çağrısı"
    ],
    realWorld: "Modern işletim sistemleri bellek korumalarıyla doludur. ROP, bu korumayı sunucunun kendi kütüphanesindeki (libc) meşru kod parçalarını ardışık çalıştırarak aşmayı sağlar.",
    learned: [
      "Modern bellek koruma mekanizmalarının çalışma mantığını öğrendin.",
      "ROP gadget'ları birleştirerek bellek korumalarını bypass etmeyi kavradın."
    ]
  },
  'sys-09': {
    scenario: "Merhaba {name}. Bir Docker konteynerinin (container) içindesin. Ancak bu konteyner `--privileged` yetkisiyle veya zayıf sınırlandırmalarla başlatılmış. Ana işletim sisteminin diskini içeriye mount ederek konteynerden ana sisteme kaçmalısın (escape).",
    goals: [
      "Docker yetkilendirmeleri ve izole ortam sınırları",
      "Privileged mount yöntemiyle ana disk erişimi",
      "Konteynerden ana işletim sistemine sızma"
    ],
    realWorld: "Bulut sistemlerde ve mikroservis mimarilerinde konteyner izolasyonu hayati önem taşır. Yanlış yapılandırılmış ayrıcalıklı konteynerler, tek bir container ele geçirildiğinde tüm fiziksel sunucunun kaybedilmesine neden olur.",
    learned: [
      "Ayrıcalıklı (privileged) konteynerlerin yarattığı güvenlik risklerini öğrendin.",
      "Konteyner içinden ana sunucunun diskine erişerek izole ortamdan kaçmayı başardın."
    ]
  },
  'sys-10': {
    scenario: "Merhaba {name}. Sistem sömürüsü kategorisindeki capstone sınavındasın. Karşındaki Linux makinesinde önce kısıtlı bir terminal elde edecek, ardından sistem içi keşif yapıp zayıf yapılandırmaları bulacak ve root yetkisine ulaşacaksın. Tüm zinciri tamamla!",
    goals: [
      "Initial access sonrası sistem keşfi (enumeration)",
      "Çok adımlı yerel yetki yükseltme (Privilege Escalation)",
      "Root yetkisinin kalıcı hale getirilmesi (Persistence)"
    ],
    realWorld: "Gerçek dünyadaki sistem sızma testleri (red team operasyonları) tam olarak bu aşamalardan oluşur. Saldırgan sisteme girer, içeride yerel tarama yapar, ayrıcalıkları yükseltir ve sistemin sahibi olur.",
    learned: [
      "Kısıtlı bir kullanıcıdan başlayıp aşamalı olarak root yetkisine yükselmeyi öğrendin.",
      "Sistem üzerinde kalıcılık sağlama ve izleri temizleme adımlarını tamamladın."
    ]
  }
};

Object.assign(window, { SK_CATEGORIES, SK_ALL_ROOMS, SK_ALL_BADGES, MENTOR_LESSONS_INFO });

