import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key on startup
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
  console.warn('\n⚠️  GEMINI_API_KEY is missing or dummy!');
  console.warn('   The app will run in MOCK mode for now.');
  console.warn('   Add your key to server/.env to enable the REAL magic! ✨\n');
}

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here'
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

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

    const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here';

    if (isMock) {
      console.log('📝 Using MOCK recipe generator (No valid API key found)');
      // Simulate quick AI thinking
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockRecipe = {
        name: `Supreme ${cleanIngredients[0]} Fusion`,
        time: "5 mins",
        difficulty: "Easy",
        servings: "1 serving",
        description: `Experience the unexpected delight of ${cleanIngredients.join(' and ')} blended into a quick masterpiece.`,
        ingredients: [
          ...cleanIngredients.map(i => `1 cup ${i}`),
          "Pinch of salt",
          "Drizzle of olive oil"
        ],
        steps: [
          `Prep your ${cleanIngredients.join(', ')} nicely.`,
          "Heat a pan over medium heat with a splash of oil.",
          `Sauté everything together for exactly 3 minutes.`,
          "Season with salt and pepper to taste.",
          "Serve while hot and enjoy!"
        ],
        tip: "Add a squeeze of lemon for extra brightness!"
      };
      return res.json({ recipe: mockRecipe });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a creative home chef. A user has these ingredients: ${cleanIngredients.join(', ')}.

Create a quick, delicious recipe that can be made in about 5 minutes using MAINLY these ingredients. You may include very common pantry staples (salt, pepper, oil, butter, garlic) if needed, but the recipe should primarily feature the given ingredients.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
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

    // Parse the JSON response
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipe = JSON.parse(cleanText);

    // Validate recipe structure
    const requiredFields = ['name', 'time', 'difficulty', 'ingredients', 'steps'];
    for (const field of requiredFields) {
      if (!recipe[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    res.json({ recipe });
  } catch (error) {
    console.error('Recipe generation error:', error.message);

    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your GEMINI_API_KEY.',
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: 'Failed to parse recipe. Please try again.',
      });
    }

    res.status(500).json({
      error: 'Something went wrong generating your recipe. Please try again!',
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
