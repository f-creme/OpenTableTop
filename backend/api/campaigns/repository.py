def get_user_campaigns(db, user_uuid: str):
    with db.cursor() as cs:
        cs.execute(
            """
            SELECT campaign_uuid, campaign_title, users_campaigns.role
            FROM users_campaigns
            LEFT JOIN campaigns ON campaigns.campaign_uuid = users_campaigns.campaign_uuid
            WHERE user_uuid = %s;
            """,
            (user_uuid, )
        )
        return cs.fetchall()

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

def get_campaign_users(db, campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT id, character_name, role, public_name " \
            "FROM users_campaigns " \
            "LEFT JOIN profiles ON users_campaigns.user_id = profiles.user_id " \
            "WHERE campaign_id = %s " \
            "ORDER BY role ASC;", 
            (campaign_id, )
        )
        return cursor.fetchall()
    
def remove_user_from_campaign(db, user_campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM users_campaigns WHERE id = %s", (user_campaign_id, ))

def find_user(db, public_name: str):
    with db.cursor() as cursor:
        cursor.execute("SELECT user_id FROM profiles WHERE public_name = %s;", (public_name, ))
        response = cursor.fetchone()
        return response["user_id"]
    
def add_user_to_campaign(db, participant_user_id: int, campaign_id: int, participant_public_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO users_campaigns "
            "(user_id, campaign_id, character_name, role) VALUES " \
            "(%s, %s, %s, 'player');",
            (participant_user_id, campaign_id, participant_public_name)
        )
