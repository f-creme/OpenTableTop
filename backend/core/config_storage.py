import os
from os.path import dirname, join

from core.config import DATA_DIR

def create_campaign_storage(campaign_id: int):
    main_folder_name = f"campaign_{campaign_id:04d}"
    main_folder_path = join(DATA_DIR, main_folder_name)

    os.makedirs(main_folder_path, exist_ok=True)
    os.makedirs(join(main_folder_path, "maps"), exist_ok=True)
    os.makedirs(join(main_folder_path, "tokens"), exist_ok=True)
    os.makedirs(join(main_folder_path, "items"), exist_ok=True)
    os.makedirs(join(main_folder_path, "illustrations"), exist_ok=True)
    os.makedirs(join(main_folder_path, "characters"), exist_ok=True)