# Food Diary Website

个人美食日记网站 - 展示每一餐的制作成果

## 项目结构

```
food-website/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # JavaScript逻辑（FoodGallery类）
├── images.json         # 图片元数据
├── generate_thumbnails.py  # 缩略图生成脚本
├── generate_descriptions.py # 描述生成辅助脚本
├── batch_analyze.py    # 批量分析辅助脚本
├── food-images/        # 原始图片目录
└── thumbnails/         # 缩略图目录（300x300）
```

## 功能特性

✅ 响应式网格布局（自动适配移动端）
✅ 缩略图快速加载 + 原图高清查看
✅ 点击放大查看，支持左右切换浏览
✅ 键盘导航（方向键切换、ESC 关闭）
✅ 缩放滑块控制网格大小（50-300px）
✅ 显示拍摄日期和美食描述
✅ 优雅的悬停动画和模态框过渡效果

## 快速开始

### 1. 本地预览

由于浏览器CORS限制，需要通过HTTP服务器运行：

**方案A: 使用Python**
```bash
cd "C:\Users\GF\OneDrive\Obsidian Vault\notes"
python -m http.server 8000
```
然后访问: http://localhost:8000/food-website/

**方案B: 使用VS Code Live Server插件**
- 安装 Live Server 插件
- 右键点击 index.html
- 选择 "Open with Live Server"

**方案C: 使用Node.js**
```bash
npx serve
```

## 开发脚本

### 生成缩略图
```bash
python generate_thumbnails.py
```
功能：
- 从源目录复制原始图片到 `food-images/`
- 生成 300x300 缩略图到 `thumbnails/`
- 跳过已存在的文件，支持增量更新

### 添加新图片的完整流程
```bash
# 1. 将新图片放入源目录，然后运行缩略图生成
python generate_thumbnails.py

# 2. 编辑 images.json，添加新图片信息（按日期倒序排列在最前面）
```

在 `images.json` 中添加图片信息（保持最新图片在最前）：
```json
{
  "filename": "IMG_20260131_123456.jpg",
  "date": "2026-01-31",
  "description": "红烧肉，香而不腻"
}
```

### 批量管理图片描述
```bash
# 查看需要添加描述的图片列表
python batch_analyze.py

# 准备 JSON 结构用于 AI 分析
python generate_descriptions.py
```

### 编辑图片描述
直接编辑 `images.json` 文件，修改对应图片的 `description` 字段。

## 部署方案

### GitHub Pages 部署

1. 创建GitHub仓库
2. 将 `food-website/` 和 `food-images/` 推送到仓库
3. 在仓库设置中启用GitHub Pages
4. 选择根目录作为发布源
5. 配置自定义域名 `food.doubling.cc`

### Netlify 部署（推荐）

1. 将项目推送到GitHub
2. 在Netlify中导入仓库
3. 自动部署完成
4. 配置自定义域名

## 配置说明

### 修改图片源路径
如需更改图片路径，请更新以下文件中的硬编码路径：
- `generate_thumbnails.py` (第 7-10 行)
- `generate_descriptions.py` (第 6-8 行)
- `batch_analyze.py` (第 9-10 行)

### 调整缩略图尺寸
编辑 `generate_thumbnails.py` 中的 `THUMBNAIL_SIZE` 常量（默认 300x300）

### 调整默认网格大小
编辑 `app.js` 中的 `this.imageSize = 150`（默认 150px）

## 优化建议

### 图片优化
- 转换为 WebP 格式减少文件大小（推荐工具：https://squoosh.app/）
- 压缩原图以节省存储空间

### 性能优化
- ✅ 图片懒加载（已实现）
- 🔄 Service Worker 离线缓存
- 🔄 CDN 加速图片加载

### 功能增强
- 搜索功能（按日期/描述筛选）
- 分类标签（早餐/午餐/晚餐）
- AI 自动生成美食描述
- 图片上传自动化流程

## 技术架构

### 双层图片加载策略
- **缩略图**（300x300）：用于网格画廊展示，快速加载
- **原图**：点击放大时才加载，提供高清查看体验
- 浏览器原生懒加载（`loading="lazy"`）优化性能

### 核心组件
- **FoodGallery 类**：管理图片加载、模态框导航、缩放控制
- **CSS Grid 布局**：`auto-fill` + `minmax()` 实现响应式列数
- **CSS 变量缩放**：通过 `--image-size` 变量实时控制网格大小（50-300px）
- **键盘导航**：支持方向键切换图片、ESC 关闭模态框

### 技术栈

- **HTML5** - 页面结构
- **CSS3** - Grid 响应式布局、CSS 变量、动画
- **JavaScript (ES6+)** - 类组件、异步加载、事件处理
- **Pillow (Python)** - 缩略图生成

## 浏览器兼容性

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile: ✅

## 项目状态

- [x] 基础框架搭建
- [x] 图片元数据管理
- [x] 缩略图生成脚本
- [x] 图片懒加载
- [x] 点击放大查看
- [x] 键盘导航
- [x] 响应式设计
- [x] 缩放控制
- [ ] 域名配置
- [ ] 自动部署流程
- [ ] 图片描述完善

## 相关文件

- `../tasks/Food网站建设.md` - 任务跟踪
- `../ideas/food网页.md` - 原始需求
- `../food-images/` - 图片存储

---

**创建时间**: 2026-01-30
**开发者**: AI Assistant
