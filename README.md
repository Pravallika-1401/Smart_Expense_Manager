# 💰 Smart Expense Manager

> Full-stack personal finance tracker built for Indian users.
> Track income & expenses, visualize spending with beautiful charts.

## ✨ Features
- 🔐 JWT Authentication (Register/Login)
- 💸 Add Income & Expenses with 15 categories
- 📊 Analytics: Bar, Line & Pie Charts
- 📅 Date range filter for transactions
- 📱 Fully responsive — Mobile + Desktop
- 🎨 Smooth animations with Framer Motion
- 🇮🇳 Indian ₹ currency format

## 🛠️ Tech Stack
| Frontend | Backend | Database |
|----------|---------|----------|
| React + Vite | Spring Boot 3.2 | MySQL 8 |
| TailwindCSS | Spring Security | JPA/Hibernate |
| Chart.js | JWT Auth | Spring Data |
| Framer Motion | BCrypt | JPQL Queries |

## 🏃 How to Run Locally

### Backend
```bash
cd backend
.\mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

## 📁 Project Structure
Smart_Expense_Manager/
├── backend/          # Spring Boot
│   ├── entity/       # DB Models
│   ├── controller/   # API Endpoints
│   ├── service/      # Business Logic
│   ├── repository/   # DB Queries
│   └── security/     # JWT + Auth
└── frontend/         # React + Vite
├── pages/        # All pages
├── components/   # Reusable UI
├── api/          # Axios setup
└── context/      # Auth state

## 🔑 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/transactions | All transactions |
| POST | /api/transactions | Add transaction |
| DELETE | /api/transactions/{id} | Delete |
| GET | /api/analytics/dashboard | Balance summary |
| GET | /api/analytics/monthly | Monthly chart data |
| GET | /api/analytics/categories | Pie chart data |

## 👩‍💻 Author
**Pravallika** — Full Stack Developer
