import { useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import { useAuthStore } from "../store/useAuthStore";
import type { Track } from "../types/user";
import {
  Card,
  Title,
  Subtitle,
  Form,
  Field,
  Label,
  SubmitButton,
} from "../styles/formStyles";

const ProfileRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 20px;
  margin-bottom: 28px;
`;

const InfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 20px 28px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
`;

const InfoLabel = styled.span`
  width: 76px;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-weight: 700;
  color: #0f172a;
`;

const TrackBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
`;

const PhotoBox = styled.div`
  width: 260px;
  min-height: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
  font-size: 13px;
`;

const PhotoIcon = styled.span`
  font-size: 28px;
  line-height: 1;
  color: #94a3b8;
`;

const PhotoButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0 0 24px;
`;

const TrackChipGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const TrackChipCard = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  background-color: ${({ $selected }) => ($selected ? "#eff6ff" : "#ffffff")};
  color: ${({ $selected }) => ($selected ? "#1d4ed8" : "#334155")};
  font-size: 15px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#3b82f6" : "#cbd5e1")};
    background-color: ${({ $selected }) => ($selected ? "#eff6ff" : "#f8fafc")};
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const ChipCheckIcon = styled.span<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#cbd5e1")};
  background-color: ${({ $selected }) => ($selected ? "#3b82f6" : "#ffffff")};
  color: ${({ $selected }) => ($selected ? "#ffffff" : "transparent")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
`;

const trackOptions: { value: Track; label: string }[] = [
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
];

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const updateTrack = useAuthStore((state) => state.updateTrack);

  const [selectedTrack, setSelectedTrack] = useState<Track>(
    user?.track ?? "frontend",
  );

  if (!user) {
    return null;
  }

  const trackLabel = user.track === "frontend" ? "프론트엔드" : "백엔드";
  const isTrackChanged = selectedTrack !== user.track;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isTrackChanged) return;

    updateTrack(selectedTrack);
    window.alert("관심 분야를 변경했습니다.");
  };

  return (
    <Card>
      <Title>마이페이지</Title>
      <Subtitle>내 계정 정보를 확인하고 관심 분야를 변경할 수 있습니다.</Subtitle>

      <ProfileRow>
        <InfoBox>
          <InfoRow>
            <InfoLabel>아이디</InfoLabel>
            <InfoValue>{user.userId}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>관심 분야</InfoLabel>
            <TrackBadge>{trackLabel}</TrackBadge>
          </InfoRow>
        </InfoBox>

        <PhotoBox>
          <PhotoIcon>+</PhotoIcon>
          <span>프로필 사진</span>
          <PhotoButton type="button">사진 추가</PhotoButton>
        </PhotoBox>
      </ProfileRow>

      <Divider />

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label as="span">관심 분야 변경</Label>
          <TrackChipGroup>
            {trackOptions.map((option) => {
              const isSelected = selectedTrack === option.value;
              return (
                <TrackChipCard key={option.value} $selected={isSelected}>
                  <HiddenRadio
                    type="radio"
                    name="track"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelectedTrack(option.value)}
                  />
                  <span>{option.label}</span>
                  <ChipCheckIcon $selected={isSelected} aria-hidden="true">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </ChipCheckIcon>
                </TrackChipCard>
              );
            })}
          </TrackChipGroup>
        </Field>

        <SubmitButton
          type="submit"
          disabled={!isTrackChanged}
          $active={isTrackChanged}
        >
          저장
        </SubmitButton>
      </Form>
    </Card>
  );
}
