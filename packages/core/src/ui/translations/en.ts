import type { ResourceLanguage } from 'i18next';

export default {
  buttons: {
    continue: 'Continue',
    retry: 'Retry',
    signInWithPasskey: 'Sign in with a passkey',
    signupWithPasskey: 'Signup with a passkey',
    signInWithPassword: 'Sign in with a password',
    signupWithPassword: 'Signup with a password',
  },
  captions: {
    connectAnAccount: 'Connect an account',
    copyAccountID: 'Copy account ID',
    or: 'Or',
    poweredBy: 'Powered by',
    verifyPasskey: 'Please follow the instructions to verify your passkey.',
  },
  errors: {
    descriptions: {
      type: 'Something went wrong. Please try again.',
      type_FAILED_TO_AUTHENTICATE_PASSKEY_ERROR: 'Failed to authenticate with the supplied passkey. Please try again.',
      type_FAILED_TO_REGISTER_PASSKEY_ERROR: 'Failed to register the supplied passkey. Please try again.',
      type_PASSKEY_NOT_SUPPORTED_ERROR: 'The supplied passkey device is not supported. Please try a different device.',
      type_USER_CANCELED_PASSKEY_REQUEST_ERROR: 'The passkey request timed out or was canceled.',
    },
    inputs: {
      incorrectPassword: 'Incorrect password.',
      required: 'This field required.',
    },
  },
  headings: {
    connectedAccounts: 'Connected accounts',
    connections: 'Connections ({{count}})',
    finishCreatingANewAccount: 'Finish creating a new account',
    holdingAccounts: 'Holding accounts',
    networks: 'Networks',
    signInOrCreateANewAccount: 'Sign in or create a new account',
    welcomeBack: 'Welcome back!',
  },
  labels: {
    avm: 'AVM',
    accountID: 'Account ID',
    credentialAccount: 'Credential account',
    name: 'Name',
  },
  placeholders: {
    password: 'Password',
    usernameEmail: 'Username or email',
  },
} satisfies ResourceLanguage;
