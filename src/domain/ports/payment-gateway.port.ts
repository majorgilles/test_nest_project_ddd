import { Money } from '../value-objects/money.value-object';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

export interface PaymentGateway {
  processPayment(
    customerId: string,
    amount: Money,
    description: string,
  ): Promise<PaymentResult>;
} 