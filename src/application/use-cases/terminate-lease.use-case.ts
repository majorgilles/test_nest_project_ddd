import { Injectable } from '@nestjs/common';
import { LeaseRepository } from '../../domain/ports/lease-repository.port';

export class TerminateLeaseDto {
  leaseId: string;
  terminationDate: Date;
  reason: string;
}

@Injectable()
export class TerminateLeaseUseCase {
  constructor(
    private readonly leaseRepository: LeaseRepository,
  ) {}

  async execute(dto: TerminateLeaseDto): Promise<void> {
    const lease = await this.leaseRepository.findById(dto.leaseId);
    if (!lease) {
      throw new Error('Lease not found');
    }

    lease.terminate(new Date(dto.terminationDate));
    await this.leaseRepository.save(lease);
  }
} 