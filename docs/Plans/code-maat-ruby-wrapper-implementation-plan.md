# CodeMaatClient Ruby Gem Implementation Plan

## Executive Summary

This plan outlines the implementation of a standalone Ruby gem that provides a client interface to the `code-maat-1.0.4-standalone.jar` tool. The gem will provide a clean, focused Ruby interface to all 19 analysis types supported by code-maat, following test-driven development (TDD) principles and clean architecture patterns. This gem will be consumed by the code-forensics project and can be reused by other projects.

## 🤖 LLM Assistant Instructions

This plan is designed for step-by-step implementation by an LLM assistant. Each phase includes:

- **Clear deliverables** with acceptance criteria
- **Exact file paths** where code should be created
- **Complete test cases** to implement first (TDD)
- **Implementation templates** with specific Ruby code
- **Validation steps** to verify correctness

### How to Use This Plan:

1. **Work sequentially** through phases 1-8
2. **Always implement tests first** before any production code
3. **Use the provided templates** as starting points
4. **Validate each step** using the acceptance criteria
5. **Ask for clarification** if any requirement is ambiguous

## Architecture Decision: Separate Gem vs. Embedded

**Decision: Create Standalone `code_maat_client` Gem**

### Rationale

- **Reusability**: Other projects can use the wrapper independently
- **Single Responsibility**: Gem focuses solely on code-maat wrapping
- **Clean Architecture**: Clear separation between wrapper and application logic
- **Independent Versioning**: Gem can be versioned and released independently
- **Community Value**: Potential for community adoption and contribution
- **Testing Isolation**: Easier to test wrapper functionality in isolation

### Gem Scope (What's Included)

✅ **Include in Gem:**

- Pure code-maat JAR client
- All 19 analysis types
- JAR execution infrastructure
- CSV parsing and validation
- Error handling and logging
- Ruby-friendly API

❌ **Exclude from Gem:**

- CLI interface (Thor commands)
- GitLog generation (code-forensics responsibility)
- Composite analyses (hotspots, etc.)
- Presentation/formatting layers
- File system operations beyond JAR execution

### Integration with Code-Forensics

The code-forensics project will consume this gem via Gemfile:

```ruby
# code-forensics/Gemfile
gem 'code_maat_client', '~> 1.0'

# Usage in code-forensics
require 'code_maat_client'
client = CodeMaatClient.new(jar_path: 'path/to/jar')
results = client.run_analysis('entity-churn', 'git.log')
```

## Architecture Overview

### Gem Architecture (code_maat_client gem)

```
┌─────────────────────────────────────┐
│            Public API               │
│       (CodeMaatClient)              │
├─────────────────────────────────────┤
│        Analysis Types               │
│  (Summary, Revisions, Churn, etc.)  │
├─────────────────────────────────────┤
│      Infrastructure Layer          │
│  (JAR Executor, CSV Parser)         │
├─────────────────────────────────────┤
│         Value Objects               │
│  (AnalysisResult, Options)          │
└─────────────────────────────────────┘
```

### Integration with Code-Forensics

```
┌─────────────────────────────────────┐
│       Code-Forensics Project       │
├─────────────────────────────────────┤
│      Application Layer              │
│  (Use Cases & Business Logic)       │
├─────────────────────────────────────┤
│        Domain Layer                 │
│  (Composite Analyses, Hotspots)     │
├─────────────────────────────────────┤
│     Infrastructure Layer            │
│  (GitLog, code_maat_client gem)     │
├─────────────────────────────────────┤
│      Presentation Layer             │
│  (CLI Commands, Formatters)         │
└─────────────────────────────────────┘
```

## Phase 1: Gem Foundation and Core Infrastructure

### 1.1 Gem Project Structure Setup

**Deliverable**: Standard Ruby gem structure with clean architecture

**🎯 LLM Task**: Create a new Ruby gem project structure

**Exact Directory Structure to Create**:

