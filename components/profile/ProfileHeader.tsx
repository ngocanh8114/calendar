import React from 'react';
import { UserProfile } from '../../types';

interface ProfileHeaderProps {
    userProfile: UserProfile | null;
    isEditing: boolean;
    onEditToggle: () => void;
    onBack?: () => void;
}

/**
 * Profile Header Component
 * Displays the screen title and an edit button, or a back button when editing.
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile, isEditing, onEditToggle, onBack }) => {
    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            {isEditing && (
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
            )}
            <h1 className={`text-lg font-semibold ${!isEditing ? 'ml-4' : ''}`}>
                {isEditing ? 'Chỉnh Sửa Hồ Sơ' : 'Hồ Sơ'}
            </h1>
            {!isEditing ? (
                <button
                    onClick={onEditToggle}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors mr-2"
                >
                    <span className="material-symbols-outlined">edit</span>
                </button>
            ) : (
                <button className="p-2 opacity-0 cursor-default">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            )}
        </header>
    );
};

export default ProfileHeader;
