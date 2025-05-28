# Main Developer by Revisions Analysis

## Overview
The Main Developer by Revisions analysis identifies the primary contributor to each file or module based on the highest number of revisions (commits) they have made to that entity. This contrasts with `main-dev` (which uses lines of code churn) and `entity-effort` (which shows total revisions for a file). `main-dev-by-revs` specifically pinpoints the individual who has most frequently committed changes to a file, regardless of the size of those changes.

## Analysis Type
**Command:** `main-dev-by-revs`

## Purpose
- Identify the developer who most frequently interacts with each file/module.
- Understand sustained engagement with parts of the codebase.
- Highlight individuals with consistent responsibility or stewardship over files.
- Complement churn-based ownership metrics with a frequency-based perspective.
- Useful for identifying go-to persons for files based on interaction frequency.

## Input Requirements
- **Log file:** Standard VCS log data with commit and author information.
- **Required columns:** `:entity`, `:author`, `:rev` (revision/commit identifier).
- **Note:** Works with basic log formats (does not require numstat data).

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column         | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| `entity`       | The file or module path                                                  |
| `major-author` | The author who made the most commits (revisions) to this entity.         |
| `commits`      | Number of commits made by the `major-author` to this entity.             |
| `total-commits`| Total number of commits made to this entity by all authors.                |
| `ownership`    | Percentage of the entity's total commits contributed by the `major-author`. |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs
```

### With Options
```bash
# Get top 20 files based on commit frequency of their main developer
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs -r 20

# Save analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs -o main-dev-revisions.csv

# Analyze with team mapping (main team by revisions)
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (entities whose `major-author` has the highest commit count).
- **`-o, --outfile`**: Write results to specified file instead of stdout.

### Aggregation Options
- **`-p, --team-map-file`**: Map individual authors to teams. The output will show the "main team by revisions".
- **`-g, --group`**: Aggregate results according to architectural layers.

### Filtering Options
- **`-n, --min-revs`**: Filter entities based on a minimum number of total revisions before identifying the main developer by revisions.

## Log File Requirements
(Same as `entity-effort`)

### Git Standard Format
```bash
git log --pretty=format:'[%h] %aN %ad %s' --date=short --name-only > git.log
```

## Interpretation Guidelines

### Identifying Frequent Contributors
- **High `ownership` percentage (e.g., > 70% of commits):** Indicates a developer who very frequently modifies the file, suggesting deep familiarity or primary responsibility.
- **High `commits` count by `major-author`:** Shows sustained interaction with the file.
- **Comparing with `main-dev` (churn-based):**
    - If `main-dev-by-revs` and `main-dev` point to the same person: This developer both frequently touches the file and contributes a large volume of changes.
    - If different: The `main-dev-by-revs` might be someone making many small, regular updates (e.g., maintenance, minor fixes), while the `main-dev` might have made fewer, but larger, architectural changes or feature additions.

### Understanding Engagement Patterns
- **Files with a `major-author` having high commit `ownership` but low overall `total-commits`:** Might be a newer file primarily handled by one person, or an older, stable file with one dedicated caretaker for minor tweaks.
- **A developer appearing as `major-author` by revisions for many files:** This person is broadly active across the codebase, even if their changes aren't always the largest in terms of lines of code.

## Aggregation and Combination Possibilities

### Team-Level Frequent Interaction
```bash
# Identify the team that most frequently commits to each file
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs -p team-mapping.csv
```
This reveals which teams have the most consistent interaction with specific files or modules.

### Architectural Layer Stewards
```bash
# Identify main developers by commit frequency for architectural components
java -jar code-maat.jar -l logfile.log -c git2 -a main-dev-by-revs -g layers.txt
```

## Combining with Other Analyses

### Recommended Combinations
1.  **`main-dev-by-revs` + `main-dev` (churn-based):** This is the most crucial comparison to understand if the person touching the file most often is also the one making the largest changes.
2.  **`main-dev-by-revs` + `entity-effort`:** While `entity-effort` gives total commits to a file, `main-dev-by-revs` tells you who made the largest *share* of those commits.
3.  **`main-dev-by-revs` + `entity-churn`:** Is the person committing most frequently also associated with high or low churn? High frequency with low churn might mean many small configuration changes or minor bug fixes.
4.  **`main-dev-by-revs` + `authors`:** A file with many authors but one clear `major-author` by revisions may indicate a technical lead or long-term maintainer who handles most routine updates.

### Sequential Analysis Example
```bash
# 1. Identify main developers by commit frequency
java -jar code-maat.jar -l git.log -c git2 -a main-dev-by-revs -o main-devs-by-revs.csv

# 2. Identify main developers by code churn
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o main-devs-by-churn.csv

# 3. (External) Compare the two CSVs to find differences, e.g., developers who commit often but with small changes vs. those with few but large commits.

# 4. Get overall effort (total commits) for context
java -jar code-maat.jar -l git.log -c git2 -a entity-effort -o total-entity-effort.csv
```

