function RecipeCard({ recipe, onTryAgain, onNewRecipe }) {
    return (
        <div className="recipe-section">
            <div className="recipe-card glass">
                {/* Header */}
                <div className="recipe-header">
                    <h2 className="recipe-name">{recipe.name}</h2>
                    {recipe.description && (
                        <p className="recipe-description">"{recipe.description}"</p>
                    )}
                    <div className="recipe-meta">
                        <span className="recipe-meta-item">
                            <span className="meta-icon">⏱️</span>
                            {recipe.time}
                        </span>
                        <span className="recipe-meta-item">
                            <span className="meta-icon">📊</span>
                            {recipe.difficulty}
                        </span>
                        {recipe.servings && (
                            <span className="recipe-meta-item">
                                <span className="meta-icon">🍽️</span>
                                {recipe.servings}
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="recipe-body">
                    {/* Ingredients */}
                    <div>
                        <h3 className="recipe-section-title">
                            <span>🥘</span> Ingredients
                        </h3>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((item, index) => (
                                <li key={index}>
                                    <span className="ingredient-bullet"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Steps */}
                    <div>
                        <h3 className="recipe-section-title">
                            <span>👨‍🍳</span> Instructions
                        </h3>
                        <ol className="steps-list">
                            {recipe.steps.map((step, index) => (
                                <li key={index}>
                                    <span className="step-number">{index + 1}</span>
                                    <span className="step-text">
                                        {step.replace(/^Step \d+:\s*/i, '')}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Tip */}
                    {recipe.tip && (
                        <div className="recipe-tip">
                            <span className="tip-icon">💡</span>
                            <div className="tip-content">
                                <strong>Pro Tip: </strong>
                                {recipe.tip}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="recipe-actions">
                    <button className="action-btn action-btn-primary" onClick={onNewRecipe}>
                        <span>🔄</span> New Recipe
                    </button>
                    <button className="action-btn action-btn-secondary" onClick={onTryAgain}>
                        <span>🎲</span> Same Ingredients, New Idea
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeCard;
