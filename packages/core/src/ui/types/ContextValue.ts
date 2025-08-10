interface ContextValue<State> {
  onUpdate: (() => void) | null;
  state: State | null;
  timestamp: number;
}

export default ContextValue;
