import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { useTodos } from "../contexts/TodoContext";

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  background-color: #ffffff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
  }
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? "#3b82f6" : "#cbd5e1")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64748b")};
  font-size: 15px;
  font-weight: 700;
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

export default function TodoForm() {
  const { addTodo } = useTodos();
  const { filter } = useParams<{ filter: string }>();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = text.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    addTodo(trimmed, dueDate || undefined);
    setText("");
    setDueDate("");
    inputRef.current?.focus();

    if (filter !== "all") {
      navigate("/todos/all");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="새로운 할 일을 입력하세요"
      />
      <DateInput
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="마감일"
      />
      <SubmitButton type="submit" disabled={!isValid} $active={isValid}>
        추가
      </SubmitButton>
    </Form>
  );
}
