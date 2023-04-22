import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AuthSignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: AuthSignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
        throw new ForbiddenException('Invalid credentials');
    }

    const passwordValid = await argon.verify(user.hashPassword, dto.password);

    if (!passwordValid) {
        throw new ForbiddenException('Invalid credentials');
    }
    const {hashPassword, ...rest} = user;
    return rest;
  }

  async signUp(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

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
        if (err.code === 'P2002' && err.meta.target.includes('email')) {
            throw new ForbiddenException('Email already exists');
        }

        throw new InternalServerErrorException();
    }

  }
}
