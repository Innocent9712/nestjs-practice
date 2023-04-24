import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
// import { JwtStrategy } from 'src/auth/strategy';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @Get('me')
    getMe( @GetUser() user: User) {
        // It works here, don't know why.
        console.log(user.id)
        return user
    }
}
