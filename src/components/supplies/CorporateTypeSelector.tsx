
import React from 'react';
import { Card } from "@/components/ui/card";
import { useSupplies } from '@/contexts/SuppliesContext';
import { Building, Store, School, Users } from 'lucide-react';

export const CorporateTypeSelector: React.FC = () => {
  const { selectedCorporateType, setSelectedCorporateType } = useSupplies();

  const corporateTypes = [
    { id: 1, name: '民間企業オフィス', icon: Building },
    { id: 2, name: '民間企業店舗', icon: Store },
    { id: 3, name: '教育機関', icon: School },
    { id: 4, name: '自治会・自主防災組織', icon: Users }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">法人形態を選択</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {corporateTypes.map((type) => (
          <Card 
            key={type.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg 
              ${selectedCorporateType === type.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setSelectedCorporateType(type.id)}
          >
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <type.icon className={`h-8 w-8 mb-2 ${selectedCorporateType === type.id ? 'text-blue-500' : 'text-gray-600'}`} />
              <p className="font-medium">{type.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
