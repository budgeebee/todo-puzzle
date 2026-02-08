import React, { useEffect, useRef } from 'react';
import './PuzzleBoard.css';

function PuzzleBoard({ 
  puzzleLayout, 
  revealedPieces, 
  availableReveals, 
  showPuzzle,
  showCelebration, 
  onRevealPiece, 
  onReset, 
  onChangeCity, 
  cityImage, 
  cityName 
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (showCelebration && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [showCelebration]);

  if (!puzzleLayout) return null;

  const { pieces, rows, cols } = puzzleLayout;
  const totalPieces = pieces.length;
  const revealedCount = revealedPieces.size;

  // Calculate grid dimensions
  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '6px',
    padding: '12px'
  };

  // Get background style for a piece based on its position
  const getPieceBackground = (piece) => {
    if (!cityImage) return {};
    
    // Calculate the portion of the image this piece represents
    const firstCell = piece.cells[0];
    const lastCell = piece.cells[piece.cells.length - 1];
    
    const bgX = (firstCell.col / (cols - 1 || 1)) * 100;
    const bgY = (firstCell.row / (rows - 1 || 1)) * 100;
    
    return {
      backgroundImage: `url(${cityImage})`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${bgX}% ${bgY}%`
    };
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
        {showPuzzle && (
          <span className="progress">
            {revealedCount} / {totalPieces}
          </span>
        )}
      </div>

      {!showPuzzle ? (
        <div className="puzzle-locked">
          <div className="lock-icon">🔒</div>
          <p>Complete your first todo to unlock the puzzle!</p>
        </div>
      ) : (
        <>
          <div className="available-reveals">
            <span className="glow-indicator">
              ✨ {availableReveals} reveal{availableReveals !== 1 ? 's' : ''} available
            </span>
            <span className="hint">Click a piece to reveal it</span>
          </div>
          
          <div className="polyomino-grid" style={gridStyle}>
            {pieces.map(piece => {
              const isRevealed = revealedPieces.has(piece.id);
              const canReveal = !isRevealed && availableReveals > 0;
              
              return (
                <div
                  key={piece.id}
                  className={`polyomino-piece ${isRevealed ? 'revealed' : ''} ${canReveal ? 'can-reveal' : ''}`}
                  style={{
                    gridRow: `${piece.gridRow} / span ${piece.rowSpan}`,
                    gridColumn: `${piece.gridCol} / span ${piece.colSpan}`,
                    ...(isRevealed ? getPieceBackground(piece) : {})
                  }}
                  onClick={() => canReveal && onRevealPiece(piece.id)}
                >
                  {!isRevealed && (
                    <>
                      <span className="piece-number">{piece.id + 1}</span>
                      <div className="piece-pattern" />
                    </>
                  )}
                  {canReveal && <div className="reveal-glow" />}
                </div>
              );
            })}
          </div>
        </>
      )}

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
