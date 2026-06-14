import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmWarehouseDto, UpdateCrmWarehouseDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Warehouses')
@Controller('crm/warehouses')
export class CrmWarehouseController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  create(@Body() createCrmWarehouseDto: CreateCrmWarehouseDto) {
    return this.crmService.createWarehouse(createCrmWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  findAll() {
    return this.crmService.findAllWarehouses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneWarehouse(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  update(@Param('id') id: string, @Body() updateCrmWarehouseDto: UpdateCrmWarehouseDto) {
    return this.crmService.updateWarehouse(id, updateCrmWarehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  remove(@Param('id') id: string) {
    return this.crmService.removeWarehouse(id);
  }
}
