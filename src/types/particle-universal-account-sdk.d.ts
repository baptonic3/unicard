declare module '@particle-network/universal-account-sdk' {
  export class UniversalAccount {
    constructor(options: any);
    getEIP7702Deployments(): Promise<any[]>;
    getSmartAccountOptions(): Promise<any>;
    getPrimaryAssets(): Promise<any>;
    createUniversalTransaction(options: any): Promise<any>;
    getTransaction(transactionId: string): Promise<any>;
    sendTransaction(transaction: any, signature: any, authorizations?: any[]): Promise<{ transactionId: string }>;
    getEIP7702Auth(chainIds: number[]): Promise<any[]>;
  }

  export const UNIVERSAL_ACCOUNT_VERSION: string;

  export interface IAssetsResponse {
    [key: string]: any;
  }

  export const CHAIN_ID: {
    ARBITRUM_MAINNET_ONE: string;
    [key: string]: string;
  };

  export const SUPPORTED_TOKEN_TYPE: {
    USDC: string;
    [key: string]: string;
  };
}
