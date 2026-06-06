# Siber Kampüs — 35 Oda İç Mimari Yenileme Planı v2
**Tarih:** 2026-06-06 · **Amaç:** Tüm odaları web-01 altın standardına taşımak

---

## 0. ALTIN STANDART MİMARİ (web-01 referans)

Her oda şu bileşenlere sahip olmalı:

```
ODA CONFIG = {
  title: string,
  desc: string,
  flag: string,                    // ← server.js ROOM_FLAGS ile BİREBİR AYNI
  hints?: string[],                // Zorluk arttıkça azalır (Başlangıç: 3, Orta: 2, İleri: 1, Uzman: 0)
  renderApp: (target, setTarget, runTarget, resp) => JSX,
  run: (target, customArg?) => { ok: true|false|'warn'|'info', msg? }
}
```

### renderApp İÇ YAPI (İki Panel Düzeni):
```
┌─────────────────────────────────────────────────┐
│ Sol Panel (1.1fr)         │ Sağ Panel (1.9fr)   │
│                           │                     │
│ Gerçekçi hedef arayüzü   │ Tab 1: ADIM ADIM    │
│ (login formu, router      │        REHBER        │
│  paneli, terminal, vb.)   │                     │
│                           │ Tab 2: CANLI         │
│ Kullanıcı burada          │        GÖZLEMCİ     │
│ etkileşime girer          │ (SQL, HTTP, vb.)     │
│                           │                     │
│ Başarı sonrası:           │ Adımlar:             │
│ Admin paneli / flag       │ ○ Kilitli            │
│ gösterimi                 │ ◉ Aktif (pulse)      │
│                           │ ✓ Tamamlandı         │
└─────────────────────────────────────────────────┘
```

### Stateful Step Machine:
- `target` state objesi üzerinden `stepXDone` boolean'ları türetilir
- Her adım bir öncekine bağlıdır (sıralı kilit açma)
- Kullanıcı girdisi anlık olarak değerlendirilir (her keystroke)
- Her adımda detaylı açıklayıcı feedback mesajı
- Yanlış sıra koruması (ileri adımlar kilitli)
- Başarı animasyonu + flag gösterimi

---

## 1. MEVCUT DURUM HARİTASI

### ✅ A. Altın Standart Odalar (7/35) — Dokunulmayacak
| Oda | Lab Tipi | İki Panel | Adım Rehber | Canlı Gözlemci | Flag Eşleşme |
|------|----------|-----------|-------------|----------------|--------------|
| web-01 | Login bypass formu | ✅ | ✅ 3 adım | ✅ SQL Gözlemcisi | ✅ |
| web-11 | Router login paneli | ✅ | ✅ 4 adım | ✅ Ağ Monitörü | ✅ |
| web-12 | Ping utility | ✅ | ✅ 3 adım | ✅ Terminal Çıktısı | ✅ |
| web-13 | HTML kaynak kodu | ✅ | ✅ 3 adım | ✅ DevTools Sim | ✅ |
| web-14 | Dosya indirme | ✅ | ✅ 3 adım | ✅ Dosya Sistemi | ✅ |
| web-15 | E-ticaret + cookie | ✅ | ✅ 4 adım | ✅ Cookie Editörü | ✅ |
| net-01 | Nmap konsol | ✅ | ✅ 3 adım | ✅ Ağ Haritası | ✅ |

### ⚠️ B. Legacy Web Odaları (8/35) — YENİDEN YAZILACAK
| Oda | Mevcut Durum | Eksikler | Flag Eşleşme |
|------|-------------|----------|--------------|
| web-02 | Tek form + tablo | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-03 | Tek form + True/False | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-04 | Tek form + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ✅ |
| web-05 | Yorum formu + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-06 | Textarea + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-07 | File picker + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-08 | Textarea + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |
| web-09 | Textarea + response | İki panel YOK, adım rehber YOK, gözlemci YOK | ❌ client≠server |

