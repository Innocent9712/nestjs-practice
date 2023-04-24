import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt-key') {
    constructor() {
        super()
    }
}