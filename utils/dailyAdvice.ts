/**
 * Daily Advice Generator
 * Generates daily advice based on lunar date and Can Chi
 */

export interface DailyAdvice {
    quote: string;
    goodFor: string[];
    avoid: string[];
    backgroundImage: string;
}

const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=2670&auto=format&fit=crop", // Nature/Stars
    "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=2670&auto=format&fit=crop", // Mountains
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop", // Landscape
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop", // Waterfall
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2670&auto=format&fit=crop", // Sunrise
];

// Lời khuyên theo pha âm lịch
const QUOTES_BY_PHASE = {
    // Đầu tháng (1-7): Khởi đầu mới
    early: [
        'Một ngày mới mang đến cơ hội mới, hãy nắm bắt và hành động.',
        'Khởi đầu thuận lợi cho mọi dự định lớn.',
        'Thời điểm tốt để gieo hạt giống cho tương lai.',
        'Năng lượng tích cực đang bao quanh bạn.',
        'Hãy tự tin bước ra khỏi vùng an toàn.',
    ],
    // Giữa tháng (8-14): Phát triển
    mid: [
        'Một ngày thuận lợi cho sự phát triển và những khởi đầu mới.',
        'Công việc đang tiến triển tốt, hãy kiên trì.',
        'Mọi nỗ lực của bạn sẽ được đền đáp xứng đáng.',
        'Thời điểm thích hợp để mở rộng quan hệ xã hội.',
        'Sự nghiệp đang trên đà thăng tiến.',
    ],
    // Trăng tròn (15-16): Hoàn thiện
    full: [
        'Ngày trăng tròn - thời điểm của sự viên mãn và hoàn thiện.',
        'Mọi việc sẽ đạt đến đỉnh cao, hãy tận hưởng thành quả.',
        'Năng lượng dồi dào, thuận lợi cho mọi hoạt động.',
        'Tình cảm và các mối quan hệ được bồi đắp.',
    ],
    // Cuối tháng (17-30): Hoàn thành và chuẩn bị
    late: [
        'Thời điểm để hoàn thành những việc còn dang dở.',
        'Hãy dành thời gian suy ngẫm và lên kế hoạch.',
        'Tĩnh lặng và cân bằng là chìa khóa của ngày hôm nay.',
        'Hãy chăm sóc bản thân trước khi giúp đỡ người khác.',
        'Chuẩn bị cho một chu kỳ mới đang đến.',
    ],
};

// Việc tốt theo ngày âm
const GOOD_FOR_LIST = [
    ['Khai trương', 'Cưới hỏi'],
    ['Xuất hành', 'Ký kết hợp đồng'],
    ['Động thổ', 'Xây dựng'],
    ['Nhập trạch', 'Dọn nhà'],
    ['Cầu tài', 'Giao dịch'],
    ['Học hành', 'Thi cử'],
    ['Họp mặt', 'Tiệc tùng'],
    ['Đặt tên', 'Khai sinh'],
    ['Mua sắm', 'Trang trí'],
    ['Du lịch', 'Nghỉ ngơi'],
    ['Cầu phúc', 'Tế lễ'],
    ['Gieo trồng', 'Thu hoạch'],
];

// Việc nên tránh
const AVOID_LIST = [
    ['Khởi công', 'Động thổ'],
    ['Xuất hành xa', 'Đầu tư lớn'],
    ['Tranh chấp', 'Kiện tụng'],
    ['Mai táng', 'Tang lễ'],
    ['Phá dỡ', 'Đập bỏ'],
    ['Vay nợ', 'Cho vay'],
    ['Cắt may', 'Sửa chữa lớn'],
    ['Chuyển nhà', 'Di dời'],
];

/**
 * Simple hash function to generate consistent "random" index
 */
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Get daily advice based on lunar day and Can Chi
 * Results are consistent for the same day (deterministic)
 */
