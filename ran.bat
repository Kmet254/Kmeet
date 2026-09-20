@echo off
set "PATH=%~dp0;C:\Windows\System32;%PATH%"

echo Installing dependencies...
call npm install
echo.
echo Starting Server...
node server.js
pause