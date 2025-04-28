# 智配伙伴系统管理前端后台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 项目简介
这是一个用于智能匹配系统的管理前端项目，旨在为管理员提供便捷的用户管理和数据查看功能。本项目提供了直观的界面，方便管理员进行用户管理、数据统计和系统配置等操作。

## 功能特点
- 用户管理：查看、编辑、删除用户信息
- 数据统计：可视化展示系统运营数据
- 系统配置：灵活配置系统参数
- 权限管理：细粒度的权限控制
- 响应式设计：支持多种设备访问

## 技术栈
- Vue.js 3.x
- Vue Router
- Vuex/Pinia
- Element Plus
- Axios
- ECharts
- JavaScript/TypeScript
- SCSS
- Vite

## 系统要求
- Node.js >= 14.0.0
- npm >= 6.0.0

## 安装步骤
1. 克隆仓库:
   ```bash
   git clone https://github.com/nanshuo0814/intelligent-partner-matching-system-admin-frontend.git
   ```
2. 进入项目目录:
   ```bash
   cd intelligent-partner-matching-system-admin-frontend
   ```
3. 安装依赖:
   ```bash
   npm install
   ```
4. 启动开发服务器:
   ```bash
   npm run dev
   ```

## 使用说明
### 开发模式
- 启动开发服务器后，访问 `http://localhost:9528` 即可查看应用
- 修改代码后，开发服务器会自动重新加载页面
- 支持热更新，提高开发效率

### 生产模式
- 构建生产版本:
  ```bash
  npm run build
  ```
- 构建完成后，生成的文件将位于 `dist` 目录中
- 可以使用 `npm run preview` 预览生产构建

## 项目结构
```
intelligent-partner-matching-system-admin-frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/            # API 接口
│   ├── assets/         # 项目资源
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   └── views/          # 页面视图
├── .env                # 环境变量
├── package.json        # 项目依赖
└── vite.config.js      # Vite 配置
```

## 开发规范
- 遵循 Vue.js 官方风格指南
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Git Flow 工作流
- 提交信息遵循 Conventional Commits 规范

## 贡献指南
欢迎贡献代码！请遵循以下步骤：
1. Fork 本仓库
2. 创建一个新的分支:
   ```bash
   git checkout -b feature/new-feature
   ```
3. 提交您的更改:
   ```bash
   git commit -m "feat: add new feature"
   ```
4. 推送到您的分支:
   ```bash
   git push origin feature/new-feature
   ```
5. 提交 Pull Request

## 问题反馈
如果您在使用过程中遇到任何问题，或有任何建议，请通过以下方式联系我们：
- 在 GitHub 上提交 Issue
- 发送邮件至：[nanshuo.icu@qq.com]

## 许可证
本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 作者
- GitHub: [nanshuo0814](https://github.com/nanshuo0814)

## 致谢
感谢所有为本项目做出贡献的开发者们！
