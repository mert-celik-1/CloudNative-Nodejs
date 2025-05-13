import mongoose, { Schema, Document } from 'mongoose';
import { RefreshTokenPayload } from '../../domain/repositories/AuthRepository';

export interface RefreshTokenDocument extends Omit<RefreshTokenPayload, 'id'>, Document {}

const RefreshTokenSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        token: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = mongoose.model<RefreshTokenDocument>(
    'RefreshToken',
    RefreshTokenSchema,
);