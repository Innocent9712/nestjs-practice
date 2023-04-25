import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from 'src/dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getMe(userId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    bookmarks: {
                        select: {
                            id: true,
                            title: true,
                            url: true,
                            description: true,
                        }
                    }
                }
            });

            return user
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async editUser(userId: number, dto: EditUserDto) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: dto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        })// return the updated user
            
    }
}
