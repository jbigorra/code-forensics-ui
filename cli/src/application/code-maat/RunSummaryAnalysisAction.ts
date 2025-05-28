import { injectable } from "tsyringe";
import { IAction, IAnalysisOptions, ICodeMaatService, IFileWriter } from "../interfaces";

@injectable()
export class RunSummaryAnalysisAction implements IAction<void, IAnalysisOptions> {
  constructor(
    private readonly codeMaatService: ICodeMaatService,
    private readonly csvRepository: IFileWriter
  ) {}

  async run(options: IAnalysisOptions): Promise<void> {
    try {
      const summary = await this.codeMaatService.getSummary(options.gitLogFilename);

    const cleanedSummary = summary.split('\n').slice(1).join('\n');

    await this.csvRepository.create(cleanedSummary, {
        outputFolder: options.outputFolder,
        fileName: 'summary.csv'
      });

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
