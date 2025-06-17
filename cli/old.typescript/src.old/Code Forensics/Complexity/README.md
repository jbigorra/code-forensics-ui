# Complexity Hotspots Analysis

For visualizing hotspots with an enclosure diagram (e.g., sunburst, treemap, or icicle) to measure codebase complexity and identify refactor candidates, you should pair a complexity analysis (e.g., static code metrics like cyclomatic complexity, function count, or lines of code per file) with one or more of the following code-maat analyses:

1. **Entity Churn (entity-churn)**
  - **Why**: Measures lines added/deleted per file, highlighting files with high change activity.
  - **How it helps**: Files with both high churn and high complexity are prime refactoring candidates and likely hotspots.
  - **Visualization**: Use file hierarchy for enclosure, color/size by churn, and overlay complexity.
2. Revisions (revisions) / Entity Effort (entity-effort)
  - **Why**: Counts number of commits per file, showing which files are changed most often.
  - **How it helps**: High-revision, high-complexity files are maintenance burdens and likely to be problematic.
  - **Visualization**: Size or color by revision count, overlay complexity.
3. Coupling (coupling)
  - **Why**: Shows which files tend to change together.
  - **How it helps**: Highly coupled, complex files are architectural risks. You can visualize coupling as links or highlight clusters in the enclosure.
  - **Visualization**: Use enclosure for structure, and add coupling as overlays or edge-bundles.
4. Fragmentation (fragmentation)
  - **Why**: Measures how many unique authors have touched a file.
  - **How it helps**: High-fragmentation, high-complexity files may have coordination and quality risks.

## Typical Workflow

1. Run static analysis to get complexity per file (e.g., cyclomatic complexity, SLOC).
2. Run code-maat to get churn, revisions, or effort per file.
3. Join datasets on file/module name.
4. Visualize with an enclosure diagram:
  - **Hierarchy**: Directory/file structure
  - **Size**: Complexity metric (e.g., SLOC, cyclomatic complexity)
  - **Color**: Churn or revision count (hotter = more change)
  - **Optional overlays**: Coupling or fragmentation

## Why This Works

- Hotspots = High Complexity × High Change
  - Files that are both complex and frequently changed are the most error-prone and costly to maintain (see Hotspot Theory).
- Enclosure diagrams make it easy to spot large, complex, and volatile files in the context of the codebase structure.

## Best practices for Time Ranges & Frequency

1. Use a Rolling Window (3–12 months)
   - Why: Recent activity is most relevant for identifying current hotspots and refactoring needs. Too long a window dilutes actionable signals; too short misses trends.
   - Typical: 6 months is a strong default for most teams.
   - Adjust: Use 3 months for fast-moving projects, 12 months for slow-moving/legacy codebases.
2. Analyze by Release or Sprint
   - Why: Aligns analysis with your delivery cadence, making it actionable for planning and retrospectives.
   - How: Run the analysis at the end of each major release, or every 2–4 sprints.
1. Compare Periods for Trend Detection
   - Why: Spot emerging or declining hotspots, not just static ones.
   - How: Run the analysis for consecutive periods (e.g., Q1 vs. Q2, or last 6 months vs. previous 6 months) and compare results.
2. Frequency: Monthly or Quarterly
   - Monthly: For active projects, this cadence keeps the team aware of new risks and supports continuous improvement.
   - Quarterly: For stable or less active codebases, quarterly is sufficient and less noisy.
3. Special Cases
   - Before/After Major Refactoring: Run before and after to measure impact.
   - Pre-Release: Identify last-minute risks before shipping.
   - Onboarding/Team Changes: Run when new teams take over legacy code.

###  Summary Table

| Scenario | Recommended Window | Frequency | Why/When to Use |
|-------------------------|-------------------|---------------|-------------------------------|
| Active development | 3–6 months | Monthly | Catch new hotspots quickly |
| Stable/legacy codebase | 6–12 months | Quarterly | Focus on persistent issues |
| Release-driven teams | Since last release| Per release | Actionable for planning |
| Major refactoring | Custom (before/after) | As needed | Measure refactoring impact |
| Trend analysis | Compare 2+ periods| Quarterly | Spot emerging/declining risks |