# Employee Management System (EMS)

A modern, full-stack Employee Management System built with React and Node.js, featuring beautiful gradient UI designs and comprehensive HR management capabilities.

![EMS Dashboard](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## 🌟 Features

### For Employees
- **Dashboard**: Beautiful gradient cards showing salary, attendance, and leave statistics
- **Profile Management**: Update personal information and change password
- **Attendance Tracking**: Mark daily attendance and view monthly reports
- **Leave Management**: Apply for leaves and track application status
- **Payroll View**: View salary history with detailed breakdowns

### For Administrators
- **Admin Dashboard**: Comprehensive overview with analytics and charts
- **Employee Management**: Add, edit, and manage employee records
- **Attendance Monitoring**: Track attendance across the organization
- **Leave Approval**: Review and approve/reject leave requests
- **Payroll Management**: Generate and manage salary records with bulk operations
- **Analytics**: Visual charts for employee distribution and payroll insights

## 🎨 Design Highlights

- **Modern Gradient UI**: Beautiful gradient cards with smooth animations
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Premium Aesthetics**: Glassmorphism effects and smooth transitions
- **Intuitive Navigation**: Clean sidebar and navbar layout
- **Data Visualization**: Interactive charts using Recharts

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd EMS
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ems
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

## 📱 Usage

### Default Admin Credentials
```
Email: admin@ems.com
Password: admin123
```

### Employee Registration
Employees can be registered by administrators through the admin panel.

## 🗂️ Project Structure

```
EMS/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── index.html
│
└── README.md
```

## 🔑 Key Features Breakdown

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password hashing

### Employee Module
- Personal profile management
- Attendance marking and tracking
- Leave application and history
- Payroll viewing with filters

### Admin Module
- Employee CRUD operations
- Attendance monitoring
- Leave approval workflow
- Bulk payroll generation
- Department-wise analytics

### Payroll System
- Automatic salary calculation
- HRA (40% of base salary)
- Leave-based deductions (LOP)
- Payment status tracking

## 📊 Database Schema

### User
- fullName, email, password, role

### Employee
- userId, department, position, salary, joiningDate, employeeType

### Attendance
- employeeId, date, status, checkInTime

### Leave
- employeeId, leaveType, fromDate, toDate, reason, status

### Payroll
- employeeId, month, year, basicSalary, hra, bonus, deductions, lopAmount, netSalary, paymentStatus

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees/profile` - Get employee profile
- `PUT /api/employees/profile` - Update profile
- `GET /api/employees` - Get all employees (Admin)

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/my` - Get employee attendance
- `GET /api/attendance` - Get all attendance (Admin)

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my` - Get employee leaves
- `PUT /api/leaves/:id` - Update leave status (Admin)

### Payroll
- `GET /api/payroll/my` - Get employee payroll
- `POST /api/payroll` - Create payroll (Admin)
- `POST /api/payroll/run-bulk` - Bulk payroll generation (Admin)

## 🌈 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Role-based authorization
- Input validation

## 🚧 Future Enhancements

- [ ] Email notifications for leave approvals
- [ ] Payslip PDF generation
- [ ] Performance review module
- [ ] Task management system
- [ ] Real-time notifications
- [ ] Advanced reporting and exports

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for modern HR management

## 📞 Support

For support, email support@ems.com or open an issue in the repository.

---

**Note**: This is a demonstration project. Please ensure proper security measures before deploying to production.
