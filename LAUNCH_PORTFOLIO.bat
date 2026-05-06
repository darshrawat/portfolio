@echo off
title DARSH PORTFOLIO - CORE_V9_RESTORED
set PORT=3003

echo ========================================================
echo       ALCHE STUDIO PORTFOLIO - EMERGENCY RECOVERY
echo ========================================================
echo.
echo [STATUS] Initializing system...
echo [STATUS] Target Port: %PORT%
echo.

:: Start the dev server
start /b npm run dev
echo [INFO] Waiting for engine initialization...
timeout /t 5 /nobreak > nul

echo [INFO] Opening cinematic experience...
start "" "http://localhost:%PORT%"

echo.
echo ========================================================
echo   SERVER ACTIVE. KEEP THIS WINDOW MINIMIZED.
echo   REFRESH BROWSER TO SEE LIVE UPDATES.
echo ========================================================
pause
