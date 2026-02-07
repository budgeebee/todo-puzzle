import React, { useEffect, useRef } from 'react';
import './PuzzleBoard.css';

function PuzzleBoard({ revealed, showCelebration, onReset, onChangeCity, totalPieces, cityImage, cityName }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (showCelebration && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [showCelebration]);

  // Calculate grid dimensions
  const getGridDimensions = (n) => {
    const sqrt = Math.sqrt(n);
    const cols = Math.ceil(sqrt);
    const rows = Math.ceil(n / cols);
    return { cols, rows };
  };

  const { cols, rows } = getGridDimensions(totalPieces);

  // Generate piece styles with background image positioning
  const getPieceStyle = (index) => {
    const isRevealed = revealed[index];
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Pseudo-random but consistent values for organic look when hidden
    const seed = (index * 9301 + 49297) % 233280;
    const rotation = ((seed / 233280) - 0.5) * 12;
    const offsetX = ((seed * 7 % 233280) / 233280 - 0.5) * 6;
    const offsetY = ((seed * 13 % 233280) / 233280 - 0.5) * 6;
    const scale = 0.92 + ((seed * 17 % 233280) / 233280) * 0.16;
    
    if (!isRevealed) {
      return {
        background: '#1a1a2e',
        border: '2px solid #2d2d44',
        transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.05)',
        borderRadius: '8px'
      };
    }

    // Calculate background position for this piece of the image
    const bgX = (col / (cols - 1)) * 100;
    const bgY = (row / (rows - 1)) * 100;
    
    return {
      backgroundImage: cityImage ? `url(${cityImage})` : 'none',
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      border: '2px solid rgba(255,255,255,0.3)',
      transform: 'rotate(0deg) translate(0px, 0px) scale(1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
      borderRadius: '8px',
      animation: 'revealPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '4px',
    padding: '8px'
  };

  return (
    <div className="puzzle-board">
      <div className="puzzle-header">
        <div className="city-info">
          <h2>{cityName || 'Hidden City'}</h2>
          <button className="change-city-btn" onClick={onChangeCity}>
            Change
          </button>
        </div>
        <span className="progress">
          {revealed.filter(r => r).length} / {totalPieces}
        </span>
      </div>
      
      <div className="organic-grid" style={gridStyle}>
        {revealed.map((isRevealed, index) => (
          <div
            key={index}
            className={`puzzle-piece ${isRevealed ? 'revealed' : ''} ${cityImage ? 'has-image' : ''}`}
            style={getPieceStyle(index)}
          >
            {!isRevealed && (
              <>
                <span className="piece-number">{index + 1}</span>
                <div className="piece-texture" />
              </>
            )}
          </div>
        ))}
      </div>

      {showCelebration && (
        <div className="celebration">
          <div className="confetti">
            {[...Array(60)].map((_, i) => (
              <div 
                key={i} 
                className={`confetti-piece ${i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'square'}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  transform: `scale(${0.5 + Math.random()})`
                }}
              />
            ))}
          </div>
          <div className="message">
            <div className="trophy">🏆</div>
            <h3>{cityName} Revealed!</h3>
            <p>You've completed all todos and revealed the entire image!</p>
            {cityImage && (
              <div className="full-image-preview">
                <img src={cityImage} alt={cityName} />
              </div>
            )}
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
