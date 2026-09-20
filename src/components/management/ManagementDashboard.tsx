/**
 * College Management Dashboard — Main Control Center
 * Create session, generate joining codes, enter attendance %, set Day Type,
 * monitor AI predictions, forward complaints, broadcast notifications, and view sustainability analytics.
 */

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Key,
  Users,
  Calendar,
  Layers,
  TrendingDown,
  MessageSquare,
  AlertTriangle,
  Bell,
  Leaf,
  Plus,
  Send,
  CheckCircle2,
  Copy,
  RefreshCw,
  Coins,
  Zap,
  BarChart3,
  Sliders,
  Forward,
  CheckCheck,
} from 'lucide-react';
import {
  CollegeSession,
  MenuItem,
  AIPrediction,
  DailyLogRecord,
  Complaint,
  Feedback,
  NotificationMessage,
  SustainabilityMetrics,
  DayType,
  ComplaintStatus,
} from '../../types';
import { smartKitchenDb } from '../../db/smartKitchenDatabase';
import { SustainabilityCharts } from '../analytics/SustainabilityCharts';
import { EggPuffExampleCard } from '../ai/EggPuffExampleCard';

interface ManagementDashboardProps {
  session: CollegeSession;
  menuItems: MenuItem[];
  predictions: AIPrediction[];
  dailyLogs: DailyLogRecord[];
  complaints: Complaint[];
  feedback: Feedback[];
  notifications: NotificationMessage[];
  sustainability: SustainabilityMetrics;
}

