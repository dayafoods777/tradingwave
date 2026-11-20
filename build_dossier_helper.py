import os
import json
import zipfile

BASE_DIR = os.path.abspath("TradingWave_Research_and_Development")

def write_doc(rel_path, content):
    full_path = os.path.join(BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Written: {rel_path}")

print(f"Generator initialized targeting {BASE_DIR}")

