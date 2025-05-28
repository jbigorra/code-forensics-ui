# Entity Ownership Analysis

## Overview
The Entity Ownership analysis shows how code churn (lines added and deleted) is distributed among different authors for each file or module. This analysis reveals ownership patterns, identifies knowledge silos, and helps understand collaboration dynamics at the file level. It provides detailed insights into who has contributed what amount of code to each entity.

## Analysis Type
**Command:** `entity-ownership`

## Purpose
- Understand code ownership distribution across files
- Identify knowledge silos and single points of failure
- Analyze collaboration patterns at the file level
- Support knowledge transfer and mentoring planning
- Guide code review assignments and expertise mapping
- Assess team member specializations and contributions

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format)
- **Required columns:** `:entity`, `:author`, `:loc-added`, `:loc-deleted`
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `entity` | The file or module path |
| `author` | The name/email of the contributing author |
| `added` | Lines of code added by this author to this entity |
| `deleted` | Lines of code deleted by this author from this entity |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership
```

### With Options
```bash
# Get ownership details for top contributors
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership -r 100

# Save ownership analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership -o ownership.csv

# Analyze with team mapping
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-p, --team-map-file`**: Map individual authors to teams for team-level ownership analysis
- **`-g, --group`**: Aggregate results according to architectural layers

### Filtering Options
- **`-n, --min-revs`**: Filter entities with minimum number of commits

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

### Ownership Patterns

#### Single Owner Files
- **High concentration:** One author dominates contributions (>80% of churn)
- **Knowledge silos:** Risk of single points of failure
- **Specialization:** Deep expertise in specific areas
- **Risk:** Bus factor of 1, knowledge transfer challenges

#### Shared Ownership Files
- **Collaborative development:** Multiple authors with significant contributions
- **Knowledge distribution:** Reduced risk of knowledge silos
- **Team coordination:** Requires good communication and standards
- **Benefit:** Higher resilience and knowledge sharing

#### Balanced Ownership
- **Primary + Secondary:** One main owner with supporting contributors
- **Mentoring pattern:** Senior developer with junior contributors
- **Healthy distribution:** Good balance of expertise and knowledge sharing

### Contribution Types

#### High Addition Contributors
- **Feature builders:** Authors focused on adding new functionality
- **Growth drivers:** Expanding capabilities and features
- **New team members:** Often contribute more additions while learning

#### High Deletion Contributors
- **Refactoring specialists:** Authors focused on code cleanup
- **Technical debt reducers:** Improving code quality and maintainability
- **Senior developers:** Often remove redundant or obsolete code

#### Balanced Contributors
- **Maintainers:** Authors doing ongoing maintenance and bug fixes
- **Full-stack developers:** Working across different types of changes

## Aggregation and Combination Possibilities

### Team-Level Ownership
```bash
# Analyze ownership at team level instead of individual authors
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership -p team-mapping.csv
```

**Team mapping file format (CSV):**
```csv
author,team
john.doe@company.com,backend-team
jane.smith@company.com,frontend-team
bob.wilson@company.com,backend-team
alice.brown@company.com,devops-team
```

### Architectural Layer Ownership
```bash
# Analyze ownership patterns by architectural boundaries
java -jar code-maat.jar -l logfile.log -c git2 -a entity-ownership -g layers.txt
```

## Combining with Other Analyses

### Recommended Combinations
1. **Entity-Ownership + Authors:** Compare ownership distribution with file counts
2. **Entity-Ownership + Entity-Churn:** Understand who contributes to high-churn files
3. **Entity-Ownership + Main-Dev:** Compare detailed ownership with main developer identification
4. **Entity-Ownership + Communication:** Analyze collaboration around shared files

### Sequential Analysis Example
```bash
# 1. Get detailed ownership breakdown
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o ownership.csv

# 2. Get main developer identification
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o main-dev.csv

# 3. Get entity churn for context
java -jar code-maat.jar -l git.log -c git2 -a entity-churn -o entity-churn.csv

