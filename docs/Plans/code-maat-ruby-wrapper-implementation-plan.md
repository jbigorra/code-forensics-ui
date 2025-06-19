# Code-Maat Ruby Wrapper Implementation Plan

## Executive Summary

This plan outlines the implementation of a comprehensive Ruby wrapper library for the `code-maat-1.0.4-standalone.jar` tool. The wrapper will provide a native Ruby interface to all 19 analysis types supported by code-maat, following test-driven development (TDD) principles and clean architecture patterns.

## Recommendation: Wrapper vs. Rewrite

**Decision: Implement Ruby Wrapper**

### Rationale

- **Proven Tool**: Code-maat is mature with 31 Clojure source files and extensive testing
- **Faster Delivery**: Wrapper can be implemented in weeks vs. months for a rewrite
- **Lower Risk**: Leverages battle-tested analysis algorithms and VCS parsing
- **Existing Infrastructure**: Can reuse current GitLog implementation and JAR
- **Maintenance**: No need to maintain complex statistical analysis code

### Trade-offs Accepted

- JVM dependency (already present)
- Slightly more complex deployment
- Less control over low-level optimizations

## Architecture Overview

```
┌─────────────────────────────────────┐
│          Application Layer          │
│  (Use Cases & Business Logic)       │
├─────────────────────────────────────┤
│         Domain Layer               │
│  (Analysis Types & Value Objects)   │
├─────────────────────────────────────┤
│       Infrastructure Layer         │
│  (CodeMaat Wrapper & GitLog)       │
├─────────────────────────────────────┤
│       Presentation Layer           │
│  (CLI Commands & Output Formatters) │
└─────────────────────────────────────┘
```

## Phase 1: Foundation and Core Infrastructure

### 1.1 Project Structure Setup

**Deliverable**: Well-organized Ruby gem structure

**Directory Structure**:

```
cli/src/code-forensics/
├── application/
│   └── use-cases/
│       ├── run_summary_analysis.rb
│       ├── run_hotspot_analysis.rb
│       └── run_comprehensive_analysis.rb
├── domain/
│   ├── analysis_types/
│   │   ├── summary_analysis.rb
│   │   ├── revisions_analysis.rb
│   │   ├── authors_analysis.rb
│   │   └── [... 16 more analysis types]
│   ├── value_objects/
│   │   ├── analysis_result.rb
│   │   ├── file_path.rb
│   │   ├── date_range.rb
│   │   └── analysis_options.rb
│   └── repositories/
│       └── analysis_repository.rb
├── infrastructure/
│   ├── analysers/
│   │   ├── code_maat_wrapper.rb
│   │   ├── jar_executor.rb
│   │   └── csv_parser.rb
│   └── git_log.rb (existing)
└── presentation/
    ├── cli/
    │   ├── analysis_command.rb
    │   └── output_formatter.rb
    └── formatters/
        ├── table_formatter.rb
        ├── json_formatter.rb
        └── csv_formatter.rb
```

**Acceptance Criteria**:

- [ ] Proper Ruby gem structure with gemspec
- [ ] Clean architecture folder organization
- [ ] All dependencies properly declared
- [ ] README with basic usage instructions

### 1.2 Core Value Objects and Domain Models

**Deliverable**: Domain models representing analysis concepts

**Test Cases to Implement First**:

```ruby
# spec/domain/value_objects/analysis_result_spec.rb
describe AnalysisResult do
  it "creates a valid analysis result with data and metadata"
  it "raises error for invalid CSV data"
  it "provides accessor methods for columns"
  it "converts to hash representation"
end

# spec/domain/value_objects/date_range_spec.rb
describe DateRange do
  it "creates valid date range with start and end dates"
  it "validates start date is before end date"
  it "formats dates in ISO8601 format for code-maat"
  it "handles same start and end dates"
end

# spec/domain/value_objects/analysis_options_spec.rb
describe AnalysisOptions do
  it "creates options with default values"
  it "validates supported analysis types"
  it "handles output file specifications"
  it "manages filtering and aggregation options"
end
```

**Implementation Order**:

1. Write failing tests for each value object
2. Implement minimal classes to pass tests
3. Refactor and add edge case handling
4. Add validation and error handling

### 1.3 JAR Executor Infrastructure

**Deliverable**: Robust JAR execution with error handling

**Test Cases**:

```ruby
# spec/infrastructure/analysers/jar_executor_spec.rb
describe JarExecutor do
  context "when JAR file exists" do
    it "executes java command successfully"
    it "captures stdout output"
    it "captures stderr for errors"
    it "returns proper exit codes"
  end

  context "when JAR file is missing" do
    it "raises descriptive error"
  end

  context "when Java is not installed" do
    it "raises Java not found error"
  end

  context "with invalid arguments" do
    it "raises argument validation error"
  end
end
```

