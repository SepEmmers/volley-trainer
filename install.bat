@echo off
setlocal enabledelayedexpansion
title Volley Trainer - USB APK Installer

echo ========================================================
echo   🏐 VOLLEY TRAINER - AUTOMATIC USB PHONE INSTALLER
echo ========================================================
echo.

rem Define paths
set "ADB_PATH=C:\Users\seppi\AppData\Local\Android\Sdk\platform-tools\adb.exe"
if not exist "%ADB_PATH%" (
    set "ADB_PATH=adb"
)

set "APK_PATH=%~dp0VolleyTrainer.apk"

if not exist "%APK_PATH%" (
    echo [ERROR] VolleyTrainer.apk not found at:
    echo        %APK_PATH%
    echo.
    echo Please make sure VolleyTrainer.apk is built in this directory.
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking for connected USB Android devices...
"%ADB_PATH%" devices > temp_devices.txt
type temp_devices.txt

findstr /v "List of devices attached" temp_devices.txt | findstr /v "^$" > temp_connected.txt
set /p CONNECTED=<temp_connected.txt
del temp_devices.txt temp_connected.txt >nul 2>&1

if "%CONNECTED%"=="" (
    echo.
    echo --------------------------------------------------------
    echo [WARNING] No Android phone detected via USB!
    echo --------------------------------------------------------
    echo Please follow these steps on your phone:
    echo  1. Connect your phone to your PC via USB cable.
    echo  2. Open Settings -^> About Phone -^> Tap 'Build Number' 7 times.
    echo  3. Open Settings -^> Developer Options -^> Enable 'USB Debugging'.
    echo  4. Unlock your phone and accept the 'Allow USB Debugging' prompt.
    echo --------------------------------------------------------
    echo.
    echo Press any key to retry after connecting your phone...
    pause >nul
    echo Retrying...
    goto retry_check
)

:retry_check
echo.
echo [2/3] Installing VolleyTrainer.apk to connected phone...
echo        Target APK: %APK_PATH%
echo.

"%ADB_PATH%" install -r -d "%APK_PATH%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] APK Installation failed!
    echo Check if USB debugging is allowed on your phone screen.
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Installation SUCCESSFUL! Launching app on phone...
"%ADB_PATH%" shell am start -n com.volleytrainer.app/.MainActivity

echo.
echo ========================================================
echo  ✅ Volley Trainer is now installed and running on phone!
echo ========================================================
echo.
pause
