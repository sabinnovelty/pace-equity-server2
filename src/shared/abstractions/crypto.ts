export abstract class CryptoHelper {
  abstract encrypt(value: any, key: string, algorithm?: string): string;
  abstract decrypt<Decrypted>(value: string, key: string, algorithm?: string): Decrypted;
  abstract hash(value: string): string;
  abstract compare(value: string, hash: string): boolean;
}
