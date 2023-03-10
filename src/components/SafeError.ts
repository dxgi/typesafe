export default class SafeError extends Error {
    statusCode: number = 400;

    constructor(message: string, statusCode?: number) {
        super(message);
        
        Error.captureStackTrace(this, this.constructor);
        this.name = 'SafeError';

        if (statusCode)
            this.statusCode = statusCode;
    }
}