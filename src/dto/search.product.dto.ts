import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SearchProductDto {
  @ApiProperty()
  search: string;

  @ApiProperty()
  @IsNumber({}, { each: true })
  providersIds: number[];
}
