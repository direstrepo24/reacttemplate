/**
 * Simple Todo model used in the presentation layer
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
} 