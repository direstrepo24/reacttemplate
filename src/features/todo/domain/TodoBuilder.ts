import { Todo } from './Todo';

/**
 * Implementation of the Builder pattern for the Todo entity
 */
class TodoBuilder {
  private todo: Partial<Todo>;

  constructor() {
    this.todo = {};
  }

  withId(id: string): TodoBuilder {
    this.todo.id = id;
    return this;
  }

  withText(text: string): TodoBuilder {
    this.todo.text = text;
    return this;
  }

  withCompleted(completed: boolean): TodoBuilder {
    this.todo.completed = completed;
    return this;
  }

  withCreatedAt(createdAt: Date): TodoBuilder {
    this.todo.createdAt = createdAt;
    return this;
  }

  build(): Todo {
    // Ensure all required properties are set
    if (!this.todo.id || !this.todo.text || this.todo.completed === undefined || !this.todo.createdAt) {
      throw new Error('Todo is missing required properties');
    }
    
    return this.todo as Todo;
  }
}

export function createTodoBuilder(): TodoBuilder {
  return new TodoBuilder();
} 