"""
Question Generator for RAG Documents
Generates relevant question suggestions based on uploaded document content
"""

from openai import OpenAI
from typing import List, Optional
import logging

class QuestionGenerator:
    def __init__(self, client: Optional[OpenAI] = None):
        """
        Initialize the question generator

        Args:
            client: OpenAI client instance (optional, will be passed per request if None)
        """
        self.client = client

    def generate_questions(self, document_content: str, api_key: str, max_questions: int = 5) -> List[str]:
        """
        Generate relevant questions based on document content

        Args:
            document_content: Text content of the document
            api_key: OpenAI API key
            max_questions: Maximum number of questions to generate

        Returns:
            List of generated questions
        """
        try:
            # Use provided client or create new one with API key
            client = self.client or OpenAI(api_key=api_key)

            # Truncate content to avoid token limits (keep first 3000 chars)
            content_sample = document_content[:3000] if len(document_content) > 3000 else document_content

            prompt = f"""Based on this casino compliance document, generate {max_questions} short, direct questions (max 8-10 words each).

Focus on key topics:
- Requirements and obligations
- Deadlines and timelines
- Licensing and RTP
- Audit and reporting

Document content:
{content_sample}

Generate {max_questions} brief, specific questions. Keep each question under 10 words. Format each question on a new line without numbering."""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert in online casino compliance and regulations. Generate practical, specific questions about compliance requirements."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )

            # Parse questions from response
            questions_text = response.choices[0].message.content
            if questions_text:
                # Split by lines and clean up
                questions = [q.strip() for q in questions_text.split('\n') if q.strip()]
                # Remove any numbering or bullet points
                cleaned_questions = []
                for q in questions:
                    # Remove common prefixes
                    q = q.lstrip('1234567890.-• ')
                    if q and q.endswith('?'):
                        cleaned_questions.append(q)

                return cleaned_questions[:max_questions]

            return []

        except Exception as e:
            logging.error(f"Error generating questions: {str(e)}")
            # Return fallback questions if generation fails
            return [
                "What are the main compliance requirements?",
                "What deadlines must I meet?",
                "What licensing obligations apply?",
                "What are the RTP requirements?",
                "What reporting procedures are required?"
            ]

    def generate_contextual_questions(self, document_content: str, api_key: str, user_query: str) -> List[str]:
        """
        Generate follow-up questions based on a user's query and document content

        Args:
            document_content: Text content of the document
            api_key: OpenAI API key
            user_query: User's current question/query

        Returns:
            List of related follow-up questions
        """
        try:
            client = self.client or OpenAI(api_key=api_key)

            content_sample = document_content[:2000]

            prompt = f"""Based on this user's question, suggest 3 short follow-up questions (max 8 words each).

User's question: "{user_query}"

Document context:
{content_sample}

Generate 3 brief follow-up questions under 8 words each. Format each question on a new line."""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert compliance consultant. Generate helpful follow-up questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=400
            )

            questions_text = response.choices[0].message.content
            if questions_text:
                questions = [q.strip() for q in questions_text.split('\n') if q.strip()]
                cleaned_questions = []
                for q in questions:
                    q = q.lstrip('1234567890.-• ')
                    if q and q.endswith('?'):
                        cleaned_questions.append(q)

                return cleaned_questions[:3]

            return []

        except Exception as e:
            logging.error(f"Error generating contextual questions: {str(e)}")
            return []