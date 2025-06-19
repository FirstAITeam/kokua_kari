import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AddressContextProps {
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  groupType: string;
  setGroupType: (group: string) => void;
}

const AddressContext = createContext<AddressContextProps | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [currentAddress, setCurrentAddress] = useState("");
  const [groupType, setGroupType] = useState("");

  useEffect(() => {
    console.log("AddressProvider mounted");
    return () => {
      console.log("AddressProvider unmounted");
    };
  }, []);

  return (
    <AddressContext.Provider value={{ currentAddress, setCurrentAddress, groupType, setGroupType }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
