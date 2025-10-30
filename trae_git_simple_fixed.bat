@echo off

REM Trae AI 代码管理工具 - 简化版

echo Trae AI 代码管理工具 (简化版)
echo ------------------------
echo.

if "%1"=="init" goto init
if "%1"=="config" goto config
if "%1"=="remote" goto remote
if "%1"=="push" goto push
if "%1"=="pull" goto pull
if "%1"=="status" goto status
if "%1"=="clone" goto clone

REM 默认显示帮助
echo 使用方法: trae_git_simple_fixed.bat [命令]
echo.
echo 命令列表:
echo   init    - 初始化Git仓库
echo   config  - 配置用户名和邮箱
echo   remote  - 添加远程仓库
echo   push    - 推送代码 (跳过SSL验证)
echo   pull    - 拉取代码
echo   status  - 查看仓库状态
echo   clone   - 克隆仓库
echo.
goto :eof

REM 初始化仓库
:init
echo 正在初始化Git仓库...
git init
git add .
git commit -m "Initial commit"
echo 仓库初始化完成！
goto :eof

REM 配置用户信息
:config
echo 配置Git用户信息
echo 请输入Git用户名: 
set /p username=
echo 请输入Git邮箱: 
set /p email=
git config user.name "%username%"
git config user.email "%email%"
echo 用户信息配置完成！
goto :eof

REM 添加远程仓库
:remote
echo 添加远程仓库
echo 请输入远程仓库URL: 
set /p remote_url=
git remote add origin "%remote_url%"
echo 远程仓库添加完成！
goto :eof

REM 推送代码
:push
echo 推送代码到远程仓库 (跳过SSL验证)...
git -c http.sslVerify=false push -u origin main
goto :eof

REM 拉取代码
:pull
echo 从远程仓库拉取代码...
git pull origin main
goto :eof

REM 查看状态
:status
echo 查看仓库状态...
git status
goto :eof

REM 克隆仓库
:clone
echo 克隆远程仓库
echo 请输入仓库URL: 
set /p repo_url=
echo 请输入目标目录名称 (默认为当前目录): 
set /p dest_dir=
if "%dest_dir%"=="" (
    git clone "%repo_url%" .
) else (
    git clone "%repo_url%" "%dest_dir%"
)
goto :eof