### ⚠️ C. Capstone Web (1/35) — BÜYÜK YENİDEN YAZIM
| Oda | Mevcut Durum | Eksikler | Flag Eşleşme |
|------|-------------|----------|--------------|
| web-10 | Terminal tabanlı 4 aşama | İki panel YOK ama mantık iyi, terminal arayüzü güzel; adım rehber paneli eklenecek, gözlemci tab eklenecek | ❌ client≠server |

### 🔴 D. Net Odaları (9/35) — SIFIRDAN YAZILACAK
| Oda | Mevcut Durum | Not |
|------|-------------|-----|
| net-02 | Generic fallback — flag bedava | ARP Spoofing simülasyonu gerekli |
| net-03 | Generic fallback — flag bedava | SMB/EternalBlue simülasyonu gerekli |
| net-04 | Generic fallback — flag bedava | SSH Brute Force simülasyonu gerekli |
| net-05 | Generic fallback — flag bedava | DNS Zone Transfer simülasyonu gerekli |
| net-06 | Generic fallback — flag bedava | WiFi Hacking simülasyonu gerekli |
| net-07 | Generic fallback — flag bedava | VLAN Hopping simülasyonu gerekli |
| net-08 | Generic fallback — flag bedava | Pivotlama simülasyonu gerekli |
| net-09 | Generic fallback — flag bedava | AD Recon simülasyonu gerekli |
| net-10 | Generic fallback — flag bedava | Full Network Pentest capstone gerekli |

### 🟡 E. Sys Odaları (10/35) — MEVCUT İYİ, GELİŞTİRİLECEK
| Oda | Mevcut Durum | Eksikler |
|------|-------------|----------|
| sys-01..10 | SysTerminalSim (Linux/Windows terminal) | İki panel düzeni YOK (sadece terminal), ADIM REHBER paneli YOK, adımlar kilitli→aktif→tamamlandı mantığı YOK. Terminal mantığı sağlam ama kullanıcı rehbersiz. |

---

## 2. FLAG UYUMSUZLUKLARI (KRİTİK BUG)

Aşağıdaki odalarda client-side flag ≠ server.js ROOM_FLAGS. Kullanıcı doğru flag'i girince bile sunucu REDDEDER.

| Oda | Client (app-auth.jsx) | Server (server.js) | Aksiyon |
|------|----------------------|---------------------|---------|
| web-02 | `sql_union_admin_database_dump` | `union_based_sqli_data_dumped` | Server'a hizala |
| web-03 | `blind_sqli_boolean_extraction` | `blind_sqli_db_hash_extracted` | Server'a hizala |
| web-05 | `stored_xss_admin_session_hijacked` | `stored_xss_session_hijacked` | Server'a hizala |
| web-06 | `csrf_token_missing_state_compromised` | `csrf_admin_password_changed` | Server'a hizala |
| web-07 | `rce_via_file_upload_bypass_achieved` | `file_upload_bypass_webshell` | Server'a hizala |
| web-08 | `ssrf_xxe_internal_recon_success` | `ssrf_internal_metadata_exposed` | Server'a hizala |
| web-09 | `jwt_none_algorithm_signature_bypass` | `jwt_none_alg_bypass` | Server'a hizala |
| web-10 | `ultimate_web_pentest_capstone_mastered` | `web_capstone_root_compromised` | Server'a hizala |

**Strateji:** Server flag'lerini DEĞİŞTİRME (veritabanında eski çözümler bozulur). Client flag'lerini server'a hizala.

---

## 3. UYGULAMA PLANI — FAZLAR

### ═══════════════════════════════════════════
### FAZ 0: HAZIRLIK (Tüm fazlardan önce)
### ═══════════════════════════════════════════

