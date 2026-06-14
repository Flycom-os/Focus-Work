import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmOrderDto, UpdateCrmOrderDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Orders')
@Controller('crm/orders')
export class CrmOrderController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() createCrmOrderDto: CreateCrmOrderDto) {
    return this.crmService.createOrder(createCrmOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  findAll() {
    return this.crmService.findAllOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneOrder(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  update(@Param('id') id: string, @Body() updateCrmOrderDto: UpdateCrmOrderDto) {
    return this.crmService.updateOrder(id, updateCrmOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  remove(@Param('id') id: string) {
    return this.crmService.removeOrder(id);
  }
}
