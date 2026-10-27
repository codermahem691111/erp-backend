import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { FinanceService } from './finance.service';
import { FinanceEntry, FinanceSummary } from './finance.types';

@Controller('finance')
@UseGuards(SupabaseAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser): Promise<FinanceEntry[]> {
    return this.financeService.list(user.id);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthenticatedUser): Promise<FinanceSummary> {
    return this.financeService.summary(user.id);
  }

  @Post('expenses')
  @HttpCode(HttpStatus.CREATED)
  addExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExpenseDto,
  ): Promise<FinanceEntry> {
    return this.financeService.addExpense(user.id, dto);
  }

  @Post('income')
  @HttpCode(HttpStatus.CREATED)
  addIncome(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateIncomeDto,
  ): Promise<FinanceEntry> {
    return this.financeService.addIncome(user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.financeService.remove(user.id, id);
  }
}
