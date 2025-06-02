
export enum AppEnv {
  PROD = 'production',
  DEV = 'development',
}

declare global {
  interface ConfigInterface  {
    CHAIN_ID: string;
    CONTRACT_ADDRESS: string;
    IMG_LOGO: string;
    IMG_COVER: string;
    EMBEDDED_WALLET_CLIENT: string;
  }
}
