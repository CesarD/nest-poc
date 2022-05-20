import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Repository} from "typeorm";
import {Company} from "../../../model/company.entity";
import {Inject} from "@nestjs/common";
import {Validator} from "fluentvalidation-ts";
import {CommandResult} from "../../../command-result";

export class CompanyCreateCommand {
    constructor(public name: string) {
    }
}

class CompanyCreateCommandValidator extends Validator<CompanyCreateCommand> {
    constructor() {
        super();
        
        this.ruleFor('name')
            .notEmpty();
    }
}

@CommandHandler(CompanyCreateCommand)
export class CompanyCreateCommandHandler implements ICommandHandler<CompanyCreateCommand> {
    constructor(@Inject('COMPANY_REPOSITORY') private companyRepository: Repository<Company>,
                private readonly validator: CompanyCreateCommandValidator) {
        this.validator = new CompanyCreateCommandValidator();
    }

    async execute(command: CompanyCreateCommand): Promise<CommandResult<CompanyCreateCommand, number>> {
        let validation = this.validator.validate(command);
        if (Object.keys(validation).length != 0)
            return new CommandResult(null, validation, null);
        
        let item = new Company();
        item.name = command.name;
        
        await this.companyRepository.save(item);
        
        return new CommandResult<CompanyCreateCommand, number>(null, null, item.id);
    }
}