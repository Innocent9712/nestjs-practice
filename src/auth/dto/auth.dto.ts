import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class AuthDto extends AuthSignInDto {
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
}