# 4. Get communication patterns
java -jar code-maat.jar -l git.log -c git2 -a communication -o communication.csv
```

### Cross-Analysis Insights
- **High ownership concentration + High churn:** Critical knowledge silos
- **Shared ownership + High coupling:** Coordination challenges
- **Single ownership + Low churn:** Stable, specialized components
- **Balanced ownership + High communication:** Healthy collaboration

## Use Cases

### 1. Knowledge Risk Assessment
```bash
# Identify files with concentrated ownership (knowledge silos)
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o knowledge-risk.csv
```

### 2. Code Review Planning
```bash
# Understand expertise distribution for review assignments
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -r 200 -o review-planning.csv
```

### 3. Team Transition Planning
```bash
# Analyze ownership before team restructuring
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -p teams.csv -o transition-planning.csv
```

### 4. Mentoring Program Design
```bash
# Identify mentoring opportunities based on ownership patterns
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o mentoring-opportunities.csv
```

## Advanced Analysis Techniques

### Ownership Metrics
From the output data, you can calculate:

```
Total Contribution = Added + Deleted
Net Contribution = Added - Deleted
Ownership Percentage = (Author Contribution / Total File Contribution) × 100
Contribution Ratio = Deleted / Added
Bus Factor = Number of authors with >20% ownership
```

### Risk Assessment
Files can be classified by ownership risk:

#### High Risk (Knowledge Silos)
- **Single dominant owner:** >80% of total churn
- **Low bus factor:** Only 1-2 significant contributors
- **Critical files:** Core business logic or infrastructure

#### Medium Risk (Concentrated Ownership)
- **Primary owner:** 50-80% of total churn
- **Limited backup:** 2-3 significant contributors
- **Important files:** Key features or components

#### Low Risk (Distributed Ownership)
- **Shared ownership:** No single author >50% of churn
- **High bus factor:** 3+ significant contributors
- **Collaborative files:** Well-distributed knowledge

## Integration with Development Workflow

### Knowledge Transfer Planning
```bash
# Identify files needing knowledge transfer before team changes
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o knowledge-transfer.csv
```

### Expertise Mapping
```bash
# Map team expertise for project planning
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -p teams.csv -o expertise-map.csv
```

### Onboarding Support
```bash
# Identify files for new team member training
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -n 10 -o onboarding-files.csv
```

## Research Background
This analysis is based on research showing that:
- Files with concentrated ownership have higher defect rates
- Knowledge silos create significant project risks
- Balanced ownership improves code quality and team resilience
- Ownership patterns correlate with team communication effectiveness

## Limitations
- **Requires numstat data:** Not all VCS logs include line change information
- **Lines of code bias:** Doesn't reflect contribution quality or complexity
- **Temporal aspects:** Doesn't show ownership evolution over time
- **Context missing:** Cannot distinguish between different types of contributions
- **Author identification:** Requires consistent author naming

## Best Practices

### Data Collection
1. **Use consistent author identification** (email addresses preferred)
2. **Include sufficient history** for meaningful ownership patterns
3. **Consider team mapping** for organizational insights
4. **Filter automated commits** if they skew ownership

### Analysis Interpretation
1. **Focus on critical files** when assessing ownership risks
2. **Consider file importance** not just ownership concentration
3. **Look at patterns across related files** and components
4. **Validate with team knowledge** about actual expertise

### Action Planning
1. **Address high-risk knowledge silos** through knowledge transfer
2. **Plan mentoring** based on ownership imbalances
3. **Improve documentation** for single-owner files
4. **Encourage collaboration** on critical components

## Output Interpretation Examples

### Knowledge Silo Example
```csv
entity,author,added,deleted
src/core/PaymentEngine.java,john.doe@company.com,2847,234
src/core/PaymentEngine.java,jane.smith@company.com,156,23
src/core/PaymentEngine.java,bob.wilson@company.com,89,12
```
**Interpretation:** John dominates ownership (92% of churn) - high knowledge silo risk requiring attention.

### Balanced Ownership Example
```csv
entity,author,added,deleted
src/api/UserController.java,alice.brown@company.com,1245,456
src/api/UserController.java,bob.wilson@company.com,1156,398
src/api/UserController.java,carol.davis@company.com,987,234
```
**Interpretation:** Well-distributed ownership (36%, 32%, 32%) - healthy collaboration pattern.

### Mentoring Pattern Example
```csv
entity,author,added,deleted
src/utils/ValidationHelper.java,senior.dev@company.com,1456,789
src/utils/ValidationHelper.java,junior.dev@company.com,892,123
src/utils/ValidationHelper.java,intern@company.com,234,45
```
**Interpretation:** Senior developer leading with junior contributors - good mentoring pattern.

## Team Analysis Examples

### Team-Level Ownership
```csv
entity,author,added,deleted
src/frontend/Dashboard.js,frontend-team,3456,1234
src/frontend/Dashboard.js,backend-team,234,89
src/frontend/Dashboard.js,devops-team,67,23
```
**Interpretation:** Clear team ownership with minimal cross-team contributions.

## Ownership Risk Assessment

### High-Risk Files Identification
To identify knowledge silos, look for:
1. **Single author >80% ownership** in critical files
2. **Bus factor of 1** (only one significant contributor)
3. **Core business logic** with concentrated ownership
4. **Infrastructure files** with single owners

### Risk Mitigation Strategies
1. **Pair programming** on high-risk files
2. **Code review requirements** for single-owner files
3. **Documentation initiatives** for critical components
4. **Knowledge sharing sessions** for specialized areas

## Troubleshooting Common Issues

### Inconsistent Author Names
- **Standardize using email addresses** for author identification
- **Use team mapping** to consolidate multiple identities
- **Check git configuration** for consistent authorship

### Skewed Results
- **Filter large refactoring commits** that may distort ownership
- **Consider file age** when interpreting ownership concentration
- **Account for team changes** over time

### Missing Context
- **Combine with file importance metrics** (coupling, revisions)
- **Consider architectural significance** of owned files
- **Validate with team knowledge** about actual expertise levels

## Visualization Recommendations
- **Stacked bar charts:** Show ownership distribution per file
- **Heat maps:** Visualize ownership across file structure
- **Network diagrams:** Show author-file relationships
- **Pie charts:** Display ownership percentages for critical files 