**0.1 — Flag uyumsuzluklarını düzelt** (8 oda, ~15dk)
- `app-auth.jsx`'teki 8 odanın `flag` değerini `server.js` ROOM_FLAGS ile eşitle
- renderApp içindeki flag gösterimlerini de güncelle
- `index.html` cache version bump

**0.2 — Blank page debug** (~10dk)
- `/brief/net-01` makale sayfası mount kontrolü
- GlowType/ArticleCard/RoomArticlePage doğrulaması

### ═══════════════════════════════════════════
### FAZ 1: LEGACY WEB ODALARI (8 oda)
### ═══════════════════════════════════════════

Her oda aynı şablonu takip eder. Öncelik: Orta zorluk → İleri → Uzman

#### 1.1 — web-04: XSS (Reflected) → Altın Standarda Yükselt
**Sol Panel:** E-ticaret arama sayfası simülasyonu
- Arama kutusu + sonuç alanı
- XSS tetiklenince cookie alert simülasyonu
- Başarı sonrası: Saldırganın sunucusuna giden cookie log ekranı

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: Arama kutusuna normal metin yaz → Girdi yansıyor mu gözlemle
  - Adım 2: `<script>` etiketi dene → Hata/filtreleme var mı
  - Adım 3: `<script>alert(document.cookie)</script>` payload'u → Cookie çalma
- Tab 2: HTTP İSTEK GÖZLEMCİSİ
  - URL'deki `?q=` parametresinin canlı gösterimi
  - HTML çıktısında enjekte edilen kodun vurgulanması

**Step Machine:**
- `target.q` içinde `<script>` → step1Done
- `alert` veya `onerror` içeriyor → step2Done  
- `document.cookie` içeriyor → step3Done (flag açılır)

**Hints:** 3 (Başlangıç seviye)

---

#### 1.2 — web-02: UNION-Based SQLi → Altın Standarda Yükselt
**Sol Panel:** Kullanıcı bilgi portalı (tablo görünümü)
- ID girdi alanı + sonuç tablosu
- Normal sorgu: tek satır döner
- UNION sorgu: admin hash + flag satırları eklenir
- Başarı: Veritabanı dump ekranı

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (4 adım)
  - Adım 1: ID=1, ID=2 dene → Normal çıktıyı gözlemle
  - Adım 2: `1'` ile SQL kır → Syntax hata feedback'i
  - Adım 3: `ORDER BY` ile sütun sayısını bul
  - Adım 4: `UNION SELECT 1,2,password FROM users --` ile dump
- Tab 2: CANLI SQL GÖZLEMCİSİ (web-01 tarzı)
  - Arka plandaki SQL sorgusunun canlı gösterimi
  - UNION kısmının vurgulanması

**Step Machine:**
- `target.id` contains `'` → step1Done (SQL kırıldı)
- `order by` → step2Done
- `union` + `select` → step3Done
- `union` + `select` + (`users`|`password`|`flag`) → step4Done (flag)

**Hints:** 2 (Orta seviye)

---

#### 1.3 — web-05: XSS (Stored & DOM) → Altın Standarda Yükselt
**Sol Panel:** Ziyaretçi defteri/yorum paneli
- Mevcut yorumlar listesi (gerçekçi avatarlar + isimler)
- Yorum yazma formu (ad + yorum)
- Gönderilen yorum listeye eklenir (XSS tetiklenirse `dangerouslySetInnerHTML`)
- Admin "yorumları kontrol ediyor" animasyonu → cookie sızdırma

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: Normal yorum yaz → Gözlemle
  - Adım 2: `<b>test</b>` gibi HTML dene → Filtre var mı
  - Adım 3: `<script>fetch('/log?c='+document.cookie)</script>` → Stored XSS
- Tab 2: DOM GÖZLEMCİSİ
  - Yorumun DOM ağacındaki canlı HTML gösterimi
  - Script etiketinin kırmızı vurgulanması

**Hints:** 2 (Orta seviye)

---

