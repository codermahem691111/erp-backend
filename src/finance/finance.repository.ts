import { Injectable, Logger } from '@nestjs/common';
import { throwOnSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { FinanceMapper } from './finance.mapper';
import { CreateFinanceEntryInput, FinanceEntry, FinanceEntryRow } from './finance.types';

const TABLE = 'finance_entries';

@Injectable()
export class FinanceRepository {
  private readonly logger = new Logger(FinanceRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(companyId: string): Promise<FinanceEntry[]> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('occurred_at', { ascending: false });

    throwOnSupabaseError(this.logger, 'list finance entries', error);
    return ((data ?? []) as FinanceEntryRow[]).map((row) => FinanceMapper.toEntity(row));
  }

  async create(input: CreateFinanceEntryInput): Promise<FinanceEntry> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .insert(FinanceMapper.toInsertRow(input))
      .select()
      .single();

    throwOnSupabaseError(this.logger, 'create finance entry', error);
    return FinanceMapper.toEntity(data as FinanceEntryRow);
  }

  async delete(companyId: string, id: string): Promise<boolean> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .delete()
      .eq('company_id', companyId)
      .eq('id', id)
      .select('id')
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'delete finance entry', error);
    return Boolean(data);
  }
}
