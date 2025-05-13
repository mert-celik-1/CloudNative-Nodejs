export interface UploadedFileResponse {
    url: string;      // Dosyanın erişilebileceği URL (public veya presigned)
    key: string;      // S3'deki dosyanın unique key'i (path dahil)
    bucket: string;   // Dosyanın yüklendiği bucket adı
    eTag?: string;     // Dosyanın ETag'i (versiyonlama için faydalı)
}

export interface PresignedUrlResponse {
    uploadUrl: string; // İstemcinin dosyayı yükleyeceği presigned URL
    key: string;       // Dosyanın S3'de alacağı key
    method: 'PUT' | 'POST'; // Genellikle PUT kullanılır
}

export interface StorageService {
    /**
     * Verilen buffer'ı depolama alanına yükler.
     * @param fileBuffer Yüklenecek dosyanın buffer'ı.
     * @param fileName Dosyanın orijinal adı veya S3'de kullanılacak adı.
     * @param mimeType Dosyanın MIME tipi (örn: "image/jpeg").
     * @param destinationPath S3 bucket'ı içinde dosyanın yükleneceği yol (örn: "users/user_id/avatars/").
     * @returns Yüklenen dosyanın bilgilerini içeren bir Promise.
     */
    uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        mimeType: string,
        destinationPath?: string, // Örn: "users/123/profile-pics/" (sonda / olmalı)
    ): Promise<UploadedFileResponse>;

    /**
     * Belirtilen key'e sahip dosyayı depolama alanından siler.
     * @param fileKey Silinecek dosyanın S3'deki key'i.
     * @returns Başarılı olursa resolve olan bir Promise.
     */
    deleteFile(fileKey: string): Promise<void>;

    /**
     * Belirtilen key'e sahip dosyanın erişim URL'sini (genellikle presigned URL) döndürür.
     * @param fileKey URL'si alınacak dosyanın S3'deki key'i.
     * @param expiresInSeconds URL'nin geçerlilik süresi (saniye cinsinden, varsayılan: 1 saat).
     * @returns Dosyanın erişim URL'sini içeren bir Promise.
     */
    getFileUrl(fileKey: string, expiresInSeconds?: number): Promise<string>;

    /**
     * İstemcinin doğrudan S3'e dosya yüklemesi için presigned URL oluşturur.
     * @param fileName Yüklenecek dosyanın adı (S3 key'inin bir parçası olacak).
     * @param mimeType Dosyanın MIME tipi.
     * @param destinationPath Dosyanın S3'de yükleneceği yol.
     * @param expiresInSeconds Presigned URL'nin geçerlilik süresi (saniye cinsinden, varsayılan: 15 dakika).
     * @returns Presigned URL ve dosya key'ini içeren bir Promise.
     */
    generatePresignedUploadUrl(
        fileName: string,
        mimeType: string,
        destinationPath?: string,
        expiresInSeconds?: number,
    ): Promise<PresignedUrlResponse>;
}