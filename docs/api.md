# API Documentation

## Authentication

### POST /api/auth/signup
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

### POST /api/auth/login
Authenticate user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

## AI Chat

### POST /api/ai/chat
Get AI mentor response.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request:**
```json
{
  "message": "How can I improve my programming skills?"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "response": "AI mentor response",
    "chatId": "chat_id"
  }
}
```

## Goals

### GET /api/users/goals
Get user's goals.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "goal_id",
      "title": "Learn React Native",
      "description": "Build a mobile app",
      "status": "in_progress",
      "deadline": "2024-12-31T00:00:00Z"
    }
  ]
}
```

### POST /api/users/goals
Create a new goal.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request:**
```json
{
  "title": "Learn React Native",
  "description": "Build a mobile app",
  "deadline": "2024-12-31T00:00:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "goal_id",
    "title": "Learn React Native",
    "description": "Build a mobile app",
    "status": "in_progress",
    "deadline": "2024-12-31T00:00:00Z"
  }
}
```

## Subscription

### POST /api/subscriptions/create
Create a new subscription.

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request:**
```json
{
  "priceId": "price_id"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": {
      "id": "subscription_id",
      "status": "active",
      "current_period_end": "2024-12-31T00:00:00Z"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```