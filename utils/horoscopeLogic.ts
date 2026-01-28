
import { LunarCalendar } from '@dqcai/vn-lunar';
import { DailyHoroscope, UserProfile } from '../types';

const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const ZODIAC_ICONS: Record<string, string> = {
    'Tý': '🐭', 'Sửu': '🐮', 'Dần': '🐯', 'Mão': '🐱', 'Thìn': '🐲', 'Tỵ': '🐍',
    'Ngọ': '🐴', 'Mùi': '🐐', 'Thân': '🐵', 'Dậu': '🐔', 'Tuất': '🐶', 'Hợi': '🐷'
};

const TAM_HOP: Record<string, string[]> = {
    'Tý': ['Thìn', 'Thân'], 'Thìn': ['Tý', 'Thân'], 'Thân': ['Tý', 'Thìn'],
    'Sửu': ['Tỵ', 'Dậu'], 'Tỵ': ['Sửu', 'Dậu'], 'Dậu': ['Sửu', 'Tỵ'],
    'Dần': ['Ngọ', 'Tuất'], 'Ngọ': ['Dần', 'Tuất'], 'Tuất': ['Dần', 'Ngọ'],
    'Mão': ['Mùi', 'Hợi'], 'Mùi': ['Mão', 'Hợi'], 'Hợi': ['Mão', 'Mùi']
};

const LUC_HOP: Record<string, string> = {
    'Tý': 'Sửu', 'Sửu': 'Tý', 'Dần': 'Hợi', 'Hợi': 'Dần',
    'Mão': 'Tuất', 'Tuất': 'Mão', 'Thìn': 'Dậu', 'Dậu': 'Thìn',
    'Tỵ': 'Thân', 'Thân': 'Tỵ', 'Ngọ': 'Mùi', 'Mùi': 'Ngọ'
};

const LUC_XUNG: Record<string, string> = {
    'Tý': 'Ngọ', 'Ngọ': 'Tý', 'Sửu': 'Mùi', 'Mùi': 'Sửu',
    'Dần': 'Thân', 'Thân': 'Dần', 'Mão': 'Dậu', 'Dậu': 'Mão',
    'Thìn': 'Tuất', 'Tuất': 'Thìn', 'Tỵ': 'Hợi', 'Hợi': 'Tỵ'
};

const ELEMENTS = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
const ELEMENT_RELATIONS: Record<string, { gen: string, con: string }> = {
    'Mộc': { gen: 'Hỏa', con: 'Thổ' },
    'Hỏa': { gen: 'Thổ', con: 'Kim' },
    'Thổ': { gen: 'Kim', con: 'Thủy' },
    'Kim': { gen: 'Thủy', con: 'Mộc' },
    'Thủy': { gen: 'Mộc', con: 'Hỏa' }
};

const LUCKY_COLORS: Record<string, { name: string, hex: string }[]> = {
    'Mộc': [{ name: 'Xanh Lá', hex: '#10B981' }, { name: 'Xanh Biển', hex: '#3B82F6' }],
    'Hỏa': [{ name: 'Đỏ', hex: '#EF4444' }, { name: 'Xanh Lá', hex: '#10B981' }],
    'Thổ': [{ name: 'Vàng', hex: '#F59E0B' }, { name: 'Đỏ', hex: '#EF4444' }],
    'Kim': [{ name: 'Trắng', hex: '#F8FAFC' }, { name: 'Vàng', hex: '#F59E0B' }],
    'Thủy': [{ name: 'Đen', hex: '#1E293B' }, { name: 'Trắng', hex: '#F8FAFC' }]
};

const DIRECTIONS = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Tây Nam', 'Đông Bắc', 'Tây Bắc'];

/**
 * Get Element from Can Chi year (Simplified for demo)
 */
function getElementFromYear(year: number): string {
    // Mapping logic for element based on year remainder
    // 1990 % 10 = 0 -> Canh
    // 1990 % 12 = 10 -> Ngọ
    // Canh Ngọ -> Thổ
    const elementMap: Record<number, string> = {
        0: 'Kim', 1: 'Kim', 2: 'Thủy', 3: 'Thủy', 4: 'Hỏa',
        5: 'Hỏa', 6: 'Thổ', 7: 'Thổ', 8: 'Mộc', 9: 'Mộc'
    };
    return elementMap[Math.floor((year - 4) % 10 / 2) * 2] || 'Thổ'; // Simplified
}

/**
 * Calculate dynamic scores and lucky factors
 */
