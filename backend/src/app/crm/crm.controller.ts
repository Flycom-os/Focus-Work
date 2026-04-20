import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../jwt-auth.guard'
import { GetUserId } from '../../user/auth/get-user-id.decorator'
import { CrmService } from './crm.service'
import { UpdateCrmProfileDto, UpdateCrmSystemDto, UpsertCrmCompanyDto, UpsertCrmWarehouseDto } from '../../dto/crm.dto'

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm')
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Профиль текущего пользователя CRM' })
  profile(@GetUserId() userId: string) {
    return this.crm.getProfile(userId)
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль текущего пользователя CRM' })
  updateProfile(@GetUserId() userId: string, @Body() dto: UpdateCrmProfileDto) {
    return this.crm.updateProfile(userId, dto)
  }

  @Get('system')
  @ApiOperation({ summary: 'Получить настройки CRM системы' })
  getSystem() {
    return this.crm.getSystem()
  }

  @Put('system')
  @ApiOperation({ summary: 'Сохранить настройки CRM системы' })
  updateSystem(@Body() dto: UpdateCrmSystemDto) {
    return this.crm.updateSystem(dto)
  }

  @Get('warehouses')
  @ApiOperation({ summary: 'Список складов CRM' })
  warehouses() {
    return this.crm.listWarehouses()
  }

  @Post('warehouses')
  @ApiOperation({ summary: 'Создать склад CRM' })
  createWarehouse(@Body() dto: UpsertCrmWarehouseDto) {
    return this.crm.createWarehouse(dto)
  }

  @Patch('warehouses/:id')
  @ApiOperation({ summary: 'Обновить склад CRM' })
  updateWarehouse(@Param('id') id: string, @Body() dto: UpsertCrmWarehouseDto) {
    return this.crm.updateWarehouse(id, dto)
  }

  @Delete('warehouses/:id')
  @ApiOperation({ summary: 'Удалить склад CRM' })
  removeWarehouse(@Param('id') id: string) {
    return this.crm.removeWarehouse(id)
  }

  @Get('companies')
  @ApiOperation({ summary: 'Список компаний CRM' })
  companies() {
    return this.crm.listCompanies()
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Компания CRM по id' })
  company(@Param('id') id: string) {
    return this.crm.getCompany(id)
  }

  @Post('companies')
  @ApiOperation({ summary: 'Создать компанию CRM' })
  createCompany(@Body() dto: UpsertCrmCompanyDto) {
    return this.crm.createCompany(dto)
  }

  @Patch('companies/:id')
  @ApiOperation({ summary: 'Обновить компанию CRM' })
  updateCompany(@Param('id') id: string, @Body() dto: UpsertCrmCompanyDto) {
    return this.crm.updateCompany(id, dto)
  }
}
