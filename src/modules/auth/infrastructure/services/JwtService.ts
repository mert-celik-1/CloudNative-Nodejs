import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../../../user/domain/entities/User';

interface JwtPayload {
    userId: string;
    email: string;
}

export class JwtService {
    private readonly accessSecret: string;
    private readonly refreshSecret: string;
    private readonly accessExpiresIn: string;
    private readonly refreshExpiresIn: string;

    constructor() {
        this.accessSecret = process.env.JWT_ACCESS_SECRET!;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET!;
        this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN!;
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;

        if (!this.accessSecret || !this.refreshSecret || !this.accessExpiresIn || !this.refreshExpiresIn) {
            throw new Error('JWT secret keys and expiration times must be defined in environment variables.');
        }
    }

    generateAccessToken(user: User): string {
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
        };
        const options: SignOptions = { expiresIn: this.accessExpiresIn as any };
        return jwt.sign(payload, this.accessSecret, options);
    }

    generateRefreshToken(user: User): string {
        const payload: Pick<JwtPayload, 'userId'> = {
            userId: user.id,
        };
        const options: SignOptions = { expiresIn: this.refreshExpiresIn as any };
        return jwt.sign(payload, this.refreshSecret, options);
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.accessSecret) as JwtPayload;
        } catch (error) {
            return null;
        }
    }

    verifyRefreshToken(token: string): Pick<JwtPayload, 'userId'> | null {
        try {
            return jwt.verify(token, this.refreshSecret) as Pick<JwtPayload, 'userId'>;
        } catch (error) {
            return null;
        }
    }

    getAccessTokenExpiresInSeconds(): number {
        const unit = this.accessExpiresIn.slice(-1);
        const value = parseInt(this.accessExpiresIn.slice(0, -1), 10);
        if (isNaN(value)) {
            throw new Error(`Invalid JWT_ACCESS_EXPIRES_IN format: ${this.accessExpiresIn}`);
        }
        if (unit === 'm') return value * 60;
        if (unit === 'h') return value * 60 * 60;
        if (unit === 'd') return value * 60 * 60 * 24;
        return value;
    }
}