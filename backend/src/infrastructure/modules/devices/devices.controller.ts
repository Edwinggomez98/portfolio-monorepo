import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly svc: DevicesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar dispositivos (full-text + filtros)' })
  @ApiQuery({ name: 'q',      required: false, description: 'Texto libre (marca o modelo)' })
  @ApiQuery({ name: 'type',   required: false, description: 'smartphone | tablet | laptop | smartwatch' })
  @ApiQuery({ name: 'brand',  required: false })
  @ApiQuery({ name: 'year',   required: false })
  @ApiQuery({ name: 'limit',  required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async search(
    @Query('q')      q?: string,
    @Query('type')   type?: string,
    @Query('brand')  brand?: string,
    @Query('year')   year?: string,
    @Query('limit',  new DefaultValuePipe(50),  ParseIntPipe) limit  = 50,
    @Query('offset', new DefaultValuePipe(0),   ParseIntPipe) offset = 0,
  ) {
    const { data, total } = await this.svc.search({ q, type, brand, year, limit, offset });
    return { data, total, limit, offset };
  }

  @Get('types')
  @ApiOperation({ summary: 'Lista de tipos de dispositivo disponibles' })
  async getTypes() {
    return this.svc.getTypes();
  }

  @Get('brands')
  @ApiOperation({ summary: 'Lista de marcas disponibles' })
  async getBrands() {
    return this.svc.getBrands();
  }
}
