# 🍳 What's in my Fridge? — AI Recipe Generator

A **production-ready** web app that takes your leftover ingredients and generates a delicious 5-minute recipe using Google's Gemini AI.

> Type in 3 ingredients → Get a recipe → Cook in 5 minutes. Like magic. ✨

## ✨ Features

- **AI-Powered Recipes** — Uses Google Gemini to generate creative, quick recipes
- **Beautiful Dark UI** — Glassmorphism design with smooth animations
- **Mobile Responsive** — Looks great on all screen sizes
- **Smart Prompting** — Carefully crafted prompt ensures structured, useful recipes
- **Error Handling** — Graceful error states and retry functionality

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS |
| Backend | Express.js |
| AI | Google Gemini API |
| Font | Inter (Google Fonts) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **Free Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Setup

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd "Mini Project"
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server/` folder:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the App

You need **two terminals** — one for the backend, one for the frontend.

**Terminal 1 — Start the backend:**
```bash
cd server
npm run dev
```
> 🍳 Server runs on http://localhost:3001

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```
> ⚡ App opens at http://localhost:5173

### Usage

1. Open http://localhost:5173 in your browser
2. Type in up to 3 ingredients (e.g., "eggs", "spinach", "tortilla")
3. Click **"Generate Recipe"**
4. Enjoy your AI-generated 5-minute recipe! 🎉

## 📁 Project Structure

```
Mini Project/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx
│   │   │   ├── IngredientInput.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Component styles
│   │   ├── index.css        # Design system & tokens
│   │   └── main.jsx         # Entry point
│   └── index.html
├── server/                  # Express Backend
│   ├── index.js             # API server + Gemini integration
│   └── .env                 # API key (gitignored)
└── README.md
```

## 📝 License

MIT
