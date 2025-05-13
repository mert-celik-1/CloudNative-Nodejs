import { LogoutCommand } from './LogoutCommand';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

export class LogoutHandler {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(command: LogoutCommand): Promise<void> {


        const storedRefreshToken = await this.authRepository.findRefreshToken(command.refreshToken);
        if (storedRefreshToken) {
            await this.authRepository.deleteRefreshToken(storedRefreshToken.token); // Hashlenmiş token ile sil
        }

    }
}