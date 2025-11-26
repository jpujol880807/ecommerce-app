import {DomainException} from '../../../../common/domain/exceptions/DomainException';
import {ExceptionType} from '../../../../common/domain/exceptions/ExceptionTypes';

export class InvalidSearchProductsInputException extends DomainException {
    constructor(message: string, details: Record<string, any> = {}) {
        super(
            message,
            ExceptionType.VALIDATION_ERROR,
            422,
            details
        );
    }
}
