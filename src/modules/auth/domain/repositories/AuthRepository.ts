import { User } from '../../../user/domain/entities/User';

export interface RefreshTokenPayload {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface AuthRepository {

    findUserByEmail(email: string): Promise<User | null>;

    saveRefreshToken(
        userId: string,
        hashedToken: string,
        expiresAt: Date,
    ): Promise<void>;

    findRefreshToken(hashedToken: string): Promise<RefreshTokenPayload | null>;

    deleteRefreshToken(hashedToken: string): Promise<boolean>;

    deleteRefreshTokensByUserId(userId: string): Promise<void>;
}