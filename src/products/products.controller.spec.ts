import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from '../dababase/database.module';
import { CreateProductDto } from '../dto/create-product.dto';
import { v4 as uuidv4 } from 'uuid';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should create a new product', async () => {
    const newProductDto = new CreateProductDto();
    newProductDto.name = 'Product test';
    newProductDto.sku = `SKU-${uuidv4()}`;
    newProductDto.price = +Math.round(Math.random() * 100).toFixed(2);
    const result = await productsService.create(1, newProductDto);
    expect(result).toBeDefined();
  });
});
