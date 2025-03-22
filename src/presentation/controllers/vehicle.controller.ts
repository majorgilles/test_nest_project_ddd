import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddVehicleUseCase } from '../../application/use-cases/add-vehicle.use-case';
import { FindAvailableVehiclesUseCase } from '../../application/use-cases/find-available-vehicles.use-case';
import { AddVehicleDto } from '../dtos/add-vehicle.dto';
import { VehicleResponseDto } from '../dtos/vehicle-response.dto';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';

@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly addVehicleUseCase: AddVehicleUseCase,
    private readonly findAvailableVehiclesUseCase: FindAvailableVehiclesUseCase,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  @Post()
  async addVehicle(@Body() addVehicleDto: AddVehicleDto): Promise<{ vehicleId: string }> {
    const vehicleId = await this.addVehicleUseCase.execute(addVehicleDto);
    return { vehicleId };
  }

  @Get('available')
  async getAvailableVehicles(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.findAvailableVehiclesUseCase.execute();
    
    return vehicles.map(vehicle => ({
      id: vehicle.getId(),
      vin: vehicle.getVin().getValue(),
      make: vehicle.getMake(),
      model: vehicle.getModel(),
      year: vehicle.getYear(),
      monthlyLeaseRate: {
        amount: vehicle.getMonthlyLeaseRate().getAmount(),
        currency: vehicle.getMonthlyLeaseRate().getCurrency(),
      },
      status: vehicle.getStatus(),
    }));
  }

  @Get(':id')
  async getVehicle(@Param('id') id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return {
      id: vehicle.getId(),
      vin: vehicle.getVin().getValue(),
      make: vehicle.getMake(),
      model: vehicle.getModel(),
      year: vehicle.getYear(),
      monthlyLeaseRate: {
        amount: vehicle.getMonthlyLeaseRate().getAmount(),
        currency: vehicle.getMonthlyLeaseRate().getCurrency(),
      },
      status: vehicle.getStatus(),
    };
  }
} 