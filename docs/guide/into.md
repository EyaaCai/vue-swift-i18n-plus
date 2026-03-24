# 介绍

现在前端 IDE 里，vscode 占据大半江山（比 sublime 开源，比 atom 更快，比 webstorm 更轻）
[Vue-Swift-I18n-Plus](https://github.com/EyaaCai/vue-swift-i18n-plus) 是基于 VSCode 的 Vue/TS 项目快速国际化增强版插件。

## 它能做什么？

它不仅继承了原版的极速提取功能，还新增了：

- **Vue 3 & TypeScript** 的原生支持。
- **智能配置文件拆分**：自动根据 Key 路径生成 JS/TS 模块文件。
- **配置即时生效**：修改 VSCode 设置后无需重启扩展。

## Features

- [快速更新 JSON](../guide/1-update-i18n.md)
- [智能替换](../guide/2-swift-i18n.md)
- [全面展示](../guide/3-show-i18n.md)
- [拆分 i18n 模块](../guide/5-split-i18n.md)
- [扁平/反扁平 JSON](../guide/4-other.md)
- [代码提示](../guide/4-other.md)

## 什么时候最需要...?

日常开发中，或许和其他类型 vue 国际化表现差别不太明显。但是当一个现有中文项目做国际化时候，它会展现非凡的才能，快到**让人窒息** 😉。

## 是否可以更快...?

理论上当然可以。

现在的实现是打开一个 vue 文件，然后使用命令快速对其进行国际化的操作。更快，只需一个项目所有文件全部执行一遍上面的流程就可以实现。**但是如果那样的话**，就无法保证每个文件国际化的正确与否，那样的快其实是没有意义的。
