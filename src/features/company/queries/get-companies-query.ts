import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {Repository} from "typeorm";
import {Company} from "../../../model/company.entity";
import {Inject} from "@nestjs/common";

export class GetCompaniesQuery {}

@QueryHandler(GetCompaniesQuery)
export class GetCompaniesQueryHandler implements IQueryHandler<GetCompaniesQuery> {
    constructor(@Inject('COMPANY_REPOSITORY') private companyRepository: Repository<Company>) {
    }

    execute(query: GetCompaniesQuery): Promise<Company[]> {
        return this.companyRepository.find();   //Should be mapped to DTOs
    }
}