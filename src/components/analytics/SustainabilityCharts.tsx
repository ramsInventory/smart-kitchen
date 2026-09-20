/**
 * Sustainability & Canteen Operations Charts
 * Attendance vs Demand, Prepared vs Consumed, Waste Trends, Top Wasted Items, Daily Consumption
 */

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { DailyLogRecord, AIPrediction } from '../../types';

interface Props {
  dailyLogs: DailyLogRecord[];
  predictions: AIPrediction[];
}

export const SustainabilityCharts: React.FC<Props> = ({ dailyLogs, predictions }) => {
  // 1. Attendance vs Demand Trend
  const attendanceDemandData = [
    { day: 'Mon', attendancePct: 78, expectedStudents: 390, demandUnits: 255, wasteUnits: 32 },
    { day: 'Tue', attendancePct: 74, expectedStudents: 370, demandUnits: 240, wasteUnits: 28 },
    { day: 'Wed', attendancePct: 76, expectedStudents: 380, demandUnits: 250, wasteUnits: 22 },
    { day: 'Thu', attendancePct: 71, expectedStudents: 355, demandUnits: 235, wasteUnits: 18 },
    { day: 'Fri (Yesterday)', attendancePct: 69, expectedStudents: 345, demandUnits: 215, wasteUnits: 85 },
    { day: 'Today (AI Pred)', attendancePct: 69, expectedStudents: 345, demandUnits: 230, wasteUnits: 10 },
  ];

  // 2. Prepared vs Consumed per item
  const prepVsConsumedData = predictions.map((p) => {
    // find recent log
    const recent = dailyLogs.filter((l) => l.menuItemId === p.menuItemId).slice(-1)[0];
    return {
      name: p.foodName.length > 14 ? p.foodName.slice(0, 12) + '...' : p.foodName,
      prepared: recent ? recent.preparedQty : p.recommendedPreparation,
      consumed: recent ? recent.consumedQty : p.predictedDemand,
      wasted: recent ? recent.wastedQty : p.expectedSurplus,
    };
  });

  // 3. Food Waste Trend over days (showing sharp decline with AI intervention)
  const wasteTrendData = [
    { date: 'Sep 15 (Manual)', wasteKg: 34.5, aiActive: false },
    { date: 'Sep 16 (Manual)', wasteKg: 31.0, aiActive: false },
    { date: 'Sep 17 (Manual)', wasteKg: 28.2, aiActive: false },
    { date: 'Sep 18 (AI Pilot)', wasteKg: 19.4, aiActive: true },
    { date: 'Sep 19 (AI Engine)', wasteKg: 14.8, aiActive: true },
    { date: 'Today (Predicted)', wasteKg: 4.2, aiActive: true },
  ];

  // 4. Top Wasted Food Items (Past Week)
  const topWastedData = [
    { name: 'Crispy Egg Puff', wastedUnits: 85, costLoss: 1190, color: '#f59e0b' },
    { name: 'Tandoori Paneer Roll', wastedUnits: 45, costLoss: 1440, color: '#ef4444' },
    { name: 'Hyderabadi Biryani', wastedUnits: 37, costLoss: 1776, color: '#3b82f6' },
    { name: 'Crispy Masala Dosa', wastedUnits: 28, costLoss: 672, color: '#10b981' },
    { name: 'Curd Rice', wastedUnits: 20, costLoss: 400, color: '#8b5cf6' },
  ];

  // 5. Daily Consumption Distribution
  const mealSlotData = [
    { name: 'Breakfast (7:30-9:30 AM)', portions: 240, fill: '#3b82f6' },
    { name: 'Lunch (12:00-2:30 PM)', portions: 410, fill: '#10b981' },
    { name: 'Snacks (4:30-6:00 PM)', portions: 345, fill: '#f59e0b' },
    { name: 'Dinner (7:30-9:30 PM)', portions: 180, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Row 1: Attendance vs Demand & Prepared vs Consumed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance vs Demand */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Attendance % vs Food Demand Trend
              </h3>
              <p className="text-xs text-neutral-400">
                Correlating student classroom turnout with actual portions consumed
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              R² = 0.92 Correlation
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="day" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="expectedStudents" name="Expected Students" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#attendanceGrad)" />
                <Area type="monotone" dataKey="demandUnits" name="Portions Demanded" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#demandGrad)" />
                <Line type="monotone" dataKey="wasteUnits" name="Waste (Portions)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prepared vs Consumed by Food Item */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Prepared vs Consumed Portions
              </h3>
              <p className="text-xs text-neutral-400">
                Comparison showing overproduction gap and waste prevention
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Catalog
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepVsConsumedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="prepared" name="Prepared Qty" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consumed" name="Consumed Qty" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wasted" name="Wasted Qty" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Food Waste Trend & Top Wasted Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Food Waste Trend */}
        <div className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Daily Food Waste Reduction Trend (kg)
              </h3>
              <p className="text-xs text-neutral-400">
                Before AI guesswork vs After Smart Kitchen AI prediction deployment
              </p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              -62% Waste Drop
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="wasteKg"
                  name="Food Waste (kg)"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#0a0a0a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Meal Slot Consumption */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">
              Daily Consumption by Meal Slot
            </h3>
            <p className="text-xs text-neutral-400 mb-2">
              Portions served across college operating timetable
            </p>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mealSlotData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="portions"
                >
                  {mealSlotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-neutral-800">
            {mealSlotData.map((slot, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slot.fill }} />
                <span className="text-neutral-300 truncate">{slot.name.split(' ')[0]}</span>
                <span className="text-neutral-500 font-mono ml-auto">{slot.portions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Wasted Items Ranking */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-neutral-100 mb-1">
          Top Wasted Food Items (Historical Loss Analysis)
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          Pinpointing items with highest overproduction and financial loss prior to AI calibration
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topWastedData.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  #{idx + 1} Waste Priority
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  ₹{item.costLoss.toLocaleString()} lost
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2">{item.name}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">Wasted Units:</span>
                  <span className="font-mono text-rose-400 font-semibold">{item.wastedUnits} pcs</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (item.wastedUnits / 90) * 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
