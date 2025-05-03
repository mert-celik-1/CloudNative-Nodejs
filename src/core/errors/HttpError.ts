import { AppError } from './AppError';

export class BadRequestError extends AppError {
    constructor(message = 'Bad request', errorCode = 'BAD_REQUEST') {
        super(message, 400, errorCode, true);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
        super(message, 401, errorCode, true);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
        super(message, 403, errorCode, true);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', errorCode = 'NOT_FOUND') {
        super(message, 404, errorCode, true);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict', errorCode = 'CONFLICT') {
        super(message, 409, errorCode, true);
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', errorCode = 'INTERNAL_SERVER_ERROR') {
        super(message, 500, errorCode, false);
    }
}