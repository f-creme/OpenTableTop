def get_user_campaigns(db, user_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT c.campaign_uuid, c.campaign_title, uc.role 
            FROM users_campaigns AS uc 
            LEFT JOIN campaigns AS c ON uc.campaign_uuid = c.campaign_uuid 
            WHERE uc.user_uuid = %s;
            """,
            (user_uuid, )
        )
        return cursor.fetchall()

def get_campaign_global(db, user_uuid: str, campaign_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT c.campaign_title, uc.character_name, p.public_name 
            FROM campaigns c
            LEFT JOIN users_campaigns uc ON uc.campaign_uuid = c.campaign_uuid 
            LEFT JOIN profiles p ON p.user_uuid = uc.user_uuid  
            WHERE role IN ('gm', 'player') AND uc.user_uuid = %s AND uc.campaign_uuid = %s;
            """,
            (user_uuid, campaign_uuid)
        )
        return cursor.fetchall()


def update_campaign_global(db, user_uuid: str, campaign_uuid: str, title: str, character_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE campaigns SET campaign_title = %s 
            FROM users_campaigns WHERE users_campaigns.campaign_uuid = campaigns.campaign_uuid 
            AND role = 'gm' AND user_uuid = %s AND campaigns.campaign_uuid = %s;
            """,
            (title, user_uuid, campaign_uuid)
        )

        cursor.execute(
            """
            UPDATE users_campaigns SET character_name = %s 
            WHERE campaign_uuid = %s AND user_uuid = %s AND role = 'gm';
            """,
            (character_name, campaign_uuid, user_uuid)
        )

def count_user_campaigns(db, user_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM users_campaigns WHERE user_uuid = %s AND role = 'gm';",
            (user_uuid, )
        )
        count = cursor.fetchone()["count"]
        return count

def create_campaign(db, user_uuid: str, title: str, character_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO campaigns (campaign_title) VALUES (%s) RETURNING campaign_uuid;",
            (title, )
        )
        campaign_uuid = cursor.fetchall()[0]["campaign_uuid"]

        cursor.execute(
            "INSERT INTO users_campaigns (campaign_uuid, user_uuid, role, character_name) " \
            "VALUES (%s, %s, 'gm', %s);",
            (campaign_uuid, user_uuid, character_name)
        )
        return campaign_uuid
    
def delete_campaign(db, user_uuid: str, campaign_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "DELETE FROM campaigns c USING users_campaigns uc " \
            "WHERE c.campaign_uuid = %s " \
            "AND uc.campaign_uuid = c.campaign_uuid " \
            "AND uc.user_uuid = %s " \
            "AND uc.role = 'gm';",
            (campaign_uuid, user_uuid)
        )

def get_campaign_users(db, campaign_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT id, character_name, role, public_name " \
            "FROM users_campaigns " \
            "LEFT JOIN profiles ON users_campaigns.user_uuid = profiles.user_uuid " \
            "WHERE campaign_uuid = %s " \
            "ORDER BY role ASC;", 
            (campaign_uuid, )
        )
        return cursor.fetchall()
    
def remove_user_from_campaign(db, user_campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM users_campaigns WHERE id = %s", (user_campaign_id, ))

def find_user(db, public_name: str):
    with db.cursor() as cursor:
        cursor.execute("SELECT user_uuid FROM profiles WHERE public_name = %s;", (public_name, ))
        response = cursor.fetchone()
        return response["user_uuid"]
    
def add_user_to_campaign(db, participant_user_uuid: str, campaign_uuid: str, participant_public_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO users_campaigns "
            "(user_uuid, campaign_uuid, character_name, role) VALUES " \
            "(%s, %s, %s, 'player');",
            (participant_user_uuid, campaign_uuid, participant_public_name)
        )

def get_character_tokens_uuid(db, character_uuid: str, campaign_uuid: str):
    with db.cursor() as cursor: 
        cursor.execute(
            "SELECT uuid, campaign_uuid FROM files " \
            "WHERE file_type = 'token' AND character_uuid = %s " \
            "AND (campaign_uuid = %s OR campaign_uuid IS NULL);",
            (character_uuid, campaign_uuid)
        )
        rows_dict = cursor.fetchall()
        return rows_dict
    
def register_character_token_in_campaign(db, character_uuid: str, campaign_uuid: str, filename: str, user_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO files (file_name, file_type, owner_uuid, campaign_uuid, character_uuid) " \
            "VALUES (%s, 'token', %s, %s, %s) RETURNING uuid;", 
            (filename, user_uuid, campaign_uuid, character_uuid)
        )
        campaign_character_token_uuid = cursor.fetchone()["uuid"]
        return campaign_character_token_uuid
    
def update_token_in_campaign(db, uuid: str, filename: str):
    with db.cursor() as cursor:
        cursor.execute(
            "UPDATE files " \
            "SET file_name = %s, created_at = now() " \
            "WHERE uuid = %s;",
            (filename, uuid)
        )