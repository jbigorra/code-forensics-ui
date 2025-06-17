export interface IAction<T1,T2> {
  run(options: T2): Promise<T1>;
}

export interface IAnalysisOptions {
  outputFolder: string;
  gitLogFilename: string;
}

export type FileWriterOptions = {
  outputFolder: string;
  fileName: string;
};

export interface IFileWriter {
  create(content: string, options: FileWriterOptions): Promise<void>;
}

export interface ICodeMaatService {
  getSummary(gitLogFilename: string): Promise<string>;
}
