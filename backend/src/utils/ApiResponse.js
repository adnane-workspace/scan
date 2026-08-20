export function apiResponse({ success = true, message = '', data = null, statusCode = 200 }) {
  return {
    success,
    message,
    ...(data !== null && { data }),
    statusCode,
  };
}
