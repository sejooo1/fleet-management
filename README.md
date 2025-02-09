# Fleet Management System

## Overview
Fleet Management System is a web application designed for efficient fleet management for the company PONG. It eliminates manual tracking of vehicles and trip records, providing authorized users with easy access to all relevant data.

## Features
- **Vehicle Management** – Add, update, and delete vehicles.
- **Trip Records** – Log and track trips with driver, route, and status details.
- **Report Generation** – Generate vehicle usage reports.
- **User Roles** – Admins manage vehicles and trips; users can log and view trips.

## Technologies
- **Frontend:** React.js, Tailwind CSS (hosted on Vercel)
- **Backend:** Node.js, Express.js (hosted on Railway)
- **Database:** PostgreSQL (hosted on Neon.tech)
- **Authentication:** JWT (JSON Web Token)

## Installation
```sh
git clone https://github.com/sejooo1/fleet-management.git
cd fleet-management
```

### Backend
```sh
cd backend
npm install
node index.js
```

### Frontend
```sh
cd frontend
npm install
npm start
```

## API Endpoints
- **Auth:** `POST /api/auth/login`
- **Vehicles:** `GET /api/vehicles`, `POST /api/vehicles` (admin), `PUT /api/vehicles/:id` (admin), `DELETE /api/vehicles/:id` (admin)
- **Trips:** `GET /api/trips`, `POST /api/trips`, `PUT /api/trips/:id/status` (admin), `DELETE /api/trips/:id` (admin)
- **Reports:** `GET /api/reports/usage`

## Deployment
- **Frontend:** [Fleet Management App](https://fleet-management-nine.vercel.app/)
- **Backend:** Hosted on Railway
- **Database:** Hosted on Neon.tech

## License
MIT License

