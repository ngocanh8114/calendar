import React from 'react';
import { SelectedDateInfo } from '../../types';

interface AdviceCardProps {
    selectedDateInfo: SelectedDateInfo;
}

/**
 * Advice Card Component
 * Displays the daily quote with a stylized background image and activity advice.
 */
const AdviceCard: React.FC<AdviceCardProps> = ({ selectedDateInfo }) => {
    return (
        <div className="space-y-6">
            <section className="px-5 mt-4">
                <div className="relative h-44 rounded-3xl overflow-hidden shadow-xl group">
                    <img
                        alt="Advice"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={selectedDateInfo.advice.backgroundImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 right-5">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider mb-2">Lời khuyên</span>
                        <p className="text-white text-lg font-semibold leading-tight">
                            "{selectedDateInfo.advice.quote}"
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-5 grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
                        <span className="material-icons-round text-xl">check_circle</span>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Tốt cho:</p>
                    <div className="flex flex-col gap-1">
                        {selectedDateInfo.advice.goodFor.map((item, i) => (
                            <span key={i} className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">• {item}</span>
                        ))}
                    </div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/20 p-5 rounded-3xl border border-rose-100 dark:border-rose-900/30">
                    <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/20">
                        <span className="material-icons-round text-xl">block</span>
                    </div>
                    <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Nên tránh:</p>
                    <div className="flex flex-col gap-1">
                        {selectedDateInfo.advice.avoid.map((item, i) => (
                            <span key={i} className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">• {item}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdviceCard;
