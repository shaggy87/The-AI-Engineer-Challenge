# Star Wars Terminal Frontend

A Star Wars-themed terminal interface for interacting with AI using Next.js and the FastAPI backend.

## Features

- 🌟 Epic Star Wars intro sequence with crawling text
- 🤖 Terminal-style interface with golden Star Wars aesthetic
- ⚡ Real-time streaming responses from OpenAI API
- 🔒 Secure API key input (password field)
- 🎯 Responsive design that works on all devices
- ✨ Animated stars background
- ⌨️ Keyboard shortcuts (Ctrl+Enter to execute)

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
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
   Go to http://localhost:3000

## How to Use

1. **Watch the Star Wars intro** (click anywhere to skip)
2. **Enter your OpenAI API key** in the "Access Key" field
3. **Customize the System Directive** (optional) - this controls how the AI behaves
4. **Type your message** in the "Transmission" field
5. **Click "Execute Command"** or press Ctrl+Enter
6. **Watch the AI response** stream in real-time

## API Key Setup

You need an OpenAI API key to use this application:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Paste it into the "Access Key" field in the terminal

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **CSS3** - Custom Star Wars styling with animations
- **Orbitron Font** - Futuristic monospace font
- **Streaming API** - Real-time response handling

## Backend Integration

The frontend automatically proxies API requests to the FastAPI backend running on port 8000. Make sure both servers are running for full functionality.

## Keyboard Shortcuts

- `Ctrl+Enter` - Execute command
- `Click anywhere during intro` - Skip Star Wars intro

## Customization

You can customize the Star Wars theme by modifying:
- Colors in `globals.css` (search for `#FFD700` for the gold color)
- Intro text in `StarWarsIntro.tsx`
- Terminal messages in `Terminal.tsx`

May the Force be with your coding! ⚔️