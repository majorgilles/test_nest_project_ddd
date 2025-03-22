import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditCheckService } from '../../domain/ports/credit-check-service.port';

@Injectable()
export class ExperianCreditCheckAdapter implements CreditCheckService {
  constructor(private readonly configService: ConfigService) {}

  async checkCreditScore(customerId: string): Promise<number> {
    // In a real implementation, this would call the Experian API
    // For now, we'll simulate a credit check with a random score
    console.log(`Checking credit score for customer ${customerId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a random credit score between 300 and 850
    return Math.floor(Math.random() * (850 - 300 + 1)) + 300;
  }
} 