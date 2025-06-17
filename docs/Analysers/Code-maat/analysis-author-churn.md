# Author Churn Analysis

## Overview
The Author Churn analysis aggregates code size changes (lines added and deleted) by individual authors, providing insights into team member contributions, productivity patterns, and coding styles. This analysis helps identify high-impact contributors, understand team dynamics, and assess individual development patterns over time.

## Analysis Type
**Command:** `author-churn`

## Purpose
- Analyze individual author contributions and productivity
- Identify high-impact contributors and their coding patterns
- Understand team member specializations and work distribution
- Assess coding styles (addition-heavy vs. refactoring-focused)
- Monitor team productivity and contribution balance
- Support performance reviews and team planning

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format)
- **Required columns:** `:author`, `:loc-added`, `:loc-deleted`
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `author` | The name/email of the author |
| `added` | Total lines of code added by this author |
| `deleted` | Total lines of code deleted by this author |
| `commits` | Total number of commits by this author |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn
```

### With Options
```bash
# Get top 20 contributors by churn
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -r 20

# Save author churn analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -o author-churn.csv

# Analyze with team mapping
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-p, --team-map-file`**: Map individual authors to teams for team-level analysis
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods

### Filtering Options
- **`-n, --min-revs`**: Filter authors with minimum number of commits

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

### Author Contribution Patterns

#### High Addition Authors
- **Feature developers:** Focus on new functionality and feature development
- **Growth contributors:** Expanding codebase with new capabilities
- **Junior developers:** Often add more code while learning patterns

#### High Deletion Authors
- **Refactoring specialists:** Focus on code cleanup and optimization
- **Senior developers:** Often remove redundant or obsolete code
- **Technical debt reducers:** Actively improving code quality

#### Balanced Contributors
- **Maintenance developers:** Mix of additions and deletions for bug fixes
- **Full-stack contributors:** Work across different types of changes
- **Experienced team members:** Balanced approach to development

### Productivity Indicators

#### High Churn Authors
- **Very high total churn (>10,000 lines):** Major contributors or long-term team members
- **High additions with many commits:** Active feature development
- **High deletions with fewer commits:** Focused refactoring efforts

#### Moderate Churn Authors
- **Balanced contributions:** Steady team members with consistent output
- **Specialized work:** Contributors focused on specific areas

#### Low Churn Authors
- **New team members:** Recently joined or part-time contributors
- **Specialized roles:** Documentation, testing, or configuration focus
- **Quality-focused:** Small, precise changes with high impact

## Aggregation and Combination Possibilities

### Team-Level Analysis
```bash
# Analyze churn at team level instead of individual authors
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -p team-mapping.csv
```

**Team mapping file format (CSV):**
```csv
author,team
john.doe@company.com,backend-team
jane.smith@company.com,frontend-team
bob.wilson@company.com,backend-team
alice.brown@company.com,devops-team
```

### Temporal Analysis
```bash
# Group by time periods to see author contribution trends
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -t months
```

### Architectural Focus Analysis
```bash
# Analyze author contributions by architectural layers
java -jar code-maat.jar -l logfile.log -c git2 -a author-churn -g layers.txt
```

## Combining with Other Analyses

### Recommended Combinations
1. **Author-Churn + Authors:** Compare churn volume with file ownership
2. **Author-Churn + Communication:** Analyze collaboration patterns
3. **Author-Churn + Entity-Churn:** See which authors work on high-churn files
4. **Author-Churn + Coupling:** Understand author impact on coupled components

### Sequential Analysis Example
```bash
# 1. Get author churn overview
java -jar code-maat.jar -l git.log -c git2 -a author-churn -o author-churn.csv

# 2. Get author file ownership
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv

# 3. Get communication patterns
java -jar code-maat.jar -l git.log -c git2 -a communication -o communication.csv

