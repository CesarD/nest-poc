import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Connection, createConnection} from "typeorm";
import {Company} from "./model/company.entity";
import { CompaniesController } from './companies/companies.controller';

@Module({
  imports: [],
  controllers: [AppController, CompaniesController],
  providers: [
      AppService,
      {
          provide: 'DATABASE_CONNECTION',
          useFactory: async () => await createConnection({
              type: 'mssql',
              host: 'localhost',
              port: 1433,
              username: 'sa',
              password: 'Passw0rd',
              database: 'nest-test',
              entities: [
                  __dirname + '/../**/*.entity{.ts,.js}',
              ],
              synchronize: true,
          }),
      },
      {
          provide: 'COMPANY_REPOSITORY',
          useFactory: (connection: Connection) => connection.getRepository(Company),
          inject: ['DATABASE_CONNECTION'],
      },
  ],
})
export class AppModule {}
