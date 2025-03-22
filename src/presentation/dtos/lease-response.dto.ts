import { CustomerResponseDto } from './customer-response.dto';
import { VehicleResponseDto } from './vehicle-response.dto';
import { MoneyDto } from './vehicle-response.dto';

export class LeaseResponseDto {
  id: string;
  customer: CustomerResponseDto;
  vehicle: VehicleResponseDto;
  startDate: string;
  endDate: string;
  monthlyPayment: MoneyDto;
  securityDeposit: MoneyDto;
  status: string;
  terminationDate?: string;
} 