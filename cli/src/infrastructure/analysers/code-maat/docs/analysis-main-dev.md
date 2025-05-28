# Main Developer Analysis

## Overview
The Main Developer analysis identifies the primary contributor to each file or module based on the highest volume of code churn (lines added and deleted). This helps pinpoint key individuals responsible for specific parts of the codebase, understand expertise distribution, and assess potential knowledge concentration risks.

## Analysis Type
**Command:** `main-dev`

## Purpose
- Identify the main developer for each file/module
- Map expertise and knowledge centers within the codebase
- Assess risks associated with key person dependencies
- Support onboarding by identifying experts for specific modules
- Inform decisions about code ownership and responsibility
- Understand the impact of individual developers on the codebase

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format)
- **Required columns:** `:entity`, `:author`, `:loc-added`, `:loc-deleted`
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.)

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column        | Description                                         |
|---------------|-----------------------------------------------------|
| `entity`      | The file or module path                             |
| `major-author`| The author who contributed the most lines of code (added + deleted) to this entity |
| `added`       | Total lines added by the `major-author` to this entity |
| `deleted`     | Total lines deleted by the `major-author` from this entity |
| `total-churn` | Total lines (added + deleted) by the `major-author` to this entity |
| `ownership`   | Percentage of the entity's total churn contributed by the `major-author` |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev
```

### With Options
```bash
# Get main developers for top 20 most active files
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev -r 20

# Save main developer analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev -o main-dev.csv

# Analyze with team mapping (main team)
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (entities with highest total churn by main author)
- **`-o, --outfile`**: Write results to specified file instead of stdout

### Aggregation Options
- **`-p, --team-map-file`**: Map individual authors to teams. The output will show the "main team" instead of "main author".
- **`-g, --group`**: Aggregate results according to architectural layers. This will show the main developer for each defined architectural component.

### Filtering Options
- **`-n, --min-revs`**: Filter entities based on a minimum number of total revisions before identifying the main developer.

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

### Identifying Key Personnel
- **High `ownership` percentage (e.g., > 70%):** Indicates a strong main developer who has significantly shaped the file. This can be a sign of deep expertise or a potential knowledge silo.
- **High `total-churn` by `major-author`:** Shows that the main developer has been very active in this file.
- **Files with no clear main developer (low `ownership` percentage):** May indicate collaborative ownership or fragmented contributions.

### Assessing Impact and Risk
- **Critical files with a single main developer:** Represents a high "bus factor" or key person dependency. If this developer leaves, knowledge about this critical file might be lost.
- **Main developers spread across many important files:** Highlights highly influential individuals in the project.
- **Changes in main developers over time (if analyzing temporal slices):** Can indicate team evolution, knowledge transfer, or shifts in responsibility.

## Aggregation and Combination Possibilities

### Team-Level Main "Ownership"
```bash
# Identify the main contributing team for each file
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev -p team-mapping.csv
```
**Team mapping file format (CSV):**
```csv
author,team
john.doe@company.com,backend-team
jane.smith@company.com,frontend-team
```
The output will replace `major-author` with `major-team`.

### Architectural Layer Main Developer
```bash
# Identify main developers for architectural components
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev -g layers.txt
```
This helps see who "owns" or primarily develops specific architectural layers.

## Combining with Other Analyses

### Recommended Combinations
1.  **`main-dev` + `entity-ownership`:** While `main-dev` shows the top contributor, `entity-ownership` provides the full list of contributors and their churn, offering a more complete picture of collaboration versus single ownership.
2.  **`main-dev` + `authors`:** Cross-reference the number of authors with who the main developer is. A file with many authors but a clear main developer might indicate a lead/mentor pattern.
3.  **`main-dev` + `revisions`:** Correlate the main developer's churn with the total number of revisions to see if their contributions are spread over many small changes or a few large ones.
4.  **`main-dev` + `entity-churn`:** Understand if the main developer is primarily adding new code or refactoring existing code in the files they "own".

### Sequential Analysis Example
```bash
# 1. Identify main developers for all files
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o main-developers.csv

# 2. Get detailed ownership for files with high main-dev ownership
# (Requires manual filtering or scripting on main-developers.csv)
# Example for a specific file:
# java -jar code-maat.jar -l git.log -c git2 -a entity-ownership --filter-entity="src/core/Auth.java" -o auth-ownership.csv

# 3. Analyze churn patterns for files mainly developed by key personnel
# java -jar code-maat.jar -l git.log -c git2 -a entity-churn --filter-author="john.doe@company.com" -o johndoe-churn.csv
```

### Cross-Analysis Insights
-   **High `ownership` by `major-author` + Low total authors (from `authors` analysis):** Strong indication of a knowledge silo.
-   **High `ownership` by `major-author` + High revisions:** The main developer is consistently working on this file.
-   **Main developer with high `added` churn:** Likely responsible for building out new features in that file.
-   **Main developer with high `deleted` churn:** May be leading refactoring efforts or cleaning up legacy code.

## Use Cases

### 1. Expertise Mapping
```bash
# Generate a list of experts for different parts of the system
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o expertise-map.csv
```
Useful for knowing who to consult for specific modules.

### 2. Risk Assessment (Bus Factor)
Identify critical files predominantly owned by a single developer.
```bash
# Focus on top N files by overall churn to find critical ones
# And then check their main developer ownership.
# This typically involves combining with entity-churn or manual review.
java -jar code-maat.jar -l git.log -c git2 -a main-dev -r 50 -o key-files-main-dev.csv
```

### 3. Onboarding and Mentoring
New team members can be directed to main developers of modules they need to learn.
```bash
# Identify main developers of modules relevant to a new team member
java -jar code-maat.jar -l git.log -c git2 -a main-dev --group module-definitions.txt
```

