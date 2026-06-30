/* ===========================================================================
   siberkampus — Detailed Room Articles (Eğitici Brifingler)
   This file stores the comprehensive briefings for each CTF room.
   =========================================================================== */

window.ROOM_ARTICLES = {
  'net-01': {
    title: "Ağ Keşfi & Nmap: Bir Saldırının İlk Adımı",
    readTime: "~3 dk okuma",
    tagline: "FTP, port, servis ve Nmap'i sıfırdan anla — sonra hedefi kendin tara.",
    intro: "Bir binaya zorla girmeyi düşünen biri önce ne yapar? Kapıları, pencereleri, açık kalmış bir bodrum kapağını kontrol eder. Sızma testi de tam böyle başlar: hedefe tek bir saldırı denemeden önce onu TANIMAK zorundasın. Hangi kapılar açık? Arkalarında hangi servisler çalışıyor? Bu servislerin sürümleri ne? İşte bu bilgi toplama aşamasına 'Keşif' denir ve bir operasyonun kaderini belirler. Bu derste keşfi, dünyanın en ünlü aracı olan Nmap ile yapacaksın.",
    sections: [
      { icon: "🛰️", h: "Keşif (Reconnaissance) Nedir?", body: [
        "Keşif, hedef sistem hakkında olabildiğince çok bilgi toplama aşamasıdır. Gerçek bir pentest'te zamanının büyük kısmını burada harcarsın — çünkü neyle karşı karşıya olduğunu bilmeden doğru saldırıyı seçemezsin.",
        "Mantık basit: Bir sunucuda 65.535 olası 'kapı' (port) vardır. Hepsi kapalıysa içeri girecek yer yoktur. Açık olan her port, içeri sızmak için potansiyel bir yoldur. Önce o kapıları bulmamız gerekir."
      ]},
      { icon: "🔌", h: "Port ve Servis Ne Demek?", body: [
        "Bir sunucu, farklı hizmetleri farklı numaralı kapılardan sunar. Bu kapılara 'port', arkalarında çalışan programlara da 'servis' denir. Bazı port numaraları dünya genelinde standarttır:",
        "• 21 → FTP (dosya transferi)",
        "• 22 → SSH (uzaktan güvenli yönetim)",
        "• 80 → HTTP (web sitesi)",
        "• 3306 → MySQL (veritabanı)",
        "Yani taramada gördüğün 21, 22, 80 gibi sayılar rastgele değil; her biri belirli bir hizmetin standart adresidir. Bir port açıksa, o hizmet o sunucuda çalışıyor demektir."
      ]},
      { icon: "📂", h: "Peki FTP Nedir? (Bu odanın hedefi)", body: [
        "FTP (File Transfer Protocol), dosya yükleyip indirmek için kullanılan eski bir protokoldür ve genelde 21. portta çalışır. Tehlikeli yanı şu: çoğu zaman 'anonymous' (anonim) girişe açık şekilde yanlış yapılandırılır — yani şifre bile gerekmeden herkes bağlanabilir.",
        "Bu odadaki hedefte vsftpd 2.3.4 sürümü çalışıyor. Anonim girişe açık olduğu için Nmap, bağlanıp FTP'nin 'banner' (karşılama metni) bilgisini okuyabilecek ve orada saklı bayrağı bize gösterecek."
      ]},
      { icon: "🛠️", h: "Neden Nmap? Bu Komutlar Ne İşe Yarıyor?", body: [
        "Nmap (Network Mapper), bir hedefe özel paketler gönderip dönen cevapları yorumlayarak hangi portların açık, hangi servislerin çalıştığını ve hatta işletim sistemini tespit eden bir ağ keşif aracıdır. 1000 portu elle tek tek denemek yerine Nmap bunu saniyeler içinde yapar.",
        "Bu derste 3 komut kullanacaksın ve her biri bir öncekinin üzerine bilgi ekler. Aşağıda tam olarak ne yaptıklarını göreceksin."
      ]}
    ],
    commandAnatomy: {
      title: "Yazacağın Komutun Anatomisi",
      cmd: "nmap -sV 10.10.84.22",
      parts: [
        { t: "nmap", c: "#569cd6", d: "Aracın kendisini çağırır." },
        { t: "-sV", c: "#ffd166", d: "\"Service & Version\" — açık portlardaki servislerin SÜRÜMÜNÜ tespit eder. Asıl sihir burada: 'vsftpd 2.3.4' gibi bir sürüm görürsün." },
        { t: "10.10.84.22", c: "#5cffba", d: "Taranacak hedefin IP adresi." }
      ],
      params: [
        { flag: "-sn", desc: "Ping taraması: yalnızca host ayakta mı diye bakar, port taramaz. (Adım 1)" },
        { flag: "-sV", desc: "Servis + sürüm tespiti. Exploit aramanın anahtarı. (Adım 2)" },
        { flag: "-sC", desc: "Varsayılan NSE scriptlerini çalıştırır (örn. ftp-anon). Bayrağı bu açığa çıkarır. (Adım 3)" },
        { flag: "-A", desc: "Agresif mod: -sV, -sC ve işletim sistemi tespitini birden yapar." }
      ]
    },
    glossary: [
      { term: "Port", def: "Bir servise ulaşmak için kullanılan numaralı ağ kapısı (0–65535)." },
      { term: "Servis", def: "Bir portun arkasında çalışan program (FTP, SSH, web sunucusu...)." },
      { term: "Banner", def: "Bir servise bağlanınca dönen tanıtım metni; sürüm/bilgi sızdırabilir." },
      { term: "NSE", def: "Nmap Scripting Engine — Nmap'in otomatik kontrol scriptleri kütüphanesi." },
      { term: "Anonymous FTP", def: "Şifre gerektirmeden 'anonymous' kullanıcısıyla erişilebilen yanlış yapılandırılmış FTP." },
      { term: "CVE", def: "Bilinen güvenlik açıklarının ortak kayıt numarası (ör. CVE-2011-2523)." }
    ],
    closing: "Artık ne aradığını, neden Nmap kullandığını ve o sayıların ne anlama geldiğini biliyorsun. Sıra sende: hedefi kendi ellerinle tarayıp bayrağı çıkarmaya hazırsın. İyi avlar! 🎯"
  },

  'web-01': {
    title: "SQL Injection Temelleri: Giriş Panelini Aşmak",
    readTime: "~8 dk okuma",
    tagline: "Bir tek tırnak, koca bir veritabanının kapılarını nasıl ardına kadar açar?",
    intro: "Düşün ki bir şirketin giriş panelindesin. Kullanıcı adı ve şifre soruyor. Normalde buraya bilgilerini girersin, arka planda web sunucusu bir veritabanına sorar: 'Bu şifre bu kullanıcıya mı ait?'. Eğer kod düzgün yazılmadıysa, giriş formuna yazdığın metin doğrudan veritabanı sorgusuna dönüşür. İşte bu derste, tek tırnak (') karakteri ile bu sorguyu nasıl kıracağını, mantıksal sorguları manipüle ederek şifreyi bilmeden 'Admin' olarak nasıl giriş yapacağını öğreneceksin.",
    sections: [
      { icon: "🗄️", h: "SQL ve Veritabanı Nedir?", body: [
        "Bir web uygulamasının kullanıcı adı, şifre, e-posta gibi tüm bilgilerini sakladığı devasa çekmeceye veritabanı (database) diyoruz.",
        "SQL (Structured Query Language), bu veritabanıyla konuşmak, veri eklemek veya sorgulamak için kullandığımız evrensel bir dildir.",
        "Örneğin, bir giriş formunda kullanıcı adı ve şifreyi girdiğinde arka planda şu sorgu çalışır:",
        "SELECT * FROM users WHERE username = 'GIRILEN_AD' AND password = 'GIRILEN_SIFRE'",
        "Bu sorgu veritabanına der ki: 'Kullanıcı adı GIRILEN_AD olan ve şifresi GIRILEN_SIFRE olan satırı bana getir.' Eğer veritabanı bir satır döndürürse sisteme giriş yaparsın."
      ]},
      { icon: "🔓", h: "SQL Injection Zafiyeti Nasıl Oluşur?", body: [
        "Güvenli yazılmamış kodlarda, kullanıcının girdiği veri olduğu gibi sorgunun içine yapıştırılır. Saldırgan bu boşluğa düz metin yerine SQL komutu yazar.",
        "Eğer kullanıcı adı kısmına tek tırnak (') karakteri koyarsan, SQL sorgusunun sınırını erkenden kapatmış olursun. Örneğin kullanıcı adına admin' yazarsak sorgu şuna dönüşür:",
        "SELECT * FROM users WHERE username = 'admin'' AND password = '...'",
        "Burada yan yana gelen tırnaklar SQL motorunun kafasını karıştırır ve hata verir. Bu hata bize zafiyetin var olduğunu, yani girdimizin doğrudan kod olarak çalıştırıldığını kanıtlar."
      ]},
      { icon: "🛡️", h: "Login Bypass Mantığı ve OR 1=1 -- Sırrı", body: [
        "Sorguyu kırdığımıza göre artık kendi mantığımızı enjekte edebiliriz. Amacımız şifre kontrolünü tamamen aşmak.",
        "Giriş formunun kullanıcı adı alanına şunu yazıyoruz: ' OR 1=1 --",
        "Bu girdiyle sorgumuz şu hale gelir:",
        "SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = '...'",
        "Buradaki ' OR 1=1 ifadesi, kullanıcı adı boş olsa BİLE mantıksal olarak 1=1 (yani doğru) olduğu için sorgunun her koşulda TRUE (doğru) dönmesini sağlar.",
        "Sonundaki -- (iki tire) karakteri ise SQL'de yorum satırı anlamına gelir. Kendisinden sonra gelen tüm şifre sorgusunu çöpe atar, böylece şifre ne olursa olsun doğrudan ilk sıradaki kullanıcı (genellikle admin) olarak giriş yaparız!"
      ]},
      { icon: "🧪", h: "Laboratuvar Çözüm Adımları", body: [
        "• Adım 1: Laboratuvar alanında yer alan giriş panelini incele.",
        "• Adım 2: Kullanıcı adı alanına ' OR 1=1 -- yaz (Şifre alanına herhangi bir şey yazabilir veya boş bırakabilirsin).",
        "• Adım 3: Giriş Yap (Login) butonuna bas.",
        "• Adım 4: Sistem bypass edilerek Admin paneli yüklenecek ve flag ekranda görünecektir."
      ]}
    ],
    commandAnatomy: {
      title: "SQL Injection Payload Anatomisi",
      cmd: "' OR 1=1 --",
      parts: [
        { t: "'", c: "#ffd166", d: "Sorgudaki orijinal kullanıcı adı alanının string sınırını kapatır." },
        { t: "OR", c: "#569cd6", d: "Mantıksal VEYA operatörü. Sol taraf yanlış olsa bile sağ taraf doğruysa sorgunun çalışmasını sağlar." },
        { t: "1=1", c: "#5cffba", d: "Her zaman doğru (TRUE) olan mantıksal koşul. SQL motorunu kandırır." },
        { t: "--", c: "#74998a", d: "Geriye kalan şifre kontrol kodlarını yorum satırı haline getirerek devre dışı bırakır." }
      ],
      params: [
        { flag: "' OR 'a'='a", desc: "1=1 yerine sıkça kullanılan alternatif bir her zaman doğru koşul." },
        { flag: "' OR 1=1 #", desc: "MySQL veritabanlarında yorum satırı olarak tire yerine diyez (#) işareti kullanılır." },
        { flag: "' UNION SELECT...", desc: "Zafiyetin sadece bypass değil, diğer tablolardan veri sızdırmak için kullanıldığı ileri seviye yöntem." }
      ]
    },
    glossary: [
      { term: "SQL", def: "Veritabanlarındaki verileri sorgulamak, eklemek ve güncellemek için kullanılan yapılandırılmış sorgu dili." },
      { term: "SQL Injection (SQLi)", def: "Kullanıcı girdilerinin temizlenmeden SQL sorgularına katılmasıyla oluşan kritik web zafiyeti." },
      { term: "Login Bypass", def: "Kimlik doğrulama adımlarını geçersiz kılıp şifresiz giriş yapma eylemi." },
      { term: "Yorum Satırı (-- / #)", def: "SQL motoruna kodun o kısmını çalıştırmamasını, yok saymasını söyleyen işaretler." },
      { term: "Prepared Statements", def: "SQL Injection'ı tamamen önleyen, girdileri koddan ayıran parametrik sorgulama tekniği." }
    ],
    closing: "Tebrikler! SQL sorgularının arkasındaki çalışma mantığını artık biliyorsun. Şimdi giriş panelinde bu zafiyeti sömürme ve ilk web bayrağını yakalama sırası sende! 🎯"
  },

  'web-04': {
    title: "XSS (Reflected): Tarayıcıyı Silaha Dönüştürmek",
    readTime: "~7 dk okuma",
    tagline: "Kullanıcı arama kutusuna JavaScript yazarsa ne olur? Çerezlerin güvenliğini keşfet.",
    intro: "Bir web sitesinde arama kutusuna 'kırmızı bot' yazdığında, site ekranda 'kırmızı bot için sonuçlar' yazar. Yani senin yazdığın girdi sayfaya geri yansıtılır (reflected). Peki ya oraya bir kelime yerine tarayıcının çalıştırabileceği bir JavaScript kodu yazarsan? Site bu girdiyi hiç kontrol etmeden sayfaya eklerse, tarayıcın o kodu sitenin kendi koduymuş gibi çalıştıracaktır! Bu derste, tarayıcıda çalışan bu zafiyeti sömürerek kurbanın oturum anahtarını (cookie) nasıl ele geçireceğini öğreneceksin.",
    sections: [
      { icon: "🌐", h: "XSS Nedir ve Nasıl Çalışır?", body: [
        "XSS (Cross-Site Scripting), web uygulamalarındaki girdilerin yeterince temizlenmemesi sonucu, tarayıcılarda kötü amaçlı JavaScript kodları çalıştırılmasına izin veren bir zafiyettir.",
        "Reflected (Yansıtılan) XSS zafiyetinde, saldırganın yolladığı zararlı kod sunucuda saklanmaz; sadece o anki istek ve yanıt döngüsünde sayfaya yansır.",
        "JavaScript tarayıcıda çalıştığı için, o an siteyi kullanan kurbanın tarayıcı yetkilerine sahip olur: sayfa içeriğini değiştirebilir veya çerezleri okuyabilir."
      ]},
      { icon: "🍪", h: "Cookie (Çerez) Nedir ve Neden Hedefte?", body: [
        "Bir siteye kullanıcı adın ve şifrenle giriş yaptığında sunucu sana geçici bir 'oturum anahtarı' (Session Token) verir ve bu tarayıcında Cookie olarak saklanır.",
        "Her yeni sayfaya tıkladığında şifreni tekrar girmemen için tarayıcın bu cookie'yi sunucuya otomatik gönderir. Yani bu anahtarı çalan bir saldırgan, şifreni bilmeden senin hesabına giriş yapabilir.",
        "JavaScript'teki document.cookie nesnesi, tarayıcıda saklanan bu çerezlere erişilmesini sağlar."
      ]},
      { icon: "💥", h: "Zafiyetin Sömürülmesi ve Payload Seçimi", body: [
        "Eğer arama kutusuna <script>alert(document.cookie)</script> yazarsak, tarayıcı script etiketlerini görür ve içindeki alert fonksiyonunu çalıştırarak çerezimizi ekranda gösterir.",
        "Gerçek hayatta saldırganlar alert() yerine bu çerezi kendi sunucularına gönderen kodlar enjekte ederler.",
        "Eğer web sitesi <script> etiketlerini filtreliyorsa, filtreyi aşmak için görsel etiketleri ve hata tetikleyicileri kullanılabilir: <img src=x onerror=alert(document.cookie)> gibi."
      ]},
      { icon: "🧪", h: "Laboratuvar Çözüm Adımları", body: [
        "• Adım 1: Arama kutusu bulunan e-ticaret simülasyon sayfasını aç.",
        "• Adım 2: Arama kutusuna <script>alert(document.cookie)</script> veya <img src=x onerror=alert(document.cookie)> yazarak arama yap.",
        "• Adım 3: Sayfa yenilendiğinde enjekte ettiğin JavaScript tetiklenecek ve ekrana çerez bilgisini yansıtan bir uyarı kutusu gelecektir.",
        "• Adım 4: Başarılı XSS tetiklemesinin ardından simülasyondaki flag ortaya çıkacaktır."
      ]}
    ],
    commandAnatomy: {
      title: "XSS Payload Anatomisi",
      cmd: "<script>alert(document.cookie)</script>",
      parts: [
        { t: "<script>", c: "#569cd6", d: "Tarayıcıya bir JavaScript kod bloğunun başladığını bildiren HTML etiketi." },
        { t: "alert(...)", c: "#ffd166", d: "Tarayıcıda bir uyarı kutusu (pop-up) açan dahili JavaScript fonksiyonu." },
        { t: "document.cookie", c: "#5cffba", d: "Tarayıcının o site için sakladığı oturum çerezlerini okuyan nesne." },
        { t: "</script>", c: "#569cd6", d: "JavaScript kod bloğunun bittiğini tarayıcıya bildiren HTML kapatma etiketi." }
      ],
      params: [
        { flag: "<img src=x onerror=alert(1)>", desc: "script etiketleri engellendiğinde, yüklenemeyen bir resim üzerinden JS tetikleme yöntemi." },
        { flag: "HttpOnly", desc: "Çerezlere JavaScript ile erişimi engelleyen, XSS saldırılarına karşı en kritik çerez güvenlik bayrağı." },
        { flag: "Girdi Temizleme (Sanitization)", desc: "Kullanıcıdan gelen girdideki <, > gibi karakterleri HTML entity (ör. &lt;) haline getirerek zafiyeti önleyen savunma yöntemi." }
      ]
    },
    glossary: [
      { term: "Cross-Site Scripting (XSS)", def: "Kullanıcı tarayıcısında istenmeyen JavaScript kodlarının çalıştırılmasına sebep olan zafiyet." },
      { term: "Session Token / Cookie", def: "Kullanıcının giriş yaptıktan sonra oturumunu açık tutmasını sağlayan geçici kimlik bilgisi çerezi." },
      { term: "Reflected XSS", def: "Zararlı kodun sunucuya kaydedilmediği, bir link veya form üzerinden yansıtılarak çalıştırıldığı XSS türü." },
      { term: "DOM (Document Object Model)", def: "Tarayıcının HTML kodlarını işleyerek oluşturduğu sayfa nesnesi ağacı." },
      { term: "CSP (Content Security Policy)", def: "Sitenin hangi kaynaklardan script yükleyebileceğini belirleyen güvenlik politikası katmanı." }
    ],
    closing: "Tarayıcıda kod çalıştırmanın gücünü anladın. Şimdi lab ortamında XSS payload'unu arama kutusuna gönder ve tarayıcıyı nasıl kontrol edebileceğini gör! 🚀"
  },

  'web-11': {
    title: "Varsayılan Parola Sömürüsü: Açık Kalan Fabrika Kapıları",
    readTime: "~5 dk okuma",
    tagline: "BT yöneticilerinin en büyük tembelliği: admin/admin tehlikesi.",
    intro: "Bir şirkete güvenlik testi yapmak için ağa sızdın. İçerideki cihazları tararken şirket ofisindeki ana yönlendiricinin (router) yönetim panelini buldun. Karşında bir kullanıcı adı ve şifre ekranı duruyor. BT ekibinin bu cihazı kurarken şifresini değiştirip değiştirmediğini nasıl anlarsın? Çoğu zaman ağ yöneticileri, üşengeçlikten veya unutkanlıktan ötürü cihazları fabrika çıkışındaki varsayılan şifreleriyle bırakırlar. Bu derste, siber güvenlikte en basit ama en yıkıcı açıklardan biri olan varsayılan kimlik bilgilerini sömüreceksin.",
    sections: [
      { icon: "📠", h: "Router Nedir ve Neden Yönetim Paneli Var?", body: [
        "Router (Yönlendirici), ofisteki veya evdeki bilgisayarları internete bağlayan, veri trafiğini yöneten en kritik donanım parçasıdır.",
        "Bu cihazların Wi-Fi şifresi, IP ayarları, güvenlik duvarı gibi özelliklerini ayarlamak için bir web arayüzleri (yönetim paneli) bulunur.",
        "Eğer bir saldırgan bu panele girerse, DNS ayarlarını değiştirerek ağdaki herkesi sahte banka sitelerine yönlendirebilir veya tüm ağ trafiğini dinleyebilir."
      ]},
      { icon: "🔑", h: "Varsayılan Kimlik Bilgileri (Default Credentials) Nedir?", body: [
        "Üretici firmalar (ASUS, Cisco, TP-Link vb.), cihazları fabrikadan çıkartırken kurulum yapabilmeniz için standart bir kullanıcı adı ve şifre belirler.",
        "Örneğin en yaygın kombinasyonlar: admin/admin, admin/password, root/admin veya admin/1234'tür.",
        "Bu varsayılan şifreler gizli değildir; internette basit bir aramayla her marka ve modelin kullanım kılavuzundan kolayca bulunabilir.",
        "Cihazı fişe takıp kullanmaya başlayan kullanıcılar bu şifreyi değiştirmezse, cihaz tüm internete veya yerel ağa açık bir hedef haline gelir."
      ]},
      { icon: "💻", h: "Gerçek Dünyada Bu Zafiyetin Etkisi", body: [
        "Saldırganlar, internete bağlı milyonlarca cihazı (IP adreslerini) tarayarak otomatik robotlarla varsayılan şifreleri denerler.",
        "Mirai botneti gibi büyük siber ordular, tamamen varsayılan şifreleri kullanan akıllı kameraları, routerları ele geçirerek oluşturulmuştur.",
        "Bu durumdan korunmanın tek yolu: Cihazın ilk kurulum aşamasında şifrenin güçlü ve benzersiz bir şifreyle değiştirilmesini zorunlu kılmaktır."
      ]},
      { icon: "🧪", h: "Laboratuvar Çözüm Adımları", body: [
        "• Adım 1: Arayüzde yer alan ASUS RT-3200 model router yönetim paneli ekranını aç.",
        "• Adım 2: Kullanıcı adı alanına admin yaz.",
        "• Adım 3: Şifre alanına da admin yazarak Giriş Yap butonuna tıkla.",
        "• Adım 4: Varsayılan şifre doğru olduğu için panele erişim sağlanacak ve router durum ekranında saklanan flag görünecektir."
      ]}
    ],
    glossary: [
      { term: "Router", def: "Ağlar arası veri akışını yönlendiren ve yerel cihazları internete bağlayan donanım." },
      { term: "Yönetim Paneli", def: "Cihazın tüm ayarlarının değiştirilebildiği, yetkili giriş ekranı." },
      { term: "Default Credentials", def: "Üretici tarafından cihaza atanmış, herkesçe bilinen fabrika çıkışlı kullanıcı adı ve şifreler." },
      { term: "Brute Force", def: "Doğru şifreyi bulana kadar binlerce farklı kombinasyonu deneme saldırısı." },
      { term: "Botnet", def: "Ele geçirilmiş binlerce internete bağlı cihazın (IoT) tek bir merkezden yönetildiği siber ordu." }
    ],
    closing: "Güvenliğin en zayıf halkası insan üşengeçliğidir. Şimdi laba gir, varsayılan şifreyle router panelini ele geçir ve bayrağı kap! 🔐"
  },

  'web-12': {
    title: "Komut Enjeksiyonu Temelleri: Sunucuya Hükmetmek",
    readTime: "~8 dk okuma",
    tagline: "Web panelinden sunucunun kalbine giden yol: Komut zincirleme teknikleri.",
    intro: "Web uygulamaları bazen sunucu işletim sisteminde komut çalıştırmak zorunda kalırlar. Örneğin, bir web sitesindeki 'Ping Aracı' senin yazdığın IP adresini alır ve arka planda sunucunun terminaline gidip 'ping IP_ADRESI' komutunu çalıştırır. Eğer uygulama senin yazdığın girdiyi kontrol etmeden doğrudan terminale yapıştırırsa, sen IP adresinin yanına işletim sisteminin anlayacağı başka komutlar da enjekte edebilirsin! Bu derste, sunucu üzerinde uzaktan komut çalıştırmayı (RCE) öğreneceksin.",
    sections: [
      { icon: "🖥️", h: "Shell, Terminal ve Komut Nedir?", body: [
        "Shell (Kabuk), işletim sisteminin çekirdeğiyle konuşmamızı sağlayan komut satırı arayüzüdür (Terminal).",
        "Terminalde sistem yöneticileri komutlar yazarlar. Örneğin: ping 8.8.8.8 ağ hızını test eder. cat dosya.txt ise bir dosyanın içeriğini ekrana yazdırır.",
        "Web uygulamaları (PHP, Python, Node.js vb.), bazen bu komutları arka planda çağırarak çıktılarını web sayfasına yansıtırlar."
      ]},
      { icon: "⛓️", h: "Komut Enjeksiyonu (Command Injection) Nasıl Çalışır?", body: [
        "Zafiyetin nedeni, web uygulamasının kullanıcı girdisini doğrudan bir kabuk (shell) komut şablonuna eklemesidir.",
        "Örneğin arka plandaki PHP kodu şöyle olsun: shell_exec('ping -c 4 ' + $USER_INPUT);",
        "Eğer kullanıcı IP olarak 127.0.0.1 girerse sunucuda ping -c 4 127.0.0.1 çalışır. Buraya kadar her şey normaldir.",
        "Ancak saldırgan IP yerine 127.0.0.1 ; cat flag.txt yazarsa, arka planda şu çalışır:",
        "ping -c 4 127.0.0.1 ; cat flag.txt",
        "Buradaki noktalı virgül (;) karakteri, işletim sistemine ilk komut (ping) bittikten sonra hemen ikinci komutu (cat) çalıştırmasını söyler. Böylece sunucu bizim istediğimiz dosyayı ekrandan bize sızdırır!"
      ]},
      { icon: "🛡️", h: "Komut Ayırıcılar ve Güvenli Tasarım", body: [
        "Sadece noktalı virgül (;) değil, işletim sistemlerinde farklı işlevlere sahip ayırıcılar da vardır:",
        "• ; veya Yeni Satır (\\n) → Komutları sırayla çalıştırır.",
        "• && → Soldaki komut hatasız biterse sağdakini çalıştırır.",
        "• | (Pipe) → Soldaki komutun çıktısını sağdaki komuta girdi yapar.",
        "Bu zafiyetten korunmanın en iyi yolu sistem komutlarını doğrudan çağırmaktan kaçınmak veya girdileri sadece IP adresi karakterleri içerecek şekilde sıkı bir beyaz liste (regex) ile filtrelemektir."
      ]},
      { icon: "🧪", h: "Laboratuvar Çözüm Adımları", body: [
        "• Adım 1: Laboratuvardaki Ping Utility ağ teşhis panelini bul.",
        "• Adım 2: Girdi alanına 127.0.0.1 ; cat flag.txt yaz.",
        "• Adım 3: Ping Gönder butonuna tıkla.",
        "• Adım 4: Çıktı alanında ping sonuçlarının hemen altında, sunucunun cat komutuyla okuduğu flag.txt dosyasının içeriği belirecektir."
      ]}
    ],
    commandAnatomy: {
      title: "Command Injection Payload Anatomisi",
      cmd: "127.0.0.1 ; cat flag.txt",
      parts: [
        { t: "127.0.0.1", c: "#5cffba", d: "Ping komutunun beklediği geçerli hedef IP adresi." },
        { t: ";", c: "#ffd166", d: "Linux/Unix işletim sistemlerinde komutları arka arkaya çalıştırmak için kullanılan komut sonlandırıcı/ayırıcı." },
        { t: "cat", c: "#569cd6", d: "Belirtilen dosyanın içeriğini okuyup çıktı olarak yazdıran temel sistem komutu." },
        { t: "flag.txt", c: "#74998a", d: "Okumak istediğimiz siber güvenlik bayrağının (flag) bulunduğu dosya yolu." }
      ],
      params: [
        { flag: ";", desc: "Komutları sırayla çalıştırır (Linux / Windows)." },
        { flag: "&&", desc: "Sadece ilk komut başarılı olursa ikinciyi çalıştırır." },
        { flag: "|", desc: "Bir komutun çıktısını diğerine yönlendirir (örn. cat flag.txt | grep siber)." },
        { flag: "||", desc: "Sadece ilk komut hata verirse ikinciyi çalıştırır." }
      ]
    },
    glossary: [
      { term: "Command Injection", def: "Girdilerin işletim sistemi kabuğuna sızarak istenmeyen sistem komutlarının çalıştırılması açığı." },
      { term: "RCE (Remote Code Execution)", def: "Saldırganın sunucuda uzaktan istediği kodu/komutu çalıştırabilmesi zafiyeti." },
      { term: "Shell (Kabuk)", def: "İşletim sistemiyle iletişim kuran komut satırı arayüzü (bash, sh, cmd)." },
      { term: "cat komutu", def: "Dosya içeriklerini okumak ve terminale yazdırmak için kullanılan temel Linux komutu." },
      { term: "Girdi Doğrulama (Sanitization)", def: "Kullanıcının sadece beklenen girdiyi göndermesini sağlayan güvenlik filtresi." }
    ],
    closing: "Tebrikler! Sunucu işletim sistemlerine nasıl komut sızdırılacağını öğrendin. Şimdi laba gir ve sunucuya kendi komutunu çalıştırarak flag'i ele geçir! 💻"
  },

  'web-13': {
    title: "Kaynak Kod Analizi: Göz Önündeki Sırlar",
    readTime: "~4 dk okuma",
    tagline: "Web sitesinin arka planını incele — geliştiricilerin unuttuğu yorumları oku.",
    intro: "Bir web sayfasına baktığında sadece renkli butonlar, resimler ve yazılar görürsün. Ancak tarayıcın bu sayfayı çizebilmek için arka planda HTML adı verilen ham bir kod dosyası indirir. Geliştiriciler bu kodları yazarken, kodun ne işe yaradığını unutmamak için aralara tarayıcıda görünmeyen 'yorum satırları' eklerler. Bazen test yaparken buraya şifreler, gizli URL'ler veya test bayrakları bırakıp unuttukları olur! Bu derste, tarayıcı geliştirici araçlarını (DevTools) kullanarak kaynak kodda gizlenen sırları bulmayı öğreneceksin.",
    sections: [
      { icon: "🌐", h: "HTML ve Sayfa Kaynak Kodu Nedir?", body: [
        "Web tarayıcın (Chrome, Edge vb.), bir sunucudan gelen kodları görsel tasarıma dönüştüren bir makinedir.",
        "HTML (HyperText Markup Language), bu sayfaların iskeletidir. Sayfadaki her paragraf, başlık ve buton HTML etiketleriyle tanımlanır.",
        "Herhangi bir sitenin HTML kodunu görmek için sayfaya sağ tıklayıp 'Sayfa Kaynağını Görüntüle' demen yeterlidir. Sayfanın ham makyajsız hali karşına gelir."
      ]},
      { icon: "💬", h: "HTML Yorum Satırları Ne İşe Yarar?", body: [
        "Geliştiriciler HTML kodunun içine tarayıcı tarafından ekrana çizilmesini istemedikleri notlar ekleyebilirler.",
        "Bunun için <!-- yorumbaslangici ... yorumbitisi --> etiketleri kullanılır.",
        "Bu yorumlar normal ziyaretçiler tarafından görülmez ama sayfanın kodunu inceleyen herkes tarafından kolayca okunabilir. Bu nedenle buraya hassas bilgi yazmak büyük bir güvenlik açığıdır."
      ]},
      { icon: "🛠️", h: "Tarayıcı Geliştirici Araçları (DevTools) Nedir?", body: [
        "Tüm modern tarayıcılarda F12 tuşuna veya Ctrl+Shift+I kombinasyonuna basarak açabileceğin DevTools (Geliştirici Araçları) bulunur.",
        "DevTools'taki Elements (Ögeler) sekmesi, sayfanın canlı HTML kod ağacını incelemeni, etiketleri tıklayarak detaylarını görmeni sağlar.",
        "Siber güvenlik testlerinde (pentest), bir sisteme saldırmadan önce kaynak kodları incelemek en temel keşif (reconnaissance) adımıdır."
      ]},
      { icon: "🧪", h: "Laboratuvar Çözüm Adımları", body: [
        "• Adım 1: Hakkımızda sayfasını veya kurumsal ana sayfayı aç.",
        "• Adım 2: Sayfaya sağ tıklayıp 'İncele' (Inspect) diyerek veya klavyeden F12 tuşuna basarak DevTools'u aç.",
        "• Adım 3: 'Elements' (Ögeler) sekmesindeyken HTML kodlarını incele.",
        "• Adım 4: Kodların arasında yeşil renkli olarak duran <!-- DEVELOPER KEY: siberkampus{...} --> yorum satırını bularak içindeki flag'ı ele geçir."
      ]}
    ],
    glossary: [
      { term: "HTML", def: "Web sayfalarının yapısını ve içeriğini oluşturan standart metin işaretleme dili." },
      { term: "Kaynak Kod (Source Code)", def: "Bir web sayfasının veya programın çalışmasını sağlayan ham kod satırlarının tümü." },
      { term: "HTML Yorum Satırı (<!-- -->)", def: "Tarayıcının ekranda göstermediği, sadece kod düzeyinde okunabilen açıklama metinleri." },
      { term: "DevTools", def: "Tarayıcılarda web sayfalarını incelemek, hata ayıklamak ve ağ trafiğini izlemek için bulunan yerleşik araçlar." },
      { term: "Pasif Keşif (Passive Recon)", def: "Hedefe doğrudan zarar vermeden, kaynak kod analizi gibi yollarla bilgi toplama aşaması." }
    ],
    closing: "Web sayfalarının arkasında ne olduğunu bilmek, siber güvenliğin en temel adımıdır. Şimdi F12 tuşuna basarak kodların derinliklerine dal ve geliştiricinin unuttuğu bayrağı yakala! 🔎"
  }
};
