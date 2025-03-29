import { useState } from 'react';
import { isFeatureEnabled, FeatureFlags } from '../utils/featureFlags';
import { cn } from '../utils/cn';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const useNeumorphism = isFeatureEnabled(FeatureFlags.USE_NEUMORPHISM);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    
    setEditingId(null);
    setEditText('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className={cn(
      "p-6 rounded-lg",
      useNeumorphism ? "container-neumorph" : "bg-white dark:bg-gray-800 shadow-md"
    )}>
      <h2 className="text-xl font-bold mb-4">Todo List</h2>
      
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className={cn(
            "flex-grow px-4 py-2 rounded-l-lg border-r-0",
            useNeumorphism 
              ? "shadow-neumorph-inset focus:outline-none" 
              : "border border-gray-300 dark:border-gray-700 dark:bg-gray-700"
          )}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          onClick={addTodo}
          className={cn(
            "px-4 py-2 rounded-r-lg",
            useNeumorphism 
              ? "button-neumorph-primary" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id}
            className={cn(
              "flex items-center p-3 rounded-lg",
              useNeumorphism 
                ? "shadow-neumorph" 
                : "bg-gray-50 dark:bg-gray-700",
              todo.completed && "opacity-75"
            )}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
              className="mr-3 h-5 w-5"
            />
            
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className={cn(
                  "flex-grow px-2 py-1 mr-2 rounded",
                  useNeumorphism 
                    ? "shadow-neumorph-inset" 
                    : "border border-gray-300 dark:border-gray-600 dark:bg-gray-600"
                )}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
              />
            ) : (
              <span className={cn(
                "flex-grow",
                todo.completed && "line-through text-gray-500"
              )}>
                {todo.text}
              </span>
            )}

            <div className="flex space-x-2">
              {editingId === todo.id ? (
                <button
                  onClick={saveEdit}
                  className={cn(
                    "px-3 py-1 rounded text-sm",
                    useNeumorphism 
                      ? "button-neumorph" 
                      : "bg-green-500 text-white"
                  )}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(todo)}
                  className={cn(
                    "px-3 py-1 rounded text-sm",
                    useNeumorphism 
                      ? "button-neumorph" 
                      : "bg-blue-500 text-white"
                  )}
                  disabled={todo.completed}
                >
                  Edit
                </button>
              )}
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  useNeumorphism 
                    ? "button-neumorph" 
                    : "bg-red-500 text-white"
                )}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No tasks yet. Add one above!</p>
      )}
    </div>
  );
}; 