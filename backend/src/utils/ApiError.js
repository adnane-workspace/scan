export class ApiError extends Error {
  constructor(statusCode, message, details = null, code = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
  }
}
