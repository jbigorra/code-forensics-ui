import fs from 'fs/promises';
import path from "path";
import { IFileWriter } from "../../application/interfaces";
import { FileWriterOptions } from "../../application/interfaces";
import { injectable } from 'tsyringe';

@injectable()
export class CSVRepository implements IFileWriter {
  async create(content: string, options: FileWriterOptions): Promise<void> {
    await fs.writeFile(path.join(options.outputFolder, options.fileName), content);
  }
}
