import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from '../dto/bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Bookmark } from '@prisma/client';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        return this.prisma.bookmark.create({ data: {...dto, userId} })
    }

    async getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            },
        })
    }

    async getBookmark(userId: number, id: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!bookmark) {
            // throw new InternalServerErrorException();
            return {}
        }
        return {...bookmark };
    }

    async editBookmark(userId: number, id: number, dto: EditBookmarkDto) {
        try {
            let bookmark: Bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    userId,
                    id
                }
            })
            bookmark = await this.prisma.bookmark.update({
                where: {
                    id: bookmark.id
                },
                data: dto
            })

            return bookmark
            
        } catch (error) {
            throw new InternalServerErrorException();  
        }
    }

    async deleteBookmark(userId: number, id: number) {
        try {
            const bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    userId,
                    id
                }
            })
            await this.prisma.bookmark.delete({
                where: {
                    id: bookmark.id
                }
            })
            return bookmark
            
        } catch (error) {
            throw new InternalServerErrorException();
        }
        
    }
}
