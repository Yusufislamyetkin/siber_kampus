# Siber Kampüs - Yerel Kurulum Rehberi

## 🎯 Amaç
Siber Kampüs platformunu kendi makinenizde çalıştırmak. Frontend + Backend + PostgreSQL.

---

## 📋 Sistem Gereksinimleri

- **Node.js:** v16+ ([indirme linki](https://nodejs.org))
- **Docker & Docker Compose:** ([indirme linki](https://www.docker.com/products/docker-desktop))
- **Git** (opsiyonel)
- **RAM:** Minimum 2GB
- **Disk:** Minimum 500MB

---

## 🚀 Kurulum Adımları

### Adım 1: Proje Dosyalarını Kontrol Et

Şu dosyaların var olduğundan emin ol:

```
siber-kampus/
├── package.json          ← Node dependencies
├── server.js            ← Backend entry point
├── .env                 ← Environment variables (var)
├── docker-compose.yml   ← PostgreSQL kurulu
├── index.html           ← Frontend entry point
├── app.jsx              ← React components
├── app-auth.jsx         ← Auth pages
├── app-pages.jsx        ← Content pages
└── db_schema.sql        ← Database schema
```

### Adım 2: Node.js Bağımlılıklarını Yükle

```bash
cd path/to/siber-kampus

# Node packages'leri yükle
npm install

# Çıktı örneği:
# added 150 packages in 2m
```

### Adım 3: PostgreSQL Docker Container'ı Başlat

```bash
# Docker Compose'u başlat (PostgreSQL başlatılacak)
docker-compose up -d

# Kontrol et
docker-compose ps

# Çıktı örneği:
# NAME                    STATUS
# siberkampus-postgres    Up 2 minutes
```

### Adım 4: Database Schema'yı Oluştur

```bash
# PostgreSQL container'ına bağlan
docker exec -i siberkampus-postgres psql -U sk_user -d siberkampus < db_schema.sql

# Test et - tablolar var mı kontrol et
docker exec -i siberkampus-postgres psql -U sk_user -d siberkampus -c "\dt"

# Çıktı örneği:
#           List of relations
# Schema |     Name      | Type  | Owner
#--------+---------------+-------+--------
# public | users         | table | sk_user
# public | room_progress | table | sk_user
# ...
```

### Adım 5: Demo Hesabı Oluştur (Opsiyonel)

```bash
# Demo hesabı için SQL script'i çalıştır
docker exec -i siberkampus-postgres psql -U sk_user -d siberkampus < DEMO_ACCOUNT_SETUP.sql

# NOT: <USER_ID> kısmını yukarıdaki çıktıda bulunan ID ile değiştir
# Örn: 42 numaralı satırları <USER_ID> yerine 42 ile güncelle
```

### Adım 6: Backend'i Başlat

```bash
# Aynı terminal penceresindeyi (siber-kampus dizini)
npm start

# Çıktı örneği:
# ✓ Server running on http://localhost:3000
# ✓ Database connected
# ✓ API endpoints ready
```

**Bu terminal'i açık bırak!**

### Adım 7: Frontend'i Aç (Yeni Terminal)

```bash
# Windows PowerShell / Command Prompt
start http://localhost:3000

# Veya tarayıcı aç ve git:
# http://localhost:3000
```

---

## 🔑 Test Hesapları

### Demo Hesabı (Eğer oluşturduysanız)
```
Email: demo@siberkampus.com
Password: demo123456
Level: 5
Points: 350
Streak: 30 gün
```

### Test Hesabı (Manuel Kaydol)
1. Tarayıcıda `http://localhost:3000` aç
2. **Kaydol** tıkla
3. Yeni bir test hesabı oluştur
4. E-posta doğrula

---

## ✅ Kontrol Listesi

Çalışıyor mu kontrol et:

- [ ] **Frontend:** http://localhost:3000 açılıyor
- [ ] **Login:** Hesabınızla giriş yapabiliyorsunuz
- [ ] **Dashboard:** Panele erişebiliyorsunuz
- [ ] **Rooms:** Görevleri görebiliyorsunuz
- [ ] **Leaderboard:** Sıralama gösterilir (puanlar var)
- [ ] **Certificates:** Sertifika sayfası açılır
- [ ] **Chat:** Sohbet sayfası çalışır
- [ ] **Admin Panel:** (Admin hesabı varsa) `/admin` sayfası

---

## 🛑 Sorun Giderme

### "Port 5432 zaten kullanımda" hatası
```bash
# Eski container'ı durdur
docker stop siberkampus-postgres

# Yeni başlat
docker-compose up -d
```

### "Database connection failed" hatası
```bash
# PostgreSQL container'ın çalıştığını kontrol et
docker-compose ps

# Logs'u kontrol et
docker-compose logs postgres

# Eğer sorun devam ederse yeniden başlat
docker-compose down
docker-compose up -d
```

### "npm: command not found" hatası
- Node.js düzgün kurulmamış
- [Node.js indir](https://nodejs.org) ve yeniden kur
- Terminal'i yeniden aç

### "Port 3000 zaten kullanımda" hatası
```bash
# Başka bir port kullandır (örn: 3001)
PORT=3001 npm start

# Tarayıcıda aç
http://localhost:3001
```

### Leaderboard puanları 0 gösteriyor
- Backend API'den gelen data kontrol et
- Chrome DevTools → Network tab → `/api/leaderboard` kontrol et
- Veritabanında `users` tablosunun `points` sütunu dolu mu kontrol et

---

## 📊 Backend API Endpoints

Frontend'in kullandığı temel endpoints:

```
GET    /api/leaderboard           → Liderlik tablosu
GET    /api/user/profile          → Mevcut kullanıcı
PUT    /api/user/profile          → Profil güncelle
POST   /api/auth/login            → Giriş
POST   /api/auth/register         → Kaydol
GET    /api/rooms                 → Tüm görevler
GET    /api/rooms/:id             → Spesifik görev
POST   /api/rooms/:id/submit      → Bayrağı gönder
GET    /api/chat/messages         → Sohbet mesajları
POST   /api/chat/messages         → Mesaj gönder
```

---

## 🔐 Ortam Değişkenleri (.env)

```env
DATABASE_URL=postgres://sk_user:sk_password_secure_2026@localhost:5432/siberkampus
PORT=3000
JWT_SECRET=super_secret_cyber_key_2026
```

Değiştirmeden kullan (geliştirme için yeterli).

---

## 📁 Proje Yapısı

```
siber-kampus/
├── server.js                 → Express backend
├── package.json             → Dependencies
├── .env                     → Environment
├── docker-compose.yml       → PostgreSQL config
├── db_schema.sql            → Database schema
│
├── Frontend (Babel Standalone):
├── index.html               → Main page
├── app.jsx                  → App component
├── app-auth.jsx             → Auth pages (Dashboard, Chat, Admin)
├── app-pages.jsx            → Content pages (About, Certificates)
│
├── Components:
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ...
│
└── Documentation:
    ├── LOCAL_SETUP.md       (Bu dosya)
    ├── DEMO_SETUP_GUIDE.md
    ├── SUBSCRIPTION_SYSTEM.md
    └── ...
```

---

## 🎮 Geliştirme İpuçları

### Frontend Değişiklikleri
1. `.jsx` dosyasını düzenle
2. Tarayıcıda **F5** tuşuna bas (refresh)
3. Değişiklikler anında uygulanır

### Backend Değişiklikleri
1. `server.js` düzenle
2. Terminal'de **Ctrl+C** bas (durdur)
3. `npm start` ile yeniden başlat

### Database Değişiklikleri
```bash
# SQL değişiklikleri yapmak için
docker exec -i siberkampus-postgres psql -U sk_user -d siberkampus
```

---

## 🧹 Temizlik

### Tüm konteyner'ları durdur
```bash
docker-compose down
```

### Database'i sıfırla
```bash
docker-compose down -v  # Volume'ü da sil
docker-compose up -d
npm start
```

### Node modules'i temizle
```bash
rm -r node_modules
npm install
```

---

## 📞 Destek

Sorun yaşıyorsan:

1. **Terminal çıktısını kontrol et** - hatalar yazılı olur
2. **Browser console'u kontrol et** (F12 → Console)
3. **Docker logs'u kontrol et**: `docker-compose logs`

---

## ✨ Başarı!

Kurulum tamamlandıktan sonra:

✓ `http://localhost:3000` açıl
✓ Hesap oluştur veya demo hesabınızla giriş yap
✓ Görevleri keşfet
✓ Liderlikte yerini al

**Siber Kampüs'e hoş geldin!** 🎉

---

**Kurulum Tarihi:** 6 Haziran 2026  
**Version:** 1.0.0
