/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Todo } from "../types";
import { useAuthStore } from "../store/useAuthStore";

export interface TodoContextValue {
  todos: Todo[];
  isNameAsc: boolean;
  isTimeAsc: boolean;
  addTodo: (text: string, dueDate?: string) => void;
  toggleTodo: (id: number) => void;
  editTodo: (id: number, text: string, dueDate?: string) => void;
  deleteTodo: (id: number) => void;
  sortByName: () => void;
  sortByTime: () => void;
  clearDone: () => void;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

function isTodoItem(item: unknown): item is Todo {
  if (typeof item !== "object" || item === null) return false;
  const record = item as Record<string, unknown>;
  return (
    typeof record.id === "number" &&
    typeof record.text === "string" &&
    typeof record.done === "boolean" &&
    (record.dueDate === undefined || typeof record.dueDate === "string")
  );
}

function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodoItem);
}

function loadTodosFromStorage(storageKey: string | null): Todo[] {
  if (!storageKey) return [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (isTodoArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

interface TodoProviderInnerProps {
  storageKey: string | null;
  children: ReactNode;
}

function TodoProviderInner({ storageKey, children }: TodoProviderInnerProps) {
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadTodosFromStorage(storageKey),
  );
  const [isNameAsc, setIsNameAsc] = useState(true);
  const [isTimeAsc, setIsTimeAsc] = useState(true);

  // 할 일 목록이 바뀔 때마다 현재 사용자의 localStorage에 저장
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [storageKey, todos]);

  const addTodo = (text: string, dueDate?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const normalizedDueDate = dueDate?.trim() ? dueDate.trim() : undefined;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false, dueDate: normalizedDueDate },
    ]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const editTodo = (id: number, text: string, dueDate?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const normalizedDueDate = dueDate?.trim() ? dueDate.trim() : undefined;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: trimmed, dueDate: normalizedDueDate }
          : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const sortByName = () => {
    setTodos((prev) =>
      [...prev].sort((a, b) =>
        isNameAsc
          ? a.text.localeCompare(b.text, "ko")
          : b.text.localeCompare(a.text, "ko"),
      ),
    );
    setIsNameAsc((prev) => !prev);
  };

  const sortByTime = () => {
    setTodos((prev) =>
      [...prev].sort((a, b) => {
        if (a.dueDate === undefined && b.dueDate === undefined) return 0;
        if (a.dueDate === undefined) return 1;
        if (b.dueDate === undefined) return -1;
        return isTimeAsc
          ? a.dueDate.localeCompare(b.dueDate)
          : b.dueDate.localeCompare(a.dueDate);
      }),
    );
    setIsTimeAsc((prev) => !prev);
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isNameAsc,
        isTimeAsc,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        sortByName,
        sortByTime,
        clearDone,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const storageKey = user ? `todos-${user.id}` : null;

  return (
    <TodoProviderInner key={storageKey ?? "guest"} storageKey={storageKey}>
      {children}
    </TodoProviderInner>
  );
}

export function useTodos(): TodoContextValue {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos는 TodoProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
