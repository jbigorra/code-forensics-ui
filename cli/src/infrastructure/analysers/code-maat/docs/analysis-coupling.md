# Logical Coupling Analysis

## Overview
The Logical Coupling analysis identifies files that tend to change together over time, even if they have no direct structural dependencies. This analysis reveals hidden architectural dependencies and can help identify modules that should be refactored together, potential design issues, and implicit coupling that may not be obvious from static code analysis.

## Analysis Type
**Command:** `coupling`

## Purpose
- Identify hidden dependencies between modules
- Find files that change together frequently (logical coupling)
- Detect potential architectural issues and design smells
- Guide refactoring decisions and module boundaries
- Understand change propagation patterns
- Identify candidates for co-location or separation

## Input Requirements
- **Log file:** VCS log data containing commit information
- **Required columns:** `:entity`, `:rev`

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The first file in the coupling pair |
| `coupled` | The second file in the coupling pair |
| `degree` | Coupling strength as percentage (0-100) |
| `average-revs` | Average number of revisions for both files |

### Verbose Output (with --verbose-results)
Additional columns when using verbose mode:

| Column | Description |
|--------|-------------|
| `first-entity-revisions` | Total revisions for the first entity |
| `second-entity-revisions` | Total revisions for the second entity |
| `shared-revisions` | Number of times both entities changed together |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a coupling
```

### With Options
```bash
# Get top 50 coupling pairs with detailed information
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -r 50 --verbose-results

# Filter for strong coupling (>50%) with minimum activity
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -i 50 -n 10 -m 5

# Save results to file
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -o coupling-report.csv
```

## Configuration Options

### Coupling Thresholds
- **`-i, --min-coupling`** (default: 30): Minimum coupling percentage to include in results
- **`-x, --max-coupling`** (default: 100): Maximum coupling percentage to include in results
- **`-m, --min-shared-revs`** (default: 5): Minimum number of shared revisions required
- **`-n, --min-revs`** (default: 5): Minimum total revisions for entities to be considered

### Changeset Filtering
- **`-s, --max-changeset-size`** (default: 30): Maximum number of files in a single commit to consider for coupling analysis

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-o, --outfile`**: Write results to specified file instead of stdout
- **`--verbose-results`**: Include detailed revision information in output

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods as logical changesets

## Coupling Degree Calculation

The coupling degree is calculated as:
```
Coupling Degree = (Shared Revisions / Average Total Revisions) × 100
```

Where:
- **Shared Revisions**: Number of commits where both files changed together
- **Average Total Revisions**: (Revisions of File A + Revisions of File B) / 2

## Interpretation Guidelines

### High Coupling (>70%)
- **Strong logical dependency:** Files almost always change together
- **Potential candidates for:**
  - Module consolidation
  - Shared abstraction extraction
  - Co-location in same package/namespace

### Medium Coupling (40-70%)
- **Moderate dependency:** Files frequently change together
- **May indicate:**
  - Related functionality that could be better organized
  - Cross-cutting concerns
  - API and implementation coupling

### Low Coupling (30-40%)
- **Weak dependency:** Occasional co-changes
- **Could indicate:**
  - Incidental coupling
  - Shared infrastructure dependencies
  - Temporal coincidence

### Coupling Patterns to Watch

#### Anti-Patterns
- **High coupling across architectural boundaries:** UI coupled with database layer
- **Configuration files coupled with business logic:** Indicates tight coupling
- **Test files highly coupled with unrelated production code:** Poor test organization

#### Healthy Patterns
- **Related business logic coupled together:** Expected and often beneficial
- **API and implementation files coupled:** Natural and appropriate
- **Related test files coupled with production code:** Good test coverage

## Aggregation and Combination Possibilities

### Temporal Grouping
```bash
# Group commits by day to focus on logical changesets
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -t days
```

### Architectural Layer Analysis
```bash
# Analyze coupling at architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -g layers.txt
```

### Filtered Analysis
```bash
# Focus on strong coupling with significant activity
java -jar code-maat.jar -l logfile.log -c git2 -a coupling -i 60 -n 15 -m 8
```

## Combining with Other Analyses

