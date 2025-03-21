export abstract class Cache {
  abstract getData<T>(key: string): Promise<T | null>;
  abstract setData<T>(key: string, data: T, expiry?: number): Promise<boolean>;
  abstract deleteData(key: string): Promise<boolean>;
}
