@echo off
echo ====================================
echo Starting PDF RAG Backend Server
echo ====================================

cd /d "C:\Work\AIE_Course\The-AI-Engineer-Challenge"
set PYTHONPATH=C:\Work\AIE_Course\The-AI-Engineer-Challenge;%PYTHONPATH%

echo Python path set to include aimakerspace module
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

python run_backend.py

pause