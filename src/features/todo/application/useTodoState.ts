import { useState, useEffect, useCallback } from 'react';
import { TodoEntity, TodoStatus } from '../domain/TodoEntity';
import { TodoUseCases } from './TodoUseCases';
import { LocalStorageTodoRepository } from './TodoRepository';

// Crear una instancia del repositorio por defecto
const defaultRepository = new LocalStorageTodoRepository();

// Crear una instancia del caso de uso por defecto
const defaultUseCases = new TodoUseCases(defaultRepository);

/**
 * Hook personalizado para manejar el estado de los ToDos en React
 * Encapsula toda la lógica de interacción con el caso de uso
 */
export function useTodoState(useCases: TodoUseCases = defaultUseCases) {
  // Estado para los todos
  const [todos, setTodos] = useState<TodoEntity[]>([]);
  
  // Estado para indicar carga
  const [loading, setLoading] = useState(false);
  
  // Estado para errores
  const [error, setError] = useState<string | null>(null);
  
  // Cargar todos los todos
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await useCases.getAllTodos();
      setTodos(result);
    } catch (error) {
      setError('Error al cargar los todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [useCases]);
  
  // Crear un nuevo todo
  const createTodo = useCallback(async (title: string, description?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await useCases.createTodo(title, description);
      await loadTodos(); // Recargar la lista completa
    } catch (error) {
      setError('Error al crear el todo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Cambiar el estado de un todo (toggle)
  const toggleTodoStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await useCases.toggleTodoStatus(id);
      
      // Actualizar el estado local sin necesidad de recargar todos
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          const newStatus = todo.status === TodoStatus.PENDING 
            ? TodoStatus.COMPLETED 
            : TodoStatus.PENDING;
          
          return {
            ...todo,
            status: newStatus,
            completedAt: newStatus === TodoStatus.COMPLETED ? new Date() : undefined,
            updatedAt: new Date()
          };
        }
        return todo;
      }));
    } catch (error) {
      setError('Error al cambiar el estado del todo');
      console.error(error);
      await loadTodos(); // En caso de error, recargar para asegurar consistencia
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Actualizar un todo
  const updateTodo = useCallback(async (
    id: string, 
    data: { title?: string; description?: string }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si hay título, actualizarlo
      if (data.title !== undefined) {
        await useCases.updateTodoTitle(id, data.title);
      }
      
      // Si hay descripción, actualizarla
      if (data.description !== undefined) {
        await useCases.updateTodoDescription(id, data.description);
      }
      
      // Actualizar el estado local sin necesidad de recargar todos
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.description !== undefined ? { description: data.description } : {}),
            updatedAt: new Date()
          };
        }
        return todo;
      }));
    } catch (error) {
      setError('Error al actualizar el todo');
      console.error(error);
      await loadTodos(); // En caso de error, recargar para asegurar consistencia
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Eliminar un todo
  const deleteTodo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await useCases.deleteTodo(id);
      
      // Actualizar el estado local sin necesidad de recargar todos
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      setError('Error al eliminar el todo');
      console.error(error);
      await loadTodos(); // En caso de error, recargar para asegurar consistencia
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Buscar todos por título
  const searchTodos = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await loadTodos();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await useCases.searchTodosByTitle(searchTerm);
      setTodos(result);
    } catch (error) {
      setError('Error al buscar todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Filtrar todos por estado
  const filterByStatus = useCallback(async (status: TodoStatus | null) => {
    if (status === null) {
      await loadTodos();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await useCases.getTodosByStatus(status);
      setTodos(result);
    } catch (error) {
      setError('Error al filtrar todos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [useCases, loadTodos]);
  
  // Cargar todos al montar el componente
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);
  
  // Retornar estado y acciones
  return {
    todos,
    loading,
    error,
    createTodo,
    toggleTodoStatus,
    updateTodo,
    deleteTodo,
    searchTodos,
    filterByStatus,
    refresh: loadTodos
  };
} 