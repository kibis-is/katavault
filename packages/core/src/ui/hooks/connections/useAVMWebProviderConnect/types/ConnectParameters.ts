import { BaseARC0027Error, type IDiscoverResult, type IEnableResult } from '@agoralabs-sh/avm-web-provider';

interface ConnectParameters {
  connector: IDiscoverResult;
  onSuccess: (result: IEnableResult) => void;
  onError: (error: BaseARC0027Error) => void;
}

export default ConnectParameters;
