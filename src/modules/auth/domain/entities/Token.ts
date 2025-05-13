export class Token {
    public readonly accessToken: string;
    public readonly refreshToken: string;
    public readonly accessTokenExpiresIn: number;

    private constructor(props: {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: number;
    }) {
        this.accessToken = props.accessToken;
        this.refreshToken = props.refreshToken;
        this.accessTokenExpiresIn = props.accessTokenExpiresIn;
    }

    public static create(props: {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: number;
    }): Token {
        return new Token(props);
    }

    public toResponse(): { accessToken: string; refreshToken: string; expiresIn: number } {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresIn: this.accessTokenExpiresIn,
        };
    }
}