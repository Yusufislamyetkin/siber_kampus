# Oda Mimarisi Standardizasyon Planı
### "Web Exploitation 1" (web-01) referans mimarisine tüm odaları taşıma

> Amaç: Her oda; kullanıcıyı ezbere değil **neyi neden yaptığını anlayarak** ilerleten,
> adım adım, kullanıcı dostu, gerçek bir pentest senaryosuna oturan bir deneyim sunsun.
> Kullanıcı odayı bitirdiğinde bu tekniği **gerçek bir sızma testinde nasıl uygulayacağını** bilmeli.

---

## 1. Referans Mimari — web-01'in Anatomisi (Altın Standart)

Konum: `app-auth.jsx` → `WEB_ROOM_CONFIGS['web-01']` (satır ~663).

Bir oda config'i şu **sözleşmeye (contract)** uyar:

```
'<room-id>': {
  title:   string,                       // Oda başlığı
  desc:    string,                       // Hedef açıklaması (senaryonun kısa özeti)
  flag:    'siberkampus{...}',           // Tek doğru bayrak
  renderApp: (target, setTarget, runTarget, resp) => JSX,
  run:     (target, customArg) => { ok: true|false|'warn'|'info', msg? }
}
```

`renderApp` içinde web-01 deseninin **5 zorunlu bileşeni**:

| # | Bileşen | web-01'deki karşılığı | Pedagojik amaç |
|---|---------|----------------------|----------------|
| 1 | **İki panelli düzen** (`grid xl:grid-cols-[1.1fr_1.9fr]`) | Sol: hedef login/panel · Sağ: rehber konsolu | Saldırgan ile hedefi aynı ekranda görmek |
| 2 | **Gerçekçi hedef paneli** | Login formu → başarınca canlı Admin Paneli (sys/db/log/flag sekmeleri) | "Gerçek bir sistemi ele geçirdim" hissi |
| 3 | **Durumlu adım rehberi** (`step1Done…stepNDone`) | `○ Kilitli → ● Aktif Adım → ✓ Başarılı` | İlerlemeyi görselleştir, sırayı öğret |
| 4 | **Canlı gözlemci sekmesi** | "CANLI SQL GÖZLEMCİSİ" — yazdıkça renklenen sorgu | Perde arkasını (backend) göster |
| 5 | **Akıllı `feedbackMsg`** | Girdiye göre değişen, **"neden"** anlatan mesaj | Hata → öğrenme dönüşümü |

Çevreleyen ortak çerçeve (her oda otomatik alır — `ChallengeRunner` + wrapper, satır ~3258):
- **Misyon Brifingi modalı** → `MENTOR_LESSONS_INFO[id].scenario / goals / realWorld`
- **Başarı modalı** → `learned` + puan + sonraki oda
- **İpuçları paneli** (`config.hints`) — web-01'de gizli (`room.id !== 'web-01'` koşulu).
- **Bayrak doğrulama** kutusu (ortak).

> **Kritik nokta:** Adım rehberi yeterince iyi olduğunda ayrı "İpuçları" paneline gerek kalmaz.
> web-01'de ipuçları paneli bilerek gizlenmiştir. Standart bu olmalı.

---

## 2. Uyum Analizi — 35 Odanın Sınıflandırması

| Durum | Odalar | Eksik |
|-------|--------|-------|
| ✅ **Standarda uygun** | web-01, web-11, web-12, web-13, web-14, web-15 | — (referans) |
| 🟧 **Eski web (tek-input)** | web-02, web-03, web-04, web-05, web-06, web-07, web-08, web-09, web-10 | Adım rehberi, canlı gözlemci, "neden", iki panel |
| 🟥 **Ağ (interaktif YOK)** | net-01 … net-10 | **Her şey.** Generic fallback flag'i bedava veriyor |
| 🟨 **Sistem (terminal var)** | sys-01 … sys-10 | Adım rehberi, "neden" katmanı, inline ipucu |

Toplam yenilenecek: **29 oda** (9 web + 10 net + 10 sys).

---

## 3. Standart Oda Sözleşmesi (Tüm odalar bunu sağlamalı)

Her yenilenen oda aşağıdaki **8 kabul kriterini** geçmeli:

