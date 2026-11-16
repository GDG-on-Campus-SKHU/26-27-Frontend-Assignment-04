import { useState, useRef } from "react";
import type { ChangeEvent, ClipboardEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import { fakeSignupApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import type { Track } from "../types/user";
import {
  Card,
  Title,
  Subtitle,
  Form,
  Field,
  Label,
  Input,
  RadioGroup,
  RadioLabel,
  CheckboxLabel,
  SubmitButton,
  ErrorMessage,
  BottomText,
  BottomLink,
} from "../styles/formStyles";

interface SignupFormState {
  username: string;
  password: string;
  passwordConfirm: string;
  showPassword: boolean;
  interest: Track;
  agreed: boolean;
}

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  // 모든 폼 입력값을 객체 상태 하나로 관리 (도전 과제 1: 비밀번호 보기 포함)
  const [form, setForm] = useState<SignupFormState>({
    username: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    interest: "frontend",
    agreed: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 모든 입력 요소 공통 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 비밀번호 확인 칸 붙여넣기 방지
  const handleBlockPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // 회원가입 제출 처리
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      window.alert("비밀번호가 일치하지 않습니다.");
      passwordConfirmRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const { user, accessToken } = await fakeSignupApi(
        form.username,
        form.password,
        form.interest,
      );

      window.alert(`${user.userId}님, 가입을 환영합니다!`);
      login(user, accessToken);
      navigate("/todos/all", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(message);
      usernameRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = form.agreed && !isLoading;

  return (
    <Card>
      <Title>회원가입</Title>
      <Subtitle>서비스 이용을 위해 회원 정보를 입력해 주세요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <Field>
          <Label htmlFor="username">아이디</Label>
          <Input
            ref={usernameRef}
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="4~12자 영문, 숫자"
            required
            minLength={4}
            maxLength={12}
            pattern="[A-Za-z0-9]{4,12}"
            title="아이디는 4~12자의 영문과 숫자만 입력해 주세요."
          />
        </Field>

        {/* 비밀번호 */}
        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type={form.showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="8자 이상 입력"
            required
            minLength={8}
          />
        </Field>

        {/* 비밀번호 확인 */}
        <Field>
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <Input
            ref={passwordConfirmRef}
            id="passwordConfirm"
            type={form.showPassword ? "text" : "password"}
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            onPaste={handleBlockPaste}
            placeholder="비밀번호 재입력"
            required
          />
        </Field>

        {/* 도전 과제 1: 비밀번호 보기 체크박스 */}
        <CheckboxLabel>
          <input
            type="checkbox"
            name="showPassword"
            checked={form.showPassword}
            onChange={handleChange}
          />
          비밀번호 보기
        </CheckboxLabel>

        {/* 관심 분야 */}
        <Field>
          <Label as="span">관심 분야</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="interest"
                value="frontend"
                checked={form.interest === "frontend"}
                onChange={handleChange}
              />
              프론트엔드
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="interest"
                value="backend"
                checked={form.interest === "backend"}
                onChange={handleChange}
              />
              백엔드
            </RadioLabel>
          </RadioGroup>
        </Field>

        {/* 약관 동의 */}
        <CheckboxLabel>
          <input
            type="checkbox"
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
          />
          이용약관에 동의합니다.
        </CheckboxLabel>

        <SubmitButton
          type="submit"
          disabled={!canSubmit}
          $active={canSubmit}
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </SubmitButton>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      <BottomText>
        이미 계정이 있으신가요?
        <BottomLink to="/login">로그인</BottomLink>
      </BottomText>
    </Card>
  );
}
