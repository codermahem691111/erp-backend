import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { Trim } from '../../common/decorators/normalize.decorators';

export class CreateIncomeDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a number.' })
  @Min(0.01, { message: 'Amount must be greater than 0.' })
  amount!: number;

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Product is invalid.' })
  productId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid date.' })
  occurredAt?: string;
}
