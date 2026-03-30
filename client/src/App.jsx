import { useState, useCallback } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastIngredients, setLastIngredients] = useState([]);

  const generateRecipe = useCallback(async (ingredients) => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setLastIngredients(ingredients);

    try {
      const response = await fetch(`${API_URL}/api/generate-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err) {
      console.error('Failed to generate recipe:', err);
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Make sure the backend is running!'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTryAgain = () => {
    if (lastIngredients.length > 0) {
      generateRecipe(lastIngredients);
    }
  };

  const handleNewRecipe = () => {
    setRecipe(null);
    setError(null);
    setLastIngredients([]);
  };

  return (
    <div className="app">
      <div className="app-content">
        <Header />

        <IngredientInput onGenerate={generateRecipe} isLoading={loading} />

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-section">
            <div className="error-card glass">
              <div className="error-icon">😵</div>
              <p className="error-text">{error}</p>
              <button className="error-retry-btn" onClick={handleTryAgain}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {recipe && (
          <RecipeCard
            recipe={recipe}
            onTryAgain={handleTryAgain}
            onNewRecipe={handleNewRecipe}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
