import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { YtCustomField, YtCustomFieldValue } from '@prisma/client';
import { CreateYtCustomFieldDto, UpdateYtCustomFieldDto, SetCustomFieldValueDto } from '../../dto/yt-custom-field.dto';

@Injectable()
export class YtCustomFieldService {
    constructor(private readonly prisma: PrismaService) {}

    async createCustomField(dto: CreateYtCustomFieldDto): Promise<YtCustomField> {
        return this.prisma.ytCustomField.create({
            data: {
                ...dto,
                settings: dto.settings ? JSON.parse(dto.settings) : undefined,
            },
        });
    }

    async getCustomFieldsForProject(projectId: string): Promise<YtCustomField[]> {
        return this.prisma.ytCustomField.findMany({
            where: { projectId },
        });
    }

    async updateCustomField(id: string, dto: UpdateYtCustomFieldDto): Promise<YtCustomField> {
        return this.prisma.ytCustomField.update({
            where: { id },
            data: {
                ...dto,
                settings: dto.settings ? JSON.parse(dto.settings) : undefined,
            },
        });
    }

    async deleteCustomField(id: string): Promise<YtCustomField> {
        return this.prisma.ytCustomField.delete({ where: { id } });
    }

    async setCustomFieldValue(dto: SetCustomFieldValueDto): Promise<YtCustomFieldValue> {
        const { issueId, customFieldId, ...valuePayload } = dto;

        const value = {
            stringValue: valuePayload.stringValue,
            integerValue: valuePayload.integerValue,
            floatValue: valuePayload.floatValue,
            datetimeValue: valuePayload.datetimeValue,
            booleanValue: valuePayload.booleanValue,
            jsonValue: valuePayload.jsonValue ? JSON.parse(valuePayload.jsonValue) : undefined,
        }

        return this.prisma.ytCustomFieldValue.upsert({
            where: {
                issueId_customFieldId: {
                    issueId,
                    customFieldId,
                },
            },
            update: value,
            create: {
                issueId,
                customFieldId,
                ...value,
            },
        });
    }
}
