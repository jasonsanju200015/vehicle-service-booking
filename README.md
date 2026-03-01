# Vehicle Service Booking System

A full-featured MERN stack application for managing vehicle service appointments with admin dashboard and customer booking functionality.

## Features

### Customer Features
- Book vehicle service appointments online
- View booking history and status
- Manage profile information
- Receive booking confirmations

### Admin Features
- Secure admin login
- View all bookings in dashboard
- Filter bookings by status and date
- Approve, reject, or complete bookings
- Manage service categories
- View booking statistics and daily charts

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
cd vehicle-service-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# MONGO_URI=mongodb://localhost:27017/vehicle_service_app
# PORT=5000
# JWT_SECRET=your-secret-key
# ADMIN_USER=admin
# ADMIN_PASS=admin123

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Project Structure

```
vehicle-service-app/
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── Booking.js
│   │   ├── ServiceCategory.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── services.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── BookingForm.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── BookingDetails.js
│   │   │   ├── CustomerBooking.js
│   │   │   ├── Login.js
│   │   │   ├── MyBookings.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   └── ServiceCategories.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── README.md
└── postman_collection.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/me | Update profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings | Get all bookings (admin) |
| GET | /api/bookings/my | Get user's bookings |
| GET | /api/bookings/:id | Get booking by ID |
| PUT | /api/bookings/:id | Update booking |
| PUT | /api/bookings/:id/status | Update booking status |
| DELETE | /api/bookings/:id | Delete booking |
| GET | /api/bookings/stats | Get booking statistics |
| GET | /api/bookings/daily | Get daily booking data |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | Get all services |
| POST | /api/services | Create service (admin) |
| PUT | /api/services/:id | Update service (admin) |
| DELETE | /api/services/:id | Delete service (admin) |

## Booking Status

- **Pending**: Initial status when customer books
- **Approved**: Admin has approved the booking
- **Completed**: Service has been completed
- **Rejected**: Admin has rejected the booking

## Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: 5000
   - `JWT_SECRET`: Your secret key
   - `ADMIN_USER`: admin
   - `ADMIN_PASS`: admin123
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository (select the frontend folder)
2. Set environment variable:
   - `REACT_APP_API_URL`: Your backend URL
3. Build command: `npm run build`
4. Output directory: `build`

## License

MIT License
