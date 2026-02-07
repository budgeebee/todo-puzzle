import React, { useState } from 'react';
import './TodoList.css';

function TodoList({ todos, setTodos, onTodoComplete, revealedCount, totalPieces }) {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(),
        text: newTodo, 
        completed: false 
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo.completed) {
      // Find first unrevealed piece index
      const unrevealedIndex = revealedCount;
      if (unrevealedIndex < totalPieces) {
        onTodoComplete(unrevealedIndex);
      }
    }
    
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const progress = Math.round((revealedCount / totalPieces) * 100);

  return (
    <div className="todo-list">
      <h2>Your Tasks</h2>
      
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <span>{revealedCount}/{totalPieces} pieces revealed</span>
      </div>

      <form onSubmit={addTodo} className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todos">
        {todos.length === 0 && (
          <li className="empty">No todos yet. Add one above!</li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <button 
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
