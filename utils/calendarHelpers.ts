/**
 * Calendar Utilities
 * Helpers for generating calendar grid with lunar dates
 */

import { LunarCalendar } from '@dqcai/vn-lunar';
import { getMoonPhase, MoonPhase } from './moonPhase';
import { getAuspiciousHours, getDayChiIndex, HoangDaoHour, getDayAuspiciousness, getHoangDaoHours } from './hoangDao';
import { getDailyAdvice, DailyAdvice, getPoeticDescription } from './dailyAdvice';
import { calculateHourScore, Element, getGoodActivities } from './scoring';
import { getSolarTerm } from './solarTerms';

export interface DayInfo {
    date: Date;
    day: number;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    isLeapMonth: boolean;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    dayCanChi: string;
    monthCanChi: string;
    yearCanChi: string;
    auspiciousness: 'Hoàng Đạo' | 'Bình Thường' | 'Hắc Đạo';
    solarTerm?: string;
}

export interface SelectedDateInfo extends DayInfo {
    moonPhase: MoonPhase;
    hoangDaoHours: HoangDaoHour[];
    advice: DailyAdvice;
    weekdayName: string;
}

const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/**
 * Get the first day of a given month and year.
 * @param year - The solar year.
 * @param month - The solar month (0-11).
 * @returns A Date object representing the first day of the month.
 */
function getFirstDayOfMonth(year: number, month: number): Date {
    return new Date(year, month, 1);
}

/**
 * Get the number of days in a given month and year.
 * @param year - The solar year.
 * @param month - The solar month (0-11).
 * @returns The total number of days in the month.
 */
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Check if two Date objects represent the same calendar day.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if day, month, and year match.
 */
function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

/**
 * Generate an array of calendar days for a specific month, 
 * including padding days from previous and next months to fill a 6-week grid (42 days).
 * @param year - The solar year.
 * @param month - The solar month (0-11).
 * @returns An array of DayInfo objects.
 */
export function generateCalendarDays(year: number, month: number): DayInfo[] {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Adjust for Monday start (Vietnamese calendar typically starts Monday)
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: DayInfo[] = [];

    // Previous month days to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = adjustedStartDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(prevYear, prevMonth, day);
        const lunar = LunarCalendar.fromSolar(day, prevMonth + 1, prevYear);

        days.push({
            date,
            day,
            lunarDay: lunar.lunarDate.day,
            lunarMonth: lunar.lunarDate.month,
            lunarYear: lunar.lunarDate.year,
            isLeapMonth: lunar.lunarDate.leap,
            isCurrentMonth: false,
            isToday: isSameDay(date, today),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            dayCanChi: lunar.dayCanChi,
            monthCanChi: lunar.monthCanChi,
            yearCanChi: lunar.yearCanChi,
            auspiciousness: getDayAuspiciousness(lunar.lunarDate.month, lunar.dayCanChi),
            solarTerm: getSolarTerm(date) || undefined,
        });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const lunar = LunarCalendar.fromSolar(day, month + 1, year);

        days.push({
            date,
            day,
            lunarDay: lunar.lunarDate.day,
            lunarMonth: lunar.lunarDate.month,
            lunarYear: lunar.lunarDate.year,
            isLeapMonth: lunar.lunarDate.leap,
            isCurrentMonth: true,
            isToday: isSameDay(date, today),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            dayCanChi: lunar.dayCanChi,
            monthCanChi: lunar.monthCanChi,
            yearCanChi: lunar.yearCanChi,
            auspiciousness: getDayAuspiciousness(lunar.lunarDate.month, lunar.dayCanChi),
            solarTerm: getSolarTerm(date) || undefined,
        });
    }

    // Next month days to fill remaining cells (up to 42 = 6 weeks)
    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(nextYear, nextMonth, day);
        const lunar = LunarCalendar.fromSolar(day, nextMonth + 1, nextYear);

        days.push({
            date,
            day,
            lunarDay: lunar.lunarDate.day,
            lunarMonth: lunar.lunarDate.month,
            lunarYear: lunar.lunarDate.year,
            isLeapMonth: lunar.lunarDate.leap,
            isCurrentMonth: false,
            isToday: isSameDay(date, today),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            dayCanChi: lunar.dayCanChi,
            monthCanChi: lunar.monthCanChi,
            yearCanChi: lunar.yearCanChi,
            auspiciousness: getDayAuspiciousness(lunar.lunarDate.month, lunar.dayCanChi),
            solarTerm: getSolarTerm(date) || undefined,
        });
    }

    return days;
}

