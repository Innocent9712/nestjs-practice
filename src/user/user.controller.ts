import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
// import { JwtStrategy } from 'src/auth/strategy';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe( @GetUser("id") userId: number) {
        return this.userService.getMe(userId)
    }
}
