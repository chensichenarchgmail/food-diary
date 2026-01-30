"""
批量生成美食图片描述
"""
import os
import json
from pathlib import Path

# Paths
images_dir = Path(r"C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\food-images")
images_json = Path(r"C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\images.json")

# Load current images.json
with open(images_json, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create a mapping of filename to image data
filename_to_data = {img['filename']: img for img in data['images']}

# Get all image files
image_files = sorted([f for f in images_dir.glob('*') if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.gif')])

print(f"Found {len(image_files)} images to analyze\n")
print("=" * 60)
print("Batch Analysis Results")
print("=" * 60)

# Print list for manual review or AI processing
results = {}
for i, img_path in enumerate(image_files, 1):
    filename = img_path.name
    if filename in filename_to_data:
        results[filename] = filename_to_data[filename]
        print(f"{i}. {filename}")
        print(f"   Current description: '{results[filename]['description']}'")
        print()

print("\n" + "=" * 60)
print(f"Total: {len(results)} images")
print("=" * 60)

# Save the updated JSON
# descriptions will be added after AI analysis
with open(images_json, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nJSON file structure ready at: {images_json}")
print("\nNext steps:")
print("1. Use AI vision tool to analyze each image")
print("2. Update descriptions in the JSON file")
print("3. The descriptions should only contain food names separated by commas")
