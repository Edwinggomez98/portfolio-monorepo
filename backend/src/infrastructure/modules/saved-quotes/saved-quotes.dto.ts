import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class ItemSnapshotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateSavedQuoteDto {
  @ApiProperty({ example: 'QT-20240603-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  quoteNumber: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 16 })
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP', 'MXN', 'COP', 'ARS', 'CLP', 'PEN'])
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ type: [ItemSnapshotDto] })
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => ItemSnapshotDto)
  itemsSnapshot: ItemSnapshotDto[];
}
