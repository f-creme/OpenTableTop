<div align="center">

# OpenTableTop

<br/>

**Online tabletop RPG platform for playing and sharing adventures remotely**

[![License: GPL-3.0](https://img.shields.io/github/license/f-creme/OpenTableTop)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/react-19-61DAFB.svg?logo=react)](https://reactjs.org/)

<br/>

**Roll • Play • Share** 

*A lightweight web platform for playing tabletop RPGs online with friends*

[Features](#-current-features) •
[Quick Start](#-quick-start)

</div>

<br/>

## 🎯 Current Features
OpentTableTop lets a Game Master and players interact online for tabletop RPG sessions.

Current capabilities: 
* **Change maps on the fly** - GM controlls the session view, players see updates instantly.
* **Share dice rolls** - Every roll is broadcast in real-time to all connected users.

<br/>

## 🔧 Planned Features
* **Token management and placement on maps** - Players and GM can place and move tokens to represents characters on the table.
* **Player account and permissions** - More advanced login system to control access and roles.
* **Character creation and management** - Players can create a character, store it in the database, or selecte an existing one, and display it on the table.
* **Dice roll history** -  Keep a log previous dice rolls.

<br/>

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

**Backend:**

```bash
cd backend
cp .env.example .env # Copy the env file dans edit it if needed
uv sync 
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Configuration

#### Add Users
As the interface still does not allow to create users, you can add an authorized user via the API:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```
> ⚠️ Only use this for local development. Do not expose your server to the internet when using this command.

#### Add Maps
* Place your map images in a maps folder
* Edit `config.py` in the backend to point to that folder

### 4. Open the application

* Frontend: open your browser and go to http://localhost:5173
* Backend API: http://localhost:8000

<br/>

## 📄 License
OpenTableTop is licensed under **GPL-3.0 License**. See the [LICENSE](LICENSE) file for details.