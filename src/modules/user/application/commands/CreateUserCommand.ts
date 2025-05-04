import {User, UserProps} from "../../domain/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { PasswordService } from "@core/interfaces/PasswordService";
import { CreateUserDTO } from "../dtos/UserDTO";


export class CreateUserCommand {
    constructor(
        private userRepository: UserRepository,
        private passwordService: PasswordService) {
    }

    async execute(userData : CreateUserDTO) : Promise<Omit<UserProps, "password">> {

        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.passwordService.hashPassword(userData.password);

        const user = new User({
            ...userData,
            password: hashedPassword,
        });

        await this.userRepository.save(user)

        return user.toDTO();

    }
}