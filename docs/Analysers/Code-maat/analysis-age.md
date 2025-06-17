# Age Analysis

## Overview
The Age analysis measures the age of each file or module in your codebase, typically defined as the time since its first appearance in version control. This analysis helps identify legacy components, recently added files, and the overall maturity of different parts of the system. Age metrics are valuable for understanding code stability, prioritizing refactoring, and planning onboarding or deprecation efforts.

## Analysis Type
**Command:** `age`

## Purpose
- Measure the age of each file/module in the codebase
- Identify legacy components and recently added files
- Assess codebase maturity and stability
- Support refactoring and technical debt planning
- Guide onboarding and knowledge transfer efforts
- Inform deprecation and modernization strategies

## Input Requirements
- **Log file:** Standard VCS log data with commit and date information
- **Required columns:** `:entity`, `:rev` (revision/commit identifier), `:date` (commit date)
- **Note:** Works with basic log formats (does not require numstat data)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `age-days` | Age of the entity in days (from first commit to analysis date) |
| `created` | Date of the first commit for this entity |
| `last-modified` | Date of the most recent commit for this entity |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a age
```

### With Options
```bash
# Get top 30 oldest files
java -jar code-maat.jar -l logfile.log -c git2 -a age -r 30

# Save age analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a age -o age.csv

# Filter by minimum age
java -jar code-maat.jar -l logfile.log -c git2 -a age -n 365
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (oldest or newest entities)
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Filtering Options
- **`-n, --min-revs`**: Filter entities with minimum age (in days)

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers

## Log File Requirements

### Git Standard Format
```bash
# Generate git log with commit dates
git log --pretty=format:'[%h] %aN %ad %s' --date=short --name-only > git.log
```

### Expected Log Format
```
[a1b2c3d] John Doe 2020-01-15 Initial commit
src/core/LegacyComponent.java

[e4f5g6h] Jane Smith 2024-01-15 Add new feature
src/features/NewFeature.java
```

## Interpretation Guidelines

### Age Patterns

#### Oldest Files
- **Legacy components:** Stable, mature, or potentially outdated code
- **Core infrastructure:** Foundational parts of the system
- **Technical debt:** May require modernization or refactoring
- **Knowledge silos:** Risk if only a few developers know these files

#### Newest Files
- **Recent features:** Actively developed or experimental code
- **Ongoing projects:** Areas of rapid change
- **Potential instability:** Less tested, may need extra review

#### Age Distribution
- **Balanced:** Mix of old and new files, healthy evolution
- **Skewed old:** Risk of stagnation, technical debt
- **Skewed new:** Rapid growth, potential instability

### Quality and Risk Indicators

#### Concerning Patterns
- **Very old files with high churn:** Legacy hotspots, likely technical debt
- **Old files with low activity:** Stable, but may lack modern practices
- **New files with high fragmentation:** Onboarding or coordination challenges

#### Healthy Patterns
- **Old, stable files:** Core components with low churn
- **New files with moderate activity:** Healthy growth and evolution

## Aggregation and Combination Possibilities

### Architectural Layer Age
```bash
# Analyze age distribution across architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a age -g layers.txt
```

**Layer grouping file format:**
```
UI Layer => src/main/webapp/.*
Business Layer => src/main/java/com/company/business/.*
Data Layer => src/main/java/com/company/data/.*
```

## Combining with Other Analyses

### Recommended Combinations
1. **Age + Churn:** Identify old files with ongoing high churn (legacy hotspots)
2. **Age + Fragmentation:** See if new files have high author turnover
3. **Age + Main-Dev:** Check if legacy files have clear ownership
4. **Age + Messages:** Track how commit message content changes as files mature

### Sequential Analysis Example
```bash
# 1. Get age overview
java -jar code-maat.jar -l git.log -c git2 -a age -o age.csv

# 2. Get churn for context
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o churn.csv

# 3. Get main developer for legacy files
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o main-dev.csv
```

### Cross-Analysis Insights
- **Old + High churn:** Technical debt, refactoring candidates
- **Old + Low main-dev ownership:** Knowledge risk
- **New + High fragmentation:** Onboarding or coordination challenge

## Use Cases

### 1. Technical Debt Assessment
```bash
# Identify legacy files for modernization
java -jar code-maat.jar -l git.log -c git2 -a age -n 1000 -o legacy.csv
```

### 2. Onboarding Planning
```bash
# Find new files for onboarding focus
java -jar code-maat.jar -l git.log -c git2 -a age -r 20 -o new-files.csv
```

