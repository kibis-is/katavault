interface State {
  copied: boolean;
  onCopy: () => void;
  setValue: (value: string) => void;
  value: string;
}

export default State;
