/**
 * Canteen Dashboard
 * Sections: Dashboard, Today's Demand, AI Prediction, Menu Management, Stock,
 * Food Preparation & Consumption logging, Waste Tracking, Student Feedback, Complaints, Notifications
 */

import React, { useState } from 'react';
import {
  ChefHat,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Layers,
  UtensilsCrossed,
  Package,
  ClipboardList,
  Trash2,
  MessageSquare,
  AlertTriangle,
  Bell,
  Save,
  CheckCircle2,
  Key,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Calendar,
  DollarSign,
  Leaf,
  Send,
} from 'lucide-react';
import {
  MenuItem,
  CollegeSession,
  AIPrediction,
  DailyLogRecord,
  Complaint,
  Feedback,
  NotificationMessage,
  SustainabilityMetrics,
} from '../../types';
import { smartKitchenDb } from '../../db/smartKitchenDatabase';
import { EggPuffExampleCard } from '../ai/EggPuffExampleCard';

interface CanteenDashboardProps {
  session: CollegeSession;
  menuItems: MenuItem[];
  predictions: AIPrediction[];
  dailyLogs: DailyLogRecord[];
  complaints: Complaint[];
  feedback: Feedback[];
  notifications: NotificationMessage[];
  sustainability: SustainabilityMetrics;
}

type CanteenTab =
  | 'dashboard'
  | 'demand'
  | 'prediction'
  | 'menu'
  | 'stock'
  | 'operations'
  | 'waste'
  | 'feedback'
  | 'complaints'
  | 'notifications';