export function getDailyAdvice(lunarDay: number, lunarMonth: number, canChi: string): DailyAdvice {
    // Determine phase for quote selection
    let phaseKey: keyof typeof QUOTES_BY_PHASE;
    if (lunarDay <= 7) {
        phaseKey = 'early';
    } else if (lunarDay <= 14) {
        phaseKey = 'mid';
    } else if (lunarDay <= 16) {
        phaseKey = 'full';
    } else {
        phaseKey = 'late';
    }

    const quotes = QUOTES_BY_PHASE[phaseKey];

    // Use hash to get consistent but varied results
    const seed = `${lunarDay}-${lunarMonth}-${canChi}`;
    const hash = hashCode(seed);

    const quoteIndex = hash % quotes.length;
    const goodIndex = (hash + lunarDay) % GOOD_FOR_LIST.length;
    const avoidIndex = (hash + lunarMonth) % AVOID_LIST.length;

    const imageIndex = hash % BACKGROUND_IMAGES.length;

    return {
        quote: quotes[quoteIndex],
        goodFor: GOOD_FOR_LIST[goodIndex],
        avoid: AVOID_LIST[avoidIndex],
        backgroundImage: BACKGROUND_IMAGES[imageIndex],
    };
}

/**
 * Get a simple one-liner advice for today
 */
export function getQuickAdvice(lunarDay: number): string {
    let phaseKey: keyof typeof QUOTES_BY_PHASE;
    if (lunarDay <= 7) phaseKey = 'early';
    else if (lunarDay <= 14) phaseKey = 'mid';
    else if (lunarDay <= 16) phaseKey = 'full';
    else phaseKey = 'late';

    const quotes = QUOTES_BY_PHASE[phaseKey];
    return quotes[lunarDay % quotes.length];
}

