from typing import Literal

def get_user_characters(db, user_uuid: str):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT character_uuid, name, class, appearance, personality, bio FROM characters " \
            "WHERE user_uuid = %s;",
            (user_uuid, )
        )
        return cursor.fetchall()

def create_new_character(
        db, 
        user_uuid: str,
        name: str, 
        class_or_role: str, 
        appearance: str, 
        personality: str, 
        bio: str,
        limit_per_user: int
):
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO characters "
            "(user_uuid, name, class, appearance, personality, bio) " \
            "SELECT %s, %s, %s, %s, %s, %s " \
            "WHERE (" \
                "SELECT COUNT(*) FROM characters WHERE user_uuid = %s" \
            ") < %s " \
            "RETURNING character_uuid;",
            (user_uuid, name, class_or_role, appearance, personality, bio, user_uuid, limit_per_user)
        )

        return cursor.fetchone()["character_uuid"]
    
def update_character(
        db,
        character_uuid: str, 
        user_uuid: str,
        name: str, 
        class_or_role: str, 
        appearance: str, 
        personality: str, 
        bio: str,
):
    with db.cursor() as cursor: 
        cursor.execute(
            "UPDATE characters " \
            "SET name = %s, class = %s, appearance = %s, personality = %s, bio = %s " \
            "WHERE character_uuid = %s AND user_uuid = %s;", 
            (name, class_or_role, appearance, personality, bio, character_uuid, user_uuid)
        )

def  check_if_already_exists(db, character_uuid: str):
    """Check if a portrait or a token already exists for a character"""
    with db.cursor() as cursor: 
        cursor.execute(
            "SELECT uuid, file_type FROM files " \
            "WHERE character_uuid = %s " \
            "AND file_type IN ('portrait', 'token');", (character_uuid, )
        )
        result = cursor.fetchall()
        if result is None or len(result) != 2:
            return None
        else:
            files_by_type = {res["file_type"]: res["uuid"] for res in result}
            portrait_uuid = files_by_type.get("portrait")
            token_uuid = files_by_type.get("token")
            return {"portrait_uuid": portrait_uuid, "token_uuid": token_uuid}
        
def record_new_character_file(db, file_name: str, file_type: Literal["portrait", "token"], owner_uuid: str, character_uuid: str):
    """Add an entry in the database for a new character file"""
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO files (file_name, file_type, owner_uuid, character_uuid) " \
            "VALUES (%s, %s, %s, %s) RETURNING uuid;", (file_name, file_type, owner_uuid, character_uuid)
        )
        file_uuid = cursor.fetchone()["uuid"]
        return file_uuid
    
def update_existing_character_file(db, file_uuid: str, file_name: str):
    """Update the name of an existing character file"""
    with db.cursor() as cursor:
        cursor.execute(
            "UPDATE files SET file_name = %s, created_at = now() WHERE uuid = %s RETURNING uuid;",
            (file_name, file_uuid)
        )
        updated_uuid = cursor.fetchone()["uuid"]
        return updated_uuid
    
def get_character_file(db, character_uuid: str, file_type: Literal["portrait", "token"]):
    """Get a character file with its file_uuid"""
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT uuid, owner_uuid FROM files " \
            "WHERE character_uuid = %s AND file_type = %s;", 
            (character_uuid, file_type)
        )
        res = cursor.fetchone()
        if res is None:
            return None
        else: 
            return res