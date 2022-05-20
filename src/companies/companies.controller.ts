import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res} from '@nestjs/common';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {Company} from "../model/company.entity";
import {GetCompaniesQuery} from "../features/company/queries/get-companies-query";
import {GetCompanyByIdQuery} from "../features/company/queries/get-company-by-id-query";
import {Response} from "express";
import {CompanyCreateCommand} from "../features/company/commands/company-create-command";
import {CompanyEditCommand} from "../features/company/commands/company-edit-command";
import {CompanyDeleteCommand} from "../features/company/commands/company-delete-command";
import {CommandResult} from "../command-result";
import {CompanyCreateEditDto} from "../company-create-edit-dto";

@Controller('companies')
export class CompaniesController {
    constructor(private readonly cmdBus: CommandBus,
                private readonly queryBus: QueryBus) {}

    @Get()
    get(): Promise<Company[]> {
        return this.queryBus.execute(new GetCompaniesQuery());
    }
    
    @Get(':id')
    async getById(@Param('id') id: number,
                  @Res({passthrough: true}) res: Response): Promise<Company> {
        let item = await this.queryBus.execute(new GetCompanyByIdQuery(id));
        if (item == null) {
            res.status(HttpStatus.NOT_FOUND);
            return;
        }
        
        return item;        
    }
    
    @Post()
    async post(@Body() dto: CompanyCreateEditDto, @Res({passthrough: true}) res: Response) {
        let result: CommandResult<CompanyCreateCommand, number> = await this.cmdBus.execute(new CompanyCreateCommand(dto.name));
        
        if (result.validationResult) {
            res.status(HttpStatus.BAD_REQUEST);
            return result.validationResult;
        }
        
        return result.result;
    }
    
    @Put(':id')
    async put(@Param('id') id: number, @Body() dto: CompanyCreateEditDto, @Res({passthrough: true}) res: Response) {
        let result: CommandResult<CompanyEditCommand, any> = await this.cmdBus.execute(new CompanyEditCommand(id, dto.name));
        
        if (result.itemNotFound) {
            res.status(HttpStatus.NOT_FOUND);
            return;
        }
        
        if (result.validationResult) {
            res.status(HttpStatus.BAD_REQUEST);
            return result.validationResult;
        }
    }
    
    @Delete(':id')
    async delete(@Param('id') id: number, @Res({passthrough: true}) res: Response) {
        let result: CommandResult<CompanyDeleteCommand, any> = await this.cmdBus.execute(new CompanyDeleteCommand(id));
        
        if (result.itemNotFound) {
            res.status(HttpStatus.NOT_FOUND);
        }
    }
}
