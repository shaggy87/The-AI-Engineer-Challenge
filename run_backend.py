#!/usr/bin/env python3
"""
Backend Server Launcher
=======================

This script properly sets up the Python path and starts the backend server.
"""

import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.absolute()
sys.path.insert(0, str(project_root))

# Add API directory to Python path
api_dir = project_root / "api"
sys.path.insert(0, str(api_dir))

# Now import and run the app
if __name__ == "__main__":
    import uvicorn

    print("Starting PDF RAG Backend Server...")
    print(f"Project root: {project_root}")
    print(f"API directory: {api_dir}")
    print(f"Python path includes: {project_root}")
    print("=" * 50)

    # Import the app after setting up the path
    from app import app

    # Start the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(api_dir), str(project_root / "aimakerspace")]
    )