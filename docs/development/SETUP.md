# Development Setup

## Environment Setup

### Required Tools
- Node.js 18+
- npm/pnpm
- Git

### Environment Variables
```env
# AI Services
ANTHROPIC_API_KEY=

# Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
SENTRY_DSN=

# Data Storage
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### Installation
```bash
# Clone repository
git clone https://github.com/halobartku/ai-mentor-app.git
cd ai-mentor-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

## Development Workflow

### Branch Strategy
- `main`: Production code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes

### Commit Guidelines
```
feat: Add new feature
fix: Bug fix
refactor: Code improvement
docs: Documentation
test: Test addition/modification
chore: Maintenance
```

### PR Process
1. Branch from `develop`
2. Implement changes
3. Add tests
4. Update documentation
5. Create PR
6. Address reviews
7. Merge to `develop`