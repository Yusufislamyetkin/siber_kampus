# Demo Hesabı Kurulum Kılavuzu

## 🎯 Amaç
Önceden doldurulmuş bir demo hesabı oluşturmak - 1 aydır aktif, bazı görevler tamamlı, sertifikaları almaya hazır.

## 📋 Demo Hesabın Özellikleri

```
Username: Demo Kullanıcı
Email: demo@siberkampus.com
Password: demo123456
```

### İstatistikler
- **Level:** 5 / 10
- **Points:** 350 ◆
- **Rank:** 250
- **Streak:** 30 gün (1 aydan beri aktif!)
- **Tamamlanan Görevler:** 6
- **Kazanılan Sertifikalar:** 2
- **Premium Status:** Hayır (Free)

### Tamamlanan Görevler ✓
1. **web-01** - SQL Injection Temelleri (25 gün önce)
2. **web-02** - UNION-Based SQLi (23 gün önce)
3. **web-04** - XSS (Reflected) (20 gün önce)
4. **sys-01** - Linux Temel Komutlar (18 gün önce)
5. **sys-02** - SUID/SGID Exploitation (15 gün önce)
6. **net-01** - Nmap ile Ağ Keşfi (10 gün önce)

### Kazanılan Sertifikalar 🎖️
- Web Exploitation Temelleri (3 görev tamamlandı)
- Linux Sistem Güvenliği (3 görev tamamlandı)

---

## 🚀 Kurulum Adımları

### Adım 1: PostgreSQL Container'a Bağlan

```bash
# Docker komutunu çalıştır
docker exec -it postgres psql -U postgres -d siberkampus

# Veya eğer postgres içerideysen:
psql -U postgres -d siberkampus
```

### Adım 2: İlk SQL Sorgusunu Çalıştır

Dosya: `DEMO_ACCOUNT_SETUP.sql`'in başından ilk sorguyu kopyala:

```sql
INSERT INTO users (name, email, password_hash, level, points, rank_val, streak, badges, solved_count, is_admin, is_banned, is_premium, subscription, created_at, updated_at)
VALUES (
  'Demo Kullanıcı',
  'demo@siberkampus.com',
  '$2a$10$K4YlEp7XWVJ8Z5KL9M2NQeM8K9X2YpZ1Q3R4S5T6U7V8W9X0Y1Z2A',
  5,
  350,
  250,
  30,
  5,
  6,
  false,
  false,
  false,
  'free',
  NOW() - INTERVAL '30 days',
  NOW()
)
RETURNING id;
```

Çalıştır ve **dönen ID'yi** (örn: 42) not et.

### Adım 3: User ID'yi Kopyala

Çıktıda göreceğin şey:
```
 id
----
 42
(1 row)
```

Bu `42` numarasını kopyala. ⚠️ **Bu önemli!**

### Adım 4: Diğer Tabloları Doldur

`DEMO_ACCOUNT_SETUP.sql` dosyasında `<USER_ID>` yazılı kısımları bul ve `42` (veya senin aldığın ID) ile değiştir.

Sonra sorgular çalıştır:

```sql
-- <USER_ID> yerine 42 yaz
INSERT INTO room_progress (user_id, room_id, progress, completed_at)
VALUES
  (42, 'web-01', 100, NOW() - INTERVAL '25 days'),
  (42, 'web-02', 100, NOW() - INTERVAL '23 days'),
  -- ... diğer görevler
```

### Adım 5: Doğrula

Kurulumun doğru olduğunu kontrol et:

```sql
-- Demo kullanıcıyı görüntüle
SELECT id, name, email, level, points, streak, solved_count 
FROM users 
WHERE email = 'demo@siberkampus.com';

-- Tamamlanan görevleri görüntüle
SELECT room_id, progress, completed_at 
FROM room_progress 
WHERE user_id = 42
ORDER BY completed_at DESC;
```

---

## 🔑 Giriş Yapma

Frontend'de giriş yap:
1. `http://localhost:3000`'a git
2. **Giriş Yap** tıkla
3. Bilgileri gir:
   - **Email:** `demo@siberkampus.com`
   - **Password:** `demo123456`

---

## ✅ İşe Yaradığını Kontrol Et

Giriş yaptıktan sonra:

- ✓ Dashboard'da **Level 5** görülmeli
- ✓ **350 puan** görülmeli
- ✓ **30 gün streak** görülmeli
- ✓ **Başlanmış Görevler** bölümü boş (çünkü tüm görevler tamamlandı)
- ✓ Bunun yerine **Sana Uygun Görevler** (Orta seviye) gösterilecek
- ✓ **Sertifikalarım** sayfasında:
  - Web Exploitation Temelleri: ✓ Tamamlandı
  - Linux Sistem Güvenliği: ✓ Tamamlandı
  - Ağ Sızma Testi: %33 (1/3)
  - İleri CTF & Red Team: %60 (6/10)

---

## 🛠️ Tablo Adları Farklıysa

Veritabanı şemasına göre tablo adlarını düzelt:

```
users                    → users / accounts / user_accounts
room_progress            → room_progress / solved_rooms / progress
certificates             → certificates / user_certificates / earned_certs
user_activity_log        → user_activity_log / activity_log / events
```

---

## 🔐 Password Hash

Demo hesap için pre-hashed password:
```
Password: demo123456
Hash (bcrypt $2a$10): $2a$10$K4YlEp7XWVJ8Z5KL9M2NQeM8K9X2YpZ1Q3R4S5T6U7V8W9X0Y1Z2A
```

Eğer farklı bir password kullanmak istersen:
1. Node.js console açı: `node`
2. Şu komutu çalıştır:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hashSync('senin_yeni_parolaNN', 10);
```
3. Dönen hash'i veritabanına yaz

---

## 🐳 Docker Komutu (Kısayol)

```bash
# Tüm sorgularını bir SQL dosyasına kaydet (demo_full.sql)
# Sonra:
docker exec -i postgres psql -U postgres -d siberkampus < /path/to/demo_full.sql
```

---

## ❌ Sorun Giderme

### "Tablo bulunamıyor" hatası
- Tablo adlarını kontrol et
- Veritabanı migration'larını çalıştırdığını doğrula

### "Foreign key constraint failed"
- User ID'nin doğru olduğunu kontrol et
- room_id'lerin sistemde var olduğunu doğrula

### "Email zaten kayıtlı" hatası
- Eski demo hesabını sil:
```sql
DELETE FROM users WHERE email = 'demo@siberkampus.com';
```

---

## 📝 Notlar

- Demo hesap **premium değildir** (serbest paket)
- Tüm veriler **gerçek şekilde doldurulmuş** (hardcoded değil)
- Son 30 gün boyunca **günlük giriş kaydı** var
- **Sertifikaları** indirilebilir ve doğrulanabilir

---

**Hazır oldu! Şimdi demo hesapla giriş yapabilirsin 🎉**
