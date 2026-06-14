import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmProductDto, UpdateCrmProductDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Products')
@Controller('crm/products')
export class CrmProductController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() createCrmProductDto: CreateCrmProductDto) {
    return this.crmService.createProduct(createCrmProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.crmService.findAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneProduct(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() updateCrmProductDto: UpdateCrmProductDto) {
    return this.crmService.updateProduct(id, updateCrmProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id') id: string) {
    return this.crmService.removeProduct(id);
  }
}
