/**
 * Moon Phase Calculator
 * Calculates moon phase from lunar day (1-30)
 */

export type MoonPhaseName =
    | 'new'              // Trăng non
    | 'waxing_crescent'  // Trăng lưỡi liềm đầu tháng
    | 'first_quarter'    // Bán nguyệt đầu tháng
    | 'waxing_gibbous'   // Trăng khuyết đầu tháng
    | 'full'             // Trăng tròn
    | 'waning_gibbous'   // Trăng khuyết cuối tháng
    | 'last_quarter'     // Bán nguyệt cuối tháng
    | 'waning_crescent'; // Trăng lưỡi liềm cuối tháng

export interface MoonPhase {
    phase: MoonPhaseName;
    label: string;
    illumination: number; // 0-100%
    isWaxing: boolean;
}

const PHASE_LABELS: Record<MoonPhaseName, string> = {
    new: 'Trăng Non',
    waxing_crescent: 'Trăng Lưỡi Liềm',
    first_quarter: 'Bán Nguyệt',
    waxing_gibbous: 'Trăng Khuyết',
    full: 'Trăng Tròn',
    waning_gibbous: 'Trăng Khuyết',
    last_quarter: 'Bán Nguyệt',
    waning_crescent: 'Trăng Lưỡi Liềm',
};

/**
 * Calculate moon phase from lunar day
 * @param lunarDay - Day of the lunar month (1-30)
 */
export function getMoonPhase(lunarDay: number): MoonPhase {
    // Normalize to 1-30 range
    const day = Math.max(1, Math.min(30, lunarDay));

    // Calculate illumination (peaks at day 15)
    let illumination: number;
    if (day <= 15) {
        // Waxing: 0% to 100%
        illumination = Math.round((day - 1) / 14 * 100);
    } else {
        // Waning: 100% to 0%
        illumination = Math.round((30 - day) / 15 * 100);
    }

    // Determine phase based on day
    let phase: MoonPhaseName;
    const isWaxing = day <= 15;

    if (day === 1) {
        phase = 'new';
    } else if (day >= 2 && day <= 6) {
        phase = 'waxing_crescent';
    } else if (day >= 7 && day <= 9) {
        phase = 'first_quarter';
    } else if (day >= 10 && day <= 14) {
        phase = 'waxing_gibbous';
    } else if (day === 15 || day === 16) {
        phase = 'full';
    } else if (day >= 17 && day <= 21) {
        phase = 'waning_gibbous';
    } else if (day >= 22 && day <= 24) {
        phase = 'last_quarter';
    } else {
        phase = 'waning_crescent';
    }

    return {
        phase,
        label: PHASE_LABELS[phase],
        illumination,
        isWaxing,
    };
}

/**
 * Get CSS class for moon phase display
 */
export function getMoonPhaseClass(phase: MoonPhaseName): string {
    return `moon-phase-${phase.replace('_', '-')}`;
}
