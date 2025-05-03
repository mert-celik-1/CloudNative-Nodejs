import { UserProps } from "@modules/user/domain/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserResponseDTO } from "../dtos/UserDTO";

export class GetUserByIdQuery {
    constructor(private userRepository: UserRepository) {}


    async execute(id : string) : Promise<Omit<UserProps, "password"> | null> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            return null;
        }
        return user.toDTO()
    }
}