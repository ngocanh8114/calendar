import React, { useState, useEffect } from 'react';
import { AppTab, Reminder } from './types';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import CalendarScreen from './components/CalendarScreen';
import HoroscopeScreen from './components/HoroscopeScreen';
import ProfileScreen from './components/ProfileScreen';
import AddReminderScreen from './components/AddReminderScreen';
import { AppProvider, useAppContext } from './context/AppContext';

/**
 * Main Application Shell
 * Root component that provides global state and handles tab switching.
 */
const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    reminders,
    addReminder,
    userProfile
  } = useAppContext();

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Reset local UI states when tab changes
  useEffect(() => {
    setIsAddingReminder(false);
    setEditingReminder(null);
  }, [activeTab]);

  /**
   * Render the active screen based on selected tab
   */
  const renderScreen = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <HomeScreen
            onAddReminder={() => setIsAddingReminder(true)}
          />
        );
      case AppTab.CALENDAR:
        return (
          <CalendarScreen
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            reminders={reminders}
          />
        );
      case AppTab.HOROSCOPE:
        return <HoroscopeScreen userProfile={userProfile} />;
      case AppTab.PROFILE:
        return (
          <ProfileScreen
            onEditReminder={(rem) => {
              setEditingReminder(rem);
              setIsAddingReminder(true);
            }}
          />
        );
      default:
        return <HomeScreen onAddReminder={() => setIsAddingReminder(true)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark relative shadow-2xl overflow-x-hidden flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        {renderScreen()}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Persistent Overlay for Add/Edit Reminder */}
      <div
        className={`fixed inset-0 top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[150] bg-background-light dark:bg-background-dark overflow-y-auto transition-all duration-300 ${isAddingReminder ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        {isAddingReminder && (
          <AddReminderScreen
            key={editingReminder ? `edit-${editingReminder.id}` : 'new'}
            onSave={(rem) => {
              addReminder(rem);
              setIsAddingReminder(false);
              setEditingReminder(null);
            }}
            onCancel={() => {
              setIsAddingReminder(false);
              setEditingReminder(null);
            }}
            initialReminder={editingReminder}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
