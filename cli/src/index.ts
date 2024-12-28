#!/usr/bin/env node

import 'reflect-metadata';
import { container } from 'tsyringe';
import { Command } from 'commander';
import { RunCommand } from './presentation/commands/RunCommand';

const program = new Command();

// Register dependencies
container.register('RunCommand', RunCommand);

program
  .name('foran')
  .description('A CLI tool for code forensics analysis')
  .version('0.1.0');

// Register commands
const runCommand = container.resolve<RunCommand>('RunCommand');
runCommand.register(program);

program.parse(process.argv);
