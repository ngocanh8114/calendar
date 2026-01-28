
export enum AppTab {
  HOME = 'home',
  CALENDAR = 'calendar',
  HOROSCOPE = 'horoscope',
  PROFILE = 'profile'
}

export interface UserProfile {
  fullName: string;
  gender: 'Nam' | 'Nữ';
  dobSolar: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  avatar?: string;
}

export interface FiveElements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  score: number;
}

export interface AuspiciousDate {
  day: number;
  weekday: string;
  lunarDate: string;
  type: 'Hoàng Đạo' | 'Bình Thường';
  score: number;
  description: string;
  color: string;
}

export interface MoonPhase {
  phase: string;
  label: string;
  illumination: number;
}

export interface HoangDaoHour {
  name: string;
  timeRange: string;
  rating: number; // 1-5 stars (legacy simple rating)
  isAuspicious: boolean;
  score?: number; // 0-100
  scoreDetails?: {
    base: number;
    chiScore: number;
    elementScore: number;
    element: string; // e.g., 'Kim'
  };
  goodFor?: string[];
}

export interface DailyAdvice {
  quote: string;
  goodFor: string[];
  avoid: string[];
}

export interface DailyHoroscope {
  date: Date;
  zodiacName: string;
  zodiacIcon: string;
  scores: {
    work: number;
    love: number;
    wealth: number;
    health: number;
  };
  luckyFactors: {
    color: { name: string; hex: string };
    number: number;
    direction: string;
  };
  reading: string;
  message: string;
}

export interface Reminder {
  id: string;
  title: string;
  type: 'solar' | 'lunar';
  day: number;
  month: number;
  year: number; // For lunar, this is usually ignored or used as start year
  time: string; // HH:mm
  notify: boolean;
  createdAt: number;
}
export interface CalendarDay {
  day: number;
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  lunarDay: number;
  lunarMonth: number;
  auspiciousness: 'Hoàng Đạo' | 'Hắc Đạo' | 'Bình Thường';
  solarTerm?: string;
}

export interface SelectedDateInfo {
  date: Date;
  day: number;
  weekdayName: string;
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
  hoangDaoHours: HoangDaoHour[];
  solarTerm?: string;
  advice: {
    quote: string;
    goodFor: string[];
    avoid: string[];
    backgroundImage: string;
  };
  moonPhase: {
    phase: string;
    label: string;
    illumination: number;
    isWaxing: boolean;
  };
}
