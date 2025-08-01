import { type Account, type Logger } from '@kibisis/katavault-core';
import { useAccounts, useSignMessage } from '@kibisis/katavault-react';
import { ChangeEvent, type FC, useCallback, useEffect, useState } from 'react';

// components
import Modal from './Modal';

export interface Props {
  isOpen: boolean;
  logger: Logger;
  onClose: () => void;
}

const SignMessageModal: FC<Props> = ({ isOpen, logger, onClose }) => {
  // hooks
  const accounts = useAccounts();
  const signMessage = useSignMessage();
  // states
  const [account, setAccount] = useState<Account | null>(accounts[0] ?? null);
  const [value, setValue] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  // callbacks
  const handleOnAccountSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setAccount(accounts.find(({ address }) => address === event.target.value) ?? null);
    },
    [accounts, setAccount]
  );
  const handleOnMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSignature('');
      setValue(event.target.value);
    },
    [setSignature, setValue]
  );
  const handleOnSignClick = useCallback(() => {
    if (!account) {
      return;
    }

    signMessage(
      {
        address: account.address,
        encoding: 'hex',
        message: value,
      },
      {
        onError: (error) => {
          logger.error(`${SignMessageModal.displayName}#handleOnSignClick:`, error);
        },
        onSuccess: (result) => {
          setSignature(result as string);
        },
      }
    );
  }, [accounts, logger, setSignature]);

  useEffect(() => {
    if (!account) {
      setAccount(accounts[0] ?? null);
    }
  }, [accounts]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign a message">
      <div className="sign-message-modal__content">
        <select className="sign-message-modal__select" onChange={handleOnAccountSelect}>
          {accounts.map(({ address }) => (
            <option key={`sign-message-modal-account-select-${address}`} value={address}>
              {address}
            </option>
          ))}
        </select>

        <div className="sign-message-modal__input">
          <input onChange={handleOnMessageChange} type="text" value={value} />
          <button className="button--sm" onClick={handleOnSignClick}>
            Sign
          </button>
        </div>

        <div className="sign-message-modal__signature">
          <span>Signature:</span>
          <code>{signature.length > 0 ? signature : '-'}</code>
        </div>
      </div>
    </Modal>
  );
};

SignMessageModal.displayName = 'SignMessageModal';

export default SignMessageModal;
