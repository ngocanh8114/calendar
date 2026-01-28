import React from 'react';
import { SelectedDateInfo } from '../../types';

interface MoonPhaseDisplayProps {
    selectedDateInfo: SelectedDateInfo;
}

/**
 * Moon Phase Display Component
 * Renders the realistic moon visual and detailed date information.
 */
const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({ selectedDateInfo }) => {
    return (
        <section className="px-6 py-8 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/10 flex justify-center">
            <div className="flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-700">
                {/* Moon Phase Visual - Left */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-[6px] border-white dark:border-slate-800 shadow-xl overflow-hidden bg-[#0f172a] relative">
                            {/* 1. Base Dark Circle */}

                            {/* 2. Lit Semi-circle (Waxing: Right, Waning: Left) */}
                            <div
                                className={`absolute top-0 bottom-0 w-1/2 bg-[#fde68a] transition-all duration-700 ${selectedDateInfo.moonPhase.isWaxing ? 'right-0' : 'left-0'}`}
                            ></div>

                            {/* 3. Ellipse overlay to create curve */}
                            <div
                                className="absolute inset-0 transition-all duration-700"
                                style={{
                                    borderRadius: '50%',
                                    backgroundColor: selectedDateInfo.moonPhase.illumination < 50 ? '#0f172a' : '#fde68a',
                                    transform: `scaleX(${Math.abs(selectedDateInfo.moonPhase.illumination - 50) / 50})`,
                                    zIndex: 2
                                }}
                            ></div>
                        </div>

                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#d97706]/80 text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter backdrop-blur-sm shadow-sm whitespace-nowrap z-10">
                            {selectedDateInfo.moonPhase.label}
                        </div>
                    </div>

                    {/* Solar Term Display */}
                    {selectedDateInfo.solarTerm && (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <span className="px-3 py-1 bg-rose-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow-lg shadow-rose-500/30 whitespace-nowrap">
                                Tiết {selectedDateInfo.solarTerm}
                            </span>
                        </div>
                    )}
                </div>

                {/* Date Info - Right */}
                <div className="text-left shrink-0">
                    <p className="text-[#94a3b8] dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                        {selectedDateInfo.weekdayName}, {selectedDateInfo.day} THÁNG {String(selectedDateInfo.date.getMonth() + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-2xl font-black text-[#2563eb] dark:text-blue-400 leading-tight mb-4 whitespace-nowrap">
                        {selectedDateInfo.lunarDay}/{selectedDateInfo.lunarMonth} Âm Lịch
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-[#f1f5f9] dark:bg-slate-800 text-[9px] font-bold rounded-full text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            Năm {selectedDateInfo.yearCanChi}
                        </span>
                        <span className="px-2.5 py-1 bg-[#f1f5f9] dark:bg-slate-800 text-[9px] font-bold rounded-full text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {selectedDateInfo.monthCanChi}
                        </span>
                        <span className="px-2.5 py-1 bg-[#f1f5f9] dark:bg-slate-800 text-[9px] font-bold rounded-full text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {selectedDateInfo.dayCanChi}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MoonPhaseDisplay;
