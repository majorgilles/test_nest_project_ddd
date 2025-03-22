import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentResult } from '../../domain/ports/payment-gateway.port';
import { Money } from '../../domain/value-objects/money.value-object';

@Injectable()
export class StripePaymentGatewayAdapter implements PaymentGateway {
  constructor(private readonly configService: ConfigService) {}

  async processPayment(
    customerId: string,
    amount: Money,
    description: string,
  ): Promise<PaymentResult> {
    // In a real implementation, this would call the Stripe API
    // For now, we'll simulate a payment process
    console.log(`Processing payment of ${amount.getAmount()} ${amount.getCurrency()} for customer ${customerId}`);
    console.log(`Description: ${description}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate successful payment most of the time
    const isSuccessful = Math.random() > 0.1;
    
    if (isSuccessful) {
      return {
        success: true,
        transactionId: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      };
    } else {
      return {
        success: false,
        errorMessage: 'Payment failed: insufficient funds',
      };
    }
  }
} 