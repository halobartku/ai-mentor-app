import request from 'supertest';
import app from '../../server';
import { prisma } from '../../config/database';
import { generateToken } from '../../utils/auth';

describe('AI Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      }
    });
    userId = user.id;
    authToken = generateToken(user.id);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/ai/chat', () => {
    it('should generate AI response', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'Hello AI mentor'
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('response');
      expect(res.body.data).toHaveProperty('chatId');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'Hello AI mentor'
        });

      expect(res.status).toBe(401);
    });

    it('should validate message input', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: ''
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});