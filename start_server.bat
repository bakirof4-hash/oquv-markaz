@echo off
echo ===================================================
echo     Starting IT Academy Fullstack Server
echo ===================================================
echo.
echo [1/2] Building Frontend static files...
cd /d "%~dp0Hitler\frontend"
call npm run build
echo.
echo [2/2] Launching Server at http://127.0.0.1:8000 ...
cd /d "%~dp0Hitler\Backend"
python manage.py runserver 0.0.0.0:8000
pause
