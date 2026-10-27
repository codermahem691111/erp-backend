import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from './products.types';

const BUCKET = 'product-images';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 2 * 1024 * 1024;

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly products: ProductsRepository,
    private readonly supabase: SupabaseService,
  ) {}

  list(companyId: string): Promise<Product[]> {
    return this.products.list(companyId);
  }

  async get(companyId: string, id: string): Promise<Product> {
    const product = await this.products.findById(companyId, id);
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  create(companyId: string, dto: CreateProductDto): Promise<Product> {
    return this.products.create({
      companyId,
      name: dto.name,
      details: dto.details ?? '',
      sellingPrice: dto.sellingPrice,
      buyingPrice: dto.buyingPrice,
      imageUrl: dto.imageUrl ?? null,
    });
  }

  async update(companyId: string, id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.products.update(companyId, id, {
      name: dto.name,
      details: dto.details,
      sellingPrice: dto.sellingPrice,
      buyingPrice: dto.buyingPrice,
      imageUrl: dto.imageUrl,
    });
    if (!updated) throw new NotFoundException('Product not found.');
    return updated;
  }

  async remove(companyId: string, id: string): Promise<void> {
    const deleted = await this.products.delete(companyId, id);
    if (!deleted) throw new NotFoundException('Product not found.');
  }

  async uploadImage(
    companyId: string,
    id: string,
    file: { buffer: Buffer; mimetype: string; originalname: string; size: number } | undefined,
  ): Promise<Product> {
    if (!file) throw new BadRequestException('An image file is required.');
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Image must be JPEG, PNG, WebP or GIF.');
    }
    if (file.size > MAX_BYTES) throw new BadRequestException('Image must be 2 MB or smaller.');

    const product = await this.get(companyId, id);
    const extension = this.extensionFor(file.mimetype);
    const path = `${companyId}/${product.id}.${extension}`;

    const { error } = await this.supabase.admin.storage.from(BUCKET).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

    if (error) {
      this.logger.error(`Failed to upload product image: ${error.message}`);
      throw new BadRequestException('Could not store the image. Please try again.');
    }

    const { data } = this.supabase.admin.storage.from(BUCKET).getPublicUrl(path);
    return this.update(companyId, id, { imageUrl: `${data.publicUrl}?v=${Date.now()}` });
  }

  private extensionFor(mime: string): string {
    if (mime === 'image/png') return 'png';
    if (mime === 'image/webp') return 'webp';
    if (mime === 'image/gif') return 'gif';
    return 'jpg';
  }
}
