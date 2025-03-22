export class MoneyDto {
  amount: number;
  currency: string;
}

export class VehicleResponseDto {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  monthlyLeaseRate: MoneyDto;
  status: string;
} 