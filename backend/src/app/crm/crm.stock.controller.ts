import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmStockDto, UpdateCrmStockDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Stocks')
@Controller('crm/stocks')
export class CrmStockController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock entry' })
  create(@Body() createCrmStockDto: CreateCrmStockDto) {
    return this.crmService.createStock(createCrmStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock entries' })
  findAll() {
    return this.crmService.findAllStocks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock entry by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneStock(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock entry' })
  update(@Param('id') id: string, @Body() updateCrmStockDto: UpdateCrmStockDto) {
    return this.crmService.updateStock(id, updateCrmStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock entry' })
  remove(@Param('id') id: string) {
    return this.crmService.removeStock(id);
  }
}
