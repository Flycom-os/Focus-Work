import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, IsEnum, IsJSON } from 'class-validator';
import { CrmStockMovementType, CrmDealStatus, CrmCameraEventType } from '@prisma/client';

export class CreateCrmContactDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyId?: string;
}

export class UpdateCrmContactDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyId?: string;
}

export class CreateCrmWarehouseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateCrmWarehouseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateCrmProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class UpdateCrmProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}

export class CreateCrmStockDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  warehouseId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UpdateCrmStockDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  warehouseId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class CreateCrmStockMovementDto {
  @ApiProperty({ enum: CrmStockMovementType })
  @IsEnum(CrmStockMovementType)
  type: CrmStockMovementType;

  @ApiProperty()
  @IsString()
  stockId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UpdateCrmStockMovementDto {
  @ApiProperty({ required: false, enum: CrmStockMovementType })
  @IsEnum(CrmStockMovementType)
  @IsOptional()
  type?: CrmStockMovementType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  stockId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

export class CreateCrmDealDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CrmDealStatus })
  @IsEnum(CrmDealStatus)
  status: CrmDealStatus;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiProperty()
  @IsString()
  ownerId: string;
}

export class UpdateCrmDealDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, enum: CrmDealStatus })
  @IsEnum(CrmDealStatus)
  @IsOptional()
  status?: CrmDealStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ownerId?: string;
}

export class CreateCrmCameraDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  rtspUrl: string;
}

export class UpdateCrmCameraDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rtspUrl?: string;
}

export class CreateCrmCameraEventDto {
  @ApiProperty()
  @IsString()
  cameraId: string;

  @ApiProperty({ enum: CrmCameraEventType })
  @IsEnum(CrmCameraEventType)
  type: CrmCameraEventType;

  @ApiProperty()
  @IsString()
  timestamp: string; // Use string for ISO date time

  @ApiProperty({ required: false })
  @IsJSON()
  @IsOptional()
  data?: string; // JSON string
}

export class UpdateCrmCameraEventDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cameraId?: string;

  @ApiProperty({ required: false, enum: CrmCameraEventType })
  @IsEnum(CrmCameraEventType)
  @IsOptional()
  type?: CrmCameraEventType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({ required: false })
  @IsJSON()
  @IsOptional()
  data?: string;
}

export class CreateCrmOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dealId?: string;
}

export class UpdateCrmOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dealId?: string;
}

export class CreateCrmShipmentDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}

export class UpdateCrmShipmentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  orderId?: string;
}
