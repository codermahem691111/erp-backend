import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { Trim } from '../../common/decorators/normalize.decorators';

export class UpdateProductDto {
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Product name must be at most 150 characters.' })
  name?: string;

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(4000, { message: 'Details must be at most 4000 characters.' })
  details?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Selling price must be a number.' })
  @Min(0, { message: 'Selling price cannot be negative.' })
  sellingPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Buying price must be a number.' })
  @Min(0, { message: 'Buying price cannot be negative.' })
  buyingPrice?: number;

  @Trim()
  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL.' })
  @MaxLength(2000)
  imageUrl?: string | null;
}
