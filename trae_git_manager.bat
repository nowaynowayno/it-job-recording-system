@echo off

:: Trae AI 代码库管理工具 - Windows 批处理版本
:: 功能：实现代码库的创建、拉取、推送、克隆等基本操作

echo =================================
echo      Trae AI 代码管理工具      
echo =================================
echo.

:: 显示帮助信息
:show_help
echo 使用方法: trae_git_manager.bat [命令] [参数]
echo.
echo 命令列表:
echo   init        - 在当前目录初始化Git仓库
echo   config      - 配置Git用户名和邮箱
echo   add         - 添加文件到暂存区
echo   commit      - 提交更改
echo   remote      - 添加远程仓库
echo   push        - 推送代码到远程仓库
echo   pull        - 从远程仓库拉取代码
echo   clone       - 克隆远程仓库
echo   status      - 显示仓库状态
echo   branch      - 管理分支
echo   help        - 显示此帮助信息
echo.
goto :eof

:: 初始化Git仓库
:init_repo
echo 正在初始化Git仓库...
git init
git add .
git commit -m "Initial commit by Trae AI"
echo 仓库初始化完成！
goto :eof

:: 配置Git用户信息
:config_user
echo 配置Git用户信息
echo 请输入Git用户名: 
set /p username=
echo 请输入Git邮箱: 
set /p email=

git config user.name "%username%"
git config user.email "%email%"

echo 用户信息配置完成！
git config --list | findstr user
goto :eof

:: 添加远程仓库
:add_remote
echo 添加远程仓库
echo 请输入远程仓库名称 (默认为origin): 
set /p remote_name=
if "%remote_name%"=="" set remote_name=origin

echo 请输入远程仓库URL: 
set /p remote_url=

git remote add %remote_name% %remote_url%
echo 远程仓库添加完成！
git remote -v
goto :eof

:: 推送代码
:git_push
echo 推送代码到远程仓库
echo 请输入远程仓库名称 (默认为origin): 
set /p remote_name=
if "%remote_name%"=="" set remote_name=origin

echo 请输入分支名称 (默认为main): 
set /p branch_name=
if "%branch_name%"=="" set branch_name=main

echo 是否设置上游跟踪? (y/n, 默认n): 
set /p set_upstream=

if /i "%set_upstream%"=="y" (
    git push -u %remote_name% %branch_name%
) else (
    git push %remote_name% %branch_name%
)

if %errorlevel% equ 0 (
    echo 代码推送成功！
) else (
    echo 代码推送失败！
    echo 尝试使用SSL验证禁用模式重新推送...
    if /i "%set_upstream%"=="y" (
        git -c http.sslVerify=false push -u %remote_name% %branch_name%
    ) else (
        git -c http.sslVerify=false push %remote_name% %branch_name%
    )
)
goto :eof

:: 拉取代码
:git_pull
echo 从远程仓库拉取代码
echo 请输入远程仓库名称 (默认为origin): 
set /p remote_name=
if "%remote_name%"=="" set remote_name=origin

echo 请输入分支名称 (默认为main): 
set /p branch_name=
if "%branch_name%"=="" set branch_name=main

git pull %remote_name% %branch_name%

if %errorlevel% equ 0 (
    echo 代码拉取成功！
) else (
    echo 代码拉取失败！
    echo 尝试使用SSL验证禁用模式重新拉取...
    git -c http.sslVerify=false pull %remote_name% %branch_name%
)
goto :eof

:: 克隆仓库
:git_clone
echo 克隆远程仓库
echo 请输入远程仓库URL: 
set /p repo_url=

echo 请输入目标目录名称 (默认为仓库名, 直接回车使用默认): 
set /p target_dir=

if "%target_dir%"=="" (
    git clone %repo_url%
) else (
    git clone %repo_url% %target_dir%
)

if %errorlevel% equ 0 (
    echo 仓库克隆成功！
) else (
    echo 仓库克隆失败！
    echo 尝试使用SSL验证禁用模式重新克隆...
    if "%target_dir%"=="" (
        git -c http.sslVerify=false clone %repo_url%
    ) else (
        git -c http.sslVerify=false clone %repo_url% %target_dir%
    )
)
goto :eof

:: 显示仓库状态
:git_status
echo 显示仓库状态
git status
goto :eof

:: 分支管理
:git_branch
echo 分支管理
echo 1. 查看所有分支
echo 2. 创建新分支
echo 3. 切换分支
echo 4. 删除分支
echo 请选择操作 (1-4): 
set /p branch_op=

if "%branch_op%"=="1" (
    git branch -a
) else if "%branch_op%"=="2" (
    echo 请输入新分支名称: 
    set /p new_branch=
    git branch %new_branch%
    echo 分支 %new_branch% 创建成功！
) else if "%branch_op%"=="3" (
    echo 请输入要切换的分支名称: 
    set /p switch_branch=
    git checkout %switch_branch%
) else if "%branch_op%"=="4" (
    echo 请输入要删除的分支名称: 
    set /p delete_branch=
    echo 确认删除分支 %delete_branch%? (y/n): 
    set /p confirm=
    if /i "%confirm%"=="y" (
        git branch -d %delete_branch%
    )
) else (
    echo 无效的选择！
)
goto :eof

:: 添加文件到暂存区
:git_add
echo 添加文件到暂存区
echo 请输入要添加的文件 (支持通配符, 默认为 .): 
set /p files=
if "%files%"=="" set files=.
git add %files%
echo 文件添加完成！
goto :eof

:: 提交更改
:git_commit
echo 提交更改
echo 请输入提交信息: 
set /p commit_msg=
git commit -m "%commit_msg%"

if %errorlevel% equ 0 (
    echo 提交成功！
) else (
    echo 提交失败！
)
goto :eof

:: 主程序
if [%1]==[] (
    call :show_help
    exit /b 0
)

set command=%1

if /i "%command%"=="init" (
    call :init_repo
) else if /i "%command%"=="config" (
    call :config_user
) else if /i "%command%"=="add" (
    call :git_add
) else if /i "%command%"=="commit" (
    call :git_commit
) else if /i "%command%"=="remote" (
    call :add_remote
) else if /i "%command%"=="push" (
    call :git_push
) else if /i "%command%"=="pull" (
    call :git_pull
) else if /i "%command%"=="clone" (
    call :git_clone
) else if /i "%command%"=="status" (
    call :git_status
) else if /i "%command%"=="branch" (
    call :git_branch
) else if /i "%command%"=="help" (
    call :show_help
) else (
    echo 未知命令: %command%
    call :show_help
    exit /b 1
)

echo.
echo 操作完成！
exit /b 0