**Implementation**:

```ruby
class JarExecutor
  class JavaNotFoundError < StandardError; end
  class JarNotFoundError < StandardError; end
  class ExecutionError < StandardError; end

  def initialize(jar_path)
    @jar_path = jar_path
    validate_prerequisites
  end

  def execute(arguments)
    # Implementation with proper error handling
  end

  private

  def validate_prerequisites
    # Check Java installation
    # Check JAR file existence
  end
end
```

## Phase 2: Analysis Type Implementation

### 2.1 Core Analysis Types (Priority 1)

**Target**: 5 most commonly used analysis types

**Order of Implementation**:

1. **Summary** - Basic overview and validation
2. **Revisions** - File change frequency
3. **Authors** - Contributor distribution
4. **Entity-Churn** - Code volatility
5. **Coupling** - Change correlation

**Test-First Implementation Pattern**:

```ruby
# spec/domain/analysis_types/summary_analysis_spec.rb
describe SummaryAnalysis do
  let(:git_log_file) { "path/to/git.log" }
  let(:analysis) { described_class.new(git_log_file) }

  describe "#run" do
    context "with valid git log" do
      it "returns summary statistics"
      it "includes number of commits"
      it "includes number of entities"
      it "includes number of authors"
    end

    context "with empty git log" do
      it "returns zero statistics"
    end

    context "with malformed git log" do
      it "raises parsing error"
    end
  end

  describe "#command_arguments" do
    it "builds correct code-maat arguments"
    it "includes analysis type 'summary'"
    it "includes log file path"
    it "includes git2 format specifier"
  end
end
```

**Implementation Template**:

```ruby
module CodeForensics
  module Domain
    module AnalysisTypes
      class SummaryAnalysis
        include AnalysisBase

        def analysis_type
          'summary'
        end

        def required_columns
          [:statistic, :value]
        end

        def validate_result(csv_data)
          # Specific validation for summary analysis
        end

        private

        def default_options
          {
            analysis: analysis_type,
            log_file: @log_file,
            format: 'git2'
          }
        end
      end
    end
  end
end
```

### 2.2 Advanced Analysis Types (Priority 2)

**Target**: 8 intermediate analysis types

**Implementation Order**: 6. **Main-Dev** - Primary contributors 7. **Entity-Ownership** - Detailed ownership 8. **Author-Churn** - Individual productivity 9. **Communication** - Developer interaction 10. **Fragmentation** - Collaboration complexity 11. **Age** - File maturity 12. **Entity-Effort** - Development investment 13. **Abs-Churn** - Temporal change patterns

### 2.3 Specialized Analysis Types (Priority 3)

**Target**: 6 specialized analysis types

**Implementation Order**: 14. **Main-Dev-By-Revs** - Frequency-based ownership 15. **Refactoring-Main-Dev** - Cleanup specialists 16. **Messages** - Commit message analysis 17. **Identity** - Author consolidation 18. **SOC** (Sum of Coupling) - Architectural centrality 19. **Coupling** - Advanced coupling analysis

## Phase 3: Code-Maat Wrapper Implementation

### 3.1 Core Wrapper Class

**Deliverable**: Main interface to code-maat JAR

**Test Cases**:

```ruby
# spec/infrastructure/analysers/code_maat_wrapper_spec.rb
describe CodeMaatWrapper do
  let(:jar_path) { "path/to/code-maat.jar" }
  let(:wrapper) { described_class.new(jar_path) }

  describe "#run_analysis" do
    context "with summary analysis" do
      it "executes correct command"
      it "returns parsed CSV data"
      it "handles empty results"
    end

    context "with invalid analysis type" do
      it "raises unknown analysis error"
    end

    context "with missing log file" do
      it "raises file not found error"
    end
  end

  describe "#available_analyses" do
    it "returns list of supported analysis types"
  end

  describe "#validate_options" do
    it "validates required options for each analysis type"
    it "provides helpful error messages"
  end
end
```

**Implementation**:

```ruby
class CodeMaatWrapper
  SUPPORTED_ANALYSES = %w[
    summary revisions authors entity-churn coupling
    main-dev entity-ownership author-churn communication
    fragmentation age entity-effort abs-churn
    main-dev-by-revs refactoring-main-dev messages
    identity soc
  ].freeze

  def initialize(jar_path)
    @jar_executor = JarExecutor.new(jar_path)
  end

  def run_analysis(analysis_type, log_file, options = {})
    validate_analysis_type(analysis_type)
    validate_log_file(log_file)

    command_args = build_command_arguments(analysis_type, log_file, options)
    result = @jar_executor.execute(command_args)

    parse_csv_result(result.stdout)
  end

  private

  def build_command_arguments(analysis_type, log_file, options)
    # Build array of command line arguments
  end

  def parse_csv_result(csv_output)
    # Parse CSV and return structured data
  end
end
```

