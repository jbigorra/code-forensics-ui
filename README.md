# Repo Analyser Web

Repo Analyser Web is a web application built with AlpineJS that downloads the CSV files previously generated with the usage of code-maat and visualizes the information with Chart.js.

**Note: code-maat is a tool that does a code-forensics analysis on a git repository and outputs CSV files containing the necessary data to be visualised.**

# Table of Contents


# Simple setup

No NPM modules required, just open the `index.html` with vscode live server or similar tool.

## Requirements
1. Vscode Live Server extension serving files on port 5500 or any other IDE with a similar tool to serve html files.
2. Official vscode prettier extension `esbenp.prettier-vscode` to format the code on save. (vscode workspace settings are included in the repo and ready to use).

# Future Setup with bundler RsPack

Potentially in the future the project will be modified to use a bundler like RsPack to manage the dependencies and build the project. The bundler config is already included in the repo but given the initial issues had with loading js modules correctly, the project is still using the simple setup.

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