```
/Users/jbigorra/Projects/code-forensics/
├── code-forensics-ui/              # Existing UI project
└── code_maat_client/               # New gem root directory (sibling to code-forensics-ui)
    ├── lib/
    │   ├── code_maat_client.rb        # Main entry point
    │   └── code_maat_client/
    │       ├── version.rb
    │       ├── client.rb              # Main API class
    │       ├── analysis_types/
    │       │   ├── base.rb
    │       │   ├── summary.rb
    │       │   ├── revisions.rb
    │       │   ├── authors.rb
    │       │   ├── entity_churn.rb
    │       │   ├── coupling.rb
    │       │   └── [... 14 more analysis types]
    │       ├── infrastructure/
    │       │   ├── jar_executor.rb
    │       │   ├── csv_parser.rb
    │       │   └── command_builder.rb
    │       ├── value_objects/
    │       │   ├── analysis_result.rb
    │       │   ├── analysis_options.rb
    │       │   └── execution_result.rb
    │       └── errors/
    │           ├── base_error.rb
    │           ├── java_not_found_error.rb
    │           ├── jar_not_found_error.rb
    │           └── analysis_error.rb
    ├── spec/
    │   ├── spec_helper.rb
    │   ├── code_maat_client/
    │   │   ├── client_spec.rb
    │   │   ├── analysis_types/
    │   │   ├── infrastructure/
    │   │   ├── value_objects/
    │   │   └── errors/
    │   ├── fixtures/
    │   │   ├── sample_git.log
    │   │   └── expected_outputs/
    │   └── integration/
    │       └── full_analysis_spec.rb
    ├── vendor/
    │   └── code-maat-1.0.4-standalone.jar
    ├── code_maat_client.gemspec
    ├── Gemfile
    ├── Rakefile
    ├── README.md
    ├── CHANGELOG.md
    └── .github/
        └── workflows/
            └── ci.yml
```

**🔍 Validation Steps**:

1. Run `bundle install` successfully in gem directory
2. All directories exist as specified
3. Gemspec file is valid (`gem build code_maat_client.gemspec` passes)
4. RSpec can be executed (`bundle exec rspec --init`)
5. Gem can be built and installed locally (`gem install code_maat_client-*.gem`)

**🎯 Specific Files to Create**:

- `/Users/jbigorra/Projects/code-forensics/code_maat_client/Gemfile` - Development dependencies (rspec, etc.)
- `/Users/jbigorra/Projects/code-forensics/code_maat_client/code_maat_client.gemspec` - Gem specification with JAR included
- `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client.rb` - Main entry point and public API
- `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/spec_helper.rb` - RSpec configuration
- `/Users/jbigorra/Projects/code-forensics/code_maat_client/README.md` - Installation and usage instructions

**Acceptance Criteria**:

- [ ] Standard Ruby gem structure with proper gemspec
- [ ] Clean architecture with focused responsibilities
- [ ] All dependencies properly declared (including JAR file)
- [ ] README with installation and usage instructions
- [ ] Gem builds and installs successfully
- [ ] All validation steps pass

### 1.2 Core Value Objects and Domain Models

**Deliverable**: Domain models representing analysis concepts

**🎯 LLM Task**: Implement value objects using strict TDD

**📁 Files to Create** (in this order):

1. `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/value_objects/analysis_result_spec.rb`
2. `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/value_objects/analysis_options_spec.rb`
3. `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/value_objects/execution_result_spec.rb`
4. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/value_objects/analysis_result.rb`
5. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/value_objects/analysis_options.rb`
6. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/value_objects/execution_result.rb`

**Test Cases to Implement First**:

```ruby
# spec/code_maat_client/value_objects/analysis_result_spec.rb
describe CodeMaatClient::AnalysisResult do
  it "creates a valid analysis result with data and metadata"
  it "raises error for invalid CSV data"
  it "provides accessor methods for columns"
  it "converts to hash and array representations"
