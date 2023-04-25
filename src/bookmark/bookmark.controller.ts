import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from '../dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Post()
    createBookmark(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Get()
    getBookmarks(@GetUser('id', ParseIntPipe) userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmark(@GetUser('id', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.bookmarkService.getBookmark(userId, id)
    }

    @Patch(':id')
    editBookmark(@GetUser('id', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: EditBookmarkDto) {
        return this.bookmarkService.editBookmark(userId, id, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmark(@GetUser('id', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.bookmarkService.deleteBookmark(userId, id)
    }
}
