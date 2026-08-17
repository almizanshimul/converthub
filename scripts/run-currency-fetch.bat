@echo off
REM Wrapper invoked by the daily "ConvertHub Currency Rate Refresh" Windows
REM Scheduled Task (see scripts/register-currency-fetch-task.ps1). Not meant
REM to be run by hand — use `npm run currency:fetch` directly for that.
cd /d "D:\code\convert"
echo [%date% %time%] Starting currency rate fetch >> "D:\code\convert\logs\currency-fetch.log"
REM `call` is required — npm.cmd is itself a batch file, and invoking one
REM batch file from another without `call` transfers control permanently
REM instead of returning, silently skipping every line after this one.
call "C:\Program Files\nodejs\npm.cmd" run currency:fetch >> "D:\code\convert\logs\currency-fetch.log" 2>&1
echo [%date% %time%] Exit code %errorlevel% >> "D:\code\convert\logs\currency-fetch.log"
