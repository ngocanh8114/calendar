/**
 * Advanced Scoring System for Auspicious Hours
 * Calculates weighted scores (0-100) based on Can Chi, Elements, and User Profile.
 */

// --- 1. Constants & Data Tables ---

// Five Elements (Ngũ Hành)
export enum Element {
    Metal = 'Kim',
    Wood = 'Mộc',
    Water = 'Thủy',
    Fire = 'Hỏa',
    Earth = 'Thổ',
}

// Map CanChi string to Element (Lục Thập Hoa Giáp - simplified subset or algo)
// Full map is large, so we use a lookup algorithm or map. 
// "Giáp Tý" -> Kim (Hải Trung Kim)
// For simplicity, we can use the "Can + Chi" formula or a direct map.
// Formula: (Can Value + Chi Value) % 5 -> Metal=1, Water=2, Fire=3, Earth=4, Wood=5 (Standard variation exists)
// Let's use a verified concise map for efficiency if possible, or the formula.
// Formula approach (Lục Thập Hoa Giáp calculation):
// Can: Giáp/Ất=1, Bính/Đinh=2, Mậu/Kỷ=3, Canh/Tân=4, Nhâm/Quý=5
// Chi: Tý/Sửu/Ngọ/Mùi=0, Dần/Mão/Thân/Dậu=1, Thìn/Tỵ/Tuất/Hợi=2
// Sum = Can + Chi. If > 5, subtract 5.
// Result: 1=Kim, 2=Thủy, 3=Hỏa, 4=Thổ, 5=Mộc.

const CAN_VALUES: Record<string, number> = {
    'Giáp': 1, 'Ất': 1,
    'Bính': 2, 'Đinh': 2,
    'Mậu': 3, 'Kỷ': 3,
    'Canh': 4, 'Tân': 4,
    'Nhâm': 5, 'Quý': 5
};

const CHI_VALUES: Record<string, number> = {
    'Tý': 0, 'Sửu': 0, 'Ngọ': 0, 'Mùi': 0,
    'Dần': 1, 'Mão': 1, 'Thân': 1, 'Dậu': 1,
    'Thìn': 2, 'Tỵ': 2, 'Tuất': 2, 'Hợi': 2
};

const ELEMENT_MAP: Record<number, Element> = {
    1: Element.Metal,
    2: Element.Water,
    3: Element.Fire,
    4: Element.Earth,
    5: Element.Wood
};

export function getElement(can: string, chi: string): Element {
    const canVal = CAN_VALUES[can] || 0;
    const chiVal = CHI_VALUES[chi] || 0;
    let sum = canVal + chiVal;
    if (sum > 5) sum -= 5;
    return ELEMENT_MAP[sum] || Element.Wood; // Default/Fallback
}

// Chi Relationships
// Tam Hợp (Three Harmony): Thân-Tý-Thìn, Dần-Ngọ-Tuất, Hợi-Mão-Mùi, Tỵ-Dậu-Sửu
// Lục Hợp (Six Harmony): Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
// Lục Xung (Six Clashes): Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
// Tứ Hành Xung (Four Clashes - optional, usually covered by Lục Xung pair)
// Tương Hại (Harm): Tý-Mùi, Sửu-Ngọ... (Optional for complexity cap)

const TAM_HOP_GROUPS = [
    ['Thân', 'Tý', 'Thìn'],
    ['Dần', 'Ngọ', 'Tuất'],
    ['Hợi', 'Mão', 'Mùi'],
    ['Tỵ', 'Dậu', 'Sửu']
];

const LUC_HOP_PAIRS = [
    ['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'],
    ['Thìn', 'Dậu'], ['Tỵ', 'Thân'], ['Ngọ', 'Mùi']
];

const LUC_XUNG_PAIRS = [
    ['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'],
    ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi']
];

export function getChiRelationshipScore(targetChi: string, userChi: string): number {
    if (!userChi || !targetChi) return 0;

    // Check Tam Hợp (+15)
    for (const group of TAM_HOP_GROUPS) {
        if (group.includes(targetChi) && group.includes(userChi) && targetChi !== userChi) {
            return 15;
        }
    }

    // Check Lục Hợp (+10)
    for (const pair of LUC_HOP_PAIRS) {
        if (pair.includes(targetChi) && pair.includes(userChi) && targetChi !== userChi) {
            return 10;
        }
    }

    // Check Lục Xung (-15)
    for (const pair of LUC_XUNG_PAIRS) {
        if (pair.includes(targetChi) && pair.includes(userChi) && targetChi !== userChi) {
            return -15;
        }
    }

    // Default: Bình hòa (0)
    return 0;
}

