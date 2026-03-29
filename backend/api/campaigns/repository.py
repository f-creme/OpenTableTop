def get_user_campaigns(db, user_id: int):
    with db.cursor() as cs:
        cs.execute(
            """
            SELECT campaign_id, campaign_title, users_campaigns.role
            FROM users_campaigns
            LEFT JOIN campaigns ON campaigns.id = users_campaigns.campaign_id
            WHERE user_id = %s;
            """,
            (user_id,)
        )
        return cs.fetchall()

def get_campaign_global(db, user_id: int, campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT c.campaign_title, uc.character_name, p.public_name 
            FROM campaigns c
            LEFT JOIN users_campaigns uc ON uc.campaign_id = c.id 
            LEFT JOIN profiles p ON p.user_id = uc.user_id 
            WHERE role IN ('gm', 'player') AND uc.user_id = %s AND campaign_id = %s;
            """,
            (user_id, campaign_id)
        )
        return cursor.fetchall()


def update_campaign_global(db, user_id: int, campaign_id: int, title: str, character_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE campaigns SET campaign_title = %s 
            FROM users_campaigns WHERE users_campaigns.campaign_id = campaigns.id
            AND role = 'gm' AND user_id = %s AND campaign_id = %s;
            """,
            (title, user_id, campaign_id)
        )

        cursor.execute(
            """
            UPDATE users_campaigns SET character_name = %s 
            WHERE campaign_id = %s AND user_id = %s AND role = 'gm';
            """,
            (character_name, campaign_id, user_id)
        )


def create_campaign(db, user_id: int, title: str, character_name: str):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO campaigns (campaign_title) VALUES (%s) RETURNING id;",
            (title, )
        )
        campaign_id = cursor.fetchall()[0]["id"]

        cursor.execute(
            "INSERT INTO users_campaigns (campaign_id, user_id, role, character_name) " \
            "VALUES (%s, %s, 'gm', %s);",
            (campaign_id, user_id, character_name)
        )
        return campaign_id
    
def delete_campaign(db, user_id: int, campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            "DELETE FROM campaigns c USING users_campaigns uc " \
            "WHERE c.id = %s " \
            "AND uc.campaign_id = c.id " \
            "AND uc.user_id = %s " \
            "AND uc.role = 'gm';",
            (campaign_id, user_id)
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
        