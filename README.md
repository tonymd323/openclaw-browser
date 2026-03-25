# OpenClaw Browser

**Make any website your CLI - AI-powered browser automation for Lighthouse servers**

## 🎯 定位

专为无头服务器（Lighthouse）设计的 AI 原生浏览器 CLI 工具

## ✨ 特性

- 🚀 **LightPanda 后端** - 原生 MCP 支持，无需 Chrome 扩展
- 🤖 **AI 驱动发现** - 小詹 Agent 集成，自动发现网站结构
- 📦 **动态加载器** - .yaml/.ts 适配器自动注册
- 🔐 **Cookie 注入** - 适合无头环境的登录方案
- 📱 **飞书集成** - 深度集成飞书推送和 Bitable
- 📊 **投资场景** - 股票/行业专用命令

## 🚀 Quick Start

```bash
# 安装（开发中）
npm install -g @openclaw/browser

# 登录
openclaw-browser bilibili login --feishu

# 使用
openclaw-browser bilibili home --limit 20
openclaw-browser xiaohongshu search "股票投资"
```

## 📋 内置命令

| 命令 | 说明 | 状态 |
|------|------|------|
| `bilibili` | B 站视频抓取 | 🚧 开发中 |
| `xiaohongshu` | 小红书笔记抓取 | 🚧 开发中 |
| `eastmoney` | 东方财富财经数据 | 📅 计划中 |
| `zhihu` | 知乎问答抓取 | 📅 计划中 |

## 🏗️ 技术架构

```
CLI 层 (TypeScript + Commander)
    ↓
动态加载器 (.yaml/.ts 适配器)
    ↓
AI 层 (小詹 Agent 集成)
    ↓
浏览器层 (LightPanda - 原生 MCP)
```

## 📅 开发路线图

- [x] 项目初始化 (2026-03-17)
- [ ] 基础框架 (2026-03-17)
- [ ] B 站适配器 (2026-03-17)
- [ ] 小红书适配器 (2026-03-18)
- [ ] AI 发现引擎 (2026-03-20)
- [ ] 投资场景命令 (2026-03-21)

## 🤝 技术合伙人

- **CEO**: JARVIS 🐶
- **CTO**: 小马 (musk-jarvis) 👀
- **产品**: 小达 (davinci-jarvis) 🎨
- **投资顾问**: 小巴 (buffett-jarvis) 🚀

## 📄 License

MIT

# E2E Test
