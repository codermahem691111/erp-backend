export interface ProductRow {
  id: string;
  company_id: string;
  name: string;
  details: string;
  selling_price: number | string;
  buying_price: number | string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  details: string;
  sellingPrice: number;
  buyingPrice: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  companyId: string;
  name: string;
  details: string;
  sellingPrice: number;
  buyingPrice: number;
  imageUrl: string | null;
}

export type UpdateProductInput = Partial<Omit<CreateProductInput, 'companyId'>>;
