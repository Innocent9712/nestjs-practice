import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule], // Since the @Global decorator is added to the PrismaModule, it is now available globally, without needing to import it.
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
