interface ConfirmModalContextState {
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
  open: boolean;
  reset: () => void;
  setMessage: (message: string) => void;
  setOnClose: (onClose: (() => void) | null) => void;
  setOnConfirm: (onConfirm: (() => void) | null) => void;
  setOpen: (open: boolean) => void;
  setTitle: (title: string) => void;
  title: string;
}

export default ConfirmModalContextState;
