def create_new_character(
        db, 
        user_id: int,
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
            "(user_id, name, class, appearance, personality, bio) " \
            "SELECT %s, %s, %s, %s, %s, %s " \
            "WHERE (" \
                "SELECT COUNT(*) FROM characters WHERE user_id = %s" \
            ") < %s " \
            "RETURNING id;",
            (user_id, name, class_or_role, appearance, personality, bio, user_id, limit_per_user)
        )

        return cursor.fetchone()["id"]