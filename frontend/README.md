# Casino Game Design Consultant Frontend

A vibrant casino game design consultation platform built with Next.js and FastAPI backend.

## 🎰 Features

- 🌟 Epic casino-themed intro sequence with scrolling text
- 🎯 Professional consultation interface with golden casino aesthetic
- 📄 Game Design Document (GDD) upload and analysis
- 🤖 Expert casino game design consultation powered by AI
- 💎 Animated casino gems background
- 🚀 Real-time streaming responses

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Start the backend server (in another terminal):**
   ```bash
   cd ../api
   python app.py
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Watch the casino game design intro** (click anywhere to skip)
2. **Enter your OpenAI API key**
3. **Upload your Game Design Document** (PDF format)
4. **Start chatting** with your expert consultant about:
   - Game mechanics and features
   - Monetization strategies
   - Player engagement techniques
   - Regulatory compliance
   - Mathematical models (RTP, volatility)
   - Market analysis

## 🔑 Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account or log in
3. Navigate to API keys section
4. Create a new secret key
3. Copy the key (starts with `sk-`)
4. Paste it into the application

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS3** - Custom casino game styling with animations
- **FastAPI** - Python backend API
- **OpenAI GPT** - AI consultation engine

## 🎨 Customization

You can customize the casino game design theme by modifying:

- Colors and gradients in `globals.css`
- Intro text in `CasinoIntro.tsx`
- Consultation prompts in `page.tsx`

## 🎰 File Upload

Supported formats:
- PDF Game Design Documents
- Maximum file size: As configured in backend
- Processing includes text extraction and vector indexing

## 🎮 Keyboard Shortcuts

- `Click anywhere during intro` - Skip casino intro
- `Enter` - Send message / Submit form
- `Shift + Enter` - New line in message input

## Backend Integration

The frontend automatically connects to the FastAPI backend running on port 8000. Make sure both servers are running for full functionality.

Ready to design the next casino gaming sensation! 🎰✨