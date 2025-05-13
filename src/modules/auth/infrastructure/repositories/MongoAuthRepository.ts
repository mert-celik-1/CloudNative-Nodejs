import bcrypt from 'bcrypt';
import { AuthRepository, RefreshTokenPayload } from '../../domain/repositories/AuthRepository';
import { User } from '../../../user/domain/entities/User';
import { UserModel as MongooseUserModel } from '../../../user/infrastructure/schemas/UserSchema';
import { RefreshTokenModel } from '../schemas/RefreshTokenSchema';

export class MongoAuthRepository implements AuthRepository {

    async findUserByEmail(email: string): Promise<User | null> {
        const userDoc = await MongooseUserModel.findOne({ email: email.toLowerCase() });
        if (!userDoc) return null;

        return User.fromPersistence({
            id: userDoc.id.toString(),
            email: userDoc.email,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            passwordHash: userDoc.passwordHash,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
        });
    }
    async saveRefreshToken(
        userId: string,
        plainToken: string,
        expiresAt: Date,
    ): Promise<void> {
        const saltRounds = 10;
        const hashedToken = await bcrypt.hash(plainToken, saltRounds);
        await RefreshTokenModel.create({
            userId,
            token: hashedToken,
            expiresAt,
        });
    }

    async findRefreshToken(plainToken: string): Promise<RefreshTokenPayload | null> {
        const allTokens = await RefreshTokenModel.find({ expiresAt: { $gte: new Date() } });
        for (const tokenDoc of allTokens) {
            const isMatch = await bcrypt.compare(plainToken, tokenDoc.token);
            if (isMatch) {
                return {
                    id: tokenDoc.id.toString(),
                    userId: tokenDoc.userId,
                    token: tokenDoc.token,
                    expiresAt: tokenDoc.expiresAt,
                    createdAt: tokenDoc.createdAt!,
                };
            }
        }
        return null;
    }

    async deleteRefreshToken(hashedToken: string): Promise<boolean> {
        const result = await RefreshTokenModel.deleteOne({ token: hashedToken });
        return result.deletedCount === 1;
    }

    async deleteRefreshTokensByUserId(userId: string): Promise<void> {
        await RefreshTokenModel.deleteMany({ userId });
    }
}