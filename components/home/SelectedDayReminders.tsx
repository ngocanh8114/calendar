import React from 'react';
import { Reminder } from '../../types';

interface SelectedDayRemindersProps {
    reminders: Reminder[];
    onViewAll: () => void;
}

/**
 * Selected Day Reminders Component
 * Displays a list of tasks/reminders for the currently selected date.
 */
const SelectedDayReminders: React.FC<SelectedDayRemindersProps> = ({ reminders, onViewAll }) => {
    if (reminders.length === 0) return null;

    return (
        <div className="mt-6 px-5 w-full animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-rose-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                    <h3 className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nhắc nhở công việc</h3>
                    <button
                        onClick={onViewAll}
                        className="ml-auto text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                    >
                        Xem tất cả
                    </button>
                </div>
                <div className="space-y-3">
                    {reminders.map((rem) => {
                        const style = rem.type === 'lunar'
                            ? { border: 'border-l-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' }
                            : { border: 'border-l-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' };

                        return (
                            <div key={rem.id} className={`relative ${style.bg} ${style.border} border-l-4 rounded-2xl p-4 pr-3`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{rem.title}</h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{rem.time}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SelectedDayReminders;
