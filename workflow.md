# 美食日记网站更新流程

## 自动化更新步骤

### 1. 检测新图片

检测 `food-images/` 文件夹中新拍摄的美食照片。

### 2. 生成缩略图

运行以下命令为新图片生成缩略图（保存到 `thumbnails/` 文件夹）：

```bash
cd "~\OneDrive\GitProjects\food-website"
python -c "
import os
from PIL import Image

# Create thumbnails directory
thumbnail_dir = 'thumbnails'
os.makedirs(thumbnail_dir, exist_ok=True)

# List new image files here
new_images = [
    'IMG_20260131_105633.jpg',
    'IMG_20260131_182526.jpg',
    'IMG_20260131_184058.jpg'
]

THUMBNAIL_SIZE = (300, 300)

for filename in new_images:
    source_path = os.path.join('food-images', filename)
    thumbnail_path = os.path.join(thumbnail_dir, filename)

    if os.path.exists(source_path):
        with Image.open(source_path) as img:
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            img.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, 'JPEG', quality=85, optimize=True)
        print(f'Created thumbnail: {filename}')
    else:
        print(f'File not found: {filename}')
"
```

### 3. 识别食物（使用 MCP）

使用 Claude MCP 工具识别每张图片中的食物，获取简洁描述。

示例 prompt：`请描述这张图片中的主要食材。请用中文回答，简洁明了，用逗号隔开。（示例：蘑菇、萝卜、三文鱼）`

### 4. 更新 images.json

在 `images.json` 文件开头添加新图片的元数据（最新图片在前）：

```json
{
  "filename": "IMG_20260131_184058.jpg",
  "date": "2026-01-31",
  "description": "酱炒蘑菇"
}
```

**注意**：

- `date` 字段格式：`YYYY-MM-DD`
- `description` 字段：简洁的食物描述（2-10个字）
- 新图片添加到数组最前面

### 5. 提交并推送到 GitHub

```bash
cd "~\OneDrive\GitProjects\food-website"

# 添加所有新文件
git add images.json food-images/IMG_*.jpg thumbnails/IMG_*.jpg

# 提交
git commit -m "Add new food photos (YYYY-MM-DD)"

# 推送
git push
```

## 目录结构

```
food-website/
├── food-images/          # 原始图片（全尺寸）
│   ├── IMG_20260131_105633.jpg
│   ├── IMG_20260131_182526.jpg
│   └── IMG_20260131_184058.jpg
├── thumbnails/           # 缩略图（300x300）
│   ├── IMG_20260131_105633.jpg
│   ├── IMG_20260131_182526.jpg
│   └── IMG_20260131_184058.jpg
├── images.json           # 图片元数据
├── index.html
├── app.js
└── style.css
```

## 示例：完整更新流程

```bash
# 1. 检查新图片
ls food-images/IMG_*.jpg

# 2. 生成缩略图
python -c "..."  # 使用上面的脚本

# 3. 识别食物（通过 Claude MCP）
# - 分析图片获取食物描述

# 4. 更新 images.json
# - 手动编辑或在 Claude 中更新

# 5. Git 操作
git add images.json food-images/IMG_*.jpg thumbnails/IMG_*.jpg
git commit -m "Add new food photos (2026-01-31)"
git push
```

## 常见问题

### Q: 缩略图生成失败？

A: 确保 PIL/Pillow 已安装：`pip install Pillow`

### Q: 推送失败？

A: 检查网络连接，或使用 `git push` 重试

### Q: 图片描述格式？

A: 使用简洁的中文描述，如："蔬菜汤面"、"蛤蜊贻贝"、"酱炒蘑菇"
