import React from 'react';

interface HomeHeaderProps {
    monthYearString: string;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

/**
 * Home Header Component
 * Displays the current month/year and navigation controls.
 */
const HomeHeader: React.FC<HomeHeaderProps> = ({ monthYearString, onPrevMonth, onNextMonth }) => {
    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-icons-round">calendar_today</span>
                </div>
                <h1 className="text-xl font-bold uppercase tracking-tight">{monthYearString}</h1>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onPrevMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-icons-round text-slate-500">chevron_left</span>
                </button>
                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-icons-round text-slate-500">chevron_right</span>
                </button>
            </div>
        </header>
    );
};

export default HomeHeader;
