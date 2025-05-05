import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        _id: { type: String },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
            //password: { type: String, required: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
