# 🏫 Full School Management System (Next.js + Role-Based Auth)

A complete, modern **School Management System** built with **Next.js**, featuring secure authentication and role-based dashboards for **Students**, **Teachers**, and **Admins**. Designed to streamline digital interaction between students, teachers, and school administration.

🚀 **Live Site:** [school-taupe-eight.vercel.app](https://school-taupe-eight.vercel.app/)

---

## 🎯 Key Features

### 🔐 Authentication & Authorization
- Secure **login system** with CAPTCHA protection
- **Role-based access**:
  - 👨‍🎓 Student Dashboard
  - 👨‍🏫 Teacher Dashboard
  - 🛠️ Admin Panel
- Sign-up system (can be restricted to role)

### 🧑‍🎓 Student Panel
- View personal details
- Access assignments and notices
- View grades or reports (planned)

### 👨‍🏫 Teacher Panel
- Upload assignments / study materials
- View list of students
- Manage attendance (optional)

### 🛠️ Admin Panel
- Add/remove users
- View site usage
- Role management
- Control content / moderation

### ✅ Other Features
- CAPTCHA on login for bot protection
- Smart error handling
- Mobile-responsive UI
- Ready for backend/database integration

---

## 📸 Screenshots

> *(Add your actual screenshots in `/public/screenshots/` and update links below)*

| Login | Role Dashboard | Signup |
|-------|----------------|--------|
| ![Login](public/screenshots/login.png) | ![Dashboard](public/screenshots/dashboard.png) | ![Signup](public/screenshots/signup.png) |

---



### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000`

---



## 🧪 Future Features (Planned or Suggested)

- 🔑 JWT-based persistent login
- 📊 Gradebook for teachers/students
- 📅 Class timetable management
- 📁 Assignment uploads/downloads
- 🛎️ Push/email notifications
- 🧾 Fee tracking & online payments
- 🔄 API & backend integration (Node.js / Firebase / MongoDB)

---

## 🚀 Deployment

Deployed via **Vercel**:

```bash
npm run build
npm start
```

