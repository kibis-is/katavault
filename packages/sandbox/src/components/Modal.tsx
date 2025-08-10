import { type FC, PropsWithChildren } from 'react';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal: FC<PropsWithChildren<Props>> = ({ children, isOpen, onClose, title }) => {
  // handlers
  const handleOnClose = () => onClose();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal__container">
      <div className="modal__content">
        {title && (
          <div className="modal__header">
            <h2>{title}</h2>
          </div>
        )}

        <div className="modal__body">{children}</div>

        <div className="modal__footer">
          <button className="button--full" onClick={handleOnClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
