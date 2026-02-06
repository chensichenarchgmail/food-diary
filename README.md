# Food Diary

个人美食日记 - 静态图片画廊

## 运行

```bash
python -m http.server 8000
```

访问 http://localhost:8000

## 添加美食

```bash
# 1. 放图片到 src-images/
python generate_thumbnails.py

# 2. 编辑 images.json (最新的在最前)
```

## 结构

```
index.html           # 主页面
app.js               # FoodGallery 类
style.css            # 样式
images.json          # 图片元数据
generate_thumbnails.py  # 缩略图生成
food-images/         # 原图
thumbnails/          # 缩略图 300x300
src-images/          # 新图片源
```

## 部署

GitHub Pages → [food.doubling.cc](https://food.doubling.cc)

## Git 同步

```bash
git add . && git commit -m "Add: 新美食" && git push
```
