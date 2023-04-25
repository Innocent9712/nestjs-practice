import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthSignInDto } from '../dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
    ) {}

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

    return {jwt_access_token: await this.signToken(user.id, user.email)}
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

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
        sub: userId,
        email,
    }

    const options = {
        expiresIn: '30m',
        secret: this.config.get('JWT_SECRET'),
    }

    return this.jwt.signAsync(payload, options)
  }
}
