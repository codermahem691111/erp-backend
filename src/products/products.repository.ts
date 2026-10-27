import { Injectable, Logger } from '@nestjs/common';
import { throwOnSupabaseError } from '../common/supabase-error';
import { SupabaseService } from '../supabase/supabase.service';
import { ProductsMapper } from './products.mapper';
import { CreateProductInput, Product, ProductRow, UpdateProductInput } from './products.types';

const TABLE = 'products';

@Injectable()
export class ProductsRepository {
  private readonly logger = new Logger(ProductsRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async list(companyId: string): Promise<Product[]> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    throwOnSupabaseError(this.logger, 'list products', error);
    return ((data ?? []) as ProductRow[]).map((row) => ProductsMapper.toEntity(row));
  }

  async findById(companyId: string, id: string): Promise<Product | null> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .eq('id', id)
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'find product', error);
    return data ? ProductsMapper.toEntity(data as ProductRow) : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .insert(ProductsMapper.toInsertRow(input))
      .select()
      .single();

    throwOnSupabaseError(this.logger, 'create product', error);
    return ProductsMapper.toEntity(data as ProductRow);
  }

  async update(companyId: string, id: string, input: UpdateProductInput): Promise<Product | null> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .update(ProductsMapper.toUpdateRow(input))
      .eq('company_id', companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'update product', error);
    return data ? ProductsMapper.toEntity(data as ProductRow) : null;
  }

  async delete(companyId: string, id: string): Promise<boolean> {
    const { data, error } = await this.supabase.admin
      .from(TABLE)
      .delete()
      .eq('company_id', companyId)
      .eq('id', id)
      .select('id')
      .maybeSingle();

    throwOnSupabaseError(this.logger, 'delete product', error);
    return Boolean(data);
  }
}
