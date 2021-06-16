export type VaultConfig = {
  address: string;
  schedule?: string;
  disabled?: boolean;
};

export type Config = {
  rpc: string;
  privateKey: string;
  harvester: string;
  schedule: string;
  vaults: VaultConfig[];
};
