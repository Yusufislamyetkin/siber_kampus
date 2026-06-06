-- ==================================================================================
-- siber kampüs - Demo Hesabı SQL Setup Script
-- PostgreSQL veritabanında çalıştırın
-- ==================================================================================

-- Demo kullanıcıyı ekle
INSERT INTO users (name, email, password_hash, level, points, rank_val, streak, badges, solved_count, is_admin, is_banned, is_premium, subscription, created_at, updated_at)
VALUES (
  'Demo Kullanıcı',
  'demo@siberkampus.com',
  -- bcryptjs ile hash: demo123456
  '$2b$10$WEG4MmaW1oWlTUD8e4B5dukxbtX3E935SssLfFNxv7FeCBGeUB5py',
  5,                                    -- level
  350,                                  -- points
  250,                                  -- rank_val
  30,                                   -- streak (30 gün üst üste)
  5,                                    -- badges
  6,                                    -- solved_count (6 görev tamamlandı)
  false,                                -- is_admin
  false,                                -- is_banned
  false,                                -- is_premium
  'free',                               -- subscription
  NOW() - INTERVAL '30 days',          -- created_at (30 gün önce)
  NOW()                                 -- updated_at
)
RETURNING id;
-- NOT: Dönen ID'yi bir sonraki adımda kullanacaksınız


-- ==================================================================================
-- Adım 1: Yukarıdaki sorguyu çalıştırın ve dönen user_id'yi kopyalayın
-- Adım 2: Aşağıda <USER_ID> yerine o ID'yi yazın
-- ==================================================================================

-- Demo kullanıcı için tamamlanan görevler kaydını ekle
INSERT INTO room_progress (user_id, room_id, progress, completed_at)
VALUES
  (<USER_ID>, 'web-01', 100, NOW() - INTERVAL '25 days'),   -- 25 gün önce
  (<USER_ID>, 'web-02', 100, NOW() - INTERVAL '23 days'),   -- 23 gün önce
  (<USER_ID>, 'web-04', 100, NOW() - INTERVAL '20 days'),   -- 20 gün önce
  (<USER_ID>, 'sys-01', 100, NOW() - INTERVAL '18 days'),   -- 18 gün önce
  (<USER_ID>, 'sys-02', 100, NOW() - INTERVAL '15 days'),   -- 15 gün önce
  (<USER_ID>, 'net-01', 100, NOW() - INTERVAL '10 days');   -- 10 gün önce

-- Kazanılan sertifikalar
INSERT INTO certificates (user_id, certificate_type, earned_at)
VALUES
  (<USER_ID>, 'WEB_BASICS', NOW() - INTERVAL '20 days'),     -- Web Temelleri
  (<USER_ID>, 'LINUX_BASICS', NOW() - INTERVAL '15 days');   -- Linux Temelleri

-- Son 30 gün için aktivite kaydı (daily_activity tablosu varsa)
-- Aksi halde bu satırı yorum satırına alabilirsiniz
INSERT INTO user_activity_log (user_id, activity_type, created_at)
VALUES
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '25 days'),
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '23 days'),
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '20 days'),
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '18 days'),
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '15 days'),
  (<USER_ID>, 'room_completed', NOW() - INTERVAL '10 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '29 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '28 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '27 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '26 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '25 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '24 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '23 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '22 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '21 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '20 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '19 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '18 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '17 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '16 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '15 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '14 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '13 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '12 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '11 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '10 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '9 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '8 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '7 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '6 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '5 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '4 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '3 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '2 days'),
  (<USER_ID>, 'daily_login', NOW() - INTERVAL '1 day');

-- ==================================================================================
-- KURULUM TALİMATLARI
-- ==================================================================================
--
-- 1. PostgreSQL'e Bağlan:
--    psql -U postgres -d siberkampus
--
-- 2. Aşağıdaki komutu çalıştır (USER ID'yi almak için):
--    SELECT id FROM users WHERE email = 'demo@siberkampus.com';
--
-- 3. Dönen ID'yi al (örn: 42) ve <USER_ID> yerine yaz
--
-- 4. Gerekli tabloları kontrol et:
--    - users
--    - room_progress (veya uygulamada rooms_solved)
--    - certificates (veya user_certificates)
--    - user_activity_log (isteğe bağlı)
--
-- 5. Tablo adları farklıysa, yukarıdaki INSERT sorgularındaki
--    tablo adlarını kendi veritabanınıza göre düzelt.
--
-- ==================================================================================
-- DEMO HESAP BİLGİLERİ
-- ==================================================================================
--
-- Username: Demo Kullanıcı
-- Email: demo@siberkampus.com
-- Password: demo123456
--
-- İstatistikler:
-- - Level: 5
-- - Points: 350
-- - Rank: 250
-- - Streak: 30 gün (1 aydan beri aktif)
-- - Tamamlanan Görevler: 6
-- - Kazanılan Sertifikalar: 2
-- - Premium Status: Hayır
--
-- Tamamlanan Görevler:
-- ✓ web-01 - SQL Injection Temelleri
-- ✓ web-02 - UNION-Based SQLi
-- ✓ web-04 - XSS (Reflected)
-- ✓ sys-01 - Linux Temel Komutlar
-- ✓ sys-02 - SUID/SGID Exploitation
-- ✓ net-01 - Nmap ile Ağ Keşfi
--
-- ==================================================================================
