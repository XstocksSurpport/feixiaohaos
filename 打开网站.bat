@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在启动本地网站...
echo.

set PORT=8765

where python >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%/"
  python -m http.server %PORT%
  goto :end
)

where py >nul 2>&1
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%/"
  py -m http.server %PORT%
  goto :end
)

echo 未检测到 Python，改用浏览器直接打开页面...
start "" "%~dp0index.html"
timeout /t 3 >nul

:end
