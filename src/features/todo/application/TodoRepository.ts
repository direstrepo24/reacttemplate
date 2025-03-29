import { TodoEntity } from '../domain/TodoEntity';

/**
 * Interfaz del repositorio para operaciones con ToDos
 * Define un contrato que cualquier implementación debe cumplir
 */
export interface TodoRepository {
  // Operaciones CRUD básicas
  getAll(): Promise<TodoEntity[]>;
  getById(id: string): Promise<TodoEntity | null>;
  save(todo: TodoEntity): Promise<TodoEntity>;
  delete(id: string): Promise<boolean>;
  
  // Operaciones de consulta
  findByStatus(status: string): Promise<TodoEntity[]>;
  findByTitle(title: string): Promise<TodoEntity[]>;
}

/**
 * Implementación en memoria del repositorio de ToDos
 * Útil para desarrollo y pruebas
 */
export class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, TodoEntity> = new Map();
  
  // Obtener todos los ToDos
  async getAll(): Promise<TodoEntity[]> {
    return Array.from(this.todos.values());
  }
  
  // Obtener un ToDo por su ID
  async getById(id: string): Promise<TodoEntity | null> {
    const todo = this.todos.get(id);
    return todo || null;
  }
  
  // Guardar un ToDo (crear o actualizar)
  async save(todo: TodoEntity): Promise<TodoEntity> {
    this.todos.set(todo.id, todo);
    return todo;
  }
  
  // Eliminar un ToDo
  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
  
  // Encontrar ToDos por estado
  async findByStatus(status: string): Promise<TodoEntity[]> {
    return Array.from(this.todos.values())
      .filter(todo => todo.status === status);
  }
  
  // Encontrar ToDos por título (búsqueda parcial)
  async findByTitle(title: string): Promise<TodoEntity[]> {
    const lowerTitle = title.toLowerCase();
    return Array.from(this.todos.values())
      .filter(todo => todo.title.toLowerCase().includes(lowerTitle));
  }
}

/**
 * Implementación con localStorage del repositorio de ToDos
 * Útil para persistencia en el navegador
 */
export class LocalStorageTodoRepository implements TodoRepository {
  private readonly storageKey = 'todos';
  
  // Método privado para cargar ToDos desde localStorage
  private loadTodos(): Map<string, TodoEntity> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return new Map();
      
      const todos: TodoEntity[] = JSON.parse(data, (key, value) => {
        // Convertir strings de fecha a objetos Date
        if (key === 'createdAt' || key === 'updatedAt' || key === 'completedAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      
      return new Map(todos.map(todo => [todo.id, todo]));
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return new Map();
    }
  }
  
  // Método privado para guardar ToDos en localStorage
  private saveTodos(todos: Map<string, TodoEntity>): void {
    try {
      const data = JSON.stringify(Array.from(todos.values()));
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }
  
  // Obtener todos los ToDos
  async getAll(): Promise<TodoEntity[]> {
    const todos = this.loadTodos();
    return Array.from(todos.values());
  }
  
  // Obtener un ToDo por su ID
  async getById(id: string): Promise<TodoEntity | null> {
    const todos = this.loadTodos();
    const todo = todos.get(id);
    return todo || null;
  }
  
  // Guardar un ToDo (crear o actualizar)
  async save(todo: TodoEntity): Promise<TodoEntity> {
    const todos = this.loadTodos();
    todos.set(todo.id, todo);
    this.saveTodos(todos);
    return todo;
  }
  
  // Eliminar un ToDo
  async delete(id: string): Promise<boolean> {
    const todos = this.loadTodos();
    const deleted = todos.delete(id);
    if (deleted) {
      this.saveTodos(todos);
    }
    return deleted;
  }
  
  // Encontrar ToDos por estado
  async findByStatus(status: string): Promise<TodoEntity[]> {
    const todos = this.loadTodos();
    return Array.from(todos.values())
      .filter(todo => todo.status === status);
  }
  
  // Encontrar ToDos por título (búsqueda parcial)
  async findByTitle(title: string): Promise<TodoEntity[]> {
    const todos = this.loadTodos();
    const lowerTitle = title.toLowerCase();
    return Array.from(todos.values())
      .filter(todo => todo.title.toLowerCase().includes(lowerTitle));
  }
} 