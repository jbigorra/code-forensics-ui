# Sum of Coupling (SOC) Analysis

## Overview
The Sum of Coupling (SOC) analysis calculates the total coupling burden for each entity (file/module) in your codebase. Unlike the pairwise coupling analysis, SOC aggregates all coupling relationships for each file, providing a single metric that indicates how "connected" or "central" a file is within the change network. This helps identify architectural hubs and files that are involved in many change relationships.

## Analysis Type
**Command:** `soc`

## Purpose
- Identify architectural hubs and central components
- Find files with the highest coupling burden
- Prioritize refactoring efforts based on coupling centrality
- Understand which files are most involved in change propagation
- Detect potential architectural bottlenecks
- Guide modularization and decomposition strategies

## Input Requirements
- **Log file:** VCS log data containing commit information
- **Required columns:** `:entity`, `:rev`

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `soc` | Sum of Coupling - total coupling burden for this entity |

## SOC Calculation Method

The SOC for each entity is calculated as:
```
SOC = Σ (number of other entities changed together in each revision - 1)
```

For each commit/revision:
1. Count the number of entities changed together (changeset size)
2. For each entity in that changeset, add (changeset_size - 1) to its SOC
3. Sum across all revisions for each entity

**Example:**
- Commit 1: Files A, B, C changed together → Each gets +2 SOC points
- Commit 2: Files A, D changed together → Each gets +1 SOC point  
- Final SOC: A=3, B=2, C=2, D=1

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a soc
```

### With Options
```bash
# Get top 30 most coupled files
java -jar code-maat.jar -l logfile.log -c git2 -a soc -r 30

# Filter by minimum coupling activity
java -jar code-maat.jar -l logfile.log -c git2 -a soc -n 10

# Save results to file
java -jar code-maat.jar -l logfile.log -c git2 -a soc -o soc-report.csv
```

## Configuration Options

### Filtering Options
- **`-n, --min-revs`** (default: 5): Minimum SOC value required for an entity to be included in results
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-s, --max-changeset-size`** (default: 30): Maximum changeset size to consider (filters large refactoring commits)

### Output Options
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-g, --group`**: Aggregate results according to architectural layers
- **`-t, --temporal-period`**: Group commits within temporal periods as logical changesets

## Interpretation Guidelines

### High SOC Values (Architectural Hubs)
- **Very high SOC (top 5%):** Critical architectural components
  - Central business logic files
  - Shared utilities and common libraries
  - Configuration or infrastructure files
  - API gateway or facade components
  - **Risk:** Single points of failure, coordination bottlenecks

### Medium SOC Values (Active Components)
- **Moderate SOC (top 20%):** Actively involved in changes
  - Feature modules with dependencies
  - Service layer components
  - Data access objects
  - **Consideration:** Good candidates for modularization review

### Low SOC Values (Isolated Components)
- **Low SOC:** Relatively independent files
  - Specialized utilities
  - Independent features
  - Well-encapsulated modules
  - **Benefit:** Lower coordination overhead

## Aggregation and Combination Possibilities

### Temporal Grouping
```bash
# Group commits by day to focus on logical changesets
java -jar code-maat.jar -l logfile.log -c git2 -a soc -t days
```

### Architectural Layer Analysis
```bash
# Analyze SOC at architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a soc -g layers.txt
```

### Filtered Analysis
```bash
# Focus on significant coupling relationships, exclude large refactoring commits
java -jar code-maat.jar -l logfile.log -c git2 -a soc -s 15 -n 8
```

## Combining with Other Analyses

### Recommended Combinations
1. **SOC + Revisions:** Identify high-coupling, high-change files (critical hotspots)
2. **SOC + Authors:** Find high-coupling files with multiple contributors
3. **SOC + Coupling:** Drill down from SOC overview to specific coupling pairs
4. **SOC + Churn:** Correlate coupling centrality with code growth
5. **SOC + Communication:** Analyze team coordination around central files

### Sequential Analysis Example
```bash
# 1. Get SOC overview (architectural hubs)
java -jar code-maat.jar -l git.log -c git2 -a soc -o soc.csv

# 2. Get detailed coupling for top SOC files
java -jar code-maat.jar -l git.log -c git2 -a coupling -i 40 -o coupling.csv

# 3. Get revision counts
java -jar code-maat.jar -l git.log -c git2 -a revisions -o revisions.csv

