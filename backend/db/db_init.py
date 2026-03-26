from db import get_db

cn = get_db()
cs = cn.cursor()

try: 
    cs.execute("""
    CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                username TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'player'
    );
    """)
    cn.commit()
    cn.close()

except Exception as e:
    print(f"An error occured: {e}")