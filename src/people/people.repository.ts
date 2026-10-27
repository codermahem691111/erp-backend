import { Injectable, Logger } from '@nestjs/common';
import { throwOnSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { PeopleMapper } from './people.mapper';
import { CreatePersonInput, Person, PersonRow, PersonType, UpdatePersonInput } from './people.types';

const TABLE = 'people';

/**
 * All queries are scoped to `companyId` (the signed-in company).
 * Another company's rows are never returned, updated, or deleted.
 */
@Injectable()
export class PeopleRepository {
  private readonly logger = new Logger(PeopleRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(companyId: string, personType?: PersonType): Promise<Person[]> {
    let query = this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (personType) query = query.eq('person_type', personType);

    const { data, error } = await query;
    throwOnSupabaseError(this.logger, 'list people', error);
    return ((data ?? []) as PersonRow[]).map((row) => PeopleMapper.toEntity(row));
  }

  async findById(companyId: string, id: string): Promise<Person | null> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .eq('id', id)
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'find person', error);
    return data ? PeopleMapper.toEntity(data as PersonRow) : null;
  }

  async create(input: CreatePersonInput): Promise<Person> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .insert(PeopleMapper.toInsertRow(input))
      .select()
      .single();

    throwOnSupabaseError(this.logger, 'create person', error);
    return PeopleMapper.toEntity(data as PersonRow);
  }

  async update(companyId: string, id: string, input: UpdatePersonInput): Promise<Person | null> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .update(PeopleMapper.toUpdateRow(input))
      .eq('company_id', companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'update person', error);
    return data ? PeopleMapper.toEntity(data as PersonRow) : null;
  }

  async delete(companyId: string, id: string): Promise<boolean> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .delete()
      .eq('company_id', companyId)
      .eq('id', id)
      .select('id')
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'delete person', error);
    return Boolean(data);
  }
}
