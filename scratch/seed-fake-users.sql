-- Siber Kampüs: 1000 Fake Users with Achievements
-- Run this script against the production database to populate realistic user data

-- Available rooms (only perfected ones)
-- web-01, web-02, web-03, web-04, web-05, web-06, web-07, web-08, web-09
-- web-11, web-12, web-13, web-14, web-15
-- net-01

-- Points per room
-- *-01, *-04: 50
-- *-02, *-05, *-06: 75
-- *-03, *-07: 100
-- *-08: 120
-- *-09: 150
-- *-11: 50, *-12: 75, *-13: 50, *-14: 75, *-15: 100

DO $$
DECLARE
  i INT;
  uid INT;
  room_id TEXT;
  room_points INT;
  total_points INT;
  total_solved INT;
  user_level INT;
  user_streak INT;
  user_badges INT;
  solve_count INT;
  solved_rooms TEXT[];
  all_rooms TEXT[] := ARRAY[
    'web-01','web-02','web-03','web-04','web-05','web-06','web-07','web-08','web-09',
    'web-11','web-12','web-13','web-14','web-15','net-01'
  ];
  room_pts INT[] := ARRAY[
    50, 75, 100, 50, 75, 75, 100, 120, 150,
    50, 75, 50, 75, 100, 50
  ];
  first_names TEXT[] := ARRAY[
    'Ahmet','Mehmet','Ali','Mustafa','Yusuf','Hasan','Hüseyin','İbrahim','Emre','Murat',
    'Burak','Oğuz','Can','Cem','Berk','Arda','Kaan','Eren','Onur','Barış',
    'Deniz','Ege','Kerem','Serkan','Uğur','Tolga','Selim','Fatih','Kadir','Volkan',
    'Ayşe','Fatma','Emine','Zeynep','Elif','Merve','Büşra','Selin','Dilan','İrem',
    'Esra','Gül','Ceren','Damla','Yağmur','Ebru','Pınar','Derya','Aslı','Burcu',
    'Ada','Defne','Ecrin','Nehir','Lara','Mira','Nisa','Asya','Duru','Ela',
    'Baran','Alp','Emir','Tuna','Doruk','Atlas','Rüzgar','Aras','Demir','Çınar',
    'Sude','Melis','Ceylin','Berra','İpek','Tuğçe','Simge','Cansu','Gizem','Hazal',
    'Furkan','Berke','Umut','Koray','Taylan','Sinan','Tamer','Cenk','Okan','Polat',
    'Yiğit','Utku','Batuhan','Alper','Erdem','Gökhan','Caner','Güney','Doruk','Eymen'
  ];
  last_names TEXT[] := ARRAY[
    'Yılmaz','Kaya','Demir','Çelik','Şahin','Yıldız','Yıldırım','Öztürk','Aydın','Özdemir',
    'Arslan','Doğan','Kılıç','Aslan','Çetin','Kara','Koç','Kurt','Özkan','Şimşek',
    'Polat','Korkmaz','Çakır','Aktaş','Erdoğan','Güneş','Yalçın','Tekin','Aksoy','Taş',
    'Acar','Kaplan','Karaca','Bulut','Güler','Turan','Bozkurt','Işık','Bal','Coşkun',
    'Sarı','Gündüz','Bayrak','Uçar','Kılınç','Duman','Avcı','Zengin','Sezer','Elmas',
    'Bilgin','Keskin','Toprak','Ateş','Başar','Dinç','Gök','Kalkan','Özer','Tan',
    'Sönmez','Durak','Uysal','Güneş','Pala','Ünal','Erkan','Kılıçoğlu','Akın','Bayar',
    'Gürbüz','Dağ','Altın','Tüfekçi','Korkut','Yavuz','Aksu','Boz','Soylu','Çimen',
    'Alkan','Kartal','Tosun','Ergin','Deniz','Uslu','Kocaman','Peker','Sevinç','Yaman',
    'Beyaz','Candan','Topçu','Demirel','Akdeniz','Çoban','Durmuş','Gencer','Kıvanç','Tunç'
  ];
  fname TEXT;
  lname TEXT;
  uname TEXT;
  email TEXT;
  created TIMESTAMP;
  pw_hash TEXT;
  j INT;
  rand_idx INT;
  points_earned INT;
  solved_at TIMESTAMP;
