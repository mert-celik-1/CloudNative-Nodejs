import { LoginRequestDTO, TokenResponseDTO } from '../dtos/AuthDTO';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { PasswordService } from '../../../../core/interfaces/PasswordService';
import { JwtService } from '../../infrastructure/services/JwtService';
import { Token } from '../../domain/entities/Token';

export class LoginHandler {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: LoginRequestDTO): Promise<TokenResponseDTO> {
        const user = await this.authRepository.findUserByEmail(command.email);

        if (!user) {
            throw new Error('Invalid email or password.');
        }

        const isPasswordValid = await this.passwordService.comparePassword(
            command.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new Error('Invalid email or password.');
        }

        const accessToken = this.jwtService.generateAccessToken(user);
        const refreshTokenValue = this.jwtService.generateRefreshToken(user);


        const refreshTokenExpiresInMs = Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7d', 10) * 24 * 60 * 60 * 1000;
        const refreshTokenExpiresAt = new Date(refreshTokenExpiresInMs);


        await this.authRepository.saveRefreshToken(
            user.id,
            refreshTokenValue,
            refreshTokenExpiresAt,
        );

        const tokenEntity = Token.create({
            accessToken,
            refreshToken: refreshTokenValue, 
            accessTokenExpiresIn: this.jwtService.getAccessTokenExpiresInSeconds(),
        });

        return tokenEntity.toResponse();
    }
}