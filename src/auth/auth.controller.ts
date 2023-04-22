import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto, @Req() req: Request) {
    console.log(dto, req.body);
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn() {}
}