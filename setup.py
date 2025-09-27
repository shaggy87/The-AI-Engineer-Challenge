from setuptools import setup, find_packages

setup(
    name="aimakerspace",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.21.0",
        "openai>=1.0.0",
        "pdfplumber>=0.11.0",
        "fastapi>=0.100.0",
        "uvicorn>=0.20.0",
        "pydantic>=2.0.0",
        "python-multipart>=0.0.18"
    ],
    python_requires=">=3.7",
)