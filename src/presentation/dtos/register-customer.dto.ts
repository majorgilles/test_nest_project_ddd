import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class RegisterCustomerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @Min(300)
  @Max(850)
  creditScore: number;
} 