import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ItemSnapshotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ type: [ItemSnapshotDto] })
  @IsArray()
  itemsSnapshot: ItemSnapshotDto[];
}
