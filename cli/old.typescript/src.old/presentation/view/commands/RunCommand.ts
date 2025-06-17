import { injectable } from 'tsyringe';
import { Command } from 'commander';

@injectable()
export class RunCommand {
  public register(program: Command): void {
    program
      .command('run')
      .description('Run code forensics analysis on a specified git repository')
      .requiredOption('-f, --folder <path>', 'Target folder of the git repository')
      .option(
        '-af, --analyse-from <date>',
        'Starting date to gather the git log data (default: 30 days ago)',
        this.getDefaultFromDate()
      )
      .option(
        '-au, --analyse-until <date>',
        'End date for the analysis (must be earlier than analyse-from)'
      )
      .option(
        '-t, --analysis-type <type>',
        'Type of analysis to run (default: all)'
      )
      .option('-h, --help', 'Display help for the run command')
      .action(async (options) => {
        try {
          // TODO: Implement the actual analysis logic
          console.log('Running analysis with options:', options);
        } catch (error) {
          console.error('Error running analysis:', error);
          process.exit(1);
        }
      });
  }

  private getDefaultFromDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }
}
