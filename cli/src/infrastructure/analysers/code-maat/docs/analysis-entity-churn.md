# Entity Churn Analysis

## Overview
The Entity Churn analysis measures code size changes (lines added and deleted) for each individual file or module in your codebase. This analysis helps identify the most volatile files, understand growth patterns, and pinpoint potential quality hotspots. Files with high churn rates are statistically more likely to contain defects and require additional attention.

## Analysis Type
**Command:** `entity-churn`

## Purpose
- Identify files with the highest code volatility and growth
- Find potential quality hotspots based on churn patterns
- Understand file-level development patterns and stability
- Prioritize refactoring efforts based on churn intensity
- Correlate file changes with defect rates and complexity
- Guide code review focus and testing strategies

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format)
- **Required columns:** `:entity`, `:loc-added`, `:loc-deleted`
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `added` | Total lines of code added to this entity |
| `deleted` | Total lines of code deleted from this entity |
| `commits` | Total number of commits affecting this entity |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn
```

### With Options
```bash
# Get top 30 highest churn files
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn -r 30

# Save entity churn analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn -o entity-churn.csv

# Filter by minimum activity
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn -n 5
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Filtering Options
- **`-n, --min-revs`**: Filter entities with minimum number of commits

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods

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

### Entity Churn Patterns

#### High Addition Files
- **Growing components:** Files with significant new functionality
- **Feature development:** Active areas of new development
- **Expanding APIs:** Interfaces gaining new methods or capabilities
- **Configuration growth:** Config files with increasing complexity

#### High Deletion Files
- **Refactored components:** Files undergoing cleanup and optimization
- **Legacy removal:** Obsolete code being eliminated
- **Simplified interfaces:** APIs being streamlined
- **Technical debt reduction:** Code quality improvements

#### Balanced Churn Files
- **Maintenance-heavy files:** Regular bug fixes and updates
- **Evolving business logic:** Files adapting to changing requirements
- **Stable but active:** Core components with ongoing refinements

### Quality Risk Indicators

#### High-Risk Patterns
- **Very high total churn (>5,000 lines):** Potential quality hotspots
- **High additions with many commits:** Rapidly growing complexity
- **Erratic churn patterns:** Unstable or problematic components
- **High churn in core files:** Risk to system stability

#### Healthy Patterns
- **Moderate, consistent churn:** Steady evolution and maintenance
- **Balanced add/delete ratios:** Thoughtful development and cleanup
- **Low churn in critical files:** Stable core components

## Aggregation and Combination Possibilities

### Architectural Layer Analysis
```bash
# Analyze churn by architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn -g layers.txt
```

**Layer grouping file format:**
```
UI Layer => src/main/webapp/.*
Business Layer => src/main/java/com/company/business/.*
Data Layer => src/main/java/com/company/data/.*
```

### Temporal Analysis
```bash
# Group by time periods to see churn evolution
java -jar code-maat.jar -l logfile.log -c git2 -a entity-churn -t months
```

## Combining with Other Analyses

### Recommended Combinations
1. **Entity-Churn + Revisions:** Correlate churn volume with change frequency
2. **Entity-Churn + Authors:** Identify high-churn files with multiple contributors
3. **Entity-Churn + Coupling:** Find churning files that are highly coupled
4. **Entity-Churn + Age:** Compare churn with file age and maturity

### Sequential Analysis Example
```bash
# 1. Get entity churn overview (identify hotspots)
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o entity-churn.csv

# 2. Get revision counts for comparison
java -jar code-maat.jar -l git.log -c git2 -a revisions -o revisions.csv

# 3. Get author information for high-churn files
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv

# 4. Check coupling for volatile files
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 40 -o coupling.csv
```

### Cross-Analysis Insights
- **High churn + High revisions:** Critical hotspots requiring immediate attention
- **High churn + Multiple authors:** Coordination challenges and potential conflicts
- **High churn + High coupling:** Architectural risks with wide impact
- **High churn + Low age:** Rapidly evolving new components

## Use Cases

### 1. Quality Hotspot Identification
```bash
# Find files most likely to contain defects
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -r 20 -o quality-hotspots.csv
```

### 2. Refactoring Prioritization
```bash
# Identify candidates for refactoring based on churn
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -n 10 -o refactoring-candidates.csv
```

### 3. Code Review Focus
```bash
# Prioritize code review efforts on high-churn files
java -jar code-maat.jar -l recent-git.log -c git2 -a entity-churn -r 15 -o review-focus.csv
```

### 4. Architectural Assessment
```bash
# Analyze churn distribution across architectural layers
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -g architecture.txt -o arch-churn.csv
```

## Advanced Analysis Techniques

### Derived Metrics
From the output data, you can calculate:

```
Net Growth = Added - Deleted
Total Churn = Added + Deleted
Churn Rate = Total Churn / Commits
Growth Rate = Net Growth / Total Churn
Volatility Index = Total Churn / File Age (if available)
```

### File Classification
Based on churn patterns, files can be classified as:

