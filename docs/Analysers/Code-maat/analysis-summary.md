# Summary Analysis

## Overview
The Summary analysis provides a high-level overview of your codebase's change history, offering key statistics about commits, entities, and authors. This analysis serves as a starting point for understanding the scope and characteristics of your development activity before diving into more detailed analyses.

## Analysis Type
**Command:** `summary`

## Purpose
- Get a quick overview of codebase activity and scope
- Understand the scale of development history
- Validate log file completeness and quality
- Establish baseline metrics for other analyses
- Provide context for interpreting detailed analysis results
- Support project reporting and documentation

## Input Requirements
- **Log file:** VCS log data containing commit information
- **Required columns:** `:entity`, `:rev`, `:author`

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `statistic` | The name of the summary statistic |
| `value` | The numerical value for that statistic |

## Summary Statistics Provided

| Statistic | Description |
|-----------|-------------|
| `number-of-commits` | Total number of unique commits/revisions in the dataset |
| `number-of-entities` | Total number of unique files/modules that have been changed |
| `number-of-entities-changed` | Total number of individual file changes across all commits |
| `number-of-authors` | Total number of unique authors/contributors |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a summary
```

### With Options
```bash
# Save summary to file
java -jar code-maat.jar -l logfile.log -c git2 -a summary -o summary-report.csv

# Summary with team mapping
java -jar code-maat.jar -l logfile.log -c git2 -a summary -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-p, --team-map-file`**: Map individual authors to teams for team-level statistics
- **`-t, --temporal-period`**: Group commits within temporal periods

### Filtering Options
- **`-n, --min-revs`**: Filter entities with minimum revisions (affects entity counts)

## Interpretation Guidelines

### Commit Statistics
- **High commit count (>1000):** Mature project with extensive history
- **Low commit count (<100):** New project or limited history in log
- **Very high commit count (>10000):** Large, long-running project

### Entity Statistics
- **Entities vs. Entity Changes ratio:** Indicates average changes per file
  - **High ratio (>10:1):** Frequent changes to same files (hotspots)
  - **Low ratio (<3:1):** Changes spread across many files
- **Large number of entities:** Complex codebase with many components

### Author Statistics
- **Many authors (>20):** Large team or long project history
- **Few authors (<5):** Small team or specialized project
- **Author-to-commit ratio:** Indicates development activity distribution

## Example Output and Interpretation

### Typical Summary Output
```csv
statistic,value
number-of-commits,1247
number-of-entities,342
number-of-entities-changed,3891
number-of-authors,12
```

### Interpretation
- **1,247 commits** across the analyzed period
- **342 unique files** have been modified
- **3,891 total file changes** (average ~3.1 changes per commit)
- **12 different authors** contributed
- **Average changes per file:** 3,891 ÷ 342 = ~11.4 changes per file
- **Average commits per author:** 1,247 ÷ 12 = ~104 commits per author

## Aggregation and Combination Possibilities

### Team-Level Summary
```bash
# Get summary with team-level author aggregation
java -jar code-maat.jar -l logfile.log -c git2 -a summary -p team-mapping.csv
```

### Architectural Layer Summary
```bash
# Get summary aggregated by architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a summary -g layers.txt
```

### Temporal Summary
```bash
# Get summary with temporal grouping (logical commits)
java -jar code-maat.jar -l logfile.log -c git2 -a summary -t days
```

## Combining with Other Analyses

### Recommended Usage Patterns
1. **Start with Summary:** Always begin analysis sessions with summary
2. **Validate Log Quality:** Use summary to check for data completeness
3. **Context for Other Analyses:** Reference summary when interpreting detailed results
4. **Progress Tracking:** Compare summaries over time to track project evolution

### Sequential Analysis Workflow
```bash
# 1. Start with summary overview
java -jar code-maat.jar -l git.log -c git2 -a summary -o summary.csv

# 2. Based on summary, choose appropriate detailed analyses
# If high entity-to-change ratio, focus on hotspots:
java -jar code-maat.jar -l git.log -c git2 -a revisions -r 20 -o hotspots.csv

