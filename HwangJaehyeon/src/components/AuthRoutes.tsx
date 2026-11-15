import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';
import TodoProvider from '../contexts/TodoContext';

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to="/todos/all" replace /> : <Outlet />;
}

export default function TodoLayout() {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  // 사용자 id를 key로 두어 계정이 바뀌면 해당 사용자의 목록을 새로 읽는다.
  return <TodoProvider key={user.id} userId={user.id}><Outlet /></TodoProvider>;
}
