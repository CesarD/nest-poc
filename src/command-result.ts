import {ValidationErrors} from "fluentvalidation-ts/dist/ValidationErrors";

export class CommandResult<TValidator, TResult> {
    constructor(public itemNotFound?: boolean,
                public validationResult?: ValidationErrors<TValidator>,                
                public result?: TResult) {
    }
}
