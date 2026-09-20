/**
 * Top Navigation Bar with Quick Role Switcher, Session Info & Sustainability Snapshot
 */

import React from 'react';
import {
  Sparkles,
  GraduationCap,
  ChefHat,
  Building2,
  Leaf,
  RotateCcw,
  Users,
  Calendar,
  Key,
} from 'lucide-react';
import { UserRole, CollegeSession, SustainabilityMetrics } from '../types';
import { smartKitchenDb } from '../db/smartKitchenDatabase';

interface NavigationProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  session: CollegeSession;
  sustainability: SustainabilityMetrics;
  onResetData?: () => void;
  onOpenLoginModal: (role: UserRole) => void;
  isLoggedIn?: boolean;
  activeUserLabel?: string | null;
  onLogout?: () => void;
  unreadNotificationCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentRole,
  onSelectRole,
  session,
  sustainability,
  onResetData = () => smartKitchenDb.resetToDefault(),
  onOpenLoginModal,
  isLoggedIn = false,
  activeUserLabel,
  onLogout,
  unreadNotificationCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 border-b border-neutral-800/80 backdrop-blur-md">
      {/* Session Quick Status Marquee / Indicator Strip */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/60 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-neutral-400">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{session.name}</span>
          </div>

          <span className="text-neutral-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1 text-neutral-300">
            <Key className="w-3 h-3 text-amber-400" />
            <span>Join Code:</span>
            <code className="px-1.5 py-0.2 bg-neutral-800 rounded font-mono font-bold text-amber-300">
              {session.joiningCode}
            </code>
          </div>

          <span className="text-neutral-700 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-400" />
            <span>Attendance:</span>
            <strong className="text-white font-mono">{session.currentAttendancePct}%</strong>
            <span className="text-neutral-500">
              ({Math.round(session.totalStudents * (session.currentAttendancePct / 100))}/{session.totalStudents})
            </span>
          </div>

          <span className="text-neutral-700 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>Day:</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                session.dayType === 'SPECIAL_EVENT'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {session.dayType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Sustainability Mini Quick Badges */}
        <div className="flex items-center gap-3 ml-auto text-neutral-300">
          <div className="flex items-center gap-1 text-[11px]">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span className="text-neutral-400">Waste Reduced:</span>
            <strong className="text-emerald-400 font-mono font-bold">
              {sustainability.foodWasteReducedPct}%
            </strong>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px]">
            <span className="text-neutral-400">Saved:</span>
            <strong className="text-emerald-300 font-mono font-bold">
              {sustainability.foodSavedKg} kg
            </strong>
          </div>
          <button
            onClick={onResetData}
            title="Reset to default prototype scenario (500 students, 69% attendance, Egg Puff demo)"
            className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-neutral-700 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Title & Interconnected Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onSelectRole('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white uppercase">
                Smart Kitchen
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI
              </span>
            </div>
            <div className="text-[10px] font-medium tracking-wide text-neutral-400 -mt-0.5">
              AI FOR SUSTAINABILITY
            </div>
          </div>
        </div>

        {/* Interconnected Role Switcher (Allows evaluator to instantly experience all 3 dashboards) */}
        <nav aria-label="Dashboard views" className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 shadow-inner">
          <button
            onClick={() => onSelectRole('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentRole === 'landing'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => onSelectRole('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentRole === 'student'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => onSelectRole('canteen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentRole === 'canteen'
                ? 'bg-amber-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Canteen</span>
          </button>

          <button
            onClick={() => onSelectRole('management')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentRole === 'management'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Management</span>
          </button>
        </nav>

        {/* User Session Auth Badge */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-neutral-300 font-medium bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                {activeUserLabel}
              </span>
              <button
                onClick={onLogout}
                className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLoginModal(currentRole === 'landing' ? 'student' : currentRole)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition cursor-pointer shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
