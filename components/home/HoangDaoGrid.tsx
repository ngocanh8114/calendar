import React from 'react';
import { SelectedDateInfo } from '../../types';

interface HoangDaoGridProps {
    hoangDaoHours: SelectedDateInfo['hoangDaoHours'];
}

/**
 * Hoang Dao Grid Component
 * Displays the list of auspicious hours with ratings, scores, and activity tags.
 */
const HoangDaoGrid: React.FC<HoangDaoGridProps> = ({ hoangDaoHours }) => {
    return (
        <section className="px-5 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-amber-500">access_time</span>
                    Giờ Hoàng Đạo
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {hoangDaoHours.map((hour) => (
                    <div key={hour.name} className="flex flex-col bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-1 z-10 relative">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{hour.name}</span>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-yellow-500 flex">
                                    {Array(hour.rating).fill(0).map((_, i) => (
                                        <span key={i} className="material-icons-round text-[10px]">star</span>
                                    ))}
                                </span>
                                {hour.score !== undefined && (
                                    <span className={`text-[10px] font-bold px-1.5 rounded mt-1 
                                            ${hour.score >= 80 ? 'bg-emerald-100 text-emerald-600' :
                                            hour.score >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                        {hour.score}đ
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 z-10 relative">{hour.timeRange}</span>
                        <div className="flex flex-wrap gap-1 mt-2 z-10 relative">
                            {hour.goodFor?.map((tag, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {hour.score !== undefined && (
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40 transition-all duration-1000" style={{ width: `${hour.score}%` }}></div>
                        )}
                    </div>
                ))}
                {hoangDaoHours.length === 0 && (
                    <div className="col-span-2 text-center text-slate-400 text-sm py-4 italic">
                        Không có giờ Đại Cát (trên 80đ) trong ngày.
                    </div>
                )}
            </div>
        </section>
    );
};

export default HoangDaoGrid;