end

# spec/code_maat_client/value_objects/analysis_options_spec.rb
describe CodeMaatClient::AnalysisOptions do
  it "creates options with default values"
  it "validates supported analysis types"
  it "handles JAR execution parameters"
  it "manages filtering and aggregation options"
end

# spec/code_maat_client/value_objects/execution_result_spec.rb
describe CodeMaatClient::ExecutionResult do
  it "captures stdout, stderr, and exit code"
  it "determines success based on exit code"
  it "provides helpful error messages"
  it "handles empty output gracefully"
end
```

**🔄 TDD Implementation Steps**:

1. **RED**: Write failing test for one behavior
2. **GREEN**: Write minimal code to pass the test
3. **REFACTOR**: Improve code while keeping tests green
4. **REPEAT**: Continue for each test case

**🎯 Implementation Order**:

1. Write failing tests for each value object
2. Implement minimal classes to pass tests
3. Refactor and add edge case handling
4. Add validation and error handling

**🔍 Validation**: All tests pass (`bundle exec rspec spec/code_maat_client/value_objects/`)

### 1.3 JAR Executor Infrastructure

**Deliverable**: Robust JAR execution with error handling

**🎯 LLM Task**: Create JAR execution layer with comprehensive error handling

**📁 Files to Create**:

1. `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/infrastructure/jar_executor_spec.rb` (test first)
2. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/infrastructure/jar_executor.rb`

**🔍 Validation Commands**:

- `bundle exec rspec spec/code_maat_client/infrastructure/jar_executor_spec.rb`
- `java -version` (must work on system)
- JAR file exists at `code_maat_client/vendor/code-maat-1.0.4-standalone.jar`

**Test Cases**:

```ruby
# spec/code_maat_client/infrastructure/jar_executor_spec.rb
describe CodeMaatClient::Infrastructure::JarExecutor do
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
class CodeMaatClient
  module Infrastructure
    class JarExecutor
      def initialize(jar_path)
        @jar_path = jar_path
        validate_prerequisites
      end

      def execute(arguments)
        # Implementation with proper error handling
        # Returns ExecutionResult value object
      end

      private

      def validate_prerequisites
        # Check Java installation
        # Check JAR file existence
      end
    end
  end
end
```

## Phase 2: Analysis Type Implementation

### 2.1 Core Analysis Types (Priority 1)

**🎯 LLM Task**: Implement 5 core analysis types using TDD

**Target**: 5 most commonly used analysis types

**📋 Implementation Checklist** (complete each fully before moving to next):

**Order of Implementation**:

1. **Summary** - Basic overview and validation ✅
2. **Revisions** - File change frequency ⏳
3. **Authors** - Contributor distribution ⏳
4. **Entity-Churn** - Code volatility ⏳
5. **Coupling** - Change correlation ⏳

**📁 File Pattern for Each Analysis**:

- `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/analysis_types/{name}_spec.rb` (test first)
- `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/analysis_types/{name}.rb`
- Integration test in `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/integration/{name}_integration_spec.rb`

**Test-First Implementation Pattern**:

```ruby
# spec/code_maat_client/analysis_types/summary_spec.rb
describe CodeMaatClient::AnalysisTypes::Summary do
  let(:client) { instance_double(CodeMaatClient) }
  let(:analysis) { described_class.new(client) }

  describe "#run" do
    context "with valid git log" do
      it "returns AnalysisResult with summary statistics"
      it "includes number of commits"
      it "includes number of entities"
      it "includes number of authors"
    end

    context "with empty git log" do
      it "returns empty AnalysisResult"
    end

    context "with malformed git log" do
      it "raises AnalysisError"
    end
  end

  describe "#analysis_type" do
    it "returns 'summary'"
  end

  describe "#required_columns" do
    it "returns expected CSV columns"
  end
end
```

**Implementation Template**:

