#!/bin/bash

echo "===================================="
echo "PDF RAG Dependencies Installation"
echo "===================================="
echo

echo "Upgrading pip..."
python3 -m pip install --upgrade pip

echo
echo "Installing pdfplumber..."
pip3 install pdfplumber

echo
echo "Installing numpy..."
pip3 install numpy

echo
echo "Installing python-multipart..."
pip3 install python-multipart

echo
echo "===================================="
echo "Testing installations..."
echo "===================================="

python3 -c "import pdfplumber; print('✅ pdfplumber - OK')" 2>/dev/null || echo "❌ pdfplumber - FAILED"
python3 -c "import numpy; print('✅ numpy - OK')" 2>/dev/null || echo "❌ numpy - FAILED"
python3 -c "import multipart; print('✅ python-multipart - OK')" 2>/dev/null || echo "❌ python-multipart - FAILED"

echo
echo "===================================="
echo "Installation complete!"
echo "===================================="
echo
echo "Next steps:"
echo "1. Start backend: cd api && python3 app.py"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Upload PDFs and chat!"
echo

read -p "Press any key to continue..."