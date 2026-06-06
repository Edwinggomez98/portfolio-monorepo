import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../guards/public.decorator';
import { DevicesService } from './devices.service';
import { SearchDevicesQueryDto } from './devices.dto';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly svc: DevicesService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar dispositivos (full-text + filtros)' })
  @ApiQuery({ name: 'q',      required: false, description: 'Texto libre (marca o modelo)' })
  @ApiQuery({ name: 'type',   required: false, description: 'smartphone | tablet | laptop | smartwatch' })
  @ApiQuery({ name: 'brand',  required: false })
  @ApiQuery({ name: 'year',   required: false })
  @ApiQuery({ name: 'limit',  required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async search(@Query() query: SearchDevicesQueryDto) {
    const { q, type, brand, year, limit, offset } = query;
    const { data, total } = await this.svc.search({ q, type, brand, year, limit, offset });
    return { data, total, limit, offset };
  }

  @Get('types')
  @ApiOperation({ summary: 'Lista de tipos disponibles (filtrable por marca)' })
  @ApiQuery({ name: 'brand', required: false })
  async getTypes(@Query('brand') brand?: string) {
    return this.svc.getTypes(brand);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Lista de marcas disponibles (filtrable por tipo)' })
  @ApiQuery({ name: 'type', required: false })
  async getBrands(@Query('type') type?: string) {
    return this.svc.getBrands(type);
  }

  @Post('sync')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sincronizar dispositivos desde API externa (dummyjson)' })
  async syncFromExternalApi() {
    return this.svc.syncFromExternalApi();
  }
}
