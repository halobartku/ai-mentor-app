export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown) {
  console.error('Error:', error);

  if (error instanceof APIError) {
    return new Response(error.message, { status: error.status });
  }

  return new Response('Internal Server Error', { status: 500 });
}