import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmContactDto, UpdateCrmContactDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Contacts')
@Controller('crm/contacts')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  create(@Body() createCrmContactDto: CreateCrmContactDto) {
    return this.crmService.createContact(createCrmContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  findAll() {
    return this.crmService.findAllContacts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneContact(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  update(@Param('id') id: string, @Body() updateCrmContactDto: UpdateCrmContactDto) {
    return this.crmService.updateContact(id, updateCrmContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  remove(@Param('id') id: string) {
    return this.crmService.removeContact(id);
  }
}
