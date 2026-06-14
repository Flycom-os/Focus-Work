import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmShipmentDto, UpdateCrmShipmentDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Shipments')
@Controller('crm/shipments')
export class CrmShipmentController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  create(@Body() createCrmShipmentDto: CreateCrmShipmentDto) {
    return this.crmService.createShipment(createCrmShipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipments' })
  findAll() {
    return this.crmService.findAllShipments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shipment by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneShipment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipment' })
  update(@Param('id') id: string, @Body() updateCrmShipmentDto: UpdateCrmShipmentDto) {
    return this.crmService.updateShipment(id, updateCrmShipmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment' })
  remove(@Param('id') id: string) {
    return this.crmService.removeShipment(id);
  }
}
