import { AnyObj } from '../types';

export abstract class Storage {
  abstract generateUploadPresignedUrl(
    key: string,
    contentType?: string,
    metadata?: AnyObj<string>
  ): Promise<string>;
  abstract generateUrl(key: string): string;
}
