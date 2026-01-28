import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppTab, UserProfile, Reminder } from '../types';
import { requestNotificationPermission, isReminderDue, sendNotification } from '../utils/notificationHelper';

/**
 * App Context State Interface
 */
interface AppContextType {
    // Navigation
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    selectedMonth: Date;
    setSelectedMonth: (date: Date) => void;

    // User Profile
    userProfile: UserProfile | null;
    saveProfile: (profile: UserProfile) => void;

    // Reminders
    reminders: Reminder[];
    addReminder: (reminder: Reminder) => void;
    deleteReminder: (id: string) => void;

    // Internal Navigation Helper
    navigateToReminders: () => void;
    scrollToReminders: boolean;
    setScrollToReminders: (scroll: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider Component
 * Manages global state for user profile, reminders, and navigation.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Navigation State
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [scrollToReminders, setScrollToReminders] = useState(false);

    // User Profile State (Persistent)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem('user_profile');
        return saved ? JSON.parse(saved) : null;
    });

    // Reminders State (Persistent)
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        const saved = localStorage.getItem('user_reminders');
        return saved ? JSON.parse(saved) : [];
    });

    const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

    // Sync state with localStorage
    useEffect(() => {
        if (userProfile) {
            localStorage.setItem('user_profile', JSON.stringify(userProfile));
        }
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('user_reminders', JSON.stringify(reminders));
    }, [reminders]);

    // Initial permission request
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    // Reminder Notification Engine
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const currentMinuteStr = now.toISOString().slice(0, 16);

            reminders.forEach(r => {
                if (r.notify && isReminderDue(r, now)) {
                    const notificationKey = `${r.id}-${currentMinuteStr}`;
                    if (!notifiedIds.has(notificationKey)) {
                        sendNotification('Lịch Vạn Niên - Nhắc nhở', r.title);
                        setNotifiedIds(prev => new Set(prev).add(notificationKey));
                    }
                }
            });

            if (notifiedIds.size > 100) {
                setNotifiedIds(new Set());
            }
        }, 30000);

        return () => clearInterval(timer);
    }, [reminders, notifiedIds]);

    // Navigation Logic
    const navigateToReminders = () => {
        setScrollToReminders(true);
        setActiveTab(AppTab.PROFILE);
    };

    // Data Actions
    const saveProfile = (profile: UserProfile) => {
        setUserProfile(profile);
    };

    const addReminder = (reminder: Reminder) => {
        const existingIndex = reminders.findIndex(r => r.id === reminder.id);
        if (existingIndex >= 0) {
            const updated = [...reminders];
            updated[existingIndex] = reminder;
            setReminders(updated);
        } else {
            setReminders([...reminders, reminder]);
        }
    };

    const deleteReminder = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <AppContext.Provider
            value={{
                activeTab,
                setActiveTab,
                selectedMonth,
                setSelectedMonth,
                userProfile,
                saveProfile,
                reminders,
                addReminder,
                deleteReminder,
                navigateToReminders,
                scrollToReminders,
                setScrollToReminders
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

/**
 * Hook to use the App Context
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