# 4. Get entity ownership details
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o ownership.csv
```

### Cross-Analysis Insights
- **High churn + High file count:** Broad-impact contributors
- **High churn + Low file count:** Deep specialists or refactoring experts
- **High churn + High communication:** Team coordinators or mentors
- **Low churn + High ownership:** Maintainers of stable components

## Use Cases

### 1. Team Performance Analysis
```bash
# Analyze team member contributions over time
java -jar code-maat.jar -l git.log -c git2 -a author-churn -t quarters -o team-performance.csv
```

### 2. Onboarding Assessment
```bash
# Track new team member productivity growth
java -jar code-maat.jar -l recent-git.log -c git2 -a author-churn -r 10 -o onboarding.csv
```

### 3. Specialization Analysis
```bash
# Understand author focus areas by architectural layer
java -jar code-maat.jar -l git.log -c git2 -a author-churn -g architecture.txt -o specialization.csv
```

### 4. Workload Distribution
```bash
# Assess team workload balance
java -jar code-maat.jar -l git.log -c git2 -a author-churn -p teams.csv -o workload.csv
```

## Advanced Analysis Techniques

### Derived Metrics
From the output data, you can calculate:

```
Net Contribution = Added - Deleted
Churn Ratio = Deleted / Added
Productivity = Total Churn / Commits
Refactoring Index = Deleted / (Added + Deleted)
```

### Author Classification
Based on patterns, authors can be classified as:

#### Feature Builders (High Add, Low Delete)
- **Characteristics:** Refactoring Index < 0.3, High additions
- **Role:** Primary feature development, new functionality
- **Typical:** Junior developers, feature team members

#### Refactoring Specialists (High Delete, Moderate Add)
- **Characteristics:** Refactoring Index > 0.5, High deletions
- **Role:** Code quality improvement, technical debt reduction
- **Typical:** Senior developers, architecture team

#### Balanced Contributors (Moderate Add/Delete)
- **Characteristics:** Refactoring Index 0.3-0.5, Balanced churn
- **Role:** Maintenance, bug fixes, incremental improvements
- **Typical:** Experienced team members, full-stack developers

#### Precision Contributors (Low Churn, High Impact)
- **Characteristics:** Low total churn, High commits-to-churn ratio
- **Role:** Careful, targeted changes, critical fixes
- **Typical:** Senior developers, domain experts

## Integration with Development Workflow

### Performance Reviews
```bash
# Generate individual contribution reports
java -jar code-maat.jar -l yearly-git.log -c git2 -a author-churn -o yearly-contributions.csv
```

### Team Planning
```bash
# Analyze team capacity and specializations
java -jar code-maat.jar -l git.log -c git2 -a author-churn -p teams.csv -t quarters
```

### Mentoring Programs
```bash
# Track junior developer progress
java -jar code-maat.jar -l git.log -c git2 -a author-churn -n 5 -o mentoring-progress.csv
```

## Research Background
This analysis is based on research showing that:
- Author contribution patterns correlate with code quality and expertise
- Balanced add/delete ratios often indicate experienced developers
- High deletion rates may indicate refactoring expertise
- Contribution patterns can predict future role effectiveness

## Limitations
- **Requires numstat data:** Not all VCS logs include line change information
- **Binary files skew results:** Binary changes may not reflect actual contribution
- **No quality assessment:** Lines of code don't indicate code quality
- **Context missing:** Cannot distinguish between different types of contributions
- **Temporal bias:** Recent contributors may appear more prominent

## Best Practices

### Data Collection
1. **Use consistent author identification** (email vs. name)
2. **Include all relevant time periods** for fair comparison
3. **Filter out automated commits** (builds, merges) if needed
4. **Consider team mapping** for organizational insights

### Analysis Interpretation
1. **Consider author tenure** when comparing contributions
2. **Account for role differences** (junior vs. senior expectations)
3. **Look at patterns over time** rather than absolute numbers
4. **Combine with qualitative assessment** of contribution quality

### Action Planning
1. **Identify mentoring opportunities** for imbalanced patterns
2. **Recognize different contribution styles** and their value
3. **Plan team composition** based on specialization patterns
4. **Address workload imbalances** revealed by the analysis

## Output Interpretation Examples

### Feature-Heavy Contributor
```csv
author,added,deleted,commits
john.doe@company.com,15420,2341,156
```
**Interpretation:** High addition rate with moderate deletions - likely focused on feature development. Refactoring Index: 0.13 (Feature Builder).

### Refactoring Specialist
```csv
author,added,deleted,commits
jane.smith@company.com,3245,8932,89
```
**Interpretation:** High deletion rate relative to additions - focused on code cleanup and optimization. Refactoring Index: 0.73 (Refactoring Specialist).

### Balanced Contributor
```csv
author,added,deleted,commits
bob.wilson@company.com,7834,5621,124
```
**Interpretation:** Balanced add/delete ratio - maintenance and incremental development. Refactoring Index: 0.42 (Balanced Contributor).

### Precision Contributor
```csv
author,added,deleted,commits
alice.brown@company.com,1245,892,67
```
**Interpretation:** Lower total churn but good commit count - careful, targeted changes. High commits-to-churn ratio indicates precision work.

## Team Analysis Examples

### Team Comparison
```csv
author,added,deleted,commits
backend-team,25643,12456,234
frontend-team,18932,8765,189
devops-team,3456,2134,78
```
**Interpretation:** Backend team shows highest activity, DevOps team focuses on smaller, targeted changes.

## Troubleshooting Common Issues

### Inconsistent Author Names
- **Standardize author identification** using email addresses
- **Use team mapping** to consolidate multiple author identities
- **Check git configuration** for consistent author information

### Skewed Results
- **Filter large refactoring commits** that may skew individual metrics
- **Consider time period selection** to ensure fair comparison
- **Account for part-time vs. full-time contributors**

### Missing Context
- **Combine with other analyses** for complete picture
- **Consider role and tenure differences** when interpreting results
- **Validate findings** with team knowledge and qualitative assessment

## Visualization Recommendations
- **Stacked bar charts:** Show add/delete breakdown per author
- **Scatter plots:** Plot additions vs. deletions to identify patterns
- **Time series:** Track author contributions over time
- **Team comparison charts:** Compare team-level contributions 