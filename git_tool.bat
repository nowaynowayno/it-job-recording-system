@echo off

REM Simple Git Management Tool

echo Simple Git Management Tool
echo ------------------------
echo.

if "%1"=="init" goto init
if "%1"=="config" goto config
if "%1"=="remote" goto remote
if "%1"=="push" goto push
if "%1"=="pull" goto pull
if "%1"=="status" goto status
if "%1"=="clone" goto clone

REM Show help
echo Usage: git_tool.bat [command]
echo.
echo Commands:
echo   init    - Initialize Git repository
echo   config  - Configure username and email
echo   remote  - Add remote repository
echo   push    - Push code (skip SSL verification)
echo   pull    - Pull code
echo   status  - Check repository status
echo   clone   - Clone repository
echo.
goto :eof

REM Initialize repository
:init
echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit"
echo Repository initialized!
goto :eof

REM Configure user info
:config
echo Configure Git user info
echo Enter Git username: 
set /p username=
echo Enter Git email: 
set /p email=
git config user.name "%username%"
git config user.email "%email%"
echo User info configured!
goto :eof

REM Add remote repository
:remote
echo Add remote repository
echo Enter remote repository URL: 
set /p remote_url=
git remote add origin "%remote_url%"
echo Remote repository added!
goto :eof

REM Push code
:push
echo Pushing code to remote repository (skip SSL verification)...
git -c http.sslVerify=false push -u origin main
goto :eof

REM Pull code
:pull
echo Pulling code from remote repository...
git pull origin main
goto :eof

REM Check status
:status
echo Checking repository status...
git status
goto :eof

REM Clone repository
:clone
echo Clone remote repository
echo Enter repository URL: 
set /p repo_url=
echo Enter destination directory (default: current directory): 
set /p dest_dir=
if "%dest_dir%"=="" (
    git clone "%repo_url%" .
) else (
    git clone "%repo_url%" "%dest_dir%"
)
goto :eof