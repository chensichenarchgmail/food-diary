import os
import shutil
from PIL import Image
import json

# Paths
source_dir = os.path.join(".", "src-images")
target_dir = os.path.join(".", "food-images")
thumbnail_dir = os.path.join(".", "thumbnails")
images_json = os.path.join(".", "images.json")

# Thumbnail size (width, height)
THUMBNAIL_SIZE = (300, 300)

# Create directories
os.makedirs(target_dir, exist_ok=True)
os.makedirs(thumbnail_dir, exist_ok=True)

print("Processing images...")

# Copy images and create thumbnails
image_files = [f for f in os.listdir(source_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]

for i, filename in enumerate(image_files, 1):
    source_path = os.path.join(source_dir, filename)
    target_path = os.path.join(target_dir, filename)
    thumbnail_path = os.path.join(thumbnail_dir, filename)

    print(f"[{i}/{len(image_files)}] Processing {filename}...")

    try:
        # Copy original image
        if not os.path.exists(target_path):
            shutil.copy2(source_path, target_path)
            print(f"  [OK] Copied original")
        else:
            print(f"  [SKIP] Original exists")

        # Create thumbnail
        if not os.path.exists(thumbnail_path):
            with Image.open(source_path) as img:
                # Convert to RGB if necessary (for JPEG)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')

                # Create thumbnail
                img.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
                img.save(thumbnail_path, 'JPEG', quality=85, optimize=True)
            print(f"  [OK] Created thumbnail")
        else:
            print(f"  [SKIP] Thumbnail exists")

    except Exception as e:
        print(f"  [ERROR] {e}")

print(f"\nDone! Processed {len(image_files)} images")
print(f"Originals: {target_dir}")
print(f"Thumbnails: {thumbnail_dir}")