```ruby
class CodeMaatClient
  module AnalysisTypes
    class Summary < Base
      def analysis_type
        'summary'
      end

      def required_columns
        [:statistic, :value]
      end

      def run(log_file, options = {})
        # Delegate to client with analysis-specific logic
        result = @client.execute_analysis(analysis_type, log_file, options)
        validate_result(result)
        AnalysisResult.new(result.data, analysis_metadata)
      end

      private

      def validate_result(result)
        # Specific validation for summary analysis
      end

      def analysis_metadata
        {
          analysis_type: analysis_type,
          required_columns: required_columns,
          description: "Repository summary statistics"
        }
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

**🎯 LLM Task**: Create the main CodeMaatWrapper class

**📁 Files to Create**:

1. `/Users/jbigorra/Projects/code-forensics/code_maat_client/spec/code_maat_client/client_spec.rb` (test first)
2. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/client.rb`

**🔍 Validation Steps**:

- All tests pass: `bundle exec rspec spec/code_maat_client/client_spec.rb`
- Can list all 19 supported analysis types
- Validates input parameters correctly
- Can execute analyses and return structured results

**Test Cases**:

```ruby
# spec/code_maat_client/client_spec.rb
describe CodeMaatClient do
  let(:jar_path) { "vendor/code-maat-1.0.4-standalone.jar" }
  let(:client) { described_class.new(jar_path) }

  describe "#run_analysis" do
    context "with summary analysis" do
      it "executes correct JAR command"
      it "returns AnalysisResult with parsed CSV"
      it "handles empty results gracefully"
    end

    context "with invalid analysis type" do
      it "raises AnalysisError"
    end

    context "with missing log file" do
      it "raises appropriate error"
    end
  end

  describe "#supported_analyses" do
    it "returns list of all 19 analysis types"
  end

  describe "#analysis_for" do
    it "returns correct analysis instance for type"
    it "raises error for unknown analysis type"
  end
end
```

**Implementation**:

```ruby
class CodeMaatClient
  SUPPORTED_ANALYSES = %w[
    summary revisions authors entity-churn coupling
    main-dev entity-ownership author-churn communication
    fragmentation age entity-effort abs-churn
    main-dev-by-revs refactoring-main-dev messages
    identity soc
  ].freeze

  def initialize(jar_path = default_jar_path)
    @jar_executor = Infrastructure::JarExecutor.new(jar_path)
  end

  def run_analysis(analysis_type, log_file, options = {})
    validate_analysis_type(analysis_type)
    validate_log_file(log_file)

    command_args = build_command_arguments(analysis_type, log_file, options)
    execution_result = @jar_executor.execute(command_args)

    # Parse and return structured result
    parse_analysis_result(execution_result, analysis_type)
  end

  def analysis_for(analysis_type)
    # Return analysis instance for given type
    # Factory method for analysis types
    AnalysisTypes.const_get(analysis_type.capitalize).new(self)
  end

  def supported_analyses
    SUPPORTED_ANALYSES.dup
  end

  private

  def default_jar_path
    File.join(__dir__, '..', 'vendor', 'code-maat-1.0.4-standalone.jar')
  end

  def build_command_arguments(analysis_type, log_file, options)
    # Build array of command line arguments for JAR
  end

  def parse_analysis_result(execution_result, analysis_type)
    # Parse CSV output and create AnalysisResult
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

## Phase 4: Gem Packaging and Distribution

### 4.1 Gem Specification and Packaging

**Deliverable**: Production-ready gem that can be published

**🎯 LLM Task**: Create proper gem packaging with JAR inclusion

**📁 Files to Create**:

1. `/Users/jbigorra/Projects/code-forensics/code_maat_client/code_maat_client.gemspec` - Complete gem specification
2. `/Users/jbigorra/Projects/code-forensics/code_maat_client/lib/code_maat_client/version.rb` - Version management
3. `/Users/jbigorra/Projects/code-forensics/code_maat_client/README.md` - Installation and usage documentation
4. `/Users/jbigorra/Projects/code-forensics/code_maat_client/CHANGELOG.md` - Version history

**🔍 Validation Steps**:

- `gem build code_maat_client.gemspec` succeeds
- `gem install code_maat_client-*.gem` works locally
- JAR file is included in built gem
- All dependencies are properly declared
- Documentation is clear and complete

**Gemspec Template**:

```ruby
# code_maat_client.gemspec
require_relative 'lib/code_maat_client/version'

