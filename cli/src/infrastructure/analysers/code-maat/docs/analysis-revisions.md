# Revisions Analysis

## Overview
The Revisions analysis counts the total number of commits/revisions for each entity (file/module) in your codebase. This analysis helps identify the most frequently changed files, which often correlate with complexity, instability, and potential quality issues. High revision counts can indicate hotspots that require attention.

## Analysis Type
**Command:** `revisions`

## Purpose
- Identify the most frequently changed files (hotspots)
- Find stable vs. volatile code areas
- Prioritize refactoring efforts based on change frequency
- Understand development activity patterns
- Correlate change frequency with defect rates

## Input Requirements
- **Log file:** VCS log data containing commit information
- **Required columns:** `:entity`, `:rev`

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `n-revs` | Total number of revisions/commits for this entity |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a revisions
```

### With Options
```bash
# Limit output to top 50 most changed files
java -jar code-maat.jar -l logfile.log -c git2 -a revisions -r 50

# Save results to file
java -jar code-maat.jar -l logfile.log -c git2 -a revisions -o revisions-report.csv

# Filter by minimum revisions (focus on actively maintained files)
java -jar code-maat.jar -l logfile.log -c git2 -a revisions -n 10
```

## Configuration Options

### Filtering Options
- **`-n, --min-revs`** (default: 5): Minimum number of revisions required for an entity to be included in the analysis
- **`-r, --rows`**: Maximum number of rows to include in the output

### Output Options
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers defined in a group file
- **`-t, --temporal-period`**: Group commits within a temporal period as single logical commits

## Interpretation Guidelines

### High Revision Count (Hotspots)
- **Very high (>100 revisions):** May indicate:
  - Configuration files or build scripts
  - Core business logic with frequent changes
  - Files with quality issues requiring frequent fixes
  - Shared utilities or common components
  - Files that violate single responsibility principle

### Medium Revision Count (20-100 revisions)
- **Moderate activity:** Often indicates:
  - Actively developed features
  - Files under regular maintenance
  - Components with evolving requirements

### Low Revision Count (<20 revisions)
- **Stable files:** May indicate:
  - Well-designed, stable components
  - Recently created files
  - Rarely used or legacy code
  - Infrastructure or configuration files

## Aggregation and Combination Possibilities

### Temporal Grouping
```bash
# Group commits by day to reduce noise from multiple commits per day
java -jar code-maat.jar -l logfile.log -c git2 -a revisions -t days
```

### Architectural Layer Analysis
```bash
# Aggregate by architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a revisions -g layers.txt
```

**Layer grouping file format:**
```
UI Layer => src/main/webapp/.*
Business Layer => src/main/java/com/company/business/.*
Data Layer => src/main/java/com/company/data/.*
```

## Combining with Other Analyses

### Recommended Combinations
1. **Revisions + Authors:** Identify high-churn files with multiple contributors
2. **Revisions + Coupling:** Find frequently changed, highly coupled modules
3. **Revisions + Churn:** Correlate change frequency with code size changes
4. **Revisions + Age:** Compare change frequency with file age
5. **Revisions + Effort:** Understand developer effort distribution

### Sequential Analysis Example
```bash
# 1. Get revision counts (hotspots)
java -jar code-maat.jar -l git.log -c git2 -a revisions -o revisions.csv

# 2. Get author information for hotspots
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv

# 3. Get coupling information
java -jar code-maat.jar -l git.log -c git2 -a coupling -o coupling.csv

# 4. Get churn information
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o churn.csv
```

### Cross-Analysis Insights
- **High revisions + High authors:** Problematic files requiring team attention
- **High revisions + High coupling:** Architectural hotspots needing refactoring
- **High revisions + Low churn:** Files with many small fixes (quality issues)
- **High revisions + High churn:** Volatile, growing components

## Use Cases

### 1. Hotspot Identification
```bash
# Find top 20 most changed files
java -jar code-maat.jar -l git.log -c git2 -a revisions -r 20
```

### 2. Architectural Analysis
```bash
# Analyze change patterns by architectural layer
java -jar code-maat.jar -l git.log -c git2 -a revisions -g architecture.txt
```

### 3. Stability Assessment
```bash
# Focus on files with significant activity
java -jar code-maat.jar -l git.log -c git2 -a revisions -n 20
```

## Research Background
This analysis is based on research findings that show:
- Files with high revision counts often have more defects
- Change frequency is a strong predictor of future defects
- The "80/20 rule" often applies: 20% of files account for 80% of changes
- Frequent changes may indicate design problems or evolving requirements

## Limitations
- Does not distinguish between different types of changes (features vs. bug fixes)
- May be skewed by refactoring activities or formatting changes
- Does not account for the size or complexity of changes
- Temporal aspects are not considered unless explicitly grouped

## Best Practices
1. **Combine with other metrics** for comprehensive analysis
2. **Use temporal grouping** to reduce noise from multiple daily commits
3. **Filter by minimum revisions** to focus on actively maintained code
4. **Regular monitoring** to track hotspot evolution over time
5. **Cross-reference with defect data** to validate hotspot identification
6. **Consider architectural boundaries** when interpreting results

## Advanced Usage

### Time-Based Analysis
```bash
# Group commits by week to see weekly change patterns
java -jar code-maat.jar -l git.log -c git2 -a revisions -t weeks
```

### Filtered Analysis
```bash
# Focus on source code files only (exclude config/build files)
# Use appropriate log filtering before analysis
java -jar code-maat.jar -l filtered-git.log -c git2 -a revisions
```

## Output Interpretation Tips
- **Top 10% of files** by revision count are your primary hotspots
- **Files with >3x average revisions** warrant investigation
- **Sudden spikes** in revision count may indicate quality issues
- **Consistent high revision files** may need architectural review 