function LoadingSpinner() {
    return (
        <div className="loading-section">
            <div className="loading-card glass">
                <div className="loading-emoji">🍳</div>
                <p className="loading-text">Cooking up something delicious</p>
                <p className="loading-subtext">
                    Our AI chef is working its magic
                    <span className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
