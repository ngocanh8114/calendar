
import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { Reminder } from '../types';
import { LunarCalendar } from '@dqcai/vn-lunar';
import { generateCalendarDays } from '../utils/calendarHelpers';
import { requestNotificationPermission } from '../utils/notificationHelper';

interface AddReminderScreenProps {
    onSave: (reminder: Reminder) => void;
    onCancel: () => void;
    initialReminder?: Reminder | null;
}

const AddReminderScreen: React.FC<AddReminderScreenProps> = ({ onSave, onCancel, initialReminder }) => {
    const [title, setTitle] = useState(initialReminder?.title || '');
    const [type, setType] = useState<'solar' | 'lunar'>(initialReminder?.type || 'solar');

    // Find a solar date for the calendar picker
    const getInitialDate = () => {
        if (!initialReminder) return new Date();
        if (initialReminder.type === 'solar') {
            return new Date(initialReminder.year || new Date().getFullYear(), initialReminder.month - 1, initialReminder.day);
        } else {
            // For lunar, we try to find the solar date in the year stored
            try {
                const lunar = LunarCalendar.fromLunar(
                    initialReminder.day,
                    initialReminder.month,
                    initialReminder.year || new Date().getFullYear()
                );
                const solar = lunar.solarDate;
                return new Date(solar.year, solar.month - 1, solar.day);
            } catch (e) {
                return new Date();
            }
        }
    };

    const initialDate = getInitialDate();
    const [monthViewing, setMonthViewing] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    // Parse time like "08:30 AM"
    const parseInitialTime = () => {
        if (!initialReminder) return { time: '08:00', period: 'AM' as const };
        const [t, p] = initialReminder.time.split(' ');
        return { time: t, period: p as 'AM' | 'PM' };
    };

    const { time: initTime, period: initPeriod } = parseInitialTime();
    const [time, setTime] = useState(initTime);
    const [period, setPeriod] = useState(initPeriod);
    const [notify, setNotify] = useState(initialReminder ? initialReminder.notify : true);

    const hourScrollRef = useRef<HTMLDivElement>(null);
    const minuteScrollRef = useRef<HTMLDivElement>(null);
    const periodScrollRef = useRef<HTMLDivElement>(null);

    // Initial scroll position
    useLayoutEffect(() => {
        if (hourScrollRef.current) {
            const h = parseInt(time.split(':')[0]);
            hourScrollRef.current.scrollTop = (h === 12 ? 0 : h) * 48 + 12 * 48; // Middle set
        }
        if (minuteScrollRef.current) {
            const m = parseInt(time.split(':')[1]);
            minuteScrollRef.current.scrollTop = m * 48 + 60 * 48; // Middle set
        }
        if (periodScrollRef.current) {
            periodScrollRef.current.scrollTop = (period === 'AM' ? 0 : 48);
        }
    }, []);

    const days = useMemo(() => {
        return generateCalendarDays(monthViewing.getFullYear(), monthViewing.getMonth());
    }, [monthViewing]);

    const lunarPreview = useMemo(() => {
        const lunar = LunarCalendar.fromSolar(selectedDate.getDate(), selectedDate.getMonth() + 1, selectedDate.getFullYear());
        return `Ngày ${lunar.lunarDate.day} tháng ${lunar.lunarDate.month} năm ${lunar.yearCanChi}`;
    }, [selectedDate]);

    const handleSave = () => {
        if (!title.trim()) return;

        const reminder: Reminder = {
            id: initialReminder?.id || Date.now().toString(),
            title,
            type,
            day: type === 'solar' ? selectedDate.getDate() : LunarCalendar.fromSolar(selectedDate.getDate(), selectedDate.getMonth() + 1, selectedDate.getFullYear()).lunarDate.day,
            month: type === 'solar' ? selectedDate.getMonth() + 1 : LunarCalendar.fromSolar(selectedDate.getDate(), selectedDate.getMonth() + 1, selectedDate.getFullYear()).lunarDate.month,
            year: selectedDate.getFullYear(),
            time: `${time} ${period}`,
            notify,
            createdAt: initialReminder?.createdAt || Date.now(),
        };

        onSave(reminder);
    };

    const changeMonth = (offset: number) => {
        setMonthViewing(new Date(monthViewing.getFullYear(), monthViewing.getMonth() + offset, 1));
    };

    return (
        <div className="animate-in fade-in duration-300 bg-background-light dark:bg-background-dark min-h-full">
            <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back_ios_new</span>
                </button>
                <h1 className="text-xl font-bold">{initialReminder ? 'Sửa nhắc nhở' : 'Thêm nhắc nhở'}</h1>
                <button className="p-2 opacity-0">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </header>

            <main className="px-6 py-8 space-y-8 max-w-md mx-auto">
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Tên nhắc nhở</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ví dụ: Giỗ ông nội, Sinh nhật..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm text-lg"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Loại lịch</label>
                    <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-3xl flex gap-2">
                        <button
                            onClick={() => setType('solar')}
                            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${type === 'solar' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400'}`}
                        >Lịch Dương</button>
                        <button
                            onClick={() => setType('lunar')}
                            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${type === 'lunar' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400'}`}
                        >Lịch Âm</button>
                    </div>
                    {type === 'lunar' && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-50 dark:border-blue-900/20 mt-4 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                Nhắc nhở âm lịch sẽ tự động lặp lại hàng năm theo chu kỳ lịch âm.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Chọn thời gian</label>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-slate-400">chevron_left</span>
                            </button>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                                    Tháng {monthViewing.getMonth() + 1} Năm {monthViewing.getFullYear()}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ất Tỵ</p>
                            </div>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                <div key={d} className={`text-center text-[10px] font-bold ${d === 'CN' ? 'text-rose-500' : 'text-slate-300'} py-2`}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-1">
                            {days.map((day, idx) => {
                                const isSelected = selectedDate.getDate() === day.date.getDate() &&
                                    selectedDate.getMonth() === day.date.getMonth() &&
                                    selectedDate.getFullYear() === day.date.getFullYear();

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(day.date)}
                                        className={`
                      relative h-11 flex flex-col items-center justify-center rounded-2xl transition-all
                      ${!day.isCurrentMonth ? 'opacity-20 pointer-events-none' : ''}
                      ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 z-10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                                    >
                                        <span className="text-sm font-bold">{day.day}</span>
                                        {isSelected && (
                                            <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Chọn giờ chi tiết</h3>
                                <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full text-[10px] font-black text-primary dark:text-blue-300 uppercase tracking-wider">
                                    {time} {period}
                                </div>
                            </div>

                            <div className="relative flex justify-center items-center h-48 overflow-hidden font-sans bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl">
                                {/* Selection Highlight Bar */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-full h-12 bg-white dark:bg-slate-800 rounded-xl z-0 shadow-sm border border-slate-100 dark:border-slate-700"></div>

                                {/* Hour Column */}
                                <div
                                    ref={hourScrollRef}
                                    className="flex-1 h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar z-10 py-[72px]"
                                    onScroll={(e) => {
                                        const top = (e.target as HTMLDivElement).scrollTop;
                                        const idx = Math.round(top / 48);
                                        const h = (idx % 12) || 12;
                                        const hStr = h.toString().padStart(2, '0');
                                        if (time.split(':')[0] !== hStr) {
                                            setTime(`${hStr}:${time.split(':')[1]}`);
                                        }
                                    }}
                                >
                                    {[...Array(36)].map((_, i) => {
                                        const h = (i % 12) || 12;
                                        const isSelected = parseInt(time.split(':')[0]) === h;
                                        return (
                                            <div key={i} className={`h-12 flex items-center justify-center snap-center text-xl font-black transition-all ${isSelected ? 'text-primary scale-110' : 'opacity-20'}`}>
                                                {h.toString().padStart(2, '0')}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-xl font-black opacity-100 z-10 px-2">:</div>

                                {/* Minute Column */}
                                <div
                                    ref={minuteScrollRef}
                                    className="flex-1 h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar z-10 py-[72px]"
                                    onScroll={(e) => {
                                        const top = (e.target as HTMLDivElement).scrollTop;
                                        const idx = Math.round(top / 48);
                                        const m = (idx % 60);
                                        const mStr = m.toString().padStart(2, '0');
                                        if (time.split(':')[1] !== mStr) {
                                            setTime(`${time.split(':')[0]}:${mStr}`);
                                        }
                                    }}
                                >
                                    {[...Array(180)].map((_, i) => {
                                        const m = i % 60;
                                        const isSelected = parseInt(time.split(':')[1]) === m;
                                        return (
                                            <div key={i} className={`h-12 flex items-center justify-center snap-center text-xl font-black transition-all ${isSelected ? 'text-primary scale-110' : 'opacity-20'}`}>
                                                {m.toString().padStart(2, '0')}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Period Column */}
                                <div
                                    ref={periodScrollRef}
                                    className="flex-1 h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar z-10 py-[72px]"
                                    onScroll={(e) => {
                                        const top = (e.target as HTMLDivElement).scrollTop;
                                        const idx = Math.round(top / 48);
                                        const p = (idx === 0) ? 'AM' : 'PM';
                                        if (period !== p && (idx === 0 || idx === 1)) setPeriod(p);
                                    }}
                                >
                                    {['AM', 'PM'].map((p, i) => {
                                        const isSelected = period === p;
                                        return (
                                            <div key={p} className={`h-12 flex items-center justify-center snap-center text-sm font-bold transition-all ${isSelected ? 'text-primary scale-110' : 'opacity-20'}`}>
                                                {p}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary dark:text-blue-300">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Thông báo</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Nhắc nhở ngay lập tức</p>
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    const nextState = !notify;
                                    if (nextState) {
                                        const granted = await requestNotificationPermission();
                                        if (granted) setNotify(true);
                                    } else {
                                        setNotify(false);
                                    }
                                }}
                                className={`w-14 h-8 rounded-full transition-all relative ${notify ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${notify ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Lưu nhắc nhở
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AddReminderScreen;
