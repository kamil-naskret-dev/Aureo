export type ApiEnvelope<T> = {
  data: T;
  statusCode: number;
  timestamp: string;
};

export type ApiErrorResponse = {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
};
