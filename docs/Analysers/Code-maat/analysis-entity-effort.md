# Entity Effort Analysis

## Overview
The Entity Effort analysis measures the total development effort invested in each file or module by counting the number of commits (revisions) that have touched each entity. This provides insights into where development time and attention are being focused, helping identify high-maintenance areas, active development zones, and potential effort allocation imbalances.

## Analysis Type
**Command:** `entity-effort`

## Purpose
- Measure development effort distribution across files and modules
- Identify high-maintenance files requiring frequent attention
- Understand where development time is being invested
- Support resource allocation and planning decisions
- Detect effort concentration patterns and potential bottlenecks
- Guide prioritization of refactoring and improvement initiatives

## Input Requirements
- **Log file:** Standard VCS log data with commit information
- **Required columns:** `:entity`, `:rev` (revision/commit identifier)
- **Note:** Works with basic log formats (does not require numstat data)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `effort` | Total number of commits/revisions that have modified this entity |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort
```

### With Options
```bash
# Get top 25 files with highest effort investment
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort -r 25

# Save entity effort analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort -o entity-effort.csv

# Filter files with minimum effort threshold
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort -n 10
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (entities with highest effort)
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Filtering Options
- **`-n, --min-revs`**: Filter entities with minimum number of revisions/commits

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods to analyze effort over time

## Log File Requirements

### Git Standard Format
```bash
# Generate standard git log
git log --pretty=format:'[%h] %aN %ad %s' --date=short --name-only > git.log
```

### Expected Log Format
```
[a1b2c3d] John Doe 2024-01-15 Add user authentication
src/auth/UserAuth.java
src/auth/AuthService.java

[e4f5g6h] Jane Smith 2024-01-15 Fix validation bug
src/validation/Validator.java
src/validation/Rules.java
```

## Interpretation Guidelines

### Effort Distribution Patterns

#### High-Effort Files
- **Frequent maintenance:** Files requiring constant attention and updates
- **Active development:** Areas of ongoing feature development
- **Problem areas:** Files with recurring issues or complexity
- **Core components:** Central files that impact many features

#### Low-Effort Files
- **Stable components:** Well-established, mature code
- **Utility files:** Simple, focused functionality
- **Rarely used features:** Infrequently modified components
- **Potential neglect:** Files that may need attention but aren't getting it

#### Effort Concentration
- **Hotspots:** Small number of files consuming disproportionate effort
- **Balanced distribution:** Effort spread evenly across components
- **Effort silos:** Concentrated effort in specific modules or layers

### Risk and Quality Indicators

#### High-Risk Patterns
- **Excessive effort concentration:** Too much time spent on few files
- **Effort without progress:** High effort but no apparent improvement
- **Critical files with high effort:** Core components requiring constant fixes
- **Effort spikes:** Sudden increases in effort for specific files

#### Healthy Patterns
- **Moderate, consistent effort:** Steady maintenance and improvement
- **Effort aligned with importance:** Critical files receiving appropriate attention
- **Declining effort over time:** Files becoming more stable

## Aggregation and Combination Possibilities

### Architectural Layer Effort
```bash
# Analyze effort distribution across architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort -g layers.txt
```

**Layer grouping file format:**
```
UI Layer => src/main/webapp/.*
Business Layer => src/main/java/com/company/business/.*
Data Layer => src/main/java/com/company/data/.*
```

### Temporal Effort Analysis
```bash
# Group effort by time periods to see evolution
java -jar code-maat.jar -l logfile.log -c git2 -a entity-effort -t months
```

## Combining with Other Analyses

### Recommended Combinations
1. **Entity-Effort + Entity-Churn:** Compare effort (commits) with churn (lines changed)
2. **Entity-Effort + Authors:** Understand if high-effort files have many contributors
3. **Entity-Effort + Coupling:** Check if high-effort files are highly coupled
4. **Entity-Effort + Age:** Compare effort with file age to understand maintenance patterns

### Sequential Analysis Example
```bash
# 1. Get effort distribution overview
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -o entity-effort.csv

# 2. Get churn information for comparison
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o entity-churn.csv

# 3. Get author information for high-effort files
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv

# 4. Check coupling for effort hotspots
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 40 -o coupling.csv
```

### Cross-Analysis Insights
- **High effort + High churn:** Files consuming significant time and code changes
- **High effort + Low churn:** Frequent small fixes, potential quality issues
- **High effort + Multiple authors:** Coordination challenges or knowledge sharing
- **High effort + High coupling:** Architectural bottlenecks requiring attention

## Use Cases

### 1. Resource Allocation Planning
```bash
# Identify where development effort is concentrated
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -r 30 -o effort-hotspots.csv
```

### 2. Maintenance Burden Assessment
```bash
# Find files requiring excessive maintenance effort
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -n 15 -o maintenance-burden.csv
```

### 3. Refactoring Prioritization
```bash
# Identify high-effort files for potential refactoring
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -r 20 -o refactoring-candidates.csv
```

### 4. Team Productivity Analysis
```bash
# Analyze effort distribution across architectural layers
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -g architecture.txt -o team-productivity.csv
```

## Advanced Analysis Techniques

### Effort Metrics
From the output data, you can calculate:

```
Effort Concentration = (Top 20% files effort) / (Total effort) × 100
Average Effort per File = Total commits / Number of files
Effort Variance = Standard deviation of effort across files
Effort Efficiency = Progress achieved / Effort invested
```

### File Classification
Based on effort patterns, files can be classified as:

#### High-Maintenance Files (High Effort)
- **Characteristics:** Effort > 90th percentile
- **Typical:** Complex business logic, integration points, frequently changing requirements
- **Action:** Consider refactoring, better testing, or architectural changes

#### Stable Files (Low Effort)
- **Characteristics:** Effort < 25th percentile
- **Typical:** Utilities, mature components, well-designed modules
- **Status:** Generally healthy, minimal intervention needed

#### Moderate-Maintenance Files (Medium Effort)
- **Characteristics:** Effort between 25th and 75th percentiles
- **Typical:** Regular business logic, standard components
- **Status:** Normal maintenance pattern

#### Effort Outliers (Very High Effort)
- **Characteristics:** Effort > 95th percentile
- **Risk:** Potential quality issues, architectural problems
- **Action:** Immediate investigation and improvement planning

## Integration with Development Workflow

### Sprint Planning
```bash
# Identify high-effort files for sprint capacity planning
java -jar code-maat.jar -l recent-git.log -c git2 -a entity-effort -r 15 -o sprint-effort.csv
```

### Technical Debt Management
```bash
# Track effort trends to identify growing technical debt
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -t quarters -o debt-trends.csv
```

### Code Review Prioritization
```bash
# Focus code review efforts on high-effort files
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -r 25 -o review-priorities.csv
```

## Research Background
This analysis is based on research showing that:
- Development effort distribution follows power-law patterns (few files consume most effort)
- High-effort files often correlate with defect-prone areas
- Effort concentration can indicate architectural problems
- Tracking effort over time helps identify maintenance burden trends

## Limitations
- **Commit frequency bias:** Doesn't account for commit size or complexity
- **Development style differences:** Some developers make many small commits, others fewer large ones
- **No effort quality measure:** High effort doesn't necessarily mean poor quality
- **Temporal context missing:** Single snapshot doesn't show effort evolution
- **External factors ignored:** Doesn't account for requirements changes or external pressures

## Best Practices

### Data Collection
1. **Use consistent commit practices** across the team
2. **Include sufficient history** for meaningful effort patterns
3. **Consider filtering merge commits** if they skew results
4. **Account for different development phases** (initial development vs. maintenance)

### Analysis Interpretation
1. **Combine with other metrics** for complete understanding
2. **Consider file importance** when interpreting effort levels
3. **Look for trends over time** rather than just absolute numbers
4. **Validate with team knowledge** about actual effort and challenges

### Action Planning
1. **Investigate high-effort outliers** for potential improvements
2. **Balance effort distribution** across team and components
3. **Plan refactoring** for files with excessive maintenance burden
4. **Monitor effort trends** to catch emerging problems early

## Output Interpretation Examples

### High-Effort File
```csv
entity,effort
src/core/PaymentProcessor.java,127
```
**Interpretation:** PaymentProcessor.java has been modified in 127 commits, indicating high maintenance burden or active development.

### Moderate-Effort File
```csv
entity,effort
src/utils/StringHelper.java,23
```
**Interpretation:** StringHelper.java has moderate effort investment (23 commits), suggesting stable but occasionally updated utility.

### Low-Effort File
```csv
entity,effort
src/constants/ErrorCodes.java,3
```
**Interpretation:** ErrorCodes.java has very low effort (3 commits), indicating a stable, rarely changed component.

## Architectural Analysis Examples

### Layer-Based Effort Distribution
```csv
entity,effort
UI Layer,456
Business Layer,789
Data Layer,234
```
**Interpretation:** Business layer consumes most effort, possibly indicating complex business logic or frequent requirement changes.

## Effort Concentration Analysis

### Identifying Effort Hotspots
To find effort concentration:
1. **Calculate total effort** across all files
2. **Identify top 20% of files** by effort
3. **Calculate percentage** of total effort consumed by top files
4. **Assess concentration risk** (>80% concentration may indicate problems)

### Effort Distribution Health
- **Healthy:** Top 20% files consume 50-70% of effort
- **Concerning:** Top 20% files consume >80% of effort
- **Investigate:** Single file consuming >10% of total effort

## Troubleshooting Common Issues

### Skewed Results from Merge Commits
- **Filter large merge commits** that may not represent actual development effort
- **Focus on regular commits** for more accurate effort measurement
- **Consider using `--no-merges` in git log generation**

### Development Phase Bias
- **Account for initial development** vs. maintenance phases
- **Use temporal analysis** to understand effort evolution
- **Consider project lifecycle** when interpreting results

### Team Size Impact
- **Normalize by team size** when comparing across projects
- **Consider development practices** (pair programming, code review frequency)
- **Account for onboarding periods** with higher commit frequency

## Visualization Recommendations
- **Bar charts:** Show top N files by effort with clear ranking
- **Heat maps:** Visualize effort distribution across directory structure
- **Trend lines:** Track effort evolution over time for specific files
- **Pareto charts:** Show effort concentration (80/20 distribution)
- **Scatter plots:** Compare effort with other metrics (churn, authors, coupling) 