export const CanteenDashboard: React.FC<CanteenDashboardProps> = ({
  session,
  menuItems,
  predictions,
  dailyLogs,
  complaints,
  feedback,
  notifications,
  sustainability,
}) => {
  const [activeTab, setActiveTab] = useState<CanteenTab>('dashboard');

  // Operations entry form state (logging prepared, sold, remaining, wasted)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>(menuItems[0]?.id || 'item-egg-puff');
  const [preparedQty, setPreparedQty] = useState<number>(240);
  const [soldQty, setSoldQty] = useState<number>(225);
  const [remainingQty, setRemainingQty] = useState<number>(15);
  const [wastedQty, setWastedQty] = useState<number>(5);
  const [opSuccess, setOpSuccess] = useState(false);

  // Response to complaint state
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [canteenReplyText, setCanteenReplyText] = useState('');

  // Stock edit state
  const [editingStockItemId, setEditingStockItemId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  const eggPuffPrediction = predictions.find((p) => p.menuItemId === 'item-egg-puff');

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // When selected menu item changes in Operations, auto-fill reasonable defaults from prediction
  const handleItemSelectForLogging = (itemId: string) => {
    setSelectedMenuItemId(itemId);
    const pred = predictions.find((p) => p.menuItemId === itemId);
    if (pred) {
      setPreparedQty(pred.recommendedPreparation);
      setSoldQty(pred.predictedDemand);
      setRemainingQty(Math.max(0, pred.recommendedPreparation - pred.predictedDemand));
      setWastedQty(Math.max(0, pred.expectedSurplus - 5));
    }
  };

  const handleSaveOperation = (e: React.FormEvent) => {
    e.preventDefault();
    smartKitchenDb.logFoodOperation(
      selectedMenuItemId,
      Number(preparedQty),
      Number(soldQty),
      Number(remainingQty),
      Number(wastedQty)
    );
    setOpSuccess(true);
    setTimeout(() => setOpSuccess(false), 3500);
  };

  const handleSendComplaintReply = (complaintId: string) => {
    if (!canteenReplyText.trim()) return;
    smartKitchenDb.updateComplaintStatus(
      complaintId,
      'RESOLVED',
      undefined,
      canteenReplyText
    );
    setCanteenReplyText('');
    setSelectedComplaintId(null);
  };

  const handleStockSave = (itemId: string) => {
    smartKitchenDb.updateMenuItemStock(itemId, Number(newStockValue));
    setEditingStockItemId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside aria-label="Canteen dashboard sections" className="w-full md:w-64 shrink-0 space-y-4">
        {/* Session Joining Status Badge */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Central Kitchen</div>
              <div className="text-[10px] text-neutral-400">Head Chef Operations</div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Joined Session:</span>
              <span className="font-mono text-emerald-400 font-bold">Connected</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Code:</span>
              <code className="px-1 py-0.2 rounded bg-neutral-950 font-mono text-amber-300 font-bold">
                {session.joiningCode}
              </code>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('demand')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'demand'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Today's Demand</span>
          </button>

          <button
            onClick={() => setActiveTab('prediction')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'prediction'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>AI Prediction Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'operations'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Prep & Consumption</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu Management</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stock & Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('waste')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'waste'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Waste Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'complaints'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Complaints</span>
            </div>
            {complaints.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200">
                {complaints.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4" />
              <span>Management Alerts</span>
            </div>
            {unreadNotifications.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-neutral-950">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Live Notification Preview Alert */}
        {unreadNotifications.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>New Management Message</span>
            </div>
            <p className="text-[11px] text-neutral-300 line-clamp-2">
              {unreadNotifications[0].message}
            </p>
            <button
              onClick={() => setActiveTab('notifications')}
              className="text-[10px] text-amber-400 hover:underline font-semibold block"
            >
              View All Alerts →
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Tab 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/50 via-neutral-900 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Canteen Operations Control • Code: {session.joiningCode}
                </span>
                <h1 className="text-2xl font-black text-white mt-1">
                  AI-Driven Kitchen Production
                </h1>
                <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                  Attendance is <strong className="text-white">{session.currentAttendancePct}%</strong> ({Math.round(session.totalStudents * (session.currentAttendancePct / 100))} expected students). Target food waste reduction rate is currently at <strong className="text-emerald-400">{sustainability.foodWasteReducedPct}%</strong>.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('operations')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md shrink-0"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Log Daily Portions</span>
              </button>
            </div>

            {/* Quick KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Total Portions Demanded</div>
                <div className="text-xl font-bold text-white mt-1 font-mono">
                  {predictions.reduce((sum, p) => sum + p.predictedDemand, 0)}
                </div>
                <div className="text-[10px] text-emerald-400">Across {menuItems.length} menu items</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">AI Recommended Prep</div>
                <div className="text-xl font-bold text-blue-400 mt-1 font-mono">
                  {predictions.reduce((sum, p) => sum + p.recommendedPreparation, 0)}
                </div>
                <div className="text-[10px] text-blue-400/80">With safe 4.5% buffer</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Unread Alerts</div>
                <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
                  {unreadNotifications.length}
                </div>
                <div className="text-[10px] text-neutral-400">From Management</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Waste Risk Level</div>
                <div className="text-sm font-bold text-emerald-300 mt-1 uppercase">
                  {sustainability.wasteRiskLevel} RISK
                </div>
                <div className="text-[10px] text-neutral-500">{sustainability.foodSavedKg} kg saved</div>
              </div>
            </div>

            {/* Benchmark Showcase Card */}
            <EggPuffExampleCard prediction={eggPuffPrediction} session={session} />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setActiveTab('operations')}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <ClipboardList className="w-4 h-4 text-amber-400" />
                  <span>Update Portion Counts</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Log prepared vs sold portions to auto-calculate waste and train AI.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('stock')}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Adjust Raw Stock</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Update inventory counts and threshold alerts for batch prep.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('complaints')}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-white">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Review Complaints</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Reply to student complaints forwarded by college management.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: TODAY'S DEMAND */}
        {activeTab === 'demand' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Today's Predicted Food Demand</h2>
              <p className="text-xs text-neutral-400">
                Calculated dynamically from {session.currentAttendancePct}% attendance ({Math.round(session.totalStudents * (session.currentAttendancePct / 100))} expected students)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 pb-2">
                    <th className="py-2.5 px-3 font-semibold">Food Item</th>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Yesterday Consumed</th>
                    <th className="py-2.5 px-3 font-semibold">Predicted Demand</th>
                    <th className="py-2.5 px-3 font-semibold">AI Recommended Prep</th>
                    <th className="py-2.5 px-3 font-semibold">Buffer Cushion</th>
                    <th className="py-2.5 px-3 font-semibold">Waste Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {predictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-3 font-bold text-white">{pred.foodName}</td>
                      <td className="py-3 px-3 text-neutral-400 capitalize">
                        {menuItems.find((m) => m.id === pred.menuItemId)?.category}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {pred.yesterdayConsumption} pcs
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {pred.predictedDemand} portions
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-400">
                        {pred.recommendedPreparation} portions
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-300">
                        +{pred.expectedSurplus} pcs
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            pred.expectedWasteRisk === 'LOW'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {pred.expectedWasteRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: AI PREDICTION ENGINE DEEP VIEW */}
        {activeTab === 'prediction' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">AI Prediction Engine Breakdown</h2>
              <p className="text-xs text-neutral-400">
                Transparent multi-variable neural formulation powering portion forecasting
              </p>
            </div>

            <EggPuffExampleCard prediction={eggPuffPrediction} session={session} />

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">All Menu Item Forecasts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((pred) => (
                  <div
                    key={pred.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{pred.foodName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {pred.confidencePct}% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-[10px] text-neutral-400">Predicted Demand</span>
                        <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                          {pred.predictedDemand}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-[10px] text-neutral-400">Recommended Prep</span>
                        <div className="font-mono font-bold text-blue-400 text-sm mt-0.5">
                          {pred.recommendedPreparation}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-[10px] text-neutral-400">Surplus Buffer</span>
                        <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">
                          +{pred.expectedSurplus}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-300 leading-relaxed bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                      {pred.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: FOOD PREPARATION & CONSUMPTION LOGGING */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">
                Food Preparation & Consumption Log
              </h2>
              <p className="text-xs text-neutral-400">
                Log actual prepared, sold, remaining, and wasted quantities to train future AI predictions
              </p>
            </div>

            {/* Entry Form */}
            <form
              onSubmit={handleSaveOperation}
              className="p-5 rounded-2xl bg-neutral-900 border border-amber-500/30 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-amber-400" />
                  <span>Log Production & Service Numbers</span>
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Date: {new Date().toISOString().split('T')[0]}
                </span>
              </div>

              {opSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Data saved successfully! Food waste calculated and database updated for future predictions.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Food Item
                  </label>
                  <select
                    value={selectedMenuItemId}
                    onChange={(e) => handleItemSelectForLogging(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Prepared Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={preparedQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPreparedQty(val);
                      setRemainingQty(Math.max(0, val - soldQty));
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Sold / Consumed Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={soldQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSoldQty(val);
                      setRemainingQty(Math.max(0, preparedQty - val));
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Remaining Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={remainingQty}
                    onChange={(e) => setRemainingQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-white text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Wasted Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={wastedQty}
                    onChange={(e) => setWastedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-rose-400 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  Calculated Waste Rate: <strong className="text-amber-400">{preparedQty > 0 ? ((wastedQty / preparedQty) * 100).toFixed(1) : 0}%</strong>
                </div>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Log to Relational Database</span>
                </button>
              </div>
            </form>

            {/* Historical Operations Log Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Daily Logs</h3>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 pb-2">
                      <th className="py-2 px-3 font-semibold">Date</th>
                      <th className="py-2 px-3 font-semibold">Food Item</th>
                      <th className="py-2 px-3 font-semibold">Prepared</th>
                      <th className="py-2 px-3 font-semibold">Consumed</th>
                      <th className="py-2 px-3 font-semibold">Remaining</th>
                      <th className="py-2 px-3 font-semibold">Wasted</th>
                      <th className="py-2 px-3 font-semibold">Waste %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {dailyLogs.slice().reverse().map((log) => {
                      const wastePct = log.preparedQty > 0 ? ((log.wastedQty / log.preparedQty) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={log.id} className="hover:bg-neutral-800/40 transition">
                          <td className="py-2.5 px-3 text-neutral-400 font-mono">{log.date}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{log.foodName}</td>
                          <td className="py-2.5 px-3 font-mono text-white">{log.preparedQty}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400">{log.consumedQty}</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-300">{log.remainingQty}</td>
                          <td className="py-2.5 px-3 font-mono text-rose-400 font-semibold">{log.wastedQty}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                Number(wastePct) > 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {wastePct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Menu Item Configuration</h2>
              <p className="text-xs text-neutral-400">
                Manage pricing, dietary classifications, prep times, and availability
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        ₹{item.basePrice}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Cost: ₹{item.costPrice} • {item.dietary} • {item.mealSlot.split(' ')[0]}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1">
                      Live Stock: {item.currentStock} {item.servingUnit}
                    </div>

                    <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() =>
                          smartKitchenDb.updateMenuItemStock(item.id, item.currentStock, !item.isAvailable)
                        }
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                          item.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.isAvailable ? 'Enabled in Menu' : 'Disabled / Hidden'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: STOCK & INVENTORY */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Stock & Inventory Balance</h2>
              <p className="text-xs text-neutral-400">
                Track live portion stock and update on-hand quantities
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 pb-2">
                    <th className="py-2.5 px-3 font-semibold">Food Item</th>
                    <th className="py-2.5 px-3 font-semibold">Unit</th>
                    <th className="py-2.5 px-3 font-semibold">Max Daily Capacity</th>
                    <th className="py-2.5 px-3 font-semibold">Current On-Hand</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-3 font-bold text-white">{item.name}</td>
                      <td className="py-3 px-3 text-neutral-400">{item.servingUnit}</td>
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {item.maxDailyCapacity}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {editingStockItemId === item.id ? (
                          <input
                            type="number"
                            min={0}
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded bg-neutral-950 border border-amber-500 font-mono text-xs text-white"
                          />
                        ) : (
                          `${item.currentStock} ${item.servingUnit}`
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.currentStock > 30
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {item.currentStock > 30 ? 'Adequate' : 'Replenish Needed'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {editingStockItemId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockSave(item.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-[10px] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStockItemId(null)}
                              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockItemId(item.id);
                              setNewStockValue(item.currentStock);
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                          >
                            Update Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: WASTE TRACKING */}
        {activeTab === 'waste' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Food Waste Tracking & Analytics</h2>
              <p className="text-xs text-neutral-400">
                Detailed audit of spoiled portions, monetary loss, and ecological carbon impact
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Waste Rate Reduction</div>
                <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                  {sustainability.foodWasteReducedPct}%
                </div>
                <div className="text-[10px] text-neutral-500">vs 22% pre-AI baseline</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Total Food Saved</div>
                <div className="text-xl font-bold text-emerald-300 mt-1 font-mono">
                  {sustainability.foodSavedKg} kg
                </div>
                <div className="text-[10px] text-neutral-500">Diverted from landfills</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Kitchen Cost Saved</div>
                <div className="text-xl font-bold text-amber-300 mt-1 font-mono">
                  ₹{sustainability.moneySavedInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Perishables saved</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">CO₂e Emissions Prevented</div>
                <div className="text-xl font-bold text-blue-400 mt-1 font-mono">
                  {sustainability.co2PreventedKg} kg
                </div>
                <div className="text-[10px] text-neutral-500">Greenhouse gas saved</div>
              </div>
            </div>

            {/* Waste log list */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Daily Waste Records by Item</h3>
              <div className="space-y-2">
                {dailyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{log.foodName}</span>
                      <span className="text-neutral-500 text-[11px] ml-2">({log.date})</span>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Prepared: {log.preparedQty} • Consumed: {log.consumedQty} • Wasted: <strong className="text-rose-400">{log.wastedQty} pcs</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-rose-400 font-semibold">
                        ₹{(log.wastedQty * log.unitCost).toLocaleString()} loss
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {log.preparedQty > 0 ? ((log.wastedQty / log.preparedQty) * 100).toFixed(0) : 0}% waste rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: STUDENT FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Feedback Feed</h2>
              <p className="text-xs text-neutral-400">
                Live reviews submitted by students to calibrate flavor, quality, and portion sizes
              </p>
            </div>

            <div className="space-y-3">
              {feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">{fb.foodName}</span>
                      <span className="text-xs text-neutral-400 ml-2">
                        by {fb.studentName} ({fb.studentRegNo})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <span>★ {fb.rating}.0</span>
                      <span className="text-neutral-500 font-normal">({fb.date})</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-2.5 rounded-lg">
                    {fb.comments}
                  </p>

                  {fb.tags && fb.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {fb.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Complaints & Actions</h2>
              <p className="text-xs text-neutral-400">
                Complaints received directly or forwarded from College Management
              </p>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{c.subject}</h4>
                      <span className="text-xs text-neutral-400">
                        Item: <strong className="text-neutral-200">{c.foodItem}</strong> • Student: {c.studentName} ({c.studentRegNo})
                      </span>
                    </div>
                    <span
                      className={`self-start sm:self-auto px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : c.status === 'FORWARDED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg leading-relaxed">
                    {c.description}
                  </p>

                  {c.managementNotes && (
                    <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                      <strong className="text-blue-300">College Management Directive: </strong>
                      {c.managementNotes}
                    </div>
                  )}

                  {c.canteenResponse && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200">
                      <strong className="text-emerald-300">Our Kitchen Response: </strong>
                      {c.canteenResponse}
                    </div>
                  )}

                  {/* Reply Box */}
                  {selectedComplaintId === c.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        value={canteenReplyText}
                        onChange={(e) => setCanteenReplyText(e.target.value)}
                        placeholder="Write corrective action taken by canteen staff..."
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendComplaintReply(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs cursor-pointer"
                        >
                          Resolve & Send Response
                        </button>
                        <button
                          onClick={() => setSelectedComplaintId(null)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setCanteenReplyText(c.canteenResponse || '');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        {c.canteenResponse ? 'Edit Kitchen Response' : 'Write Kitchen Response & Resolve →'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: MANAGEMENT ALERTS & NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Management Directives & Alerts</h2>
              <p className="text-xs text-neutral-400">
                Direct communications sent from College Management regarding attendance, events, and food volume adjustments
              </p>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition ${
                    notif.isRead
                      ? 'bg-neutral-900 border-neutral-800'
                      : 'bg-neutral-900/90 border-amber-500/60 ring-2 ring-amber-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Bell className={`w-4 h-4 ${notif.isRead ? 'text-neutral-500' : 'text-amber-400'}`} />
                      <h4 className="font-bold text-xs text-white">{notif.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-500">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!notif.isRead && (
                        <button
                          onClick={() => smartKitchenDb.markNotificationRead(notif.id)}
                          className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold cursor-pointer"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-2.5 rounded-lg">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
