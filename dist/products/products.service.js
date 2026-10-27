"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const products_repository_1 = require("./products.repository");
const BUCKET = 'product-images';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 2 * 1024 * 1024;
let ProductsService = ProductsService_1 = class ProductsService {
    products;
    supabase;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(products, supabase) {
        this.products = products;
        this.supabase = supabase;
    }
    list(companyId) {
        return this.products.list(companyId);
    }
    async get(companyId, id) {
        const product = await this.products.findById(companyId, id);
        if (!product)
            throw new common_1.NotFoundException('Product not found.');
        return product;
    }
    create(companyId, dto) {
        return this.products.create({
            companyId,
            name: dto.name,
            details: dto.details ?? '',
            sellingPrice: dto.sellingPrice,
            buyingPrice: dto.buyingPrice,
            imageUrl: dto.imageUrl ?? null,
        });
    }
    async update(companyId, id, dto) {
        const updated = await this.products.update(companyId, id, {
            name: dto.name,
            details: dto.details,
            sellingPrice: dto.sellingPrice,
            buyingPrice: dto.buyingPrice,
            imageUrl: dto.imageUrl,
        });
        if (!updated)
            throw new common_1.NotFoundException('Product not found.');
        return updated;
    }
    async remove(companyId, id) {
        const deleted = await this.products.delete(companyId, id);
        if (!deleted)
            throw new common_1.NotFoundException('Product not found.');
    }
    async uploadImage(companyId, id, file) {
        if (!file)
            throw new common_1.BadRequestException('An image file is required.');
        if (!ALLOWED_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException('Image must be JPEG, PNG, WebP or GIF.');
        }
        if (file.size > MAX_BYTES)
            throw new common_1.BadRequestException('Image must be 2 MB or smaller.');
        const product = await this.get(companyId, id);
        const extension = this.extensionFor(file.mimetype);
        const path = `${companyId}/${product.id}.${extension}`;
        const { error } = await this.supabase.admin.storage.from(BUCKET).upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });
        if (error) {
            this.logger.error(`Failed to upload product image: ${error.message}`);
            throw new common_1.BadRequestException('Could not store the image. Please try again.');
        }
        const { data } = this.supabase.admin.storage.from(BUCKET).getPublicUrl(path);
        return this.update(companyId, id, { imageUrl: `${data.publicUrl}?v=${Date.now()}` });
    }
    extensionFor(mime) {
        if (mime === 'image/png')
            return 'png';
        if (mime === 'image/webp')
            return 'webp';
        if (mime === 'image/gif')
            return 'gif';
        return 'jpg';
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository,
        supabase_service_1.SupabaseService])
], ProductsService);
//# sourceMappingURL=products.service.js.map