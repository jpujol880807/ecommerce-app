// src/domain/shared/exceptions/DomainException.ts
import { ExceptionType } from './ExceptionTypes';

export class DomainException extends Error {
    public readonly exceptionType: ExceptionType;
    public readonly statusCode: number;
    public readonly details?: Record<string, any>;
    public readonly isDomainException = true; // Marca para type guard

    constructor(
        message: string,
        exceptionType: ExceptionType,
        statusCode: number = 500,
        details?: Record<string, any>
    ) {
        super(message);
        this.exceptionType = exceptionType;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'DomainException';

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            type: this.exceptionType,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details
        };
    }
}

// Type guard que funciona en todos los contextos de Nuxt
export function isDomainException(error: unknown): error is DomainException {
    return (typeof error === 'object' &&
        error !== null &&
        'isDomainException' in error && (error as any).isDomainException && 'exceptionType' in error && 'statusCode' in error && 'message' in error);
}

