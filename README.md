<div align="center">

# OpenTableTop

<br/>

**Online tabletop RPG platform for playing and sharing adventures remotely**

[![License: GPL-3.0](https://img.shields.io/github/license/f-creme/OpenTableTop)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/react-19-61DAFB.svg?logo=react)](https://reactjs.org/)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)


<br/>

**Roll • Play • Share** 

*A lightweight web platform for playing tabletop RPGs online with friends*

[Features](#-current-features) •
[Quick Start](#-quick-start)

</div>

<br/>

## ⚡ Philosophy
OpenTableTop is meant to be simple, fast, and system-agnostic. It provides an interactive tabletop without enforcing complex character sheets, so it can be use with any RPG system.

## 🎯 Current Features
OpentTableTop lets a Game Master and players interact online for tabletop RPG sessions.

Core capabilities: 
* **Campaign Management for Game Master** - General info, user invitations, and upload of resources (maps, illustrations, tokens).
* **Character Management for Players** - Simple character creation with basic info, portrait, and custom token.
* **Shared interactive table** - The table canvas displays the map, illustrations, and token for all connected players.
* **Real-time interactive tokens** - Players and GM can place, move, and interact with tokens dinamically. All connected users see updates instantly via websockets.
* **GM controls** - Prepare content secretly, control visibility of maps, illustrations and tokens for players.
* **Shared dice rolls** - Broadcast rolls in real-time to all connected users.
* **Player presence** - See which players are connected around the table.
* **Multiple simultaneous sessions** - Each campaign runs independently with its own table and websocket, so multiple groups can play at the same time on the same server.

<br/>

## 🔧 Planned Features
* **Localization/i18n** - Add english translations (currently only French is available).
* **Player statuses** - Player can update a small status icon/info (e.g., "injured", exploring", "help me", etc.) around the table in real-time.
* **Dice roll history** -  Keep a log previous dice rolls.

<br/>

## 🚀 Quick Start *with Docker Compose*

The simple way to get started for development or testing.

### 1. Clone the repository

```bash
git clone https://github.com/f-creme/OpenTableTop.git
cd OpenTableTop
```

### 2. Copy environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp database/.env.example database/.env
```
> Edit `.env` files if needed (e.g., ports, database credentials).

### 3. Start everything with Docker Compose

```bash
docker compose up -d
```

> This will launch the PostgreSQL database, backend API and frontend automatically.


## 📦 Manual installation *for development*

### 1. Clone the repository

```bash
git clone https://github.com/f-creme/OpenTableTop.git
cd OpenTableTop
```

### 2. Setup and install dependencies

**Database (PostgreSQL):**
```bash
cd database
cp .env.example .env # Copy the env file dans edit it if needed
docker-compose up -d # init.sql file will automatically create the database and tables
```

**Frontend:**

```bash
cd frontend
cp .env.example .env # Copy the env file dans edit it if needed
npm install 
npm run dev
```

> In `.env`, replace docker compose service name "backend" by "localhost" for `VITE_API_URL`.

**Backend:**

```bash
cd backend
cp .env.example .env # Copy the env file dans edit it if needed
uv sync 
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> In `.env`: 
> * set `DB_HOST` to `localhost`.
> * set `STORAGE_DIR` to the an existing directory where you want to store files of users like maps, illustrations, etc.

### 3. Configuration

#### Add Users
As the interface still does not allow to create users, you can add an authorized user via the API:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass","public_name":"display_name"}'
```
> ⚠️ Only use this for local development. Do not expose your server to the internet when using this command.

### 4. Open the application

* Frontend: open your browser and go to http://localhost:5173
* Backend API: http://localhost:8000

<br/>

## 📄 License
OpenTableTop is licensed under **GPL-3.0 License**. See the [LICENSE](LICENSE) file for details.