// Lời khuyên Kinh Dịch / Phong Thuỷ theo tag
const POETIC_QUOTES: Record<string, string[]> = {
    'Cưới hỏi': [
        'Duyên cầm sắt hài hòa, trăm năm hạnh phúc bền lâu.',
        'Lương duyên trời định, sắc son một lòng.',
        'Loan phượng hòa minh, gia đạo hưng long.',
        'Trầu cau thắm tình, phu thê vẹn nghĩa.',
        'Giai ngẫu tự thiên thành, phúc lộc song toàn.',
        'Tình thắm duyên nồng, con cháu đầy đàn.',
        'Hôn nhân đại sự, vạn sự cát tường.',
        'Đồng vợ đồng chồng, tát biển Đông cũng cạn.',
    ],
    'Khai trương': [
        'Khai trương hồng phát, tài lộc dồi dào tựa nước sông.',
        'Đại cát đại lợi, buôn may bán đắt, vạn sự hanh thông.',
        'Tài khí hưng vượng, khách đến như mây, tiền vào như nước.',
        'Thiên thời địa lợi, thương vụ phát đạt, tấn tài tấn lộc.',
        'Khởi đầu nan sự vẹn toàn, công danh sự nghiệp vững bền.',
        'Cửa hàng mở rộng, phúc khí tràn đầy, danh tiếng vang xa.',
        'Kinh doanh thuận lợi, tài nguyên quảng tiến.',
        'Vạn sự khởi đầu nan, gian nan đừng nản, thành công sẽ tới.',
    ],
    'Xuất hành': [
        'Đường xa vạn dặm bình an, quý nhân phù trợ mọi đàng.',
        'Ra đi gặp may, trở về mang lộc, vạn sự như ý.',
        'Chân cứng đá mềm, vượt ngàn trùng khơi, thành công rực rỡ.',
        'Xuất hành cát lợi, bốn phương hội tụ, tài lộc theo về.',
        'Mây trời lồng lộng, chí lớn vươn xa, thỏa chí tang bồng.',
        'Ngựa xe như nước, bình an vô sự, đại cát đại lợi.',
        'Đi một ngày đàng, học một sàng khôn.',
        'Thuận buồm xuôi gió, đi đến nơi về đến chốn.',
    ],
    'Làm nhà': [
        'An cư lạc nghiệp, nền móng vững bền, gia đạo an khang.',
        'Đất lành chim đậu, phong thủy hữu tình, phúc lộc trường tồn.',
        'Xây dựng cơ đồ, vững chãi ngàn năm, con cháu hưởng phước.',
        'Thượng lương đại cát, gia chủ phát tài, vạn sự bình an.',
        'Động thổ khai móng, thần linh chứng giám, công trình thuận lợi.',
        'Nhà cao cửa rộng, đón gió xuân sang, tài lộc ngập tràn.',
        'Tân gia đại cát, phúc khí mãn đường.',
        'Móng vững tường cao, che mưa chắn gió, ấm êm muôn đời.',
    ],
    'Cúng lễ': [
        'Thành tâm cầu nguyện, sở cầu như ý, sở nguyện tòng tâm.',
        'Tâm thành tất ứng, thần phật chứng tri, gia đạo bình an.',
        'Hương khói lan tỏa, tổ tiên phù hộ, con cháu hiếu thảo.',
        'Lễ mọn tâm thành, trời cao soi xét, ban phước ban lộc.',
        'Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây.',
        'Đèn nhang rực rỡ, lòng thành kính dâng, vạn sự cát tường.',
        'Cầu được ước thấy, phúc đức vô lượng.',
        'Tâm sáng như gương, đức độ bao dung, quỷ thần kính phục.',
    ],
    'Giao dịch': [
        'Thuận mua vừa bán, đôi bên cùng có lợi.',
        'Ký kết thành công, hợp tác trường tồn, tương lai rạng rỡ.',
        'Chữ tín làm đầu, vàng mười không đổi, danh tiếng vang xa.',
        'Thời cơ chín muồi, quyết đoán ắt thắng, lợi nhuận gia tăng.',
        'Gặp người tri kỷ, hợp tác bền lâu, cùng nhau phát triển.',
        'Vận trù trong trướng, quyết thắng ngàn dặm.',
        'Hợp đồng vững chắc, niềm tin trọn vẹn.',
        'Tài lộc gõ cửa, cơ hội trao tay, nắm bắt ngay kẻo lỡ.',
    ],
    // Dành cho ngày tốt chung chung (Hoàng Đạo mà không có tag cụ thể hoặc tag khác)
    'General': [
        'Thời vận hanh thông, mưu sự ắt thành.',
        'Thiên thời địa lợi nhân hòa, vạn sự như ý.',
        'Cát tinh chiếu mệnh, hung tinh lùi xa.',
        'Ngày lành tháng tốt, phúc khí tràn đầy.',
        'Tâm an vạn sự an, lòng thiện phúc sẽ đến.',
        'Gieo nhân lành gặt quả ngọt, tích đức phùng hung hóa cát.',
        'Vận khí đang lên, hãy nắm bắt cơ hội.',
        'Trời quang mây tạnh, lòng người phơi phới, vạn sự tốt lành.',
        'Họa phúc khôn lường, giữ tâm bất biến giữa dòng đời vạn biến.', // Câu này hơi deep 1 chút
        'Nhân chi sơ tính bản thiện, hãy giữ lấy sơ tâm.',
    ]
};

/**
 * Get a poetic description based on auspicious tags
 */
export function getPoeticDescription(tags: string[], seed: string): string {
    if (!tags || tags.length === 0) {
        return getRandomQuote('General', seed);
    }

    // Prioritize specific categories if present
    // Priority: Khai trương > Làm nhà > Cưới hỏi > Xuất hành > Cúng lễ > Giao dịch
    const priority = ['Khai trương', 'Làm nhà', 'Cưới hỏi', 'Xuất hành', 'Cúng lễ', 'Giao dịch'];
    let selectedCategory = 'General';

    for (const cat of priority) {
        if (tags.includes(cat)) {
            selectedCategory = cat;
            break;
        }
    }

    // Fallback if tag exists but not in priority list
    if (selectedCategory === 'General' && tags.length > 0) {
        if (POETIC_QUOTES[tags[0]]) {
            selectedCategory = tags[0];
        }
    }

    return getRandomQuote(selectedCategory, seed);
}

function getRandomQuote(category: string, seed: string): string {
    const quotes = POETIC_QUOTES[category] || POETIC_QUOTES['General'];
    const hash = hashCode(seed + category);
    return quotes[hash % quotes.length];
}

export { POETIC_QUOTES }; // Export for testing if needed
