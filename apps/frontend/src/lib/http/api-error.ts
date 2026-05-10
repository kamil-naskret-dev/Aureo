export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: string,
    public readonly messages: string[],
    public readonly path?: string,
  ) {
    super(messages.join(', '));
    this.name = 'ApiError';
  }
}
