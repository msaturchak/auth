import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: undefined,
    minNumbers: undefined,
  })
  password: string;
}
