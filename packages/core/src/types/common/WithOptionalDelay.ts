type WithOptionalDelay<Type> = Type & Partial<Record<'delay', number>>;

export default WithOptionalDelay;
