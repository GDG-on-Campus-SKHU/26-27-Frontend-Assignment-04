import { createContext } from 'react';
import type { Todo } from '../types';

interface TodoContextValue {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
  sortTodos: () => void;
  clearDoneTodos: () => void;
}

export const TodoContext = createContext<TodoContextValue | undefined>(undefined);

