import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {Repository} from "typeorm";
import {Company} from "../../../model/company.entity";
import {Inject} from "@nestjs/common";

export class GetCompanyByIdQuery {
    constructor(public id: number) {
    }
}

@QueryHandler(GetCompanyByIdQuery)
export class GetCompanyByIdQueryHandler implements IQueryHandler<GetCompanyByIdQuery> {
    constructor(@Inject('COMPANY_REPOSITORY') private companyRepository: Repository<Company>) {
    }

    execute(query: GetCompanyByIdQuery): Promise<Company> {
        return this.companyRepository.findOneById(query.id);    //Should be mapped to DTO
    }
}