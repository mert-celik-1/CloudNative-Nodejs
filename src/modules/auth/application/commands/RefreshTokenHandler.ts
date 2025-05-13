import { RefreshTokenRequestDTO, TokenResponseDTO } from '../dtos/AuthDTO';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { JwtService } from '../../infrastructure/services/JwtService';
import { Token } from '../../domain/entities/Token';
import { UserRepository } from '../../../user/domain/repositories/UserRepository';

export class RefreshTokenHandler {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: RefreshTokenRequestDTO): Promise<TokenResponseDTO> {
        const refreshTokenPayload = await this.authRepository.findRefreshToken(command.refreshToken);

        if (!refreshTokenPayload) {
            throw new Error('Invalid or expired refresh token.');
        }

        await this.authRepository.deleteRefreshToken(refreshTokenPayload.token);

        const user = await this.userRepository.findById(refreshTokenPayload.userId);
        if (!user) {
            throw new Error('User not found for refresh token.');
        }

        const newAccessToken = this.jwtService.generateAccessToken(user);
        const newRefreshTokenValue = this.jwtService.generateRefreshToken(user);

        const newRefreshTokenExpiresInMs = Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7d', 10) * 24 * 60 * 60 * 1000;
        const newRefreshTokenExpiresAt = new Date(newRefreshTokenExpiresInMs);

        await this.authRepository.saveRefreshToken(
            user.id,
            newRefreshTokenValue,
            newRefreshTokenExpiresAt,
        );

        const tokenEntity = Token.create({
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenValue,
            accessTokenExpiresIn: this.jwtService.getAccessTokenExpiresInSeconds(),
        });

        return tokenEntity.toResponse();
    }
}