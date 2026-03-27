-- database/init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL, 
    role TEXT DEFAULT 'player'
);

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