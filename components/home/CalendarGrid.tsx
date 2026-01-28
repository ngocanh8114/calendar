import React from 'react';
import { CalendarDay } from '../../types';

interface CalendarGridProps {
    calendarDays: CalendarDay[];
    selectedDate: Date;
    onDateClick: (date: Date) => void;
    isExpanded: boolean;
    toggleExpanded: () => void;
    hasReminders: (date: Date) => boolean;
}

/**
 * Calendar Grid Component
 * Renders the day grid with lunar dates and auspicious markers.
 */
const CalendarGrid: React.FC<CalendarGridProps> = ({
    calendarDays,
    selectedDate,
    onDateClick,
    isExpanded,
    toggleExpanded,
    hasReminders
}) => {
    return (
        <section className="px-5 py-4 bg-white dark:bg-slate-900/50 transition-all duration-500 ease-in-out">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-4 px-2">
                <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
            </div>

            <div className={`grid grid-cols-7 gap-y-4 text-center items-center overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-[280px]'}`}>
                {calendarDays.map((dayIdx, index) => {
                    const isSelected = selectedDate.getDate() === dayIdx.day &&
                        selectedDate.getMonth() === dayIdx.date.getMonth() &&
                        selectedDate.getFullYear() === dayIdx.date.getFullYear() &&
                        dayIdx.isCurrentMonth;

                    const isHoangDao = dayIdx.auspiciousness === 'Hoàng Đạo';
                    const isHacDao = dayIdx.auspiciousness === 'Hắc Đạo';

                    return (
                        <div
                            key={index}
                            onClick={() => onDateClick(dayIdx.date)}
                            className={`relative flex flex-col items-center cursor-pointer p-1 rounded-xl transition-all
                                ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10' : ''}
                                ${!dayIdx.isCurrentMonth ? 'opacity-30' : ''}
                                ${dayIdx.isToday && !isSelected ? 'border border-primary/30 bg-primary/5' : ''}
                            `}
                        >
                            <span className={`font-medium text-sm ${dayIdx.date.getDay() === 0 ? 'text-red-500' : ''} ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {dayIdx.day}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className={`text-[8px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                    {dayIdx.lunarDay}/{dayIdx.lunarMonth}
                                </span>
                                {!isSelected && isHoangDao && <div className="w-1 h-1 rounded-full bg-amber-400" title="Hoàng Đạo"></div>}
                                {!isSelected && isHacDao && <div className="w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-500" title="Hắc Đạo"></div>}

                                {hasReminders(dayIdx.date) && (
                                    <span
                                        className="absolute top-0 -right-1 text-[12px] material-symbols-outlined leading-none text-rose-500 z-20"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        grade
                                    </span>
                                )}
                            </div>

                            {dayIdx.solarTerm && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" title={dayIdx.solarTerm}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={toggleExpanded}
                className="w-full mt-2 flex flex-col items-center justify-center py-2 text-slate-400 hover:text-primary transition-colors"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </span>
                <span className={`material-icons-round transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>
        </section>
    );
};

export default CalendarGrid;