BEGIN
  -- Use a common bcrypt hash for all fake users (password: fake12345)
  pw_hash := '$2b$10$KIXvJz1Zp9FQqZF0qH6VXuO3T/XmJ5dkQ5v2k9RqKjM3MzJpKGniy';

  FOR i IN 1..1000 LOOP
    -- Pick random first/last name
    fname := first_names[1 + floor(random() * array_length(first_names, 1))::int];
    lname := last_names[1 + floor(random() * array_length(last_names, 1))::int];
    uname := fname || ' ' || lname;
    email := lower(replace(replace(replace(replace(replace(replace(replace(replace(replace(fname,'ı','i'),'ş','s'),'ç','c'),'ğ','g'),'ü','u'),'ö','o'),'İ','i'),'Ş','s'),'Ç','c'))
             || '.'
             || lower(replace(replace(replace(replace(replace(replace(replace(replace(replace(lname,'ı','i'),'ş','s'),'ç','c'),'ğ','g'),'ü','u'),'ö','o'),'İ','i'),'Ş','s'),'Ç','c'))
             || i::text || '@fake.siberkampus.org';

    -- Random creation date: last 3 months
    created := NOW() - (random() * 90)::int * INTERVAL '1 day' - (random() * 86400)::int * INTERVAL '1 second';

    -- Determine how many rooms this user solved (weighted distribution)
    -- 30% solved 0-1, 25% solved 2-4, 20% solved 5-7, 15% solved 8-10, 10% solved 11-15
    DECLARE rv FLOAT := random();
    BEGIN
      IF rv < 0.30 THEN solve_count := floor(random() * 2)::int;
      ELSIF rv < 0.55 THEN solve_count := 2 + floor(random() * 3)::int;
      ELSIF rv < 0.75 THEN solve_count := 5 + floor(random() * 3)::int;
      ELSIF rv < 0.90 THEN solve_count := 8 + floor(random() * 3)::int;
      ELSE solve_count := 11 + floor(random() * 5)::int;
      END IF;
    END;

    IF solve_count > 15 THEN solve_count := 15; END IF;

    -- Calculate total points
    total_points := 0;
    total_solved := solve_count;

    -- Shuffle and pick rooms
    solved_rooms := ARRAY[]::TEXT[];
    FOR j IN 1..solve_count LOOP
      LOOP
        rand_idx := 1 + floor(random() * array_length(all_rooms, 1))::int;
        EXIT WHEN NOT (all_rooms[rand_idx] = ANY(solved_rooms));
      END LOOP;
      solved_rooms := solved_rooms || all_rooms[rand_idx];
      total_points := total_points + room_pts[rand_idx];
    END LOOP;

    -- Calculate level (every 200 points = 1 level, max 20)
    user_level := GREATEST(1, LEAST(20, 1 + (total_points / 200)));
    user_streak := 1 + floor(random() * 14)::int;
    user_badges := LEAST(solve_count, floor(random() * 6)::int);

    -- Insert user
    INSERT INTO users (email, password_hash, name, points, solved_count, level, streak, badges, rank_val, created_at, is_admin, is_banned, last_active_at)
    VALUES (
      email, pw_hash, uname, total_points, total_solved, user_level, user_streak, user_badges,
      50 + floor(random() * 950)::int,
      created,
      false, false,
      created + (random() * (EXTRACT(EPOCH FROM NOW() - created)))::int * INTERVAL '1 second'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO uid;

    -- If user was actually inserted
    IF uid IS NOT NULL THEN
      -- Insert solved rooms
      FOR j IN 1..array_length(solved_rooms, 1) LOOP
        IF solved_rooms[j] IS NOT NULL THEN
          solved_at := created + (random() * (EXTRACT(EPOCH FROM NOW() - created)))::int * INTERVAL '1 second';

          -- Find room points
          FOR rand_idx IN 1..array_length(all_rooms, 1) LOOP
            IF all_rooms[rand_idx] = solved_rooms[j] THEN
              points_earned := room_pts[rand_idx] - (floor(random() * 2)::int * 20);
              IF points_earned < 10 THEN points_earned := 10; END IF;
              EXIT;
            END IF;
          END LOOP;

          INSERT INTO solved_rooms (user_id, room_id, points_earned, solved_at)
          VALUES (uid, solved_rooms[j], points_earned, solved_at)
          ON CONFLICT DO NOTHING;

          INSERT INTO room_progress (user_id, room_id, progress_percent)
          VALUES (uid, solved_rooms[j], 100)
          ON CONFLICT DO NOTHING;
        END IF;
      END LOOP;
    END IF;

  END LOOP;

  -- Update rank_val based on actual points ordering
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY points DESC, solved_count DESC) as rn
    FROM users
    WHERE email NOT LIKE '%@fake.siberkampus.org' OR TRUE
  )
  UPDATE users SET rank_val = ranked.rn FROM ranked WHERE users.id = ranked.id;

  RAISE NOTICE '✓ 1000 fake users seeded successfully!';
END $$;
