import { Entity, EntityProps } from '../../../core/entities/Entity';
import { Email } from '../../../core/value-objects/Email';

export interface UserProps extends EntityProps {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Entity<UserProps> {
    private email: Email;
    private firstName: string;
    private lastName: string;
    private password: string;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(props: UserProps) {
        super(props);
        this.email = Email.create(props.email);
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.password = props.password;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    get getEmail(): string {
        return this.email.value;
    }

    get getFirstName(): string {
        return this.firstName;
    }

    get getLastName(): string {
        return this.lastName;
    }

    get getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get getCreatedAt(): Date {
        return this.createdAt;
    }

    get getUpdatedAt(): Date {
        return this.updatedAt;
    }

    update(props: Partial<Omit<UserProps, 'id' | 'createdAt' | 'email'>>): void {
        if (props.firstName) this.firstName = props.firstName;
        if (props.lastName) this.lastName = props.lastName;
        if (props.password) this.password = props.password;
        this.updatedAt = new Date();
    }

    updateEmail(email: string): void {
        this.email = Email.create(email);
        this.updatedAt = new Date();
    }

    toDTO(): Omit<UserProps, 'password'> {
        return {
            id: this.id,
            email: this.getEmail,
            firstName: this.firstName,
            lastName: this.lastName,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}