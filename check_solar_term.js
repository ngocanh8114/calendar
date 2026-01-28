import { LunarCalendar } from '@dqcai/vn-lunar';

const date = new Date(2024, 2, 20); // Around Vernal Equinox
const lunar = LunarCalendar.fromSolar(date.getDate(), date.getMonth() + 1, date.getFullYear());

console.log('Keys:', Object.keys(lunar));
console.log('Lunar Object:', JSON.stringify(lunar, null, 2));
