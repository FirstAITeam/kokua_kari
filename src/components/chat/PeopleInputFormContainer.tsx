
import React from 'react';
import { PeopleInputForm } from "./PeopleInputForm";

interface PeopleInputFormContainerProps {
  selectedOrgType: string | null;
  peopleCount: number | '';
  setPeopleCount: (value: number | '') => void;
  peoplePercent: number | '';
  setPeoplePercent: (value: number | '') => void;
  visitorCount: number | '';
  setVisitorCount: (value: number | '') => void;
  studentCount: number | '';
  setStudentCount: (value: number | '') => void;
  handlePeopleInputSubmit: () => void;
  awaitingPeopleInput: boolean;
}

export const PeopleInputFormContainer: React.FC<PeopleInputFormContainerProps> = ({
  selectedOrgType,
  peopleCount,
  setPeopleCount,
  peoplePercent,
  setPeoplePercent,
  visitorCount,
  setVisitorCount,
  studentCount,
  setStudentCount,
  handlePeopleInputSubmit,
  awaitingPeopleInput
}) => {
  // awaitingPeopleInputがfalseまたはselectedOrgTypeがnullの場合は何も表示しない
  if (!awaitingPeopleInput || !selectedOrgType) {
    return null;
  }
  
  // ここでのpeopleCountはnumber | ''型なので、そのまま渡す（フォーム用の入力値）
  return (
    <PeopleInputForm
      selectedOrgType={selectedOrgType}
      peopleCount={peopleCount}
      setPeopleCount={setPeopleCount}
      peoplePercent={peoplePercent}
      setPeoplePercent={setPeoplePercent}
      visitorCount={visitorCount}
      setVisitorCount={setVisitorCount}
      studentCount={studentCount}
      setStudentCount={setStudentCount}
      handleSubmit={handlePeopleInputSubmit}
    />
  );
};
