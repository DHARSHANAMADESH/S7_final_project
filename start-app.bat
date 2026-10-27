@echo off
title Starting AI Recommendation Platform...
echo ========================================================
echo Starting Backend API Server (Port 5000) ^& Frontend (Port 5173)...
echo ========================================================
start "Backend Server (Port 5000)" cmd /k "npm run server"
start "Frontend Vite (Port 5173)" cmd /k "npm run dev"
echo Servers are launching in separate windows.
echo Opening browser to http://localhost:5173 ...
timeout /t 3 /nobreak >nul
start http://localhost:5173
