#! /usr/bin/env node

import { Command } from 'commander';
import generateConfig from './commands/generate-config';
import compound from './commands/compound';
import explorer from './commands/explorer';

const program = new Command().version('1.0.0');

program
  .addCommand(generateConfig)
  .addCommand(compound)
  .addCommand(explorer)
  .parse();
