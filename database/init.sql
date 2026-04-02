-- database/init.sql

-- Users table for login
CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    username TEXT UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL, 
    role TEXT DEFAULT 'player'
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    profile_id SERIAL PRIMARY KEY,
    user_uuid UUID NOT NULL,
    public_name TEXT UNIQUE,
    CONSTRAINT fk_user_id 
        FOREIGN KEY(user_uuid) 
        REFERENCES users(uuid) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);

CREATE INDEX idx_profiles_public_name ON profiles(public_name);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    campaign_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_title TEXT UNIQUE NOT NULL
);

-- Players campaigns
CREATE TABLE IF NOT EXISTS users_campaigns (
    id SERIAL PRIMARY KEY, 
    campaign_uuid UUID NOT NULL,
    user_uuid UUID NOT NULL,
    role TEXT DEFAULT 'player',
    character_name TEXT, 
    CONSTRAINT fk_campaign 
        FOREIGN KEY(campaign_uuid) 
        REFERENCES campaigns(campaign_uuid) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    CONSTRAINT fk_user 
        FOREIGN KEY(user_uuid) 
        REFERENCES users(uuid)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Characters
CREATE TABLE IF NOT EXISTS characters (
    character_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uuid UUID NOT NULL,
    name VARCHAR(30) NOT NULL, 
    class VARCHAR(30), 
    appearance VARCHAR(33),
    personality VARCHAR(33),
    bio VARCHAR(144), 
    CONSTRAINT fk_user 
        FOREIGN KEY(user_uuid) 
        REFERENCES users(uuid)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- File storage
CREATE TABLE IF NOT EXISTS files (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('map', 'token', 'illustration', 'portrait')), 
    owner_uuid UUID NOT NULL, 
    created_at TIMESTAMP DEFAULT now(), 
    CONSTRAINT fk_owner 
        FOREIGN KEY(owner_uuid) 
        REFERENCES users(uuid) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);