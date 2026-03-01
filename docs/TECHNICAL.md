# Vehicle Service Booking System - Technical Documentation

## 1. System Architecture

### 1.1 MERN Stack Overview

The Vehicle Service Booking System follows the MERN (MongoDB, Express, React, Node.js) architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐ │
│  │  Pages  │  │Components│  │Context │  │   Styles     │ │
│  └────┬────┘  └────┬─────┘  └───┬────┘  └──────────────┘ │
│       │            │            │                          │
│       └────────────┴────────────┘                          │
│                      │                                      │
│              ┌───────┴───────┐                              │
│              │  Axios API    │                              │
│              └───────┬───────┘                              │
└──────────────────────┼──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │
┌──────────────────────┼──────────────────────────────────────┐
│                      │        Backend (Node.js + Express)    │
│              ┌───────┴───────┐                              │
│              │    Routes     │                              │
│              └───────┬───────┘                              │
│       ┌──────────────┼──────────────┐                        │
│  ┌────┴────┐   ┌────┴────┐   ┌────┴────┐                  │
│  │  Auth   │   │ Bookings│   │Services │                  │
│  │ Route   │   │ Route   │   │ Route   │                  │
│  └────┬────┘   └────┬────┘   └────┬────┘                  │
│       │            │            │                          │
│       └────────────┴────────────┘                          │
│                      │                                      │
│              ┌───────┴───────┐                              │
│              │ Controllers   │                              │
│              └───────┬───────┘                              │
└──────────────────────┼──────────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────────┐
│                      │           Database (MongoDB)          │
│              ┌───────┴───────┐                              │
│              │   Mongoose    │                              │
│              └───────┬───────┘                              │
│    ┌──────────────┐  │  ┌──────────────┐                    │
│    │    Users     │  │  │   Bookings   │                    │
│    └──────────────┘     └──────────────┘                    │
│    ┌──────────────┐                                                │
│    │ ServiceCats │                                                │
│    └──────────────┘                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | latest | Data visualization |
| React Toastify | 9.x | Notifications |
| Tailwind CSS | latest | Styling |

### 2.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 14+ | Runtime environment |
| Express | 4.x | Web framework |
| Mongoose | 7.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication |
| Bcrypt | 5.x | Password hashing |
| Dotenv | 16.x | Environment variables |
| CORS | 2.x | Cross-origin resource sharing |
| Nodemon | 2.x | Development auto-reload |

### 2.3 Database
| Technology | Type | Purpose |
|------------|------|---------|
| MongoDB | Document DB | Primary database |

---

## 3. API Endpoints Detail

### 3.1 Authentication API

#### POST /api/auth/login
**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin",
    "name": null
  }
}
```

#### POST /api/auth/register
**Request:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "role": "customer",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

#### GET /api/auth/me
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "...",
    "username": "johndoe",
    "role": "customer",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

### 3.2 Bookings API

#### POST /api/bookings
**Request:**
```json
{
  "customerName": "John Doe",
  "phone": "+1234567890",
  "vehicleNumber": "ABC-1234",
  "serviceType": "Oil Change",
  "date": "2024-01-15",
  "time": "10:00"
}
```

**Response:** `201 Created`
```json
{
  "_id": "...",
  "customerName": "John Doe",
  "phone": "+1234567890",
  "vehicleNumber": "ABC-1234",
  "serviceType": "Oil Change",
  "date": "2024-01-15",
  "time": "10:00",
  "status": "Pending",
  "createdAt": "2024-01-10T..."
}
```

#### GET /api/bookings
**Query Parameters:** `?status=Pending&startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "...",
    "customerName": "John Doe",
    "phone": "+1234567890",
    "vehicleNumber": "ABC-1234",
    "serviceType": "Oil Change",
    "date": "2024-01-15",
    "time": "10:00",
    "status": "Pending",
    "createdAt": "2024-01-10T..."
  }
]
```

#### PUT /api/bookings/:id/status
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "Approved"
}
```

**Response:**
```json
{
  "_id": "...",
  "status": "Approved",
  ...
}
```

#### GET /api/bookings/stats
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "total": 50,
  "pending": 10,
  "approved": 25,
  "completed": 12,
  "rejected": 3
}
```

#### GET /api/bookings/daily
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "2024-01-10",
    "count": 5,
    "pending": 3,
    "approved": 2,
    "completed": 0
  }
]
```

### 3.3 Services API

#### GET /api/services
**Response:**
```json
[
  {
    "_id": "...",
    "name": "Oil Change",
    "description": "Full engine oil change"
  }
]
```

#### POST /api/services
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Tire Rotation",
  "description": "Rotate tires for even wear"
}
```

---

## 4. Security Implementation

### 4.1 Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored

### 4.2 JWT Authentication
- Token-based authentication using JWT
- Token expiration: 8 hours
- Token contains: user id, username
- Verified on every protected route

### 4.3 Authorization
- Role-based access control (RBAC)
- Admin routes protected by auth middleware
- Users can only access their own data

### 4.4 API Security
- CORS enabled for frontend origin
- Environment variables for sensitive data
- Input validation on all endpoints

---

## 5. Database Schema

### 5.1 Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'customer'], default: 'customer'),
  name: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 Bookings Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, optional),
  customerName: String (required),
  phone: String (required),
  vehicleNumber: String (required),
  serviceType: String (required),
  date: String (required),
  time: String (required),
  status: String (enum: ['Pending', 'Approved', 'Completed', 'Rejected'], default: 'Pending'),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### 5.3 ServiceCategories Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. Error Handling

### 6.1 HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

### 6.2 Error Response Format
```json
{
  "message": "Error description"
}
```

---

## 7. Environment Variables

### 7.1 Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/vehicle_service_app
PORT=5000
JWT_SECRET=supersecretdev
ADMIN_USER=admin
ADMIN_PASS=admin123
```

### 7.2 Frontend
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 8. Testing

### 8.1 API Testing (Postman)
A Postman collection is included (`postman_collection.json`) with:
- Login request
- Register request
- Create booking request
- Get bookings request
- Update status request
- And more...

### 8.2 Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Booking creation
- [ ] Booking viewing
- [ ] Status updates
- [ ] Service management
- [ ] Dashboard statistics
- [ ] Daily chart

---

## 9. Deployment

### 9.1 Backend Deployment (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Build command: `npm install`
5. Start command: `npm start`

### 9.2 Frontend Deployment (Vercel)
1. Import GitHub repository
2. Set framework to React
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Set environment variable: `REACT_APP_API_URL`

---

## 10. Future Enhancements

Potential improvements for the system:
- Email/SMS notifications
- Payment integration
- Online payment for services
- Service pricing
- Appointment reminders
- Customer feedback/ratings
- Multi-branch support
- Service history tracking
- Analytics dashboard
- Mobile app support
