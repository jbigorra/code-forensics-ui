# Identity Analysis

## Overview
The Identity analysis helps resolve and map different author identities in your version control history. It detects and consolidates multiple aliases, email addresses, or name variations that refer to the same person. This is crucial for accurate developer-centric analyses, as inconsistent author identities can skew results in all author-based metrics.

## Analysis Type
**Command:** `identity`

## Purpose
- Detect and consolidate multiple author identities (aliases, emails, name variations)
- Improve accuracy of all author-based analyses (ownership, effort, communication, etc.)
- Support team mapping and organizational reporting
- Identify contributors with multiple identities
- Prepare data for downstream analyses and visualizations

## Input Requirements
- **Log file:** Standard VCS log data with author information
- **Required columns:** `:author` (name/email as recorded in VCS)
- **Note:** Works with basic log formats; more effective with longer project history

## Output Format
The analysis returns a CSV dataset with the following columns:

| Column | Description |
|--------|-------------|
| `alias` | The raw author name or email as found in the log |
| `canonical` | The resolved, canonical identity for this author |
| `count` | Number of times this alias appears in the log |

## Command Line Usage

### Basic Usage
```bash
java -jar code-maat.jar -l logfile.log -c git2 -a identity
```

### With Options
```bash
# Get top 50 most frequent aliases
java -jar code-maat.jar -l logfile.log -c git2 -a identity -r 50

# Save identity analysis to file
java -jar code-maat.jar -l logfile.log -c git2 -a identity -o identity.csv
```

## Configuration Options

### Output Options
- **`-r, --rows`**: Maximum number of rows to include in the output (most frequent aliases)
- **`-o, --outfile`**: Write results to specified file instead of stdout

## Log File Requirements

### Git Standard Format
```bash
# Generate git log with author information
git log --pretty=format:'%aN <%aE>' > git-authors.log
```

### Expected Log Format
```
John Doe <john.doe@company.com>
J. Doe <john.doe@company.com>
jdoe <john.doe@company.com>
Jane Smith <jane@company.com>
```

## Interpretation Guidelines

### Identity Resolution Patterns

#### Multiple Aliases for One Person
- **Same email, different names:** E.g., "John Doe", "J. Doe", "jdoe" all map to one canonical identity
- **Different emails, same name:** May require manual mapping or .mailmap file
- **Automated accounts:** Can be filtered or mapped to a generic identity

#### Canonical Identity
- **Most common or preferred form:** Used for all downstream analyses
- **Supports team mapping:** Canonical identities can be mapped to teams or roles

### Quality and Risk Indicators

#### Concerning Patterns
- **Many aliases for one person:** Indicates inconsistent VCS configuration
- **Unresolved identities:** May require manual intervention
- **Automated/bot accounts:** Should be filtered for human-centric analyses

#### Healthy Patterns
- **Consistent author identities:** One canonical per person
- **Clean mapping:** All aliases resolved to correct canonical

## Aggregation and Combination Possibilities

### Team Mapping
- Use canonical identities as keys for mapping to teams, departments, or roles
- Prepare data for organizational reporting

### Downstream Analysis Preparation
- Run identity analysis before all author-based analyses for best accuracy
- Use canonical identities in all subsequent metrics

## Combining with Other Analyses

### Recommended Combinations
1. **Identity + Authors/Ownership:** Ensure accurate author counts and ownership metrics
2. **Identity + Communication:** Map communication networks with resolved identities
3. **Identity + Effort:** Attribute effort correctly to individuals
4. **Identity + Team Mapping:** Support organizational reporting and team-level analysis

### Sequential Analysis Example
```bash
# 1. Resolve identities
java -jar code-maat.jar -l git.log -c git2 -a identity -o identity.csv

# 2. Use canonical identities in all further analyses
java -jar code-maat.jar -l git.log -c git2 -a authors -o authors.csv
java -jar code-maat.jar -l git.log -c git2 -a entity-ownership -o ownership.csv
```

### Cross-Analysis Insights
- **Unresolved identities can skew all author-based metrics**
- **Consistent identity mapping improves accuracy of all analyses**

## Use Cases

### 1. Data Cleaning for Analysis
```bash
# Prepare clean author data for all analyses
java -jar code-maat.jar -l git.log -c git2 -a identity -o clean-identities.csv
```

### 2. Team Mapping and Reporting
```bash
# Map canonical identities to teams
# (External: join identity.csv with team-mapping.csv)
```

### 3. Contributor Recognition
```bash
# Accurately recognize contributors with multiple aliases
java -jar code-maat.jar -l git.log -c git2 -a identity -o contributors.csv
```

## Advanced Analysis Techniques

### .mailmap Integration
- Use a `.mailmap` file in your repository to define canonical mappings
- Code-maat can use this file to improve identity resolution
- Example:
```
John Doe <john.doe@company.com> jdoe <john.doe@company.com>
John Doe <john.doe@company.com> John D. <johnny@company.com>
```

### Manual Review
- Review identity.csv for unresolved or suspicious mappings
- Manually edit or supplement mappings as needed

## Integration with Development Workflow

### Pre-Analysis Data Cleaning
- Always run identity analysis before author-based metrics
- Update .mailmap as new aliases are discovered

### Team Onboarding
- Ensure new team members use consistent author configuration

### Contributor Recognition
- Use canonical identities for accurate recognition and reporting

## Research Background
This analysis is based on research showing that:
- Inconsistent author identities are a major source of error in software repository mining
- Identity resolution is critical for accurate developer-centric metrics
- .mailmap and manual review are best practices for identity management

## Limitations
- **Heuristic-based:** May not resolve all aliases automatically
- **Manual intervention:** Sometimes needed for complex cases
- **Depends on log completeness:** Incomplete history may miss aliases
- **No semantic analysis:** Does not infer identity from commit content

## Best Practices

### Data Collection
1. **Use .mailmap** for canonical mapping
2. **Encourage consistent author configuration** in VCS
3. **Review identity mappings regularly**
4. **Filter automated/bot accounts** if needed

### Analysis Interpretation
1. **Check for unresolved or suspicious mappings**
2. **Validate with team knowledge**
3. **Update mappings as team evolves**

### Action Planning
1. **Clean identities before all author-based analyses**
2. **Recognize contributors accurately**
3. **Support team mapping and reporting**

## Output Interpretation Examples

### Multiple Aliases Example
```csv
alias,canonical,count
John Doe <john.doe@company.com>,John Doe <john.doe@company.com>,120
J. Doe <john.doe@company.com>,John Doe <john.doe@company.com>,15
jdoe <john.doe@company.com>,John Doe <john.doe@company.com>,8
```
**Interpretation:** All three aliases are mapped to the canonical identity for John Doe.

### Automated Account Example
```csv
alias,canonical,count
build-bot <ci@company.com>,build-bot <ci@company.com>,200
```
**Interpretation:** Automated accounts can be filtered or mapped to a generic identity.

## Troubleshooting Common Issues

### Unresolved Aliases
- **Add mappings to .mailmap** or edit identity.csv manually
- **Check for typos or inconsistent formatting**

### Automated/Bot Accounts
- **Filter or map to generic identity** for human-centric analyses

### Incomplete History
- **Ensure full project history** for comprehensive mapping

## Visualization Recommendations
- **Bar charts:** Show most frequent aliases and their canonical mapping
- **Network graphs:** Visualize alias-to-canonical relationships
- **Tables:** List all aliases and their resolved identities 