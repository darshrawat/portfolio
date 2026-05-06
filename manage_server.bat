@echo off
:menu
cls
echo ==========================================
echo       DARSH PORTFOLIO SERVER MANAGER
echo ==========================================
echo 1. Check Status
echo 2. View Logs
echo 3. Restart Server
echo 4. Stop Server
echo 5. Start Server
echo 6. Exit
echo ==========================================
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" npx pm2 status & pause & goto menu
if "%choice%"=="2" npx pm2 logs portfolio --lines 20 --no-daemon & pause & goto menu
if "%choice%"=="3" npm run serve:bg & pause & goto menu
if "%choice%"=="4" npm run serve:stop & pause & goto menu
if "%choice%"=="5" npm run serve:bg & pause & goto menu
if "%choice%"=="6" exit

goto menu
