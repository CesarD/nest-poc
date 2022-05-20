import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {Company} from "../../../model/company.entity";
import {AsyncValidator} from "fluentvalidation-ts";
import {CommandResult} from "../../../command-result";

export class CompanyEditCommand {
    constructor(public id: number,
                public name:string) {
    }
}

class CompanyEditCommandValidator extends AsyncValidator<CompanyEditCommand> {
    constructor(private companyRepository: Repository<Company>) {
        super();
        
        this.ruleFor('id')
            .mustAsync(async (id) => (await this.companyRepository.countBy({id: id})) == 1)
        
        this.ruleFor('name')
            .notEmpty();
    }
}

@CommandHandler(CompanyEditCommand)
export class CompanyEditCommandHandler implements ICommandHandler<CompanyEditCommand> {
    constructor(@Inject('COMPANY_REPOSITORY') private companyRepository: Repository<Company>,
                private readonly validator: CompanyEditCommandValidator) {
        this.validator = new CompanyEditCommandValidator(companyRepository);
    }

    async execute(command: CompanyEditCommand): Promise<CommandResult<CompanyEditCommand, any>> {
        let validation = await this.validator.validateAsync(command);
        if (Object.keys(validation).length != 0){
            return validation.id
                ? new CommandResult(true)
                : new CommandResult(null, validation, null);                
        }
        
        let item = await this.companyRepository.findOneById(command.id);
        item.name = command.name;

        await this.companyRepository.save(item);
        return new CommandResult();
    }
}