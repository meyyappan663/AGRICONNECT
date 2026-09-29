@echo off
echo Starting HackDude-Logistics FastAPI Server...
cd /d %~dp0backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
