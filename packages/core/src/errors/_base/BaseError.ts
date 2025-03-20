export default abstract class BaseError extends Error {
  public readonly isEmbeddedWalletError = true;
  public message: string;
  public readonly type: string;

  public constructor(message: string) {
    super(message.toLowerCase());
  }
}
