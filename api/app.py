# Add parent directory to Python path for aimakerspace imports
import sys
import os
import warnings
import tempfile
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Suppress multipart boundary warnings
warnings.filterwarnings("ignore", message="Skipping data after last boundary")

# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import asyncio
from typing import Optional
# Import aimakerspace components for RAG functionality
from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.embedding import EmbeddingModel
from aimakerspace.question_generator import QuestionGenerator

# Initialize FastAPI application with a title
app = FastAPI(title="Online Casino Games Compliance Assistant API")

# Global variable to store the vector database for compliance content
pdf_vector_db = None
pdf_metadata = None
suggested_questions = []

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the compliance consultant
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str # OpenAI API key for authentication

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # online casino compliance improvements
            request.developer_message += "Always keep online casino compliance answers practical and actionable. Offer to dive deeper into specific gaming regulations, RTP requirements, or casino licensing details."
            # improvement for all casino compliance answers
            request.developer_message += "Structure your online casino compliance advice clearly. Use bold, italic, and icons to highlight key gaming requirements, licensing deadlines, and casino compliance obligations. Use HTML formatting only."
            # improvement for casino regulatory questions
            request.developer_message += "When discussing casino regulations or requirements, provide clear compliance status first, then offer to show detailed explanations if requested."
            
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": request.developer_message},
                    {"role": "user", "content": request.user_message}
                ],
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Compliance Document Upload endpoint
@app.post("/api/upload-pdf")
async def upload_pdf(pdf_file: UploadFile = File(...), api_key: str = Form(...)):
    global pdf_vector_db, pdf_metadata, suggested_questions

    try:
        # Validate online casino compliance document file type
        if not pdf_file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        # Save the uploaded file to a temporary directory
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await pdf_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process the online casino compliance document using aimakerspace PDFLoader
        try:
            loader = PDFLoader(temp_file_path)
            documents = loader.load_documents()

            if not documents:
                raise HTTPException(status_code=400, detail="No text content found in online casino compliance document")

            # Split documents into chunks
            splitter = CharacterTextSplitter(chunk_size=800, chunk_overlap=100)

            chunked_docs = []
            chunked_metadata = []

            for doc_idx, doc in enumerate(documents):
                chunks = splitter.split(doc)
                for i, chunk in enumerate(chunks):
                    chunked_docs.append(chunk)

                    chunk_meta = {
                        'document_id': doc_idx,
                        'chunk_id': i,
                        'total_chunks': len(chunks),
                        'chunk_word_count': len(chunk.split()),
                        'filename': pdf_file.filename,
                        'file_type': 'pdf'
                    }
                    chunked_metadata.append(chunk_meta)

            # Create vector database - temporarily set API key in environment
            original_api_key = os.environ.get('OPENAI_API_KEY')
            os.environ['OPENAI_API_KEY'] = api_key
            try:
                embedding_model = EmbeddingModel()
                vector_db = VectorDatabase(embedding_model=embedding_model)
            finally:
                # Restore original API key
                if original_api_key is not None:
                    os.environ['OPENAI_API_KEY'] = original_api_key
                elif 'OPENAI_API_KEY' in os.environ:
                    del os.environ['OPENAI_API_KEY']

            # Build vector database asynchronously
            await vector_db.abuild_from_list(chunked_docs)

            # Generate question suggestions
            question_generator = QuestionGenerator()
            full_text = " ".join(documents[:2])  # Use first 2 documents for question generation
            generated_questions = question_generator.generate_questions(full_text, api_key)

            # Store in global variables
            pdf_vector_db = vector_db
            pdf_metadata = {
                'filename': pdf_file.filename,
                'total_chunks': len(chunked_docs),
                'total_documents': len(documents),
                'file_type': 'pdf'
            }
            suggested_questions = generated_questions

            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except OSError:
                pass  # File might already be deleted

            return {
                "success": True,
                "message": f"Online casino compliance document '{pdf_file.filename}' analyzed successfully",
                "chunks": len(chunked_docs),
                "documents": len(documents),
                "suggested_questions": generated_questions
            }

        except Exception as e:
            # Clean up temporary file in case of error
            try:
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            except OSError:
                pass  # File might already be deleted
            raise HTTPException(status_code=500, detail=f"Error processing online casino compliance document: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")


# Compliance Consultation endpoint - uses RAG with uploaded document
@app.post("/api/pdf-chat")
async def pdf_chat(request: ChatRequest):
    global pdf_vector_db, pdf_metadata

    try:
        if pdf_vector_db is None:
            raise HTTPException(status_code=400, detail="No online casino compliance document has been uploaded yet")

        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)

        # Search for relevant context in the PDF
        search_results = pdf_vector_db.search_by_text(request.user_message, k=4)

        # Build context from search results
        context_parts = []
        for i, (text, score) in enumerate(search_results):
            context_parts.append(f"[Context {i+1} (relevance: {score:.3f})]:\n{text}\n")

        context = "\n".join(context_parts)

        # Create an async generator function for streaming responses
        async def generate():
            # Enhanced system message for online casino compliance document consultation
            enhanced_developer_message = request.developer_message
            enhanced_developer_message += f"\n\nYou have access to content from the online casino compliance document '{pdf_metadata['filename']}'. "
            enhanced_developer_message += "Use the following context from the casino compliance document to provide expert consultation. "
            enhanced_developer_message += "Only use information from this document context. If the context doesn't contain "
            enhanced_developer_message += "relevant information, clearly state that you don't have that information in the uploaded casino compliance document."
            enhanced_developer_message += "\n\nONLINE CASINO COMPLIANCE DOCUMENT CONTEXT:\n" + context

            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": enhanced_developer_message},
                    {"role": "user", "content": request.user_message}
                ],
                stream=True
            )

            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get suggested questions endpoint
@app.get("/api/suggested-questions")
async def get_suggested_questions():
    global suggested_questions
    return {"questions": suggested_questions}

# Generate follow-up questions endpoint
@app.post("/api/generate-followup-questions")
async def generate_followup_questions(request: ChatRequest):
    global pdf_vector_db

    try:
        if pdf_vector_db is None:
            return {"questions": []}

        # Get some context from the vector database
        search_results = pdf_vector_db.search_by_text(request.user_message, k=2)
        context = " ".join([text for text, score in search_results])

        # Generate contextual follow-up questions
        question_generator = QuestionGenerator()
        followup_questions = question_generator.generate_contextual_questions(
            context, request.api_key, request.user_message
        )

        return {"questions": followup_questions}

    except Exception as e:
        print(f"Error generating follow-up questions: {str(e)}")
        return {"questions": []}

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "document_loaded": pdf_vector_db is not None}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8001
    uvicorn.run(app, host="0.0.0.0", port=8001)
