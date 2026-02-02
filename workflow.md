# 美食照片上传流程

## 步骤

1. **检测新图片** - 查看 `src-images/` 文件夹

2. **生成缩略图** - 运行 `generate_thumbnails.py`

3. **获取描述** - 从用户输入获取图片描述（可选）

4. **更新元数据** - 在 `images.json` 开头添加新记录：
   ```json
   {
     "filename": "IMG_20260131_184058.jpg",
     "date": "2026-01-31",
     "description": "酱炒蘑菇"
   }
   ```
   - 日期格式：`YYYY-MM-DD`
   - 描述：2-10 字
   - 最新图片放最前

5. **提交推送** - `git add . && git commit -m "..." && git push`

6. **清理** - 删除 `src-images/` 中的图片

## 目录结构

```
food-website/
├── src-images/      # 新图片（临时存放）
├── food-images/     # 原始图片
├── thumbnails/      # 缩略图 (300x300)
├── images.json      # 元数据
└── *.html, *.js, *.css
```

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| 缩略图生成失败 | 安装 Pillow：`pip install Pillow` |
| 推送失败 | 检查网络，重试 `git push` |
