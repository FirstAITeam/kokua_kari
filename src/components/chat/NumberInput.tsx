
import React from 'react';
import { Input } from "../ui/input";

interface NumberInputProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  min = 0,
  max,
}) => {
  // 入力フィールドに表示する値
  const displayValue = value === '' ? '' : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 入力が空の場合
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // 数値以外の入力は無視
    if (!/^\d+$/.test(inputValue)) {
      return;
    }
    
    const numericValue = parseInt(inputValue, 10);
    
    // 最小値以上であることを確認
    if (min !== undefined && numericValue < min) {
      return;
    }
    
    // 最大値以下であることを確認
    if (max !== undefined && numericValue > max) {
      return;
    }
    
    // 有効な数値なので親コンポーネントに通知
    onChange(numericValue);
  };

  // デバッグ用
  console.log(`NumberInput rendering with value: ${displayValue}, type: ${typeof value}`);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="pr-10 bg-white"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};
