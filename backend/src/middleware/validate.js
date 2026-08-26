import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(new ApiError(400, 'Validation error', result.error.flatten(), 'VALIDATION_ERROR'));
    }

    req.validated = result.data;
    next();
  };
}