/**
 * Get comprehensive localized information for a selected solar date.
 * Includes lunar date, Can Chi, auspicious hours, Advice, and Moon phase.
 * @param date - The solar Date to analyze.
 * @returns A detailed SelectedDateInfo object.
 */
export function getSelectedDateInfo(date: Date): SelectedDateInfo {
    const today = new Date();
    const lunar = LunarCalendar.fromSolar(date.getDate(), date.getMonth() + 1, date.getFullYear());

    const moonPhase = getMoonPhase(lunar.lunarDate.day);
    const dayChiIndex = getDayChiIndex(lunar.dayCanChi);

    // Extract Day Can for Hour Can calculation
    // lunar.dayCanChi = "Giáp Tý" -> "Giáp"
    const dayCan = lunar.dayCanChi.split(' ')[0];

    // Mock User Profile for Demo (User: Giáp Tý - mệnh Kim)
    // In real app, pull from context/store
    const mockUserChi = 'Tý';
    const mockUserElement = Element.Metal;

    const hoangDaoHours = getHoangDaoHours(dayChiIndex).map((h, index) => {
        // Recalculate with advanced scoring
        const scoreData = calculateHourScore(
            h.chi,
            h.startHour === 23 ? 0 : Math.floor(h.startHour / 2) + (h.startHour === 23 ? 0 : 0), // Tý=0, Sửu=1... need accurate index mapping
            h.isAuspicious,
            dayCan,
            mockUserChi,
            mockUserElement
        );

        // Correct index mapping:
        // GIO_TIME_RANGES in hoangDao.ts starts with Tý (23-01). Index 0.
        // My calculateHourScore expects 0-11 index corresponding to Tý-Hợi.
        // Fortunately, map index 0 is Tý.
        const scoreDataCorrect = calculateHourScore(
            h.chi,
            index, // 0=Tý, 1=Sửu... matches loop
            h.isAuspicious,
            dayCan,
            mockUserChi,
            mockUserElement
        );

        return {
            ...h,
            score: scoreDataCorrect.total,
            scoreDetails: {
                base: scoreDataCorrect.base,
                chiScore: scoreDataCorrect.chiScore,
                elementScore: scoreDataCorrect.elementScore,
                element: scoreDataCorrect.element
            },
            goodFor: getGoodActivities(scoreDataCorrect)
        };
    }).filter(h => h.score !== undefined && h.score > 80); // Filter > 80 requested by user. 
    // Careful: this might return empty array if no hours are good enough.
    // User requested: "hiển thị những giờ tốt trên 80 điểm thôi"

    const advice = getDailyAdvice(lunar.lunarDate.day, lunar.lunarDate.month, lunar.dayCanChi);

    return {
        date,
        day: date.getDate(),
        lunarDay: lunar.lunarDate.day,
        lunarMonth: lunar.lunarDate.month,
        lunarYear: lunar.lunarDate.year,
        isLeapMonth: lunar.lunarDate.leap,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dayCanChi: lunar.dayCanChi,
        monthCanChi: lunar.monthCanChi,
        yearCanChi: lunar.yearCanChi,
        auspiciousness: getDayAuspiciousness(lunar.lunarDate.month, lunar.dayCanChi),
        moonPhase,
        hoangDaoHours,
        advice,
        weekdayName: WEEKDAY_NAMES[date.getDay()],
        solarTerm: getSolarTerm(date) || undefined,
    };
}

/**
 * Simple formatter for lunar day and month.
 * @param lunarDay - Day in lunar calendar.
 * @param lunarMonth - Month in lunar calendar.
 * @returns A string in "day/month" format.
 */
export function formatLunarDate(lunarDay: number, lunarMonth: number): string {
    return `${lunarDay}/${lunarMonth}`;
}

/**
 * Comprehensive formatter for lunar date including Can Chi year.
 * @param lunarDay - Day in lunar calendar.
 * @param lunarMonth - Month in lunar calendar.
 * @param yearCanChi - The Can Chi name of the year (e.g., "Bính Ngọ").
 * @returns A localized string describing the lunar date.
 */
export function formatFullLunarDate(lunarDay: number, lunarMonth: number, yearCanChi: string): string {
    return `${lunarDay}/${lunarMonth} Âm Lịch - Năm ${yearCanChi}`;
}

