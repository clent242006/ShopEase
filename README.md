# ShopEase – E-Commerce Management System

ShopEase is a web-based E-Commerce Management System developed using the MERN Stack. It helps administrators and staff manage products, categories, customers, orders, and inventory in one application.

## Features

### 1. Dashboard
- View total products, customers, and orders.
- Monitor sales and pending orders.
- View recent transactions and inventory summaries.

### 2. Product Management
- Add new products.
- View product records.
- Update product information.
- Delete products.

### 3. Category Management
- Create product categories.
- View, edit, and delete categories.

### 4. Customer Management
- Register customers.
- View customer information.
- Update and delete customer records.

### 5. Order Management
- View customer orders.
- Monitor order status.
- Update payment and order status.

### 6. Inventory Management
- Record stock in and stock out.
- Monitor product stock levels.
- View inventory movement history.
- Check low-stock products.

### 7. Reports and Analytics
- View sales summaries.
- Monitor orders.
- View best-selling products.
- Check inventory summaries.

### 8. Staff Management
- Create staff accounts.
- View staff records.
- Update and delete staff accounts.
- Restrict staff management to administrators.

### 9. Authentication and Security
- User registration and login.
- Password hashing.
- JWT authentication.
- Role-based access control for Admin and Staff.

## Technologies Used

**Frontend**
- React.js
- Vite
- CSS
- Axios
- React Router
- Recharts
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
ShopEase/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ShopEase
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/shopease_db
JWT_SECRET=your_secret_key
```

Replace `your_secret_key` with a secure secret.

### 4. Start the Backend

Inside the `server` folder, run:

```bash
npm run dev
```

Backend URL:

`http://localhost:5001`

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

## User Roles

| Role | Permissions |
|---|---|
| Admin | Full system access, including staff management |
|
