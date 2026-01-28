import React from 'react';

interface Pillar {
    label: string;
    val: string;
    element: string;
    elCol: string;
}

interface PillarListProps {
    pillars: Pillar[];
}

/**
 * Pillar List Component
 * Displays the Four Pillars (Bazi) details for the user's birth data.
 */
const PillarList: React.FC<PillarListProps> = ({ pillars }) => {
    return (
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Chi Tiết Bát Tự</h3>
            <div className="grid grid-cols-2 gap-4">
                {pillars.map((pillar) => (
                    <div key={pillar.label} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{pillar.label}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{pillar.val}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${pillar.elCol}`}>{pillar.element}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PillarList;