### Cross-Analysis Insights
-   **Same `major-author` from `main-dev` and `main-dev-by-revs`:** Strong indication of overall ownership and consistent engagement.
-   **Different `major-authors`:** The `main-dev-by-revs` could be a maintainer making frequent small fixes, while the `main-dev` (by churn) made larger, less frequent changes (e.g., initial implementation or major refactoring).
-   **High commit `ownership` by `major-author` in a file with high `entity-effort`:** This person is truly driving the activity in this frequently changed file.

## Use Cases

### 1. Identifying Key Maintainers
Find developers consistently responsible for ongoing updates and fixes, even if those changes are small.
```bash
java -jar code-maat.jar -l git.log -c git2 -a main-dev-by-revs -o key-maintainers.csv
```

### 2. Understanding Code Stewardship
Identify individuals who act as long-term stewards of particular code areas, making frequent small adjustments.

### 3. Complementing Churn-Based Ownership
Provides a more nuanced view of contribution beyond just lines of code. Someone making many critical one-line fixes might be missed by churn analysis but captured here.

### 4. Assessing Onboarding Effectiveness
If a new team member is supposed to take over a module, are they becoming the `main-dev-by-revs` for its files over time?

## Advanced Analysis Techniques

### Temporal Shifts in Stewardship
Run the analysis on different time windows of the log to see if the person most frequently committing to a file changes over time. This can highlight knowledge transfer or shifts in responsibility.

## Integration with Development Workflow

### Knowledge Sharing
If a file's `main-dev-by-revs` is different from its `main-dev` (by churn), ensure both are involved in discussions about the file's future.

### Bug Triage
The `main-dev-by-revs` might be a good first point of contact for new bugs in a file, as they interact with it most frequently.

## Research Background
-   Commit frequency is another proxy for developer effort and attention, complementing LOC-based measures.
-   Studies on software evolution often look at both the volume of change and the frequency of change to understand development patterns.
-   Identifying developers with high commit frequency to specific modules can indicate informal leadership or specialized roles.

## Limitations
-   **Ignores Change Size/Impact:** Many small, trivial commits can make someone a `main-dev-by-revs` even if their overall impact (measured by churn) is low.
-   **Commit Style Dependent:** Developers who commit very frequently (e.g., after every minor change) will appear more prominently than those who batch changes into fewer, larger commits.
-   **Author Aliasing:** Consistent author identity is crucial.
-   **Automated Commits:** Frequent automated commits (e.g., version bumps, formatting) could skew results if not filtered.

## Best Practices

### Data Collection
1.  **Clean author data:** Use `.mailmap`.
2.  **Filter out truly trivial automated commits** if possible.

### Analysis Interpretation
1.  **Always compare with `main-dev` (churn-based):** This comparison is key to understanding the nature of the contributions.
2.  **Consider the `ownership` percentage:** A high percentage indicates a strong primary committer.
3.  **Contextualize with team knowledge:** Understand commit styles and roles within the team.

### Action Planning
1.  **Recognize consistent contributors:** Acknowledge those who provide ongoing maintenance, even via small commits.
2.  **Investigate discrepancies:** When `main-dev-by-revs` and `main-dev` differ significantly for critical files, understand why.

## Output Interpretation Examples

### Frequent Small Commits Scenario
```csv
entity,major-author,commits,total-commits,ownership
src/config/Settings.xml,dave@example.com,50,60,0.833
```
**Interpretation:** Dave made 50 out of 60 commits to `Settings.xml`. He's the most frequent committer. If `main-dev` (by churn) shows someone else, Dave might be making many small configuration tweaks, while the other person made initial larger structural changes.

### Balanced Contribution Scenario
```csv
entity,major-author,commits,total-commits,ownership
src/core/OrderProcessor.java,jane@example.com,30,100,0.30
```
**Interpretation:** Jane is the `major-author` by revisions for `OrderProcessor.java` with 30% of the commits. While she committed most often, other developers also frequently contribute to this file. This suggests more collaborative maintenance based on frequency.

## Troubleshooting Common Issues

### Misleading `major-author` due to Commit Style
-   **Issue:** A developer who commits extremely frequently with tiny changes might overshadow others.
-   **Solution:** Primarily rely on this metric in comparison with `main-dev` (churn) and use qualitative team understanding.

### Automated Commits Dominating
-   **Issue:** If build scripts or bots commit frequently to certain files (e.g., updating version numbers).
-   **Solution:** Filter these authors or commit types from the log if they are not relevant to human development patterns.

## Visualization Recommendations
-   **Dashboard:** Show `main-dev` (churn) and `main-dev-by-revs` side-by-side for key files.
-   **Bar charts:** Top N files by `major-author` commit count.
-   **Scatter Plot:** X-axis: `commits by main-dev-by-revs`, Y-axis: `total-churn by main-dev`. This can visually separate frequent low-impact committers from infrequent high-impact ones. 