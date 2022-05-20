import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {Company} from "../../../model/company.entity";
import {AsyncValidator} from "fluentvalidation-ts";
import {CommandResult} from "../../../command-result";

export class CompanyDeleteCommand {
    constructor(public id: number) {
    }
}

class CompanyDeleteCommandValidator extends AsyncValidator<CompanyDeleteCommand> {
    constructor(private companyRepository: Repository<Company>) {
        super();

        this.ruleFor('id')
            .mustAsync(async (id) => (await this.companyRepository.countBy({id: id})) == 1)
    }
}

@CommandHandler(CompanyDeleteCommand)
export class CompanyDeleteCommandHandler implements ICommandHandler<CompanyDeleteCommand> {
    constructor(@Inject('COMPANY_REPOSITORY') private companyRepository: Repository<Company>,
                private readonly validator: CompanyDeleteCommandValidator) {
        this.validator = new CompanyDeleteCommandValidator(companyRepository);
    }

    async execute(command: CompanyDeleteCommand): Promise<CommandResult<CompanyDeleteCommand, any>> {
        let validation = await this.validator.validateAsync(command);
        if (validation.id){
            return new CommandResult(true);
        }
        
        let item = await this.companyRepository.findOneById(command.id);

        await this.companyRepository.remove(item);
        return new CommandResult()
    }
}