/**
 * Extended AuspiciousDate for month view
 */
export interface MonthAuspiciousDay {
    date: Date;
    day: number;
    weekday: string;
    lunarDate: string;
    dayCanChi: string;
    type: 'Hoàng Đạo' | 'Bình Thường' | 'Hắc Đạo';
    score: number;
    description: string;
    color: string;
    solarTerm?: string;
    goodFor: string[];
}

const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Generate a list of "good days" (auspicious) for a given month with detailed scoring.
 * Used for the Calendar visualization/list view.
 * @param year - Solar year.
 * @param month - Solar month (0-11).
 * @returns An array of MonthAuspiciousDay objects filtered by score >= 70.
 */
export function getMonthAuspiciousDays(year: number, month: number): MonthAuspiciousDay[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: MonthAuspiciousDay[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const lunar = LunarCalendar.fromSolar(day, month + 1, year);
        const auspiciousness = getDayAuspiciousness(lunar.lunarDate.month, lunar.dayCanChi);
        const solarTerm = getSolarTerm(date);
        const advice = getDailyAdvice(lunar.lunarDate.day, lunar.lunarDate.month, lunar.dayCanChi);

        // Calculate day score
        let score = 50; // Base neutral score

        // Auspiciousness modifier
        if (auspiciousness === 'Hoàng Đạo') {
            score += 30;
        } else if (auspiciousness === 'Hắc Đạo') {
            score -= 20;
        }

        // Lunar day bonuses (1st, 15th = full moon days)
        if (lunar.lunarDate.day === 1 || lunar.lunarDate.day === 15) {
            score += 10;
        }

        // Solar term bonus
        if (solarTerm) {
            score += 15;
        }

        // Weekend penalty (less ideal for business)
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            score -= 5;
        }

        // Clamp score
        score = Math.max(0, Math.min(100, score));

        // Color based on score
        let color = '#64748b'; // slate
        if (score >= 80) {
            color = '#22c55e'; // green
        } else if (score >= 60) {
            color = '#f59e0b'; // amber  
        } else if (score < 40) {
            color = '#ef4444'; // red
        }

        // Determine goodFor categories based on DISTINCT day characteristics
        // Each category has its own specific criteria to avoid overlap
        const goodFor: string[] = [];

        const lunarDay = lunar.lunarDate.day;
        const dayChi = lunar.dayCanChi.split(' ')[1]; // Extract Chi from "Giáp Tý" -> "Tý"

        // 1. Cưới hỏi: Hoàng Đạo + specific lunar days (2, 4, 6, 8, 10, 12, 16, 18, 20, 22, 24, 26)
        // Traditional: even days in the first half of lunar month are good for weddings
        const weddingDays = [2, 4, 6, 8, 10, 12, 16, 18, 20, 22, 24, 26];
        if (auspiciousness === 'Hoàng Đạo' && weddingDays.includes(lunarDay)) {
            goodFor.push('Cưới hỏi');
        }

        // 2. Khai trương: Hoàng Đạo + weekday + specific Chi (Tý, Dần, Thìn, Ngọ, Thân, Tuất - Yang Chi)
        const businessChi = ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất'];
        if (auspiciousness === 'Hoàng Đạo' && dayOfWeek >= 1 && dayOfWeek <= 5 && businessChi.includes(dayChi)) {
            goodFor.push('Khai trương');
        }

        // 3. Xuất hành: Good score (>= 65) + NOT weekend + NOT specific bad days (Tam Nương: 3, 7, 13, 18, 22, 27)
        const badTravelDays = [3, 7, 13, 18, 22, 27];
        if (score >= 65 && dayOfWeek >= 1 && dayOfWeek <= 5 && !badTravelDays.includes(lunarDay)) {
            goodFor.push('Xuất hành');
        }

        // 4. Làm nhà: Hoàng Đạo + specific Chi good for construction (Dần, Mão, Thìn, Tỵ - Spring/Wood Chi)
        // + NOT specific lunar days to avoid (5, 14, 23 = Nguyệt Kỵ)
        const constructionChi = ['Dần', 'Mão', 'Thìn', 'Tỵ'];
        const monthTaboo = [5, 14, 23];
        if (auspiciousness === 'Hoàng Đạo' && constructionChi.includes(dayChi) && !monthTaboo.includes(lunarDay)) {
            goodFor.push('Làm nhà');
        }

        // 5. Cúng lễ: 1st, 15th lunar days (traditional offering days)
        if (lunarDay === 1 || lunarDay === 15) {
            goodFor.push('Cúng lễ');
        }

        // Generate poetic description based on tags
        const description = getPoeticDescription(goodFor, `${year}-${month}-${day}`);

        days.push({
            date,
            day,
            weekday: WEEKDAY_SHORT[dayOfWeek],
            lunarDate: `${lunar.lunarDate.day}/${lunar.lunarDate.month} - ${lunar.dayCanChi}`,
            dayCanChi: lunar.dayCanChi,
            type: auspiciousness,
            score,
            description,
            color,
            solarTerm: solarTerm || undefined,
            goodFor,
        });
    }

    // Sort by day ascending, filter only good days (score >= 70)
    return days
        .filter(d => d.score >= 70)
        .sort((a, b) => a.day - b.day);
}
/**
 * Sort an array of reminders by their scheduled time in ascending order.
 * Handles AM/PM formats and edge cases like 12 AM/PM.
 * @param reminders - Array of reminder objects with a .time property.
 * @returns A new sorted array of reminders.
 */
