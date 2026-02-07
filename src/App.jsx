import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import PuzzleBoard from './components/PuzzleBoard';
import CitySelector from './components/CitySelector';
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

  // Calculate puzzle size based on todo count
  const getPuzzleSize = (count) => {
    if (count < 4) return 4;
    const sqrt = Math.ceil(Math.sqrt(count));
    return sqrt * sqrt;
  };

  const puzzleSize = getPuzzleSize(todos.length);
  
  const [revealed, setRevealed] = useState(() => {
    const saved = localStorage.getItem('revealed');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length !== puzzleSize) {
        const newRevealed = Array(puzzleSize).fill(false);
        parsed.forEach((val, idx) => {
          if (idx < puzzleSize) newRevealed[idx] = val;
        });
        return newRevealed;
      }
      return parsed;
    }
    return Array(puzzleSize).fill(false);
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('revealed', JSON.stringify(revealed));
    if (revealed.every(piece => piece) && revealed.length > 0 && revealed.filter(r => r).length > 0) {
      setShowCelebration(true);
    }
  }, [revealed]);

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

  // Resize revealed array when puzzle size changes
  useEffect(() => {
    setRevealed(prev => {
      if (prev.length !== puzzleSize) {
        const newRevealed = Array(puzzleSize).fill(false);
        prev.forEach((val, idx) => {
          if (idx < puzzleSize) newRevealed[idx] = val;
        });
        return newRevealed;
      }
      return prev;
    });
  }, [puzzleSize]);

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
        // Use the small size for puzzle pieces
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
      // Reset puzzle when city changes
      setRevealed(Array(puzzleSize).fill(false));
      setShowCelebration(false);
    }
  };

  const updateRevealed = () => {
    setRevealed(prev => {
      const updated = [...prev];
      const firstUnrevealed = updated.findIndex(r => !r);
      if (firstUnrevealed !== -1) {
        updated[firstUnrevealed] = true;
      }
      return updated;
    });
  };

  const resetPuzzle = () => {
    setRevealed(Array(puzzleSize).fill(false));
    setShowCelebration(false);
  };

  const clearCity = () => {
    setSelectedCity(null);
    setCityImage(null);
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('cityImage');
    resetPuzzle();
  };

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
            onTodoComplete={updateRevealed}
            revealedCount={revealed.filter(r => r).length}
            totalPieces={puzzleSize}
          />
        </div>
        
        <div className="puzzle-section">
          {!selectedCity ? (
            <CitySelector onSelect={handleCitySelect} />
          ) : (
            <PuzzleBoard 
              revealed={revealed} 
              showCelebration={showCelebration}
              onReset={resetPuzzle}
              onChangeCity={clearCity}
              totalPieces={puzzleSize}
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
