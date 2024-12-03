import { trackEvent } from './analytics';

export enum ErrorCode {
  RATE_LIMIT = 'rate_limit',
  AI_ERROR = 'ai_error',
  NETWORK = 'network_error',
  AUTH = 'auth_error',
  STORAGE = 'storage_error'
}

interface ErrorDetails {
  code: ErrorCode;
  message: string;
  status: number;
  retry?: boolean;
}

export class AppError extends Error {
  constructor(
    public details: ErrorDetails
  ) {
    super(details.message);
    this.name = 'AppError';
    
    trackEvent({
      name: 'error_occurred',
      properties: {
        error_code: details.code,
        error_message: details.message
      }
    });
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return new Response(JSON.stringify({
      error: error.details.message,
      code: error.details.code
    }), { 
      status: error.details.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.error('Unhandled Error:', error);
  return new Response(JSON.stringify({
    error: 'Internal Server Error',
    code: 'internal_error'
  }), { 
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function handleAIError(error: any) {
  if (error?.status === 429) {
    throw new AppError({
      code: ErrorCode.RATE_LIMIT,
      message: 'Too many requests. Please try again later.',
      status: 429,
      retry: true
    });
  }

  throw new AppError({
    code: ErrorCode.AI_ERROR,
    message: 'Failed to process your request.',
    status: 500
  });
}