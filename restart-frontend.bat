@echo off
echo ========================================
echo  FIXING PRODUCT LOADING ISSUE
echo ========================================
echo.

echo Step 1: Stopping frontend server...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing npm cache...
cd frontend
call npm cache clean --force

echo Step 3: Reinstalling dependencies...
call npm install

echo Step 4: Starting frontend server...
echo.
echo ========================================
echo  Frontend server starting...
echo  Open http://localhost:3000 in browser
echo ========================================
echo.
call npm start
