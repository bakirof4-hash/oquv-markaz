@echo off
echo =========================================
echo IT Academy - APK Build Script
echo =========================================

echo.
echo [1/3] Building React frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Syncing Capacitor with Android project...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error syncing capacitor.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Building Android APK (Debug)...
set JAVA_HOME=%CD%\jdk17\jdk-17.0.10+7
cd android
set GRADLE_OPTS="-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT"
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Error building APK. Please check your internet connection or Gradle settings.
    pause
    exit /b %errorlevel%
)

echo.
echo =========================================
echo BUILD SUCCESSFUL!
echo =========================================
echo You can find your APK file here:
echo %CD%\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
