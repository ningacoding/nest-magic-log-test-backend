import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RoleEnum } from '../constants/role.enum';
import { Roles } from '../decorators/role.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { SearchProductDto } from '../dto/search.product.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(req.user.id, createProductDto);
  }

  @Post('/search')
  search(@Body() searchProductDto: SearchProductDto, @Request() req) {
    return this.productsService.search(
      req.user.id,
      req.user.roleId,
      searchProductDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.productsService.findAll(req.user.id, req.user.roleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
