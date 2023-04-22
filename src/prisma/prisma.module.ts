import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Add this Decorator to make this module available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
