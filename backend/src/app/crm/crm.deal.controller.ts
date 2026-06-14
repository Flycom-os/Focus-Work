import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmDealDto, UpdateCrmDealDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Deals')
@Controller('crm/deals')
export class CrmDealController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  create(@Body() createCrmDealDto: CreateCrmDealDto) {
    return this.crmService.createDeal(createCrmDealDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  findAll() {
    return this.crmService.findAllDeals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a deal by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneDeal(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a deal' })
  update(@Param('id') id: string, @Body() updateCrmDealDto: UpdateCrmDealDto) {
    return this.crmService.updateDeal(id, updateCrmDealDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deal' })
  remove(@Param('id') id: string) {
    return this.crmService.removeDeal(id);
  }
}
