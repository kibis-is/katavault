type OnErrorHandler<Error, Params> = (error: Error, params: Params) => void | Promise<void>;

export default OnErrorHandler;
