import { Command } from "commander";
import { IApplicationView } from "../interfaces";

export class CLIApplication implements IApplicationView {

  constructor(private readonly program: Command) {}
  onRunSummaryAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunAuthorsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunCouplingAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async start(): Promise<void> {
    this.program
      .name('foran')
      .description('A CLI tool for code forensics analysis')
      .version('0.1.0');
  }

  displayMessage(message: string): void {
    console.log(message);
  }

  async onStart(): Promise<void> {
    await this.program.parseAsync(process.argv);
  }

  onRunCommunicationAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunEntityChurnAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunEntityEffortAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunEntityOwnershipAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunFragmentationAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunIdentityAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunMainDevAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunMainDevByRevsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunMessagesAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunRefactoringMainDevAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunRevisionsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onRunSocAnalysis(outputFolder: string, gitLogFilename: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
