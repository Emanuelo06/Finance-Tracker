import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


function BalanceGraph() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [chartsData, setChartsData] = useState<any[]>([]);
  const [xTickFormatter, setXTickFormatter] = useState<(value: string) => string>(() => (value: any) => value);
  const transactions = useAppSelector((state) => state.transactions.data);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartsData([]);
      return;
    }
    let filtered = transactions.map(t => ({
      ...t,
      date: t.date ? new Date(t.date) : new Date(),
    }));
    const now = dayjs();
    let chart: any[] = [];
    if (selectedPeriod === "today") {
      // Only today, group by 2-hour intervals
      const start = now.startOf("day");
      const end = now.endOf("day");
      filtered = filtered.filter(t => dayjs(t.date).isBetween(start, end, null, "[]"));
      const map: Record<string, { income: number; expense: number }> = {};
      filtered.forEach((tx) => {
        // Group by 2-hour interval
        const hour = dayjs(tx.date).hour();
        const twoHour = Math.floor(hour / 2) * 2;
        const intervalKey = dayjs(tx.date).set('hour', twoHour).minute(0).second(0).format("HH:00");
        if (!map[intervalKey]) map[intervalKey] = { income: 0, expense: 0 };
        if (tx.type === "income") map[intervalKey].income += tx.amount;
        else map[intervalKey].expense += tx.amount;
      });
      // Generate all 2-hour intervals
      let intervals: string[] = [];
      let d = start;
      while (d.isBefore(end) || d.isSame(end)) {
        intervals.push(d.format("HH:00"));
        d = d.add(2, "hour");
      }
      chart = intervals.map(interval => ({
        interval,
        income: map[interval]?.income || 0,
        expense: map[interval]?.expense || 0,
      }));
      setXTickFormatter(() => (value: any) => value);
    } else if (selectedPeriod === "7days") {
      // Last 7 days, group by day
      const start = now.subtract(6, "day").startOf("day");
      const end = now.endOf("day");
      filtered = filtered.filter(t => dayjs(t.date).isBetween(start, end, null, "[]"));
      const map: Record<string, { income: number; expense: number }> = {};
      filtered.forEach((tx) => {
        const dataKey = dayjs(tx.date).format("YYYY-MM-DD");
        if (!map[dataKey]) map[dataKey] = { income: 0, expense: 0 };
        if (tx.type === "income") map[dataKey].income += tx.amount;
        else map[dataKey].expense += tx.amount;
      });
      let days: string[] = [];
      let d = start;
      while (d.isBefore(end) || d.isSame(end)) {
        days.push(d.format("YYYY-MM-DD"));
        d = d.add(1, "day");
      }
      chart = days.map(date => ({
        date,
        income: map[date]?.income || 0,
        expense: map[date]?.expense || 0,
      }));
      setXTickFormatter(() => (value: any) => dayjs(value).format("MMM D"));
    } else if (selectedPeriod === "30days") {
      // Last 30 days, group by week
      const start = now.subtract(29, "day").startOf("day");
      const end = now.endOf("day");
      filtered = filtered.filter(t => dayjs(t.date).isBetween(start, end, null, "[]"));
      const weekMap: Record<string, { income: number; expense: number }> = {};
      filtered.forEach((tx) => {
        const weekStart = dayjs(tx.date).startOf("week").format("YYYY-MM-DD");
        if (!weekMap[weekStart]) weekMap[weekStart] = { income: 0, expense: 0 };
        if (tx.type === "income") weekMap[weekStart].income += tx.amount;
        else weekMap[weekStart].expense += tx.amount;
      });
      let weeks: string[] = [];
      let d = start;
      const last = end;
      while (d.isBefore(last)) {
        weeks.push(d.startOf("week").format("YYYY-MM-DD"));
        d = d.add(1, "week");
      }
      chart = weeks.map(week => ({
        week,
        income: weekMap[week]?.income || 0,
        expense: weekMap[week]?.expense || 0,
      }));
      setXTickFormatter(() => (value: any) => dayjs(value).format("MMM D"));
    } else if (selectedPeriod === "all") {
      // All time, group by month
      const map: Record<string, { income: number; expense: number }> = {};
      filtered.forEach((tx) => {
        const monthKey = dayjs(tx.date).format("YYYY-MM");
        if (!map[monthKey]) map[monthKey] = { income: 0, expense: 0 };
        if (tx.type === "income") map[monthKey].income += tx.amount;
        else map[monthKey].expense += tx.amount;
      });
      // Get all months from first to last transaction
      let months: string[] = [];
      if (filtered.length > 0) {
        let first = dayjs(filtered[0].date).startOf("month");
        let last = dayjs(filtered[filtered.length - 1].date).startOf("month");
        while (first.isBefore(last) || first.isSame(last)) {
          months.push(first.format("YYYY-MM"));
          first = first.add(1, "month");
        }
      }
      chart = months.map(month => ({
        month,
        income: map[month]?.income || 0,
        expense: map[month]?.expense || 0,
      }));
      setXTickFormatter(() => (value: any) => dayjs(value).format("MMM YYYY"));
    }
    setChartsData(chart);
  }, [selectedPeriod, transactions]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4 md:px-8">
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="p-2 rounded-xl bg-[#2E296B] text-white outline-0 font-semibold w-full appearance-none pr-10 mb-4"
      >
        <option value="today">Today (2-hour intervals)</option>
        <option value="7days">Last 7 days (daily)</option>
        <option value="30days">Last 30 days (weekly)</option>
        <option value="all">All time (monthly)</option>
      </select>
      <div className="w-full flex flex-col items-center outline-0 focus:outline-none">
        <div className="w-full max-w-2xl mx-auto outline-0 focus:outline-none">
          <ResponsiveContainer width="100%" minWidth={250} minHeight={200} height={300} className="mb-2 outline-0 focus:outline-none">
            <LineChart data={chartsData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#B6C6E6" />
              <XAxis
                dataKey={
                  selectedPeriod === "today"
                    ? "interval"
                    : selectedPeriod === "7days"
                    ? "date"
                    : selectedPeriod === "30days"
                    ? "week"
                    : "month"
                }
                tick={{ fill: '#225B97', fontWeight: 600, fontSize: 12 }}
                axisLine={{ stroke: '#225B97' }}
                tickFormatter={xTickFormatter}
                interval={0}
                angle={selectedPeriod === "7days" || selectedPeriod === "today" ? 0 : -30}
                dy={10}
              />
              <YAxis tick={{ fill: '#225B97', fontWeight: 600 }} axisLine={{ stroke: '#225B97' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#EDF1FF', border: '1px solid #225B97', color: '#225B97', fontWeight: 600 }}
                labelStyle={{ color: '#225B97', fontWeight: 600 }}
                itemStyle={{ fontWeight: 600 }}
                labelFormatter={(label: string) => {
                  if (selectedPeriod === "today") return `Interval: ${label}`;
                  if (selectedPeriod === "7days") return dayjs(label).format("MMM D");
                  if (selectedPeriod === "30days") return `Week of ${dayjs(label).format("MMM D")}`;
                  if (selectedPeriod === "all") return dayjs(label).format("MMM YYYY");
                  return label;
                }}
              />
              <Line type="monotone" dataKey="income" stroke="#225B97" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" stroke="#E03A3A" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          {/* Custom Legend - visually grouped below chart */}
          <div className="flex gap-6 justify-center items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#225B97' }}></span>
              <span className="text-[#225B97] font-semibold">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: '#E03A3A' }}></span>
              <span className="text-[#E03A3A] font-semibold">Expense</span>
            </div>
          </div>
          {chartsData.length === 0 && (
            <div className="text-gray-400 mt-4 text-center">No data available for this period.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalanceGraph;
