import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler';

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Preferences schema
export const preferencesSchema = z.object({
  learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic']).optional(),
  communicationStyle: z.enum(['formal', 'casual', 'direct', 'supportive']).optional(),
  interests: z.array(z.string()).optional(),
  focusAreas: z.array(z.string()).optional(),
  goalPreferences: z.object({
    shortTerm: z.boolean(),
    longTerm: z.boolean(),
    daily: z.boolean()
  }).optional()
});

// Message schema
export const messageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  chatId: z.string().optional()
});

// Goal schema
export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.array(z.string()).optional()
});

// Generic validation function
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(400, error.errors[0].message));
      } else {
        next(error);
      }
    }
  };
};

// Export validation middleware
export const validateSignup = validate(signupSchema);
export const validateLogin = validate(loginSchema);
export const validatePreferences = validate(preferencesSchema);
export const validateMessage = validate(messageSchema);
export const validateGoal = validate(goalSchema);