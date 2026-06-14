import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { YtCustomFieldService } from './yt-custom-field.service';
import { CreateYtCustomFieldDto, UpdateYtCustomFieldDto, SetCustomFieldValueDto } from '../../dto/yt-custom-field.dto';

@Controller('yt-tracker/custom-fields')
export class YtCustomFieldController {
    constructor(private readonly customFieldService: YtCustomFieldService) {}

    @Post()
    create(@Body() dto: CreateYtCustomFieldDto) {
        return this.customFieldService.createCustomField(dto);
    }

    @Get('/project/:projectId')
    getForProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.customFieldService.getCustomFieldsForProject(projectId);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateYtCustomFieldDto) {
        return this.customFieldService.updateCustomField(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.customFieldService.deleteCustomField(id);
    }

    @Post('/values')
    setValue(@Body() dto: SetCustomFieldValueDto) {
        return this.customFieldService.setCustomFieldValue(dto);
    }
}
