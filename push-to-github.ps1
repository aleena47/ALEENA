# PowerShell script to push project to GitHub
# Run this script in PowerShell

Write-Host "====================================="
Write-Host "   Pushing FCP to GitHub"
Write-Host "====================================="
Write-Host ""

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Install Git with default options" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use GitHub Desktop instead:" -ForegroundColor Yellow
    Write-Host "Download from: https://desktop.github.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
Set-Location C:\Users\DELL\Downloads\FCP

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Check if .git exists
if (!(Test-Path .git)) {
    Write-Host "🔧 Initializing git repository..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/aleena47/FCP.git
    Write-Host "✅ Repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
    
    # Check if remote exists
    $remote = git remote get-url origin 2>$null
    if (-not $remote) {
        Write-Host "🔧 Adding remote repository..." -ForegroundColor Yellow
        git remote add origin https://github.com/aleena47/FCP.git
    } else {
        Write-Host "✅ Remote repository already configured: $remote" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📦 Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: AI-powered e-commerce fashion platform"

Write-Host ""
Write-Host "🌿 Setting branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  You may be prompted for credentials:" -ForegroundColor Yellow
Write-Host "   Username: aleena47" -ForegroundColor Yellow
Write-Host "   Password: Use Personal Access Token (not GitHub password)" -ForegroundColor Yellow
Write-Host ""
Write-Host "   To create token: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================="
    Write-Host "   ✅ Successfully pushed!" -ForegroundColor Green
    Write-Host "====================================="
    Write-Host ""
    Write-Host "View your repository at:" -ForegroundColor Cyan
    Write-Host "https://github.com/aleena47/FCP" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Common issues:" -ForegroundColor Red
    Write-Host "1. Authentication failed - Use Personal Access Token" -ForegroundColor Yellow
    Write-Host "2. Repository not found - Check repository exists and you have access" -ForegroundColor Yellow
    Write-Host "3. Network issues - Check internet connection" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "See GITHUB_PUSH_INSTRUCTIONS.md for detailed help" -ForegroundColor Yellow
}

