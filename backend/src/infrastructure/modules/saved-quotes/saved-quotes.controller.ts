import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SavedQuotesService } from './saved-quotes.service';
import { CreateSavedQuoteDto } from './saved-quotes.dto';

@ApiTags('saved-quotes')
@Controller('saved-quotes')
export class SavedQuotesController {
  constructor(private readonly svc: SavedQuotesService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Guardar una cotización (sin datos del cliente)' })
  create(@Body() dto: CreateSavedQuoteDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cotizaciones guardadas' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cotización por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const quote = await this.svc.findOne(id);
    if (!quote) throw new NotFoundException(`Cotización ${id} no encontrada`);
    return quote;
  }
}
