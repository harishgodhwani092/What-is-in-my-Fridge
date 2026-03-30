import { useState } from 'react';

const PLACEHOLDERS = [
    'e.g., eggs',
    'e.g., spinach',
    'e.g., tortilla',
];

function IngredientInput({ onGenerate, isLoading }) {
    const [ingredients, setIngredients] = useState(['', '', '']);

    const handleChange = (index, value) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filled = ingredients.filter((i) => i.trim().length > 0);
        if (filled.length > 0) {
            onGenerate(filled);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus next input or submit
            if (index < 2) {
                const nextInput = document.getElementById(`ingredient-${index + 1}`);
                if (nextInput) nextInput.focus();
            } else {
                handleSubmit(e);
            }
        }
    };

    const filledCount = ingredients.filter((i) => i.trim().length > 0).length;

    return (
        <div className="input-section">
            <div className="input-card glass">
                <h2 className="input-card-title">
                    <span>🧊</span> Your Ingredients
                </h2>
                <p className="input-card-description">
                    Add up to 3 ingredients you have lying around — we'll do the rest!
                </p>

                <form className="ingredients-form" onSubmit={handleSubmit}>
                    {ingredients.map((value, index) => (
                        <div className="ingredient-row" key={index}>
                            <span className="ingredient-number">{index + 1}</span>
                            <input
                                id={`ingredient-${index}`}
                                className="ingredient-input"
                                type="text"
                                placeholder={PLACEHOLDERS[index]}
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                disabled={isLoading}
                                maxLength={50}
                                autoComplete="off"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="generate-btn"
                        disabled={filledCount === 0 || isLoading}
                    >
                        <span className="btn-icon">✨</span>
                        {isLoading ? 'Cooking...' : 'Generate Recipe'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default IngredientInput;
