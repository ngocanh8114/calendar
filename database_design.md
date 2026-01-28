
# Database & API Design for Vietnam Lunar Calendar App

## 1. Database Schema (PostgreSQL/MongoDB)

### Users Table
- `id`: UUID (Primary Key)
- `full_name`: String
- `gender`: Enum ('Nam', 'Nữ')
- `dob_solar`: Date (Solar birth date)
- `birth_time`: Time
- `birth_place_id`: UUID (Foreign Key to Locations)
- `avatar_url`: String
- `created_at`: Timestamp

### Calendar Metadata (Pre-computed Lunar conversion)
- `solar_date`: Date (Unique Index)
- `lunar_day`: Integer
- `lunar_month`: Integer
- `lunar_year_name`: String (e.g., 'Ất Tỵ')
- `is_auspicious`: Boolean
- `zodiac_hour_scores`: JSONB (e.g., {"Tý": 95, "Sửu": 42})
- `recommendations`: Text
- `taboos`: JSONB Array
- `good_for`: JSONB Array

### Horoscope Data
- `zodiac_sign`: String (Unique)
- `daily_score`: Integer
- `message`: Text
- `lucky_color`: String
- `lucky_number`: Integer
- `lucky_direction`: String
- `date`: Date

### User Bazi (Computed)
- `user_id`: UUID (Foreign Key)
- `pillar_year`: String
- `pillar_month`: String
- `pillar_day`: String
- `pillar_hour`: String
- `five_elements_balance`: JSONB (percentages)
- `destiny_name`: String

---

## 2. API Design (RESTful)

### Auth & Profile
- `GET /api/profile`: Get current user's profile and Bazi details.
- `PUT /api/profile`: Update user's birth information.
- `POST /api/profile/avatar`: Upload user avatar.

### Calendar & Dates
- `GET /api/calendar/daily?date=YYYY-MM-DD`: Get detailed info for a specific day (Lunar, Zodiac hours, Advice).
- `GET /api/calendar/auspicious?month=MM&year=YYYY&category=all`: List auspicious dates with scores for the month.
- `GET /api/calendar/convert?date=YYYY-MM-DD&type=solar-to-lunar`: Utility to convert dates.

### Horoscope & Zodiac
- `GET /api/horoscope/daily?sign=Leo`: Daily reading for a western zodiac sign.
- `GET /api/zodiac/daily?animal=Mouse`: Daily reading for a lunar zodiac animal.
- `GET /api/horoscope/personalized`: AI-generated personalized reading based on User's Bazi.

### Metadata
- `GET /api/locations`: List of provinces/cities for birth place selection.
