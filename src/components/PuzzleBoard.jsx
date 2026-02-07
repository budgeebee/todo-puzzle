import React, { useEffect, useRef } from 'react';
import './PuzzleBoard.css';

function PuzzleBoard({ revealed, showCelebration, onReset }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (showCelebration && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [showCelebration]);

  // Create a colorful gradient pattern for the hidden image
  const getPieceStyle = (index) => {
    const isRevealed = revealed[index];
    const row = Math.floor(index / 5);
    const col = index % 5;
    
    if (!isRevealed) {
      return {
        background: '#2c3e50',
        border: '1px solid #34495e'
      };
    }

    // Create a gradient sunset image effect
    const hue = 200 + (row * 15) + (col * 10);
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 40}, 80%, 50%))`,
      border: '1px solid rgba(255,255,255,0.3)'
    };
  };

  return (
    <div className="puzzle-board">
      <h2>Hidden Image</h2>
      
      <div className="grid">
        {revealed.map((isRevealed, index) => (
          <div
            key={index}
            className={`puzzle-piece ${isRevealed ? 'revealed' : ''}`}
            style={getPieceStyle(index)}
          >
            {!isRevealed && <span className="piece-number">{index + 1}</span>}
          </div>
        ))}
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
                }}
              />
            ))}
          </div>
          <div className="message">
            <h3>🎉 Puzzle Complete! 🎉</h3>
            <p>You've revealed the entire image!</p>
            <button onClick={onReset}>Start New Puzzle</button>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu87plHQUuh9Dz2YU2Bhxqv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XysWUeBjiOz/LThzYGHnLx7+OWSQ0MTK/n8bllHwU2jc7z1YU1Bhxw8Ozhl0gNC1Gp5fO4ZSAFNo/M89CEMwYecPDs4phHDAtQp+XyxWUeBjiOz/PShjUGG3Dw7OKXRgwLUqjl88LplHwU1jc3z1YU1Bhxw8OzhmUgNC1Ko5fG4ZSAFNo3N89GFNwYccPDs4phG" 
      />
    </div>
  );
}

export default PuzzleBoard;
