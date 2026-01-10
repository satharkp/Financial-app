# 💰 Expense Tracker – Full Stack MERN App

A full-stack **Expense & Income Tracker** built using the **MERN stack**, featuring authentication, transactions, analytics, charts, and exports.

🔗 **Live Demo**  
Frontend: https://expense-frontend-five-rouge.vercel.app  
Backend API: https://financial-app-g1q4.onrender.com  

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected routes

### 💸 Transactions
- Add **Income** & **Expense**
- Category-based transactions
- Notes & date support
- Delete transactions
- Pagination support

### 📊 Dashboard & Analytics
- Total Income
- Total Expense
- Net Balance
- Income vs Expense chart
- Recent transactions list

### 📂 Categories
- Create custom categories
- Reuse categories across transactions
- User-specific categories

### 📁 Export
- Export transactions as **CSV**

### 📱 Responsive UI
- Mobile-friendly design
- Clean, modern UI using **Tailwind CSS**

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- CORS

### Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## 📂 Project Structure

### Backend


controllers/
  ├─ auth.controller.js
  ├─ category.controller.js
  ├─ transaction.controller.js
  └─ analytics.controller.js

routes/
  ├─ auth.routes.js
  ├─ category.routes.js
  ├─ transaction.routes.js
  └─ analytics.routes.js

models/
  ├─ User.js
  ├─ Category.js
  └─ Transaction.js

### Frontend
src/
 ├─ api/
 │   └─ axios.js
 ├─ components/
 │   ├─ Navbar.jsx
 │   ├─ TransactionForm.jsx
 │   ├─ ExpenseFilters.jsx
 │   └─ IncomeExpenseChart.jsx
 ├─ pages/
 │   ├─ Dashboard.jsx
 │   ├─ Expenses.jsx
 │   ├─ Income.jsx
 │   ├─ Login.jsx
 │   └─ Register.jsx


---

## 🔑 Environment Variables

### Backend (`.env`)

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=4000

---

## 🚀 Getting Started (Local Setup)

### Backend
cd backend
npm install
npm run dev

### Frontend

cd expense-frontend
npm install
npm run dev

---

## 🧠 What I Learned
- Building secure REST APIs
- JWT authentication & middleware
- MongoDB aggregation for analytics
- Full deployment (Vercel + Render)
- Responsive UI with Tailwind CSS

---

## 📌 Future Improvements
- Edit transactions
- Monthly & category-wise charts
- CSV import
- Dark mode
- Forgot password

---

## 👤 Author

**Sathar KP**  
Aspiring Full-Stack Developer (MERN)

GitHub: https://github.com/satharkp
