import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    StorageService,
    UploadedFileResponse,
    PresignedUrlResponse,
} from '../../core/interfaces/StorageService';
import { v4 as uuidv4 } from 'uuid';

export class S3StorageService implements StorageService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly region: string;
    private readonly publicUrlPrefix?: string;

    constructor() {
        this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
        this.region = process.env.AWS_REGION!;
        this.publicUrlPrefix = process.env.AWS_S3_PUBLIC_URL_PREFIX;

        if (!this.bucketName || !this.region) {
            throw new Error(
                'AWS S3 bucket name and region must be defined in environment variables.',
            );
        }

        this.s3Client = new S3Client({ region: this.region });
    }

    private generateFileKey(fileName: string, destinationPath?: string): string {
        const uniquePrefix = uuidv4();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const baseKey = `${uniquePrefix}-${sanitizedFileName}`;
        return destinationPath ? `${destinationPath.replace(/\/$/, '')}/${baseKey}` : baseKey;
    }

    async uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        mimeType: string,
        destinationPath?: string,
    ): Promise<UploadedFileResponse> {
        const fileKey = this.generateFileKey(fileName, destinationPath);

        const putCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: mimeType,
        });

        try {
            const response = await this.s3Client.send(putCommand);
            const fileUrl = this.publicUrlPrefix
                ? `${this.publicUrlPrefix.replace(/\/$/, '')}/${fileKey}`
                : `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

            return {
                url: fileUrl,
                key: fileKey,
                bucket: this.bucketName,
                eTag: response.ETag?.replace(/"/g, ''),
            };
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            if (error instanceof S3ServiceException) {
                throw new Error(`S3 Upload Error: ${error.name} - ${error.message}`);
            }
            throw new Error('Failed to upload file.');
        }
    }

    async deleteFile(fileKey: string): Promise<void> {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        try {
            await this.s3Client.send(deleteCommand);
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            if (error instanceof S3ServiceException) {
                throw new Error(`S3 Delete Error: ${error.name} - ${error.message}`);
            }
            throw new Error('Failed to delete file.');
        }
    }

    async getFileUrl(fileKey: string, expiresInSeconds: number = 3600): Promise<string> {
        if (this.publicUrlPrefix) {

        }

        const getCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        try {
            // Presigned URL for GET request
            const url = await getSignedUrl(this.s3Client, getCommand, {
                expiresIn: expiresInSeconds,
            });
            return url;
        } catch (error) {
            console.error('Error generating presigned URL for S3 get:', error);
            if (error instanceof S3ServiceException) {
                throw new Error(`S3 Get URL Error: ${error.name} - ${error.message}`);
            }
            throw new Error('Failed to get file URL.');
        }
    }

    async generatePresignedUploadUrl(
        fileName: string,
        mimeType: string,
        destinationPath?: string,
        expiresInSeconds: number = 900,
    ): Promise<PresignedUrlResponse> {
        const fileKey = this.generateFileKey(fileName, destinationPath);

        const putCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            ContentType: mimeType,
        });

        try {
            const signedUrl = await getSignedUrl(this.s3Client, putCommand, {
                expiresIn: expiresInSeconds,
            });
            return {
                uploadUrl: signedUrl,
                key: fileKey,
                method: 'PUT',
            };
        } catch (error) {
            console.error('Error generating presigned URL for S3 put:', error);
            if (error instanceof S3ServiceException) {
                throw new Error(`S3 Presigned URL Error: ${error.name} - ${error.message}`);
            }
            throw new Error('Failed to generate presigned upload URL.');
        }
    }
}