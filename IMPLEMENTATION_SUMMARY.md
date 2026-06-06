# 5 Yeni Başlangıç Seviyesi Web Exploitation Odası - Uygulama Özeti

## Tamamlanan Görevler

Başarıyla eklenmiş 5 adet yeni başlangıç seviyesi web sömürüsü odası:

### 1. **web-11: Varsayılan Parola Sömürüsü (Weak/Default Credentials)**
- **Senaryo**: ASUS RT-3200 router yönetim paneline varsayılan kimlik bilgileriyle (admin/admin) erişim
- **Adımlar**:
  - Adım 1: Varsayılan kullanıcı adını (admin) girin
  - Adım 2: Varsayılan şifreyi (admin) girin
  - Adım 3: "Giriş Yap" butonuna basarak router paneline sızın
- **Gözlemci Konsolu**: HTTP POST isteği (POST /login) ve form verilerini gösterir
- **Flag**: `siberkampus{default_credentials_router_admin}`
- **Zorluk**: Başlangıç | **Puan**: 50

### 2. **web-12: Komut Enjeksiyonu Temelleri (Command Injection)**
- **Senaryo**: Ping aracında kullanıcı girdisi filtrelenmeden shell'e gönderiliyor
- **Adımlar**:
  - Adım 1: IP kutusuna normal IP girin (127.0.0.1)
  - Adım 2: Komut ayırıcı (;) ekleyerek iki komutu ayırın
  - Adım 3: Bayrak dosyasını okumak için `; cat flag.txt` ekleyin
- **Gözlemci Konsolu**: Derlenmiş terminal komutu ve işletim sistemi çıktısını gösterir
- **Flag**: `siberkampus{command_injection_shell_execution}`
- **Zorluk**: Başlangıç | **Puan**: 50

### 3. **web-13: Kaynak Kod Analizi (HTML Comments)**
- **Senaryo**: Kurumsal web sitesinin HTML kaynak kodunda geliştirici yorumlarında bayrak gizli
- **Adımlar**:
  - Adım 1: Sayfanın HTML kaynağını (DevTools) açın
  - Adım 2: HTML yorum satırlarını (`<!-- ... -->`) tarayın
  - Adım 3: Gizlenen bayrağı kopyalayıp doğrulama kutusuna girin
- **Gözlemci Konsolu**: Renklendirilmiş HTML kodu ve developer anahtarını içeren yorum satırını gösterir
- **Flag**: `siberkampus{html_comments_developer_secrets}`
- **Zorluk**: Başlangıç | **Puan**: 50

### 4. **web-14: Dizin Geçişi Temelleri (Directory Traversal)**
- **Senaryo**: Dosya indirme parametresi girdi filtresi barındırmıyor
- **Adımlar**:
  - Adım 1: Dosya adına `..` girin (üst dizine tırmanma)
  - Adım 2: `/` ekleyerek dizin yolunu oluşturun (`../../`)
  - Adım 3: Bayrak dosyasını çağırın: `../../flag.txt`
- **Gözlemci Konsolu**: Dosya yolu çözümleyicisinin canlı çıktısını gösterir (/var/www/flag.txt erişimi)
- **Flag**: `siberkampus{directory_traversal_root_access}`
- **Zorluk**: Başlangıç | **Puan**: 50

### 5. **web-15: Çerez Manipülasyonu (Cookie Tampering)**
- **Senaryo**: E-ticaret sitesi kullanıcı rolünü şifrelenmemiş istemci çerezinde saklamaktadır
- **Adımlar**:
  - Adım 1: DevTools'ta çerez değerini (role=guest) inceleyin
  - Adım 2: Çerez rolünü (role=admin) değiştirin
  - Adım 3: "Çerezi Güncelle ve Yenile" butonuna basarak admin paneline erişin
- **Gözlemci Konsolu**: HTTP istek başlığındaki çerez bilgisini gösterir
- **Flag**: `siberkampus{cookie_tampering_privilege_escalation}`
- **Zorluk**: Başlangıç | **Puan**: 50

---

## Dosya Değişiklikleri

### 1. **sk-data.jsx** - Veri Kaynağı Güncellemeleri

#### SK_CATEGORIES Güncellemesi
- Web Exploitation kategorisine 5 yeni oda eklendi
- Yeni odalar Başlangıç zorluk seviyesine sahip
- Her oda 50 puan değerinde
- Yeni kullanıcı sayıları ve açıklamalar eklendi

