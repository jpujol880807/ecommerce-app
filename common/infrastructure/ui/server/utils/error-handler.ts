import { createError, H3Error } from 'h3';
import {isDomainException} from '~~/common/domain/exceptions/DomainException';

export function handleApiError(error: any): H3Error {
    if (isDomainException(error)) {
        return createError({
            statusCode: error.statusCode,
            message: error.message,
            data: error.toJSON(),
        });
    }
    if (error instanceof Error) {
        return createError({ statusCode: 500, message: error.message });
    }
    return createError({ statusCode: 500, message: 'Internal Server Error' });
}