#### Growth Files (High Add, Low Delete)
- **Characteristics:** Net Growth > 80% of Total Churn
- **Typical:** New features, expanding APIs, growing configuration
- **Risk:** Increasing complexity, potential design issues

#### Refactoring Files (High Delete, Moderate Add)
- **Characteristics:** Deletions > 60% of Total Churn
- **Typical:** Code cleanup, optimization, legacy removal
- **Benefit:** Technical debt reduction, improved maintainability

#### Maintenance Files (Balanced Add/Delete)
- **Characteristics:** Balanced churn with moderate totals
- **Typical:** Bug fixes, incremental improvements, adaptations
- **Status:** Stable evolution, ongoing maintenance

#### Volatile Files (High Total Churn)
- **Characteristics:** Very high total churn regardless of ratio
- **Risk:** Potential quality issues, architectural problems
- **Action:** Requires investigation and possible refactoring

## Integration with Development Workflow

### Continuous Quality Monitoring
```bash
# Weekly hotspot monitoring
#!/bin/bash
git log --since="1 week ago" --pretty=format:'[%h] %aN %ad %s' --date=short --numstat > weekly.log
java -jar code-maat.jar -l weekly.log -c git2 -a entity-churn -r 10 -o weekly-hotspots.csv
```

### Pre-Release Quality Assessment
```bash
# Identify risky files before release
java -jar code-maat.jar -l release-period.log -c git2 -a entity-churn -r 25 -o release-risks.csv
```

### Technical Debt Planning
```bash
# Plan refactoring efforts based on churn patterns
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -n 15 -o tech-debt-candidates.csv
```

## Research Background
This analysis is based on research showing that:
- Files with high churn rates have significantly more post-release defects
- Code churn is a stronger predictor of defects than traditional complexity metrics
- The relationship between churn and defects is consistent across different programming languages
- Files with high addition rates may indicate design problems or feature creep

## Limitations
- **Requires numstat data:** Not all VCS logs include line change information
- **Binary files create noise:** Binary changes may skew results
- **No semantic analysis:** Cannot distinguish between different types of changes
- **Context missing:** Doesn't account for change complexity or importance
- **File size bias:** Larger files may naturally have higher absolute churn

## Best Practices

### Data Collection
1. **Use consistent log format** with numstat information
2. **Filter binary files** if they create noise in results
3. **Include sufficient history** for meaningful churn patterns
4. **Consider file renaming** and moves in analysis

### Analysis Interpretation
1. **Focus on relative rankings** rather than absolute numbers
2. **Consider file size and age** when interpreting churn
3. **Look for patterns** across related files and components
4. **Validate with team knowledge** about file importance and complexity

### Action Planning
1. **Prioritize high-churn files** for quality assurance efforts
2. **Increase testing coverage** for volatile components
3. **Consider refactoring** files with excessive churn
4. **Monitor trends** to catch emerging hotspots early

## Output Interpretation Examples

### High-Growth File
```csv
entity,added,deleted,commits
src/features/PaymentProcessor.java,2847,234,45
```
**Interpretation:** Rapidly growing file with high addition rate - monitor for complexity and design issues. Growth Rate: 0.92 (Growth File).

### Refactored File
```csv
entity,added,deleted,commits
src/legacy/OldUserManager.java,456,2103,23
```
**Interpretation:** File undergoing significant cleanup with more deletions than additions. Growth Rate: -0.78 (Refactoring File).

### Volatile File
```csv
entity,added,deleted,commits
src/core/ConfigManager.java,3245,2876,67
```
**Interpretation:** High total churn with many commits - potential quality hotspot requiring investigation. Total Churn: 6,121 lines.

### Stable File
```csv
entity,added,deleted,commits
src/utils/StringHelper.java,123,89,8
```
**Interpretation:** Low churn with few commits - stable utility component. Total Churn: 212 lines.

## Architectural Analysis Examples

### Layer-Based Churn Distribution
```csv
entity,added,deleted,commits
UI Layer,15420,8932,234
Business Layer,12456,9876,189
Data Layer,5643,3421,98
```
**Interpretation:** UI layer shows highest churn, indicating active user interface development.

## Troubleshooting Common Issues

### Skewed Results from Large Files
- **Normalize by file size** when comparing across different file types
- **Focus on churn rate** (churn per commit) rather than absolute values
- **Consider file purpose** (configuration vs. business logic)

### Binary File Noise
- **Filter binary files** from log extraction
- **Use file extension filtering** to focus on source code
- **Check for large binary commits** that may skew results

### Missing Context
- **Combine with other analyses** for complete picture
- **Consider file age and history** when interpreting results
- **Validate findings** with code quality metrics and team knowledge

## Visualization Recommendations
- **Bar charts:** Show top churning files with add/delete breakdown
- **Scatter plots:** Plot total churn vs. commits to identify outliers
- **Heat maps:** Visualize churn across directory structure
- **Trend lines:** Track churn evolution over time for specific files 