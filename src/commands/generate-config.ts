import { JsonRpcProvider } from '@ethersproject/providers';
import { isAddress } from '@ethersproject/address';
import { Command } from 'commander';
import { VaultFactory } from '../contracts/vault-factory';
import toml from '@iarna/toml';
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { Wallet } from '@ethersproject/wallet';
import { Config } from '../model';

const command = new Command('config')
  .description('Generate config template from user address')
  .requiredOption('-a, --address <string>', 'User address')
  .option('-o, --output <string>', 'Config file location', './config.toml')
  .option(
    '--rpc <string>',
    'RPC URL (optional)',
    'https://rpc-mainnet.matic.network'
  )
  .option('--schedule <string>', 'Default compound schedule', '* 0 * * * *')
  .action(async (options, command) => {
    if (!isAddress(options.address)) {
      console.error('Invalid option: address');
      process.exit(1);
    }

    if (!(options.rpc as string).match(/https?:\/\//)) {
      console.error('Invalid option: RPC URL');
      process.exit(1);
    }

    try {
      const provider = new JsonRpcProvider(options.rpc);
      const vaultFactory = new VaultFactory(provider);
      const userVault = await vaultFactory.getUserVaults(options.address);
      const vaults = userVault.map((address: string) => {
        return {
          address,
          diabled: false,
        };
      });

      const wallet = Wallet.createRandom();
      const config: Config = {
        rpc: options.rpc,
        privateKey: wallet.privateKey,
        harvester: wallet.address,
        schedule: options.schedule,
        vaults,
      };

      const output = path.resolve(process.cwd(), options.output);
      await fs.writeFile(output, toml.stringify(config as any));

      console.log(chalk.green(`Config file created at ${output}`));
      console.log(
        'Please set the following address as harvester for all of your vaults'
      );
      console.log('Compound address: ', wallet.address);
      console.log(
        "You can run the 'explorer' command to print out link to contracts"
      );
    } catch (e) {
      console.error(chalk.red(`Cannot generate config file due to error`));
      console.error(e.message);
      process.exit(9);
    }
  });

export default command;