Gem::Specification.new do |spec|
  spec.name          = 'code_maat_client'
  spec.version       = CodeMaatClient::VERSION
  spec.authors       = ['Your Name']
  spec.email         = ['your.email@example.com']

  spec.summary       = 'Ruby wrapper for code-maat analysis tool'
  spec.description   = 'Provides Ruby interface to code-maat JAR for repository analysis'
  spec.homepage      = 'https://github.com/yourusername/code-maat-client-ruby'
  spec.license       = 'MIT'

  spec.files         = Dir['lib/**/*', 'vendor/**/*', 'README.md', 'CHANGELOG.md']
  spec.require_paths = ['lib']

  spec.add_development_dependency 'rspec', '~> 3.12'
  spec.add_development_dependency 'rake', '~> 13.0'

  spec.required_ruby_version = '>= 2.7.0'
end
```

### 4.2 Public API Documentation

**Deliverable**: Complete API documentation with examples

**🎯 LLM Task**: Create comprehensive README with usage examples

**README Sections**:

- Installation instructions
- Basic usage examples for each analysis type
- Configuration options
- Error handling
- Contributing guidelines
- License information

**Usage Examples**:

```ruby
# Basic usage
require 'code_maat_client'

client = CodeMaatClient.new
result = client.analysis_for('summary').run('git.log')
puts result.data

# With options
result = client.analysis_for('revisions').run('git.log', rows: 20)

# Custom JAR path
client = CodeMaatClient.new('/custom/path/to/code-maat.jar')
```

## Phase 5: Integration with Code-Forensics

### 5.1 Gemfile Integration

**Deliverable**: Integration instructions for code-forensics project

**🎯 LLM Task**: Document how to consume the gem in code-forensics

**Integration Steps**:

1. **Add to code-forensics Gemfile**:

```ruby
# code-forensics-ui/cli/Gemfile
gem 'code_maat_client', '~> 1.0'
# or for local development:
gem 'code_maat_client', path: '../../code_maat_client'
```

2. **Update code-forensics architecture**:

```ruby
# code-forensics-ui/cli/src/code-forensics/infrastructure/analysers/code_maat_client_adapter.rb
require 'code_maat_client'

class CodeMaatClientAdapter
  def initialize
    @client = CodeMaatClient.new
  end

  def run_analysis(type, log_file, options = {})
    @client.run_analysis(type, log_file, options)
  end
end
```

3. **Enhance existing use cases**:

```ruby
# code-forensics-ui/cli/src/code-forensics/application/use-cases/run_summary_analysis.rb
class RunSummaryAnalysis
  def initialize(code_maat_adapter = CodeMaatClientAdapter.new)
    @adapter = code_maat_adapter
  end

  def execute(git_log_file, options = {})
    result = @adapter.run_analysis('summary', git_log_file, options)
    # Add code-forensics specific business logic
    present_results(result)
  end
