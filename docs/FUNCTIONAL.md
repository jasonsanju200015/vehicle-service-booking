# Vehicle Service Booking System - Functional Documentation

## 1. Introduction

### 1.1 Project Overview
The Vehicle Service Booking System is a web-based application that enables customers to schedule vehicle service appointments online while providing administrators with tools to manage, approve, and track service bookings efficiently.

### 1.2 Purpose
The system aims to digitize the traditional manual appointment booking process, eliminating booking conflicts, customer delays, and missing records through a centralized digital platform.

### 1.3 Target Users
- **Customers**: Vehicle owners who need to book service appointments
- **Administrators**: Service center staff who manage bookings and services

---

## 2. User Roles & Permissions

### 2.1 Customer Role
| Feature | Access |
|---------|--------|
| Register new account | ✅ Allowed |
| Login to account | ✅ Allowed |
| Book service appointment | ✅ Allowed |
| View own bookings | ✅ Allowed |
| View booking details | ✅ Allowed |
| Update own profile | ✅ Allowed |
| Update booking status | ❌ Not Allowed |
| Delete bookings | ❌ Not Allowed |
| Access admin dashboard | ❌ Not Allowed |
| Manage service categories | ❌ Not Allowed |

### 2.2 Admin Role
| Feature | Access |
|---------|--------|
| Login to admin panel | ✅ Allowed |
| View all bookings | ✅ Allowed |
| Filter bookings by status | ✅ Allowed |
| Filter bookings by date | ✅ Allowed |
| Approve bookings | ✅ Allowed |
| Reject bookings | ✅ Allowed |
| Mark bookings as completed | ✅ Allowed |
| Delete bookings | ✅ Allowed |
| View booking statistics | ✅ Allowed |
| View daily booking chart | ✅ Allowed |
| Add service categories | ✅ Allowed |
| Edit service categories | ✅ Allowed |
| Delete service categories | ✅ Allowed |
| Manage user profiles | ❌ Not Allowed |

---

## 3. Functional Requirements

### 3.1 Customer Module

#### 3.1.1 User Registration
- Users can create a new account with:
  - Username (required, unique)
  - Password (required)
  - Full Name (optional)
  - Phone Number (optional)
- Upon successful registration, user is automatically logged in
- Password is securely hashed using bcrypt

#### 3.1.2 User Login
- Users can login with username and password
- JWT token is issued upon successful login
- Token is valid for 8 hours
- Invalid credentials show error message

#### 3.1.3 Book Service
- Customers can book a service appointment with:
  - Customer Name (required)
  - Phone Number (required)
  - Vehicle Number (required)
  - Service Type (required, from dropdown)
  - Preferred Date (required)
  - Preferred Time (required)
- Default booking status: "Pending"
- Booking can be made with or without login

#### 3.1.4 View My Bookings
- Logged-in users can view their booking history
- Displays: Service type, Vehicle number, Date/Time, Status
- Click to view full booking details
- Sorted by most recent first

#### 3.1.5 Booking Details
- Shows complete booking information:
  - Booking ID
  - Customer Name
  - Phone Number
  - Vehicle Number
  - Service Type
  - Preferred Date & Time
  - Booking Status
  - Created Date

#### 3.1.6 Profile Management
- Users can update their profile:
  - Full Name
  - Phone Number
  - Password (optional)
- Cannot change username

### 3.2 Admin Module

#### 3.2.1 Admin Login
- Secure login with username and password
- Redirects to admin dashboard upon success
- JWT token issued with admin role

#### 3.2.2 Dashboard Overview
- Displays statistics cards:
  - Total Bookings
  - Pending Bookings
  - Approved Bookings
  - Completed Bookings
- Shows daily bookings bar chart (last 7 days)
- Displays all bookings in table format

#### 3.2.3 Booking Management
- View all bookings in table format
- Filter by booking status:
  - All
  - Pending
  - Approved
  - Completed
  - Rejected
- Filter by date range:
  - Start Date
  - End Date
- Actions available per booking:
  - View Details
  - Approve (Pending → Approved)
  - Complete (Approved → Completed)
  - Reject (Pending → Rejected)
  - Delete

#### 3.2.4 Service Category Management
- View all service categories
- Add new service category:
  - Service Name (required)
  - Description (optional)
- Edit existing service category
- Delete service category

---

## 4. User Flows

### 4.1 Customer Booking Flow
```
1. User visits homepage
2. User selects service type from dropdown
3. User fills in booking form:
   - Customer Name
   - Phone Number
   - Vehicle Number
   - Preferred Date
   - Preferred Time
4. User clicks "Submit Booking"
5. System validates and creates booking
6. Booking status set to "Pending"
7. Success message displayed
```

### 4.2 Admin Approval Flow
```
1. Admin logs in
2. Admin views dashboard
3. Admin sees pending bookings
4. Admin clicks "Approve" on a booking
5. Status changes from "Pending" to "Approved"
6. Success notification displayed
```

### 4.3 Booking Completion Flow
```
1. Customer arrives for service
2. Admin marks booking as "Completed"
3. Status changes from "Approved" to "Completed"
4. Customer can view completed booking in their history
```

---

## 5. Data Models

### 5.1 User
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | String | Yes | Unique username |
| password | String | Yes | Hashed password |
| role | String | Yes | 'admin' or 'customer' |
| name | String | No | Full name |
| phone | String | No | Phone number |

### 5.2 Booking
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | No | Reference to User |
| customerName | String | Yes | Customer's name |
| phone | String | Yes | Contact number |
| vehicleNumber | String | Yes | Vehicle registration |
| serviceType | String | Yes | Service category |
| date | String | Yes | Preferred date |
| time | String | Yes | Preferred time |
| status | String | Yes | Pending/Approved/Completed/Rejected |
| createdAt | Date | Auto | Creation timestamp |

### 5.3 ServiceCategory
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Service name |
| description | String | No | Service description |

---

## 6. Acceptance Criteria

### 6.1 Customer Registration
- [ ] User can register with unique username
- [ ] Password is stored securely (hashed)
- [ ] User is logged in automatically after registration
- [ ] Error shown for duplicate username

### 6.2 Customer Login
- [ ] User can login with valid credentials
- [ ] Invalid credentials show error
- [ ] JWT token is stored in localStorage
- [ ] User redirected to appropriate page after login

### 6.3 Booking Creation
- [ ] Form validation works for all required fields
- [ ] Service types are loaded from database
- [ ] Date and time pickers work correctly
- [ ] Success message shown after booking

### 6.4 Admin Dashboard
- [ ] Statistics show correct counts
- [ ] Daily chart displays last 7 days data
- [ ] Filters work correctly
- [ ] All action buttons work

### 6.5 Service Management
- [ ] Admin can add new services
- [ ] Admin can edit existing services
- [ ] Admin can delete services
- [ ] Services appear in customer booking form
