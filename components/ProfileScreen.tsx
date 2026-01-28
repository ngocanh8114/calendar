
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserProfile, Reminder } from '../types';
import { calculateBazi } from '../utils/baziLogic';
import { useAppContext } from '../context/AppContext';

// Sub-components
import ProfileHeader from './profile/ProfileHeader';
import BaziGauge from './profile/BaziGauge';
import PillarList from './profile/PillarList';
import ReminderManager from './profile/ReminderManager';
import ProfileEditForm from './profile/ProfileEditForm';

interface ProfileScreenProps {
  onEditReminder?: (reminder: Reminder) => void;
}

/**
 * ProfileScreen Component
 * Displays user destiny details (Bazi) and manages personal reminders.
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ onEditReminder }) => {
  const {
    userProfile,
    saveProfile,
    reminders,
    deleteReminder,
    scrollToReminders,
    setScrollToReminders
  } = useAppContext();

  // Local UI State
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const remindersRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<UserProfile>(userProfile || {
    fullName: '',
    gender: 'Nam',
    dobSolar: '1995-08-15',
    birthTime: '08:30',
    birthPlace: ''
  });

  // Handle auto-scroll to reminders
  useEffect(() => {
    if (scrollToReminders && remindersRef.current) {
      const timer = setTimeout(() => {
        remindersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setScrollToReminders(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scrollToReminders, setScrollToReminders]);

  /**
   * Calculate Bazi data for the current profile
   */
  const baziData = useMemo(() => {
    if (!userProfile) return null;
    return calculateBazi(userProfile);
  }, [userProfile]);

  const handleSave = () => {
    saveProfile(formData);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Rendering logic for Edit vs Detail view
  if (isEditing) {
    return (
      <div className="pb-24 animate-in fade-in duration-300">
        <ProfileHeader
          userProfile={userProfile}
          isEditing={true}
          onEditToggle={() => setIsEditing(false)}
          onBack={() => userProfile && setIsEditing(false)}
        />
        <ProfileEditForm
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onAvatarChange={handleAvatarChange}
        />
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <ProfileHeader
        userProfile={userProfile}
        isEditing={false}
        onEditToggle={() => setIsEditing(true)}
      />

      <main className="px-4 py-6 max-w-md mx-auto space-y-8">
        {/* Profile Card */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {userProfile?.avatar ? (
              <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{userProfile?.fullName}</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span>{userProfile?.dobSolar.replace(/-/g, '/')} {userProfile?.birthTime}</span>
            </div>
            {baziData && (
              <div className="mt-2">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Mệnh: {baziData.destiny}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Bazi Visualization */}
        {baziData && (
          <>
            <BaziGauge fiveElements={baziData.fiveElements} />
            <PillarList pillars={baziData.pillars} />
          </>
        )}

        {/* Reminders List */}
        <div ref={remindersRef}>
          <ReminderManager
            reminders={reminders || []}
            viewYear={viewYear}
            setViewYear={setViewYear}
            onEditReminder={(rem) => onEditReminder?.(rem)}
            onDeleteReminder={deleteReminder}
          />
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
