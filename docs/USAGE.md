# OpenClaw Browser 使用指南

**版本：** 0.1.0  
**最后更新：** 2026-03-17

---

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/tonymd323/openclaw-browser.git
cd openclaw-browser

# 安装依赖
npm install

# 全局安装（可选）
npm install -g .
```

### 验证安装

```bash
# 查看帮助
node bin/openclaw-browser --help

# 运行诊断
node bin/openclaw-browser doctor
```

---

## 📋 内置命令

### B 站命令

```bash
# 首页推荐
node bin/openclaw-browser bilibili home --limit 20

# 搜索视频
node bin/openclaw-browser bilibili search "AI 投资" --limit 10

# 视频详情
node bin/openclaw-browser bilibili video BV1xx411c7mD

# 登录（Cookie 注入）
node bin/openclaw-browser login bilibili --cookie "SESSDATA=xxx; bili_jct=yyy"
```

### 小红书命令

```bash
# 探索首页
node bin/openclaw-browser xiaohongshu explore --limit 20

# 搜索笔记
node bin/openclaw-browser xiaohongshu search "股票投资" --limit 10

# 用户主页
node bin/openclaw-browser xiaohongshu user 5f3a8b2c0000000012345678

# 笔记详情
node bin/openclaw-browser xiaohongshu note 5f3a8b2c0000000012345678

# 登录（Cookie 注入）
node bin/openclaw-browser login xiaohongshu --cookie "web_session=xxx"
```

### 配置管理

```bash
# 列出所有配置
node bin/openclaw-browser config list

# 获取配置
node bin/openclaw-browser config get bilibili

# 设置配置
node bin/openclaw-browser config set bilibili "SESSDATA=xxx"
```

### 诊断工具

```bash
# 运行诊断
node bin/openclaw-browser doctor
```

---

## 🔐 登录方式

### 方式一：Cookie 注入（推荐）

**步骤：**

1. **在浏览器登录目标网站**
   - B 站：https://www.bilibili.com
   - 小红书：https://www.xiaohongshu.com

2. **获取 Cookie**
   - 按 F12 打开开发者工具
   - Application → Storage → Cookies
   - 复制需要的 Cookie 值

3. **配置到 CLI**
   ```bash
   # B 站
   node bin/openclaw-browser login bilibili --cookie "SESSDATA=xxx; bili_jct=yyy"
   
   # 小红书
   node bin/openclaw-browser login xiaohongshu --cookie "web_session=xxx"
   ```

4. **验证**
   ```bash
   node bin/openclaw-browser config list
   ```

### 方式二：配置文件

**位置：** `~/.config/openclaw-browser/cookies.json`

**格式：**
```json
{
  "bilibili": "SESSDATA=xxx; bili_jct=yyy",
  "xiaohongshu": "web_session=xxx"
}
```

---

## 📊 输出格式

### JSON 格式

```bash
node bin/openclaw-browser bilibili home --output json --limit 5
```

**输出示例：**
```json
[
  {
    "title": "AI 投资分析",
    "up": "财经老王",
    "play": "12.5 万",
    "duration": "15:30"
  }
]
```

### 表格格式（默认）

```bash
node bin/openclaw-browser bilibili home --output table --limit 5
```

**输出示例：**
```
┌────────────────────────────────────────┬───────────────┬────────────┬──────────┐
│ 标题                                   │ UP 主         │ 播放       │ 时长     │
├────────────────────────────────────────┼───────────────┼────────────┼──────────┤
│ AI 投资分析                            │ 财经老王      │ 12.5 万    │ 15:30    │
└────────────────────────────────────────┴───────────────┴────────────┴──────────┘
```

### Markdown 格式

```bash
node bin/openclaw-browser bilibili home --output markdown --limit 5
```

**输出示例：**
```markdown
| 标题 | UP 主 | 播放 | 时长 |
|------|------|------|------|
| AI 投资分析 | 财经老王 | 12.5 万 | 15:30 |
```

---

## ⚙️ 高级选项

### 调试模式

```bash
# 启用调试输出
node bin/openclaw-browser bilibili home --debug

# 详细输出
node bin/openclaw-browser bilibili home --verbose

# 自定义超时
node bin/openclaw-browser bilibili home --timeout 60000
```

### Cookie 注入

```bash
# 单次使用 Cookie
node bin/openclaw-browser bilibili home --use-cookie

# Cookie 来自配置文件
# 自动从~/.config/openclaw-browser/cookies.json 读取
```

---

## 🛠️ 开发指南

### 添加新适配器

**步骤：**

1. **创建适配器文件**
   ```bash
   src/adapters/newsite.yaml
   ```

2. **定义选择器和命令**
   ```yaml
   name: 新网站
   target: newsite.com
   
   selectors:
     item_list: "div.item"
     title: "h2.title"
   
   commands:
     home:
       url: https://newsite.com/
       actions:
         - type: navigate
         - type: extract
   ```

3. **实现命令**
   ```bash
   src/commands/newsite.js
   ```

4. **注册到 CLI**
   ```javascript
   // bin/openclaw-browser
   program
     .command('newsite')
     .description('新网站命令')
     // ...
   ```

---

## ❓ 常见问题

### Q: LightPanda 未安装？

**A:** 请安装 LightPanda：
```bash
# 参考：https://github.com/lightpanda-io/lightpanda
```

### Q: Cookie 过期？

**A:** 重新登录并更新 Cookie：
```bash
node bin/openclaw-browser login bilibili --cookie "新的 Cookie"
```

### Q: 抓取失败？

**A:** 检查：
1. 网络连接
2. Cookie 是否有效
3. 网站是否反爬虫
4. 增加超时时间：`--timeout 60000`

### Q: 如何贡献？

**A:** 
1. Fork 仓库
2. 创建分支：`git checkout -b feature/xxx`
3. 提交代码：`git commit -m 'feat: xxx'`
4. 推送：`git push origin feature/xxx`
5. 创建 Pull Request

---

## 📝 更新日志

### v0.1.0 (2026-03-17)

**新增：**
- ✅ B 站适配器
- ✅ 小红书适配器
- ✅ Cookie 管理
- ✅ 配置管理
- ✅ 诊断工具
- ✅ 输出格式化

**已知问题：**
- ⚠️ 扫码登录待实现
- ⚠️ AI 发现引擎待开发

---

## 🔗 相关链接

- GitHub: https://github.com/tonymd323/openclaw-browser
- 问题反馈：https://github.com/tonymd323/openclaw-browser/issues
- LightPanda: https://github.com/lightpanda-io/lightpanda

---

_最后更新：2026-03-17 13:30_
