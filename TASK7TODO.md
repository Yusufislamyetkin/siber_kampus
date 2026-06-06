# TASK 7 — Learning Pathways: Kalan Aşamalar

## Durum Özeti

**Tamamlanan:** Aşama 1 (Veri Modeli & Pathway Sayfası MVP)
**Kalan:** Aşama 2, 3, 4, 5, 6

---

## Mevcut Mimari (Bilmen Gerekenler)

### Teknoloji
- React 18 (UMD, CDN'den), Tailwind CSS (CDN), esbuild ile JSX→JS derleme
- **Build komutu:** `npm run compile` (5 dosya derler: sk-data, sk-articles, app, app-auth, app-pages)
- **Deploy komutu:** `vercel --prod --yes`
- Her değişiklikte `index.html`'deki `?v=X.X.X` cache buster'ları artır
- SPA routing: `navigate(pageName, data)` + `history.pushState`
- Global paylaşım: `window.__SK_PAGES`, `window.SK_PATHWAYS`, `window.SK_CATEGORIES` vb.
- PostgreSQL (Neon), schema: `db_schema.sql`, init: `server.js:1128`

### Dosya Haritası
| Dosya | Ne yapar | Satır sayısı |
|-------|----------|-------------|
| `sk-data.jsx` | Oda/kategori/pathway verileri + helper fonksiyonlar | ~400 |
| `sk-articles.jsx` | Blog içerikleri | ~700 |
| `app.jsx` | Public app, routing (`getPagePath`, `parseLocation`), header, 404 | ~1250 |
| `app-auth.jsx` | Auth app: Dashboard, RoomPage, PathwayPage, Chat, Admin, tüm auth sayfalar | ~6560 |
| `app-pages.jsx` | Public sayfalar (Hakkımızda, İletişim, Tools vb.) | ~2800 |
| `server.js` | Express API sunucusu, tüm endpointler, DB init | ~1310 |
| `db_schema.sql` | PostgreSQL tablo tanımları | ~78 |
| `index.html` | SPA shell, CSS, script yüklemeleri (cache: v=1.0.24) | ~172 |
| `vercel.json` | SPA rewrite kuralları | ~25 |
| `package.json` | compile script tanımı | — |

### Aşama 1'de Yapılanlar

#### `sk-data.jsx` (satır 268-399)
- `SK_PATHWAYS` dizisi eklendi — 1 pathway ("Web Pentest Uzmanı Yolu"), 5 faz, toplam 24 öğe
- Faz 1: 3 döküman (doc-kali-setup, doc-http-basics, doc-devtools)
- Faz 2: 7 oda (web-13, web-11, web-15, web-01, web-04, web-14, web-12)
- Faz 3: 1 döküman + 3 oda (doc-burp-proxy, web-02, web-05, web-06)
- Faz 4: 1 döküman + 4 oda (doc-shells, web-03, web-07, web-08, web-09)
- Faz 5: 1 döküman + 4 hedef site (premium, doc-pentest-methodology, target-01~04)
- Helper fonksiyonlar: `SK_ROOMS_MAP`, `getPathwayItemDetails()`, `isPhaseComplete()`, `isPhaseUnlocked()`, `isItemUnlocked()`
- Tümü `window`'a export edildi (satır 396-399)

#### `app-auth.jsx`
- **PathwayPage** component (satır 6379-6551): Dikey journey map, faz başlıkları, öğe kartları, bağlantı çizgileri, kilit/açık/tamamlandı/devam ediyor/premium durumları
- **DashboardPage** (satır 505-553): Eski "Kategori Seç & Başla" bölümü → "Öğrenme Yolları" kartlarına dönüştürüldü, progress bar ve faz bilgisi gösterir
- **Sayfa kaydı** (satır 6554-6559): `pathway: PathwayPage` eklendi

#### `app.jsx`
- **getPagePath** (satır 1171-1178): `pathway` ve `doc` route'ları eklendi
- **parseLocation** (satır 1201-1208): `/pathway/{slug}` ve `/docs/{docId}` URL parsing eklendi

### Kilit Sistemi Nasıl Çalışıyor (Şu An)
- Tamamen client-side, localStorage'dan okuyor:
  - `sk_solved_rooms`: `["web-01","web-04",...]` — çözülen oda ID'leri
  - `sk_completed_docs`: `["doc-kali-setup",...]` — tamamlanan döküman ID'leri (henüz hiçbir yerden yazılmıyor!)
  - `sk_room_progress`: `{"web-01": 60, ...}` — oda ilerleme yüzdeleri
- Faz kilidi: `requires` dizisindeki tüm fazlar tamamlanmış olmalı
- Öğe kilidi: Faz içinde sıralı — önceki öğe tamamlanmalı
- Premium kilidi: `phase.premium === true` && `user.is_premium === false`

---

## AŞAMA 2: Döküman Sistemi

Bu aşama en büyük iş. PathwayPage'deki döküman öğelerine tıklandığında açılacak `DocPage` ve içerikleri.

### 2.1 — Yeni dosya: `sk-docs.jsx`

Mevcut `sk-articles.jsx` ile aynı pattern. `window.SK_DOCS` objesi olarak export et.

```javascript
// sk-docs.jsx
const SK_DOCS = {
  'doc-kali-setup': {
    title: 'Kali Linux & Burp Suite Kurulumu',
    readTime: '~15 dk okuma',
    tagline: 'Pentest araçlarını kur, proxy ayarla, ilk isteğini yakala.',
    intro: 'Bu rehberde...',
    sections: [
      { icon: '🖥️', h: 'Kali Linux Nedir?', body: ['paragraf 1', 'paragraf 2'] },
      { icon: '🔧', h: 'Burp Suite Kurulumu', body: ['...'] },
      // ...
    ],
    closing: 'Artık araçların hazır. Bir sonraki adımda...'
  },
  // ... 7 döküman
};

Object.assign(window, { SK_DOCS });
```

**7 döküman yazılacak:**

| ID | Faz | Konu | İçerik odağı |
|----|-----|------|-------------|
| `doc-kali-setup` | 1 | Kali Linux & Burp Suite Kurulumu | VM kurulumu, Burp Community Edition, proxy ayarları, sertifika import, ilk istek yakalama |
| `doc-http-basics` | 1 | HTTP Protokolü & Web Mimarisi | GET/POST/PUT/DELETE, headerlar, status kodları, cookie/session, request/response döngüsü |
| `doc-devtools` | 1 | Tarayıcı DevTools Kullanımı | Elements tab, Console, Network tab, XHR inceleme, cookie düzenleme |
| `doc-burp-proxy` | 3 | Burp Suite Proxy ile İstek Manipülasyonu | Intercept, Repeater, istek değiştirme, response inceleme, target site örnekleri |
| `doc-shells` | 4 | Web Shell & Reverse Shell Temelleri | PHP/Python web shell, reverse shell one-liner'lar, netcat listener, stabilize etme |
| `doc-pentest-methodology` | 5 | Pentest Metodolojisi & Raporlama | OWASP Testing Guide, keşif→zafiyet tespiti→sömürü→raporlama akışı |
| `doc-recon-tools` | 5 | Keşif Araçları (Nmap, Dirb, Gobuster) | Port tarama, dizin brute-force, servis parmak izi, nikto tarama |

**NOT:** `doc-recon-tools` henüz SK_PATHWAYS'e eklenmedi! Eklemek istersen `sk-data.jsx`'teki phase-5 items dizisine `{ type: 'doc', id: 'doc-recon-tools', name: 'Keşif Araçları: Nmap, Dirb, Gobuster', readTime: '12 dk', required: true }` satırını doc-pentest-methodology'den sonra ekle.

Her döküman **target site üzerinde adım adım Red Team çalışması** kurgusunda yazılmalı — teoriyi anlatırken `target1.siberkampus.org` gibi hedef sitelerden örnekler ver (henüz var olmasa bile). Böylece target siteler hazır olduğunda dökümanlar zaten onlara referans veriyor olacak.

### 2.2 — DocPage component (`app-auth.jsx`)

Mevcut `RoomArticlePage` (satır ~4332) ile aynı kart-kart animasyon mantığını kullan. Farklar:
- Son kartta "Operasyonu Başlat" yerine **"✅ Tamamlandı Olarak İşaretle"** butonu
- Tıklandığında:
  1. `POST /api/docs/complete` → `{doc_id}` gönder
  2. localStorage `sk_completed_docs` dizisine `doc_id` ekle
  3. `navigate('pathway', pathwaySlug)` ile pathway sayfasına geri dön

**Eklenecek yer:** PathwayPage'den hemen önce (~satır 6379).
**Sayfa kaydına ekle:** satır 6559 civarı → `doc: DocPage`

PathwayPage'deki `handleItemClick` zaten doc tıklamasını handle ediyor (satır 6416-6418):
```javascript
} else if (item.type === 'doc') {
  navigate('doc', { id: item.id, pathwaySlug: pathway.slug });
}
```

### 2.3 — Backend endpoint'leri (`server.js`)

```javascript
// GET /api/docs/progress — tamamlanan döküman ID listesi
app.get('/api/docs/progress', authenticateToken, async (req, res) => {
  const result = await pool.query(
    'SELECT doc_id FROM user_doc_progress WHERE user_id = $1',
    [req.user.id]
  );
  res.json(result.rows.map(r => r.doc_id));
});

// POST /api/docs/complete — döküman tamamlama
app.post('/api/docs/complete', authenticateToken, async (req, res) => {
  const { doc_id } = req.body;
  await pool.query(
    'INSERT INTO user_doc_progress (user_id, doc_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [req.user.id, doc_id]
  );
  res.json({ ok: true });
});
```

**Ekleme yeri:** Mevcut `/api/rooms/solve` endpoint'inden sonra (satır ~580 civarı).

### 2.4 — DB tablosu (`db_schema.sql`)

Dosyanın sonuna ekle:

```sql
-- 8. Doc Progress Table
CREATE TABLE IF NOT EXISTS user_doc_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  doc_id VARCHAR(40) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_doc UNIQUE(user_id, doc_id)
);
```

### 2.5 — index.html & package.json

**`index.html`:** sk-articles satırından sonra ekle:
```html
<link rel="preload" href="/sk-docs.js?v=1.0.25" as="script" />
```
ve body'deki script yüklemelerinde sk-articles'dan sonra:
```html
<script src="/sk-docs.js?v=1.0.25" defer></script>
```

**`package.json`:** compile script'ine ekle (sk-articles'dan sonra):
```
&& esbuild sk-docs.jsx --outfile=sk-docs.js --minify --jsx=transform --format=iife
```