#### 1.4 — web-06: CSRF Saldırıları → Altın Standarda Yükselt
**Sol Panel:** İkiye bölünmüş ekran
- Üst: "Kurban Kullanıcının Tarayıcısı" (profil sayfası + şifre değiştirme formu simülasyonu)
- Alt: "Saldırganın Exploit Editörü" (HTML/JS textarea)
- Exploit gönderilince kurban tarayıcısında form otomatik submit animasyonu

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: Şifre değiştirme formunun kaynak kodunu incele → CSRF token yok
  - Adım 2: Sahte HTML form veya iframe hazırla
  - Adım 3: Exploit'i "kurbana gönder" → Otomatik şifre değişimi
- Tab 2: HTTP AKIŞ GÖZLEMCİSİ
  - Saldırgan → Kurban → Sunucu istek akışı diyagramı

**Hints:** 2 (Orta seviye)

---

#### 1.5 — web-03: Blind SQL Injection → Altın Standarda Yükselt
**Sol Panel:** Kullanıcı arama paneli
- Arama kutusu + Var/Yok (True/False) yanıt kutusu
- Her sorguda yanıt animasyonu (yeşil ✓ / kırmızı ✗)
- Başarıda: Karakter karakter flag çözülme animasyonu

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: `admin` yaz → True döner. `' AND 1=1 --` → True. `' AND 1=2 --` → False
  - Adım 2: `SUBSTRING` ile flag'in ilk karakterini test et
  - Adım 3: Doğru karakter bulunca flag açılır
- Tab 2: BOOLEAN ANALİZ GÖZLEMCİSİ
  - Her sorgunun True/False sonucu + zaman damgası tablosu
  - Çıkarım mantığının görsel gösterimi

**Hints:** 1 (İleri seviye)

---

#### 1.6 — web-07: File Upload Bypass → Altın Standarda Yükselt
**Sol Panel:** Profil resmi yükleme arayüzü
- Drag & drop + dosya seçici
- Dosya adı giriş alanı (simüle — gerçek dosya yerine isim yazılır)
- MIME type seçici dropdown
- Upload sonucu: Başarı → /uploads/ dizini + shell çıktısı

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: `test.php` yükle → ".php uzantısı engellendi" hatası
  - Adım 2: `shell.php.png` veya `shell.phtml` dene → Bypass tespiti
  - Adım 3: Shell aktif → `cat flag.txt` komutu
- Tab 2: SUNUCU DOSYA SİSTEMİ GÖZLEMCİSİ
  - /uploads/ dizini içeriği (canlı güncellenen)
  - Dosya uzantısı analizi tablosu

**Hints:** 1 (İleri seviye)

---

#### 1.7 — web-08: SSRF & XXE → Altın Standarda Yükselt
**Sol Panel:** XML Veri Ayrıştırıcı API arayüzü
- XML textarea editörü (syntax highlight simülasyonu)
- "Parse" butonu
- Sonuç: Normal XML → parsed output, XXE → /etc/passwd içeriği

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: Normal XML gönder → Parser çalışıyor doğrula
  - Adım 2: `<!DOCTYPE>` ile ENTITY tanımla
  - Adım 3: `<!ENTITY xxe SYSTEM "file:///etc/passwd">` + `&xxe;` → Dosya okunur
- Tab 2: XML PARSER GÖZLEMCİSİ
  - XML ağacının parse ediliş aşamaları
  - ENTITY çözümlenme süreci

**Hints:** 1 (İleri seviye)

---

#### 1.8 — web-09: JWT Token Exploitation → Altın Standarda Yükselt
**Sol Panel:** JWT Editor paneli
- 3 bölümlü JWT gösterimi (Header | Payload | Signature — renkli)
- Her bölüm Base64 decode edilmiş halde gösterilir
- Düzenleme alanları: Header JSON + Payload JSON + Signature
- Otomatik encode/decode

