import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { FinanceController } from './finance.controller';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [FinanceController],
  providers: [FinanceService, FinanceRepository],
})
export class FinanceModule {}
