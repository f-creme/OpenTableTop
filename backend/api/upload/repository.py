def get_user_role_for_campaign(db, user_uuid: str, campaign_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT role FROM users_campaigns WHERE user_uuid = %s AND campaign_uuid = %s;",
            (user_uuid, campaign_uuid)
        )
        response = cursor.fetchone()["role"]
        return response and response == "gm"
    
def get_user_campaigns(db, user_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT campaign_uuid FROM users_campaigns WHERE user_uuid = %s AND role = 'gm';",
            (user_uuid, )
        )
        response = cursor.fetchall()
        return response
    
def record_file(db, file_name: str, file_type: str, owner_uuid: str, campaign_uuid: str):
    with db.cursor() as cursor: 
        cursor.execute(
            "INSERT INTO files (file_name, file_type, owner_uuid, campaign_uuid) " \
            "VALUES (%s, %s, %s, %s) RETURNING uuid;", 
            (file_name, file_type, owner_uuid, campaign_uuid)
        )
        new_file_uuid = cursor.fetchone()["uuid"]
        return new_file_uuid