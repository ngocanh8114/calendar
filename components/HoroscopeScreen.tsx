
import React, { useMemo } from 'react';
import { calculateDailyHoroscope } from '../utils/horoscopeLogic';
import { DEFAULT_USER } from '../constants';
import { UserProfile } from '../types';

interface HoroscopeScreenProps {
  userProfile: UserProfile | null;
}

const HoroscopeScreen: React.FC<HoroscopeScreenProps> = ({ userProfile }) => {
  const targetDate = new Date(); // Today

  const dailyHoroscope = useMemo(() => {
    if (!userProfile) return null;
    return calculateDailyHoroscope(userProfile, targetDate);
  }, [userProfile, targetDate]); // Added targetDate to dependencies for completeness

  const westernZodiacs = [
    { name: 'Bảo Bình', range: '20/1 - 18/2', icon: '♒', score: 77, color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Song Ngư', range: '19/2 - 20/3', icon: '♓', score: 81, color: 'bg-teal-50 text-teal-600' },
    { name: 'Bạch Dương', range: '21/3 - 19/4', icon: '♈', score: 88, color: 'bg-red-50 text-red-600' },
    { name: 'Kim Ngưu', range: '20/4 - 20/5', icon: '♉', score: 75, color: 'bg-orange-50 text-orange-600' },
    { name: 'Song Tử', range: '21/5 - 20/6', icon: '♊', score: 92, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Cự Giải', range: '21/6 - 22/7', icon: '♋', score: 68, color: 'bg-blue-50 text-blue-600' },
    { name: 'Sư Tử', range: '23/7 - 22/8', icon: '♌', score: 85, color: 'bg-amber-50 text-amber-600' },
    { name: 'Xử Nữ', range: '23/8 - 22/9', icon: '♍', score: 79, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Thiên Bình', range: '23/9 - 22/10', icon: '♎', score: 94, color: 'bg-pink-50 text-pink-600' },
    { name: 'Bọ Cạp', range: '23/10 - 21/11', icon: '♏', score: 71, color: 'bg-purple-50 text-purple-600' },
    { name: 'Nhân Mã', range: '22/11 - 21/12', icon: '♐', score: 83, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Ma Kết', range: '22/12 - 19/1', icon: '♑', score: 90, color: 'bg-slate-50 text-slate-600' },
  ];

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Tử Vi của bạn</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {userProfile ? `Hồ sơ: ${userProfile.fullName}` : 'Chưa có hồ sơ'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary bg-slate-100 flex items-center justify-center">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
              ) : userProfile ? (
                <span className="material-symbols-outlined text-primary">person</span>
              ) : (
                <span className="material-symbols-outlined text-slate-300">person_off</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-4">
        {!dailyHoroscope ? (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-primary">contact_page</span>
            </div>
            <h3 className="text-xl font-bold">Chưa tìm thấy hồ sơ</h3>
            <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Vui lòng cập nhật thông tin cá nhân để xem luận giải tử vi hằng ngày.</p>
            <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm">
              Cập nhật ngay
            </button>
          </section>
        ) : (
          <>
            {/* Featured Daily Message */}
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-blue-700 p-6 text-white shadow-xl shadow-blue-500/20">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {dailyHoroscope.zodiacIcon}
                  </div>
                  <div>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Thông điệp ngày mới</span>
                    <p className="text-xs text-blue-100 font-bold mt-1">Dành cho {dailyHoroscope.zodiacName}</p>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">{dailyHoroscope.message}</h2>
                <p className="text-sm text-blue-100/80 leading-relaxed italic border-l-2 border-white/30 pl-4 py-1">
                  {dailyHoroscope.reading}
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </section>

            {/* Personalized Scores Section */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Tình duyên & Tài vận</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Sự nghiệp', score: dailyHoroscope.scores.work, icon: 'business_center', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Tình cảm', score: dailyHoroscope.scores.love, icon: 'favorite', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                  { label: 'Tài lộc', score: dailyHoroscope.scores.wealth, icon: 'account_balance_wallet', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                  { label: 'Sức khỏe', score: dailyHoroscope.scores.health, icon: 'monitor_heart', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} p-4 rounded-3xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-3`}>
                    <div className={`w-10 h-10 rounded-2xl bg-white/50 dark:bg-slate-800 flex items-center justify-center ${s.color} shadow-sm`}>
                      <span className="material-symbols-outlined">{s.icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-lg font-bold">{s.score}<span className="text-[10px] ml-0.5">%</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Lucky Factors Section */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Yếu tố may mắn</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Màu sắc</p>
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-lg ring-4 ring-slate-50 dark:ring-slate-800"
                    style={{ backgroundColor: dailyHoroscope.luckyFactors.color.hex }}
                  ></div>
                  <p className="text-[11px] font-bold mt-3 dark:text-white uppercase">{dailyHoroscope.luckyFactors.color.name}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Con số</p>
                  <div className="w-10 h-10 flex items-center justify-center mx-auto text-3xl font-black text-primary italic">
                    {dailyHoroscope.luckyFactors.number}
                  </div>
                  <p className="text-[11px] font-bold mt-3 dark:text-white uppercase">Cát lợi</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Hướng</p>
                  <div className="w-10 h-10 flex items-center justify-center mx-auto bg-primary/10 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-2xl rotate-45">near_me</span>
                  </div>
                  <p className="text-[11px] font-bold mt-3 dark:text-white uppercase">{dailyHoroscope.luckyFactors.direction}</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Western Zodiac Section (General Info) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">12 Cung Hoàng Đạo</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hôm nay</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
            {westernZodiacs.map((zodiac) => (
              <div
                key={zodiac.name}
                className="flex-shrink-0 w-32 bg-white dark:bg-card-dark p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-transform active:scale-95"
              >
                <div className={`w-12 h-12 rounded-2xl ${zodiac.color.split(' ')[0]} flex items-center justify-center text-2xl mb-3 shadow-inner`}>
                  {zodiac.icon}
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{zodiac.name}</h4>
                <p className="text-[9px] text-slate-400 mb-3 font-medium">{zodiac.range}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${zodiac.score}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-primary mt-2">{zodiac.score}%</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HoroscopeScreen;
