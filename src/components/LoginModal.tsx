/**
 * Login / Authentication Modal for Student, Canteen, and Management roles
 */

import React, { useState, useEffect } from 'react';
import { X, GraduationCap, ChefHat, Building2, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { smartKitchenDb } from '../db/smartKitchenDatabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole: UserRole;
  onLoginSuccess: (role: UserRole, userLabel: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [regNo, setRegNo] = useState('2026CS108');
  const [password, setPassword] = useState('student123');
  const [canteenEmail, setCanteenEmail] = useState('canteen@apexcollege.edu');
  const [joiningCode, setJoiningCode] = useState(smartKitchenDb.getSession().joiningCode);
  const [mgmtEmail, setMgmtEmail] = useState('admin@apexcollege.edu');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const role = initialRole === 'landing' ? 'student' : initialRole;
      setSelectedRole(role);
      setError(null);
      if (role === 'student') {
        setRegNo('2026CS108');
        setPassword('student123');
      } else if (role === 'canteen') {
        setCanteenEmail('canteen@apexcollege.edu');
        setJoiningCode(smartKitchenDb.getSession().joiningCode);
        setPassword('canteen123');
      } else {
        setMgmtEmail('admin@apexcollege.edu');
        setPassword('admin123');
      }
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedRole === 'student') {
      if (!regNo.trim() || !password.trim()) {
        setError('Please enter your Registration Number and Password.');
        return;
      }
      onLoginSuccess('student', `Student: ${regNo.toUpperCase()}`);
      onClose();
    } else if (selectedRole === 'canteen') {
      if (!canteenEmail.trim() || !password.trim()) {
        setError('Please enter Canteen ID / Email and Password.');
        return;
      }
      // Check joining code
      const isValidCode = smartKitchenDb.verifyJoiningCode(joiningCode);
      if (!isValidCode) {
        setError(`Invalid joining code. Active management code is "${smartKitchenDb.getSession().joiningCode}".`);
        return;
      }
      onLoginSuccess('canteen', `Canteen Staff: ${canteenEmail}`);
      onClose();
    } else {
      if (!mgmtEmail.trim() || !password.trim()) {
        setError('Please enter College Management Email and Password.');
        return;
      }
      onLoginSuccess('management', `Management: ${mgmtEmail}`);
      onClose();
    }
  };

  const setDemoCredentials = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'student') {
      setRegNo('2026CS108');
      setPassword('student123');
    } else if (role === 'canteen') {
      setCanteenEmail('canteen@apexcollege.edu');
      setJoiningCode(smartKitchenDb.getSession().joiningCode);
      setPassword('canteen123');
    } else {
      setMgmtEmail('admin@apexcollege.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-bold text-white">Smart Kitchen Authentication</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/50 flex gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('student')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('canteen')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'canteen'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Canteen</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('management')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'management'
                ? 'bg-emerald-600 text-neutral-950 font-bold shadow'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Management</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Form */}
          {selectedRole === 'student' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. 2026CS108"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-neutral-500">
                  Demo student enrolled in Apex College Session
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Canteen Form */}
          {selectedRole === 'canteen' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Canteen ID / Staff Email
                </label>
                <input
                  type="text"
                  value={canteenEmail}
                  onChange={(e) => setCanteenEmail(e.target.value)}
                  placeholder="canteen@apexcollege.edu"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Session Joining Code</span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Active: {smartKitchenDb.getSession().joiningCode}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joiningCode}
                    onChange={(e) => setJoiningCode(e.target.value)}
                    placeholder="e.g. KITCHEN-7842"
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-300 font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <Key className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-3" />
                </div>
                <span className="text-[10px] text-neutral-500">
                  Enter the joining code generated by College Management
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Management Form */}
          {selectedRole === 'management' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  College Management Email
                </label>
                <input
                  type="email"
                  value={mgmtEmail}
                  onChange={(e) => setMgmtEmail(e.target.value)}
                  placeholder="admin@apexcollege.edu"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-neutral-500">
                  Full control center for attendance, session creation & analytics
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition cursor-pointer shadow-lg ${
                selectedRole === 'student'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                  : selectedRole === 'canteen'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-neutral-950 shadow-emerald-600/20'
              }`}
            >
              Sign In to {selectedRole.toUpperCase()} Dashboard
            </button>
          </div>
        </form>

        {/* Footer tip */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 text-center text-[11px] text-neutral-500">
          Tip: You can also use the top bar buttons to switch between roles anytime.
        </div>
      </div>
    </div>
  );
};
