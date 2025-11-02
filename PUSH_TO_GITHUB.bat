@echo off
echo =====================================
echo   Pushing FCP Project to GitHub
echo =====================================
echo.

cd /d "%~dp0"

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Install with default options
    echo 3. Restart this command prompt
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git is installed - OK
echo.

REM Initialize git if needed
if not exist .git (
    echo Initializing git repository...
    git init
    git remote add origin https://github.com/aleena47/FCP.git
    echo Repository initialized
) else (
    echo Git repository already exists
    git remote set-url origin https://github.com/aleena47/FCP.git
)

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit: AI-powered e-commerce fashion platform"

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
echo NOTE: You may be prompted for credentials:
echo       Username: aleena47
echo       Password: Use Personal Access Token (not GitHub password)
echo       Create token at: https://github.com/settings/tokens
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed. Common issues:
    echo 1. Authentication failed - Use Personal Access Token
    echo 2. Network issues - Check internet connection
    echo.
    pause
) else (
    echo.
    echo =====================================
    echo   SUCCESS! Project pushed to GitHub
    echo =====================================
    echo.
    echo View your repository at:
    echo https://github.com/aleena47/FCP
    echo.
)

pause

