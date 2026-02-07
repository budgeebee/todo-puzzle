import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import PuzzleBoard from './components/PuzzleBoard';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [revealed, setRevealed] = useState(() => {
    const saved = localStorage.getItem('revealed');
    return saved ? JSON.parse(saved) : Array(25).fill(false);
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('revealed', JSON.stringify(revealed));
    if (revealed.every(piece => piece) && revealed.length > 0) {
      setShowCelebration(true);
    }
  }, [revealed]);

  const updateRevealed = (index) => {
    setRevealed(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const resetPuzzle = () => {
    setRevealed(Array(25).fill(false));
    setShowCelebration(false);
  };

  return (
    <div className="app">
      <header>
        <h1>🧩 Todo Puzzle</h1>
        <p>Complete todos to reveal the hidden image!</p>
      </header>
      
      <div className="container">
        <div className="todo-section">
          <TodoList 
            todos={todos} 
            setTodos={setTodos} 
            onTodoComplete={updateRevealed}
            revealedCount={revealed.filter(r => r).length}
            totalPieces={25}
          />
        </div>
        
        <div className="puzzle-section">
          <PuzzleBoard 
            revealed={revealed} 
            showCelebration={showCelebration}
            onReset={resetPuzzle}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
