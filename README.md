# MyPOS - Enterprise-Grade Modular Point of Sale System

A modern, scalable, and production-ready POS application supporting multiple business types including restaurants, retail stores, salons, grocery stores, cafes, pharmacies, and general billing.

## 🚀 Features

### Core

- **Multi-Business Support**: Restaurant, Retail, Grocery, Salon, Cafe, Pharmacy, General
- **Real-time Operations**: WebSocket-powered live updates
- **Offline Support**: PWA with service worker caching
- **Multi-Branch**: Centralized management across locations
- **Role-Based Access**: Super Admin, Admin, Manager, Cashier, Waiter, Staff, Accountant

### Modules

- 📊 **Dashboard** - Revenue analytics, KPI cards, charts
- 🛒 **POS Billing** - Touch-optimized, barcode scanning, split payments
- 🍽️ **Restaurant** - Table management, KOT, kitchen display
- 🏪 **Retail** - Barcode/SKU, batch management, promotions
- 💇 **Salon** - Appointments, staff scheduling, memberships
- 📦 **Inventory** - Stock management, alerts, transfers
- 🖨️ **Printing** - ESC/POS thermal, USB/Bluetooth/Network
- 📈 **Reports** - Sales, P&L, tax, PDF/Excel export
- 👥 **CRM** - Loyalty points, memberships, campaigns
- ⚙️ **Settings** - Business config, tax, currency, themes

## 🛠️ Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | React, Vite, TypeScript, Tailwind CSS, Framer Motion |
| State     | Zustand, TanStack Query                              |
| Backend   | Node.js, Express, TypeScript                         |
| Database  | PostgreSQL, Prisma ORM                               |
| Real-time | Socket.IO                                            |
| Auth      | JWT + Refresh Tokens                                 |
| Desktop   | Electron.js (ready)                                  |
| DevOps    | Docker, Docker Compose                               |

## 📁 Project Structure

```
MY_POS/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API service layer
│   │   ├── store/         # Zustand stores
│   │   ├── styles/        # Global CSS
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── tables/
│   │   │   ├── inventory/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── middleware/    # Auth, error handling
│   │   ├── lib/           # Prisma client
│   │   ├── app.ts         # Express app
│   │   └── server.ts      # HTTP + WebSocket server
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed data
├── docker-compose.yml
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or pnpm

### Quick Start

1. **Clone and install**

```bash
cd MY_POS
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. **Setup environment**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database**

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

4. **Run development**

```bash
# From root directory
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Health: http://localhost:4000/api/health

### Docker Setup

```bash
docker-compose up -d
```

## 🔑 Default Credentials

| Role        | Email             | Password   |
| ----------- | ----------------- | ---------- |
| Super Admin | admin@mypos.com   | admin123   |
| Cashier     | cashier@mypos.com | cashier123 |

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get profile

### Products

- `GET /api/products` - List products (with pagination, search, filter)
- `GET /api/products/:id` - Get product
- `GET /api/products/barcode/:barcode` - Get by barcode
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders

- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status
- `GET /api/orders/kitchen/queue` - Kitchen queue

### Categories, Customers, Tables, Inventory, Reports, Settings

All follow standard RESTful patterns with full CRUD operations.

## 🎨 Design System

### Colors

- Primary: `#2563EB` (Blue)
- Accent: `#14B8A6` (Teal), `#F59E0B` (Amber), `#22C55E` (Green)
- Dark: `#0F172A`

### Typography

- Body: Inter
- Display: Poppins

## 📦 Deployment

### Production Build

```bash
cd frontend && npm run build
cd backend && npm run build
```

### Environment Variables

See `.env.example` for all required variables.

## 📄 License

MIT License - Feel free to use for commercial projects.
