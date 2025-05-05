import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../schemas/UserSchema';

export class MongoUserRepository implements UserRepository {
    async save(user: User): Promise<void> {
        const raw = {
            _id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        await UserModel.create(raw);
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await UserModel.findOne({ email });
        if (!result) return null;

        return User.create({
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            passwordHash: result.passwordHash,
        });
    }

    async findById(id: string): Promise<User | null> {
        const result = await UserModel.findById(id);
        if (!result || !result._id) return null;
        const user = User.create({
            id: result._id.toString(),
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            passwordHash: result.passwordHash,
        });

        return user;
    }


    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map((u) =>
            User.create({
                email: u.email,
                firstName: u.firstName,
                lastName: u.lastName,
                passwordHash: u.passwordHash,
            })
        );
    }

    async update(user: User): Promise<void> {
        await UserModel.updateOne(
            { _id: user.id },
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                passwordHash: user.passwordHash,
                updatedAt: new Date(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }
}
