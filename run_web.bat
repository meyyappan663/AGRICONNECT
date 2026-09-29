@echo off
echo Starting HackDude-Logistics Web Command Center...
cd /d %~dp0web
"C:\Program Files\nodejs\npm.cmd" run dev -- --host
pause
