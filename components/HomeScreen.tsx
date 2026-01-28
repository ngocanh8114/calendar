import React, { useState, useMemo } from 'react';
import { generateCalendarDays, getSelectedDateInfo, sortRemindersByTime } from '../utils';
import { AppTab } from '../types';
import { LunarCalendar } from '@dqcai/vn-lunar';
import { useAppContext } from '../context/AppContext';

// Sub-components
import HomeHeader from './home/HomeHeader';
import CalendarGrid from './home/CalendarGrid';
import MoonPhaseDisplay from './home/MoonPhaseDisplay';
import SelectedDayReminders from './home/SelectedDayReminders';
import AdviceCard from './home/AdviceCard';
import HoangDaoGrid from './home/HoangDaoGrid';

interface HomeScreenProps {
  onAddReminder?: () => void;
}

/**
 * HomeScreen Component
 * Core dashboard of the application showing calendar, moon phase, and daily advice.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ onAddReminder }) => {
  const {
    setActiveTab,
    setSelectedMonth,
    navigateToReminders,
    reminders
  } = useAppContext();

  // Local UI State
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * Filter and sort reminders for a specific date
   */
  const getRemindersForDate = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const lunar = LunarCalendar.fromSolar(d, m, y);

    const filtered = (reminders || []).filter(r => {
      if (r.type === 'solar') {
        return r.day === d && r.month === m;
      } else {
        return r.day === lunar.lunarDate.day && r.month === lunar.lunarDate.month;
      }
    });

    return sortRemindersByTime(filtered);
  };

  // Memoized data for current view
  const selectedDateReminders = useMemo(() => getRemindersForDate(selectedDate), [selectedDate, reminders]);

  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const selectedDateInfo = useMemo(() => {
    return getSelectedDateInfo(selectedDate);
  }, [selectedDate]);

  // Event Handlers
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const monthYearString = currentMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <HomeHeader
        monthYearString={monthYearString}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <CalendarGrid
        calendarDays={calendarDays}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        isExpanded={isCalendarExpanded}
        toggleExpanded={() => setIsCalendarExpanded(!isCalendarExpanded)}
        hasReminders={(date) => getRemindersForDate(date).length > 0}
      />

      <MoonPhaseDisplay selectedDateInfo={selectedDateInfo} />

      <SelectedDayReminders
        reminders={selectedDateReminders}
        onViewAll={navigateToReminders}
      />

      <AdviceCard selectedDateInfo={selectedDateInfo} />

      <HoangDaoGrid hoangDaoHours={selectedDateInfo.hoangDaoHours} />

      <section className="px-5 mb-8">
        <button
          onClick={() => {
            setSelectedMonth(currentMonth);
            setActiveTab(AppTab.CALENDAR);
          }}
          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-icons-round">calendar_month</span>
          Xem Chi Tiết Tháng
        </button>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={onAddReminder}
        className="fixed bottom-24 right-5 bg-primary hover:bg-blue-700 text-white px-5 py-3.5 rounded-full font-bold shadow-xl shadow-primary/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <span className="material-symbols-outlined font-black">add</span>
        Thêm nhắc nhở
      </button>
    </div>
  );
};

export default HomeScreen;