### 3.2 CSV Parser and Result Processing

**Deliverable**: Robust CSV parsing with error handling

**Test Cases**:

```ruby
# spec/infrastructure/analysers/csv_parser_spec.rb
describe CsvParser do
  describe "#parse" do
    context "with valid CSV" do
      it "returns array of hashes"
      it "handles quoted fields"
      it "handles empty cells"
    end

    context "with malformed CSV" do
      it "raises parsing error with line number"
    end

    context "with empty CSV" do
      it "returns empty array"
    end
  end

  describe "#validate_columns" do
    it "ensures required columns are present"
    it "provides helpful error for missing columns"
  end
end
```

## Phase 4: Application Use Cases

### 4.1 Single Analysis Use Cases

**Deliverable**: Business logic for individual analyses

**Test Cases**:

```ruby
# spec/application/use_cases/run_summary_analysis_spec.rb
describe RunSummaryAnalysis do
  let(:git_log_file) { "spec/fixtures/sample.log" }
  let(:use_case) { described_class.new }

  describe "#execute" do
    context "with valid input" do
      it "returns analysis result"
      it "includes metadata about execution"
      it "validates input parameters"
    end

    context "with date range filtering" do
      it "filters git log by date range"
      it "runs analysis on filtered data"
    end

    context "with invalid git log" do
      it "raises descriptive error"
    end
  end
end
```

### 4.2 Comprehensive Analysis Use Cases

**Deliverable**: Complex workflows combining multiple analyses

**Test Cases**:

```ruby
# spec/application/use_cases/run_hotspot_analysis_spec.rb
describe RunHotspotAnalysis do
  describe "#execute" do
    it "combines revisions, authors, and churn analyses"
    it "identifies high-risk files"
    it "provides actionable recommendations"
    it "handles cases with no hotspots"
  end
end

# spec/application/use_cases/run_comprehensive_analysis_spec.rb
describe RunComprehensiveAnalysis do
  describe "#execute" do
    it "runs full suite of relevant analyses"
    it "provides executive summary"
    it "identifies key findings and recommendations"
    it "handles large repositories efficiently"
  end
end
```

## Phase 5: CLI Integration

### 5.1 Command Line Interface

**Deliverable**: Thor-based CLI commands

**Test Cases**:

```ruby
# spec/presentation/cli/analysis_command_spec.rb
describe AnalysisCommand do
  describe "#summary" do
    it "runs summary analysis with default options"
    it "accepts custom date range"
    it "outputs to specified file"
    it "displays results in table format"
  end

  describe "#hotspots" do
    it "identifies and displays code hotspots"
    it "accepts threshold parameters"
    it "provides actionable recommendations"
  end

  describe "#comprehensive" do
    it "runs full analysis suite"
    it "generates executive summary"
    it "saves results to directory"
  end
end
```

**Implementation**:

```ruby
class AnalysisCommand < Thor
  desc "summary", "Generate summary analysis of repository"
  option :log_file, type: :string, desc: "Path to git log file"
  option :start_date, type: :string, desc: "Start date (YYYY-MM-DD)"
  option :end_date, type: :string, desc: "End date (YYYY-MM-DD)"
  option :output, type: :string, desc: "Output file path"

  def summary
    # Implementation
  end

  desc "hotspots", "Identify code hotspots requiring attention"
  option :threshold, type: :numeric, default: 10, desc: "Minimum revisions threshold"

  def hotspots
    # Implementation
  end
end
```

### 5.2 Output Formatting

**Deliverable**: Multiple output formats (table, JSON, CSV)

**Test Cases**:

```ruby
# spec/presentation/formatters/table_formatter_spec.rb
describe TableFormatter do
  describe "#format" do
    it "creates ASCII table from analysis results"
    it "handles wide content gracefully"
    it "sorts by specified columns"
    it "limits rows when requested"
  end
end

# spec/presentation/formatters/json_formatter_spec.rb
describe JsonFormatter do
  describe "#format" do
    it "creates valid JSON from analysis results"
    it "includes metadata about analysis"
    it "handles nested data structures"
  end
end
```

## Phase 6: Integration and Testing

### 6.1 Integration Tests

**Deliverable**: End-to-end test suite

**Test Cases**:

```ruby
# spec/integration/full_analysis_spec.rb
describe "Full Analysis Integration" do
  let(:test_repository) { "spec/fixtures/test_repo" }

  context "with real git repository" do
    it "runs summary analysis successfully"
    it "identifies expected hotspots"
    it "produces consistent results across runs"
    it "handles edge cases (empty repo, single commit)"
  end

  context "with sample log files" do
    it "processes various log formats correctly"
    it "handles malformed log entries gracefully"
    it "produces expected output for known inputs"
  end
end
```

