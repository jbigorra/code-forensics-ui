# Refactoring Main Developer Analysis

## Overview
The Refactoring Main Developer analysis identifies the primary contributor to each file or module based on the highest volume of deleted lines of code. This is distinct from the `main-dev` analysis, which considers total churn (added + deleted). This analysis specifically highlights individuals who are leading efforts in code cleanup, simplification, and removal of obsolete functionality.

## Analysis Type
**Command:** `refactoring-main-dev`

## Purpose
- Identify key developers responsible for refactoring and code reduction efforts.
- Recognize contributions that improve code quality by removing or simplifying code.
- Understand who is primarily tackling technical debt by deleting obsolete code.
- Complement the `main-dev` analysis by showing a different facet of contribution.
- Support initiatives around code health and maintainability by identifying key players.

## Input Requirements
- **Log file:** VCS log data with line change information (numstat format).
- **Required columns:** `:entity`, `:author`, `:loc-deleted` (and `:loc-added` for calculating ownership percentage accurately against total churn).
- **Note:** Requires VCS logs with modification metrics (git --numstat, etc.).

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column             | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `entity`           | The file or module path                                                     |
| `refactoring-author`| The author who deleted the most lines of code from this entity.             |
| `deleted`          | Total lines deleted by the `refactoring-author` from this entity.           |
| `total-entity-deleted` | Total lines deleted from this entity by all authors.                       |
| `ownership`        | Percentage of the entity's total *deleted* lines contributed by the `refactoring-author`. |

*Note: The exact column names might vary slightly based on implementation; the conceptual output is key.*

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev
```

### With Options
```bash
# Get top 20 files with most refactoring activity by their main refactorer
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev -r 20

# Save refactoring main developer analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev -o refactoring-devs.csv

# Analyze with team mapping (main refactoring team)
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev -p team-mapping.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (entities with the most lines deleted by their refactoring-author).
- **`-o, --outfile`**: Write results to specified file instead of stdout.

### Aggregation Options
- **`-p, --team-map-file`**: Map individual authors to teams. The output will show the "main refactoring team".
- **`-g, --group`**: Aggregate results according to architectural layers. This will show the main refactoring developer for each defined architectural component.

### Filtering Options
- **`-n, --min-revs`**: Filter entities based on a minimum number of total revisions before identifying the main refactoring developer.

## Log File Requirements
(Same as `main-dev` and other churn-based analyses)

### Git Numstat Format
```bash
git log --pretty=format:'[%h] %aN %ad %s' --date=short --numstat > git-churn.log
```

## Interpretation Guidelines

### Identifying Key Refactorers
- **High `ownership` percentage (e.g., > 70% of deleted lines):** Indicates a strong refactoring lead for that file.
- **High `deleted` count by `refactoring-author`:** Shows significant code removal activity by this individual in the specific file.
- **Developers frequently appearing as `refactoring-author` across multiple files:** Highlights individuals who consistently engage in cleanup and simplification tasks.

### Understanding Code Evolution
- **Files with high refactoring activity:** These are areas undergoing significant cleanup, simplification, or removal of features.
- **Comparing `refactoring-main-dev` with `main-dev`:**
    - If the same developer is listed for both, they are shaping the file through both addition and reduction.
    - If different developers, it might indicate a hand-off (e.g., one builds, another refactors/maintains) or specialized roles.

## Aggregation and Combination Possibilities

### Team-Level Refactoring Focus
```bash
# Identify the main refactoring team for each file
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev -p team-mapping.csv
```
This shows which teams are primarily driving code reduction and cleanup efforts.

### Architectural Layer Refactoring
```bash
# Identify main refactoring developers for architectural components
java -jar code-maat.jar -l logfile.log -c git2 -a refactoring-main-dev -g layers.txt
```
Helps understand which parts of the system are seeing the most refactoring activity and by whom.

## Combining with Other Analyses

### Recommended Combinations
1.  **`refactoring-main-dev` + `main-dev`:** Essential for comparing who builds vs. who prunes/cleans. Are they the same people or different specialists?
2.  **`refactoring-main-dev` + `entity-churn`:** Correlate who is doing the deleting with the overall churn patterns (e.g., is a high-churn file being actively refactored by a specific person?).
3.  **`refactoring-main-dev` + `author-churn`:** Check if individuals identified as main refactorers also have a high "Refactoring Index" in the `author-churn` analysis.
4.  **`refactoring-main-dev` + `age`:** Are older files being refactored more, potentially by newer team members or dedicated refactoring efforts?

### Sequential Analysis Example
```bash
# 1. Identify main refactoring developers
java -jar code-maat.jar -l git.log -c git2 -a refactoring-main-dev -o refactoring-main-devs.csv

# 2. Identify overall main developers
java -jar code-maat.jar -l git.log -c git2 -a main-dev -o main-devs.csv

# 3. (External) Compare the two CSVs to find differences and overlaps in key personnel.

# 4. Check author-level refactoring tendencies
java -jar code-maat.jar -l git.log -c git2 -a author-churn -o author-churn-metrics.csv
```

