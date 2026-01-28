
import React from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.HOME, label: 'Trang chủ', icon: 'home' },
    { id: AppTab.CALENDAR, label: 'Ngày đẹp', icon: 'calendar_month' },
    { id: AppTab.HOROSCOPE, label: 'Tử vi', icon: 'auto_awesome' },
    { id: AppTab.PROFILE, label: 'Cá nhân', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 pb-8 flex justify-between items-center z-[100]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-primary active-tab' : 'text-slate-400 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]">{tab.icon}</span>
          <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
