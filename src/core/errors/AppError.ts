export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500,
        public readonly errorCode: string = 'INTERNAL_SERVER_ERROR',
        public readonly isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}