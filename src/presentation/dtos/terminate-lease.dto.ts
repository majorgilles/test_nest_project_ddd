import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class TerminateLeaseDto {
  @IsDateString()
  @IsNotEmpty()
  terminationDate: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
} 