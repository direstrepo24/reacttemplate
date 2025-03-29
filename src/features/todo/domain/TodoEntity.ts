/**
 * Entidad de dominio para ToDo usando inmutabilidad y programación funcional
 */

// Enumeración para el estado del ToDo
export enum TodoStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

// Entidad de dominio con tipos inmutables
export type TodoEntity = Readonly<{
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}>;

// Factoría para crear una nueva entidad ToDo
export const createTodo = (
  title: string,
  description?: string
): TodoEntity => {
  const now = new Date();
  
  return {
    id: `todo-${Date.now()}`, // Generamos un ID simple basado en timestamp
    title,
    description,
    status: TodoStatus.PENDING,
    createdAt: now,
    updatedAt: now,
    completedAt: undefined
  };
};

// Funciones puras para operaciones con ToDos

// Completar un ToDo (sin mutación)
export const completeTodo = (todo: TodoEntity): TodoEntity => {
  const now = new Date();
  
  // Si ya está completo, retornamos el mismo objeto
  if (todo.status === TodoStatus.COMPLETED) {
    return todo;
  }
  
  // Creamos un nuevo objeto con el estado actualizado
  return {
    ...todo,
    status: TodoStatus.COMPLETED,
    updatedAt: now,
    completedAt: now
  };
};

// Reactivar un ToDo completado
export const reactivateTodo = (todo: TodoEntity): TodoEntity => {
  // Si ya está pendiente, retornamos el mismo objeto
  if (todo.status === TodoStatus.PENDING) {
    return todo;
  }
  
  // Creamos un nuevo objeto con el estado actualizado
  return {
    ...todo,
    status: TodoStatus.PENDING,
    updatedAt: new Date(),
    completedAt: undefined
  };
};

// Actualizar el título de un ToDo
export const updateTodoTitle = (
  todo: TodoEntity, 
  newTitle: string
): TodoEntity => {
  // Si es el mismo título, retornamos el mismo objeto
  if (todo.title === newTitle) {
    return todo;
  }
  
  // Creamos un nuevo objeto con el título actualizado
  return {
    ...todo,
    title: newTitle,
    updatedAt: new Date()
  };
};

// Actualizar la descripción de un ToDo
export const updateTodoDescription = (
  todo: TodoEntity, 
  newDescription?: string
): TodoEntity => {
  // Si es la misma descripción, retornamos el mismo objeto
  if (todo.description === newDescription) {
    return todo;
  }
  
  // Creamos un nuevo objeto con la descripción actualizada
  return {
    ...todo,
    description: newDescription,
    updatedAt: new Date()
  };
}; 