### 2.6 — Login sonrası doc progress senkronizasyonu

Kullanıcı login olduğunda `GET /api/docs/progress` çağrılıp `localStorage.sk_completed_docs` güncellenmeli. Bunu mevcut login akışına ekle.

Login sonrası profil çekme yeri `app-auth.jsx`'te `useUser` hook'unda veya login handler'ında. Mevcut `sk_solved_rooms` senkronizasyonu nasıl yapılıyorsa aynı pattern'i takip et.

### 2.7 — Derleme & Deploy

```bash
npm run compile
# index.html'deki tüm ?v= değerlerini artır
vercel --prod --yes
```

---

## AŞAMA 3: Gelişmiş Kilit Sistemi & İlerleme

### 3.1 — Toplu ilerleme endpoint'i

```javascript
// GET /api/pathway/progress — rooms + docs + targets hepsi bir arada
app.get('/api/pathway/progress', authenticateToken, async (req, res) => {
  const [rooms, docs] = await Promise.all([
    pool.query('SELECT room_id FROM solved_rooms WHERE user_id = $1', [req.user.id]),
    pool.query('SELECT doc_id FROM user_doc_progress WHERE user_id = $1', [req.user.id])
  ]);
  res.json({
    solvedRooms: rooms.rows.map(r => r.room_id),
    completedDocs: docs.rows.map(r => r.doc_id)
  });
});
```

