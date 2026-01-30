import os
import json
from pathlib import Path

# Paths
images_dir = Path(r"C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\food-images")
images_json = Path(r"C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\images.json")
output_file = Path(r"C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\image_list.txt")

# Get all image files
image_files = sorted([f for f in images_dir.glob('*') if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.gif')])

print(f"Found {len(image_files)} images")

# Create a list of images for AI to analyze
with open(output_file, 'w', encoding='utf-8') as f:
    for i, img_path in enumerate(image_files, 1):
        f.write(f"{i}. {img_path.name}\n")
        f.write(f"   Path: {img_path}\n\n")

print(f"\nImage list saved to: {output_file}")
print("\nNow I will analyze these images using AI vision...")
print("Please wait while I process the images...\n")

# This will create a list that we can use for batch AI analysis
print("First 10 images to process:")
for i, img_path in enumerate(image_files[:10], 1):
    print(f"  {i}. {img_path.name}")
