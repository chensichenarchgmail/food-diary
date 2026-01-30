# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static food diary website (个人美食日记网站) that displays food photos in a responsive grid gallery. The site is built with vanilla HTML/CSS/JavaScript and requires no build process or backend server.

## Running the Website

Due to browser CORS restrictions, the site must be served via HTTP:

```bash
# Option 1: Python
cd "C:\Users\GF\OneDrive\Obsidian Vault\notes"
python -m http.server 8000
# Visit: http://localhost:8000/food-website/

# Option 2: Node.js
npx serve

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## Architecture

### Core Structure

- **index.html** - Single-page application shell with gallery, modal, and zoom controls
- **app.js** - `FoodGallery` class handles all logic: image loading, modal navigation, zoom controls
- **style.css** - CSS Grid-based responsive layout with zoom slider support
- **images.json** - Image metadata (filename, date, description) sorted by date

### Key Design Patterns

**Dual-Image Loading Strategy**: The app uses thumbnails for the grid (stored in `thumbnails/`) and loads original full-resolution images (from `food-images/`) only when opened in modal. This provides fast initial page load.

**Zoom Control**: CSS variable `--image-size` controls grid item size. The zoom slider (50-300px) updates this variable in real-time using `requestAnimationFrame` for smooth performance.

**State Management**: `FoodGallery` class tracks:
- `images[]` - sorted array from images.json
- `currentModalIndex` - which image is shown in modal
- `imageSize` - current zoom level

### Image Data Structure

```json
{
  "images": [
    {
      "filename": "IMG_20260130_183943.jpg",
      "date": "2026-01-30",
      "description": "牛肝菌"
    }
  ]
}
```

## Adding New Content

### Step 1: Add Image Files
1. Place new images in `food-images/` directory
2. Run thumbnail generator:
```bash
python generate_thumbnails.py
```
This copies originals to `food-images/` and creates 300x300 thumbnails in `thumbnails/`.

### Step 2: Update images.json
Add entries to `images.json` (newest first for proper sorting):
```json
{
  "filename": "IMG_20260131_123456.jpg",
  "date": "2026-01-31",
  "description": "红烧肉，香而不腻"
}
```

### Step 3: (Optional) Generate AI Descriptions
Use Python scripts to batch process images for AI analysis:
```bash
python batch_analyze.py    # Lists images needing descriptions
python generate_descriptions.py  # Prepares JSON structure
```

## File Paths

The codebase references these key paths (hardcoded in multiple files):
- Image source: `C:\Users\GF\OneDrive\Obsidian Vault\notes\food-images\`
- Website: `C:\Users\GF\OneDrive\Obsidian Vault\notes\food-website\`

When updating paths, check:
- `generate_thumbnails.py` - lines 7-10
- `generate_descriptions.py` - lines 6-8
- `batch_analyze.py` - lines 9-10
- `app.js` - lines 9-10 (runtime paths: `food-images/` and `thumbnails/`)

## JavaScript Architecture Notes

The `FoodGallery` class (app.js) loads **all images at once** rather than implementing pagination or true infinite scroll. This works because:
1. Thumbnails are small (~300px, compressed)
2. Browser lazy loading (`loading="lazy"`) defers off-screen image loading
3. Total image count is reasonable for personal photo collection

Modal navigation uses direct array indexing rather than DOM traversal for performance.

## CSS Notes

- Grid uses `auto-fill` with `minmax(var(--image-size), 1fr)` for responsive columns
- Zoom updates happen via CSS custom property, not inline styles on each element
- Hover effects use `transform: scale(1.05)` with `z-index: 10` to pop images above neighbors
