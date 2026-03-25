import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../data"))

CAMPAIGN_DIR = os.path.join(DATA_DIR, "campaign_0000")
MAPS_DIR = os.path.join(CAMPAIGN_DIR, "maps")