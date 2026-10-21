# 鸽子饲养 App 前端

这是一个基于 UniApp 和 Vue 3 的鸽舍管理移动端前端，面向鸽舍、鸽笼和繁育记录的日常管理。项目将蓝牙手环和 RFID/NFC 标签接入移动端工作流，用于减少人工录入和现场操作成本。

## 功能概览

- 蓝牙手环扫描、连接、状态显示和自动重连
- RFID/NFC 标签读取，以及标签与鸽笼绑定
- 鸽棚、鸽笼和操作顺序管理
- 抽蛋、照蛋、加仔、补笼和种鸽淘汰等繁育流程
- 异常登记、连续异常种鸽提示和数据报表
- Pinia 状态管理和本地状态持久化

## 技术栈

- [UniApp](https://uniapp.dcloud.net.cn/)
- Vue 3
- Pinia
- HBuilderX
- Android App Plus 原生能力（蓝牙及项目配套硬件插件）

## 开始使用

### 环境要求

- HBuilderX（建议使用当前项目兼容的稳定版本）
- Android 手机或 Android 模拟器
- 测试蓝牙手环和 RFID/NFC 设备时，需要真实硬件及相应权限
- 可访问项目后端服务的网络环境

### 导入和运行

1. 将仓库导入 HBuilderX。
2. 在项目依赖目录执行 `npm install`，或按 HBuilderX 的依赖提示安装依赖。
3. 在 `App.vue` 的 `globalData.url` 中配置可访问的后端 API 地址。
4. 使用 HBuilderX 的“运行 → 运行到手机或模拟器 → 运行到 Android APP 基座”进行调试。
5. 发布时使用“发行 → 云打包”，并根据设备环境检查蓝牙、NFC 和网络权限。

> 蓝牙、RFID/NFC 和部分 `uni_modules` 能力依赖 Android 原生环境；H5 浏览器或没有配套硬件时，相关功能无法完整验证。

## 目录说明

```text
pages/       业务页面
components/  可复用组件
stores/      Pinia 状态模块
uni_modules/ UniApp 插件及项目依赖模块
static/      图片、音频等静态资源
utils/       工具函数
manifest.json 应用及 Android 权限配置
```

## 后端和配置

本仓库是移动端前端，登录、鸽舍数据、繁育记录和报表等功能需要配套后端服务。请在本地开发配置中填写后端地址，不要将访问令牌、密码或个人数据提交到仓库。

## 开发和贡献

欢迎通过 GitHub Issues 报告问题或提出功能建议，也欢迎提交 Pull Request。提交前请说明：

- 修改涉及的页面、组件或状态模块
- 是否在 Android 真机上验证
- 蓝牙/RFID/NFC 相关改动使用的设备和验证结果
- 是否涉及后端接口或数据结构变化

详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 项目状态

项目处于持续维护和硬件联调阶段。自动化测试覆盖仍在完善，涉及真实设备的功能应在 Android 真机上进行回归验证。

## 许可证

本项目自有代码采用 [MIT License](LICENSE) 发布。`uni_modules` 中的第三方模块可能附带独立的许可证或版权声明，使用时请同时遵守其各自的许可条款。

## 维护者

- GitHub: [@zjea](https://github.com/zjea)
- Repository: [pigeon-shouhuan-front](https://github.com/zjea/pigeon-shouhuan-front)
