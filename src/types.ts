/**
 * Relational Schema & Types for Smart Kitchen - AI for Sustainability
 */

export type UserRole = 'landing' | 'student' | 'canteen' | 'management';

export type DayType = 'NORMAL_DAY' | 'SPECIAL_EVENT';

export type ComplaintStatus = 'PENDING' | 'REVIEWED' | 'FORWARDED' | 'RESOLVED';

export type WasteRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type MealSlot = 'Breakfast (7:30 - 9:30 AM)' | 'Lunch (12:00 - 2:30 PM)' | 'Snacks (4:30 - 6:00 PM)' | 'Dinner (7:30 - 9:30 PM)';

export type FoodCategory = 'breakfast' | 'lunch' | 'snacks' | 'beverages';

export interface Student {
  id: string;
  regNo: string;
  name: string;
  department: string;
  semester: string;
  email: string;
  collegeSessionId: string;
  avatarUrl?: string;
}

export interface CanteenUser {
  id: string;
  canteenId: string;
  name: string;
  email: string;
  collegeSessionId: string;
  campusBranch: string;
}

export interface ManagementUser {
  id: string;
  email: string;
  name: string;
  collegeName: string;
  designation: string;
}

export interface CollegeSession {
  id: string;
  name: string;
  term: string;
  campus: string;
  joiningCode: string;
  totalStudents: number;
  currentAttendancePct: number;
  dayType: DayType;
  specialEventDetails?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  date: string;
  totalStudents: number;
  presentStudents: number;
  attendancePercentage: number;
  dayType: DayType;
  specialEventDetails?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  basePrice: number;
  costPrice: number;
  currentStock: number;
  maxDailyCapacity: number;
  servingUnit: string;
  mealSlot: MealSlot;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  dietary: 'Veg' | 'Non-Veg' | 'Vegan';
  calories: number;
  imageUrl: string;
  description: string;
}

export interface DailyLogRecord {
  id: string;
  sessionId: string;
  menuItemId: string;
  foodName: string;
  date: string;
  preparedQty: number;
  consumedQty: number;
  remainingQty: number;
  wastedQty: number;
  dayType: DayType;
  attendancePct: number;
  unitCost: number;
}

export interface AIPrediction {
  id: string;
  sessionId: string;
  menuItemId: string;
  foodName: string;
  date: string;
  expectedStudents: number;
  historicalAvgDemand: number;
  yesterdayConsumption: number;
  yesterdayPrepared: number;
  yesterdayWaste: number;
  predictedDemand: number;
  recommendedPreparation: number;
  expectedSurplus: number;
  expectedWasteRisk: WasteRiskLevel;
  confidencePct: number;
  explanation: string;
  formulaFactors: {
    attendanceRatio: number;
    popularityWeight: number;
    eventMultiplier: number;
    wasteDampingFactor: number;
  };
}

export interface Complaint {
  id: string;
  sessionId: string;
  studentId: string;
  studentRegNo: string;
  studentName: string;
  subject: string;
  description: string;
  foodItem: string;
  date: string;
  status: ComplaintStatus;
  managementNotes?: string;
  canteenResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  studentId: string;
  studentRegNo: string;
  studentName: string;
  menuItemId: string;
  foodName: string;
  rating: number; // 1-5
  comments: string;
  tags: string[];
  date: string;
  createdAt: string;
}

export interface NotificationMessage {
  id: string;
  sessionId: string;
  fromRole: 'management';
  toRole: 'canteen' | 'all';
  title: string;
  message: string;
  type: 'ATTENDANCE_UPDATE' | 'SPECIAL_EVENT' | 'COMPLAINT_ALERT' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export interface SustainabilityMetrics {
  foodSavedKg: number;
  foodWasteReducedPct: number;
  moneySavedInr: number;
  energySavedKwh: number;
  co2PreventedKg: number;
  dailyWasteKg: number;
  weeklyWasteKg: number;
  monthlyWasteKg: number;
  wasteRiskLevel: WasteRiskLevel;
}
