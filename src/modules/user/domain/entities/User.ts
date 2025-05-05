import {Entity, EntityProps} from '../../../../core/entities/Entity';
import {Email} from '../../../../core/value-objects/Email';
import {v4 as uuidv4} from 'uuid';

export interface UserProps extends EntityProps {
    email: Email;
    firstName: string;
    lastName: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps) {
        super(props);
    }

    public static create(params: {
        id?: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }): User {
        const emailVO = Email.create(params.email);
        const now = new Date();
        return new User({
            id: params.id || uuidv4(),
            email: emailVO,
            firstName: params.firstName,
            lastName: params.lastName,
            passwordHash: params.passwordHash,
            createdAt: now,
            updatedAt: now,
        });
    }


    get email(): string {
        return this.props.email.value;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }


    public updateProfile(params: { firstName?: string; lastName?: string }): void {
        if (params.firstName) this.props.firstName = params.firstName;
        if (params.lastName) this.props.lastName = params.lastName;
        this.props.updatedAt = new Date();
    }

    public changePassword(newHash: string): void {
        this.props.passwordHash = newHash;
        this.props.updatedAt = new Date();
    }

    public toDTO(): {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        updatedAt: string;
    } {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}
