import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim, Lowercase } from '../../common/decorators/normalize.decorators';
import { PERSON_TYPES, PersonType } from '../people.types';

export class CreatePersonDto {
  @Trim()
  @IsIn(PERSON_TYPES, { message: 'Person type must be customer, staff or supplier.' })
  personType!: PersonType;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(150, { message: 'Name must be at most 150 characters.' })
  name!: string;

  @Trim()
  @IsString()
  @MaxLength(2000, { message: 'Details must be at most 2000 characters.' })
  details: string = '';

  @Trim()
  @Lowercase()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @MaxLength(254)
  email?: string;

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(40, { message: 'Phone must be at most 40 characters.' })
  phone?: string;
}
