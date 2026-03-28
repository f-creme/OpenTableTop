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


def get_campaign_title(db, user_id: int, campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            """
            SELECT campaign_title
            FROM campaigns
            LEFT JOIN users_campaigns ON users_campaigns.campaign_id = campaigns.id
            WHERE role = 'gm' AND user_id = %s AND campaign_id = %s;
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