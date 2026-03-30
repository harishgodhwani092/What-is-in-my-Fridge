import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // In production, you can restrict this: app.use(cors({ origin: 'https://your-frontend-url.com' }));
app.use(express.json());

// Validate API key on startup
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
  console.error('\n❌ GEMINI_API_KEY is missing or invalid!');
  console.error('   Please add your real key to server/.env to start the app.\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Validation
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Please provide at least one ingredient.',
      });
    }

    if (ingredients.length > 3) {
      return res.status(400).json({
        error: 'Maximum 3 ingredients allowed.',
      });
    }

    // Sanitize ingredients
    const cleanIngredients = ingredients
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0 && i.length <= 50);

    if (cleanIngredients.length === 0) {
      return res.status(400).json({
        error: 'Please provide valid ingredient names.',
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a creative home chef. A user has these ingredients: ${cleanIngredients.join(', ')}.

Create a quick, delicious recipe that can be made in about 5 minutes using MAINLY these ingredients. You may include very common pantry staples (salt, pepper, oil, butter, garlic) if needed, but the recipe should primarily feature the given ingredients.

Respond ONLY with valid JSON in this exact format:
{
  "name": "Creative Recipe Name",
  "time": "5 mins",
  "difficulty": "Easy",
  "servings": "1 serving",
  "description": "A one-sentence appetizing description of the dish.",
  "ingredients": [
    "ingredient 1 with quantity",
    "ingredient 2 with quantity"
  ],
  "steps": [
    "Step 1: Clear, concise instruction.",
    "Step 2: Clear, concise instruction.",
    "Step 3: Clear, concise instruction."
  ],
  "tip": "A helpful pro tip for making this dish even better."
}

Rules:
- Keep it simple, practical, and delicious.
- Maximum 5-6 steps.
- The recipe name should be fun and creative.
- The description should make someone hungry.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipe = JSON.parse(cleanText);

    res.json({ recipe });
  } catch (error) {
    console.error('Recipe generation error:', error.message);

    // Specific error handling for Gemini API
    if (error.message?.includes('429') || error.message?.includes('finishReason: RECITATION') || error.message?.includes('RetryInfo')) {
      return res.status(429).json({
        error: 'AI is a bit busy! Please wait 20-30 seconds for your new API key to fully activate and try again.',
      });
    }

    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({
        error: 'Invalid API key. Please double check your GEMINI_API_KEY in the .env file.',
      });
    }

    res.status(500).json({
      error: 'Something went wrong generating your recipe. Please try again in a few moments!',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🍳 Recipe server is cooking!' });
});

app.listen(PORT, () => {
  console.log(`\n🍳 Recipe server is running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
