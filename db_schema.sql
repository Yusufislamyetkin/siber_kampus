-- Siber Kampüs Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    points INT DEFAULT 0,
    solved_count INT DEFAULT 0,
    level INT DEFAULT 1,
    rank_val INT DEFAULT 1000,
    badges INT DEFAULT 0,
    streak INT DEFAULT 1,
    name_changed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Solved Rooms Table
CREATE TABLE IF NOT EXISTS solved_rooms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id VARCHAR(50) NOT NULL,
    points_earned INT NOT NULL,
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_room UNIQUE(user_id, room_id)
);

-- 3. Room Progress Table
CREATE TABLE IF NOT EXISTS room_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id VARCHAR(50) NOT NULL,
    progress_percent INT DEFAULT 10,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_progress UNIQUE(user_id, room_id)
);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Unlocked Hints Table
CREATE TABLE IF NOT EXISTS unlocked_hints (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    room_id VARCHAR(50) NOT NULL,
    hint_index INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_hint UNIQUE(user_id, room_id, hint_index)
);

-- 6. Add columns to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE;

-- Add is_vip column to chat_messages table if it doesn't exist
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT FALSE;

-- 7. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 dk',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Doc Progress Table
CREATE TABLE IF NOT EXISTS user_doc_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  doc_id VARCHAR(40) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_doc UNIQUE(user_id, doc_id)
);

-- 9. Add is_premium column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

