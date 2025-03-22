import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateLeaseDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  securityDepositAmount: number;

  @IsString()
  @IsOptional()
  securityDepositCurrency?: string;
} 