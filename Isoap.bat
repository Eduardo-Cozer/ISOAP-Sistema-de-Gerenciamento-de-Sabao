@echo off
cd "C:\CIENCIA DA COMPUTACAO\Projetos\isoap"

start /B npm start

timeout /t 1

start "" http://localhost:8080

:WAITLOOP
timeout /t 5 >nul

tasklist | findstr /i "firefox.exe"
if %errorlevel% equ 0 (
    goto WAITLOOP
) else (
    taskkill /f /im node.exe
    taskkill /f /im cmd.exe
)



