import { Command } from 'commander';
import { resolve } from 'path';
import { readConfig } from '../utils';

const Explorer = 'https://polygonscan.com';
const command = new Command('explorer')
  .description('Generate explorer link to contract')
  .option('-c, --config <string>', 'Config file path', './config.toml')
  .action(async (options) => {
    const config = await readConfig(resolve(process.cwd(), options.config));

    console.log(`Harvester address: ${config.harvester}`);

    console.log('\nVault addresses:');
    config.vaults.forEach((t) => {
      console.log(`- ${Explorer}/address/${t.address}`);
    });
  });

export default command;
