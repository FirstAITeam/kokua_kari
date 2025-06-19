import { useState } from 'react';

interface AddressSearchResult {
  exists: boolean;
  address?: string;
  error?: string;
}

export const useAddressSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const searchAddress = async (address: string): Promise<AddressSearchResult> => {
    setIsLoading(true);
    setIsConfirmed(false);
    try {
      console.log('住所検索リクエスト送信:', address);
      const response = await fetch(`/api/address-search?address=${encodeURIComponent(address)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('住所検索結果:', data);
      return data;
    } catch (error) {
      console.error('Address search error:', error);
      return {
        exists: false,
        error: error instanceof Error ? error.message : '住所検索中にエラーが発生しました'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAddress = () => {
    setIsConfirmed(true);
  };

  const resetConfirmation = () => {
    setIsConfirmed(false);
  };

  return {
    searchAddress,
    isLoading,
    isConfirmed,
    confirmAddress,
    resetConfirmation
  };
};
