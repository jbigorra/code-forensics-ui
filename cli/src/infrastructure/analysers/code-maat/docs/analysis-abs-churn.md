# Absolute Churn Trend Analysis

## Overview
The Absolute Churn Trend analysis tracks code size changes over time by measuring lines of code added and deleted per date. This analysis helps identify development patterns, integration bottlenecks, and periods of high activity. Code churn is strongly correlated with post-release defects, making this analysis valuable for quality assessment and release planning.

## Analysis Type
**Command:** `abs-churn`

## Purpose
- Track code growth and modification patterns over time
- Identify development activity spikes and trends
- Spot integration bottlenecks before iteration deadlines
- Correlate churn with quality issues and defect rates
- Monitor development velocity and team productivity
- Plan releases based on code stability periods

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format)
- **Required columns:** `:date`, `:loc-added`, `:loc-deleted`
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `date` | The date of commits (YYYY-MM-DD format) |
| `added` | Total lines of code added on this date |
| `deleted` | Total lines of code deleted on this date |
| `commits` | Number of commits made on this date |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn
```

### With Options
```bash
# Save churn trend to file
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn -o churn-trend.csv

# Limit to recent activity
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn -r 100
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods (e.g., weeks, months)

## Log File Requirements

### Git Numstat Format
To generate the required log format for Git:
```bash
# Generate log with line change information
git log --pretty=format:'[%h] %aN %ad %s' --date=short --numstat > git-churn.log
```

### Expected Log Format
```
[a1b2c3d] John Doe 2024-01-15 Add user authentication
10      2       src/auth/UserAuth.java
5       0       src/auth/AuthService.java

[e4f5g6h] Jane Smith 2024-01-15 Fix validation bug
0       3       src/validation/Validator.java
8       1       src/validation/Rules.java
```

## Interpretation Guidelines

### Churn Patterns

#### High Addition Days
- **Large positive spikes:** New feature development, major additions
- **Consistent high additions:** Active development periods
- **Gradual increase:** Steady feature development

#### High Deletion Days
- **Large deletion spikes:** Refactoring, code cleanup, feature removal
- **Balanced add/delete:** Code restructuring and optimization
- **High delete, low add:** Technical debt reduction

#### Balanced Churn
- **Similar add/delete ratios:** Maintenance and bug fixes
- **Low overall churn:** Stable periods, minimal changes
- **Cyclical patterns:** Sprint-based development cycles

### Quality Indicators

#### Risk Patterns
- **Very high churn days (>1000 lines):** Potential quality risks
- **Spikes before deadlines:** Integration bottlenecks, rushed development
- **Erratic patterns:** Unstable development process
- **High churn with few commits:** Large, risky changes

#### Healthy Patterns
- **Consistent moderate churn:** Steady, sustainable development
- **Gradual increases:** Controlled feature development
- **Regular cleanup periods:** Proactive technical debt management

## Aggregation and Combination Possibilities

### Temporal Grouping
```bash
# Group by weeks to see weekly trends
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn -t weeks

# Group by months for long-term trends
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn -t months
```

### Architectural Layer Analysis
```bash
# Analyze churn by architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a abs-churn -g layers.txt
```

## Combining with Other Analyses

### Recommended Combinations
1. **Abs-Churn + Revisions:** Correlate churn with change frequency
2. **Abs-Churn + Authors:** Understand team contribution patterns
3. **Abs-Churn + Entity-Churn:** Drill down from dates to specific files
4. **Abs-Churn + Coupling:** Identify churn in coupled components

### Sequential Analysis Example
```bash
# 1. Get overall churn trend
java -jar code-maat.jar -l git.log -c git2 -a abs-churn -o churn-trend.csv

# 2. Identify high-churn entities
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o entity-churn.csv

# 3. Get author contributions
java -jar code-maat.jar -l git.log -c git2 -a author-churn -o author-churn.csv

# 4. Check revision patterns
java -jar code-maat.jar -l git.log -c git2 -a revisions -o revisions.csv
```

### Cross-Analysis Insights
- **High churn + High revisions:** Volatile development periods
- **High churn + Few authors:** Individual productivity spikes or risks
- **Churn spikes + Coupling:** Coordinated changes across components
- **Low churn + High commits:** Many small, focused changes (good practice)

## Use Cases

### 1. Release Planning
```bash
# Analyze churn trends leading up to releases
java -jar code-maat.jar -l release-period.log -c git2 -a abs-churn -t weeks
```

