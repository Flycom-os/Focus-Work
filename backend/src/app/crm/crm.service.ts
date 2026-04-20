import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { UpdateCrmProfileDto, UpdateCrmSystemDto, UpsertCrmCompanyDto, UpsertCrmWarehouseDto } from '../../dto/crm.dto'

const DEFAULT_MENU = ['Главная', 'Календарь', 'Склад', 'FBS', 'Центр заявок', 'Клиенты', 'Документы', 'Сотрудники', 'CRM', 'DBS']

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, phone: true, role: true, icon: true },
    })
    if (!user) throw new NotFoundException('Пользователь не найден')
    return user
  }

  async updateProfile(userId: string, dto: UpdateCrmProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.password !== undefined ? { password: dto.password } : {}),
      },
      select: { id: true, email: true, fullName: true, phone: true, role: true, icon: true },
    })
  }

  async listWarehouses() {
    const rows = await this.prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, address: true, description: true, updatedAt: true },
    })
    return rows.map((row) => ({ ...row, comment: row.description ?? '' }))
  }

  async createWarehouse(dto: UpsertCrmWarehouseDto) {
    return this.prisma.branch.create({
      data: {
        name: dto.name?.trim() || 'Новый склад',
        address: dto.address?.trim() || 'Адрес не указан',
        city: 'Не указан',
        description: dto.comment?.trim() || null,
      },
      select: { id: true, name: true, address: true, description: true, updatedAt: true },
    })
  }

  async updateWarehouse(id: string, dto: UpsertCrmWarehouseDto) {
    return this.prisma.branch.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() || 'Новый склад' } : {}),
        ...(dto.address !== undefined ? { address: dto.address.trim() || 'Адрес не указан' } : {}),
        ...(dto.comment !== undefined ? { description: dto.comment.trim() || null } : {}),
      },
      select: { id: true, name: true, address: true, description: true, updatedAt: true },
    })
  }

  async removeWarehouse(id: string) {
    return this.prisma.branch.delete({ where: { id } })
  }

  async listCompanies() {
    const companies = await this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return companies.map((company) => this.mapCompany(company))
  }

  async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } })
    if (!company) throw new NotFoundException('Компания не найдена')
    return this.mapCompany(company)
  }

  async createCompany(dto: UpsertCrmCompanyDto) {
    const payload = this.toCompanyData(dto)
    const company = await this.prisma.company.create({
      data: {
        ...payload,
        name: payload.name || 'Без названия',
      },
    })
    return this.mapCompany(company)
  }

  async updateCompany(id: string, dto: UpsertCrmCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id },
      data: this.toCompanyData(dto),
    })
    return this.mapCompany(company)
  }

  async getSystem() {
    const company = await this.prisma.company.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, settings: true },
    })
    const parsed = this.parseSettings(company?.settings)
    return {
      companyId: company?.id ?? null,
      appName: parsed.appName ?? company?.name ?? 'Full Express',
      appColor: parsed.appColor ?? '#282735',
      notifyAfterDays: parsed.notifyAfterDays ?? 7,
      telegramToken: parsed.telegramToken ?? '',
      autoSendInvoice: parsed.autoSendInvoice ?? 'Генерировать',
      smtpHost: parsed.smtpHost ?? '',
      smtpPort: parsed.smtpPort ?? '',
      imapHost: parsed.imapHost ?? '',
      imapPort: parsed.imapPort ?? '',
      smtpUser: parsed.smtpUser ?? '',
      smtpPassword: parsed.smtpPassword ?? '',
      senderName: parsed.senderName ?? '',
      menu: parsed.menu ?? DEFAULT_MENU,
      menuMap: parsed.menuMap ?? {},
    }
  }

  async updateSystem(dto: UpdateCrmSystemDto) {
    const current = await this.getSystem()
    const merged = {
      ...current,
      ...dto,
      menu: dto.menu ?? current.menu,
      menuMap: dto.menuMap ?? current.menuMap,
    }
    const payload = {
      appName: merged.appName,
      appColor: merged.appColor,
      notifyAfterDays: merged.notifyAfterDays,
      telegramToken: merged.telegramToken,
      autoSendInvoice: merged.autoSendInvoice,
      smtpHost: merged.smtpHost,
      smtpPort: merged.smtpPort,
      imapHost: merged.imapHost,
      imapPort: merged.imapPort,
      smtpUser: merged.smtpUser,
      smtpPassword: merged.smtpPassword,
      senderName: merged.senderName,
      menu: merged.menu,
      menuMap: merged.menuMap,
    }

    if (current.companyId) {
      await this.prisma.company.update({
        where: { id: current.companyId },
        data: { name: merged.appName || 'Full Express', settings: JSON.stringify(payload) },
      })
    } else {
      await this.prisma.company.create({
        data: {
          name: merged.appName || 'Full Express',
          settings: JSON.stringify(payload),
          currency: 'RUB',
          language: 'ru',
        },
      })
    }

    return this.getSystem()
  }

  private mapCompany(company: any) {
    const extra = this.parseSettings(company.settings)
    return {
      id: company.id,
      country: extra.country ?? 'Россия',
      inn: company.inn ?? '',
      currency: company.currency ?? 'RUB',
      organizationType: extra.organizationType ?? '',
      name: company.name ?? '',
      address: company.address ?? '',
      bankName: company.bankName ?? '',
      bankLocation: extra.bankLocation ?? '',
      bankBik: company.bankBik ?? '',
      cardNumber: extra.cardNumber ?? '',
      bankAccount: company.bankAccount ?? '',
      correspondentAccount: extra.correspondentAccount ?? '',
      kpp: company.kpp ?? '',
      accountNumber: extra.accountNumber ?? '',
      actNumber: extra.actNumber ?? '',
      stampUrl: extra.stampUrl ?? '',
      signUrl: extra.signUrl ?? '',
      paymentMessage: extra.paymentMessage ?? '',
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }
  }

  private toCompanyData(dto: UpsertCrmCompanyDto) {
    const settings = {
      country: dto.country,
      organizationType: dto.organizationType,
      bankLocation: dto.bankLocation,
      cardNumber: dto.cardNumber,
      correspondentAccount: dto.correspondentAccount,
      accountNumber: dto.accountNumber,
      actNumber: dto.actNumber,
      stampUrl: dto.stampUrl,
      signUrl: dto.signUrl,
      paymentMessage: dto.paymentMessage,
    }

    return {
      ...(dto.name !== undefined ? { name: dto.name || 'Без названия' } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.inn !== undefined ? { inn: dto.inn } : {}),
      ...(dto.kpp !== undefined ? { kpp: dto.kpp } : {}),
      ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
      ...(dto.bankName !== undefined ? { bankName: dto.bankName } : {}),
      ...(dto.bankAccount !== undefined ? { bankAccount: dto.bankAccount } : {}),
      ...(dto.bankBik !== undefined ? { bankBik: dto.bankBik } : {}),
      settings: JSON.stringify(settings),
    }
  }

  private parseSettings(raw?: string | null) {
    if (!raw) return {}
    try {
      const parsed = JSON.parse(raw)
      return typeof parsed === 'object' && parsed ? parsed : {}
    } catch {
      return {}
    }
  }
}
