import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
constructor(config: ConfigService) {
    super({
        datasources: {
            db: {
                url: config.get('DATABASE_URL'),
            },
        }
    });
}
    // delete all bookmarks and users
    cleadDb() {
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
