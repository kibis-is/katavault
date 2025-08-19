interface ConfirmParameters {
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  title: string;
}

export default ConfirmParameters;
