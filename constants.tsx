
import { AuspiciousDate } from './types';

export const LUNAR_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAfDI7FhQ-GsZt4-QEfshgzmKLp2vhiHBv87K6PY1yHQSqmHCEVqiHB3puX8PisK6ENLRxmaMMZZdGFDGfNpTMeNJRpfFMy2X63xRLRhqh_vDncXzx8s4FJYjwOh9uXtIAtTfy2-ubZzd8wVlG8mU2axFmShJgwO9wyKlDtNDsy7qhSMBHrwbQGayV2xHLmrP6_grZHfmH80PhIgySj-zuLhCejHu-WXr6eYCkyPRopT-i-LQ29AR_ouHBto4_spYrLLdBBzx6THA";

export const MOCK_AUSPICIOUS_DATES: AuspiciousDate[] = [
  {
    day: 12,
    weekday: 'THỨ 7',
    lunarDate: '10/09 (Âm lịch)',
    type: 'Hoàng Đạo',
    score: 85,
    description: 'Ngày Đại Cát, rất tốt cho việc ký kết hợp đồng và khai trương cửa hàng.',
    color: '#4ECDC4'
  },
  {
    day: 15,
    weekday: 'THỨ 3',
    lunarDate: '13/09 (Âm lịch)',
    type: 'Bình Thường',
    score: 72,
    description: 'Phù hợp cho việc dời chỗ, xuất hành hướng Đông Nam để gặp may mắn.',
    color: '#FF6B6B'
  },
  {
    day: 20,
    weekday: 'CHỦ NHẬT',
    lunarDate: '18/09 (Âm lịch)',
    type: 'Hoàng Đạo',
    score: 96,
    description: 'Ngày cực tốt cho cưới hỏi, nạp lễ. Sao Thiên Đức chiếu mệnh, mọi sự hanh thông.',
    color: '#6C5CE7'
  }
];

export const DEFAULT_USER = {
  fullName: "Lê Minh Tuấn",
  gender: "Nam" as const,
  dobSolar: "1990-05-12",
  birthTime: "08:30",
  birthPlace: "Hà Nội",
  lunarEquivalent: "18-04-Canh Ngọ",
  destiny: "Lộ Bàng Thổ",
  avatar: "https://picsum.photos/200/200"
};
