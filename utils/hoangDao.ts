/**
 * Giờ Hoàng Đạo - Vietnamese Auspicious Hours Calculator
 * Based on @dqcai/vn-lunar GIO_HD data
 */

import { GIO_HD, CHI } from '@dqcai/vn-lunar';

export interface HoangDaoHour {
    name: string;        // 'Giờ Tý'
    chi: string;         // 'Tý'
    timeRange: string;   // '23:00 - 01:00'
    startHour: number;   // 23
    endHour: number;     // 1
    rating: number;      // 1-5 stars
    isAuspicious: boolean;
}

// 12 Giờ trong ngày (mỗi giờ 2 tiếng)
const GIO_TIME_RANGES: { chi: string; start: number; end: number }[] = [
    { chi: 'Tý', start: 23, end: 1 },
    { chi: 'Sửu', start: 1, end: 3 },
    { chi: 'Dần', start: 3, end: 5 },
    { chi: 'Mão', start: 5, end: 7 },
    { chi: 'Thìn', start: 7, end: 9 },
    { chi: 'Tỵ', start: 9, end: 11 },
    { chi: 'Ngọ', start: 11, end: 13 },
    { chi: 'Mùi', start: 13, end: 15 },
    { chi: 'Thân', start: 15, end: 17 },
    { chi: 'Dậu', start: 17, end: 19 },
    { chi: 'Tuất', start: 19, end: 21 },
    { chi: 'Hợi', start: 21, end: 23 },
];

/**
 * Format time range for display
 */
function formatTimeRange(start: number, end: number): string {
    const startStr = start.toString().padStart(2, '0') + ':00';
    const endStr = end.toString().padStart(2, '0') + ':00';
    return `${startStr} - ${endStr}`;
}

/**
 * Get chi index from day's Can Chi string
 * E.g., "Đinh Sửu" -> 1 (Sửu index)
 */
export function getDayChiIndex(dayCanChi: string): number {
    const parts = dayCanChi.split(' ');
    const chi = parts[parts.length - 1]; // Get the Chi part
    return CHI.indexOf(chi);
}

/**
 * Get Hoang Dao hours for a specific day based on its Chi
 * @param dayChiIndex - Index of the day's Chi (0-11)
 * @returns Array of 12 hours with auspicious flag
 */
export function getHoangDaoHours(dayChiIndex: number): HoangDaoHour[] {
    // GIO_HD is array of 6 strings representing Hoang Dao patterns for each Chi pair
    // Pattern index: 0 = Tý/Ngọ, 1 = Sửu/Mùi, 2 = Dần/Thân, 3 = Mão/Dậu, 4 = Thìn/Tuất, 5 = Tỵ/Hợi
    const patternIndex = dayChiIndex % 6;
    const hoangDaoPattern = GIO_HD[patternIndex];

    return GIO_TIME_RANGES.map((gio, index) => {
        const isAuspicious = hoangDaoPattern[index] === '1';

        // Rating based on position and auspiciousness
        let rating = isAuspicious ? 4 : 2;
        // Boost rating for certain "prime" hours
        if (isAuspicious && (index === 0 || index === 4 || index === 6)) {
            rating = 5;
        }

        return {
            name: `Giờ ${gio.chi}`,
            chi: gio.chi,
            timeRange: formatTimeRange(gio.start, gio.end),
            startHour: gio.start,
            endHour: gio.end,
            rating,
            isAuspicious,
        };
    });
}

/**
 * Get only the auspicious (Hoang Dao) hours for display
 */
export function getAuspiciousHours(dayChiIndex: number): HoangDaoHour[] {
    return getHoangDaoHours(dayChiIndex).filter(h => h.isAuspicious);
}

/**
 * Get the current hour's status (is it Hoang Dao?)
 */
