import { promises as fs } from 'fs';
import toml from '@iarna/toml';
import { Config } from './model';

const isValidConfig = (data: any) => {
  return (
    typeof data === 'object' &&
    typeof data.rpc === 'string' &&
    data.rpc.match(/https?:\/\//) &&
    Array.isArray(data.vaults)
  );
};

export const readConfig = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath);
    const config = toml.parse(data.toString());
    if (!isValidConfig(config)) {
      console.error(
        'Config file is not found of not acccessible. Please run config first or sepecify a correct config file location using --config option'
      );
      process.exit(1);
    }

    return config as Config;
  } catch (e) {
    console.error(
      'Config file is not found of not acccessible. Please run config first or sepecify a correct config file location using --config option'
    );
    process.exit(1);
  }
};

export const log = (...args: any[]) => {
  console.log(`[${Date.now}]`, ...args);
};
