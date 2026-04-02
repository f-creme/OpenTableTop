import os
from os.path import dirname, join

from core.config import DATA_DIR

def create_campaign_storage(campaign_uuid: str):
    main_folder_name = f"campaign_{campaign_uuid}"
    main_folder_path = join(DATA_DIR, main_folder_name)

    os.makedirs(main_folder_path, exist_ok=True)
    os.makedirs(join(main_folder_path, "maps"), exist_ok=True)
    os.makedirs(join(main_folder_path, "tokens"), exist_ok=True)
    os.makedirs(join(main_folder_path, "illustrations"), exist_ok=True)

def get_campaign_dir(campaign_uuid: str):
    campaign_folder_name = f"campaign_{campaign_uuid}"
    campaign_folder_path = join(DATA_DIR, campaign_folder_name)
    return campaign_folder_path

def create_user_storage(uuid: str):
    user_folder_name = f"user_{uuid}"
    user_folder_path = join(DATA_DIR, user_folder_name)

    os.makedirs(user_folder_path, exist_ok=True)
    os.makedirs(join(user_folder_path, "characters"), exist_ok=True)
    os.makedirs(join(user_folder_path, "tokens"), exist_ok=True)