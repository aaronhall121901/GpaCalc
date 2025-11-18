# GPA Calculator

Responsive single-page app to plan GPA scenarios using the standard 4.0 scale.

## Features

- Dynamic course table that supports unlimited rows, inline edits, and quick remove/clear actions.
- Standard GPA calculation with running credit/quality point totals.
- Read-only grade-point column that mirrors the 4.0 scale for instant reference.
- Sample dataset to demo the workflow.

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) for running the automated tests and optional local server.

### Run the site locally

Use any static server from the project root. For example:

```powershell
npx http-server .
```

Then open the printed URL (default `http://127.0.0.1:8080`) in your browser.

### Run the automated tests

```powershell
npm test
```

This executes the Node.js test suite that validates the GPA calculation logic.

## Grade scale

| Letter | Points |
| ------ | ------ |
| A+/A   | 4.0    |
| A-     | 3.7    |
| B+     | 3.3    |
| B      | 3.0    |
| B-     | 2.7    |
| C+     | 2.3    |
| C      | 2.0    |
| C-     | 1.7    |
| D+     | 1.3    |
| D      | 1.0    |
| D-     | 0.7    |
| F      | 0      |
