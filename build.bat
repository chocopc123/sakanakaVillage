@echo off
chcp 65001 > nul
echo.
echo ========================================
echo    HTML Build Script
echo ========================================
echo.

REM Pythonスクリプトを実行
python build.py

if %errorlevel% neq 0 (
    echo.
    echo ❌ エラーが発生しました
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
pause
