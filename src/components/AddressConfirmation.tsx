import React, { useEffect, useState } from 'react';
import { useAddressSearch } from '@/hooks/useAddressSearch';

interface Props {
  address: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AddressConfirmation: React.FC<Props> = ({
  address,
  onConfirm,
  onCancel
}) => {
  const {
    searchAddress,
    isLoading,
    isConfirmed,
    confirmAddress,
    resetConfirmation
  } = useAddressSearch();
  const [searchResult, setSearchResult] = useState<{ address?: string; error?: string } | null>(null);

  useEffect(() => {
    const search = async () => {
      const result = await searchAddress(address);
      setSearchResult(result);
    };
    search();
  }, [address]);

  const handleConfirm = () => {
    if (searchResult?.address) {
      confirmAddress();
      onConfirm();
    }
  };

  const handleCancel = () => {
    resetConfirmation();
    onCancel();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <p className="text-lg">住所を検索中...</p>
      </div>
    );
  }

  if (searchResult?.error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <p className="mb-4 text-lg font-medium text-red-600">{searchResult.error}</p>
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          住所を再入力
        </button>
      </div>
    );
  }

  if (!searchResult?.address) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <p className="mb-4 text-lg font-medium text-red-600">住所が見つかりませんでした</p>
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          住所を再入力
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
      <p className="mb-4 text-lg font-medium">入力された住所：{searchResult.address}</p>
      <p className="mb-6 text-gray-600">この住所でよろしいですか？</p>
      <div className="flex gap-4">
        <button
          onClick={handleConfirm}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          はい
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          いいえ
        </button>
      </div>
    </div>
  );
};
