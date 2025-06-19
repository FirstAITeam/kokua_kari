import { ScrollArea } from "@/components/ui/scroll-area";

interface BudgetItem {
  name: string;
  pricePerUnit: number;
  quantity: number;
}

interface BudgetItemListProps {
  items: BudgetItem[];
}

export const BudgetItemList = ({ items }: BudgetItemListProps) => {
  return (
    <ScrollArea className="h-[140px] lg:h-[300px] pr-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-gray-50/50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-bold text-gray-700">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.pricePerUnit.toLocaleString()}円 × {item.quantity}個
              </p>
            </div>
            <div className="text-xl font-bold text-gray-700">
              {(item.pricePerUnit * item.quantity).toLocaleString()}円
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};