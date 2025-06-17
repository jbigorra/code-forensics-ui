import { execSync, spawn } from "child_process";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { once } from "events";
import path from "path";

export type GitLogCommand = {
  startDate: Date;
  endDate: Date;
}

/**
 * The absolute path to the target repository.
 * This is the path to the repository that will be used to run the git log command.
 */
type TargetRepositoryPath = string;

/**
 * The absolute path to the output file.
 * This is the path to the file that will be created by the git log command.
 */
type GitLogOutputFile = string;

export class GitLog {
  private readonly tempDir: string;

  constructor(private readonly targetRepositoryPath: TargetRepositoryPath) {
    if (this._gitDoesNotExist()) {
      throw new Error("Git is not installed. Please install git and try again.");
    }

    if (!existsSync(this.targetRepositoryPath)) {
      throw new Error(`Repository path ${this.targetRepositoryPath} does not exist. Please provide a valid repository path.`);
    }

    this.tempDir = path.join(targetRepositoryPath, "./code-forensics/tmp/gitlog");

    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async run(command: GitLogCommand): Promise<GitLogOutputFile> {
    const { startDate, endDate } = command;
    const child = spawn("git", [
        "log",
        "--pretty=format:[%h] %aN %ad %s",
        "--date=short",
        "--numstat",
        "--since=" + startDate,
        "--until=" + endDate
      ], {
        cwd: this.targetRepositoryPath,
        stdio: ["ignore", "pipe", "inherit"]
      }
    );

    const filename = `${startDate.toISOString()}-${endDate.toISOString()}.log`;
    const outputFile = path.join(this.tempDir, filename);
    const ws = createWriteStream(outputFile);
    child.stdout.pipe(ws);

    return once(ws, "finish").then(() => outputFile)
  }


  private _gitDoesNotExist(): boolean {
    try {
      execSync("git --version");
      return false;
    } catch (_) {
      return true;
    }
  }
}
