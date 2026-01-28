
import { LunarCalendar } from '@dqcai/vn-lunar';
import { UserProfile, FiveElements } from '../types';

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const CAN_ELEMENTS: Record<string, string> = {
    'Giáp': 'Mộc', 'Ất': 'Mộc',
    'Bính': 'Hỏa', 'Đinh': 'Hỏa', 'Bình': 'Hỏa',
    'Mậu': 'Thổ', 'Kỷ': 'Thổ',
    'Canh': 'Kim', 'Tân': 'Kim',
    'Nhâm': 'Thủy', 'Quý': 'Thủy'
};

const CHI_ELEMENTS: Record<string, string> = {
    'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
    'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
    'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

/**
 * Calculate the Heavenly Stem (Can) of the birth hour based on the Day Stem.
 * Follows the "Ngũ Tý Tuần Can" rule in traditional Bazi.
 * @param dayCan - The Heavenly Stem of the birth day.
 * @param hourIndex - The index of the birth hour (0-11, where 0 is Tý 23h-01h).
 * @returns The Heavenly Stem of the birth hour.
 */
function getHourCan(dayCan: string, hourIndex: number): string {
    const dayCanIndex = CAN.indexOf(dayCan);
    // Ngũ Tý Tuần Can rule
    let startCanIndex = 0;
    if (dayCanIndex === 0 || dayCanIndex === 5) startCanIndex = 0; // Giáp, Kỷ -> Giáp Tý
    else if (dayCanIndex === 1 || dayCanIndex === 6) startCanIndex = 2; // Ất, Canh -> Bính Tý
    else if (dayCanIndex === 2 || dayCanIndex === 7) startCanIndex = 4; // Bính, Tân -> Mậu Tý
    else if (dayCanIndex === 3 || dayCanIndex === 8) startCanIndex = 6; // Đinh, Nhâm -> Canh Tý
    else if (dayCanIndex === 4 || dayCanIndex === 9) startCanIndex = 8; // Mậu, Quý -> Nhâm Tý

    return CAN[(startCanIndex + hourIndex) % 10];
}

const DESTINY_MAP: Record<string, string> = {
    'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
    'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
    'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
    'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
    'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
    'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
    'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
    'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
    'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
    'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
    'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
    'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
    'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
    'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
    'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
    'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
    'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
    'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
    'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
    'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
    'Giáp Thìn': 'Phúc Đăng Hỏa', 'Ất Tỵ': 'Phúc Đăng Hỏa',
    'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
    'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
    'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
    'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
    'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
    'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
    'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
    'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
    'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};

/**
 * Identify the "Nạp Âm" (Destiny/Element Name) based on the Year Pillar.
 * Provides a poetic description like "Lộ Bàng Thổ" (Earth on the side of the road).
 * @param canChi - The Can Chi string of the year (e.g., "Giáp Tý").
 * @returns The localized Nạp Âm name.
 */
function getDestinyName(canChi: string): string {
    if (!canChi) return 'Bản Mệnh';

    // 1. Normalize and clean the input string
    let clean = canChi.replace(/^(Năm|Tháng)\s+/i, '').trim().normalize('NFC');

    // 2. Fix known library typos (e.g., "Bình" instead of "Bính")
    clean = clean.replace(/\bBình\b/g, 'Bính');

    // 3. Extract last two words (e.g. "Bính Dần")
    const words = clean.split(/\s+/);
    const key = words.slice(-2).join(' ');

    // 4. Robust lookup (case-insensitive and normalized)
    const foundKey = Object.keys(DESTINY_MAP).find(k =>
        k.normalize('NFC').toLowerCase() === key.toLowerCase()
    );

    return foundKey ? DESTINY_MAP[foundKey] : 'Bản Mệnh';
}

export interface PillarInfo {
    label: string;
    val: string;
    element: string;
    elCol: string;
}

/**
 * Core engine for Bazi (Four Pillars of Destiny) calculation.
 * Analyzes birth data to determine the 4 Pillars, Destiny, and Five Elements balance.
 * @param profile - User profile containing solar birth date and time.
 * @returns An object containing pillars, five elements percentages, and destiny name.
 */
export function calculateBazi(profile: UserProfile) {
    // Robust date splitting for YYYY-MM-DD or YYYY/MM/DD
    const [year, month, day] = profile.dobSolar.split(/[-/]/).map(Number);
    const [hour, minute] = profile.birthTime.split(':').map(Number);

    const lunar = LunarCalendar.fromSolar(day, month, year);

    // Year Pillar
    const yearPillar = lunar.yearCanChi;

    // Month Pillar
    const monthPillar = lunar.monthCanChi;

    // Day Pillar
    const dayPillar = lunar.dayCanChi;

    // Hour Pillar
    // Vietnamese hours: 23-1: Tý, 1-3: Sửu, etc.
    let hourIndex = Math.floor((hour + 1) / 2) % 12;
    const hourChi = CHI[hourIndex];
    const dayCan = dayPillar.split(' ')[0];
    const hourCan = getHourCan(dayCan, hourIndex);
    const hourPillar = `${hourCan} ${hourChi}`;

    const getPillarData = (p: string, label: string): PillarInfo => {
        const parts = p.split(' ');
        const can = parts[parts.length - 2];
        const chi = parts[parts.length - 1];
        const element = CAN_ELEMENTS[can] || '';
        return {
            label,
            val: `${can} ${chi}`,
            element,
            elCol: getElCol(element)
        };
    };

    const pillars: PillarInfo[] = [
        getPillarData(yearPillar, 'Trụ Năm'),
        getPillarData(monthPillar, 'Trụ Tháng'),
        getPillarData(dayPillar, 'Trụ Ngày'),
        getPillarData(hourPillar, 'Trụ Giờ'),
    ];

    // Five Elements Balance calculation
    const counts: Record<string, number> = { 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Kim': 0, 'Thủy': 0 };

    [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
        if (!p) return;
        const parts = p.split(' ');
        const can = parts[parts.length - 2];
        const chi = parts[parts.length - 1];

        const canEl = CAN_ELEMENTS[can];
        const chiEl = CHI_ELEMENTS[chi];

        if (canEl) counts[canEl] += 1;
        if (chiEl) counts[chiEl] += 1.5; // Chi elements weighted higher
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    // Deterministic Harmony Score based on user profile seed
    const seed = `${profile.fullName}-${profile.dobSolar}-${profile.birthTime}-${profile.birthPlace}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const stableScore = 75 + (Math.abs(hash) % 24);

    const fiveElements: FiveElements = {
        wood: Math.round((counts['Mộc'] / total) * 100),
        fire: Math.round((counts['Hỏa'] / total) * 100),
        earth: Math.round((counts['Thổ'] / total) * 100),
        metal: Math.round((counts['Kim'] / total) * 100),
        water: Math.round((counts['Thủy'] / total) * 100),
        score: stableScore
    };

    return {
        pillars,
        fiveElements,
        destiny: getDestinyName(yearPillar),
        lunarEquivalent: `${lunar.lunarDate.day}/${lunar.lunarDate.month} - ${yearPillar}`
    };
}

function getElCol(element: string): string {
    switch (element) {
        case 'Mộc': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
        case 'Hỏa': return 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300';
        case 'Thổ': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
        case 'Kim': return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
        case 'Thủy': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';
        default: return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
    }
}
