interface BudgetTotalProps {
  totalBudget: number;
}

export const BudgetTotal = ({ totalBudget }: BudgetTotalProps) => {
  return (
    <div className="border-t pt-4 bg-gray-50">
      <div className="flex justify-end items-baseline">
        <span className="text-xl mr-4 font-bold text-gray-700">合計</span>
        <span className="text-5xl font-black text-gray-700" style={{ fontFamily: "'M PLUS 1p', sans-serif" }}>
          {(totalBudget / 10000).toFixed(1)}
        </span>
        <span className="text-2xl font-bold ml-2 text-gray-700" style={{ fontFamily: "'M PLUS 1p', sans-serif" }}>
          万円
        </span>
      </div>
    </div>
  );
};