end
```

### 5.2 Migration Guide

**Deliverable**: Step-by-step migration from embedded to gem

**Migration Steps**:

1. Install code_maat_client gem
2. Remove old JAR wrapper code from code-forensics
3. Update imports and class references
4. Test integration thoroughly
5. Update documentation

## Phase 6: Testing and Quality Assurance

### 6.1 Integration Tests

**Deliverable**: End-to-end test suite

**Test Cases**:

```ruby
# spec/integration/full_analysis_spec.rb
describe "Full Analysis Integration" do
  let(:client) { CodeMaatClient.new }
  let(:sample_log) { "spec/fixtures/sample_git.log" }

  context "with real git log data" do
    it "runs summary analysis successfully"
    it "processes all 19 analysis types"
    it "produces consistent results across runs"
    it "handles edge cases (empty log, malformed entries)"
  end

  context "with various log formats" do
    it "processes standard git logs correctly"
    it "handles logs with special characters gracefully"
    it "produces expected output for known inputs"
  end

  context "gem integration" do
    it "can be built and installed as gem"
    it "includes JAR file in distribution"
    it "loads successfully when required"
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

## 🤖 LLM Implementation Guidelines

### Test-Driven Development Process

**🔴 RED**: Write failing test that describes desired behavior
**🟢 GREEN**: Write minimal code to make test pass  
**🔵 REFACTOR**: Improve code quality while keeping tests green
**🔄 REPEAT**: Continue for each small increment

### 🎯 LLM-Specific Instructions

**For Each Implementation Task**:

1. **Start with the test file** - Always create the `_spec.rb` file first
2. **Write one test at a time** - Don't write all tests at once
3. **Run the test to ensure it fails** - Verify the test is actually testing something
4. **Write minimal implementation** - Just enough to make the test pass
5. **Run all tests** - Ensure nothing is broken
6. **Refactor if needed** - Improve code clarity and structure
7. **Commit the working code** - Each cycle should result in working code

**File Creation Order** (always follow this):

1. Create test file with one failing test
2. Create implementation file with minimal code
3. Add more tests one by one
4. Enhance implementation incrementally
5. Add integration tests last

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

## 📅 LLM Implementation Timeline

**🤖 Estimated Time for LLM Assistant**:

**Phase 1**: Gem Foundation (2-3 implementation sessions)
**Phase 2**: Analysis Types (8-12 implementation sessions)  
**Phase 3**: Wrapper Implementation (2-3 implementation sessions)
**Phase 4**: Gem Packaging (1-2 implementation sessions)
**Phase 5**: Code-Forensics Integration (1-2 implementation sessions)
**Phase 6**: Testing & QA (2-3 implementation sessions)
**Phase 7**: Documentation (1-2 implementation sessions)
**Phase 8**: Publication (1 implementation session)

**Total Estimated Time**: 18-28 LLM implementation sessions

**🎯 Per Session Goals**:

- Complete 1-3 related components
- All tests passing
- Code properly structured and documented
- Ready for next session to build upon

## 🎯 Ready for LLM Implementation

This plan is now optimized for LLM assistant implementation with:

✅ **Clear Task Instructions** - Each phase has specific LLM tasks
✅ **Exact File Paths** - No ambiguity about where to create files  
✅ **TDD Workflow** - Strict test-first approach with validation steps
✅ **Implementation Templates** - Concrete code examples to follow
✅ **Validation Commands** - Specific commands to verify each step
✅ **Session-Based Timeline** - Realistic estimates for LLM work sessions

### 🚀 Next Steps for LLM Assistant

1. **Start with Phase 1.1** - Gem project structure setup
2. **Follow the TDD cycle** - Red, Green, Refactor, Repeat
3. **Use validation steps** - Verify each implementation works
4. **Focus on gem scope** - Pure wrapper, no CLI or use cases
5. **Test gem integration** - Ensure it works as a dependency
6. **Document clearly** - Make it easy for code-forensics to consume

### 📦 Final Deliverable

A standalone Ruby gem that:

- ✅ Wraps all 19 code-maat analysis types
- ✅ Provides clean, Ruby-friendly API
- ✅ Includes JAR file in distribution
- ✅ Has comprehensive test coverage
- ✅ Can be easily integrated into code-forensics project
- ✅ Follows Ruby gem best practices

This approach provides maximum flexibility, reusability, and maintainability while keeping responsibilities clearly separated.
