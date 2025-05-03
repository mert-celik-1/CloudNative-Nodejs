// src/core/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import {NotFoundError} from "@core/errors/HttpError";
import {logger} from "@shared/utils/Logger";

interface ErrorResponse {
    status: string;
    message: string;
    errorCode: string;
    stack?: string;
    details?: unknown;
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log all errors
    logger.error({
        message: `Error processing request: ${req.method} ${req.path}`,
        error: err.message,
        stack: err.stack,
        requestId: req.headers['x-request-id'] || 'unknown',
        requestBody: req.body,
        requestParams: req.params,
        requestQuery: req.query,
    });

    // Default response
    const response: ErrorResponse = {
        status: 'error',
        message: 'Something went wrong',
        errorCode: 'INTERNAL_SERVER_ERROR',
    };

    // If it's our custom AppError
    if (err instanceof AppError) {
        response.message = err.message;
        response.errorCode = err.errorCode;

        // In development mode, include stack for operational errors
        if (process.env.NODE_ENV === 'development' && err.isOperational) {
            response.stack = err.stack;
        }

        res.status(err.statusCode).json(response);
        return;
    }

    // Handle other specific error types
    if (err.name === 'ValidationError') {
        response.message = 'Validation error';
        response.errorCode = 'VALIDATION_ERROR';
        response.details = err;
        res.status(400).json(response);
        return;
    }

    if (err.name === 'JsonWebTokenError') {
        response.message = 'Invalid token';
        response.errorCode = 'INVALID_TOKEN';
        res.status(401).json(response);
        return;
    }

    // For unexpected errors, include stack in development mode
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Send generic response for unhandled errors
    res.status(500).json(response);
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};