#### MENTOR_LESSONS_INFO Güncellemesi
- web-11, web-12, web-13, web-14, web-15 için brifingler eklendi
- Her oda için:
  - `scenario`: Senaryo açıklaması
  - `goals`: Öğrenme hedefleri (3-4 madde)
  - `realWorld`: Gerçek dünya pratikleri
  - `learned`: Kazanımlar (2 madde)

### 2. **app-auth.jsx** - Simülatör ve Doğrulama Yapılandırması

#### WEB_ROOM_CONFIGS Güncellemesi
Her oda için:

- **title**: Oda başlığı
- **desc**: Oda açıklaması
- **flag**: Başarı bayrağı
- **renderApp()**: İnteraktif UI
  - Sol Panel: Simülasyon ekranı (beyaz sayfa, 390px sabit yükseklik)
  - Sağ Panel: İnteraktif rehber + Gözlemci konsolu
  - Adım adım rehber sekmesi (dinamik yeşil işaretleme)
  - Canlı gözlemci sekmesi (teknik açıklamalar)
- **run()**: Doğrulama fonksiyonu (girdiye göre başarı/başarısızlık)

---

## UI/UX Özellikleri

✅ **Mobil Boyutlu Kilitli Pencere**
- Sol panel: 1.1fr (simülasyon)
- Sağ panel: 1.9fr (rehber + gözlemci)
- 390px sabit yükseklik için uyumlu

✅ **Kurumsal Beyaz Sayfa Tasarımı**
- Profesyonel renk paleti
- Düzgün tipografi ve aralıklama
- Ikon ve görsel hiyerarşisi

✅ **Görsel Mentör Brifingleri**
- Siber mentör başlangıç ekranı
- Scenario, goals, realWorld, learned bölümleri

✅ **İnteraktif Rehber Adımları**
- Adımlar dinamik olarak yeşile dönüyor
- Completion indicators
- Canlı geri bildirim mesajları

✅ **Canlı Gözlemci Kodu**
- HTTP istek detayları
- Terminal komutları
- Dosya yolu analizleri
- Çerez bilgileri
- Renklendirilmiş sözdizimi

✅ **Loading ve Success Panelleri**
- Yükleniyor animasyonu
- Başarı ekranı
- Bayrak teslim görüntüsü

---

## Doğrulama Kontrol Listesi

### Otomatik Testler
- [ ] `node babel_check.js` komutu sorunsuz şekilde derlenir
- [ ] Syntax hataları yok
- [ ] Bağlantı ve referans hataları yok

### Manuel Doğrulama (Her Oda)

#### web-11: Varsayılan Parola
- [ ] Mentor başlangıç brifing ekranı yüklenir
- [ ] Router simülasyonu görünür
- [ ] "Adım Adım Rehber" sekmesi çalışır
- [ ] Admin/admin girişi başarılı olur
- [ ] Bayrak teslim edilir

#### web-12: Komut Enjeksiyonu
- [ ] Ping paneli simülasyonu yüklenir
- [ ] Komut enjeksiyonu örneği çalışır
- [ ] Terminal çıktısı görünür
- [ ] Bayrak dosyası okunur

#### web-13: Kaynak Kod Analizi
- [ ] Web sitesi simülasyonu yüklenir
- [ ] HTML kaynak kodu sekmesi gösterir
- [ ] Yorum satırında bayrak gösterilir
- [ ] Bayrak doğrulama çalışır

#### web-14: Dizin Geçişi
- [ ] Dosya indirme paneli yüklenir
- [ ] Path traversal örneği çalışır
- [ ] Yol çözümleyici doğru gösterir
- [ ] /var/www/flag.txt erişimi sağlanır

#### web-15: Çerez Manipülasyonu
- [ ] E-ticaret sitesi simülasyonu yüklenir
- [ ] Çerez durumu sekmesi çalışır
- [ ] Cookie düzenleme formu çalışır
- [ ] Admin paneline yetki yükseltmesi sağlanır

---

## Teknoloji Stack

- **Framework**: React.js (Babel transpilation)
- **Styling**: Tailwind CSS
- **State Management**: React useState/useEffect
- **Data Source**: Window global (sk-data.jsx)

---

## Notlar

1. Tüm yeni odalar **Başlangıç** zorluk seviyesinde
2. Her oda **50 puan** değerinde
3. **Türkçe arayüz** ve brifinglerle tam entegrasyon
4. **Web-01 (SQL Injection Temelleri)** ile aynı UI standardlarını takip
5. **Responsive tasarım** - Mobil ve desktop desteği

---

**Tamamlama Tarihi**: 6 Haziran 2026
**Durum**: ✅ Tamamlandı - Doğrulamaya Hazır
