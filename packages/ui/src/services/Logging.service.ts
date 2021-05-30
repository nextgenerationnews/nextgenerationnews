class LoggingService {
  initialize() {
    const scriptEl = document.createElement('script');
    const sentryPublicKey = '9dea19a65d5c455e8f551a89150dffac';
    scriptEl.src = `https://js.sentry-cdn.com/${sentryPublicKey}.min.js`;
    scriptEl.crossOrigin = 'anonymous';
    scriptEl.setAttribute('data-lazy', 'no');
    scriptEl.addEventListener('load', () => {
      window.Sentry.onLoad(() => {
        window.Sentry.init({
          release: ' ... ',
          environment: ' ... ',
        });
        window.Sentry.configureScope(_scope => {
          // scope.setTag( ... );
        });
      });
    });
    // window.document.body.appendChild(scriptEl);
  }

  logException(error: Error) {
    console.error(error);
    if (window.Sentry) {
      window.Sentry.captureException(error);
    }
  }
}

export const loggingService = new LoggingService();
