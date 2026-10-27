import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleRepository } from './people.repository';
import { Person, PersonType } from './people.types';

@Injectable()
export class PeopleService {
  constructor(private readonly people: PeopleRepository) {}

  list(companyId: string, personType?: PersonType): Promise<Person[]> {
    return this.people.list(companyId, personType);
  }

  async get(companyId: string, id: string): Promise<Person> {
    const person = await this.people.findById(companyId, id);
    if (!person) throw new NotFoundException('Person not found.');
    return person;
  }

  create(companyId: string, dto: CreatePersonDto): Promise<Person> {
    return this.people.create({
      companyId,
      personType: dto.personType,
      name: dto.name,
      details: dto.details ?? '',
      email: dto.email ?? null,
      phone: dto.phone ?? null,
    });
  }

  async update(companyId: string, id: string, dto: UpdatePersonDto): Promise<Person> {
    const updated = await this.people.update(companyId, id, {
      personType: dto.personType,
      name: dto.name,
      details: dto.details,
      email: dto.email,
      phone: dto.phone,
    });
    if (!updated) throw new NotFoundException('Person not found.');
    return updated;
  }

  async remove(companyId: string, id: string): Promise<void> {
    const deleted = await this.people.delete(companyId, id);
    if (!deleted) throw new NotFoundException('Person not found.');
  }
}
