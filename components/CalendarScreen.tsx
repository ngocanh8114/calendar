
import React, { useMemo, useState } from 'react';
import { getMonthAuspiciousDays } from '../utils/calendarHelpers';

interface CalendarScreenProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

const CATEGORIES = ['Tất cả', 'Cưới hỏi', 'Khai trương', 'Xuất hành', 'Làm nhà'];

const CalendarScreen: React.FC<CalendarScreenProps> = ({ selectedMonth, setSelectedMonth }) => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const allDays = useMemo(() => {
    return getMonthAuspiciousDays(year, month);
  }, [year, month]);

  // Filter days based on active category
  const filteredDays = useMemo(() => {
    if (activeCategory === 'Tất cả') {
      return allDays;
    }
    return allDays.filter(d => d.goodFor.includes(activeCategory));
  }, [allDays, activeCategory]);

  const monthYearString = selectedMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setSelectedMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-start text-slate-500 hover:text-primary transition-colors">
          <span className="material-icons-round text-2xl">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight uppercase">{monthYearString}</h1>
        <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-end text-slate-500 hover:text-primary transition-colors">
          <span className="material-icons-round text-2xl">chevron_right</span>
        </button>
      </header>

      <div className="px-5 py-2 overflow-x-auto hide-scrollbar flex gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm border transition-all ${activeCategory === cat
              ? 'bg-primary text-white border-primary'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-primary/50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="px-5 space-y-4">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest pl-1">
          {filteredDays.length} ngày tốt {activeCategory !== 'Tất cả' ? `cho ${activeCategory}` : 'trong tháng'}
        </p>

        {filteredDays.map((dateInfo, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 flex items-center gap-4 transition-all active:scale-[0.98]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold">{dateInfo.day}</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 leading-none">{dateInfo.weekday}</span>
                  <span className="text-[10px] font-medium" style={{ color: dateInfo.color }}>{dateInfo.type}</span>
                </div>
                {dateInfo.solarTerm && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                    {dateInfo.solarTerm}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{dateInfo.lunarDate}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{dateInfo.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {dateInfo.goodFor.map((tag, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-100 dark:text-slate-700" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle
                  className="progress-ring__circle"
                  style={{ stroke: dateInfo.color }}
                  cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * dateInfo.score) / 100}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-slate-800 dark:text-white">{dateInfo.score}</span>
                <span className="text-[8px] font-medium text-slate-400 uppercase">Điểm</span>
              </div>
            </div>
          </div>
        ))}

        {filteredDays.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            {activeCategory === 'Tất cả'
              ? 'Không có ngày tốt nào trong tháng này.'
              : `Không có ngày tốt cho ${activeCategory} trong tháng này.`}
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarScreen;
