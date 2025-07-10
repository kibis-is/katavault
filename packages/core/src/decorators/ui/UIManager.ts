import type { ILogger } from '@kibisis/utilities';
import { randomString } from '@stablelib/random';
import { h, render } from 'preact';

// apps
import AuthenticationApp from '@/apps/authentication';

// enums
import { AppTypeEnum } from '@/enums';

// errors
import { FailedToRenderUIError } from '@/errors';

// types
import type { CommonParameters, RenderAppParameters } from '@/types';

export default class UIManager {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private readonly _logger: ILogger;
  private readonly _id: string;

  public constructor({ logger }: CommonParameters) {
    this._logger = logger;
    this._id = randomString(16);
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
    return `katavault_${type}_${this._id}`;
  }

  /**
   * public methods
   */

  public async renderAuthenticationApp({ colorMode }: RenderAppParameters): Promise<void> {
    return new Promise((resolve, reject) => {
      const rootElement = this._rootElement(AppTypeEnum.Authentication);

      // render the ui
      render(
        h(AuthenticationApp, {
          colorMode,
          logger: this._logger,
          onAuthenticate: resolve,
          onClose: () => {
            this._closeApp(AppTypeEnum.Authentication);
            reject();
          },
        }),
        rootElement
      );
    });
  }
}
