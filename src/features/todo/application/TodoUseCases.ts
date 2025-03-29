import { 
  TodoEntity, 
  createTodo, 
  completeTodo, 
  reactivateTodo, 
  updateTodoTitle, 
  updateTodoDescription,
  TodoStatus
} from '../domain/TodoEntity';
import { TodoRepository } from './TodoRepository';

/**
 * Casos de uso para la gestión de ToDos
 * Contiene la lógica de negocio separada de la presentación
 */
export class TodoUseCases {
  constructor(private readonly repository: TodoRepository) {}
  
  /**
   * Obtener todos los ToDos
   */
  async getAllTodos(): Promise<TodoEntity[]> {
    return this.repository.getAll();
  }
  
  /**
   * Crear un nuevo ToDo
   */
  async createTodo(title: string, description?: string): Promise<TodoEntity> {
    // Creamos una nueva entidad ToDo usando la factoría
    const newTodo = createTodo(title, description);
    
    // Guardamos en el repositorio
    return this.repository.save(newTodo);
  }
  
  /**
   * Obtener un ToDo por su ID
   */
  async getTodoById(id: string): Promise<TodoEntity | null> {
    return this.repository.getById(id);
  }
  
  /**
   * Completar un ToDo
   */
  async completeTodo(id: string): Promise<TodoEntity | null> {
    // Obtenemos el ToDo del repositorio
    const todo = await this.repository.getById(id);
    
    // Si no existe, retornamos null
    if (!todo) return null;
    
    // Aplicamos la función pura para completar el ToDo
    const completedTodo = completeTodo(todo);
    
    // Guardamos en el repositorio
    return this.repository.save(completedTodo);
  }
  
  /**
   * Reactivar un ToDo completado
   */
  async reactivateTodo(id: string): Promise<TodoEntity | null> {
    // Obtenemos el ToDo del repositorio
    const todo = await this.repository.getById(id);
    
    // Si no existe, retornamos null
    if (!todo) return null;
    
    // Aplicamos la función pura para reactivar el ToDo
    const reactivatedTodo = reactivateTodo(todo);
    
    // Guardamos en el repositorio
    return this.repository.save(reactivatedTodo);
  }
  
  /**
   * Cambiar el estado de un ToDo (toggle)
   */
  async toggleTodoStatus(id: string): Promise<TodoEntity | null> {
    // Obtenemos el ToDo del repositorio
    const todo = await this.repository.getById(id);
    
    // Si no existe, retornamos null
    if (!todo) return null;
    
    // Dependiendo del estado actual, lo completamos o reactivamos
    const updatedTodo = todo.status === TodoStatus.PENDING
      ? completeTodo(todo)
      : reactivateTodo(todo);
    
    // Guardamos en el repositorio
    return this.repository.save(updatedTodo);
  }
  
  /**
   * Actualizar el título de un ToDo
   */
  async updateTodoTitle(id: string, newTitle: string): Promise<TodoEntity | null> {
    // Obtenemos el ToDo del repositorio
    const todo = await this.repository.getById(id);
    
    // Si no existe, retornamos null
    if (!todo) return null;
    
    // Aplicamos la función pura para actualizar el título
    const updatedTodo = updateTodoTitle(todo, newTitle);
    
    // Guardamos en el repositorio
    return this.repository.save(updatedTodo);
  }
  
  /**
   * Actualizar la descripción de un ToDo
   */
  async updateTodoDescription(id: string, newDescription?: string): Promise<TodoEntity | null> {
    // Obtenemos el ToDo del repositorio
    const todo = await this.repository.getById(id);
    
    // Si no existe, retornamos null
    if (!todo) return null;
    
    // Aplicamos la función pura para actualizar la descripción
    const updatedTodo = updateTodoDescription(todo, newDescription);
    
    // Guardamos en el repositorio
    return this.repository.save(updatedTodo);
  }
  
  /**
   * Eliminar un ToDo
   */
  async deleteTodo(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
  
  /**
   * Obtener ToDos por estado
   */
  async getTodosByStatus(status: TodoStatus): Promise<TodoEntity[]> {
    return this.repository.findByStatus(status);
  }
  
  /**
   * Buscar ToDos por título
   */
  async searchTodosByTitle(title: string): Promise<TodoEntity[]> {
    return this.repository.findByTitle(title);
  }
} 