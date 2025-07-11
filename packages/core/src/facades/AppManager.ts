import type { ILogger } from '@kibisis/utilities';
import I18next, { type i18n as I18n } from 'i18next';
import { h, render } from 'preact';

// containers
import AuthenticationApp from '@/ui/apps/authentication';

// enums
import { AppTypeEnum } from '@/enums';

// errors
import { FailedToRenderUIError, UserCanceledUIRequestError } from '@/errors';

// translations
import { en } from '@/ui/translations';

// types
import type { AuthenticateResult, CommonParameters, RenderAppParameters } from '@/types';

export default class AppManager {
  // public static variables
  public static readonly displayName = 'AppManager';
  // private variables
  private _i18n: I18n | null = null;
  private readonly _logger: ILogger;

  public constructor({ logger }: CommonParameters) {
    this._logger = logger;
  }

  /**
   * private methods
   */

  private _closeApp(type: AppTypeEnum): void {
    const rootElement = window.document.getElementById(this._rootElementID(type));

    // if there is a root element, remove it
    if (rootElement) {
      rootElement.remove();
    }
  }

  private _getOrInitializeI18n(): I18n {
    if (!this._i18n) {
      this._i18n = I18next.createInstance({
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {
            translation: en,
          },
        },
      });
    }

    return this._i18n;
  }

  private _rootElement(type: AppTypeEnum): HTMLElement {
    let rootElement: HTMLElement | null;
    let rootElementID: string;

    if (!window) {
      throw new FailedToRenderUIError('failed to get window object, is this being run in a browser context?');
    }

    rootElementID = this._rootElementID(type);
    rootElement = window.document.getElementById(rootElementID);

    // create and attach the ui root element
    if (!rootElement) {
      rootElement = window.document.createElement('div');

      rootElement.id = rootElementID;

      window.document.body.appendChild(rootElement);
    }

    return rootElement;
  }

  private _rootElementID(type: AppTypeEnum): string {
    return `katavault_${type}`;
  }

  /**
   * public methods
   */

  public async renderAuthenticationApp({ vault }: RenderAppParameters): Promise<AuthenticateResult> {
    return new Promise<AuthenticateResult>((resolve, reject) => {
      render(
        h(AuthenticationApp, {
          i18n: this._getOrInitializeI18n(),
          logger: this._logger,
          onClose: () => {
            this._closeApp(AppTypeEnum.Authentication);
            reject(new UserCanceledUIRequestError('user canceled authentication request'));
          },
          onError: reject,
          onSuccess: resolve,
          vault,
        }),
        this._rootElement(AppTypeEnum.Authentication)
      );
    });
  }
}
