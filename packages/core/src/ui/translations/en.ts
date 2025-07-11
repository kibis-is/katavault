import type { ResourceLanguage } from 'i18next';

export default {
  buttons: {
    continueWithPassword: 'Continue with password',
    signInWithPasskey: 'Sign in with passkey',
    signInWithPassword: 'Sign in with password',
  },
  captions: {
    poweredBy: 'Powered by',
  },
  errors: {
    inputs: {
      required: 'This field required',
      requiredWithLabel: '{{name}} is required',
    },
  },
  headings: {
    enterYourPassword: 'Enter your password',
    signIn: 'Sign in',
  },
  placeholders: {
    emailUsername: 'Email/Username',
  },
} satisfies ResourceLanguage;
