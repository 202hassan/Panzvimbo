# Backend API Structure for Panzvimbo

This document outlines the backend structure needed for the Panzvimbo app.

## Backend Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Socket.io for real-time updates

## Required API Endpoints

### Authentication (`/api/auth`)

#### POST /api/auth/register
Register a new user (client or courier)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "userType": "client" | "courier",
  "vehicleInfo": {  // Only for couriers
    "model": "Honda CB500X",
    "plateNumber": "ABC123",
    "color": "Red"
  }
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication)

#### PUT /api/auth/profile
Update user profile (requires authentication)

---

### Deliveries (`/api/deliveries`)

#### POST /api/deliveries
Create new delivery request (Client only)
```json
{
  "pickupLocation": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "123 Main St, San Francisco, CA"
  },
  "dropoffLocation": {
    "latitude": 37.7849,
    "longitude": -122.4094,
    "address": "456 Market St, San Francisco, CA"
  },
  "packageDetails": {
    "description": "Small box with documents",
    "weight": 2,
    "size": "small"
  },
  "suggestedPrice": 15
}
```

#### GET /api/deliveries/my-deliveries
Get user's delivery requests (Client only)

#### GET /api/deliveries/available?latitude=&longitude=
Get available delivery jobs for couriers (Courier only)

#### GET /api/deliveries/:id/bids
Get all bids for a specific delivery (Client only)

#### POST /api/deliveries/bids
Place a bid on a delivery (Courier only)
```json
{
  "deliveryId": "delivery_id",
  "amount": 12,
  "estimatedTime": 25,
  "message": "I can deliver this quickly!"
}
```

#### POST /api/deliveries/:id/accept-bid
Accept a bid (Client only)
```json
{
  "bidId": "bid_id"
}
```

#### GET /api/deliveries/my-bids
Get courier's bids (Courier only)

#### GET /api/deliveries/active
Get courier's active delivery (Courier only)

#### PATCH /api/deliveries/:id/status
Update delivery status (Courier only)
```json
{
  "status": "in_progress" | "completed"
}
```

#### PATCH /api/deliveries/:id/location
Update courier's real-time location (Courier only)
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

---

### Payments (`/api/payments`)

#### POST /api/payments/methods
Add payment method
```json
{
  "type": "card" | "mobile_money" | "cash",
  "cardNumber": "4242424242424242",
  "expiryDate": "12/25",
  "cvv": "123"
}
```

#### GET /api/payments/methods
Get user's payment methods

#### POST /api/payments/process
Process payment for delivery
```json
{
  "deliveryId": "delivery_id",
  "paymentMethodId": "method_id"
}
```

#### GET /api/payments/history
Get transaction history

---

## MongoDB Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  userType: enum['client', 'courier'],
  rating: Number,
  vehicleInfo: {
    model: String,
    plateNumber: String,
    color: String
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  createdAt: Date
}
```

### Delivery Model
```javascript
{
  clientId: ObjectId (ref: User),
  pickupLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  dropoffLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  packageDetails: {
    description: String,
    weight: Number,
    size: enum['small', 'medium', 'large']
  },
  suggestedPrice: Number,
  status: enum['pending', 'bidding', 'accepted', 'in_progress', 'completed', 'cancelled'],
  acceptedBid: ObjectId (ref: Bid),
  createdAt: Date
}
```

### Bid Model
```javascript
{
  deliveryId: ObjectId (ref: Delivery),
  courierId: ObjectId (ref: User),
  amount: Number,
  estimatedTime: Number,
  message: String,
  status: enum['pending', 'accepted', 'rejected'],
  createdAt: Date
}
```

---

## WebSocket Events (Socket.io)

### For real-time updates:
- `new-bid`: Notify client when a new bid is placed
- `bid-accepted`: Notify courier when their bid is accepted
- `location-update`: Update client with courier's location
- `delivery-status`: Update delivery status changes

---

## Quick Start Backend Template

```bash
# Create backend folder
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv socket.io

# Create folder structure
mkdir -p src/models src/routes src/controllers src/middleware
```

Then implement the routes and models according to the structure above.