# If many authors, analyze collaboration:
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv
java -jar code-maat.jar -l git.log -c git2 -a communication -o communication.csv
```

## Use Cases

### 1. Project Assessment
```bash
# Quick project overview for new team members or stakeholders
java -jar code-maat.jar -l git.log -c git2 -a summary
```

### 2. Log File Validation
```bash
# Verify log file completeness and quality
java -jar code-maat.jar -l git.log -c git2 -a summary -o validation.csv
```

### 3. Historical Comparison
```bash
# Compare different time periods
java -jar code-maat.jar -l git-2023.log -c git2 -a summary -o summary-2023.csv
java -jar code-maat.jar -l git-2024.log -c git2 -a summary -o summary-2024.csv
```

### 4. Team Structure Analysis
```bash
# Analyze team-level statistics
java -jar code-maat.jar -l git.log -c git2 -a summary -p teams.csv -o team-summary.csv
```

## Derived Metrics and Calculations

### Activity Intensity Metrics
From the summary statistics, you can calculate:

```
Average Changes per Commit = number-of-entities-changed ÷ number-of-commits
Average Changes per File = number-of-entities-changed ÷ number-of-entities
Average Commits per Author = number-of-commits ÷ number-of-authors
File Churn Ratio = number-of-entities-changed ÷ number-of-entities
```

### Interpretation of Derived Metrics

#### Average Changes per Commit
- **High (>5):** Large commits, possible batch changes or refactoring
- **Low (<2):** Small, focused commits (good practice)
- **Very high (>10):** May indicate merge commits or large refactoring

#### File Churn Ratio
- **High (>20):** Hotspot-heavy codebase with frequent changes to same files
- **Medium (5-20):** Balanced change distribution
- **Low (<5):** Changes spread across many files, possibly growing codebase

## Quality Indicators

### Log File Quality Checks
- **Zero values:** May indicate parsing issues or empty log
- **Unrealistic ratios:** Could suggest log filtering or parsing problems
- **Missing data:** Compare with known project characteristics

### Data Completeness Indicators
- **Author count vs. known team size:** Validates author information
- **Commit count vs. expected activity:** Confirms log completeness
- **Entity count vs. codebase size:** Indicates coverage of changes

## Integration with Development Workflow

### Regular Monitoring
```bash
# Monthly project health check
java -jar code-maat.jar -l monthly-git.log -c git2 -a summary -o monthly-summary.csv
```

### Release Analysis
```bash
# Pre-release summary for release notes
java -jar code-maat.jar -l release-git.log -c git2 -a summary -o release-summary.csv
```

### Onboarding Support
```bash
# Project overview for new team members
java -jar code-maat.jar -l git.log -c git2 -a summary -o project-overview.csv
```

## Advanced Usage

### Comparative Analysis
```bash
# Compare different branches or time periods
git log --format=format:'[%h] %aN %ad %s' --date=short --numstat branch1 > branch1.log
git log --format=format:'[%h] %aN %ad %s' --date=short --numstat branch2 > branch2.log

java -jar code-maat.jar -l branch1.log -c git2 -a summary -o branch1-summary.csv
java -jar code-maat.jar -l branch2.log -c git2 -a summary -o branch2-summary.csv
```

### Filtered Analysis
```bash
# Summary of only significant files (with minimum activity)
java -jar code-maat.jar -l git.log -c git2 -a summary -n 5 -o active-files-summary.csv
```

## Limitations
- **No temporal information:** Summary doesn't show trends over time
- **No complexity metrics:** Doesn't indicate code complexity or size
- **No quality indicators:** Doesn't reflect defect rates or technical debt
- **Aggregated view only:** Doesn't show distribution or outliers

## Best Practices

### Analysis Workflow
1. **Always start with summary** to understand data scope
2. **Validate against known facts** about your project
3. **Use as baseline** for interpreting other analyses
4. **Document summary results** for future reference

### Interpretation
1. **Consider project context** (age, team size, domain)
2. **Compare with similar projects** when possible
3. **Look for unusual ratios** that might indicate issues
4. **Use derived metrics** for deeper insights

### Reporting
1. **Include in all analysis reports** for context
2. **Track changes over time** to monitor project evolution
3. **Share with stakeholders** for project transparency
4. **Use for capacity planning** and resource allocation

## Troubleshooting Common Issues

### Unexpected Zero Values
- **Check log file format** and parsing
- **Verify VCS type** matches log format
- **Ensure log file contains data** for the specified period

### Unrealistic High Values
- **Check for duplicate entries** in log file
- **Verify log extraction** didn't include unwanted data
- **Consider filtering** large merge commits

### Missing Expected Data
- **Verify log time range** covers expected period
- **Check author name consistency** (email vs. name variations)
- **Ensure all relevant branches** are included in log 