import { injectable } from "tsyringe";
import { IApplicationView } from "../interfaces";
import { RunSummaryAnalysisAction } from "../../application/code-maat/RunSummaryAnalysisAction";

@injectable()
export class ApplicationPresenter {
  constructor(
    private readonly applicationView: IApplicationView,
    readonly runSummaryAnalysis: RunSummaryAnalysisAction
  ) {

    this.applicationView.onRunSummaryAnalysis = this.onRunSummaryAnalysis.bind(this);
    this.applicationView.onRunAuthorsAnalysis = this.onRunAuthorsAnalysis.bind(this);
    this.applicationView.onRunCommunicationAnalysis = this.onRunCommunicationAnalysis.bind(this);
    this.applicationView.onRunCouplingAnalysis = this.onRunCouplingAnalysis.bind(this);
    this.applicationView.onRunEntityChurnAnalysis = this.onRunEntityChurnAnalysis.bind(this);
    this.applicationView.onRunEntityEffortAnalysis = this.onRunEntityEffortAnalysis.bind(this);
    this.applicationView.onRunEntityOwnershipAnalysis = this.onRunEntityOwnershipAnalysis.bind(this);
    this.applicationView.onRunFragmentationAnalysis = this.onRunFragmentationAnalysis.bind(this);
    this.applicationView.onRunIdentityAnalysis = this.onRunIdentityAnalysis.bind(this);
    this.applicationView.onRunMainDevAnalysis = this.onRunMainDevAnalysis.bind(this);
    this.applicationView.onRunMainDevByRevsAnalysis = this.onRunMainDevByRevsAnalysis.bind(this);
    this.applicationView.onRunMessagesAnalysis = this.onRunMessagesAnalysis.bind(this);
    this.applicationView.onRunRefactoringMainDevAnalysis = this.onRunRefactoringMainDevAnalysis.bind(this);
    this.applicationView.onRunRevisionsAnalysis = this.onRunRevisionsAnalysis.bind(this);
    this.applicationView.onRunSocAnalysis = this.onRunSocAnalysis.bind(this);
    this.applicationView.onStart = this.onStart.bind(this);
  }

  load() {
    this.applicationView.start();
  }

  async onRunSummaryAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running summary analysis...");

    await this.runSummaryAnalysis.run({
      outputFolder,
      gitLogFilename
    });

    // this.applicationView.displaySummary(summary);
  }

  async onRunAuthorsAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running authors analysis...");
  }

  async onRunCommunicationAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running communication analysis...");
  }

  async onRunCouplingAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running coupling analysis...");
  }

  async onRunEntityChurnAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running entity churn analysis...");
  }

  async onRunEntityEffortAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running entity effort analysis...");
  }

  async onRunEntityOwnershipAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running entity ownership analysis...");
  }

  async onRunFragmentationAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running fragmentation analysis...");
  }

  async onRunIdentityAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running identity analysis...");
  }

  async onRunMainDevAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running main dev analysis...");
  }

  async onRunMainDevByRevsAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running main dev by revs analysis...");
  }

  async onRunMessagesAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running messages analysis...");
  }

  async onRunRefactoringMainDevAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running refactoring main dev analysis...");
  }

  async onRunRevisionsAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running revisions analysis...");
  }

  async onRunSocAnalysis(outputFolder: string, gitLogFilename: string) {
    this.applicationView.displayMessage("Running soc analysis...");
  }

  async onStart() {
    // run validations
  }
}
