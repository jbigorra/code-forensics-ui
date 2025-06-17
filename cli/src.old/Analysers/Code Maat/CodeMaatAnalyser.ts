import { ICodeMaatService } from "../../application/interfaces";
import { injectable } from "tsyringe";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";

const execAsync = promisify(exec);

type CodeMaatAnalysis =
  "summary"               | "authors"           | "communication" |
  "coupling"              | "entity-churn"      | "entity-effort" |
  "entity-ownership"      | "fragmentation"     | "identity"      |
  "main-dev"              | "main-dev-by-revs"  | "messages"      |
  "refactoring-main-dev"  | "revisions"         | "soc"           |
  "age"                   | "abs-churn"         | "author-churn";

type CodeMaatCommandString = string;

@injectable()
export class CodeMaatAnalyser implements ICodeMaatService {
  private readonly jarPath: string;
  private readonly gitLogFilename: string;

  constructor(gitLogFilename: string) {
    this.jarPath = path.join(__dirname, 'bin', 'code-maat-1.0.4-standalone.jar');
    this.gitLogFilename = gitLogFilename;
  }

  async getSummary(): Promise<string> {
    try {
      const command = this._buildCodeMaatCommand("summary")
      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        throw new Error(`Code-maat error: ${stderr}`);
      }

      return stdout;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to run code-maat analysis: ${error.message}`);
      }
      throw error;
    }
  }

  private _buildCodeMaatCommand(analysis: CodeMaatAnalysis): CodeMaatCommandString {
    return `java -jar "${this.jarPath}" -l "${this.gitLogFilename}" -c git2 -a ${analysis}`;
  }
}
