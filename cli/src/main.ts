#!/usr/bin/env node

import 'reflect-metadata';
import { container } from 'tsyringe';
import { Command } from 'commander';
import { RunCommand } from './presentation/view/commands/RunCommand';
import { CLIApplication } from './presentation/view/CLIApplication';

const program = new Command();

// Register dependencies
container.register('RunCommand', RunCommand);

// Register commands
const runCommand = container.resolve<RunCommand>('RunCommand');
runCommand.register(program);

const cliApplication = new CLIApplication(program);

cliApplication.start();
