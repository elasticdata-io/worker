export abstract class AbstractFileClientService {
	abstract bucketExists(bucket: string): Promise<boolean>;
	abstract makeBucket(bucket: string, region: string): Promise<void>;
	abstract putObject(userUuid: string, objectName: string, file: Buffer | string, metadata?: object): Promise<void>;
	abstract presignedGetObject(userUuid: string, objectName: string): Promise<string>;
}