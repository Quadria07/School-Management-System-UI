# 🚀 Backend Deployment Guide

This folder (`backend_deployment`) contains ONLY the backend code and database files. This separates your backend logic from the React frontend.

## 📂 Folder Structure

```
backend_deployment/
├── database_schema.sql          <-- Import this file in phpMyAdmin
├── outside_public_html/         <-- Files to go ABOVE public_html (Secure)
│   └── config.php               <-- Database credentials (EDIT THIS!)
└── public_html/                 <-- Files to go INSIDE public_html (Public)
    └── api/                     <-- Your PHP API Endpoints
```

## 🔄 How to Deploy (Backend)

1.  **Database:** Import `database_schema.sql` into your cPanel Database using phpMyAdmin.
2.  **Config:** Upload everything inside `outside_public_html` to your **Home Directory** (the folder above `public_html`).
    *   *Important:* Edit `config.php` on the server with your real DB password.
3.  **API:** Upload the `api` folder (from `public_html`) into your cPanel `public_html` folder.

## 🏗️ How to Deploy (Frontend)

Since the Frontend is separate (in the `src` folder of the main project), you need to build it whenever you make changes.

1.  **Edit:** Make changes to your React components in `src/`.
2.  **Build:** Run the command `npm run build` in your terminal.
3.  **Upload:** This creates a `dist` folder. Upload the **contents** of the `dist` folder to your cPanel `public_html`.

## 🔗 How they Connect

- The **Frontend** (React) runs in the user's browser.
- It makes **API requests** to `https://your-school.com/api/...`.
- The **Backend** (PHP) receives these requests, connects to the database, and returns JSON data.
