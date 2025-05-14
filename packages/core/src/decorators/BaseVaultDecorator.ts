// types
import type { CommonParameters, Logger } from '@/types';

export default abstract class BaseVaultDecorator<Schema> {
  // protected variables
  protected readonly _logger: Logger;

  protected constructor({ logger }: CommonParameters) {
    this._logger = logger;
  }

  public abstract clear(): Promise<void>;
  public abstract close(): void;
  public abstract setStore(value: Schema): Promise<Schema>;
  public abstract store(): Promise<Schema | null>;
}
