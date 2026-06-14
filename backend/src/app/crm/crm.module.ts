import { Module } from '@nestjs/common';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CrmWarehouseController } from './crm.warehouse.controller';
import { CrmProductController } from './crm.product.controller';
import { CrmStockController } from './crm.stock.controller';
import { CrmStockMovementController } from './crm.stock-movement.controller';
import { CrmDealController } from './crm.deal.controller';
import { CrmCameraController } from './crm.camera.controller';
import { CrmCameraEventController } from './crm.camera-event.controller';
import { CrmOrderController } from './crm.order.controller';
import { CrmShipmentController } from './crm.shipment.controller';

@Module({
  controllers: [CrmController, CrmWarehouseController, CrmProductController, CrmStockController, CrmStockMovementController, CrmDealController, CrmCameraController, CrmCameraEventController, CrmOrderController, CrmShipmentController],
  providers: [CrmService],
})
export class CrmModule {}
