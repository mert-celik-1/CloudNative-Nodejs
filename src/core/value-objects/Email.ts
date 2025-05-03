import { ValueObject } from "./ValueObjects";

interface EmailProps {
    value: string;
}

export class Email extends ValueObject<EmailProps> {
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    get value(): string {
        return this.props.value;
    }

    private constructor(props: EmailProps) {
        super(props);
    }

    public static create(email: string): Email {
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

        return new Email({ value: email });
    }
}