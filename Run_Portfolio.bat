@echo off
title Portfolio Launcher
echo ==========================================
echo       DARSH PORTFOLIO LAUNCHER
echo ==========================================
echo.
echo 1. Starting the development server...
echo 2. Opening your website in the browser...
echo.
echo [NOTE: Keep this window open while you browse]
echo ==========================================
echo.

:: Open the browser immediately
start "" "http://localhost:3000"

:: Start the dev server
npm run dev