export function sortRemindersByTime(reminders: any[]): any[] {
    return [...reminders].sort((a, b) => {
        const timeToMinutes = (timeStr: string) => {
            if (!timeStr) return 0;
            const parts = timeStr.trim().split(' ');
            if (parts.length < 2) return 0;
            const [time, period] = parts;
            const [hoursStr, minutesStr] = time.split(':');
            let hours = parseInt(hoursStr) || 0;
            const minutes = parseInt(minutesStr) || 0;

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
}

/**
 * Get the effective solar date for a reminder in a specific solar year.
 * For lunar reminders, it finds the (first) solar date in that year that matches the lunar day/month.
 */
/**
 * Determine the exact solar date a reminder falls on within a specific year.
 * Crucial for correctly placing lunar-based reminders in the solar calendar for current/future years.
 * @param r - The reminder object.
 * @param solarYear - The year to calculate for.
 * @returns A Date object with correctly set hours and minutes.
 */
export function getReminderSolarDate(r: any, solarYear: number): Date {
    const timeToMinutes = (timeStr: string) => {
        if (!timeStr) return { hours: 0, minutes: 0 };
        const parts = timeStr.trim().split(' ');
        if (parts.length < 2) return { hours: 0, minutes: 0 };
        const [timePart, period] = parts;
        const [hoursStr, minutesStr] = timePart.split(':');
        let hours = parseInt(hoursStr) || 0;
        const minutes = parseInt(minutesStr) || 0;

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return { hours, minutes };
    };

    const { hours, minutes } = timeToMinutes(r.time) as { hours: number, minutes: number };

    if (r.type === 'solar') {
        const d = new Date(solarYear, r.month - 1, r.day);
        d.setHours(hours, minutes, 0, 0);
        return d;
    } else {
        // Find the lunar-to-solar mapping in this year
        // We look in solarYear-1 and solarYear lunar calendars because lunar months can span solar years
        try {
            // Check solar days from Jan 1 to Dec 31
            // Optimized: typical lunar month M is around solar month M or M+1
            for (let m = 1; m <= 12; m++) {
                const daysInMonth = new Date(solarYear, m, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    const lunar = LunarCalendar.fromSolar(d, m, solarYear);
                    if (lunar.lunarDate.day === r.day && lunar.lunarDate.month === r.month) {
                        const date = new Date(solarYear, m - 1, d);
                        date.setHours(hours, minutes, 0, 0);
                        return date;
                    }
                }
            }
        } catch (e) { }

        // Fallback
        const d = new Date(solarYear, 0, 1);
        d.setHours(hours, minutes, 0, 0);
        return d;
    }
}

/**
 * Sort reminders by their effective solar date in descending order.
 * @param reminders - Array of reminder objects.
 * @param year - The context year.
 * @returns A new sorted array (most recent first).
 */
export function sortRemindersBySolarDateDesc(reminders: any[], year: number): any[] {
    return [...reminders].sort((a, b) => {
        const fullDateA = getReminderSolarDate(a, year);
        const fullDateB = getReminderSolarDate(b, year);
        return fullDateB.getTime() - fullDateA.getTime();
    });
}




