import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
// import { JwtStrategy } from 'src/auth/strategy';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Body() dto: any, @Req() req: Request) {
        // console.log(dto, req)
        // tried implementing user service, but i could not access the req.user props.
        // So i implemented the mod I wanted in the authguard instead and just returned the req.user
        return req.user
    }
}
