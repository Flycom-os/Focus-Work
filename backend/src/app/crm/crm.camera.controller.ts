import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateCrmCameraDto, UpdateCrmCameraDto } from '../../dto/crm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('CRM Cameras')
@Controller('crm/cameras')
export class CrmCameraController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new camera' })
  create(@Body() createCrmCameraDto: CreateCrmCameraDto) {
    return this.crmService.createCamera(createCrmCameraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cameras' })
  findAll() {
    return this.crmService.findAllCameras();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a camera by ID' })
  findOne(@Param('id') id: string) {
    return this.crmService.findOneCamera(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a camera' })
  update(@Param('id') id: string, @Body() updateCrmCameraDto: UpdateCrmCameraDto) {
    return this.crmService.updateCamera(id, updateCrmCameraDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a camera' })
  remove(@Param('id') id: string) {
    return this.crmService.removeCamera(id);
  }
}
