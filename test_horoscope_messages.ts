// Test script to verify personalized horoscope messages
import { calculateDailyHoroscope } from './utils/horoscopeLogic';

const user1 = {
    fullName: 'Nguyễn Văn A',
    gender: 'Nam' as const,
    dobSolar: '1990-05-15',
    birthTime: '08:00',
    birthPlace: 'Hà Nội',
    lunarEquivalent: '21/4/1990',
    destiny: 'Kim',
    avatar: ''
};

const user2 = {
    fullName: 'Trần Thị B',
    gender: 'Nữ' as const,
    dobSolar: '1990-05-15',
    birthTime: '14:00',
    birthPlace: 'TP.HCM',
    lunarEquivalent: '21/4/1990',
    destiny: 'Thủy',
    avatar: ''
};

console.log('=== Testing Horoscope Personalization ===\n');

// Test 1: Same user, different days
const today = new Date('2026-01-27');
const tomorrow = new Date('2026-01-28');

const user1Today = calculateDailyHoroscope(user1, today);
const user1Tomorrow = calculateDailyHoroscope(user1, tomorrow);

console.log('Test 1: Same user (Nguyễn Văn A), different days');
console.log('---');
console.log('Today (2026-01-27):');
console.log(`  Message: ${user1Today.message}`);
console.log(`  Reading: ${user1Today.reading}`);
console.log('\nTomorrow (2026-01-28):');
console.log(`  Message: ${user1Tomorrow.message}`);
console.log(`  Reading: ${user1Tomorrow.reading}`);
console.log(`\n✓ Messages are ${user1Today.message !== user1Tomorrow.message ? 'DIFFERENT' : 'SAME'}`);

// Test 2: Different users, same day
const user2Today = calculateDailyHoroscope(user2, today);

console.log('\n\nTest 2: Different users, same day (2026-01-27)');
console.log('---');
console.log('User 1 (Nguyễn Văn A):');
console.log(`  Message: ${user1Today.message}`);
console.log(`  Reading: ${user1Today.reading}`);
console.log('\nUser 2 (Trần Thị B):');
console.log(`  Message: ${user2Today.message}`);
console.log(`  Reading: ${user2Today.reading}`);
console.log(`\n✓ Messages are ${user1Today.message !== user2Today.message ? 'DIFFERENT' : 'SAME'}`);

// Test 3: Stability check (same user, same day, multiple calls)
const user1TodayAgain = calculateDailyHoroscope(user1, today);

console.log('\n\nTest 3: Stability check (same user, same day, multiple calls)');
console.log('---');
console.log('First call:');
console.log(`  Message: ${user1Today.message}`);
console.log('\nSecond call:');
console.log(`  Message: ${user1TodayAgain.message}`);
console.log(`\n✓ Messages are ${user1Today.message === user1TodayAgain.message ? 'STABLE (SAME)' : 'UNSTABLE (DIFFERENT)'}`);
