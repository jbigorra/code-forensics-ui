export interface IApplicationView {
  displayMessage(mesage: string): void;
  start(): void;
  onStart(): Promise<void>;
  onRunSummaryAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunAuthorsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunCommunicationAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunCouplingAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunEntityChurnAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunEntityEffortAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunEntityOwnershipAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunFragmentationAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunIdentityAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunMainDevAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunMainDevByRevsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunMessagesAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunRefactoringMainDevAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunRevisionsAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
  onRunSocAnalysis(outputFolder: string, gitLogFilename: string): Promise<void>;
}