### Recommended Combinations
1. **Coupling + Revisions:** Identify highly coupled, frequently changed files
2. **Coupling + Authors:** Find coupled files with different ownership
3. **Coupling + Churn:** Correlate coupling with code growth patterns
4. **Coupling + Communication:** Analyze team coordination around coupled files

### Sequential Analysis Example
```bash
# 1. Get coupling information
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 50 -o coupling.csv

# 2. Get revision counts for coupled files
java -jar code-maat.jar -l git.log -c git2 -a revisions -o revisions.csv

# 3. Get author information
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv

# 4. Get communication patterns
java -jar code-maat.jar -l git.log -c git2 -a communication -o communication.csv
```

### Cross-Analysis Insights
- **High coupling + High revisions:** Critical architectural hotspots
- **High coupling + Different authors:** Coordination challenges
- **High coupling + High churn:** Volatile, interdependent components
- **Cross-boundary coupling:** Architectural violations

## Use Cases

### 1. Architectural Analysis
```bash
# Find coupling across architectural layers
java -jar code-maat.jar -l git.log -c git2 -a coupling -g architecture.txt -i 40
```

### 2. Refactoring Planning
```bash
# Identify strong coupling candidates for consolidation
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 70 -m 10
```

### 3. Design Validation
```bash
# Check for unexpected coupling patterns
java -jar code-maat.jar -l git.log -c git2 -a coupling --verbose-results -o detailed-coupling.csv
```

## Advanced Configuration

### Fine-Tuning Thresholds
```bash
# Conservative analysis: only very strong, well-established coupling
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 80 -n 20 -m 15

# Exploratory analysis: include weaker coupling patterns
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 25 -n 5 -m 3
```

### Large Codebase Optimization
```bash
# Limit changeset size to avoid noise from large refactoring commits
java -jar code-maat.jar -l git.log -c git2 -a coupling -s 15 -i 50
```

## Research Background
This analysis is based on research showing that:
- Logical coupling often predicts future changes better than structural coupling
- Files that change together frequently may have hidden dependencies
- Coupling analysis can reveal architectural debt and design issues
- Temporal coupling patterns can guide refactoring decisions

## Limitations
- **Large changesets** can create false coupling (use `-s` to filter)
- **Refactoring commits** may create temporary coupling spikes
- **Does not distinguish** between different types of changes
- **Temporal bias:** Recent changes may overshadow historical patterns
- **No semantic analysis:** Cannot distinguish between related vs. coincidental changes

## Best Practices

### Analysis Configuration
1. **Start with conservative thresholds** (high min-coupling, min-shared-revs)
2. **Filter large changesets** to avoid refactoring noise
3. **Use temporal grouping** for cleaner logical changesets
4. **Combine with other metrics** for comprehensive insights

### Interpretation
1. **Investigate high coupling** across architectural boundaries
2. **Look for patterns** rather than individual coupling pairs
3. **Consider the context** of coupled files (related functionality vs. coincidence)
4. **Validate findings** with domain knowledge and team input

### Action Planning
1. **Prioritize high-coupling, high-revision pairs** for refactoring
2. **Consider co-location** for strongly coupled, related files
3. **Extract shared abstractions** for coupled but separate concerns
4. **Improve coordination** for coupled files with different owners

## Output Interpretation Examples

### Strong Coupling Example
```csv
entity,coupled,degree,average-revs
src/user/UserService.java,src/user/UserRepository.java,85,23
```
**Interpretation:** These files change together 85% of the time - likely a service and its repository that should be considered as a unit.

### Cross-Boundary Coupling Example
```csv
entity,coupled,degree,average-revs
src/ui/UserController.java,src/data/DatabaseConfig.java,45,15
```
**Interpretation:** UI layer coupled with data configuration - potential architectural violation requiring investigation.

## Troubleshooting Common Issues

### Too Many Results
- Increase `-i` (min-coupling) threshold
- Increase `-m` (min-shared-revs) requirement
- Decrease `-s` (max-changeset-size) to filter large commits

### Too Few Results
- Decrease `-i` threshold
- Decrease `-m` and `-n` requirements
- Check if temporal grouping is too aggressive

### Noisy Results
- Use `-s` to filter large refactoring commits
- Apply temporal grouping with `-t`
- Focus on specific architectural layers with `-g` 