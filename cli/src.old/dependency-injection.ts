import { container } from 'tsyringe';
import { RunSummaryAnalysisAction } from './application/code-maat/RunSummaryAnalysisAction';
import { CSVRepository } from './infrastructure/repositories/CSVRepository';
import { CodeMaatAnalyser } from './Analysers/Code Maat/CodeMaatAnalyser';

container.register(RunSummaryAnalysisAction.name, RunSummaryAnalysisAction);
container.register(CSVRepository.name, CSVRepository);
container.register(CodeMaatAnalyser.name, CodeMaatAnalyser);

