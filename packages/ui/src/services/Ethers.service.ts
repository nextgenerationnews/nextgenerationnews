import { LoadMessage } from 'lazy-loaded/LoadMessages';

class LazyLibService {
  getLazyLoadedLib<T extends keyof Window>(
    windowFieldName: keyof Window,
    loadMessage: LoadMessage,
  ): Promise<Window[T]> {
    return new Promise(resolve => {
      if (window[windowFieldName]) {
        resolve(window[windowFieldName]);
      } else {
        const listener = (ev: MessageEvent<string>) => {
          if (ev.data === loadMessage) {
            resolve(window[windowFieldName]);
            window.removeEventListener('message', listener);
          }
        };

        window.addEventListener('message', listener);
      }
    });
  }
  getEthers(): Promise<Window['Ethers']> {
    return this.getLazyLoadedLib('Ethers', LoadMessage.ETHERS);
  }

  getCachedEthers(): Window['Ethers'] {
    return window.Ethers;
  }

  getEditorJS(): Promise<Window['EditorJS']> {
    return this.getLazyLoadedLib('EditorJS', LoadMessage.EDITOR);
  }

  getCachedEditorJS(): Window['EditorJS'] {
    return window.EditorJS;
  }
}

export const lazyLibService = new LazyLibService();
