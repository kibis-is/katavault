import { createLogger } from '@kibisis/utilities';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

// containers
import App from '@/containers/App';

async function onDOMContentLoaded() {
  const __logPrefix = 'onDOMContentLoaded';
  const logger = createLogger('debug');
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    logger.error(`${__logPrefix}: failed to find "root" element to render react app`);

    return;
  }

  createRoot(rootElement).render(
    createElement(App, {
      logger,
    })
  );
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
