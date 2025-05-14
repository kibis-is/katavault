/**
 * @property {string} displayName - [optional] A human-readable display name for the user. This does not have to be
 * unique and is used to display in the UI.
 * @property {string} username - A globally unique identifier for the user. This could be, for example, an email address.
 */
interface CreateKatavaultPasskeyParameters {
  displayName?: string;
  username: string;
}

export default CreateKatavaultPasskeyParameters;
