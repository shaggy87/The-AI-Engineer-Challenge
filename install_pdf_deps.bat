@echo off
echo ====================================
echo PDF RAG Dependencies Installation
echo ====================================
echo.

echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing pdfplumber...
pip install pdfplumber

echo.
echo Installing numpy...
pip install numpy

echo.
echo Installing python-multipart...
pip install python-multipart

echo.
echo ====================================
echo Testing installations...
echo ====================================

python -c "import pdfplumber; print('✅ pdfplumber - OK')" 2>nul || echo "❌ pdfplumber - FAILED"
python -c "import numpy; print('✅ numpy - OK')" 2>nul || echo "❌ numpy - FAILED"
python -c "import multipart; print('✅ python-multipart - OK')" 2>nul || echo "❌ python-multipart - FAILED"

echo.
echo ====================================
echo Installation complete!
echo ====================================
echo.
echo Next steps:
echo 1. Start backend: cd api && python app.py
echo 2. Start frontend: cd frontend && npm run dev
echo 3. Upload PDFs and chat!
echo.
pause