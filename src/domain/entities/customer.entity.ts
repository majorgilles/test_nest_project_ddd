export class Customer {
  constructor(
    private readonly id: string,
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly email: string,
    private readonly phoneNumber: string,
    private readonly creditScore: number,
  ) {}

  getId(): string {
    return this.id;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  getCreditScore(): number {
    return this.creditScore;
  }

  isEligibleForLeasing(): boolean {
    // Simple business rule: credit score must be above 650 for leasing
    return this.creditScore >= 650;
  }
} 