export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}
