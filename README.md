# AI Mentor App

A sophisticated AI-powered mentoring platform built with React Native and Node.js.

## Features

- 🤖 Advanced AI-powered mentoring using GPT-4 and Claude
- 🎯 Personalized goal tracking and progress analytics
- 💬 Real-time chat with intelligent context awareness
- 📊 Comprehensive progress visualization
- 🔒 Enterprise-grade security
- 💫 Premium features and subscription management

## Tech Stack

### Frontend
- React Native
- TypeScript
- Redux Toolkit
- Styled Components
- React Navigation

### Backend
- Node.js
- Express
- PostgreSQL
- Redis
- Docker

### AI & Machine Learning
- OpenAI GPT-4
- Anthropic Claude
- TensorFlow.js

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- React Native CLI
- PostgreSQL >= 14
- Redis >= 6

### Installation

1. Clone the repository:
```bash
git clone https://github.com/halobartku/ai-mentor-app.git
cd ai-mentor-app
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development
cd frontend
npm run start
```

## Project Structure

```
ai-mentor-app/
├── frontend/           # React Native application
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
├── backend/           # Node.js server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── package.json
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.