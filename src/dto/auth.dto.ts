import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
}