### 4. Workload Distribution Assessment
Analyze if certain developers are main contributors to an excessive number of files, potentially indicating overload or imbalance.

## Advanced Analysis Techniques

### Main Developer Stability
By running the `main-dev` analysis on different time periods of the log, you can track changes in main developers for files. This can show:
-   How knowledge transfer is happening (or not).
-   If key developers are shifting focus.
-   Impact of team reorganizations.

### Combining with Architectural Definitions
```bash
java -jar code-maat.jar -l git.log -c git2 -a main-dev -g architecture.txt -o arch-main-dev.csv
```
This will show the main developer not just for individual files, but for defined architectural components, providing insights into who "owns" larger pieces of the system.

## Integration with Development Workflow

### Regular Health Checks
Periodically run `main-dev` analysis (e.g., quarterly) to monitor changes in expertise distribution and identify emerging knowledge silos.

### During Project Planning
Use `main-dev` insights to assign tasks to developers who have the most relevant expertise or to identify areas where knowledge sharing is needed.

### Code Review Assignment
Assign code reviews to main developers of affected modules or, conversely, to others to spread knowledge if a file has a very dominant main developer.

## Research Background
The concept of a "main developer" or "code owner" is well-established in software engineering. Research indicates:
-   Files with a strong, consistent main developer can sometimes have higher quality due to focused ownership.
-   However, over-reliance on a single main developer increases project risk (bus factor).
-   Identifying main developers is a common technique in empirical software engineering to study developer contributions and evolution of software.

## Limitations
-   **Lines of Code (LOC) as a proxy:** Contribution is measured by LOC churn, which doesn't always reflect the complexity, importance, or quality of work. A developer making small, critical fixes might not appear as a main developer compared to someone adding many lines of boilerplate code.
-   **Author Aliasing:** If authors use multiple names/emails, their contributions might be split, potentially misidentifying the main developer. Consistent author identity is crucial.
-   **Refactoring vs. New Code:** The analysis doesn't inherently distinguish between a main developer who wrote the original code versus one who heavily refactored it. Both contribute to churn.
-   **Temporal Blindness (in single run):** A single run shows the current main developer based on overall history. It doesn't show how ownership evolved.

## Best Practices

### Data Collection
1.  **Ensure clean author data:** Use a `.mailmap` file with Git or other mechanisms to consolidate author identities.
2.  **Sufficient Log History:** Use a comprehensive log history for a more accurate picture of long-term main developers.
3.  **Consider filtering out automated commits:** Commits by bots or build systems might skew results if they involve large churn.

### Analysis Interpretation
1.  **Combine with qualitative knowledge:** Team members often know who the "real" expert is. Use `main-dev` as a data point, not absolute truth.
2.  **Look at `ownership` percentage:** A main developer with 90% ownership is different from one with 30% (where the latter might just be slightly ahead of other contributors).
3.  **Context is key:** For a small utility file, a single main developer is normal. For a large, core component, it might be a risk.

### Action Planning
1.  **Address high-risk dependencies:** If critical components have a single main developer with very high ownership, plan knowledge transfer, documentation, or pair programming.
2.  **Recognize key contributors:** Use the analysis to identify and acknowledge individuals who are central to the development of important modules.

## Output Interpretation Examples

### Strong Main Developer
```csv
entity,major-author,added,deleted,total-churn,ownership
src/payment/PaymentProcessor.java,alice@example.com,2500,500,3000,0.85
```
**Interpretation:** Alice is clearly the main developer for `PaymentProcessor.java`, contributing 85% of its total churn. This indicates deep knowledge but also a potential dependency.

### Collaborative File (Less Clear Main Developer)
```csv
entity,major-author,added,deleted,total-churn,ownership
src/utils/StringUtils.java,bob@example.com,300,150,450,0.35
```
**Interpretation:** Bob is identified as the main developer for `StringUtils.java`, but his ownership is only 35%. Other developers also likely made significant contributions. Check `entity-ownership` for a full picture.

### Team as Main Developer
```csv
entity,major-team,added,deleted,total-churn,ownership
src/api/v1/UsersController.java,backend-services-team,1200,300,1500,0.75
```
**Interpretation:** The `backend-services-team` is primarily responsible for the `UsersController.java`, contributing 75% of its churn.

## Troubleshooting Common Issues

### Misidentified Main Developer
-   **Cause:** Inconsistent author names (e.g., "John Doe", "jdoe@example.com", "john.doe@company.com" treated as different people).
-   **Solution:** Clean up author data using Git's `.mailmap` feature or pre-process the log file.
-   **Cause:** Large, one-off commits by someone not typically involved in the file.
-   **Solution:** Consider the timeframe of analysis or combine with `authors` analysis to see overall contribution patterns.

### Main Developer "Ownership" Too Low
-   **Cause:** Highly collaborative file with many contributors.
-   **Solution:** This is a valid finding. Use `entity-ownership` to see the full distribution.
-   **Cause:** File with very little activity or churn.
-   **Solution:** The concept of a "main developer" might be less relevant here.

### Impact of Large Refactorings
-   **Issue:** A developer performing a large refactoring might appear as the main developer, even if they didn't write the original logic.
-   **Consideration:** This is often a valid reflection of significant effort. If distinction is needed, compare with `refactoring-main-dev` or analyze commit messages.

## Visualization Recommendations
-   **Bar charts:** Show top N files and their main developers, with bar length representing total churn by the main developer. Color-code bars by developer.
-   **Treemaps:** Visualize modules/directories, with the size of each rectangle representing the number of files "owned" by a particular main developer, or total churn by main developers in that module.
-   **Network graphs (less direct):** Could show developers connected to files they are main contributors to, highlighting central figures.
-   **Tables with conditional formatting:** Highlight high ownership percentages or files with main developers who also own many other files. 