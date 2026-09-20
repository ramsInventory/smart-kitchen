/**
 * SMART KITCHEN – AI FOR SUSTAINABILITY
 * Main Application Root
 * Interconnected Dashboards: Student, Canteen, College Management
 * Single Shared Relational Database & AI Prediction Engine
 */

import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { smartKitchenDb } from './db/smartKitchenDatabase';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { CanteenDashboard } from './components/canteen/CanteenDashboard';
import { ManagementDashboard } from './components/management/ManagementDashboard';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialRole, setLoginModalInitialRole] = useState<UserRole>('student');
  const [activeUserLabel, setActiveUserLabel] = useState<string | null>(null);

  // Synchronized state directly connected to smartKitchenDb
  const [session, setSession] = useState(smartKitchenDb.getSession());
  const [menuItems, setMenuItems] = useState(smartKitchenDb.getMenuItems());
  const [predictions, setPredictions] = useState(smartKitchenDb.getPredictions());
  const [dailyLogs, setDailyLogs] = useState(smartKitchenDb.getDailyLogs());
  const [complaints, setComplaints] = useState(smartKitchenDb.getComplaints());
  const [feedback, setFeedback] = useState(smartKitchenDb.getFeedback());
  const [notifications, setNotifications] = useState(smartKitchenDb.getNotifications());
  const [sustainability, setSustainability] = useState(smartKitchenDb.getSustainabilityMetrics());

  // Subscribe to changes in the relational database service
  useEffect(() => {
    const unsubscribe = smartKitchenDb.subscribe(() => {
      setSession({ ...smartKitchenDb.getSession() });
      setMenuItems([...smartKitchenDb.getMenuItems()]);
      setPredictions([...smartKitchenDb.getPredictions()]);
      setDailyLogs([...smartKitchenDb.getDailyLogs()]);
      setComplaints([...smartKitchenDb.getComplaints()]);
      setFeedback([...smartKitchenDb.getFeedback()]);
      setNotifications([...smartKitchenDb.getNotifications()]);
      setSustainability({ ...smartKitchenDb.getSustainabilityMetrics() });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'landing') {
      setActiveUserLabel(null);
    } else if (role === 'student') {
      setActiveUserLabel('Student: 2026CS108');
    } else if (role === 'canteen') {
      setActiveUserLabel('Canteen: Chef Murugan');
    } else if (role === 'management') {
      setActiveUserLabel('Management: admin@apexcollege.edu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLoginModal = (role: UserRole) => {
    setLoginModalInitialRole(role === 'landing' ? 'student' : role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (role: UserRole, userLabel: string) => {
    setActiveUserLabel(userLabel);
    setCurrentRole(role);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Global Navigation Bar */}
      <Navigation
        currentRole={currentRole}
        onSelectRole={handleRoleChange}
        onOpenLoginModal={handleOpenLoginModal}
        session={session}
        sustainability={sustainability}
        unreadNotificationCount={notifications.filter((n) => !n.isRead).length}
        isLoggedIn={!!activeUserLabel}
        activeUserLabel={activeUserLabel}
        onLogout={() => setActiveUserLabel(null)}
      />

      {/* Main Viewport */}
      <main className="flex-1 w-full">
        {currentRole === 'landing' && (
          <LandingPage
            onSelectRole={handleRoleChange}
            onOpenLoginModal={handleOpenLoginModal}
            session={session}
            sustainability={sustainability}
          />
        )}

        {currentRole === 'student' && (
          <StudentDashboard
            session={session}
            menuItems={menuItems}
            complaints={complaints}
            feedback={feedback}
            notifications={notifications}
            predictions={predictions}
          />
        )}

        {currentRole === 'canteen' && (
          <CanteenDashboard
            session={session}
            menuItems={menuItems}
            predictions={predictions}
            dailyLogs={dailyLogs}
            complaints={complaints}
            feedback={feedback}
            notifications={notifications}
            sustainability={sustainability}
          />
        )}

        {currentRole === 'management' && (
          <ManagementDashboard
            session={session}
            menuItems={menuItems}
            predictions={predictions}
            dailyLogs={dailyLogs}
            complaints={complaints}
            feedback={feedback}
            notifications={notifications}
            sustainability={sustainability}
          />
        )}
      </main>

      {/* Persistent College Canteen Footer */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950/80 px-6 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-neutral-400">SMART KITCHEN – AI FOR SUSTAINABILITY</span>
            <span className="text-neutral-600">|</span>
            <span>Apex Institute of Technology Canteen Operations</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Session Code: <strong className="font-mono text-amber-300">{session.joiningCode}</strong></span>
            <span>•</span>
            <span>Target Waste Reduction: <strong className="text-emerald-400">{sustainability.foodWasteReducedPct}%</strong></span>
            <span>•</span>
            <span>AI Model: Attendance & History Correlator v2.4</span>
          </div>
        </div>
      </footer>

      {/* Login / Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialRole={loginModalInitialRole}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
