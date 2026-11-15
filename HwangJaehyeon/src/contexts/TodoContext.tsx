import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Todo } from '../types';
import { TodoContext } from './todoContextValue';

function loadTodos(key: string): Todo[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (Array.isArray(value) && value.every((item: unknown) =>
      typeof item === 'object' && item !== null &&
      'id' in item && typeof item.id === 'number' && Number.isFinite(item.id) &&
      'text' in item && typeof item.text === 'string' &&
      'done' in item && typeof item.done === 'boolean') &&
      new Set(value.map((item) => item.id)).size === value.length) {
      return value;
    }
  } catch {
    // 저장된 JSON이 깨져 있어도 할 일 화면은 빈 목록으로 열 수 있다.
  }
  return [];
}

export default function TodoProvider({ userId, children }: { userId: number; children: ReactNode }) {
  const key = `todos-${userId}`;
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(key));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(todos));
  }, [key, todos]);

  function addTodo(input: string) {
    const text = input.trim();
    if (!text) return;
    setTodos((previous) => {
      // 같은 밀리초에 추가해도 React key가 중복되지 않도록 한다.
      const id = Math.max(Date.now(), ...previous.map((todo) => todo.id + 1));
      return [...previous, { id, text, done: false }];
    });
  }
  function toggleTodo(id: number) {
    setTodos((previous) => previous.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo));
  }
  function editTodo(id: number, input: string) {
    const text = input.trim();
    if (!text) return;
    setTodos((previous) => previous.map((todo) => todo.id === id ? { ...todo, text } : todo));
  }
  function deleteTodo(id: number) {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  }
  function sortTodos() {
    setTodos((previous) => [...previous].sort((a, b) => a.text.localeCompare(b.text, 'ko')));
  }
  function clearDoneTodos() {
    setTodos((previous) => previous.filter((todo) => !todo.done));
  }
  return <TodoContext.Provider value={{ todos, addTodo, toggleTodo, editTodo, deleteTodo, sortTodos, clearDoneTodos }}>{children}</TodoContext.Provider>;
}
