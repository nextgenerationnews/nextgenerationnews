import 'ethers';

declare global {
  interface Window {
    prerenderReady: boolean | undefined;
    Ethers: {
      Contract: typeof import('ethers')['Contract'];
      BigNumber: typeof import('ethers')['BigNumber'];
      JsonRpcProvider: typeof import('ethers')['providers']['JsonRpcProvider'];
      Web3Provider: typeof import('ethers')['providers']['Web3Provider'];
      parseEther: typeof import('ethers')['utils']['parseEther'];
      formatEther: typeof import('ethers')['utils']['formatEther'];
      FixedNumber: typeof import('ethers')['FixedNumber'];
    };
    EditorJS: {
      EditorJS: typeof import('@editorjs/editorjs')['default'];
      Header: typeof import('@editorjs/header');
      List: typeof import('@editorjs/list');
      Paragraph: typeof import('@editorjs/paragraph');
      Quote: typeof import('@editorjs/quote');
      Link: typeof import('@editorjs/link');
      Image: typeof import('@editorjs/image');
      Underline: typeof import('@editorjs/underline');
      Table: typeof import('@editorjs/table');
    };
    Sentry: typeof import('@sentry/browser');
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      INFURA_ID: string;
      FORTMATIC_KEY: string;
      PORTIS_KEY: string;
      BITSTKI_CLIENT_ID: string;
      BITSTKI_CALLBACK_URL: string;
      SENTRY_DSN: string;
    }
  }
}
