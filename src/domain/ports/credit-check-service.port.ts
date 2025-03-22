export interface CreditCheckService {
  checkCreditScore(customerId: string): Promise<number>;
} 