export function calculateDailyHoroscope(profile: UserProfile, targetDate: Date): DailyHoroscope {
    const [bYear, bMonth, bDay] = profile.dobSolar.split('-').map(Number);
    const birthYear = bYear;
    const userElement = getElementFromYear(birthYear);

    // Get User Zodiac (Chi of birth year)
    const userLunarBirth = LunarCalendar.fromSolar(bDay, bMonth, bYear);
    const userChi = userLunarBirth.yearCanChi.split(' ')[1];

    // Get Target Date Info
    const targetLunar = LunarCalendar.fromSolar(targetDate.getDate(), targetDate.getMonth() + 1, targetDate.getFullYear());
    const dayChi = targetLunar.dayCanChi.split(' ')[1];
    const dayElement = ELEMENTS[targetDate.getTime() % 5]; // Mock element rotation for daily variety

    // Deterministic seed for this specific user + date
    const dateStr = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}`;
    const userSeed = `${profile.fullName}-${profile.dobSolar}-${profile.birthTime}-${profile.birthPlace}-${dateStr}`;

    // Hash function
    let hash = 0;
    for (let i = 0; i < userSeed.length; i++) {
        hash = ((hash << 5) - hash) + userSeed.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);

    // Create a second hash for message variation (using reversed seed)
    const reversedSeed = userSeed.split('').reverse().join('');
    let messageHash = 0;
    for (let i = 0; i < reversedSeed.length; i++) {
        messageHash = ((messageHash << 5) - messageHash) + reversedSeed.charCodeAt(i);
        messageHash |= 0;
    }
    const absMessageHash = Math.abs(messageHash);

    // Personalized Base Scores from hash (0-20 variation)
    let work = 65 + (absHash % 20);
    let love = 65 + ((absHash >> 2) % 20);
    let wealth = 65 + ((absHash >> 4) % 20);
    let health = 65 + ((absHash >> 6) % 20);

    // Apply Chi Relationships to Love Score (Astrological modifiers)
    if (TAM_HOP[userChi]?.includes(dayChi)) love += 15;
    else if (LUC_HOP[userChi] === dayChi) love += 10;
    else if (LUC_XUNG[userChi] === dayChi) love -= 20;

    // Apply Elemental Relations to Wealth/Work
    if (ELEMENT_RELATIONS[userElement].gen === dayElement) work += 8;
    if (ELEMENT_RELATIONS[dayElement].gen === userElement) wealth += 8;
    if (ELEMENT_RELATIONS[userElement].con === dayElement) wealth -= 12;

    // Clamp scores
    const clamp = (n: number) => Math.max(45, Math.min(98, n));

    const colors = LUCKY_COLORS[userElement];
    const color = colors[absHash % colors.length];

    const luckyNumber = (absHash % 10) || 9;
    const direction = DIRECTIONS[absHash % DIRECTIONS.length];

    // Generate personalized messages based on hash
    const READINGS = [
        `Hôm nay là một ngày vô cùng thuận lợi đối với người tuổi ${userChi}. Bản mệnh được quý nhân phù trợ để đón nhận các cơ hội mới.`,
        `Ngày hôm nay mang đến những điều bất ngờ tích cực cho tuổi ${userChi}. Hãy mở lòng đón nhận những may mắn đang đến gần.`,
        `Người tuổi ${userChi} nên giữ tâm thế bình tĩnh trong ngày hôm nay. Sự kiên nhẫn sẽ mang lại kết quả tốt đẹp.`,
        `Hôm nay là thời điểm tốt để tuổi ${userChi} thể hiện bản thân. Năng lượng tích cực đang bao quanh bạn.`,
        `Ngày hôm nay khuyên người tuổi ${userChi} nên tĩnh tâm và lắng nghe trực giác. Câu trả lời đang ở trong bạn.`,
        `Tuổi ${userChi} sẽ gặp nhiều thuận lợi trong công việc hôm nay. Đây là lúc để bạn tỏa sáng.`,
        `Hôm nay là ngày tốt để người tuổi ${userChi} chăm sóc các mối quan hệ. Tình cảm được củng cố vững chắc.`,
        `Ngày hôm nay mang đến cơ hội mới cho tuổi ${userChi}. Hãy dũng cảm nắm bắt những gì đến với bạn.`,
        `Người tuổi ${userChi} nên dành thời gian suy ngẫm hôm nay. Sự tĩnh lặng sẽ mang lại sự minh mẫn.`,
        `Hôm nay là ngày đầy năng lượng cho tuổi ${userChi}. Hãy tận dụng sức mạnh này để hoàn thành mục tiêu.`
    ];

    const MESSAGES = [
        "Sự nghiệp đang trên đà thăng tiến. Hãy tự tin tỏa sáng!",
        "Tình duyên hanh thông, hạnh phúc đang chờ đón bạn phía trước.",
        "Tài lộc hanh thông, cơ hội kinh doanh đang rộng mở.",
        "Sức khỏe dồi dào, năng lượng tích cực tràn đầy.",
        "Hãy dành thời gian chăm sóc bản thân và lắng nghe tiếng nói nội tâm.",
        "Đây là thời điểm tốt để học hỏi và phát triển bản thân.",
        "Hãy tin tưởng vào khả năng của mình, thành công đang đến gần.",
        "Sự kiên trì của bạn sẽ được đền đáp xứng đáng.",
        "Hãy mở lòng với những điều mới mẻ, may mắn đang chờ bạn.",
        "Giữ vững niềm tin, mọi khó khăn sẽ qua đi."
    ];

    const readingIndex = absHash % READINGS.length;
    const messageIndex = absMessageHash % MESSAGES.length; // Use separate hash for better variation

    return {
        date: targetDate,
        zodiacName: `Tuổi ${userChi}`,
        zodiacIcon: ZODIAC_ICONS[userChi] || '✨',
        scores: {
            work: clamp(work),
            love: clamp(love),
            wealth: clamp(wealth),
            health: clamp(health)
        },
        luckyFactors: {
            color,
            number: luckyNumber,
            direction
        },
        reading: READINGS[readingIndex],
        message: MESSAGES[messageIndex]
    };
}