### 3.2 — PathwayPage iyileştirmeleri

Şu an PathwayPage localStorage'dan okuyor ve state değişmediği sürece güncellenmez. Yapılacaklar:
- Sayfa mount'ta `GET /api/pathway/progress` çağır ve localStorage'ı güncelle, sonra state'i set et
- Bir odadan geri dönüldüğünde (navigate ile) PathwayPage'in tekrar veri çekmesini sağla
- Progress animasyonları: Yeni tamamlanan öğe için confetti/glow efekti

### 3.3 — Oda çözme sonrası pathway güncelleme

`/api/rooms/solve` endpoint'i başarılı olduğunda, client tarafında:
1. `sk_solved_rooms` güncelle
2. PathwayPage'e geri dönüşte yeni durumu göster

Bu zaten mevcut akışta var ama pathway context'inde test edilmeli.

---

## AŞAMA 4: Premium Gating

### 4.1 — Phase 5 premium kilit overlay'i (`app-auth.jsx`)

PathwayPage'de phase 5 zaten `premiumLocked` olarak render ediliyor (opacity-50, 👑 ikon). Eksik olan:
- Premium olmayan kullanıcıya tıklandığında bir modal/overlay göster
- "Premium'a Yükselt" CTA butonu → fiyatlandırma sayfasına yönlendir

### 4.2 — Fiyatlandırma sayfası (`app-pages.jsx`)

Basit bir fiyatlandırma kartı sayfası. `pricing: PricingPage` olarak sayfa kaydına ekle.
Premium özellikleri listele: Hedef siteler, sertifika, özel rozetler vb.

### 4.3 — Premium kontrolü

