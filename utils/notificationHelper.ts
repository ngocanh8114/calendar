
import { Reminder } from '../types';
import { LunarCalendar } from '@dqcai/vn-lunar';

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

export function sendNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
        });
    }
}

export function isReminderDue(reminder: Reminder, now: Date): boolean {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Convert reminder time (e.g., "08:30 AM") to 24h format "08:30"
    const [timePart, period] = reminder.time.split(' ');
    let [hours, minutes] = timePart.split(':');
    let hoursNum = parseInt(hours);
    if (period === 'PM' && hoursNum !== 12) hoursNum += 12;
    if (period === 'AM' && hoursNum === 12) hoursNum = 0;
    const reminderTime24 = `${hoursNum.toString().padStart(2, '0')}:${minutes}`;

    if (reminder.type === 'solar') {
        // Simple match for solar reminders
        return (
            reminder.day === currentDay &&
            reminder.month === currentMonth &&
            reminderTime24 === currentTimeStr
        );
    } else {
        // Lunar match
        const lunar = LunarCalendar.fromSolar(currentDay, currentMonth, currentYear);
        return (
            reminder.day === lunar.lunarDate.day &&
            reminder.month === lunar.lunarDate.month &&
            reminderTime24 === currentTimeStr
        );
    }
}
