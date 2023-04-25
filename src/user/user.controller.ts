import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from '../dto';
// import { JwtStrategy } from 'src/auth/strategy';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    
    @Get('me')
    getMe( @GetUser("id") userId: number) {
        return this.userService.getMe(userId)
    }

    @Patch(':id')
    editUser(@Param('id') id: string, @Body() dto: EditUserDto) {
        console.log(id, dto)
        // return "Hello"
        return this.userService.editUser(parseInt(id, 10), dto)
    }
}
