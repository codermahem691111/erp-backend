import { CreateProductInput, Product, ProductRow, UpdateProductInput } from './products.types';

export class ProductsMapper {
  static toEntity(row: ProductRow): Product {
    return {
      id: row.id,
      companyId: row.company_id,
      name: row.name,
      details: row.details,
      sellingPrice: Number(row.selling_price),
      buyingPrice: Number(row.buying_price),
      imageUrl: row.image_url,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  static toInsertRow(input: CreateProductInput): Record<string, unknown> {
    return {
      company_id: input.companyId,
      name: input.name,
      details: input.details,
      selling_price: input.sellingPrice,
      buying_price: input.buyingPrice,
      image_url: input.imageUrl,
    };
  }

  static toUpdateRow(input: UpdateProductInput): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (input.name !== undefined) row.name = input.name;
    if (input.details !== undefined) row.details = input.details;
    if (input.sellingPrice !== undefined) row.selling_price = input.sellingPrice;
    if (input.buyingPrice !== undefined) row.buying_price = input.buyingPrice;
    if (input.imageUrl !== undefined) row.image_url = input.imageUrl;
    return row;
  }
}
