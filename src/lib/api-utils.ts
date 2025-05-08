import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const errorMessages = {
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input data',
  SERVER_ERROR: 'Internal server error',
  RATE_LIMITED: 'Too many requests',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_ENTRY: 'Resource already exists',
} as const;

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || errorMessages.SERVER_ERROR,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: errorMessages.SERVER_ERROR,
    },
    { status: 500 }
  );
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function validateRequiredFields(data: Record<string, any>, fields: string[]) {
  const missingFields = fields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new APIError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }
} 