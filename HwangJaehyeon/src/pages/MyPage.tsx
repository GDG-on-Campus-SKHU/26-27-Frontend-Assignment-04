import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import type { Track } from '../types/user';
import { Card } from '../components/ui';
import { Form, Interests, SubmitButton } from '../components/formStyles';

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const updateTrack = useAuthStore((state) => state.updateTrack);
  const [track, setTrack] = useState<Track>(user?.track ?? 'frontend');

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (track === user?.track) return;
    updateTrack(track);
    window.alert('관심 분야를 변경했습니다.');
  }

  return <Card>
    <h1>마이페이지</h1>
    <p>아이디 {user?.userId}</p>
    <p>관심 분야 {user?.track === 'frontend' ? '프론트엔드' : '백엔드'}</p>
    <Form onSubmit={handleSubmit}>
      <Interests><legend>관심 분야 변경</legend>
        <label><input type="radio" name="track" checked={track === 'frontend'} onChange={() => setTrack('frontend')} />프론트엔드</label>
        <label><input type="radio" name="track" checked={track === 'backend'} onChange={() => setTrack('backend')} />백엔드</label>
      </Interests>
      <SubmitButton disabled={track === user?.track}>저장</SubmitButton>
    </Form>
  </Card>;
}