// Element Relationships (Sinh/Khắc)
// Sinh: Kim->Thủy->Mộc->Hỏa->Thổ->Kim
// Khắc: Kim->Mộc->Thổ->Thủy->Hỏa->Kim
const SINH_CYCLE: Record<Element, Element> = {
    [Element.Metal]: Element.Water,
    [Element.Water]: Element.Wood,
    [Element.Wood]: Element.Fire,
    [Element.Fire]: Element.Earth,
    [Element.Earth]: Element.Metal
};

const KHAC_CYCLE: Record<Element, Element> = {
    [Element.Metal]: Element.Wood,
    [Element.Wood]: Element.Earth,
    [Element.Earth]: Element.Water,
    [Element.Water]: Element.Fire,
    [Element.Fire]: Element.Metal
};

export function getElementScore(hourElement: Element, userElement: Element): number {
    if (!hourElement || !userElement) return 0;

    if (hourElement === userElement) return 8; // Đồng hành

    // Hour Sinh User (Good) -> Tương Sinh +15
    if (SINH_CYCLE[hourElement] === userElement) return 15;

    // User Sinh Hour (Mediocre/Draining) -> Sinh Xuất -5 (Optional, user didn't specify, but standard Feng Shui)
    // User request: "Khắc dụng thần: -15". 

    // Hour Khắc User (Bad) -> Khắc -15
    if (KHAC_CYCLE[hourElement] === userElement) return -15;

    // User Khắc Hour (Control) -> Khắc Xuất +2 (Control is ok)

    return 0;
}


// --- 2. Helper Calculation ---

/**
 * Determine Hour Can based on Day Can ("Ngũ thỏ độn lộ")
 */
const DAY_CAN_TO_START_HOUR_CAN: Record<string, string> = {
    'Giáp': 'Giáp', 'Kỷ': 'Giáp',
    'Ất': 'Bính', 'Canh': 'Bính',
    'Bính': 'Mậu', 'Tân': 'Mậu',
    'Đinh': 'Canh', 'Nhâm': 'Canh',
    'Mậu': 'Nhâm', 'Quý': 'Nhâm'
};

const CAN_ORDER = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

export function getHourCan(dayCan: string, hourChiIndex: number): string {
    const startCan = DAY_CAN_TO_START_HOUR_CAN[dayCan] || 'Giáp';
    const startIndex = CAN_ORDER.indexOf(startCan);
    const hourCanIndex = (startIndex + hourChiIndex) % 10;
    return CAN_ORDER[hourCanIndex];
}

// --- 3. Main Scoring Function ---

export interface ScoreDetails {
    total: number;
    base: number;
    chiScore: number;
    elementScore: number;
    bonus: number;
    element: Element;
    can: string;
}

/**
 * Calculate Score for a specific hour
 */
export function calculateHourScore(
    hourChi: string,
    hourChiIndex: number, // 0-11
    isHoangDao: boolean,
    dayCan: string,
    userChi: string,
    userElement: Element
): ScoreDetails {
    // 1. Base Score
    const base = isHoangDao ? 40 : -40;

    // 2. Chi Score
    const chiScore = getChiRelationshipScore(hourChi, userChi);

    // 3. Element Score
    // Need Hour Can to get Hour Element
    const hourCan = getHourCan(dayCan, hourChiIndex);
    const hourElement = getElement(hourCan, hourChi);
    const elementScore = getElementScore(hourElement, userElement);

    // 4. Bonus (Activity specific - placeholder)
    // User mentioned "Ký hợp đồng" as example. We can pass activity type later.
    let bonus = 0;

    // Total calculation
    // Start from 50 (neutral base)
    let total = 50 + base + chiScore + elementScore + bonus;

    // Clamp 0-100
    total = Math.max(0, Math.min(100, total));

    return {
        total,
        base,
        chiScore,
        elementScore,
        bonus,
        element: hourElement,
        can: hourCan
    };
}

/**
 * Deduce suitable activities based on detailed scores
 */
export function getGoodActivities(details: ScoreDetails): string[] {
    const activities: string[] = [];

    // 1. Relationship Logic (Chi)
    if (details.chiScore >= 10) { // Tam Hợp (+15) or Lục Hợp (+10)
        activities.push('Ký kết', 'Hợp tác', 'Cưới hỏi');
    }

    // 2. Element Logic (Ngũ Hành)
    if (details.elementScore > 0) { // Tương Sinh (+15) or Đồng hành (+8)
        activities.push('Khai trương', 'Cầu tài', 'Giao dịch');
    }

    // 3. General High Score
    if (details.total >= 90) {
        activities.push('Động thổ', 'Nhập trạch');
    }

    // Deduplicate and limit
    return Array.from(new Set(activities)).slice(0, 3);
}
