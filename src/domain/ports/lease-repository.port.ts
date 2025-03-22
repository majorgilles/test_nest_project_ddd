import { Lease } from '../aggregates/lease.aggregate';

export interface LeaseRepository {
  findById(id: string): Promise<Lease | null>;
  findByCustomerId(customerId: string): Promise<Lease[]>;
  findByVehicleId(vehicleId: string): Promise<Lease[]>;
  findActiveLeases(): Promise<Lease[]>;
  save(lease: Lease): Promise<void>;
} 