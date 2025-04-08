type OnSuccessHandler<Result, Params> = (result: Result, params: Params) => void | Promise<void>;

export default OnSuccessHandler;
