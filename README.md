# Repo Analyser Web

Repo Analyser Web is a web application built with AlpineJS that downloads the CSV files previously generated with the
usage of code-maat and visualizes the information with Chart.js.

**Note: code-maat is a tool that does a code-forensics analysis on a git repository and outputs CSV files containing the
necessary data to be visualised.**

# Table of Contents

# Simple setup

No NPM modules required, just open the `index.html` with vscode live server or similar tool.

# Get started

Install the dependencies:

```bash
npm install
```

## Get Started

Start the dev server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

## Static files

For simplicity the CSV files are stored in the `src/public` folder but are ignored by git to avoid putting
personal information (emails) in the repository.

