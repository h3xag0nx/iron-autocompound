import { Command } from 'commander';
import { resolve } from 'path';
import { log, readConfig } from '../utils';
import { Wallet } from '@ethersproject/wallet';
import schedule from 'node-schedule';
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { Vault } from '../contracts/vault';
import chalk from 'chalk';

const compound = async (wallet: Wallet, vaultAddress: string) => {
  let tag = chalk.blue(`[${vaultAddress}] `);
  try {
    log(tag, 'compounding');
    const vault = new Vault(wallet, vaultAddress);
    const estimatedGas = await vault.estimateGas.compound();
    log('estimatedGas', estimatedGas.toString());
    // increase gas limit
    const tx = (await vault.compound({
      gasLimit: 1e6,
      gasPrice: 2e9,
    })) as TransactionResponse;

    log(tag, 'transaction created ' + tx.hash);
    await tx.wait();
    log(tag, 'compound completed');
  } catch (e) {
    console.error(`${tag} Compound failed with error message: `, e.message);
  }
};

const compoundMany = async (wallet: Wallet, addresses: string[]) => {
  for (let address of addresses) {
    await compound(wallet, address);
  }
};

const command = new Command('run')
  .option('-c, --config <string>', 'Config file path', './config.toml')
  .action(async (options) => {
    const config = await readConfig(resolve(process.cwd(), options.config));

    log(chalk.blue(`Start auto compound using ${config.harvester}`));
    const wallet = new Wallet(
      config.privateKey,
      new JsonRpcProvider(config.rpc)
    );

    const compoundAllAddresses = config.vaults
      .filter((t) => !t.disabled && !t.schedule)
      .map((t) => t.address);

    const compoundSingle = config.vaults.filter(
      (t) => !t.disabled && t.schedule
    );

    compoundSingle.forEach((t) => {
      return schedule.scheduleJob(t.schedule!, () =>
        compound(wallet, t.address)
      );
    });

    schedule.scheduleJob(config.schedule, () =>
      compoundMany(wallet, compoundAllAddresses)
    );
  })
  .on('SIGINT', () => {
    console.log('Auto compound stopped');
    process.exit(0);
  });

export default command;