### Cross-Analysis Insights
-   **Different `main-dev` and `refactoring-main-dev`:** May indicate specialization (e.g., feature developers vs. maintenance/refactoring specialists) or a hand-off in the lifecycle of a file.
-   **High `deleted` count by `refactoring-author` in a low overall churn file:** Suggests targeted cleanup rather than ongoing development.
-   **Developer is `refactoring-main-dev` for many files also showing high `entity-churn` (specifically deletions):** This person is a major force in reducing code size or complexity across the project.

## Use Cases

### 1. Recognizing Refactoring Champions
Identify and acknowledge developers who significantly contribute to code health through refactoring.
```bash
java -jar code-maat.jar -l git.log -c git2 -a refactoring-main-dev -o refactoring-champions.csv
```

### 2. Technical Debt Reduction Tracking
Monitor who is actively involved in removing code from areas known to have technical debt.

### 3. Understanding Team Roles and Specializations
See if specific individuals or teams specialize more in refactoring compared to new feature development.

### 4. Assessing Impact of Cleanup Initiatives
If a specific initiative was launched to refactor a module, this analysis can show who drove those changes by looking at the relevant time period.

## Advanced Analysis Techniques

### Temporal Refactoring Trends
By running `refactoring-main-dev` on different time slices of the log, you can see if certain developers become key refactorers during specific periods (e.g., post-release cleanup phases).

### Refactoring Ownership Percentage
The `ownership` column (percentage of deleted lines by the `refactoring-author` out of total deleted lines in that file) is crucial. A high percentage means this person is truly dominating the cleanup of that specific file.

## Integration with Development Workflow

### Code Health Reviews
Use insights to discuss code cleanup efforts and acknowledge those leading them.

### Assigning Refactoring Tasks
If a module needs significant refactoring, identify developers who have shown a proclivity or expertise in this area through past activity.

### Mentoring
Pair developers less experienced in refactoring with those who are identified as strong refactorers.

## Research Background
Refactoring is a critical software maintenance and evolution activity. Research highlights:
-   The importance of continuous refactoring for maintaining software quality.
-   That refactoring activities are often less visible but highly valuable.
-   Identifying developers who frequently refactor can point to experienced individuals or those tasked with improving code quality.

## Limitations
-   **Focus on Deletions Only:** This analysis only considers deleted lines. A refactoring might involve adding some new, cleaner code as well, which isn't the primary focus here (but is captured by `main-dev` if the net churn is high).
-   **Intent Not Captured:** Deleting lines doesn't always mean "good" refactoring. It could be feature removal. Context from commit messages or team knowledge is needed.
-   **Author Aliasing:** As with other author-based analyses, consistent author identity is key.
-   **Does not measure quality of refactoring:** Only the quantity of deleted lines.

## Best Practices

### Data Collection
1.  **Clean author data:** Use `.mailmap`.
2.  **Sufficient log history:** Especially if looking for sustained refactoring efforts.

### Analysis Interpretation
1.  **Use in conjunction with `main-dev`:** The comparison is often the most insightful part.
2.  **Consider commit messages:** For files with high refactoring activity, check commit messages for terms like "refactor," "cleanup," "simplify," "remove obsolete."
3.  **Don't penalize deletions:** Recognize that removing code is often harder and more valuable than adding it.

### Action Planning
1.  **Acknowledge and reward refactoring efforts:** Make this often invisible work visible.
2.  **Strategically assign refactoring tasks:** Leverage identified refactoring specialists for complex cleanup tasks.

## Output Interpretation Examples

### Clear Refactoring Lead
```csv
entity,refactoring-author,deleted,total-entity-deleted,ownership
src/legacy/OldReportingModule.java,carla@example.com,1500,1600,0.9375
```
**Interpretation:** Carla is overwhelmingly the main refactorer for `OldReportingModule.java`, responsible for 93.75% of its deleted lines. This was likely a major cleanup effort led by her.

### Collaborative Refactoring (or just general deletions)
```csv
entity,refactoring-author,deleted,total-entity-deleted,ownership
src/common/Utils.java,david@example.com,80,200,0.40
```
**Interpretation:** David deleted the most lines in `Utils.java`, but only accounts for 40% of total deletions in that file. Other developers also contributed significantly to code removal here.

### Comparing with Main Developer
-   **Scenario:** `main-dev` for `FeatureX.java` is Alice. `refactoring-main-dev` for `FeatureX.java` is Bob.
-   **Possible Interpretation:** Alice built the feature, and Bob was later primarily responsible for refining, simplifying, or removing parts of it.

## Troubleshooting Common Issues

### `refactoring-author` is same as `main-author`
-   **Interpretation:** This is common. The developer who writes the most code (adds+deletes) might also be the one who deletes the most. This indicates they are actively evolving the file through all types of changes.

### Low `ownership` percentage for `refactoring-author`
-   **Interpretation:** No single developer dominates the deletion activity for that file. Code removal is more distributed.

### Large Deletions by Build/Merge Tools
-   **Issue:** Automated processes might sometimes cause large deletions that are not true refactoring by a human.
-   **Solution:** Attempt to filter such commits from the log if they are identifiable and skew results significantly.

## Visualization Recommendations
-   **Side-by-side bar charts:** For key files, show `main-dev` and `refactoring-main-dev` next to each other.
-   **Tables with conditional formatting:** Highlight developers who frequently appear as `refactoring-author` or have high deletion `ownership`.
-   **Scatter plot:** Plot `lines added by main-dev` vs. `lines deleted by refactoring-main-dev` for each file to see different contribution patterns. 