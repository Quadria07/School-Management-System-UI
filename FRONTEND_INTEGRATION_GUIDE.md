# Frontend-Backend Integration Guide
**School Management System - BFOIA Academy**

## ✅ Integration Complete

The React frontend has been connected to the PHP backend APIs.

---

## 🔧 Files Created/Modified

### New Files
| File | Purpose |
|------|---------|
| `src/utils/api.ts` | API service with all endpoints and token management |

### Modified Files
| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Now uses real login API instead of mock data |
| `src/app/components/student/StudentDashboard.tsx` | Fetches real stats and fee balance |
| `src/app/components/student/ResultsPortal.tsx` | Fetches real results from API |
| `src/app/components/student/FinancialOverview.tsx` | Fetches real fee balance from API |

---

## 🌐 API Configuration

The API base URL is configured in `src/utils/api.ts`:

```typescript
const API_BASE_URL = 'https://portal.bfoiacademy.com/api';
```

**To change the URL**, update this line to point to your server.

---

## 🔐 Authentication Flow

1. User enters email/password on Login page
2. Frontend calls `POST /api/auth/login.php`
3. Backend validates credentials and returns JWT token + user data
4. Frontend stores token in `localStorage`
5. All subsequent API calls include `Authorization: Bearer <token>` header

---

## 📡 Connected API Endpoints

| Frontend Feature | API Endpoint | Method |
|-----------------|--------------|--------|
| Login | `/auth/login.php` | POST |
| Student Profile | `/students/profile.php` | GET |
| Student Stats | `/students/stats.php` | GET |
| View Results | `/results/view.php` | GET |
| Check Fee Balance | `/fees/get_balance.php` | GET |
| Teacher Stats | `/teachers/stats.php` | GET |
| Teacher Classes | `/teachers/classes.php` | GET |
| Lesson Notes List | `/lesson-notes/list.php` | GET |
| Create Lesson Note | `/lesson-notes/create.php` | POST |
| Update Note Status | `/lesson-notes/update_status.php` | POST |
| Upload Result | `/results/upload.php` | POST |
| Admin Stats | `/admin/stats.php` | GET |

---

## 🧪 How to Test

### Prerequisites
1. Backend files uploaded to server
2. Database setup with test data
3. Config.php configured with correct DB credentials

### Testing Steps

1. **Build the frontend:**
   ```
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

3. **Open the website** in a browser

4. **Login with test credentials:**
   - **Student:** `student@test.com` / `password123`
   - **Teacher:** `teacher@test.com` / `password123`
   - **Admin:** `principal@test.com` / `password123`

5. **Verify data loads** on dashboard

---

## 🐛 Troubleshooting

### "Failed to connect to server"
- Check that API_BASE_URL is correct in `src/utils/api.ts`
- Verify CORS headers are enabled on backend

### "Login failed"
- Ensure test users exist (run create_test_*.php scripts)
- Check server error logs for details

### "No data showing"
- Verify JWT token is being sent (check Network tab)
- Ensure database has test data

---

## 📋 Next Steps

1. **Test the live integration** with your deployed backend
2. **Add more API connections** as needed (CBT, Assignments, etc.)
3. **Deploy to production** when ready

---

**Last Updated:** 2026-02-05 17:55
**Status:** Frontend-Backend Integration Complete (Phase 1-4)
