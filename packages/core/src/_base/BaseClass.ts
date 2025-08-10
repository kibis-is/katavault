import type { ILogger } from '@kibisis/utilities';

// types
import type { CommonParameters } from '@/types';

export default class BaseClass {
  /**
   * protected properties
   */
  protected readonly _logger: ILogger;

  public constructor({ logger }: CommonParameters) {
    this._logger = logger;
  }
}
