import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { cn } from '@core/utils/cn';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useFeatureFlag } from '@core/hooks/useFeatureFlag';
import { FeatureFlags } from '@core/config/featureFlags';
import { Todo } from '@features/todo/domain/Todo';
import { createTodoBuilder } from '@features/todo/domain/TodoBuilder';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import { Button } from '@/components/atoms/Button';
import { ButtonBuilder } from '@/components/atoms/Button/ButtonBuilder';

/**
 * Componente de presentación para la lista de ToDos
 * No contiene lógica de negocio, solo la UI para interactuar con los ToDos
 */
export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  // Feature flags
  const useNeumorphism = useFeatureFlag(FeatureFlags.USE_NEUMORPHISM);
  const { features } = useModuleFeatures();

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remainingCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleAddTodo = useCallback(() => {
    if (newTodoText.trim()) {
      const todoBuilder = createTodoBuilder();
      const newTodo = todoBuilder
        .withId(Date.now().toString())
        .withText(newTodoText.trim())
        .withCompleted(false)
        .withCreatedAt(new Date())
        .build();
      
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoText('');
    }
  }, [newTodoText]);

  const handleToggle = useCallback((id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const handleEdit = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);

  const handleUpdateTodo = useCallback(() => {
    if (editText.trim() && editingId) {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === editingId ? { ...todo, text: editText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditText('');
    }
  }, [editingId, editText]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, type: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (type === 'add') {
        handleAddTodo();
      } else {
        handleUpdateTodo();
      }
    } else if (e.key === 'Escape' && type === 'edit') {
      handleCancelEdit();
    }
  }, [handleAddTodo, handleUpdateTodo, handleCancelEdit]);

  return (
    <div className={`p-6 ${features.neumorphism ? 'container-neumorph' : 'bg-white dark:bg-gray-800 shadow-lg'} rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo List</h1>
        <Button {...new ButtonBuilder()
          .setVariant('primary')
          .setNeumorph(features.neumorphism)
          .setChildren('Add Todo')
          .build()}
        />
      </div>
      <div className="space-y-4">
        {/* Add new todo form */}
        <div className="flex mb-6">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="Add a new task..."
            className={cn(
              "flex-grow p-3 rounded-l-lg focus:outline-none",
              useNeumorphism ? "input-neumorph" : "border border-[#e2e8f0] dark:border-[#334155] dark:bg-[#0f172a] dark:text-white"
            )}
          />
        </div>
        
        {/* Filters */}
        <div className="flex justify-center mb-6 space-x-2">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                filter === filterType
                  ? useNeumorphism 
                    ? "button-neumorph-active" 
                    : "bg-[#3b82f6] text-white"
                  : useNeumorphism 
                    ? "button-neumorph" 
                    : "bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] dark:bg-[#1e293b] dark:text-white dark:hover:bg-[#334155]"
              )}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Todo list */}
        {filteredTodos.length > 0 ? (
          <ul className="mb-6 space-y-2">
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className={cn(
                  "p-4 rounded-lg transition-all",
                  useNeumorphism
                    ? "panel-neumorph"
                    : "bg-[#ffffff] dark:bg-[#0f172a] shadow-sm border border-[#e2e8f0] dark:border-[#334155]"
                )}
              >
                {editingId === todo.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'edit')}
                      className={cn(
                        "flex-grow p-2 rounded focus:outline-none mr-2",
                        useNeumorphism 
                          ? "input-neumorph" 
                          : "border border-[#e2e8f0] dark:border-[#334155] dark:bg-[#0f172a] dark:text-white"
                      )}
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateTodo}
                      className={cn(
                        "p-2 rounded mr-2",
                        useNeumorphism 
                          ? "button-neumorph" 
                          : "bg-[#22c55e] hover:bg-[#16a34a] text-white"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={cn(
                        "p-2 rounded",
                        useNeumorphism 
                          ? "button-neumorph" 
                          : "bg-[#ef4444] hover:bg-[#dc2626] text-white"
                      )}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-grow">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                        className={cn(
                          "h-5 w-5 rounded mr-3",
                          useNeumorphism 
                            ? "checkbox-neumorph" 
                            : "text-[#3b82f6] border-[#e2e8f0] dark:border-[#334155] focus:ring-[#3b82f6]"
                        )}
                      />
                      <span
                        className={cn(
                          "flex-grow dark:text-white",
                          todo.completed && "line-through text-[#94a3b8] dark:text-[#64748b]"
                        )}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex ml-2">
                      <button
                        onClick={() => handleEdit(todo)}
                        className={cn(
                          "p-2 rounded mr-2",
                          useNeumorphism 
                            ? "button-neumorph" 
                            : "text-[#3b82f6] hover:bg-[#e2e8f0] dark:hover:bg-[#334155]"
                        )}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className={cn(
                          "p-2 rounded",
                          useNeumorphism 
                            ? "button-neumorph" 
                            : "text-[#ef4444] hover:bg-[#e2e8f0] dark:hover:bg-[#334155]"
                        )}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-[#94a3b8] dark:text-[#64748b] italic">
            No tasks to display.
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-[#64748b] dark:text-[#94a3b8]">
          <span>{remainingCount} item{remainingCount !== 1 ? 's' : ''} left</span>
          {todos.some(todo => todo.completed) && (
            <button
              onClick={handleClearCompleted}
              className={cn(
                "px-3 py-1 rounded",
                useNeumorphism 
                  ? "button-neumorph-small" 
                  : "hover:bg-[#e2e8f0] dark:hover:bg-[#334155]"
              )}
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 