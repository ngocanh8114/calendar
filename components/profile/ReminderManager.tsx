import React from 'react';
import { Reminder } from '../../types';
import { sortRemindersBySolarDateDesc, getReminderSolarDate } from '../../utils';

interface ReminderManagerProps {
    reminders: Reminder[];
    viewYear: number;
    setViewYear: (year: number) => void;
    onEditReminder: (reminder: Reminder) => void;
    onDeleteReminder: (id: string) => void;
}

/**
 * Reminder Manager Component
 * Handles the display and management of user reminders with year-based filtering.
 */
const ReminderManager: React.FC<ReminderManagerProps> = ({
    reminders,
    viewYear,
    setViewYear,
    onEditReminder,
    onDeleteReminder
}) => {

    /**
     * Helper to format the display date for a reminder
     */
    const getDisplayDate = (reminder: Reminder, year: number) => {
        const solarDate = getReminderSolarDate(reminder, year);
        if (reminder.type === 'solar') {
            return `${solarDate.getDate()}/${solarDate.getMonth() + 1}/${year}`;
        } else {
            return `${solarDate.getDate()}/${solarDate.getMonth() + 1}/${year} (Âm: ${reminder.day}/${reminder.month})`;
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nhắc nhở của tôi</h3>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button onClick={() => setViewYear(viewYear - 1)} className="p-0.5"><span className="material-symbols-outlined text-xs">chevron_left</span></button>
                    <span className="text-xs font-black min-w-[32px] text-center">{viewYear}</span>
                    <button onClick={() => setViewYear(viewYear + 1)} className="p-0.5"><span className="material-symbols-outlined text-xs">chevron_right</span></button>
                </div>
            </div>

            <div className="space-y-3">
                {reminders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">notifications_off</span>
                        <p className="text-sm text-slate-400">Bạn chưa có nhắc nhở nào.</p>
                    </div>
                ) : (
                    sortRemindersBySolarDateDesc(reminders, viewYear).map(reminder => (
                        <div key={reminder.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-all hover:border-primary/30 group">
                            <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-inner ${reminder.type === 'lunar' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                                {reminder.type === 'lunar' ? '🌙' : '📅'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{reminder.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[13px]">event</span>
                                        {getDisplayDate(reminder, viewYear)}
                                    </span>
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                                        {reminder.time}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => onEditReminder(reminder)}
                                    className="p-1.5 hover:bg-blue-50 hover:text-blue-500 rounded-full transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => onDeleteReminder(reminder.id)}
                                    className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ReminderManager;