type ManagementTab =
  | 'control'
  | 'predictions'
  | 'sustainability'
  | 'complaints'
  | 'feedback'
  | 'notifications'
  | 'sessions';

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  session,
  menuItems,
  predictions,
  dailyLogs,
  complaints,
  feedback,
  notifications,
  sustainability,
}) => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('control');

  // Interactive Attendance & Day Type Control Form
  const [totalStudentsInput, setTotalStudentsInput] = useState<number>(session.totalStudents);
  const [attendancePctInput, setAttendancePctInput] = useState<number>(session.currentAttendancePct);
  const [dayTypeInput, setDayTypeInput] = useState<DayType>(session.dayType);
  const [specialEventInput, setSpecialEventInput] = useState<string>(session.specialEventDetails || '');
  const [updateSaved, setUpdateSaved] = useState(false);

  // Joining Code Copy Feedback
  const [codeCopied, setCodeCopied] = useState(false);

  // Send Notification to Canteen Form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Complaint Management
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [mgmtNoteText, setMgmtNoteText] = useState('');
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('FORWARDED');

  // Create Session Modal/Form
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionCampus, setNewSessionCampus] = useState('');
  const [newSessionTotalStudents, setNewSessionTotalStudents] = useState(600);
  const [sessionCreated, setSessionCreated] = useState(false);

  const eggPuffPrediction = predictions.find((p) => p.menuItemId === 'item-egg-puff');

  const handleApplyAttendanceAndDayType = (e: React.FormEvent) => {
    e.preventDefault();
    smartKitchenDb.updateAttendanceAndDayType(
      Number(attendancePctInput),
      dayTypeInput,
      specialEventInput,
      Number(totalStudentsInput)
    );
    setUpdateSaved(true);
    setTimeout(() => setUpdateSaved(false), 3500);
  };

  const handleGenerateJoiningCode = () => {
    smartKitchenDb.generateNewJoiningCode();
  };

  const handleCopyJoiningCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(session.joiningCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 3000);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    smartKitchenDb.addNotification(notifTitle, notifMessage, 'GENERAL');
    setNotifTitle('');
    setNotifMessage('');
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 3500);
  };

  const applyQuickNotificationTemplate = (title: string, msg: string) => {
    setNotifTitle(title);
    setNotifMessage(msg);
  };

  const handleUpdateComplaint = (complaintId: string) => {
    smartKitchenDb.updateComplaintStatus(complaintId, targetStatus, mgmtNoteText);
    setSelectedComplaintId(null);
    setMgmtNoteText('');
  };

  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;
    smartKitchenDb.createSession(newSessionName, newSessionCampus, newSessionTotalStudents);
    setNewSessionName('');
    setNewSessionCampus('');
    setSessionCreated(true);
    setTimeout(() => setSessionCreated(false), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside aria-label="Management dashboard sections" className="w-full md:w-64 shrink-0 space-y-4">
        {/* Management Identity Card */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">College Management</div>
              <div className="text-[10px] text-neutral-400">Dean of Student Welfare</div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Admin:</span>
              <span className="text-neutral-200 truncate">admin@apexcollege.edu</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Campus:</span>
              <span className="text-emerald-400 font-medium">{session.campus}</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <button
            onClick={() => setActiveTab('control')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'control'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Attendance & AI Control</span>
          </button>

          <button
            onClick={() => setActiveTab('predictions')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'predictions'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>AI Food Predictions</span>
          </button>

          <button
            onClick={() => setActiveTab('sustainability')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'sustainability'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Sustainability Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'complaints'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Student Complaints</span>
            </div>
            {complaints.filter((c) => c.status === 'PENDING').length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                {complaints.filter((c) => c.status === 'PENDING').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast to Canteen</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Session & Joining Code</span>
          </button>
        </div>

        {/* Live Joining Code Quick Box */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Canteen Joining Code</span>
            <button
              onClick={handleGenerateJoiningCode}
              title="Generate new random code"
              className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 border border-neutral-800">
            <code className="text-sm font-mono font-bold text-amber-300">
              {session.joiningCode}
            </code>
            <button
              onClick={handleCopyJoiningCode}
              className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
              title="Copy Joining Code"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          {codeCopied && (
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCheck className="w-3 h-3" />
              <span>Copied! Share with Canteen staff.</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Tab 1: ATTENDANCE & AI CONTROL CENTER */}
        {activeTab === 'control' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Main Operational Control • {session.name}
                </span>
                <h1 className="text-2xl font-black text-white mt-1">
                  Canteen Demand & Attendance Nexus
                </h1>
                <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                  Adjust student enrollment, today's attendance percentage, and college day type. The AI prediction engine re-calculates all food demand models across the campus instantly.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-emerald-500/20 text-right shrink-0">
                <div className="text-[10px] uppercase text-neutral-400">Active Campus Turnout</div>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  {Math.round(session.totalStudents * (session.currentAttendancePct / 100))} Students
                </div>
                <div className="text-[10px] text-neutral-500">
                  ({session.currentAttendancePct}% of {session.totalStudents})
                </div>
              </div>
            </div>

            {/* Attendance & Day Type Input Form */}
            <form
              onSubmit={handleApplyAttendanceAndDayType}
              className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Update Daily Operational Parameters</span>
                </h3>
                <span className="text-xs text-neutral-400">
                  Triggers instant AI portion forecast across Canteen & Student views
                </span>
              </div>

              {updateSaved && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Parameters saved! AI demand predictions recalculated for {attendancePctInput}% attendance.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Students */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Total Enrolled Students
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={10000}
                    value={totalStudentsInput}
                    onChange={(e) => setTotalStudentsInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-neutral-500">
                    Prompt default benchmark: 500
                  </span>
                </div>

                {/* Attendance Percentage Slider & Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Today's Attendance Percentage
                    </label>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {attendancePctInput}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={attendancePctInput}
                    onChange={(e) => setAttendancePctInput(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>10% (Low)</span>
                    <span className="text-emerald-400 font-bold">69% (Target Demo)</span>
                    <span>100% (Full)</span>
                  </div>
                </div>

                {/* Day Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Campus Day Type
                  </label>
                  <select
                    value={dayTypeInput}
                    onChange={(e) => setDayTypeInput(e.target.value as DayType)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NORMAL_DAY">NORMAL DAY</option>
                    <option value="SPECIAL_EVENT">SPECIAL EVENT</option>
                  </select>
                  <span className="text-[10px] text-neutral-500">
                    Special events apply +18% appetite footfall multiplier
                  </span>
                </div>
              </div>

              {/* Special Event Details Input (if Special Event) */}
              {dayTypeInput === 'SPECIAL_EVENT' && (
                <div className="p-3 rounded-xl bg-neutral-950 border border-purple-500/30 space-y-1 animate-fade-in">
                  <label className="block text-xs font-semibold text-purple-300">
                    Special Event Details
                  </label>
                  <input
                    type="text"
                    value={specialEventInput}
                    onChange={(e) => setSpecialEventInput(e.target.value)}
                    placeholder="e.g. Annual Tech Symposium, Inter-College Sports Meet"
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  Estimated Attending Students:{' '}
                  <strong className="text-white font-mono">
                    {Math.round(totalStudentsInput * (attendancePctInput / 100))}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Attendance & Sync AI Engine</span>
                </button>
              </div>
            </form>

            {/* Prompt Mandated Egg Puff Example Card */}
            <EggPuffExampleCard prediction={eggPuffPrediction} session={session} />

            {/* High-Level Canteen Performance KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Total Food Saved</div>
                <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                  {sustainability.foodSavedKg} kg
                </div>
                <div className="text-[10px] text-neutral-500">Redirected from waste</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Waste Rate Reduced</div>
                <div className="text-xl font-bold text-emerald-300 mt-1 font-mono">
                  {sustainability.foodWasteReducedPct}%
                </div>
                <div className="text-[10px] text-neutral-500">23% user target met</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Financial Savings</div>
                <div className="text-xl font-bold text-amber-300 mt-1 font-mono">
                  ₹{sustainability.moneySavedInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Saved in unneeded prep</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Campus Waste Risk</div>
                <div className="text-sm font-bold text-emerald-400 mt-1 uppercase">
                  {sustainability.wasteRiskLevel} RISK
                </div>
                <div className="text-[10px] text-neutral-500">Optimal portion sizing</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI FOOD DEMAND PREDICTIONS TABLE */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Live AI Demand Predictions by Item
              </h2>
              <p className="text-xs text-neutral-400">
                AI calculations correlating {session.currentAttendancePct}% attendance with consumption history and waste risk
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 pb-2">
                    <th className="py-2.5 px-3 font-semibold">Food Item</th>
                    <th className="py-2.5 px-3 font-semibold">Attending Students</th>
                    <th className="py-2.5 px-3 font-semibold">Historical Avg</th>
                    <th className="py-2.5 px-3 font-semibold">Predicted Demand</th>
                    <th className="py-2.5 px-3 font-semibold">Recommended Prep</th>
                    <th className="py-2.5 px-3 font-semibold">Surplus Buffer</th>
                    <th className="py-2.5 px-3 font-semibold">Waste Risk</th>
                    <th className="py-2.5 px-3 font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {predictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-3 font-bold text-white">{pred.foodName}</td>
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {pred.expectedStudents}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400">
                        {pred.historicalAvgDemand} pcs
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {pred.predictedDemand} portions
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-400">
                        {pred.recommendedPreparation} portions
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-300">
                        +{pred.expectedSurplus}
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
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {pred.confidencePct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: SUSTAINABILITY ANALYTICS */}
        {activeTab === 'sustainability' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Sustainability & ESG Analytics</h2>
              <p className="text-xs text-neutral-400">
                Comprehensive tracking of food saved, monetary conservation, and greenhouse gas prevention
              </p>
            </div>

            {/* Top Sustainability Highlight Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/30">
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  FOOD WASTE REDUCED
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  {sustainability.foodWasteReducedPct}%
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-0.5">
                  Over baseline guesswork
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/30">
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  FOOD SAVED
                </div>
                <div className="text-3xl font-black text-emerald-300 font-mono mt-1">
                  {sustainability.foodSavedKg} KG
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Target: 45 KG+ achieved
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/30">
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  MONEY SAVED
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                  ₹{sustainability.moneySavedInr.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Target: ₹8,500+ achieved
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/30">
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  WASTE RISK
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-1 uppercase">
                  {sustainability.wasteRiskLevel}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Confidence calibrated
                </div>
              </div>
            </div>

            {/* Secondary Sustainability Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Estimated Energy Saved</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {sustainability.energySavedKwh} kWh
                  </div>
                </div>
                <Zap className="w-6 h-6 text-amber-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">CO₂ Emissions Prevented</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {sustainability.co2PreventedKg} kg CO₂e
                  </div>
                </div>
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">Current Daily Waste</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {sustainability.dailyWasteKg} kg / day
                  </div>
                </div>
                <TrendingDown className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            {/* Recharts Component: Attendance vs Demand, Prepared vs Consumed, Waste Trends, Top Items */}
            <SustainabilityCharts dailyLogs={dailyLogs} predictions={predictions} />
          </div>
        )}

        {/* Tab 4: STUDENT COMPLAINTS MANAGEMENT */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Complaints & Escalations</h2>
              <p className="text-xs text-neutral-400">
                Review complaints, add management notes, and forward directives to the canteen staff
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
                        Item: <strong className="text-neutral-200">{c.foodItem}</strong> • Student: {c.studentName} ({c.studentRegNo}) • {c.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : c.status === 'FORWARDED'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg leading-relaxed">
                    {c.description}
                  </p>

                  {c.managementNotes && (
                    <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                      <strong className="text-blue-300">Management Note: </strong>
                      {c.managementNotes}
                    </div>
                  )}

                  {c.canteenResponse && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200">
                      <strong className="text-emerald-300">Canteen Staff Response: </strong>
                      {c.canteenResponse}
                    </div>
                  )}

                  {/* Management Action Drawer */}
                  {selectedComplaintId === c.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        value={mgmtNoteText}
                        onChange={(e) => setMgmtNoteText(e.target.value)}
                        placeholder="Add management directive or response to canteen..."
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-neutral-400">Set Status:</span>
                          <select
                            value={targetStatus}
                            onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                            className="px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-xs text-white"
                          >
                            <option value="REVIEWED">REVIEWED</option>
                            <option value="FORWARDED">FORWARD TO CANTEEN</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateComplaint(c.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs cursor-pointer"
                          >
                            Save & Dispatch
                          </button>
                          <button
                            onClick={() => setSelectedComplaintId(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center gap-3 text-xs">
                      <button
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setMgmtNoteText(c.managementNotes || '');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                      >
                        {c.managementNotes ? 'Edit Management Note' : 'Review & Forward to Canteen →'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: STUDENT FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Feedback Overview</h2>
              <p className="text-xs text-neutral-400">
                Real-time quality and portion ratings submitted by students across all meal slots
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">{fb.foodName}</h4>
                      <span className="text-[11px] text-neutral-400">
                        {fb.studentName} ({fb.studentRegNo})
                      </span>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">★ {fb.rating}.0</span>
                  </div>

                  <p className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg">
                    {fb.comments}
                  </p>

                  {fb.tags && fb.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {fb.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800"
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

        {/* Tab 6: BROADCAST NOTIFICATIONS TO CANTEEN */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Broadcast Notifications to Canteen</h2>
              <p className="text-xs text-neutral-400">
                Send urgent operations notices, special event alerts, and preparation quantity adjustments directly to kitchen staff
              </p>
            </div>

            {/* Quick Templates mandated by user prompt */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-neutral-300">
                Quick Notification Templates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applyQuickNotificationTemplate(
                      'Special Event Notice',
                      'Tomorrow is a special event. Expect higher attendance (+20% footfall). Adjust preparation quantity.'
                    )
                  }
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs text-neutral-300 transition cursor-pointer"
                >
                  <strong className="text-white block">Event Attendance</strong>
                  <span className="text-[11px] text-neutral-400 line-clamp-1">
                    “Tomorrow is a special event. Expect higher attendance.”
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyQuickNotificationTemplate(
                      'Attendance Update',
                      `Today's attendance is ${session.currentAttendancePct}%. Adjust preparation quantity in accordance with AI recommendations.`
                    )
                  }
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs text-neutral-300 transition cursor-pointer"
                >
                  <strong className="text-white block">Attendance Change</strong>
                  <span className="text-[11px] text-neutral-400 line-clamp-1">
                    “Today's attendance is 72%. Adjust preparation quantity.”
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    applyQuickNotificationTemplate(
                      'Availability Notice',
                      'Student complaints received regarding food availability during peak lunch hours. Check stock counts.'
                    )
                  }
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs text-neutral-300 transition cursor-pointer"
                >
                  <strong className="text-white block">Student Complaints</strong>
                  <span className="text-[11px] text-neutral-400 line-clamp-1">
                    “Student complaints received regarding food availability.”
                  </span>
                </button>
              </div>
            </div>

            {/* Notification Form */}
            <form
              onSubmit={handleSendNotification}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
            >
              <h3 className="text-sm font-bold text-white">Send Direct Kitchen Directive</h3>

              {notifSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notification dispatched! It is now visible inside the Canteen Dashboard.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Alert Subject
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Weather disruption alert, batch preparation limit"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Type message to canteen chef and staff..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Alert to Canteen Dashboard</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 7: SESSION & JOINING CODE MANAGEMENT */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">College Sessions & Joining Codes</h2>
              <p className="text-xs text-neutral-400">
                Manage college sessions and generate unique joining codes for canteen onboarding
              </p>
            </div>

            {/* Active Session Summary */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Active College Session
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{session.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Unique Joining Code</span>
                  <div className="font-mono text-base font-bold text-amber-300 mt-0.5 flex items-center justify-between">
                    <span>{session.joiningCode}</span>
                    <button
                      onClick={handleCopyJoiningCode}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Enrolled Students</span>
                  <div className="font-mono text-base font-bold text-white mt-0.5">
                    {session.totalStudents} students
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Campus Branch</span>
                  <div className="text-sm font-bold text-neutral-200 mt-0.5">
                    {session.campus}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleGenerateJoiningCode}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition border border-neutral-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New Joining Code</span>
                </button>
              </div>
            </div>

            {/* Create New College Session Form */}
            <form
              onSubmit={handleCreateNewSession}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
            >
              <h3 className="text-sm font-bold text-white">Create New College Session</h3>

              {sessionCreated && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>New college session created with a unique joining code!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    College / Session Name
                  </label>
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="e.g. Apex Tech — Spring 2027"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Campus Block / Branch
                  </label>
                  <input
                    type="text"
                    value={newSessionCampus}
                    onChange={(e) => setNewSessionCampus(e.target.value)}
                    placeholder="e.g. East Science Block Canteen"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Total Enrolled Students
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={newSessionTotalStudents}
                    onChange={(e) => setNewSessionTotalStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Session & Generate Code</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
