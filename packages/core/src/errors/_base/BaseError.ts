export default abstract class BaseError extends Error {
  public readonly isKatavaultError = true;
  public message: string;
  public readonly type: string;

  public constructor(message: string) {
    super(message.toLowerCase());
  }
}