### 6.2 Performance Tests

**Deliverable**: Performance benchmarks and optimization

**Test Cases**:

```ruby
# spec/performance/analysis_performance_spec.rb
describe "Analysis Performance" do
  context "with large repositories" do
    it "completes summary analysis within acceptable time"
    it "handles memory usage efficiently"
    it "scales linearly with log file size"
  end

  context "with comprehensive analysis" do
    it "completes full suite within reasonable time"
    it "provides progress feedback for long operations"
  end
end
```

## Phase 7: Documentation and Examples

### 7.1 API Documentation

**Deliverable**: Comprehensive documentation

**Components**:

- YARD documentation for all public APIs
- Usage examples for each analysis type
- Architecture decision records (ADRs)
- Performance characteristics documentation

### 7.2 Example Scripts and Use Cases

**Deliverable**: Real-world usage examples

**Examples to Create**:

```ruby
# examples/basic_analysis.rb
# Demonstrates single analysis execution

# examples/hotspot_detection.rb
# Shows how to identify problematic code areas

# examples/team_analysis.rb
# Analyzes team collaboration patterns

# examples/release_analysis.rb
# Provides insights for release planning

# examples/comprehensive_report.rb
# Generates full project health report
```

## Phase 8: Production Readiness

### 8.1 Error Handling and Logging

**Deliverable**: Robust error handling and observability

**Components**:

- Structured logging with different levels
- Detailed error messages with recovery suggestions
- Graceful degradation for partial failures
- Monitoring and alerting hooks

### 8.2 Configuration Management

**Deliverable**: Flexible configuration system

**Features**:

- Configuration files for default options
- Environment variable support
- Command-line option precedence
- Validation of configuration values

## Implementation Guidelines

### Test-Driven Development Process

1. **Red**: Write failing test that describes desired behavior
2. **Green**: Write minimal code to make test pass
3. **Refactor**: Improve code quality while keeping tests green
4. **Repeat**: Continue for each small increment

### Code Quality Standards

**Ruby Style Guidelines**:

- Follow Rubocop rules with project-specific customizations
- Use descriptive method and variable names
- Prefer explicit over implicit code
- Write self-documenting code with minimal comments

**Testing Standards**:

- Maintain >95% test coverage
- Use RSpec for behavior-driven testing
- Include both positive and negative test cases
- Test edge cases and error conditions

**Architecture Principles**:

- Follow Single Responsibility Principle
- Use Dependency Injection for testability
- Separate concerns across clean architecture layers
- Prefer composition over inheritance

## Risk Mitigation

### Technical Risks

1. **JAR Dependency Issues**

   - Mitigation: Include JAR in gem distribution
   - Fallback: Provide download/installation scripts

2. **Java Version Compatibility**

   - Mitigation: Test with multiple Java versions
   - Documentation: Clear Java requirements

3. **Large Repository Performance**
   - Mitigation: Implement streaming for large logs
   - Optimization: Add progress reporting

### Process Risks

1. **Scope Creep**

   - Mitigation: Implement phases incrementally
   - Focus: Deliver MVP first, then enhance

2. **Testing Complexity**
   - Mitigation: Use test fixtures and mocks
   - Strategy: Balance unit and integration tests

## Success Criteria

### Functional Requirements

- [ ] All 19 analysis types implemented and tested
- [ ] Compatible with existing GitLog infrastructure
- [ ] CLI interface matches planned specification
- [ ] Output formats support JSON, CSV, and table display

### Non-Functional Requirements

- [ ] Test coverage >95%
- [ ] Performance: Summary analysis <5 seconds for typical repositories
- [ ] Memory usage: <500MB for large repositories
- [ ] Documentation: Complete API docs and examples

### User Experience Requirements

- [ ] Clear error messages with recovery suggestions
- [ ] Progress feedback for long-running operations
- [ ] Intuitive CLI interface
- [ ] Comprehensive help system

## Timeline Estimation

**Phase 1**: Foundation (5-7 days)
**Phase 2**: Analysis Types (15-20 days)
**Phase 3**: Wrapper Implementation (5-7 days)
**Phase 4**: Use Cases (3-5 days)
**Phase 5**: CLI Integration (3-5 days)
**Phase 6**: Testing (5-7 days)
**Phase 7**: Documentation (3-5 days)
**Phase 8**: Production (2-3 days)

**Total Estimated Time**: 41-59 days (8-12 weeks)

## Conclusion

This comprehensive plan provides a structured approach to implementing a robust Ruby wrapper for code-maat. By following TDD principles and clean architecture patterns, we'll create a maintainable, well-tested codebase that provides excellent developer experience while leveraging the proven capabilities of the existing code-maat tool.

The phased approach allows for incremental delivery and early feedback, while the emphasis on testing ensures reliability and maintainability for long-term success.
