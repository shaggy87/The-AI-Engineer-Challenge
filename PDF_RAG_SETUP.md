# 📄 PDF RAG Setup Guide

This guide explains how to set up and use the PDF upload and chat functionality in your RAG application.

## 🚀 Quick Start

### 1. Install Dependencies

**Option A: Automated Python Script (Recommended)**
```bash
python install_pdf_dependencies.py
```

**Option B: Platform-specific Scripts**

**Windows:**
```bash
install_pdf_deps.bat
```

**Mac/Linux:**
```bash
./install_pdf_deps.sh
```

**Option C: Manual Installation**
```bash
pip install pdfplumber
pip install numpy
pip install python-multipart
```

**Option D: If you have issues, try:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install with user flag
pip install --user pdfplumber numpy python-multipart

# Or use verbose output to see errors
pip install -v pdfplumber
```

### 2. Start the Backend Server
```bash
cd api
python app.py
```
The server will start on `http://localhost:8000`

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 📋 Features Added

### Frontend Features:
- ✅ **PDF Upload Interface** - Drag & drop or click to upload
- ✅ **Processing Status** - Real-time upload progress
- ✅ **PDF Status Indicator** - Shows when PDF is ready
- ✅ **Chat Interface** - Chat directly with PDF content
- ✅ **Responsive Design** - Star Wars themed UI

### Backend Features:
- ✅ **PDF Processing** - Uses `pdfplumber` for text extraction
- ✅ **Vector Database** - Indexes PDF content using `aimakerspace`
- ✅ **RAG System** - Retrieval Augmented Generation
- ✅ **Context-Aware Chat** - Only uses PDF content for answers
- ✅ **Metadata Support** - Tracks chunks, pages, and file info

## 🔧 API Endpoints

### 1. Upload PDF
- **Endpoint:** `POST /api/upload-pdf`
- **Body:** `multipart/form-data`
  - `pdf_file`: PDF file
  - `api_key`: OpenAI API key
- **Response:**
  ```json
  {
    "success": true,
    "message": "PDF processed successfully",
    "chunks": 45,
    "documents": 1
  }
  ```

### 2. Chat with PDF
- **Endpoint:** `POST /api/pdf-chat`
- **Body:** `application/json`
  ```json
  {
    "developer_message": "System prompt",
    "user_message": "User question",
    "api_key": "your-openai-key"
  }
  ```
- **Response:** Streaming text response

### 3. Health Check
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "pdf_loaded": true
  }
  ```

## 📖 How It Works

### 1. PDF Processing Pipeline
```
PDF Upload → Text Extraction → Chunking → Embedding → Vector Storage
```

1. **Upload**: User uploads PDF through the frontend
2. **Extraction**: `pdfplumber` extracts text from PDF pages
3. **Chunking**: Text is split into 800-character chunks with 100-character overlap
4. **Embedding**: OpenAI embeddings are created for each chunk
5. **Storage**: Chunks and embeddings stored in vector database

### 2. Chat Pipeline
```
User Question → Vector Search → Context Retrieval → LLM Response
```

1. **Question**: User asks a question about the PDF
2. **Search**: Vector similarity search finds relevant chunks
3. **Context**: Top 4 most relevant chunks are retrieved
4. **Response**: LLM answers using only the retrieved context

## 🎯 Usage Example

1. **Start the application**
2. **Enter your OpenAI API key**
3. **Upload a PDF** (e.g., research paper, manual, book)
4. **Wait for processing** (usually 10-30 seconds)
5. **Start chatting!**

Example questions you can ask:
- "What is the main topic of this document?"
- "Summarize the key points from chapter 3"
- "What does the author say about X?"
- "Find information about Y"

## 🔒 Security & Privacy

- ✅ **API keys stored locally** - Never sent to our servers
- ✅ **Temporary file handling** - PDFs deleted after processing
- ✅ **In-memory storage** - Vector database stored in server memory
- ✅ **No data persistence** - Restart server to clear all data

## 🛠️ Technical Stack

### Frontend:
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (Star Wars theme)

### Backend:
- **FastAPI** - Python web framework
- **aimakerspace** - Custom RAG library
- **pdfplumber** - PDF text extraction
- **OpenAI API** - Embeddings and chat
- **NumPy** - Vector operations

## 🐛 Troubleshooting

### Common Issues:

**1. PDF Upload Failed**
- Check if file is a valid PDF
- Ensure API key is correct
- Verify backend server is running

**2. No Response from Chat**
- Check if PDF was successfully uploaded
- Verify vector database is loaded (`/api/health`)
- Check console for API errors

**3. Import Errors**
- Run installation script again
- Check Python environment
- Verify all dependencies are installed

**4. Slow Processing**
- Large PDFs take longer to process
- Check internet connection (OpenAI API calls)
- Wait for processing to complete

## 🚀 Advanced Usage

### Custom Chunk Size
Modify `chunk_size` in `api/app.py`:
```python
splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
```

### More Context
Increase retrieval count in PDF chat:
```python
search_results = pdf_vector_db.search_by_text(request.user_message, k=6)
```

### Different Embedding Model
Update the embedding model:
```python
embedding_model = EmbeddingModel(model="text-embedding-3-large", api_key=api_key)
```

## 📈 Performance Tips

1. **Optimal PDF Size:** 1-50 pages work best
2. **Clean Text:** PDFs with clear text extract better
3. **Specific Questions:** More specific questions get better answers
4. **Context Length:** Keep questions focused for better results

## 🎉 Success!

You now have a fully functional PDF RAG system! Upload any PDF and start having intelligent conversations with your documents.

**May the Force be with your PDFs!** 🌟