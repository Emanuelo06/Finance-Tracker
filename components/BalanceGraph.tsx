"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Transaction } from "@/types/transaction";
import { getAuth } from "firebase/auth";
import { get } from "http";


const auth = getAuth();



const periods = [
  { label: "This Month", value: "last30"},
  {label: "Last 7 days", value: "week"},
  {label: "All Time", value: "all"},
]

function BalanceGraph() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [chartsData, setChartsData] = useState<any[]>([]);
  const [xTickFormatter, setXTickFormatter] = useState<(value: string) => string>(() => (value: any) => value);

  const getDateRange = () => {
    const now = dayjs();
    switch (selectedPeriod) {
      case "last30":
        return {
          start: now.subtract(30, "day").startOf("day").toDate(),
          end: now.endOf("day").toDate(),
        };
      case "week":
        return {
          start: now.subtract(7, "day").startOf("day").toDate(),
          end: now.endOf("day").toDate(),
        };
      case "30days":
        return {
          start: now.subtract(29, "day").startOf("day").toDate(),
          end: now.endOf("day").toDate(),
        };
      default:
        return { start: null, end: null };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User is not logged in.");
        setChartsData([]);
        return;
      }
      const userId = user.uid;
      const transactionRef = collection(db, "users", userId, "transactions");
      const range = getDateRange();
      let q;
      if (range.start && range.end) {
        q = query(transactionRef, where("date", ">=", range.start), where("date", "<=", range.end));
      } else {
        q = query(transactionRef);
      }
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount,
          date: data.date,
          type: data.type,
          category: data.category,
          description: data.description,
          budgetId: data.budgetId,
        } as Transaction;
      });

      // For weekly aggregation (last 30 days)
      if (selectedPeriod === "30days") {
        // Group by week
        const weekMap: Record<string, { income: number; expense: number }> = {};
        docs.forEach((tx) => {
          const weekStart = dayjs(tx.date).startOf("week").format("YYYY-MM-DD");
          if (!weekMap[weekStart]) {
            weekMap[weekStart] = { income: 0, expense: 0 };
          }
          weekMap[weekStart][tx.type] += tx.amount;
        });
        // Generate last 4 weeks
        let weeks: string[] = [];
        let d = dayjs(range.start);
        const last = dayjs(range.end);
        while (d.isBefore(last)) {
          weeks.push(d.startOf("week").format("YYYY-MM-DD"));
          d = d.add(1, "week");
        }
        // Fill chart data for all weeks
        const chart = weeks.map(week => ({
          week,
          income: weekMap[week]?.income || 0,
          expense: weekMap[week]?.expense || 0,
        }));
        // Sample data fallback
        if (docs.length === 0) {
          const sample = weeks.map(week => ({
            week,
            income: Math.floor(Math.random() * 200 + 100),
            expense: Math.floor(Math.random() * 150 + 50),
          }));
          setChartsData(sample);
        } else {
          setChartsData(chart);
        }
        setXTickFormatter(() => (value: any) => dayjs(value).format("MMM D"));
      } else {
        // Process data for chart (daily)
        const map: Record<string, { income: number; expense: number }> = {};
        docs.forEach((tx) => {
          const dataKey = dayjs(tx.date).format("YYYY-MM-DD");
          if (!map[dataKey]) {
            map[dataKey] = { income: 0, expense: 0 };
          }
          map[dataKey][tx.type] += tx.amount;
        });
        // Generate all days for the selected period
        let days: string[] = [];
        if (range.start && range.end) {
          let d = dayjs(range.start);
          const last = dayjs(range.end);
          while (d.isBefore(last) || d.isSame(last)) {
            days.push(d.format("YYYY-MM-DD"));
            d = d.add(1, "day");
          }
        } else {
          // Default to last 7 days if no period
          const today = dayjs();
          days = Array.from({ length: 7 }).map((_, i) => today.subtract(6 - i, "day").format("YYYY-MM-DD"));
        }
        // Fill chart data for all days
        const chart = days.map(date => ({
          date,
          income: map[date]?.income || 0,
          expense: map[date]?.expense || 0,
        }));
        // If no data, use sample data
        if (docs.length === 0) {
          const sample = days.map(date => ({
            date,
            income: Math.floor(Math.random() * 200 + 100),
            expense: Math.floor(Math.random() * 150 + 50),
          }));
          setChartsData(sample);
        } else {
          setChartsData(chart);
        }
        setXTickFormatter(() => (value: any) => dayjs(value).format("MMM D"));
      }
    };
    fetchData();
  }, [selectedPeriod]);

  console.log(auth.currentUser?.uid);

  return (
    <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4 md:px-8">
      <select
    value={selectedPeriod}
    onChange={(e) => setSelectedPeriod(e.target.value)}
    className="p-2 rounded-xl bg-[#0038A9] text-white outline-0
     font-semibold w-full appearance-none pr-10"
  >
    <option value="30days">Last 30 days</option>
    <option value="week">Last 7 days</option>
    <option value="all">All Time</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <svg
      className="w-4 h-4 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
    </svg>
  </div>
      <div className="w-full flex flex-col items-center outline-0 focus:outline-none">
        <div className="w-full max-w-2xl mx-auto outline-0 focus:outline-none">
          <ResponsiveContainer width="100%" minWidth={250} minHeight={200} height={300} className="mb-2 outline-0 focus:outline-none">
            <BarChart data={chartsData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#B6C6E6" />
              <XAxis
                dataKey={selectedPeriod === "30days" ? "week" : "date"}
                tick={{ fill: '#225B97', fontWeight: 600, fontSize: 12 }}
                axisLine={{ stroke: '#225B97' }}
                tickFormatter={xTickFormatter}
                interval={0}
                angle={selectedPeriod === "week" ? 0 : -30}
                dy={10}
              />
              <YAxis tick={{ fill: '#225B97', fontWeight: 600 }} axisLine={{ stroke: '#225B97' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#EDF1FF', border: '1px solid #225B97', color: '#225B97', fontWeight: 600 }}
                labelStyle={{ color: '#225B97', fontWeight: 600 }}
                itemStyle={{ fontWeight: 600 }}
                labelFormatter={(label) => selectedPeriod === "30days" ? `Week of ${dayjs(label).format("MMM D")}` : dayjs(label).format("MMM D")}
              />
              <Bar dataKey="income" fill="#225B97" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#E03A3A" radius={[4, 4, 0, 0]} />
            </BarChart>
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
            <div className="text-gray-400 mt-4">No data available for this period.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalanceGraph;
