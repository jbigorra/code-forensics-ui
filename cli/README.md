# Foran (Forensics Analysis)

A CLI tool for running code forensics analysis on Git repositories using various code complexity analysis tools.

## Installation

```bash
npm install -g foran
```

## Usage

### Run Analysis

Run a forensics analysis on a Git repository:

```bash
foran run --folder /path/to/repo
```

#### Options

- `-f, --folder <path>` (required): Target folder of the git repository
- `-af, --analyse-from <date>`: Starting date to gather the git log data (default: 30 days ago)
- `-au, --analyse-until <date>`: End date for the analysis (must be earlier than analyse-from)
- `-t, --analysis-type <type>`: Type of analysis to run (default: all)
- `-h, --help`: Display help for the run command

### Help

Display help for all commands:

```bash
foran help
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## License

ISC 
