-- database/init.sql

-- Users table for login
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL, 
    role TEXT DEFAULT 'player'
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    public_name TEXT UNIQUE,
    CONSTRAINT fk_user_id 
        FOREIGN KEY(user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);

CREATE INDEX idx_profiles_public_name ON profiles(public_name);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    campaign_title TEXT UNIQUE NOT NULL
);

-- Players campaigns
CREATE TABLE IF NOT EXISTS users_campaigns (
    id SERIAL PRIMARY KEY, 
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    role TEXT DEFAULT 'player',
    character_name TEXT, 
    CONSTRAINT fk_campaign 
        FOREIGN KEY(campaign_id) 
        REFERENCES campaigns(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE, 
    CONSTRAINT fk_user 
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);