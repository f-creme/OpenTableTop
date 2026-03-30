def get_user_role_for_campaign(db, user_id: int, campaign_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT role FROM users_campaigns WHERE user_id = %s AND campaign_id = %s;",
            (user_id, campaign_id)
        )
        response = cursor.fetchone()["role"]
        return response and response == "gm"
    
def get_user_campaigns(db, user_id: int):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT campaign_id FROM users_campaigns WHERE user_id = %s AND role = %s;",
            (user_id, )
        )
        response = cursor.fetchall()
        return response