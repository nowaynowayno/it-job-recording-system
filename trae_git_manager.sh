#!/bin/bash

# Trae AI 代码库管理工具
# 功能：实现代码库的创建、拉取、推送、克隆等基本操作

echo "================================"
echo "     Trae AI 代码管理工具     "
echo "================================"

# 颜色定义
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# 显示帮助信息
show_help() {
    echo "使用方法: ./trae_git_manager.sh [命令] [参数]"
    echo ""
    echo "命令列表:"
    echo "  init        - 在当前目录初始化Git仓库"
    echo "  config      - 配置Git用户名和邮箱"
    echo "  add         - 添加文件到暂存区"
    echo "  commit      - 提交更改"
    echo "  remote      - 添加远程仓库"
    echo "  push        - 推送代码到远程仓库"
    echo "  pull        - 从远程仓库拉取代码"
    echo "  clone       - 克隆远程仓库"
    echo "  status      - 显示仓库状态"
    echo "  branch      - 管理分支"
    echo "  help        - 显示此帮助信息"
    echo ""
}

# 初始化Git仓库
init_repo() {
    echo -e "${YELLOW}正在初始化Git仓库...${NC}"
    git init
    git add .
    git commit -m "Initial commit by Trae AI"
    echo -e "${GREEN}仓库初始化完成！${NC}"
}

# 配置Git用户信息
config_user() {
    echo -e "${YELLOW}配置Git用户信息${NC}"
    read -p "请输入Git用户名: " username
    read -p "请输入Git邮箱: " email
    
    git config user.name "$username"
    git config user.email "$email"
    
    echo -e "${GREEN}用户信息配置完成！${NC}"
    git config --list | grep user
}

# 添加远程仓库
add_remote() {
    echo -e "${YELLOW}添加远程仓库${NC}"
    read -p "请输入远程仓库名称 (默认为origin): " remote_name
    remote_name=${remote_name:-origin}
    read -p "请输入远程仓库URL: " remote_url
    
    git remote add $remote_name $remote_url
    echo -e "${GREEN}远程仓库添加完成！${NC}"
    git remote -v
}

# 推送代码
git_push() {
    echo -e "${YELLOW}推送代码到远程仓库${NC}"
    read -p "请输入远程仓库名称 (默认为origin): " remote_name
    remote_name=${remote_name:-origin}
    read -p "请输入分支名称 (默认为main): " branch_name
    branch_name=${branch_name:-main}
    read -p "是否设置上游跟踪? (y/n, 默认n): " set_upstream
    
    if [ "$set_upstream" = "y" ]; then
        git push -u $remote_name $branch_name
    else
        git push $remote_name $branch_name
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}代码推送成功！${NC}"
    else
        echo -e "${RED}代码推送失败！${NC}"
        echo -e "${YELLOW}尝试使用SSL验证禁用模式重新推送...${NC}"
        if [ "$set_upstream" = "y" ]; then
            git -c http.sslVerify=false push -u $remote_name $branch_name
        else
            git -c http.sslVerify=false push $remote_name $branch_name
        fi
    fi
}

# 拉取代码
git_pull() {
    echo -e "${YELLOW}从远程仓库拉取代码${NC}"
    read -p "请输入远程仓库名称 (默认为origin): " remote_name
    remote_name=${remote_name:-origin}
    read -p "请输入分支名称 (默认为main): " branch_name
    branch_name=${branch_name:-main}
    
    git pull $remote_name $branch_name
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}代码拉取成功！${NC}"
    else
        echo -e "${RED}代码拉取失败！${NC}"
        echo -e "${YELLOW}尝试使用SSL验证禁用模式重新拉取...${NC}"
        git -c http.sslVerify=false pull $remote_name $branch_name
    fi
}

# 克隆仓库
git_clone() {
    echo -e "${YELLOW}克隆远程仓库${NC}"
    read -p "请输入远程仓库URL: " repo_url
    read -p "请输入目标目录名称 (默认为仓库名): " target_dir
    
    if [ -z "$target_dir" ]; then
        git clone $repo_url
    else
        git clone $repo_url $target_dir
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}仓库克隆成功！${NC}"
    else
        echo -e "${RED}仓库克隆失败！${NC}"
        echo -e "${YELLOW}尝试使用SSL验证禁用模式重新克隆...${NC}"
        if [ -z "$target_dir" ]; then
            git -c http.sslVerify=false clone $repo_url
        else
            git -c http.sslVerify=false clone $repo_url $target_dir
        fi
    fi
}

# 显示仓库状态
git_status() {
    echo -e "${YELLOW}显示仓库状态${NC}"
    git status
}

# 分支管理
git_branch() {
    echo -e "${YELLOW}分支管理${NC}"
    echo "1. 查看所有分支"
    echo "2. 创建新分支"
    echo "3. 切换分支"
    echo "4. 删除分支"
    read -p "请选择操作 (1-4): " branch_op
    
    case $branch_op in
        1)
            git branch -a
            ;;
        2)
            read -p "请输入新分支名称: " new_branch
            git branch $new_branch
            echo -e "${GREEN}分支 $new_branch 创建成功！${NC}"
            ;;
        3)
            read -p "请输入要切换的分支名称: " switch_branch
            git checkout $switch_branch
            ;;
        4)
            read -p "请输入要删除的分支名称: " delete_branch
            read -p "确认删除分支 $delete_branch? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                git branch -d $delete_branch
            fi
            ;;
        *)
            echo -e "${RED}无效的选择！${NC}"
            ;;
    esac
}

# 添加文件到暂存区
git_add() {
    echo -e "${YELLOW}添加文件到暂存区${NC}"
    read -p "请输入要添加的文件 (支持通配符, 默认为 .): " files
    files=${files:-.}
    git add $files
    echo -e "${GREEN}文件添加完成！${NC}"
}

# 提交更改
git_commit() {
    echo -e "${YELLOW}提交更改${NC}"
    read -p "请输入提交信息: " commit_msg
    git commit -m "$commit_msg"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}提交成功！${NC}"
    else
        echo -e "${RED}提交失败！${NC}"
    fi
}

# 主程序
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

command=$1

case $command in
    init)
        init_repo
        ;;
    config)
        config_user
        ;;
    add)
        git_add
        ;;
    commit)
        git_commit
        ;;
    remote)
        add_remote
        ;;
    push)
        git_push
        ;;
    pull)
        git_pull
        ;;
    clone)
        git_clone
        ;;
    status)
        git_status
        ;;
    branch)
        git_branch
        ;;
    help)
        show_help
        ;;
    *)
        echo -e "${RED}未知命令: $command${NC}"
        show_help
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}操作完成！${NC}"