**Sağ Panel:**
- Tab 1: ADIM ADIM REHBER (3 adım)
  - Adım 1: Mevcut token'ı decode et → Header'da `HS256`, Payload'da `role: "user"`
  - Adım 2: Header `alg` → `none` yap, Payload `role` → `admin` yap
  - Adım 3: Signature'ı sil, yeni token'ı gönder → Bypass
- Tab 2: TOKEN DOĞRULAMA GÖZLEMCİSİ
  - İmza doğrulama akışı (yeşil/kırmızı)
  - Server-side validation simülasyonu

**Hints:** 0 (Uzman seviye — ipucu yok)

---

#### 1.9 — web-10: Web App Pentest Capstone → Altın Standarda Yükselt
**Sol Panel:** Terminal (mevcut terminal mantığı korunacak, görsel iyileştirilecek)
- 4 aşamalı terminal çıktısı (mevcut mantık iyi)
- Aşama göstergesi sol üstte

**Sağ Panel:** (YENİ — eklenmesi gereken)
- Tab 1: OPERASYON REHBERİ
  - Aşama 1: SQLi bypass (kilitli→aktif→tamam)
  - Aşama 2: JWT manipulation
  - Aşama 3: File upload bypass
  - Aşama 4: Flag okuma
- Tab 2: MİSYON BRİFİNG
  - Hedef sistem bilgileri (IP, portlar, servisler)
  - Keşfedilen bilgiler (her aşamada güncellenir)

**Hints:** 0 (Uzman seviye — ipucu yok)

---

### ═══════════════════════════════════════════
### FAZ 2: NET ODALARI (9 oda — sıfırdan)
### ═══════════════════════════════════════════

Tüm net odaları terminal/konsol tabanlı olacak (net-01 şablonu).

#### 2.1 — net-04: SSH Brute Force & Key Attacks
**Sol Panel:** SSH bağlantı terminali
- Hedef IP + port bilgisi
- `ssh` ve `hydra` komut simülasyonu
- Başarılı bağlantı sonrası: uzak shell + flag

**Sağ Panel:** 3 Adım
1. `nmap` ile SSH port tespiti
2. `hydra -l admin -P wordlist.txt ssh://target` → Şifre bulma
3. `ssh admin@target` → Bağlantı + flag

---

#### 2.2 — net-02: ARP Spoofing & MITM
**Sol Panel:** Ağ topolojisi görselleştirme
- Router ↔ Kurban ↔ Saldırgan diyagramı
- ARP tablosu (MAC adresleri)
- Paket yakalama penceresi

**Sağ Panel:** 3 Adım
1. `arp -a` → Mevcut ARP tablosu
2. `arpspoof -i eth0 -t kurban router` → ARP zehirleme
3. `tcpdump` / Wireshark → HTTP şifre yakalama + flag

---

#### 2.3 — net-03: SMB Exploitation (EternalBlue)
**Sol Panel:** Metasploit konsol simülasyonu + hedef makine
**Sağ Panel:** 3 Adım
1. `nmap --script smb-vuln-ms17-010` → Zafiyet tespiti
2. `use exploit/windows/smb/ms17_010_eternalblue` → Exploit seçimi
3. `exploit` → SYSTEM shell + flag

---

#### 2.4 — net-05: DNS Zone Transfer
**Sol Panel:** DNS sorgu konsolu + zone dosyası
**Sağ Panel:** 3 Adım
1. `nslookup -type=NS hedef.com` → NS sunucuları bul
2. `dig @ns1.hedef.com hedef.com AXFR` → Zone transfer
3. Subdomain listesinden gizli flag kaydını bul

---

#### 2.5 — net-06: WiFi Hacking Simülasyonu
**Sol Panel:** Aircrack-ng konsol simülasyonu + yakın AP listesi
**Sağ Panel:** 3 Adım
1. `airmon-ng start wlan0` → Monitor mode
2. `airodump-ng` → Handshake yakalama
3. `aircrack-ng -w wordlist capture.cap` → Şifre kırma + flag

