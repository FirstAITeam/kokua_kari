
import React, { useEffect } from 'react';
import { NumberInput } from "./NumberInput";
import { useAddress } from "@/contexts/AddressContext";

interface PeopleInputFormProps {
  selectedOrgType: string | null;
  peopleCount: number | '';
  setPeopleCount: (value: number | '') => void;
  peoplePercent: number | '';
  setPeoplePercent: (value: number | '') => void;
  visitorCount: number | '';
  setVisitorCount: (value: number | '') => void;
  studentCount: number | '';
  setStudentCount: (value: number | '') => void;
  handleSubmit: () => void;
}

export const PeopleInputForm: React.FC<PeopleInputFormProps> = ({
  selectedOrgType,
  peopleCount,
  setPeopleCount,
  peoplePercent,
  setPeoplePercent,
  visitorCount,
  setVisitorCount,
  studentCount,
  setStudentCount,
  handleSubmit
}) => {
  // AddressContext の groupType で法人形態を管理する
  const { groupType, setGroupType } = useAddress();

  // デバッグ用
  console.log(`PeopleInputForm rendering with peopleCount: ${peopleCount}, type: ${typeof peopleCount}`);

  // selectedOrgType が変更されたら groupType にセットする例
  useEffect(() => {
    if (selectedOrgType) {
      setGroupType(selectedOrgType);
    }
  }, [selectedOrgType, setGroupType]);

  const isSubmitDisabled = () => {
    if (selectedOrgType === '民間企業 オフィス') {
      return peopleCount === '' || peoplePercent === '';
    } else if (selectedOrgType === '民間企業 店舗') {
      return peopleCount === '' || visitorCount === '';
    } else if (selectedOrgType === '自治会・自主防災組織') {
      return peopleCount === '';
    } else if (selectedOrgType === '教育機関') {
      return peopleCount === '' || studentCount === '';
    }
    return true;
  };

  return (
    <div className="px-4 pb-4">
      <div className="bg-white p-4 rounded-lg border border-[#40414F]/20">
        <div className="grid gap-4">
          {selectedOrgType === '民間企業 オフィス' && (
            <>
              <NumberInput 
                label="従業員数"
                value={peopleCount}
                onChange={setPeopleCount}
                placeholder="例: 100"
                suffix="人"
              />
              <NumberInput 
                label="出社率"
                value={peoplePercent}
                onChange={setPeoplePercent}
                placeholder="例: 50"
                suffix="%"
                max={100}
              />
            </>
          )}
          {selectedOrgType === '民間企業 店舗' && (
            <>
              <NumberInput 
                label="従業員数"
                value={peopleCount}
                onChange={setPeopleCount}
                placeholder="例: 15"
                suffix="人"
              />
              <NumberInput 
                label="店舗利用者数(平均)"
                value={visitorCount}
                onChange={setVisitorCount}
                placeholder="例: 100"
                suffix="人"
              />
            </>
          )}
          {selectedOrgType === '自治会・自主防災組織' && (
            <NumberInput 
              label="自治会所属人数"
              value={peopleCount}
              onChange={setPeopleCount}
              placeholder="例: 500"
              suffix="人"
            />
          )}
          {selectedOrgType === '教育機関' && (
            <>
              <NumberInput 
                label="教職員数"
                value={peopleCount}
                onChange={setPeopleCount}
                placeholder="例: 50"
                suffix="人"
              />
              <NumberInput 
                label="学生/子供数"
                value={studentCount}
                onChange={setStudentCount}
                placeholder="例: 500"
                suffix="人"
              />
            </>
          )}
          <button
            onClick={handleSubmit}
            className="bg-[#40414F] text-white py-2 px-4 rounded-lg mt-2 hover:bg-[#40414F]/80 transition-colors"
            disabled={isSubmitDisabled()}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};
