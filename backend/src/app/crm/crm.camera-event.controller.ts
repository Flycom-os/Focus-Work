import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmCameraEventDto, UpdateCrmCameraEventDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Camera Events')
@Controller('crm/camera-events')
export class CrmCameraEventController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new camera event' })
  create(@Body() createCrmCameraEventDto: CreateCrmCameraEventDto) {
    return this.crmService.createCameraEvent(createCrmCameraEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all camera events' })
  findAll() {
    return this.crmService.findAllCameraEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a camera event by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneCameraEvent(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a camera event' })
  update(@Param('id') id: string, @Body() updateCrmCameraEventDto: UpdateCrmCameraEventDto) {
    return this.crmService.updateCameraEvent(id, updateCrmCameraEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a camera event' })
  remove(@Param('id') id: string) {
    return this.crmService.removeCameraEvent(id);
  }
}