# 4. Get author information
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv
```

### Cross-Analysis Insights
- **High SOC + High revisions:** Critical architectural hotspots requiring immediate attention
- **High SOC + Multiple authors:** Coordination challenges and potential knowledge bottlenecks
- **High SOC + High churn:** Volatile central components (architectural risk)
- **High SOC + Low revisions:** Stable but central components (good architecture)

## Use Cases

### 1. Architectural Assessment
```bash
# Identify the most central components in your architecture
java -jar code-maat.jar -l git.log -c git2 -a soc -r 20
```

### 2. Refactoring Prioritization
```bash
# Find high-coupling files that need modularization
java -jar code-maat.jar -l git.log -c git2 -a soc -n 15
```

### 3. Risk Assessment
```bash
# Identify potential single points of failure
java -jar code-maat.jar -l git.log -c git2 -a soc -s 20 -r 10
```

### 4. Architectural Layer Analysis
```bash
# Analyze coupling distribution across layers
java -jar code-maat.jar -l git.log -c git2 -a soc -g architecture.txt
```

## Advanced Configuration

### Large Codebase Optimization
```bash
# Filter out large refactoring commits and focus on significant coupling
java -jar code-maat.jar -l git.log -c git2 -a soc -s 10 -n 20
```

### Temporal Analysis
```bash
# Group by weeks to see coupling patterns over time
java -jar code-maat.jar -l git.log -c git2 -a soc -t weeks
```

### Conservative Analysis
```bash
# Focus only on files with substantial coupling activity
java -jar code-maat.jar -l git.log -c git2 -a soc -n 25 -r 15
```

## SOC vs. Coupling Analysis Comparison

| Aspect | SOC Analysis | Coupling Analysis |
|--------|--------------|-------------------|
| **Perspective** | Per-file aggregated view | Pairwise relationships |
| **Output** | Single metric per file | Coupling pairs with degrees |
| **Use Case** | Identify architectural hubs | Find specific dependencies |
| **Prioritization** | Overall coupling burden | Specific relationship strength |
| **Refactoring** | Which files to modularize | Which files to separate/combine |

## Research Background
SOC analysis is based on research showing that:
- Files with high coupling centrality often have more defects
- Architectural hubs create coordination bottlenecks
- Central components in change networks are critical for system stability
- Sum of coupling can predict maintenance effort and coordination costs

## Limitations
- **Does not show specific relationships** (use coupling analysis for details)
- **Sensitive to large changesets** (use `-s` to filter)
- **No temporal weighting** (recent vs. historical coupling treated equally)
- **No semantic analysis** (cannot distinguish between different types of coupling)
- **May favor configuration files** that change with many features

## Best Practices

### Analysis Configuration
1. **Filter large changesets** (`-s 15-20`) to avoid refactoring noise
2. **Set appropriate minimum thresholds** (`-n`) based on codebase size
3. **Use temporal grouping** for cleaner logical changesets
4. **Combine with detailed coupling analysis** for actionable insights

### Interpretation
1. **Focus on the top 10-20%** of files by SOC value
2. **Investigate high SOC files** for potential modularization
3. **Consider architectural context** when interpreting results
4. **Validate with team knowledge** about system architecture

### Action Planning
1. **Prioritize high SOC + high revision files** for immediate attention
2. **Consider extracting shared abstractions** from high SOC files
3. **Improve modularization** around architectural hubs
4. **Monitor SOC trends** over time to track architectural evolution

## Output Interpretation Examples

### High SOC Example
```csv
entity,soc
src/core/ConfigManager.java,156
src/utils/DatabaseHelper.java,142
src/services/UserService.java,98
```
**Interpretation:** ConfigManager and DatabaseHelper are architectural hubs involved in many change relationships - candidates for modularization or careful management.

### Balanced SOC Distribution
```csv
entity,soc
src/features/PaymentProcessor.java,45
src/features/NotificationService.java,38
src/features/ReportGenerator.java,32
```
**Interpretation:** More balanced coupling distribution suggests better modularization with reasonable interdependencies.

## Troubleshooting Common Issues

### Unexpectedly High SOC Values
- **Check for configuration files** that change with many features
- **Filter large changesets** with `-s` parameter
- **Consider temporal grouping** to reduce noise

### All SOC Values Too Low
- **Decrease `-n` threshold** to include more files
- **Check changeset size filtering** (may be too restrictive)
- **Verify log file contains sufficient history**

### SOC Dominated by Few Files
- **Normal pattern** - often indicates architectural hubs
- **Investigate top files** for potential modularization opportunities
- **Consider if this reflects actual system architecture**

## Integration with Development Workflow

### Regular Monitoring
```bash
# Monthly SOC analysis to track architectural evolution
java -jar code-maat.jar -l monthly-git.log -c git2 -a soc -r 25 -o monthly-soc.csv
```

### Pre-Refactoring Analysis
```bash
# Identify refactoring candidates
java -jar code-maat.jar -l git.log -c git2 -a soc -n 20 -s 15
```

### Architecture Reviews
```bash
# Layer-based SOC analysis for architecture reviews
java -jar code-maat.jar -l git.log -c git2 -a soc -g layers.txt -r 30
``` 