### 3. Refactoring Prioritization
```bash
# Target old, high-churn files for refactoring
java -jar code-maat.jar -l git.log -c git2 -a age -n 1000 -o old-files.csv
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o churn.csv
# (External: join old-files.csv and churn.csv)
```

### 4. Architecture Assessment
```bash
# Analyze age distribution by architectural layer
java -jar code-maat.jar -l git.log -c git2 -a age -g architecture.txt -o arch-age.csv
```

## Advanced Analysis Techniques

### Age Metrics
From the output data, you can calculate:

```
Average Age = Total age-days / Number of files
Age Variance = Standard deviation of file ages
Legacy Ratio = Number of files older than threshold / Total files
Age-Churn Index = Age × Churn (for legacy hotspot detection)
```

### File Classification
Based on age patterns, files can be classified as:

#### Legacy Files (Oldest)
- **Characteristics:** Age > 90th percentile
- **Risk:** Technical debt, outdated practices, knowledge silos
- **Action:** Prioritize for modernization, documentation

#### Mature Files (Old, Stable)
- **Characteristics:** Old, low churn
- **Status:** Stable, reliable core components
- **Action:** Monitor, but low risk

#### New Files (Youngest)
- **Characteristics:** Age < 10th percentile
- **Risk:** Instability, onboarding needs
- **Action:** Extra review, mentoring

#### Evolving Files (Middle Age)
- **Characteristics:** Moderate age, ongoing activity
- **Status:** Healthy evolution
- **Action:** Standard maintenance

## Integration with Development Workflow

### Technical Debt Monitoring
```bash
# Track legacy files for refactoring
java -jar code-maat.jar -l git.log -c git2 -a age -n 1000 -o debt.csv
```

### Onboarding Support
```bash
# Identify new files for onboarding focus
java -jar code-maat.jar -l git.log -c git2 -a age -r 20 -o onboarding.csv
```

### Architecture Evolution
```bash
# Monitor age distribution by system component
java -jar code-maat.jar -l git.log -c git2 -a age -g architecture.txt -o arch-evolution.csv
```

## Research Background
This analysis is based on research showing that:
- Legacy files are more likely to accumulate technical debt and defects
- File age correlates with stability and maintenance needs
- Age metrics help prioritize refactoring and modernization
- Age distribution reflects project evolution and process maturity

## Limitations
- **First commit only:** Age is based on first appearance, not actual creation (may miss file renames/moves)
- **No activity context:** Old files may be stable or neglected
- **Date accuracy:** Depends on VCS log completeness and accuracy
- **No semantic analysis:** Does not assess code quality or complexity

## Best Practices

### Data Collection
1. **Use complete project history** for accurate age calculation
2. **Account for file renames/moves** if possible
3. **Include sufficient history** for meaningful age patterns
4. **Validate log dates** for accuracy

### Analysis Interpretation
1. **Combine with churn and ownership metrics** for deeper insights
2. **Consider file importance** when prioritizing legacy files
3. **Look for age-churn hotspots** as refactoring candidates
4. **Validate findings with team knowledge**

### Action Planning
1. **Prioritize legacy files for modernization**
2. **Support onboarding for new files**
3. **Monitor age distribution for architectural health**
4. **Plan refactoring based on age-churn analysis**

## Output Interpretation Examples

### Legacy File Example
```csv
entity,age-days,created,last-modified
src/core/LegacyComponent.java,1460,2020-01-15,2024-01-15
```
**Interpretation:** LegacyComponent.java is 4 years old, likely a candidate for modernization or documentation.

### New File Example
```csv
entity,age-days,created,last-modified
src/features/NewFeature.java,10,2024-01-05,2024-01-15
```
**Interpretation:** NewFeature.java is very new, may need extra review and onboarding support.

### Mature File Example
```csv
entity,age-days,created,last-modified
src/utils/StringHelper.java,900,2021-07-01,2024-01-15
```
**Interpretation:** StringHelper.java is mature and stable, with moderate age and recent updates.

## Troubleshooting Common Issues

### Inaccurate Age Due to File Moves
- **Track renames/moves** in VCS log if possible
- **Use VCS features** (e.g., `git log --follow`) to trace file history

### Missing or Incomplete Dates
- **Validate log extraction process** for completeness
- **Check for missing commits** in shallow or partial logs

### Skewed Age Distribution
- **Account for project resets or major refactors**
- **Interpret age in context of project history**

## Visualization Recommendations
- **Histograms:** Show age distribution across files
- **Box plots:** Compare age by architectural layer
- **Heat maps:** Visualize age across directory structure
 