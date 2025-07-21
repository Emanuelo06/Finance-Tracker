import React from "react";

interface BudgetCardProps {
  emoji: string;
  title: string;
  category: string;
  limit: number;
  spent: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getColor = (title: string) => {
  switch (title.toLowerCase()) {
    case "entertainment":
      return "bg-blue-700";
    case "travel":
      return "bg-purple-600";
    case "food":
      return "bg-red-600";
    case "home":
      return "bg-green-600";
    default:
      return "bg-blue-700";
  }
};

const getTextColor = (title: string) => {
  switch (title.toLowerCase()) {
    case "entertainment":
      return "text-blue-700";
    case "travel":
      return "text-purple-600";
    case "food":
      return "text-red-600";
    case "home":
      return "text-green-600";
    default:
      return "text-blue-700";
  }
};

const BudgetCard: React.FC<BudgetCardProps> = ({
  emoji,
  title,
  category,
  limit,
  spent,
  onEdit,
  onDelete,
}) => {
  const percent = Math.min(100, (spent / limit) * 100);
  const color = getColor(title);
  const textColor = getTextColor(title);
  return (
    <div className="bg-[#F5F7FF] rounded-2xl shadow-lg px-6 py-4 flex flex-col min-w-[260px] max-w-[340px] w-full transition-all" style={{ boxShadow: '0 2px 8px 0 rgba(0,56,169,0.08)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emoji}</span>
          <span className={`font-bold text-xl md:text-2xl ${textColor}`}>{title}</span>
        </div>
        <div className="flex gap-2">
          <button title="Edit" className="hover:opacity-70 p-1" onClick={onEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-3.25.28.28-3.25 12.332-12.333Z" /></svg>
          </button>
          <button title="Delete" className="hover:opacity-70 p-1" onClick={onDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="text-xs md:text-sm text-[#0038A9] font-semibold mb-1 ml-1">
        Budget: <span className="font-bold">${limit}</span>/ spent <span className="font-bold">{spent}</span>
      </div>
      <div className="w-full shadow-2xl h-3 bg-gray-200 rounded-full overflow-hidden mt-1">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BudgetCard;