
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useSupplies } from '@/contexts/SuppliesContext';
import { useToast } from '@/hooks/use-toast';

export const PeopleCountInput: React.FC = () => {
  const { peopleCount, setPeopleCount } = useSupplies();
  const { toast } = useToast();

  const handleIncreasePeople = () => {
    setPeopleCount((prev: number) => {
      // 0の場合は初期値として5に設定
      const baseValue = prev === 0 ? 5 : prev;
      const newCount = baseValue + 5;
      toast({
        title: "人数を増やしました",
        description: `必要備蓄品の数量が${baseValue === 0 ? 0 : prev}人分から${newCount}人分に変更されました。`,
      });
      return newCount;
    });
  };
  
  const handleDecreasePeople = () => {
    setPeopleCount((prev: number) => {
      if (prev <= 5) return prev;
      const newCount = prev - 5;
      toast({
        title: "人数を減らしました",
        description: `必要備蓄品の数量が${prev}人分から${newCount}人分に変更されました。`,
      });
      return newCount;
    });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-blue-800">対象人数を調整</h3>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleDecreasePeople}
            disabled={peopleCount <= 5}
            className="h-8 w-8 rounded-full"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold min-w-[80px] text-center">
            {peopleCount > 0 ? `${peopleCount}人` : ""}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleIncreasePeople}
            className="h-8 w-8 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-blue-600 mt-2">
        ※ 人数を変更すると、必要な備蓄品の数量が自動的に調整されます
      </p>
    </div>
  );
};
