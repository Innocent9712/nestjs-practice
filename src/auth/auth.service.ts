import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {}

  async signUp(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    // // Save user
    // if (!await this.prisma.user.findFirst({where: {email: dto.email}})) {
    //     const user = await this.prisma.user.create({
    //       data: {
    //         email: dto.email,
    //         hashPassword: hash
    //       }})
    
    //     // return saved user
    //     return user;
    // }

    // return 'user already exists'
    // Save user

    try {
        const data : any = {
            email: dto.email,
            hashPassword: hash,
        }

        if (dto.firstName) data.firstName = dto.firstName;
        if (dto.lastName) data.lastName = dto.lastName;
        const user = await this.prisma.user.create({data})
    
        // return saved user omitting the password
        const {hashPassword, ...rest} = user;
        return rest;

    } catch (err) {
        throw err;
    }

  }
}
