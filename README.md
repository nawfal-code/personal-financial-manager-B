# Personal Finance Manager – Backend

A secure and scalable REST API for managing personal finances.  
This backend handles authentication, expenses, income, budgets, goals, and reports.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt.js
- dotenv

---

## 📦 Features

- User Authentication (Register / Login)
- Expense Management
- Income Management
- Budget Tracking
- Financial Goals
- Reports & Analytics
- Protected Routes using JWT
- MongoDB Aggregations for Reports

## DEPLOYEMENT LINK


---

## 📊 API Endpoints

### Auth
- `POST /api/users/register`
- `POST /api/users/login`

### Expenses
- `POST /api/expenses`
- `GET /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### Income
- `POST /api/income`
- `GET /api/income`
- `DELETE /api/income/:id`

### Budgets
- `POST /api/budgets`
- `GET /api/budgets`
- `PUT /api/budgets/:id`
- `PATCH /api/budgets/:id/recalculate`
- `DELETE /api/budgets/:id`

### Goals
- `POST /api/goals`
- `GET /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`

### Reports
- `GET /api/reports/expenses/category`
- `GET /api/reports/expenses/monthly`
- `GET /api/reports/income`
- `GET /api/reports/budgets`
- `GET /api/reports/goals`

---


## Author
- MOHAMMED NAWFAL
## 🗂️ Project Structure

