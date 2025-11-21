import {DomainException} from '~~/common/domain/exceptions/DomainException';
import {ExceptionType} from '~~/common/domain/exceptions/ExceptionTypes';

export class CategoryNotFoundException extends DomainException {
    constructor(categoryId: string) {
        super(
            `Category with ID: ${categoryId} not found`,
            ExceptionType.ENTITY_NOT_FOUND,
            404,
            { categoryId }
        );
    }
}
