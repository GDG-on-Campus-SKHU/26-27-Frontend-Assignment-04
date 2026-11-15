import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';
import styled from 'styled-components';
import TodoAddForm from '../components/TodoAddForm';
import TodoFilters from '../components/TodoFilters';
import TodoList from '../components/TodoList';
import TodoSummary from '../components/TodoSummary';
import { Button, Card } from '../components/ui';
import { useTodos } from '../contexts/useTodos';

const Description = styled.p`
  /* 설명은 제목보다 옅은 색으로 표시. */
  margin: 0 0 24px;
  color: #566173;
`;

const Celebration = styled.p`
  /* 모두 완료했을 경우, 연한 초록배경. + 가운데 정렬처리함. */
  padding: 12px;
  border-radius: 8px;
  color: #166534;
  background: #ecfdf3;
  text-align: center;
`;

const ClearButton = styled(Button)`
  /* 일괄 삭제 버튼은 목록 아래 가운데에 배치. 삭제 글자는 빨간색으로 표시되게 처리함. */
  display: block;
  margin: 16px auto 0;
  color: #b42318;
`;

export default function TodoPage() {
  const { todos, sortTodos, clearDoneTodos } = useTodos();
  const { filter } = useParams();

  const doneCount = todos.filter((todo) => todo.done).length;
  const activeCount = todos.length - doneCount;
  const allDone = todos.length > 0 && activeCount === 0;

  useEffect(() => {
    document.title = activeCount > 0 ? `할 일 ${activeCount}개 남음` : '오늘의 할 일';

    return () => {
      document.title = '오늘의 할 일';
    };
  }, [activeCount]);

  if (filter !== 'all' && filter !== 'active' && filter !== 'done') {
    return <Navigate to="/todos/all" replace />;
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
    return true;
  });

  let emptyMessage = '';
  let emptyDescription = '';

  if (todos.length === 0) {
    emptyMessage = '아직 등록된 할 일이 없어요';
    emptyDescription = '위 입력창에 할 일을 입력하고 [추가] 버튼을 눌러 보세요.';
  } else if (filter === 'active') {
    emptyMessage = '진행 중인 할 일이 없어요';
  } else if (filter === 'done') {
    emptyMessage = '완료한 할 일이 없어요';
  }


  return (
    <Card aria-labelledby="todo-title">
      <h1 id="todo-title">오늘의 할 일</h1>
      <Description>작은 일부터 하나씩 완료해 보세요.</Description>

      <TodoAddForm />

      <TodoSummary totalCount={todos.length} doneCount={doneCount} onSort={sortTodos} />

      <TodoFilters filter={filter} />

      {allDone && <Celebration role="status">모든 할 일을 완료했어요!</Celebration>}

      <TodoList
        todos={visibleTodos}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
      />

      {doneCount > 0 && (
        <ClearButton type="button" onClick={clearDoneTodos}>
          완료한 할 일 지우기 ({doneCount})
        </ClearButton>
      )}
    </Card>
  );
}
