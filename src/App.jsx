import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import PuzzleBoard from './components/PuzzleBoard';
import CitySelector from './components/CitySelector';
import { generatePolyominoPieces } from './utils/polyomino';
import './App.css';

const UNSPLASH_ACCESS_KEY = 'QwIljWVcTOpWGxvZVL4iVN8ZdBOm5EaeAZC73GO3FCE';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('selectedCity') || null;
  });
  
  const [cityImage, setCityImage] = useState(() => {
    return localStorage.getItem('cityImage') || null;
  });

  // Track completed todos count
  const completedCount = todos.filter(t => t.completed).length;
  
  // Track how many reveals the user has earned but not used
  const [availableReveals, setAvailableReveals] = useState(() => {
    const saved = localStorage.getItem('availableReveals');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track which pieces are revealed
  const [revealedPieces, setRevealedPieces] = useState(() => {
    const saved = localStorage.getItem('revealedPieces');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Generate puzzle pieces based on todo count
  const [puzzleLayout, setPuzzleLayout] = useState(() => {
    const saved = localStorage.getItem('puzzleLayout');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });

  const [showCelebration, setShowCelebration] = useState(false);

  // Regenerate puzzle when todo count changes
  useEffect(() => {
    if (todos.length > 0 && (!puzzleLayout || puzzleLayout.todoCount !== todos.length)) {
      const layout = generatePolyominoPieces(todos.length);
      setPuzzleLayout({ ...layout, todoCount: todos.length });
      // Reset revealed pieces when layout changes
      setRevealedPieces(new Set());
      setAvailableReveals(0);
    }
  }, [todos.length]);

  // Update available reveals when todos are completed
  useEffect(() => {
    const revealedCount = revealedPieces.size;
    const earnedReveals = completedCount;
    const currentAvailable = earnedReveals - revealedCount;
    setAvailableReveals(Math.max(0, currentAvailable));
  }, [completedCount, revealedPieces]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('availableReveals', availableReveals.toString());
  }, [availableReveals]);

  useEffect(() => {
    localStorage.setItem('revealedPieces', JSON.stringify([...revealedPieces]));
  }, [revealedPieces]);

  useEffect(() => {
    if (puzzleLayout) {
      localStorage.setItem('puzzleLayout', JSON.stringify(puzzleLayout));
    }
  }, [puzzleLayout]);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (cityImage) {
      localStorage.setItem('cityImage', cityImage);
    }
  }, [cityImage]);

  // Check for puzzle completion
  useEffect(() => {
    if (puzzleLayout && revealedPieces.size === puzzleLayout.pieces.length && revealedPieces.size > 0) {
      setShowCelebration(true);
    }
  }, [revealedPieces, puzzleLayout]);

  const fetchCityImage = async (city) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&per_page=1&orientation=squarish`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.small;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch city image:', error);
      return null;
    }
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    const imageUrl = await fetchCityImage(city);
    if (imageUrl) {
      setCityImage(imageUrl);
      resetPuzzle();
    }
  };

  const handleRevealPiece = (pieceId) => {
    if (availableReveals > 0 && !revealedPieces.has(pieceId)) {
      setRevealedPieces(prev => new Set([...prev, pieceId]));
    }
  };

  const resetPuzzle = () => {
    setRevealedPieces(new Set());
    setAvailableReveals(0);
    setShowCelebration(false);
    // Regenerate layout
    if (todos.length > 0) {
      const layout = generatePolyominoPieces(todos.length);
      setPuzzleLayout({ ...layout, todoCount: todos.length });
    }
  };

  const clearCity = () => {
    setSelectedCity(null);
    setCityImage(null);
    setPuzzleLayout(null);
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('cityImage');
    localStorage.removeItem('puzzleLayout');
    resetPuzzle();
  };

  // Check if puzzle should be visible (at least one todo completed)
  const showPuzzle = completedCount > 0;

  return (
    <div className="app">
      <header>
        <h1>🧩 Todo Puzzle</h1>
        <p>Complete todos to reveal a city skyline!</p>
      </header>
      
      <div className="container">
        <div className="todo-section">
          <TodoList 
            todos={todos} 
            setTodos={setTodos}
            completedCount={completedCount}
            totalTodos={todos.length}
            availableReveals={availableReveals}
            showPuzzle={showPuzzle}
          />
        </div>
        
        <div className="puzzle-section">
          {!selectedCity ? (
            <CitySelector onSelect={handleCitySelect} />
          ) : (
            <PuzzleBoard 
              puzzleLayout={puzzleLayout}
              revealedPieces={revealedPieces}
              availableReveals={availableReveals}
              showPuzzle={showPuzzle}
              showCelebration={showCelebration}
              onRevealPiece={handleRevealPiece}
              onReset={resetPuzzle}
              onChangeCity={clearCity}
              cityImage={cityImage}
              cityName={selectedCity}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