### 2. Development Velocity Tracking
```bash
# Monitor team productivity over time
java -jar code-maat.jar -l git.log -c git2 -a abs-churn -t months -o velocity.csv
```

### 3. Quality Risk Assessment
```bash
# Identify high-risk periods with excessive churn
java -jar code-maat.jar -l git.log -c git2 -a abs-churn -r 50 -o risk-periods.csv
```

### 4. Process Improvement
```bash
# Analyze development patterns for process optimization
java -jar code-maat.jar -l git.log -c git2 -a abs-churn -t weeks -o process-analysis.csv
```

## Advanced Analysis Techniques

### Churn Rate Calculations
From the output data, you can calculate:

```
Net Churn = Added - Deleted
Churn Rate = (Added + Deleted) / 2
Growth Rate = Net Churn / Previous Total LOC
Volatility = Standard Deviation of Daily Churn
```

### Trend Analysis
- **Moving averages:** Smooth out daily variations
- **Seasonal patterns:** Identify recurring cycles
- **Correlation analysis:** Link churn to external factors
- **Anomaly detection:** Spot unusual activity periods

## Integration with Development Workflow

### Continuous Monitoring
```bash
# Daily churn monitoring script
#!/bin/bash
git log --since="1 week ago" --pretty=format:'[%h] %aN %ad %s' --date=short --numstat > weekly.log
java -jar code-maat.jar -l weekly.log -c git2 -a abs-churn -o weekly-churn.csv
```

### Sprint Analysis
```bash
# Analyze churn patterns within sprints
java -jar code-maat.jar -l sprint.log -c git2 -a abs-churn -t days -o sprint-churn.csv
```

### Pre-Release Assessment
```bash
# Check code stability before release
java -jar code-maat.jar -l pre-release.log -c git2 -a abs-churn -r 30 -o stability-check.csv
```

## Research Background
This analysis is based on research showing that:
- Code churn is strongly correlated with post-release defects
- High churn periods often indicate integration problems
- Churn patterns can reveal organizational bottlenecks
- Temporal churn analysis helps predict quality issues

## Limitations
- **Requires numstat data:** Not all VCS logs include line change information
- **Binary files skew results:** Binary changes are counted as 0 or excluded
- **No semantic analysis:** Cannot distinguish between different types of changes
- **Merge commits:** May create artificial spikes in churn data
- **Refactoring bias:** Large refactoring can overshadow normal development

## Best Practices

### Data Collection
1. **Use consistent log format** with numstat information
2. **Filter merge commits** if they create noise
3. **Include all relevant branches** for complete picture
4. **Regular data collection** for trend analysis

### Analysis Interpretation
1. **Consider context** (releases, sprints, team changes)
2. **Look for patterns** rather than individual spikes
3. **Correlate with quality metrics** when available
4. **Account for team size changes** over time

### Action Planning
1. **Investigate high churn periods** for quality risks
2. **Plan releases** during low churn, stable periods
3. **Address process issues** revealed by churn patterns
4. **Monitor trends** for early warning signs

## Output Interpretation Examples

### High Activity Period
```csv
date,added,deleted,commits
2024-01-15,1247,234,12
2024-01-16,892,156,8
2024-01-17,2103,445,15
```
**Interpretation:** High development activity with significant code additions - monitor for quality issues.

### Refactoring Period
```csv
date,added,deleted,commits
2024-02-10,156,1247,6
2024-02-11,89,892,4
2024-02-12,234,1103,7
```
**Interpretation:** Major code cleanup/refactoring with more deletions than additions - positive technical debt reduction.

### Stable Period
```csv
date,added,deleted,commits
2024-03-20,45,12,3
2024-03-21,67,23,4
2024-03-22,34,8,2
```
**Interpretation:** Low, steady churn indicating stable development with small, focused changes.

## Troubleshooting Common Issues

### Missing Churn Data
- **Verify log format** includes numstat information
- **Check VCS support** for line change metrics
- **Ensure proper log extraction** command

### Unrealistic Churn Values
- **Filter binary files** that may skew results
- **Check for merge commits** creating artificial spikes
- **Verify log parsing** is working correctly

### Inconsistent Patterns
- **Consider team changes** affecting development patterns
- **Account for external factors** (holidays, releases)
- **Check data completeness** across time periods

## Visualization Recommendations
- **Time series plots:** Show churn trends over time
- **Stacked bar charts:** Compare additions vs. deletions
- **Moving averages:** Smooth out daily variations
- **Correlation plots:** Link churn to other metrics 