1. **İki panel:** Sol gerçekçi hedef, sağ adım rehberi/gözlemci.
2. **N adımlı durum makinesi:** `target` state'inden türetilen `stepXDone` boolean'ları.
3. **Kilitli/Aktif/Başarılı görseli:** Sıradaki adım vurgulanır, sonrakiler kilitli.
4. **Canlı geri bildirim:** Kullanıcı her girdi değişikliğinde "neden" içeren mesaj alır.
5. **Canlı gözlemci:** Perde arkası (SQL/HTTP/terminal/cookie/header) gerçek zamanlı gösterilir.
6. **Hedef başarı durumu:** Son adımda hedef panel "ele geçirildi" haline döner ve bayrağı **kazanılmış olarak** gösterir (bedava vermez — eylemle açılır).
7. **`run()` doğrulaması:** Gerçek payload mantığını kontrol eder; yanlışta `warn`/`info` ile yönlendirir.
8. **Senaryo bütünlüğü:** `MENTOR_LESSONS_INFO` brifingiyle (scenario → goals → realWorld → learned) tutarlı.

---

## 4. Zorluğa Göre İpucu/Adım Yoğunluğu (Önemli kural)

Kullanıcının notu: *"en yüksek seviye uzmanda ipuçları daha az olacak."*
Bu yüzden adım rehberinin **detay seviyesi zorlukla ters orantılı** olmalı:

| Zorluk | Adım sayısı | Rehber detayı | Payload | Canlı gözlemci |
|--------|-------------|---------------|---------|----------------|
| **Başlangıç** | 3–4 küçük adım | Her adımda tam açıklama + örnek payload gösterilir | Placeholder'da tam payload | Açık, her şeyi gösterir |
| **Orta** | 2–3 adım | Açıklama var, payload **parçalı** verilir (kullanıcı birleştirir) | Sadece şablon (`UNION SELECT ?,?,?`) | Açık ama yorum azaltılmış |
| **İleri** | 2 adım | Yön gösterir, payload'u **vermez**, mantığı anlatır | Yok | Ham çıktı, yorumsuz |
| **Uzman** | 1–2 üst-düzey hedef | Sadece "neyi başarman gerek" + kavramsal ipucu | Yok | Minimal/ham log |

> Yani standart **mimari aynı** kalır (iki panel + durum makinesi + gözlemci),
> değişen **rehber metninin ne kadar el verdiğidir.** Uzman odalar zorlayıcı kalır
> ama yine de kullanıcı dostu ve adım yapısına sahip olur — sadece cevabı söylemez.

---

## 5. Kategori Bazlı Göç Planı

### 5A. Eski Web Odaları (9 oda) — `WEB_ROOM_CONFIGS` içini zenginleştir

Her biri için yapılacak (zorluk yoğunluğuyla):

| Oda | Konu | Sol panel (hedef) | Sağ gözlemci | Adım zinciri |
|-----|------|-------------------|--------------|--------------|
| web-02 (Orta) | UNION SQLi | Kullanıcı portalı → dump tablosu | Canlı SQL + sütun sayacı | `ORDER BY` ile sütun bul → `UNION SELECT` → tablo/kolon dök |
| web-03 (İleri) | Blind SQLi | True/False yanıt rozeti | Boolean cevap geçmişi | Koşul enjekte → `SUBSTRING` ile karakter sızdır (payload verilmez) |
| web-04 (Başlangıç) | Reflected XSS | Arama kutusu + canlı DOM | Yansıyan HTML kaynağı | Girdi yansımasını gör → `<script>` enjekte → cookie çal |
| web-05 (Orta) | Stored/DOM XSS | Yorum defteri + admin bot | Kayıtlı payload listesi | Payload kaydet → admin tetikler → oturum çal |
| web-06 (Orta) | CSRF | Sahte exploit sayfası | Giden HTTP isteği önizleme | Endpoint keşfi → otomatik form/img kur → istek tetikle |
| web-07 (İleri) | File Upload | Dosya yükleme formu + dosya listesi | MIME/uzantı kontrol logu | Filtre tespiti → `.php` bypass (çift uzantı/MIME) → shell çalıştır |
| web-08 (İleri) | SSRF & XXE | XML/URL giriş alanı | Sunucu iç istek logu | XXE entity kur → `file:///etc/passwd` oku |
| web-09 (Uzman) | JWT | Token decoder paneli | Header/payload/imza ayrıştırıcı | `alg:none` keşfi → payload `role:admin` → imza bypass |
| web-10 (Uzman) | Capstone | Çok aşamalı uygulama | Aşama ilerleme HUD'u | SQLi → priv-esc → flag (zincir, minimal el verme) |

