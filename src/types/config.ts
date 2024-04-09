
export enum AppEnv {
  PROD = 'production',
  DEV = 'development',
}

declare global {
  interface ConfigInterface  {
    CHAIN_ID: String;
    CONTRACT_ADDRESS: String;
  }
}
