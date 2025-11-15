import {DomainException} from '~~/common/domain/exceptions/DomainException';
import {ExceptionType} from '~~/common/domain/exceptions/ExceptionTypes';

export class UserAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(
            `User with email: ${email} already exists`,
            ExceptionType.DUPLICATE_ENTITY,
            409,
            { email }
        );
    }
}

export class UserNotFoundException extends DomainException {
    constructor(identifier: string | number) {
        super(
            `User not found with identifier: ${identifier}`,
            ExceptionType.ENTITY_NOT_FOUND,
            404,
            { identifier }
        );
    }
}

export class InvalidCredentialsException extends DomainException {
    constructor() {
        super(
            'Invalid email or password provided',
            ExceptionType.AUTHENTICATION_ERROR,
            401
        );
    }
}

export class InvalidPasswordException extends DomainException {
    constructor() {
        super(
            'Invalid password provided',
            ExceptionType.VALIDATION_ERROR,
            400
        );
    }
}

export class InvalidLoginDataException extends DomainException {
    constructor(message: string, details: Record<string, any> = {}) {
        super(
            message,
            ExceptionType.VALIDATION_ERROR,
            400,
            details
        );
    }
}

export class InvalidUserCreationDataException extends DomainException {
    constructor(message: string, details: Record<string, any> = {}) {
        super(
            message,
            ExceptionType.VALIDATION_ERROR,
            400,
            details
        );
    }
}

export class UserCreationFailedException extends DomainException {
    constructor() {
        super(
            'Failed to create user due to an internal error',
            ExceptionType.INTERNAL_ERROR,
            500
        );
    }
}