**Uygulama:** Her odanın mevcut basit `renderApp`'ini, web-01/web-11 desenini şablon alarak
iki panelli + durum makineli sürümle değiştir. `desc`, `flag`, `run` mantığı korunur/güçlendirilir.
Eski `hints[]` dizisi → adım rehberine taşınır (Başlangıç/Orta'da), İleri/Uzman'da seyreltilir.

### 5B. Ağ Odaları (10 oda) — Sıfırdan interaktif sim (EN YÜKSEK ÖNCELİK)

Şu an flag'i bedava veriyorlar; en büyük açık burada. Web terminal/konsol metaforu uygun değil
— ağ araçları için **simüle komut konsolu + canlı çıktı** deseni kurulmalı. Yeni bir
`NET_ROOM_CONFIGS` veya `SysTerminalSim` benzeri `NetToolSim` bileşeni önerilir.

| Oda | Araç metaforu | Adım zinciri | Yoğunluk |
|-----|---------------|--------------|----------|
| net-01 | `nmap` konsolu | Host keşfi → port tara → servis/sürüm tespiti | Başlangıç (tam rehber) |
| net-04 | `hydra`/ssh | Kullanıcı listesi → wordlist → brute → giriş | Başlangıç |
| net-02 | `arpspoof`+sniff | Hedef seç → ARP zehirle → trafik yakala | Orta |
| net-03 | `smbclient`/enum | Paylaşım listele → null session → dosya çek | Orta |
| net-05 | `dig axfr` | NS bul → zone transfer dene → subdomain dök | Orta |
| net-06 | `aircrack` | Monitor mod → handshake yakala → kır | İleri |
| net-07 | VLAN hop | Trunk tespiti → çift etiket → segment atla | İleri |
| net-08 | pivot/tunnel | İlk erişim → proxychains → iç ağa eriş | Uzman |
| net-09 | AD recon | Domain enum → `BloodHound` mantığı → yol bul | Uzman |
| net-10 | Full pentest | Recon→exploit→privesc→pivot zinciri | Uzman |

> Her birinde sol panel = ağ topolojisi/hedef durumu görseli, sağ panel = komut konsolu +
> adım rehberi. Bayrak ancak doğru komut zinciri girilince çıkar.

### 5C. Sistem Odaları (10 oda) — `SysTerminalSim`'i rehberle güçlendir

Terminal zaten interaktif (satır ~2502). Eksik olan **adım rehberi + "neden" katmanı.**
Önerilen: `SysTerminalSim`'i tek panelden **iki panele** çıkar — sol terminal (mevcut),
sağ "ADIM ADIM REHBER" paneli. Rehber, terminalde girilen komutları gözleyip (`history`)
hangi adımın tamamlandığını işaretler (örn. `whoami` çalıştı → Adım 1 ✓).

| Oda | Adım zinciri (rehberde) | Yoğunluk |
|-----|------------------------|----------|
| sys-01 | `ls` → `cd` → `cat` ile dosya oku | Başlangıç |
| sys-02 | SUID bul (`find -perm`) → GTFOBins → root | Başlangıç |
| sys-03 | kernel sürüm → exploit derle → çalıştır | Orta |
| sys-04 | cron oku → yazılabilir script → bekle | Orta |
| sys-05 | PATH incele → sahte binary → tetikle | Orta |
| sys-06 | `whoami /priv` → PrintSpoofer → SYSTEM | İleri |
| sys-07 | offset bul → EIP ezme → shell | İleri |
| sys-08 | NX bypass → ROP zinciri → system() | Uzman |
| sys-09 | privileged tespiti → mount → breakout | Uzman |
| sys-10 | initial→privesc→root zinciri | Uzman |

> "Neden" katmanı: rehberde her komutun **ne işe yaradığı** kısa kutuda anlatılır
> (örn. *"`find / -perm -4000` → SUID bitli dosyaları arar; bunlar sahibinin yetkisiyle çalışır"*).
> Uzman odalarda bu açıklamalar kavramsal kalır, komut verilmez.

---

## 6. Senaryo & Pedagoji Standardı (Her oda için)

Mevcut `MENTOR_LESSONS_INFO` yapısı korunur ama her oda için **netlik denetimi**:

- **scenario:** Net bir "kim/ne/neden" — *"X şirketinin Y paneline atandın, Z açığını sömür."*
  Belirsiz/jenerik cümleler ("bu odaya sız") **yenilenir.**
- **goals:** Öğrenilecek 3 somut beceri.
- **realWorld:** *"Bunu gerçek pentest'te ne zaman/nasıl kullanırsın + savunma önerisi"*
  — kullanıcının transfer yapabilmesi için zorunlu.
- **learned:** Başarı modalında "ne öğrendin" pekiştirmesi.

Ayrıca her adım rehberine **"Gerçek hayatta"** mikro-notu eklenebilir (web-01'deki yorum satırı gibi).

---

## 7. Uygulama Sırası (Fazlar)

| Faz | Kapsam | Gerekçe | Tahmini iş |
|-----|--------|---------|-----------|
| **0** | Ortak `StepGuide` / `LiveObserver` / `TargetPanel` yardımcı bileşenlerini ayıkla | Tekrarı önle, 29 oda hızlansın | 1 birim |
| **1** | net-01…net-10 (`NetToolSim`) | En büyük açık (flag bedava) | 4 birim |
| **2** | Eski web: web-02..web-08 | Çok ziyaret edilen kategori | 3 birim |
| **3** | web-09, web-10 (Uzman) | Düşük el-verme deseni pilotu | 2 birim |
| **4** | sys-01…sys-10 (`SysTerminalSim` iki panel) | Terminal zaten var, sadece rehber | 2 birim |
| **5** | Senaryo netlik denetimi + QA | Tüm 35 oda tutarlılık | 1 birim |

> **Pilot öneri:** Faz 1'de önce **net-01**'i tam yap, deseni onaylat, sonra kalan 9 ağ odasına uygula.

---

## 8. Kalite Kontrol Listesi (Her oda PR'ında)

- [ ] İki panel mevcut ve responsive (mobilde alt alta).
- [ ] Adım durumları doğru ilerliyor (kilitli→aktif→başarılı).
- [ ] Yanlış girdide "neden" açıklayan feedback geliyor.
- [ ] Bayrak **eylemle** açılıyor, statik basılmıyor.
- [ ] `run()` gerçek payload mantığını doğruluyor (kopyala-yapıştır dışı denemeleri de kabul/ret).
- [ ] Zorluğa uygun el-verme (Uzman'da payload verilmiyor).
- [ ] Senaryo net, `realWorld` transfer bilgisi içeriyor.
- [ ] Başarı modalı `learned` ile tutarlı.
- [ ] web-01'de olduğu gibi gereksiz `hints[]` paneli gizli (rehber yeterliyse).

---

## 9. Teknik Notlar / Riskler

- **Dosya boyutu:** `app-auth.jsx` zaten ~254KB. 29 zengin oda eklemek dosyayı büyütür →
  Faz 0'da ortak bileşenleri ayrı dosyaya (`room-kit.jsx`) çıkarmak şiddetle önerilir.
- **`net-*` config yolu:** Şu an net odaları `WEB_ROOM_CONFIGS`'te yok, generic fallback'e düşüyor.
  Ya `WEB_ROOM_CONFIGS`'i `ROOM_CONFIGS` olarak genelleştir, ya da kategori bazlı ayrı map kur
  ve `config = WEB_ROOM_CONFIGS[id] || NET_ROOM_CONFIGS[id] || ...` zinciri yap.
- **Geriye uyum:** `run`/`flag`/`MENTOR_LESSONS_INFO` sözleşmesi korunursa wrapper hiç değişmez.
- **Bayrak tutarlılığı:** Her odanın `flag`'i `getSysFlag`/config ile **birebir** aynı olmalı
  (kullanıcı panelden okuyup doğrulama kutusuna girecek).
```
