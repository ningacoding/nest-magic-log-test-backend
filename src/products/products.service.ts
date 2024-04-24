import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import Product from '../entities/product.entity';
import { RoleEnum } from '../constants/role.enum';
import { SearchProductDto } from '../dto/search.product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  create(userId: number, createProductDto: CreateProductDto) {
    const createProduct = createProductDto as any;
    createProduct.userId = userId;
    return Product.create(createProduct);
  }

  findAll(userId: number, roleId: number) {
    if (roleId !== RoleEnum.Admin) {
      return Product.findAll({
        where: {
          userId,
        },
      });
    }
    return Product.findAll();
  }

  findOne(id: number) {
    return Product.findByPk(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return Product.update(updateProductDto, {
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return Product.destroy({
      where: {
        id,
      },
    });
  }

  async search(userId: number, searchProductDto: SearchProductDto) {
    const where = {
      [Op.or]: {
        name: {
          [Op.iLike]: `%${searchProductDto.search}%`,
        },
        sku: {
          [Op.iLike]: `%${searchProductDto.search}%`,
        },
      },
    };
    if (searchProductDto.providersIds.length > 0) {
      where['userId'] = searchProductDto.providersIds;
    }
    return Product.findAll({
      where,
    });
  }
}
