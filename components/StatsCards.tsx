const StatsCards = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Total Balance */}
      <div className="flex-1 min-w-[120px] max-w-[180px] sm:min-w-[180px] sm:max-w-[250px] bg-[#EDF1FF] rounded-lg shadow-xl p-3 sm:p-4">
        <h1 className="text-xs text-[#0338A9] font-medium">Total Balance</h1>
        <h1 className="text-sm mt-4 text-[#0338A9] font-semibold">$3,000.00</h1>
      </div>

      {/* Today */}
      <div className="flex-1 min-w-[120px] max-w-[180px] sm:min-w-[180px] sm:max-w-[250px] bg-[#EDF1FF] rounded-lg shadow-xl p-3 sm:p-4">
        <h1 className="text-xs text-[#0338A9] font-medium">Today <span className="text-red-500">-5%</span></h1>
        <h1 className="text-sm mt-4 text-[#0338A9] font-semibold">- $250.00</h1>
      </div>

      {/* Last 30 Days */}
      <div className="flex-1 min-w-[120px] max-w-[180px] sm:min-w-[180px] sm:max-w-[250px] bg-[#EDF1FF] rounded-lg shadow-xl p-3 sm:p-4">
        <h1 className="text-xs text-[#0338A9] font-medium">Last 30 days <span className="text-green-500">+200%</span></h1>
        <h1 className="text-sm mt-4 text-[#0338A9] font-semibold">+ $3,000.00</h1>
      </div>
    </div>
  );
};

export default StatsCards;