---

#### 2.6 — net-07: VLAN Hopping
**Sol Panel:** Ağ switch simülasyonu + VLAN diyagramı
**Sağ Panel:** 3 Adım
1. `tcpdump -e` → VLAN tag analizi
2. Double tagging paketi oluştur
3. Admin VLAN'ına eriş + flag

---

#### 2.7 — net-08: Pivotlama & Tunneling
**Sol Panel:** Çift ağ diyagramı (dış→pivot→iç)
**Sağ Panel:** 3 Adım
1. Pivot makineye bağlan
2. `ssh -D 9050` veya `chisel` ile SOCKS proxy kur
3. `proxychains nmap iç-ağ` → İç servise eriş + flag

---

#### 2.8 — net-09: Active Directory Recon
**Sol Panel:** BloodHound tarzı AD graf görselleştirme
**Sağ Panel:** 3 Adım
1. `ldapsearch` → Kullanıcı ve grup enumeration
2. `GetUserSPNs.py` → Kerberoasting ticket çekme
3. `hashcat` ile hash kır → Domain Admin + flag

---

#### 2.9 — net-10: Full Network Pentest Capstone
**Sol Panel:** Çok aşamalı terminal
**Sağ Panel:** 5 Aşama
1. Dış ağ keşfi
2. Servis sömürüsü
3. İç ağa pivot
4. AD keşif
5. Domain Admin + flag

---

### ═══════════════════════════════════════════
### FAZ 3: SYS ODALARI (10 oda — mevcut iyileştirme)
### ═══════════════════════════════════════════

SysTerminalSim'in terminal mantığı sağlam. Yapılacak:
1. **İki panel düzenine geçiş:** Sol=Terminal (mevcut), Sağ=Adım Rehber + Gözlemci
2. **Adım durumu takibi:** Terminal komutlarından adım tamamlanma tespiti
3. **Tab yapısı ekleme:** Rehber + Sistem Bilgisi sekmesi
4. Her odanın adım planı:

| Oda | Adımlar |
|------|---------|
| sys-01 | `ls` → `cd gizli_dizin` → `cat flag.txt` |
| sys-02 | `find / -perm -4000` → `/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'` → `cat /root/flag.txt` |
| sys-03 | `uname -a` → `gcc exploit.c -o exploit` → `./exploit` → `cat /root/flag.txt` |
| sys-04 | `cat /etc/crontab` → `echo 'cp /root/flag.txt /tmp/; chmod 777 /tmp/flag.txt' > /opt/cleanup.sh` → `cat /tmp/flag.txt` |
| sys-05 | `cat run_backup` → `echo '/bin/bash' > /tmp/tar && chmod +x /tmp/tar` → `export PATH=/tmp:$PATH` → `./run_backup` → `cat /root/flag.txt` |
| sys-06 | `whoami /priv` → `PrintSpoofer.exe -i -c cmd` → `type C:\Users\Administrator\Desktop\flag.txt` |
| sys-07 | `cat vuln.c` → `python3 -c "print('A'*64 + '\xef\xbe\xad\xde')"` → flag fonksiyonu tetiklenir |
| sys-08 | `checksec vuln` → ROP gadget bul → `system("/bin/sh")` çağır → `cat /root/flag.txt` |
| sys-09 | `fdisk -l` → `mount /dev/sda1 /mnt/host` → `cat /mnt/host/root/flag.txt` |
| sys-10 | Çok aşamalı: keşif → sömürü → yetki yükseltme → flag |

---

## 4. UYGULAMA ÖNCELİK SIRASI

