#!/bin/bash
cd "$(dirname "$0")"

echo "=== HK Textbook Marketplace ==="

echo "[1/2] Starting backend..."
cd backend
pip install -r requirements.txt -q 2>/dev/null
python seed_data.py 2>/dev/null
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "[2/2] Starting frontend..."
cd frontend
npm install --silent 2>/dev/null
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
