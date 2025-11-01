# Bob Monkey

[![repo:github](https://img.shields.io/badge/repo-github-0EA5E9)](https://github.com/yunsii/bob-monkey) [![version](https://img.shields.io/github/v/release/yunsii/bob-monkey?label=version&sort=semver&color=0EA5E9)](https://github.com/yunsii/bob-monkey/releases/latest) [![license](https://img.shields.io/github/license/yunsii/bob-monkey?color=0EA5E9)](https://github.com/yunsii/bob-monkey/blob/master/LICENSE) [![greasyfork](https://img.shields.io/badge/greasyfork-install-0EA5E9)](https://greasyfork.org/zh-CN/scripts/550210)

用户脚本自用版

## 🚀 功能概览

Bob Monkey 是一个增强 GitHub 和 DeepWiki 使用体验的用户脚本集合。主要提供以下功能：

- **DeepWiki 页面访问历史**：记录和管理访问过的仓库页面
- **DeepWiki 问题历史助手**：记录和重用提问历史，提升问答效率
- **GitHub 一键跳转**：从 GitHub 仓库页面快速跳转到 DeepWiki

## ✨ 功能特性

### 🧠 DeepWiki 增强功能

#### 📚 页面访问历史记录管理

- **自动记录访问历史**：自动记录在 DeepWiki 上访问的仓库页面（`/owner/repo` 格式）
- **智能历史面板**：提供美观的历史记录弹窗，支持实时搜索和筛选
- **便捷管理**：支持删除单个历史记录，自动限制最多保存 50 条记录
- **快速访问**：在页面顶部添加历史记录按钮，一键打开历史面板

#### 💬 问题历史记录助手

- **智能问题记录**：自动记录每个仓库页面的提问历史，按页面独立管理
- **上次提问按钮**：在输入框旁边添加"上次提问"按钮，一键重新提问
- **问题历史预览**：鼠标悬停显示历史问题列表，快速选择之前的问题
- **自动保存机制**：回车或 Ctrl+回车 提交问题时自动保存到历史记录
- **存储优化**：每个页面最多保存 5 条问题历史，自动清理旧记录

### 🔗 GitHub 集成功能

#### 🚀 快速跳转 DeepWiki

- **一键跳转**：在 GitHub 仓库页面添加精美的 DeepWiki 快捷按钮
- **无缝体验**：点击按钮直接在新标签页打开对应的 DeepWiki 页面
- **视觉优化**：采用渐变色设计和图标，与 GitHub 界面完美融合
- **智能定位**：按钮自动定位在导航面包屑附近，使用便捷

### 🎯 适用网站

- **DeepWiki**: `https://deepwiki.com/*`
  - 页面访问历史记录管理功能
  - 问题历史记录助手功能
- **GitHub**: `https://github.com/*/*` - DeepWiki 快捷跳转功能
