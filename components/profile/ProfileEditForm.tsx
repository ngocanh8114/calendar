import React, { useMemo } from 'react';
import { UserProfile } from '../../types';
import { LunarCalendar } from '@dqcai/vn-lunar';

interface ProfileEditFormProps {
    formData: UserProfile;
    setFormData: (data: UserProfile) => void;
    onSave: () => void;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Profile Edit Form Component
 * Provides a dedicated form for updating user profile information.
 */
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    formData,
    setFormData,
    onSave,
    onAvatarChange
}) => {

    // Preview lunar date based on selected solar date
    const lunarPreview = useMemo(() => {
        try {
            const [y, m, d] = formData.dobSolar.split(/[-/]/).map(Number);
            const lunar = LunarCalendar.fromSolar(d, m, y);
            return `Ngày ${lunar.lunarDate.day} tháng ${lunar.lunarDate.month} năm ${lunar.yearCanChi}`;
        } catch {
            return '';
        }
    }, [formData.dobSolar]);

    return (
        <main className="px-5 py-6 space-y-8 max-w-md mx-auto">
            <section className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={onAvatarChange}
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg cursor-pointer overflow-hidden"
                    >
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                        )}
                    </label>
                    <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white border-2 border-white dark:border-slate-900 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </label>
                </div>
                <h2 className="text-xl font-bold">Hồ sơ của bạn</h2>
                <p className="text-xs text-slate-400 mt-1">Cập nhật thông tin để xem tử vi chính xác</p>
            </section>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Họ và tên</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn An"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Giới tính</label>
                    <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'Nam' })}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${formData.gender === 'Nam' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">male</span>
                            Nam
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'Nữ' })}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${formData.gender === 'Nữ' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">female</span>
                            Nữ
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ngày sinh (Dương)</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={formData.dobSolar}
                                onChange={e => setFormData({ ...formData, dobSolar: e.target.value })}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-primary outline-none shadow-sm text-center font-semibold"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Giờ sinh</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={formData.birthTime}
                                onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-primary outline-none shadow-sm text-center font-semibold"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-50 dark:border-blue-900/30">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-primary dark:text-blue-300 uppercase tracking-widest">Ngày âm lịch tương ứng</span>
                        <span className="material-symbols-outlined text-sm text-primary font-bold">sync</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{lunarPreview}</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nơi sinh</label>
                    <input
                        type="text"
                        value={formData.birthPlace}
                        onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                        placeholder="Chọn tỉnh/thành phố"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary outline-none shadow-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-3xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Lưu hồ sơ
                </button>
            </form>
        </main>
    );
};

export default ProfileEditForm;
