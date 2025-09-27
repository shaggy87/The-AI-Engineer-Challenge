#!/usr/bin/env python3
"""
PDF RAG Dependencies Installation Script
=======================================

This script installs the required dependencies for PDF upload and processing
functionality in the RAG application.

Run this script before testing the PDF upload feature.
"""

import subprocess
import sys
import os

def check_pip_upgrade():
    """Upgrade pip to latest version."""
    print("🔄 Upgrading pip to latest version...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
        print("✅ pip upgraded successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Failed to upgrade pip: {e}")
        return False

def install_package(package):
    """Install a package using pip with multiple fallback strategies."""
    print(f"📦 Installing {package}...")

    # Strategy 1: Normal installation
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", package
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError:
        pass

    # Strategy 2: Install with --user flag
    print(f"   🔄 Trying with --user flag...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "--user", package
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Successfully installed {package} with --user")
        return True
    except subprocess.CalledProcessError:
        pass

    # Strategy 3: Install without version constraints
    base_package = package.split("==")[0].split(">=")[0].split("[")[0]
    print(f"   🔄 Trying without version constraints: {base_package}...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", base_package
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Successfully installed {base_package} (latest version)")
        return True
    except subprocess.CalledProcessError:
        pass

    # Strategy 4: Force reinstall
    print(f"   🔄 Trying force reinstall...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "--force-reinstall", base_package
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Successfully force-installed {base_package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def check_package_installed(package):
    """Check if a package is already installed."""
    base_package = package.split("==")[0].split(">=")[0].split("[")[0]
    try:
        subprocess.check_call([
            sys.executable, "-c", f"import {base_package.replace('-', '_')}"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except:
        return False

def main():
    """Install all required dependencies for PDF RAG functionality."""
    print("🚀 PDF RAG Dependencies Installation")
    print("=" * 50)
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print()

    # Check and upgrade pip first
    check_pip_upgrade()
    print()

    # Required packages for PDF processing (in order of importance)
    packages = [
        "pdfplumber",
        "numpy",
        "python-multipart",
        "PyPDF2"
    ]

    success_count = 0
    installed_packages = []
    failed_packages = []

    for package in packages:
        print(f"\n{'='*30}")

        # Check if already installed
        if check_package_installed(package):
            print(f"✅ {package} is already installed")
            installed_packages.append(package)
            success_count += 1
            continue

        # Try to install
        if install_package(package):
            installed_packages.append(package)
            success_count += 1
        else:
            failed_packages.append(package)

    print("\n" + "=" * 50)
    print("INSTALLATION SUMMARY")
    print("=" * 50)
    print(f"✅ Successfully installed/verified: {success_count}/{len(packages)} packages")

    if installed_packages:
        print(f"📦 Installed packages: {', '.join(installed_packages)}")

    if failed_packages:
        print(f"❌ Failed packages: {', '.join(failed_packages)}")
        print("\n🔧 MANUAL INSTALLATION COMMANDS:")
        for pkg in failed_packages:
            print(f"   pip install {pkg}")

    print(f"\n📋 NEXT STEPS:")
    if success_count == len(packages):
        print("🎉 All core dependencies installed successfully!")
        print("1. Start the backend server: python api/app.py")
        print("2. Start the frontend: npm run dev")
        print("3. Upload PDFs and chat with them!")
    else:
        print("⚠️  Some packages failed to install.")
        print("You can try:")
        print("1. Run the manual installation commands above")
        print("2. Use a virtual environment: python -m venv pdf_rag_env")
        print("3. Check if you have the latest Python version")
        print("4. Try running as administrator (Windows) or with sudo (Mac/Linux)")

    print(f"\n🔍 TESTING IMPORTS:")
    test_packages = {"pdfplumber": "pdfplumber", "numpy": "numpy", "multipart": "python-multipart", "PyPDF2": "PyPDF2"}

    for import_name, package_name in test_packages.items():
        try:
            __import__(import_name.replace('-', '_'))
            print(f"✅ {package_name} - Import successful")
        except ImportError:
            print(f"❌ {package_name} - Import failed")

if __name__ == "__main__":
    main()