import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateLeaseUseCase } from '../../application/use-cases/create-lease.use-case';
import { TerminateLeaseUseCase } from '../../application/use-cases/terminate-lease.use-case';
import { CreateLeaseDto } from '../dtos/create-lease.dto';
import { TerminateLeaseDto } from '../dtos/terminate-lease.dto';
import { LeaseRepository } from '../../domain/ports/lease-repository.port';
import { LeaseResponseDto } from '../dtos/lease-response.dto';

@Controller('leases')
export class LeaseController {
  constructor(
    private readonly createLeaseUseCase: CreateLeaseUseCase,
    private readonly terminateLeaseUseCase: TerminateLeaseUseCase,
    private readonly leaseRepository: LeaseRepository,
  ) {}

  @Post()
  async createLease(@Body() createLeaseDto: CreateLeaseDto): Promise<{ leaseId: string }> {
    const leaseId = await this.createLeaseUseCase.execute(createLeaseDto);
    return { leaseId };
  }

  @Put(':id/terminate')
  async terminateLease(
    @Param('id') id: string,
    @Body() terminateLeaseDto: TerminateLeaseDto,
  ): Promise<void> {
    await this.terminateLeaseUseCase.execute({
      leaseId: id,
      terminationDate: new Date(terminateLeaseDto.terminationDate),
      reason: terminateLeaseDto.reason,
    });
  }

  @Get(':id')
  async getLease(@Param('id') id: string): Promise<LeaseResponseDto> {
    const lease = await this.leaseRepository.findById(id);
    if (!lease) {
      throw new Error('Lease not found');
    }

    return {
      id: lease.getId(),
      customer: {
        id: lease.getCustomer().getId(),
        firstName: lease.getCustomer().getFirstName(),
        lastName: lease.getCustomer().getLastName(),
        email: lease.getCustomer().getEmail(),
        phoneNumber: lease.getCustomer().getPhoneNumber(),
        isEligibleForLeasing: lease.getCustomer().isEligibleForLeasing(),
      },
      vehicle: {
        id: lease.getVehicle().getId(),
        vin: lease.getVehicle().getVin().getValue(),
        make: lease.getVehicle().getMake(),
        model: lease.getVehicle().getModel(),
        year: lease.getVehicle().getYear(),
        monthlyLeaseRate: {
          amount: lease.getVehicle().getPrice().getAmount(),
          currency: lease.getVehicle().getPrice().getCurrency(),
        },
        status: lease.getVehicle().getStatus(),
      },
      startDate: lease.getStartDate().toISOString(),
      endDate: lease.getEndDate().toISOString(),
      monthlyPayment: {
        amount: lease.getMonthlyPayment().getAmount(),
        currency: lease.getMonthlyPayment().getCurrency(),
      },
      securityDeposit: {
        amount: lease.getSecurityDeposit().getAmount(),
        currency: lease.getSecurityDeposit().getCurrency(),
      },
      status: lease.getStatus(),
      terminationDate: lease.getTerminationDate()?.toISOString(),
    };
  }

  @Get()
  async getActiveLeases(): Promise<LeaseResponseDto[]> {
    const leases = await this.leaseRepository.findActiveLeases();
    
    return leases.map(lease => ({
      id: lease.getId(),
      customer: {
        id: lease.getCustomer().getId(),
        firstName: lease.getCustomer().getFirstName(),
        lastName: lease.getCustomer().getLastName(),
        email: lease.getCustomer().getEmail(),
        phoneNumber: lease.getCustomer().getPhoneNumber(),
        isEligibleForLeasing: lease.getCustomer().isEligibleForLeasing(),
      },
      vehicle: {
        id: lease.getVehicle().getId(),
        vin: lease.getVehicle().getVin().getValue(),
        make: lease.getVehicle().getMake(),
        model: lease.getVehicle().getModel(),
        year: lease.getVehicle().getYear(),
        monthlyLeaseRate: {
          amount: lease.getVehicle().getPrice().getAmount(),
          currency: lease.getVehicle().getPrice().getCurrency(),
        },
        status: lease.getVehicle().getStatus(),
      },
      startDate: lease.getStartDate().toISOString(),
      endDate: lease.getEndDate().toISOString(),
      monthlyPayment: {
        amount: lease.getMonthlyPayment().getAmount(),
        currency: lease.getMonthlyPayment().getCurrency(),
      },
      securityDeposit: {
        amount: lease.getSecurityDeposit().getAmount(),
        currency: lease.getSecurityDeposit().getCurrency(),
      },
      status: lease.getStatus(),
      terminationDate: lease.getTerminationDate()?.toISOString(),
    }));
  }
} 