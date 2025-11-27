# 🐛 Bug Analysis & Fixes - CargoRapido

**Date:** January 2025
**Status:** 🔴 CRITICAL BUGS FOUND

---

## Critical Bugs Found

### 🔴 BUG #1: Login.jsx Uses Wrong Login Function (CRITICAL)

**Location:** `frontend/src/pages/auth/Login.jsx` line 72

**Issue:**
The unified login page calls `login(formData)` for ALL roles, but:
- `login()` → calls `/api/auth/login` (User/Admin/Business ONLY)
- `loginDriver()` → calls `/api/auth/driver/login` (Driver ONLY)

**Current Code:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(formData);  // ❌ WRONG - always uses User login
    // ...
```

**Impact:**
- ❌ Driver login FAILS (uses wrong endpoint)
- ✅ User/Admin/Business work (correct endpoint)

**Fix Required:**
Use `selectedRole` to determine which login function to call:
```javascript
if (selectedRole === 'driver') {
  await loginDriver(formData);
} else {
  await login(formData);
}
```

---

### 🟡 BUG #2: FRONTEND_URL Mismatch (MINOR)

**Location:** `backend/.env` line 27

**Issue:**
```env
FRONTEND_URL=http://localhost:5173  # ❌ Wrong port
```

**Actual Frontend Port:** `5175` (auto-selected because 5173 & 5174 were in use)

**Impact:**
- CORS might fail if frontend makes requests from 5175
- Socket connections may fail

**Fix:**
```env
FRONTEND_URL=http://localhost:5175
```

---

### 🟡 BUG #3: Password Hashing in Seed Script (MINOR)

**Location:** `backend/scripts/seedUsers.js` lines 24, 39, 54, 82

**Issue:**
Seed script hashes passwords with `bcrypt.hash()`, but User/Driver models ALSO hash in pre-save hook.

**Result:** Double hashing = passwords never match

**Current Flow:**
```
Seed: 'User@1234' → hash1 → save to DB
Model pre-save: hash1 → hash2 → stored in DB
Login: 'User@1234' → hash1 → compare with hash2 ❌ FAIL
```

**Fix:**
Seed script should store plain passwords and let model handle hashing:
```javascript
password: 'User@1234'  // Not: await bcrypt.hash('User@1234', 10)
```

OR disable pre-save hook during seeding.

---

### ⚠️ BUG #4: Multiple Backend Instances Running

**Issue:**
Multiple shells trying to start backend on port 5000:
- Shell `a55e67`: ✅ Running successfully
- Shell `21fb9a`: ❌ Crashing (port in use)
- Shell `eb1ac2`: ❌ Crashed

**Impact:** Confusion, resource waste

**Fix:** Kill extra shells, keep only one backend running

---

### 🟢 BUG #5: Mongoose Deprecation Warnings (INFO)

**Location:** Backend startup logs

**Warnings:**
```
[MONGOOSE] Warning: Duplicate schema index on {"driver":1}
[MONGOOSE] Warning: Duplicate schema index on {"bookingId":1}
[MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option
[MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option
```

**Impact:** None functionally, but clutters logs

**Fix:**
1. Remove duplicate index declarations
2. Remove deprecated options from mongoose.connect()

---

## Bug Priority Matrix

| Bug # | Severity | Impact | Priority | Status |
|-------|----------|--------|----------|--------|
| #1 | 🔴 Critical | Driver login broken | P0 | 🔧 Fixing |
| #3 | 🔴 Critical | All logins may fail | P0 | 🔧 Fixing |
| #2 | 🟡 Medium | CORS/Socket issues | P1 | 🔧 Fixing |
| #4 | 🟡 Medium | Resource waste | P1 | 🔧 Fixing |
| #5 | 🟢 Low | Log clutter | P2 | Defer |

---

## Detailed Fix Plan

### Fix #1: Update Login.jsx

**File:** `frontend/src/pages/auth/Login.jsx`

**Change:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Use correct login function based on role
    if (selectedRole === 'driver') {
      await loginDriver(formData);
    } else {
      await login(formData);
    }

    toast.success(`Welcome back, ${selectedRoleConfig.name}!`);
    // ... rest of code
```

**Also need to import:**
```javascript
const { login, loginDriver, loading } = useAuthStore();
```

---

### Fix #2: Update Backend .env

**File:** `backend/.env`

**Change:**
```env
# Before
FRONTEND_URL=http://localhost:5173

# After
FRONTEND_URL=http://localhost:5175
```

---

### Fix #3: Fix Password Seeding

**File:** `backend/scripts/seedUsers.js`

**Option A - Remove manual hashing:**
```javascript
// Before
password: await bcrypt.hash('User@1234', 10),

// After
password: 'User@1234',  // Let model hash it
```

**Option B - Skip pre-save hook:**
```javascript
await User.create({...userData}, { skipPasswordHash: true });
```

**Chosen:** Option A (simpler)

---

### Fix #4: Clean Up Backend Shells

**Action:**
```bash
# Kill duplicate shells
# Keep only shell a55e67 running
```

---

## Testing Plan

After fixes, test each role:

1. **User Login**
   - Email: testuser@example.com
   - Password: User@1234
   - Expected: ✅ Success → Redirect to `/`

2. **Driver Login**
   - Email: testdriver@example.com
   - Password: Driver@1234
   - Expected: ✅ Success → Redirect to `/driver`

3. **Admin Login**
   - Email: admin@example.com
   - Password: Admin@1234
   - Expected: ✅ Success → Redirect to `/admin`

4. **Business Login**
   - Email: business@example.com
   - Password: Business@1234
   - Expected: ✅ Success → Redirect to `/`

---

## Root Cause Analysis

### Why These Bugs Occurred:

1. **Login Bug**: Unified login page was created without considering different authentication endpoints for drivers
2. **Password Bug**: Seed script was written without checking model pre-save hooks
3. **Port Bug**: Frontend auto-selected different port but .env wasn't updated
4. **Multiple Shells**: Multiple startup attempts without cleaning up previous instances

---

## Prevention Strategies

1. **Code Review**: Check authentication flows thoroughly
2. **Testing**: Test all user roles before deployment
3. **Documentation**: Document which login endpoint each role uses
4. **Seed Scripts**: Always check model hooks before manual operations
5. **Port Management**: Use fixed ports or update configs dynamically

---

## Current Status

- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 5175
- ✅ Database: Seeded (but passwords double-hashed)
- ❌ Login: Not working due to bugs #1 and #3
- 🔧 Fixes: In progress

---

**Next Steps:**
1. Fix Login.jsx to use correct login function
2. Re-seed database with correct passwords
3. Update FRONTEND_URL
4. Test all 4 roles
5. Clean up extra backend shells

---

**Last Updated:** January 2025
