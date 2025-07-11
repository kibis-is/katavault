import type { ResourceLanguage } from 'i18next';

export default {
  buttons: {
    continueWithPassword: 'Continue with password',
    retry: 'Retry',
    signInWithPasskey: 'Sign in with passkey',
    signIn: 'Sign in',
  },
  captions: {
    verifyPasskey: 'Please follow the instructions to verify your passkey.',
    poweredBy: 'Powered by',
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
      required: 'This field required',
    },
  },
  headings: {
    enterYourPassword: 'Enter your password',
    signIn: 'Sign in',
  },
  placeholders: {
    password: 'Password',
    usernameEmail: 'Username or email',
  },
} satisfies ResourceLanguage;
