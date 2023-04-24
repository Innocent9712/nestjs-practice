import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-key') { // passing key 'jwt-key' is optional as default key is 'jwt'
    constructor(
        config: ConfigService,
        private readonly prisma: PrismaService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
            // passReqToCallback: true, // Set this to true to access the request object in the callback
        })
    }

    async validate(payload: any) {
        // return { userId: payload.sub, email: payload.email };
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        })

        const {hashPassword, ...rest} = user
        return rest
    }
}