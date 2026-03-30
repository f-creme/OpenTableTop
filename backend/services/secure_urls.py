import re
import os

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

def is_safe_filename(filename: str) -> bool:
    return bool(re.match(r'^[a-zA-Z0-9_\-\.]+$', filename)) and '..' not in filename

def is_safe_path(base_dir: str, requested_path: str) -> bool:
    base_dir = os.path.abspath(base_dir)
    requested_path = os.path.abspath(requested_path)
    return os.path.commonpath([base_dir, requested_path]) == base_dir

def is_allowed_extension(filename :str) -> bool: 
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS