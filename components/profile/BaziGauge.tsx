import React from 'react';
import { FiveElements } from '../../types';

interface BaziGaugeProps {
    fiveElements: FiveElements;
}

/**
 * Bazi Gauge Component
 * Visualizes the balance of the Five Elements in a circular chart.
 */
const BaziGauge: React.FC<BaziGaugeProps> = ({ fiveElements }) => {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cân Bằng Ngũ Hành</h3>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold">
                    {fiveElements.score > 80 ? 'RẤT TỐT' : 'TỐT'}
                </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <div
                        className="harmony-gauge absolute inset-0 rounded-full rotate-45"
                        style={{
                            background: `conic-gradient(#10B981 0% ${fiveElements.wood}%, #EF4444 ${fiveElements.wood}% ${fiveElements.wood + fiveElements.fire}%, #F59E0B ${fiveElements.wood + fiveElements.fire}% ${fiveElements.wood + fiveElements.fire + fiveElements.earth}%, #94A3B8 ${fiveElements.wood + fiveElements.fire + fiveElements.earth}% ${fiveElements.wood + fiveElements.fire + fiveElements.earth + fiveElements.metal}%, #3B82F6 ${fiveElements.wood + fiveElements.fire + fiveElements.earth + fiveElements.metal}% 100%)`
                        }}
                    ></div>
                    <div className="text-center z-10 bg-white dark:bg-slate-900 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-inner">
                        <div className="text-5xl font-bold flex items-baseline justify-center">
                            {fiveElements.score}<span className="text-xl font-normal text-slate-400">%</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hòa Hợp</div>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-8">
                    {[
                        { label: 'Mộc', color: 'bg-emerald-500', val: `${fiveElements.wood}%` },
                        { label: 'Hỏa', color: 'bg-rose-500', val: `${fiveElements.fire}%` },
                        { label: 'Thổ', color: 'bg-amber-500', val: `${fiveElements.earth}%` },
                        { label: 'Kim', color: 'bg-slate-500', val: `${fiveElements.metal}%` },
                        { label: 'Thủy', color: 'bg-blue-500', val: `${fiveElements.water}%` },
                    ].map((el) => (
                        <div key={el.label} className="text-center">
                            <div className={`w-2 h-2 rounded-full ${el.color} mx-auto mb-2`}></div>
                            <div className="text-[10px] text-slate-400 font-medium">{el.label}</div>
                            <div className="text-xs font-bold dark:text-slate-300">{el.val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BaziGauge;
