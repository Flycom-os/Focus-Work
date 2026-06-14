import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateCrmContactDto, UpdateCrmContactDto, CreateCrmWarehouseDto, UpdateCrmWarehouseDto, CreateCrmProductDto, UpdateCrmProductDto, CreateCrmStockDto, UpdateCrmStockDto, CreateCrmStockMovementDto, UpdateCrmStockMovementDto, CreateCrmDealDto, UpdateCrmDealDto, CreateCrmCameraDto, UpdateCrmCameraDto, CreateCrmCameraEventDto, UpdateCrmCameraEventDto, CreateCrmOrderDto, UpdateCrmOrderDto, CreateCrmShipmentDto, UpdateCrmShipmentDto } from '../../dto/crm.dto';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async createContact(data: CreateCrmContactDto) {
    return this.prisma.crmContact.create({ data });
  }

  async findAllContacts() {
    return this.prisma.crmContact.findMany();
  }

  async findOneContact(id: string) {
    return this.prisma.crmContact.findUnique({ where: { id } });
  }

  async updateContact(id: string, data: UpdateCrmContactDto) {
    return this.prisma.crmContact.update({ where: { id }, data });
  }

  async removeContact(id: string) {
    return this.prisma.crmContact.delete({ where: { id } });
  }

  async createWarehouse(data: CreateCrmWarehouseDto) {
    return this.prisma.crmWarehouse.create({ data });
  }

  async findAllWarehouses() {
    return this.prisma.crmWarehouse.findMany();
  }

  async findOneWarehouse(id: string) {
    return this.prisma.crmWarehouse.findUnique({ where: { id } });
  }

  async updateWarehouse(id: string, data: UpdateCrmWarehouseDto) {
    return this.prisma.crmWarehouse.update({ where: { id }, data });
  }

  async removeWarehouse(id: string) {
    return this.prisma.crmWarehouse.delete({ where: { id } });
  }

  async createProduct(data: CreateCrmProductDto) {
    return this.prisma.crmProduct.create({ data });
  }

  async findAllProducts() {
    return this.prisma.crmProduct.findMany();
  }

  async findOneProduct(id: string) {
    return this.prisma.crmProduct.findUnique({ where: { id } });
  }

  async updateProduct(id: string, data: UpdateCrmProductDto) {
    return this.prisma.crmProduct.update({ where: { id }, data });
  }

  async removeProduct(id: string) {
    return this.prisma.crmProduct.delete({ where: { id } });
  }

  async createStock(data: CreateCrmStockDto) {
    return this.prisma.crmStock.create({ data });
  }

  async findAllStocks() {
    return this.prisma.crmStock.findMany();
  }

  async findOneStock(id: string) {
    return this.prisma.crmStock.findUnique({ where: { id } });
  }

  async updateStock(id: string, data: UpdateCrmStockDto) {
    return this.prisma.crmStock.update({ where: { id }, data });
  }

  async removeStock(id: string) {
    return this.prisma.crmStock.delete({ where: { id } });
  }

  async createStockMovement(data: CreateCrmStockMovementDto) {
    return this.prisma.crmStockMovement.create({ data });
  }

  async findAllStockMovements() {
    return this.prisma.crmStockMovement.findMany();
  }

  async findOneStockMovement(id: string) {
    return this.prisma.crmStockMovement.findUnique({ where: { id } });
  }

  async updateStockMovement(id: string, data: UpdateCrmStockMovementDto) {
    return this.prisma.crmStockMovement.update({ where: { id }, data });
  }

  async removeStockMovement(id: string) {
    return this.prisma.crmStockMovement.delete({ where: { id } });
  }

  async createDeal(data: CreateCrmDealDto) {
    return this.prisma.crmDeal.create({ data });
  }

  async findAllDeals() {
    return this.prisma.crmDeal.findMany();
  }

  async findOneDeal(id: string) {
    return this.prisma.crmDeal.findUnique({ where: { id } });
  }

  async updateDeal(id: string, data: UpdateCrmDealDto) {
    return this.prisma.crmDeal.update({ where: { id }, data });
  }

  async removeDeal(id: string) {
    return this.prisma.crmDeal.delete({ where: { id } });
  }

  async createCamera(data: CreateCrmCameraDto) {
    return this.prisma.crmCamera.create({ data });
  }

  async findAllCameras() {
    return this.prisma.crmCamera.findMany();
  }

  async findOneCamera(id: string) {
    return this.prisma.crmCamera.findUnique({ where: { id } });
  }

  async updateCamera(id: string, data: UpdateCrmCameraDto) {
    return this.prisma.crmCamera.update({ where: { id }, data });
  }

  async removeCamera(id: string) {
    return this.prisma.crmCamera.delete({ where: { id } });
  }

  async createCameraEvent(data: CreateCrmCameraEventDto) {
    return this.prisma.crmCameraEvent.create({ data });
  }

  async findAllCameraEvents() {
    return this.prisma.crmCameraEvent.findMany();
  }

  async findOneCameraEvent(id: string) {
    return this.prisma.crmCameraEvent.findUnique({ where: { id } });
  }

  async updateCameraEvent(id: string, data: UpdateCrmCameraEventDto) {
    return this.prisma.crmCameraEvent.update({ where: { id }, data });
  }

  async removeCameraEvent(id: string) {
    return this.prisma.crmCameraEvent.delete({ where: { id } });
  }

  async createOrder(data: CreateCrmOrderDto) {
    return this.prisma.crmOrder.create({ data });
  }

  async findAllOrders() {
    return this.prisma.crmOrder.findMany();
  }

  async findOneOrder(id: string) {
    return this.prisma.crmOrder.findUnique({ where: { id } });
  }

  async updateOrder(id: string, data: UpdateCrmOrderDto) {
    return this.prisma.crmOrder.update({ where: { id }, data });
  }

  async removeOrder(id: string) {
    return this.prisma.crmOrder.delete({ where: { id } });
  }

  async createShipment(data: CreateCrmShipmentDto) {
    return this.prisma.crmShipment.create({ data });
  }

  async findAllShipments() {
    return this.prisma.crmShipment.findMany();
  }

  async findOneShipment(id: string) {
    return this.prisma.crmShipment.findUnique({ where: { id } });
  }

  async updateShipment(id: string, data: UpdateCrmShipmentDto) {
    return this.prisma.crmShipment.update({ where: { id }, data });
  }

  async removeShipment(id: string) {
    return this.prisma.crmShipment.delete({ where: { id } });
  }
}
