# Vue Swift i18n Plus

## 🚀 简介 / Introduction

`Vue Swift i18n Plus` 是一款专为 Vue 和 Javascript/TypeScript 开发者设计的国际化自动化利器。它是基于开源项目 `vue-swift-i18n` 的深度增强版，旨在彻底解决手动维护国际化字典的繁琐工作。

---

## 🔥 核心增强功能 / Key Features

1. **支持 Vue3 和 TypeScript(Vue 3 and TypeScript)**: 支持 TypeScript 与 Vue 3 script setup 国际化方案。
2. **多模块拆分逻辑 (Split & Append Logic)**:
   - 支持将庞大的扁平字典自动按照 `key` 路径拆分为目录式的子文件（例如：`views/account.ts`）。
   - 当目标文件已存在时，自动识别差异，仅在对象末尾追加新增的 Key，且**保留原文件中的代码注释和代码格式**。
3. **实时配置生效**: 无需重启扩展，修改插件配置后即可立即应用于编辑器环境。

---

## 🛠️ 快速开始 / Quick Start

1. 安装 `Vue Swift i18n Plus` 扩展。
2. 根据需要配置 `vueSwiftI18nPlus.defaultLocalesPath`。
3. 在代码中使用 `Ctrl+Alt+U` (Windows) 或 `Ctrl+Cmd+U` (Mac) 提取汉字。
4. 使用 `Ctrl+Alt+I` 执行快速替换。

---

## 📜 许可证 & 致敬 / License & Credits

- 本插件继承并遵循 **MIT License**。
- **致敬**: 感谢原作者 [RichieChoo](https://github.com/RichieChoo) 开发的基础版本 `vue-swift-i18n`。本版本在此基础上进行了逻辑重构与功能增强，以满足更复杂的生产环境需求。

---

## 💎 赞赏与反馈 / Appreciation & Feedback

如果您觉得由于本插件的帮助提高了您的效率，欢迎 Star 支持。
