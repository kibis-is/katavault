interface Parameters {
  characterLimit?: number;
  defaultValue?: string;
  name: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default Parameters;
