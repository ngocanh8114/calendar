/**
 * Solar Terms (Tiết Khí) Calculator
 * Calculates the 24 Solar Terms based on solar longitude.
 */

export const SOLAR_TERMS = [
    'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ',
    'Tiểu Mãn', 'Mang Chủng', 'Hạ Chí', 'Tiểu Thử',
    'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
    'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông',
    'Tiểu Tuyết', 'Đại Tuyết', 'Đông Chí', 'Tiểu Hàn',
    'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập'
];

/**
 * Get Solar Term for a specific date
 * Implementation based on simplified solar longitude algorithm.
 * Returns the name of the Solar Term if the date is the *start* of the term.
 */
export function getSolarTerm(date: Date): string | null {
    // This requires complex astronomical calculation (VSOP87 usually).
    // For a lightweight app without heavy libraries, we can use a simplified lookup.
    // However, exact day varies.
    // Let's use a "C" value table method or a pre-calculated logic.
    // Or simpler: Check major ones requested: Xuân Phân, Hạ Chí, Thu Phân, Đông Chí.
    // User asked for "những ngày đặc biệt như...".
    // Let's implement full 24 if possible using a robust approximation.

    // Approximate Date Ranges (start dates):
    // Lập Xuân: Feb 3-5
    // Vũ Thủy: Feb 18-20
    // ...
    // To be precise, we need the exact solar longitude integer (0, 15, 30...) crossing.
    // Let's use a known helper function from `lunar-javascript` port if we could, but I'll write a compact version.

    // Using a simplified formula for "Julian Day" to "Solar Term":
    // Term = Floor(SolarLongitude / 15)
    // We check if the Term *changes* on this specific day compared to prev day.

    const currentTerm = calculateSolarTerm(date);
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    const prevTerm = calculateSolarTerm(prevDate);

    if (currentTerm !== prevTerm) {
        return SOLAR_TERMS[currentTerm % 24];
        // Note: SOLAR_TERMS array needs to align with the return of calculateSolarTerm (0-23).
        // 0 usually aligns with Vernal Equinox (Xuân Phân) in Longitude=0.
    }

    return null;
}

function calculateSolarTerm(date: Date): number {
    // Julian Day Calculation
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month <= 2) {
        month += 12;
        year -= 1;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;

    // Solar Longitude Calculation (Simplified)
    // T = (JD - 2451545.0) / 36525
    const T = (jd - 2451545.0) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180) +
        0.000289 * Math.sin(3 * M * Math.PI / 180);

    let trueLong = L0 + C;

    // Normalize to 0-360
    trueLong = trueLong % 360;
    if (trueLong < 0) trueLong += 360;

    // Correct for Nutation/Aberration (Required for exact date) - Skipped for simplicity, error is usually < 1 degree.
    // 15 degrees per term
    // 0 = Vernal Equinox (Xuân Phân)
    return Math.floor(trueLong / 15);
}
