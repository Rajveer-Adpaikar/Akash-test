@echo off
echo Killing any Vite dev server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 :5174" ^| findstr LISTENING') do (
  taskkill /f /pid %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo.
echo Starting Vite dev server...
cd /d "%~dp0"
start cmd /k "npm run dev"
echo.
echo Server starting at http://localhost:5173/akash-the-band/
