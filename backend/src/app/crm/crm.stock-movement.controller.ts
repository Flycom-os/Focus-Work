import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmStockMovementDto, UpdateCrmStockMovementDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Stock Movements')
@Controller('crm/stock-movements')
export class CrmStockMovementController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock movement' })
  create(@Body() createCrmStockMovementDto: CreateCrmStockMovementDto) {
    return this.crmService.createStockMovement(createCrmStockMovementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock movements' })
  findAll() {
    return this.crmService.findAllStockMovements();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock movement by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneStockMovement(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock movement' })
  update(@Param('id') id: string, @Body() updateCrmStockMovementDto: UpdateCrmStockMovementDto) {
    return this.crmService.updateStockMovement(id, updateCrmStockMovementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock movement' })
  remove(@Param('id') id: string) {
    return this.crmService.removeStockMovement(id);
  }
}
