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


def update_campaign_title(db, user_id: int, campaign_id: int, title: str):
    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE campaigns
            SET campaign_title = %s
            FROM users_campaigns
            WHERE users_campaigns.campaign_id = campaigns.id
              AND role = 'gm'
              AND user_id = %s
              AND campaign_id = %s;
            """,
            (title, user_id, campaign_id)
        )