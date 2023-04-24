import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
// import { JwtStrategy } from 'src/auth/strategy';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(AuthGuard('jwt-key'))
    @Get('me')
    getMe(@Body() dto: any, @Req() req: Request) {
        console.log(dto, req)
        return req.user
    }
}
