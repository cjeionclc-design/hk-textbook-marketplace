@echo off
echo === HK Textbook Marketplace ===
echo.

echo [Backend] http://localhost:8000
start "Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt -q && python seed_data.py && uvicorn app.main:app --reload --port 8000"

echo [Frontend] http://localhost:5173
start "Frontend" cmd /k "cd /d %~dp0frontend && npm install --silent && npx vite --host 0.0.0.0 --port 5173"

echo.
echo Both servers starting... Open http://localhost:5173
