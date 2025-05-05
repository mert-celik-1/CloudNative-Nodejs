import { UserRepository } from "../../domain/repositories/UserRepository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand as DocumentScanCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { User, UserProps } from "@modules/user/domain/user";

export class DynamoUserRepository implements UserRepository {
    private readonly tableName = 'Users';
    private readonly docClient: DynamoDBDocumentClient;

    constructor(region: string = 'eu-central-1') {
        const client = new DynamoDBClient({region});
        this.docClient = DynamoDBDocumentClient.from(client);
    }


    async findById(id : string) : Promise<User | null> {
        const result = await this.docClient.send(new GetCommand({
            TableName: this.tableName,
            Key: {
                id
            }
        }));

        if (!result.Item) return null;

        return new User(result.Item as UserProps)
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.docClient.send(new QueryCommand({
            TableName: this.tableName,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }));

        if (!result.Items || result.Items.length === 0) return null;

        return new User(result.Items[0] as UserProps);
    }

    async save(user: User): Promise<void> {
        await this.docClient.send(new PutCommand({
            TableName: this.tableName,
            Item: {
                id: user.getId,
                email: user.getEmail,
                firstName: user.getFirstName,
                lastName: user.getLastName,
                //password: user.password, // Note: this is a private field, might need a getter or different approach
                createdAt: user.getCreatedAt.toISOString(),
                updatedAt: user.getUpdatedAt.toISOString()
            }
        }));
    }

    async update(user: User): Promise<void> {
        // Use the same save method for updating
        await this.save(user);
    }

    async delete(id: string): Promise<void> {
        await this.docClient.send(new DeleteCommand({
            TableName: this.tableName,
            Key: { id }
        }));
    }


    async findAll(): Promise<User[]> {
        const result = await this.docClient.send(new DocumentScanCommand({
            TableName: this.tableName
        }));

        if (!result.Items) return [];

        return result.Items.map(item => {
            const userProps: UserProps = {
                id: item.id,
                email: item.email,
                firstName: item.firstName,
                lastName: item.lastName,
                password: item.password,
                createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
            };
            return new User(userProps);
        });
    }


}