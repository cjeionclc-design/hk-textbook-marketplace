@echo off
cd /d %~dp0

echo Starting servers...

start /b "" cmd /c "cd /d %~dp0backend && uvicorn app.main:app --port 8000 > nul 2>&1"
start /b "" cmd /c "cd /d %~dp0frontend && npx vite --host 0.0.0.0 --port 5173 > nul 2>&1"

timeout /t 3 /nobreak > nul
start "" http://localhost:5173
