export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface TokenResponseDTO {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RefreshTokenRequestDTO {
    refreshToken: string;
}