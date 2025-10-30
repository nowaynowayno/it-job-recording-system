# Trae AI 代码管理工具

这是一套用于简化Git操作的命令行工具，由Trae AI开发，支持代码库的创建、拉取、推送、克隆等常用操作。

## 功能特性

- 仓库初始化 (`init`)
- Git用户配置 (`config`)
- 文件暂存管理 (`add`)
- 代码提交 (`commit`)
- 远程仓库管理 (`remote`)
- 代码推送 (`push`)
- 代码拉取 (`pull`)
- 仓库克隆 (`clone`)
- 状态查看 (`status`)
- 分支管理 (`branch`)

## 支持的系统

- **Windows**: 使用 `trae_git_manager.bat`
- **Linux/Mac**: 使用 `trae_git_manager.sh`

## 使用方法

### Windows系统

1. 确保已安装Git并添加到系统环境变量
2. 打开命令提示符(CMD)或PowerShell
3. 进入包含 `trae_git_manager.bat` 的目录
4. 执行命令：`trae_git_manager.bat [命令]`

### Linux/Mac系统

1. 确保已安装Git
2. 给脚本添加执行权限：`chmod +x trae_git_manager.sh`
3. 执行命令：`./trae_git_manager.sh [命令]`

## 命令详解

### 1. 初始化仓库
```
trae_git_manager.bat init
```
在当前目录初始化Git仓库，并创建初始提交。

### 2. 配置Git用户信息
```
trae_git_manager.bat config
```
配置Git用户名和邮箱，用于提交代码。

### 3. 添加文件到暂存区
```
trae_git_manager.bat add
```
添加文件到Git暂存区，支持通配符。

### 4. 提交更改
```
trae_git_manager.bat commit
```
提交暂存区的更改到本地仓库。

### 5. 添加远程仓库
```
trae_git_manager.bat remote
```
添加远程Git仓库，默认名称为origin。

### 6. 推送代码
```
trae_git_manager.bat push
```
将本地代码推送到远程仓库。工具会自动处理SSL验证问题，提供备选推送方式。

### 7. 拉取代码
```
trae_git_manager.bat pull
```
从远程仓库拉取最新代码。

### 8. 克隆仓库
```
trae_git_manager.bat clone
```
克隆远程Git仓库到本地。

### 9. 查看状态
```
trae_git_manager.bat status
```
显示当前仓库的状态信息。

### 10. 分支管理
```
trae_git_manager.bat branch
```
提供分支查看、创建、切换和删除功能。

### 11. 显示帮助
```
trae_git_manager.bat help
```
显示工具的使用说明。

## 高级特性

### SSL验证问题处理

工具内置了SSL验证问题的处理机制。当普通推送/拉取失败时，会自动尝试使用 `http.sslVerify=false` 参数重新执行操作，解决证书验证问题。

### 用户友好的交互界面

所有操作都提供了交互式提示，用户无需记忆复杂的Git命令参数。

### 错误处理

工具会检查每个Git命令的执行结果，并提供适当的错误提示和备选方案。

## 注意事项

1. 使用前请确保已正确安装Git
2. 对于涉及远程操作的命令，请确保有相应的网络连接和访问权限
3. 在Windows系统中使用PowerShell时，可能需要以管理员身份运行
4. 使用SSL验证禁用模式会降低安全性，请仅在必要时使用

## 示例工作流

### 首次创建并推送项目

1. 创建项目目录并进入
2. 执行 `trae_git_manager.bat init` 初始化仓库
3. 执行 `trae_git_manager.bat config` 配置用户信息
4. 添加项目文件
5. 执行 `trae_git_manager.bat add` 添加文件到暂存区
6. 执行 `trae_git_manager.bat commit` 提交更改
7. 执行 `trae_git_manager.bat remote` 添加远程仓库
8. 执行 `trae_git_manager.bat push` 推送代码到远程仓库

### 克隆现有项目并进行更新

1. 执行 `trae_git_manager.bat clone` 克隆远程仓库
2. 进入项目目录
3. 修改项目文件
4. 执行 `trae_git_manager.bat add` 和 `trae_git_manager.bat commit` 提交更改
5. 执行 `trae_git_manager.bat push` 推送更新

## 故障排除

### 身份验证问题
- 确保已正确配置Git用户信息
- 对于GitHub等平台，可能需要使用访问令牌或SSH密钥进行身份验证
- 当遇到身份验证弹窗时，请按照提示在浏览器中完成登录

### SSL证书问题
- 工具会自动尝试禁用SSL验证的备选方案
- 如仍有问题，请检查系统证书配置或考虑使用SSH协议

### 远程仓库不存在
- 确保远程仓库URL正确
- 确认仓库已在远程服务器上创建
- 检查是否有访问权限

## 许可证

本工具由Trae AI提供，仅供学习和开发使用。

---

**Trae AI - 让代码管理更简单！**