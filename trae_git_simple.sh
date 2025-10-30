#!/bin/bash

# Trae AI 代码管理工具 - 简化版

echo "Trae AI 代码管理工具 (简化版)"
echo "------------------------"
echo

# 检查命令参数
if [ "$1" == "init" ]; then
    echo "正在初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "仓库初始化完成！"
elif [ "$1" == "config" ]; then
    echo "配置Git用户信息"
    read -p "请输入Git用户名: " username
    read -p "请输入Git邮箱: " email
    git config user.name "$username"
    git config user.email "$email"
    echo "用户信息配置完成！"
elif [ "$1" == "remote" ]; then
    echo "添加远程仓库"
    read -p "请输入远程仓库URL: " remote_url
    git remote add origin "$remote_url"
    echo "远程仓库添加完成！"
elif [ "$1" == "push" ]; then
    echo "推送代码到远程仓库 (跳过SSL验证)..."
    git -c http.sslVerify=false push -u origin main
elif [ "$1" == "pull" ]; then
    echo "从远程仓库拉取代码..."
    git pull origin main
elif [ "$1" == "status" ]; then
    echo "查看仓库状态..."
    git status
elif [ "$1" == "clone" ]; then
    echo "克隆远程仓库"
    read -p "请输入仓库URL: " repo_url
    read -p "请输入目标目录名称 (默认为当前目录): " dest_dir
    if [ -z "$dest_dir" ]; then
        git clone "$repo_url" .
    else
        git clone "$repo_url" "$dest_dir"
    fi
else
    # 默认显示帮助
    echo "使用方法: ./trae_git_simple.sh [命令]"
    echo
    echo "命令列表:"
    echo "  init    - 初始化Git仓库"
    echo "  config  - 配置用户名和邮箱"
    echo "  remote  - 添加远程仓库"
    echo "  push    - 推送代码 (跳过SSL验证)"
    echo "  pull    - 拉取代码"
    echo "  status  - 查看仓库状态"
    echo "  clone   - 克隆仓库"
    echo
fi

exit 0