export function getCurrentHourStatus(dayChiIndex: number): HoangDaoHour | null {
    const hours = getHoangDaoHours(dayChiIndex);
    const now = new Date();
    const currentHour = now.getHours();

    return hours.find(h => {
        if (h.startHour > h.endHour) {
            // Wraps around midnight (e.g., 23:00 - 01:00)
            return currentHour >= h.startHour || currentHour < h.endHour;
        }
        return currentHour >= h.startHour && currentHour < h.endHour;
    }) || null;
}
// Lookup table for Ngày Hoàng Đạo based on Lunar Month
// Source: Common Vietnamese calendar almanacs
// Month 1, 7: Tý, Sửu, Tỵ, Mùi
// Month 2, 8: Dần, Mão, Mùi, Dậu
// Month 3, 9: Thìn, Tỵ, Dậu, Hợi
// Month 4, 10: Ngọ, Mùi, Sửu, Dậu
// Month 5, 11: Thân, Dậu, Sửu, Mão
// Month 6, 12: Tuất, Hợi, Mão, Tỵ
const NGAY_HOANG_DAO_MAP: Record<number, string[]> = {
    1: ['Tý', 'Sửu', 'Tỵ', 'Mùi'],
    7: ['Tý', 'Sửu', 'Tỵ', 'Mùi'],

    2: ['Dần', 'Mão', 'Mùi', 'Dậu'],
    8: ['Dần', 'Mão', 'Mùi', 'Dậu'],

    3: ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],
    9: ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],

    4: ['Ngọ', 'Mùi', 'Sửu', 'Dậu'],
    10: ['Ngọ', 'Mùi', 'Sửu', 'Dậu'],

    5: ['Thân', 'Dậu', 'Sửu', 'Mão'],
    11: ['Thân', 'Dậu', 'Sửu', 'Mão'],

    6: ['Tuất', 'Hợi', 'Mão', 'Tỵ'],
    12: ['Tuất', 'Hợi', 'Mão', 'Tỵ'],
};

// Days that are notably bad (Hắc Đạo) - often the opposite or specific ones. 
// For simplicity in this version, we will check if it's Hoàng Đạo, else consider "Bình thường" or "Hắc Đạo" 
// if we want to be strict.
// A simple rule is often: if in good list -> Hoàng Đạo. 
// We can also add a specific Black List later if needed.

/**
 * Determine if a lunar day is Auspicious (Hoàng Đạo)
 * @param lunarMonth - Lunar month (1-12)
 * @param dayDayChi - The Chi of the day (e.g., 'Tý', 'Sửu')
 */
export function getDayAuspiciousness(lunarMonth: number, dayDayChi: string): 'Hoàng Đạo' | 'Bình Thường' | 'Hắc Đạo' {
    // Normalize Chi string just in case, typically it's just the word 'Tý'
    // But input might be full string "Giáp Tý", need to extract
    const parts = dayDayChi.split(' ');
    const chi = parts[parts.length - 1];

    const goodDays = NGAY_HOANG_DAO_MAP[lunarMonth];
    if (goodDays && goodDays.includes(chi)) {
        return 'Hoàng Đạo';
    }

    // Identify specific Bad Days (Hắc Đạo / Kỵ)
    // 1. Ngày Tam Nương: 3, 7, 13, 18, 22, 27
    // 2. Ngày Nguyệt Kỵ: 5, 14, 23
    // We need the lunar day number here, but this function only takes month and chi.
    // Wait, the function signature in this file is `getDayAuspiciousness(lunarMonth: number, dayDayChi: string)`
    // I need to update the signature to accept lunarDay as well to check for Tam Nương/Nguyệt Kỵ.

    // However, staying strictly with Can Chi logic for "Hắc Đạo" (Black Zodiac):
    // There are specific Hắc Đạo days based on Month + Chi, just like Hoàng Đạo.
    // Let's implement the standard Hắc Đạo lookup if possible, or simpler:
    // Just default to 'Bình Thường' so we don't mark everything as bad. 
    // The user's specific complaint is "all non-good marked as bad".
    // Switching default to 'Bình Thường' solves this immediately.

    return 'Bình Thường';
}

// Optional: Add Hắc Đạo Map if we want to be precise later.
// For now, stopping the incorrect "Bad" labeling is the priority.
