import { CAIP002Namespace } from '@kibisis/chains';

// _base
import { BaseClass } from '@/_base';

// errors
import { ChainNotSupportedError } from '@/errors';

// strategies
import AVMTransactionStrategy from './AVMTransactionStrategy';

// types
import type {
  CommonParameters,
  SendRawTransactionResult,
  SignRawTransactionResult,
  WithAccountStoreItem,
  WithChain,
  WithIndex,
} from '@/types';

export default class TransactionContext extends BaseClass {
  /**
   * public static properties
   */
  public static readonly displayName = 'TransactionContext';
  /**
   * private properties
   */
  private readonly _avmTransactionStrategy: AVMTransactionStrategy;

  public constructor(params: CommonParameters) {
    super(params);

    this._avmTransactionStrategy = new AVMTransactionStrategy(params);
  }

  /**
   * public methods
   */

  public async sendRawTransaction(
    parameters: WithChain<Record<'signature' | 'transaction', Uint8Array>>
  ): Promise<SendRawTransactionResult> {
    try {
      switch (parameters.chain.namespace()) {
        case CAIP002Namespace.Algorand:
        case CAIP002Namespace.AVM:
          return {
            error: null,
            success: true,
            transactionID: await this._avmTransactionStrategy.sendRawTransaction(parameters),
          };
        default:
          return {
            error: new ChainNotSupportedError(`chain "${parameters.chain.chainID()}" not supported`),
            success: false,
            transactionID: null,
          };
      }
    } catch (error) {
      return {
        error,
        success: false,
        transactionID: null,
      };
    }
  }

  public async signRawTransactions(
    parameters: WithIndex<WithAccountStoreItem<WithChain<Record<'transaction', Uint8Array>>>>[]
  ): Promise<WithIndex<SignRawTransactionResult>[]> {
    const __logPrefix = `${TransactionContext.displayName}#signRawTransactions`;
    // group the transactions into a map by the namespace, so we can pass it to a strategy - ensuring we add the index
    // so we know where the transaction belongs in the original list
    const transactionsByNamespaceMap = parameters.reduce((acc, currentValue) => {
      let entry: WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>>>[] | null;

      if (!currentValue) {
        return acc;
      }

      const { account, chain, index, transaction } = currentValue;

      entry = acc.get(chain.namespace()) ?? null;

      if (!entry) {
        acc.set(chain.namespace(), [
          {
            account,
            index,
            transaction,
          },
        ]);

        return acc;
      }

      acc.set(chain.namespace(), [
        ...entry,
        {
          account,
          index,
          transaction,
        },
      ]);

      return acc;
    }, new Map<CAIP002Namespace, WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>>>[]>());
    const entries = transactionsByNamespaceMap.entries();
    let results: WithIndex<SignRawTransactionResult>[] = [];

    // for each namespace, use the corresponding strategy to handle the transaction signing
    for (const [namespace, transactions] of entries) {
      switch (namespace) {
        case CAIP002Namespace.Algorand:
        case CAIP002Namespace.AVM:
          results = [...results, ...(await this._avmTransactionStrategy.signRawTransactions(transactions))];

          break;
        default:
          this._logger.warn(`${__logPrefix}: namespace "${namespace}" not supported`);

          results = [
            ...results,
            ...transactions.map(({ index }) => ({
              error: new ChainNotSupportedError(`namespace "${namespace}" not supported`),
              index,
              signature: null,
              success: false,
            })),
          ];

          break;
      }
    }

    return results;
  }
}
