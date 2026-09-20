/**
 * Student Dashboard
 * Sections: Dashboard, Today's Menu, Food Availability, Food Timetable, Feedback, Complaints, Profile
 */

import React, { useState } from 'react';
import {
  Utensils,
  Clock,
  MessageSquare,
  AlertTriangle,
  User,
  Star,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  Info,
  ShieldAlert,
  Bell,
  CheckCircle,
  Tag,
  Search,
} from 'lucide-react';
import {
  MenuItem,
  Complaint,
  Feedback,
  CollegeSession,
  NotificationMessage,
  AIPrediction,
} from '../../types';
import { smartKitchenDb } from '../../db/smartKitchenDatabase';

interface StudentDashboardProps {
  session: CollegeSession;
  menuItems: MenuItem[];
  complaints: Complaint[];
  feedback: Feedback[];
  notifications: NotificationMessage[];
  predictions: AIPrediction[];
}

type StudentTab =
  | 'dashboard'
  | 'menu'
  | 'availability'
  | 'timetable'
  | 'feedback'
  | 'complaints'
  | 'profile';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  session,
  menuItems,
  complaints,
  feedback,
  notifications,
  predictions,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Complaint form state
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintFoodItem, setComplaintFoodItem] = useState('Crispy Egg Puff');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackFoodItem, setFeedbackFoodItem] = useState(menuItems[0]?.name || 'Crispy Egg Puff');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackTags, setFeedbackTags] = useState<string[]>(['Fresh', 'Great Taste']);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Mock logged-in student info
  const studentInfo = {
    regNo: '2026CS108',
    name: 'Aarav Sharma',
    dept: 'Computer Science & Engineering',
    semester: '6th Semester (B.Tech)',
    email: 'aarav.cs@apexcollege.edu',
    hostel: 'Kaveri Boys Hostel, Room 314',
  };

  const myComplaints = complaints.filter(
    (c) => c.studentRegNo === studentInfo.regNo || c.studentName.includes('Aarav')
  );

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) return;

    smartKitchenDb.addComplaint(
      studentInfo.regNo,
      studentInfo.name,
      complaintSubject,
      complaintDesc,
      complaintFoodItem
    );

    setComplaintSubject('');
    setComplaintDesc('');
    setComplaintSuccess(true);
    setTimeout(() => setComplaintSuccess(false), 4000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const targetItem = menuItems.find((m) => m.name === feedbackFoodItem);

    smartKitchenDb.addFeedback(
      studentInfo.regNo,
      studentInfo.name,
      targetItem ? targetItem.id : 'item-egg-puff',
      feedbackFoodItem,
      feedbackRating,
      feedbackComment,
      feedbackTags
    );

    setFeedbackComment('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  const toggleFeedbackTag = (tag: string) => {
    if (feedbackTags.includes(tag)) {
      setFeedbackTags(feedbackTags.filter((t) => t !== tag));
    } else {
      setFeedbackTags([...feedbackTags, tag]);
    }
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const timetableSlots = [
    {
      slot: 'Breakfast',
      time: '7:30 AM – 9:30 AM',
      status: 'Completed',
      items: ['Crispy Masala Dosa', 'South Indian Filter Coffee', 'Idli Vada Sambar'],
      current: false,
    },
    {
      slot: 'Lunch',
      time: '12:00 PM – 2:30 PM',
      status: 'Completed',
      items: ['Hyderabadi Veg Biryani', 'South Indian Curd Rice', 'Paneer Butter Masala Meal'],
      current: false,
    },
    {
      slot: 'Evening Snacks',
      time: '4:30 PM – 6:00 PM',
      status: 'Live Active Slot',
      items: ['Crispy Egg Puff', 'Tandoori Paneer Roll', 'Hot Masala Chai'],
      current: true,
    },
    {
      slot: 'Dinner',
      time: '7:30 PM – 9:30 PM',
      status: 'Upcoming',
      items: ['Phulka with Mixed Veg Sabzi', 'Dal Tadka & Steamed Jeera Rice'],
      current: false,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside aria-label="Student dashboard sections" className="w-full md:w-64 shrink-0 space-y-4">
        {/* Student Profile Snapshot Card */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-white truncate">{studentInfo.name}</h2>
              <div className="text-xs text-neutral-400 font-mono">{studentInfo.regNo}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Verified Student</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Today's Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'availability'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Food Availability</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Food Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              activeTab === 'complaints'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Complaints</span>
            </div>
            {myComplaints.length > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200">
                {myComplaints.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Live Canteen Announcement Box */}
        <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Bell className="w-3.5 h-3.5" />
            <span>Canteen Notice</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            {session.dayType === 'SPECIAL_EVENT'
              ? `Special Event in progress! Extended canteen hours active today.`
              : `Evening snack counters active from 4:30 PM. Live egg puffs & rolls freshly stocked.`}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Tab 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Greeting & Active Slot Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-neutral-900 to-neutral-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Student Portal • {session.name}
                </span>
                <h1 className="text-2xl font-black text-white mt-1">
                  Welcome back, {studentInfo.name.split(' ')[0]}!
                </h1>
                <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                  Current Session attendance is <strong className="text-emerald-400">{session.currentAttendancePct}%</strong> ({Math.round(session.totalStudents * (session.currentAttendancePct / 100))} expected students). All meal batches are optimized to prevent wastage.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-blue-500/20 text-right shrink-0">
                <div className="text-[10px] uppercase text-neutral-400">Current Meal Slot</div>
                <div className="text-sm font-bold text-amber-400">Evening Snacks</div>
                <div className="text-[10px] text-neutral-400">4:30 PM – 6:00 PM</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Menu Items Available</div>
                <div className="text-xl font-bold text-white mt-1">
                  {menuItems.filter((i) => i.isAvailable).length} / {menuItems.length}
                </div>
                <div className="text-[10px] text-emerald-400">Fresh daily prepared</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Canteen Waste Status</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">LOW RISK</div>
                <div className="text-[10px] text-neutral-500">AI prediction active</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">My Complaints</div>
                <div className="text-xl font-bold text-white mt-1">{myComplaints.length}</div>
                <div className="text-[10px] text-neutral-400">
                  {myComplaints.filter((c) => c.status === 'RESOLVED').length} resolved
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-[11px] text-neutral-400">Today's Campus Day</div>
                <div className="text-sm font-bold text-emerald-300 mt-1 uppercase">
                  {session.dayType.replace('_', ' ')}
                </div>
                <div className="text-[10px] text-neutral-500">Regular lecture schedule</div>
              </div>
            </div>

            {/* Today's Featured Items & Availability Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>Popular Right Now in Canteen</span>
                </h2>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  View Full Menu →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.dietary === 'Veg'
                              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700'
                              : 'bg-rose-950/90 text-rose-300 border border-rose-700'
                          }`}
                        >
                          {item.dietary}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950/90 text-white">
                          ₹{item.basePrice}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Available Stock:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {item.currentStock} {item.servingUnit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('feedback')}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Rate Today's Meal</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Share your experience to help AI fine-tune menu popularity.
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-bold">Rate →</span>
              </div>

              <div
                onClick={() => setActiveTab('complaints')}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Lodge a Complaint</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Directly forwarded to college management and head chef.
                  </p>
                </div>
                <span className="text-xs text-rose-400 font-bold">Report →</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: TODAY'S MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Today's Canteen Menu</h2>
                <p className="text-xs text-neutral-400">
                  Real-time prices, calorie information, and current availability
                </p>
              </div>

              {/* Search & Category filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.dietary === 'Veg'
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700'
                            : 'bg-rose-950/90 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {item.dietary}
                      </span>
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-neutral-950/90 text-emerald-400">
                        ₹{item.basePrice}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-neutral-400">
                      <span>{item.calories} kcal</span>
                      <span>•</span>
                      <span>{item.mealSlot.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{item.preparationTimeMinutes} min prep</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.isAvailable && item.currentStock > 10
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.currentStock > 0
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {item.currentStock > 10
                        ? 'Available'
                        : item.currentStock > 0
                        ? 'Low Stock'
                        : 'Sold Out'}
                    </span>
                    <span className="text-xs font-mono text-neutral-300">
                      {item.currentStock} {item.servingUnit} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: FOOD AVAILABILITY */}
        {activeTab === 'availability' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Live Food Availability & Stock</h2>
              <p className="text-xs text-neutral-400">
                Portion levels updated in real time as students purchase meals
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 pb-2">
                    <th className="py-2.5 px-3 font-semibold">Food Item</th>
                    <th className="py-2.5 px-3 font-semibold">Slot</th>
                    <th className="py-2.5 px-3 font-semibold">Price</th>
                    <th className="py-2.5 px-3 font-semibold">Live Portion Count</th>
                    <th className="py-2.5 px-3 font-semibold">Availability Status</th>
                    <th className="py-2.5 px-3 font-semibold">AI Waste Safety</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {menuItems.map((item) => {
                    const pred = predictions.find((p) => p.menuItemId === item.id);
                    return (
                      <tr key={item.id} className="hover:bg-neutral-800/40 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[10px] text-neutral-500">{item.dietary}</div>
                        </td>
                        <td className="py-3 px-3 text-neutral-300">{item.mealSlot.split(' ')[0]}</td>
                        <td className="py-3 px-3 font-mono text-white">₹{item.basePrice}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          {item.currentStock} {item.servingUnit}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.currentStock > 20
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : item.currentStock > 0
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {item.currentStock > 20
                              ? 'In Stock'
                              : item.currentStock > 0
                              ? 'Selling Fast'
                              : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-neutral-400">
                            {pred ? `${pred.expectedWasteRisk} Risk` : 'Optimal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: FOOD TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Today's Food Timetable</h2>
              <p className="text-xs text-neutral-400">
                Official college canteen meal slots and service schedules
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timetableSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    slot.current
                      ? 'bg-neutral-900/90 border-amber-500/60 ring-2 ring-amber-500/20'
                      : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${slot.current ? 'text-amber-400' : 'text-neutral-400'}`} />
                      <h3 className="font-bold text-white text-sm">{slot.slot}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        slot.current
                          ? 'bg-amber-500 text-neutral-950 animate-pulse'
                          : slot.status === 'Completed'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-3">
                    {slot.time}
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 space-y-1 text-xs">
                    <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                      Featured Menu in this Slot:
                    </span>
                    <ul className="list-disc list-inside text-neutral-300 space-y-0.5">
                      {slot.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Canteen Food Feedback</h2>
              <p className="text-xs text-neutral-400">
                Your feedback directly impacts tomorrow's AI demand and portion forecasts
              </p>
            </div>

            {/* Feedback Submission Form */}
            <form
              onSubmit={handleFeedbackSubmit}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
            >
              <h3 className="text-sm font-bold text-white">Share Your Meal Experience</h3>

              {feedbackSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you! Your feedback has been recorded and factored into the AI engine.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Select Food Item
                  </label>
                  <select
                    value={feedbackFoodItem}
                    onChange={(e) => setFeedbackFoodItem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`p-1 transition cursor-pointer ${
                          feedbackRating >= star ? 'text-amber-400' : 'text-neutral-600'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-neutral-300 ml-2">
                      {feedbackRating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tag Feedback Highlights
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Great Taste', 'Fresh', 'Generous Portion', 'Could Be Warmer', 'Value for Money', 'Too Spicy'].map(
                    (tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleFeedbackTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          feedbackTags.includes(tag)
                            ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-semibold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Detailed Comments
                </label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share details regarding flavor, portion sizing, freshness, or availability..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>

            {/* Recent Feedback Feed */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Student Reviews</h3>
              <div className="space-y-2.5">
                {feedback.slice(0, 5).map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{fb.foodName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500">{fb.date}</span>
                    </div>

                    <p className="text-xs text-neutral-300">{fb.comments}</p>

                    {fb.tags && fb.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {fb.tags.map((t, idx) => (
                          <span
                            key={idx}
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
          </div>
        )}

        {/* Tab 6: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Student Complaints & Grievances</h2>
              <p className="text-xs text-neutral-400">
                Complaints are stored in the relational database and sent directly to College Management
              </p>
            </div>

            {/* Complaint Submission Form */}
            <form
              onSubmit={handleComplaintSubmit}
              className="p-5 rounded-2xl bg-neutral-900 border border-rose-500/30 space-y-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Lodge a Formal Complaint</h3>
              </div>

              {complaintSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complaint submitted successfully! It has been logged and sent to College Management.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Subject / Issue Summary
                  </label>
                  <input
                    type="text"
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    placeholder="e.g. Food temperature, early stockout, cleanliness"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Food Item
                  </label>
                  <select
                    value={complaintFoodItem}
                    onChange={(e) => setComplaintFoodItem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                    <option value="General Canteen Service">General Canteen Service</option>
                    <option value="Drinking Water & Hygiene">Drinking Water & Hygiene</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Complaint Description
                </label>
                <textarea
                  rows={3}
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Provide details of the occurrence, time, and specific problem..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Complaint to Management</span>
              </button>
            </form>

            {/* My Complaints Status Tracker */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Complaint Status & Staff Responses</h3>
              {complaints.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500 bg-neutral-900 rounded-xl">
                  No complaints recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs text-white">{c.subject}</h4>
                          <span className="text-[11px] text-neutral-400">
                            Food Item: <strong className="text-neutral-200">{c.foodItem}</strong> • Filed by {c.studentName} ({c.studentRegNo})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500">{c.date}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              c.status === 'RESOLVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : c.status === 'FORWARDED'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : c.status === 'REVIEWED'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-2.5 rounded-lg">
                        {c.description}
                      </p>

                      {/* Management & Canteen Responses */}
                      {c.managementNotes && (
                        <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200">
                          <strong className="text-blue-300">College Management Note: </strong>
                          {c.managementNotes}
                        </div>
                      )}

                      {c.canteenResponse && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200">
                          <strong className="text-emerald-300">Canteen Staff Response: </strong>
                          {c.canteenResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 7: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Profile & Credentials</h2>
              <p className="text-xs text-neutral-400">
                Enrolled academic information connected to the college canteen system
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Full Name</span>
                  <div className="font-bold text-white text-sm mt-0.5">{studentInfo.name}</div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Registration Number</span>
                  <div className="font-mono font-bold text-blue-400 text-sm mt-0.5">
                    {studentInfo.regNo}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Department</span>
                  <div className="font-medium text-neutral-200 text-sm mt-0.5">
                    {studentInfo.dept}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Semester</span>
                  <div className="font-medium text-neutral-200 text-sm mt-0.5">
                    {studentInfo.semester}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">College Email</span>
                  <div className="font-mono text-neutral-200 text-sm mt-0.5">
                    {studentInfo.email}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Connected College Session</span>
                  <div className="font-medium text-emerald-400 text-sm mt-0.5">
                    {session.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