```
Faz 0  →  Flag düzeltmeleri + blank page fix
          ↓
Faz 1a →  web-04 (XSS) — en basit legacy, hızlı kazanım
          web-02 (UNION SQLi) — web-01'e çok benzer yapı
          ↓
Faz 1b →  web-05 (Stored XSS)
          web-06 (CSRF)
          ↓
Faz 1c →  web-03 (Blind SQLi)
          web-07 (File Upload)
          web-08 (XXE)
          ↓
Faz 1d →  web-09 (JWT)
          web-10 (Capstone — en büyük)
          ↓
Faz 2a →  net-04 (SSH) — net-01'e benzer yapı
          net-02 (ARP)
          net-03 (SMB)
          net-05 (DNS)
          ↓
Faz 2b →  net-06 (WiFi)
          net-07 (VLAN)
          net-08 (Pivot)
          ↓
Faz 2c →  net-09 (AD)
          net-10 (Capstone)
          ↓
Faz 3  →  sys-01..10 (İki panel wrapper)
```

---

## 5. MAKALE PLANI (FAZ 1-3 SONRASI)

Her oda lab'ı tamamlandıktan sonra o odanın makalesi yazılacak.
Makale, lab'ın çözüm adımlarını bilmeli ki kullanıcıyı doğru hazırlasın.

**Mevcut makaleler:** net-01, web-01, web-04, web-11, web-12, web-13 ✅
**Eksik:** Kalan 29 oda

---

## 6. TEKNİK NOTLAR

### Dosya Boyutu Sorunu
`app-auth.jsx` şu an ~254KB. Her oda ~200-350 satır ekleniyor.
9 net odası + 8 web yeniden yazım ≈ +5000 satır ≈ +150KB daha.
Toplam ~400KB+ olacak. **Babel transpile süresi artacak.**

**Olası çözümler:**
- Odaları kategoriye göre ayrı dosyalara böl: `rooms-web.jsx`, `rooms-net.jsx`, `rooms-sys.jsx`
- Her dosya `window.WEB_ROOM_CONFIGS` objesine merge etsin
- Veya mevcut yaklaşımı koru, sadece cache version bump yap

### SysTerminalSim Refactor
- Mevcut tek component içinde tüm 10 oda mantığı var (500+ satır)
- İki panel wrapper'ı için: `SysRoomWrapper` component'i oluştur
  - Sol: `<SysTerminalSim roomId={id} onStepComplete={cb} />`
  - Sağ: Adım rehber paneli
- `onStepComplete` callback ile terminal adımlarını rehber paneline bildir

### Net Odaları Konsol Pattern
- net-01 tarzı konsol simülasyonu her net odası için tekrarlanacak
- Ortak `NetConsoleSim` base component yazılabilir:
  ```
  NetConsoleSim({ roomId, commands, steps, validators })
  ```
  - `commands`: Kabul edilen komut listesi + çıktıları
  - `steps`: Adım tanımları
  - `validators`: Her adım için doğrulama fonksiyonları

---

## 7. QA CHECKLIST (Her oda için)

- [ ] İki panel düzeni (sol hedef + sağ rehber) çalışıyor
- [ ] Adımlar sıralı kilit açma ile ilerliyor (Kilitli→Aktif→Tamamlandı)
- [ ] Her adımda açıklayıcı feedback mesajı var
- [ ] Canlı gözlemci tab'ı aktif ve doğru veri gösteriyor
- [ ] Yanlış sıra koruması çalışıyor (ileri adım engelleniyor)
- [ ] Flag gösterimi başarı sonrası doğru
- [ ] `config.flag` === `server.js ROOM_FLAGS[id]`
- [ ] `run()` fonksiyonu doğru pozitif/negatif case'leri handle ediyor
- [ ] Zorluk seviyesine uygun hint sayısı (Başlangıç:3, Orta:2, İleri:1, Uzman:0)
- [ ] Makale sayfası mevcut ve lab çözüm adımlarıyla uyumlu
- [ ] Responsive tasarım (mobil uyumlu)
- [ ] Erişilebilirlik (keyboard navigation, screen reader uyumlu)
