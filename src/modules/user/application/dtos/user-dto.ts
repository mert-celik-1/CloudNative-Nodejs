export interface CreateUserDTO {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export interface UserResponseDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}