`users` tablosunda `is_premium` kolonu ekle:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
```

Server'da target API endpointlerinde premium kontrolü:
```javascript
if (!user.is_premium) return res.status(403).json({ error: 'Premium üyelik gerekli' });
```

### 4.4 — Ödeme entegrasyonu

Bu aşamada sadece altyapıyı hazırla, gerçek ödeme sistemi (Stripe/iyzico) ayrı bir görev.

---

## AŞAMA 5: Hedef Siteler (Ayrı Projeler — Gelecek)

Bu aşama şu an yapılmayacak. Sadece referans olarak:

### 4 hedef site planı:

| Site | Stack | URL | Zafiyet sayısı |
|------|-------|-----|---------------|
| Target 1 | Node.js/Express + EJS + SQLite | target1.siberkampus.org | 5 (HTML yorum, varsayılan creds, SQLi login, reflected XSS, dir listing) |
| Target 2 | Node.js/Express + JWT + PostgreSQL | target2.siberkampus.org | 4 (CSRF, file upload bypass, directory traversal, JWT none algorithm) |
| Target 3 | Python/Flask + MySQL | target3.siberkampus.org | 3 (command injection, SSRF, blind SQLi) |
| Target 4 | PHP + Node.js API + MySQL + Redis | target4.siberkampus.org | 6 (zincirleme: keşif → API key → stored XSS → SSRF+Redis RCE → data exfil → rapor) |

### Bayrak formatı: `siberkampus{target1_source_code_leak}` vb.

### Gerekli DB tabloları:
```sql
CREATE TABLE IF NOT EXISTS target_flags (
  id SERIAL PRIMARY KEY,
  target_id VARCHAR(30) NOT NULL,
  flag_id VARCHAR(80) NOT NULL UNIQUE,
  flag_value VARCHAR(120) NOT NULL,
  points INT DEFAULT 100,
  difficulty VARCHAR(20),
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_target_solves (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  target_id VARCHAR(30) NOT NULL,
  flag_id VARCHAR(80) NOT NULL,
  points_earned INT DEFAULT 0,
  solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_flag UNIQUE(user_id, flag_id)
);
```

### Bayrak doğrulama endpoint'i:
```javascript
app.post('/api/targets/solve', authenticateToken, async (req, res) => {
  const { target_id, flag } = req.body;
  // target_flags tablosundan doğrula, puan ver
});
```

---

## AŞAMA 6: Polish & Sertifika

- Pathway tamamlama sertifikası (jsPDF ile PDF oluşturma — zaten projede var)
- Pathway bazlı rozetler
- Liderlik tablosunda pathway filtreleme
- Animasyonlar ve mikroetkileşimler

---

## Önemli Notlar

### Derleme & Deploy Akışı
```bash
npm run compile          # tüm JSX→JS derle
# index.html'deki ?v= değerlerini artır (cache busting)
vercel --prod --yes      # production deploy
```

### Yeni JSX dosyası eklerken yapılacaklar
1. Dosyayı oluştur (ör. `sk-docs.jsx`)
2. `package.json` compile script'ine `&& esbuild sk-docs.jsx --outfile=sk-docs.js --minify --jsx=transform --format=iife` ekle
3. `index.html`'e `<link rel="preload">` ve `<script defer>` ekle
4. Cache version'ları artır

### Page registry
Yeni sayfa eklerken `app-auth.jsx` satır 6554-6559'daki `Object.assign(PAGES, {...})` bloğuna ekle. Ayrıca:
- `app.jsx` `getPagePath` fonksiyonuna URL path mapping ekle
- `app.jsx` `parseLocation` fonksiyonuna URL parsing ekle
- `vercel.json`'daki SPA rewrite zaten tüm non-API/non-static yolları `/` 'e yönlendiriyor, ekstra kural gerekmez

### localStorage anahtarları
| Anahtar | Değer | Kim yazıyor |
|---------|-------|-------------|
| `sk_solved_rooms` | `["web-01","web-04",...]` | Login sonrası API'den + oda çözünce |
| `sk_completed_docs` | `["doc-kali-setup",...]` | **HENÜZ YAZILMIYOR — Aşama 2'de yapılacak** |
| `sk_room_progress` | `{"web-01": 60, ...}` | Oda ilerleme kaydedilince |
| `sk_token` | JWT token | Login sonrası |
| `sk_user` | User JSON objesi | Login sonrası |

### CSS/Stil sistemi
Tailwind CDN + inline class'lar. Renk paleti:
- `--green: #00ff88`, `--mint: #5cffba`, `--text: #cdeede`, `--muted: #74998a`
- Border: `#103a26` (normal), `#0c2719` (soluk)
- Background: `#020806` (base), `#07150e` (surface), `#04100a` (dark surface)

### SQL Seed Script'leri (Çalıştırılmayı Bekliyor)
`scratch/` klasöründe 2 SQL script var:
- `seed-fake-users.sql` — 1000 fake kullanıcı + çözümleri + rozetleri
- `seed-chat-messages.sql` — 250 genel + 20 VIP chat mesajı

Bu script'ler henüz production DB'de çalıştırılmadı.
