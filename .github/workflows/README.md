# GitHub Actions CI/CD Pipeline

This document describes the CI/CD configuration for the Cash Register project.

## Overview

The pipeline runs automatically on:
- Push to `main` and `develop` branches
- Pull Requests to `main` and `develop` branches

## Pipeline Jobs

### 1. Test & Coverage
**Execution:** Matrix with Node.js 18.x and 20.x

**Steps:**
- Checkout code
- Install dependencies (`npm ci`)
- Run tests with coverage (`npm run test:coverage`)
- Check minimum coverage of 80%
- Upload reports to Codecov
- Store coverage artifacts

**Success Criteria:** Code coverage >= 80%

### 2. Security Audit - Dependencies
**Execution:** Runs in parallel with test job

**Steps:**
- Audit vulnerabilities with `npm audit`
- Minimum level: moderate
- Generate detailed JSON report

**Goal:** Identify dependencies with known vulnerabilities

### 3. Security Analysis - CodeQL
**Execution:** Runs in parallel with test job

**Steps:**
- Static code analysis with GitHub CodeQL
- Detect security and quality patterns
- Queries: security-and-quality

**Goal:** Identify security issues in source code

### 4. Security Analysis - Snyk
**Execution:** Runs in parallel with test job

**Steps:**
- Vulnerability scan with Snyk
- Threshold: high severity
- Upload SARIF report

**Required Configuration:**
- Secret `SNYK_TOKEN` must be configured in repository

**Goal:** Additional vulnerability analysis with specialized tool

### 5. Security Analysis - Secret Scanning
**Execution:** Runs in parallel with test job

**Steps:**
- Scan for secrets with Gitleaks
- Checks complete Git history
- Detects exposed credentials, tokens, API keys

**Goal:** Prevent leakage of sensitive information

### 6. Security Analysis - License Compliance
**Execution:** Runs in parallel with test job

**Steps:**
- Check dependency licenses
- Generate compliance report
- Summary of licenses used

**Goal:** Ensure software license compliance

### 7. Code Quality - Linting
**Execution:** Runs in parallel with test job

**Steps:**
- Run ESLint (if configured)
- Generate quality report

**Goal:** Maintain code standards

### 8. CI/CD Status Check
**Execution:** After all previous jobs

**Steps:**
- Check status of all jobs
- Fails if tests or coverage fail
- Summary of all checks

## Required Configuration

### Mandatory Secrets
No secrets are mandatory for basic functionality.

### Optional Secrets
- `SNYK_TOKEN`: For Snyk analysis (recommended)
- `GITLEAKS_LICENSE`: For Gitleaks Enterprise (optional)
- `CODECOV_TOKEN`: For Codecov upload (optional, improves reliability)

### How to Configure Secrets
1. Go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add the secret name and value

## Reports and Artifacts

The following artifacts are stored for 30 days:

- **Coverage Reports**: Code coverage reports (per Node.js version)
- **NPM Audit Report**: Detailed vulnerability report
- **Licenses Report**: Dependency licenses report
- **ESLint Report**: Code quality report

### How to Access Artifacts
1. Go to the "Actions" tab in the repository
2. Click on the desired workflow run
3. Scroll to the "Artifacts" section
4. Download the desired artifacts

## Badges

Add badges to README.md to show CI/CD status:

```markdown
![CI/CD Pipeline](https://github.com/your-username/CashRegister/workflows/CI%2FCD%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/your-username/CashRegister/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/CashRegister)
```

## Troubleshooting

### Code Coverage Below 80%
- Run `npm run test:coverage` locally
- Add tests for uncovered areas
- Check the report at `coverage/lcov-report/index.html`

### Dependency Vulnerabilities
- Run `npm audit` locally
- Update vulnerable dependencies: `npm audit fix`
- For critical vulnerabilities: `npm audit fix --force` (use with caution)

### Snyk Failing
- Check if `SNYK_TOKEN` is configured
- Job continues even with failures (continue-on-error: true)
- Review vulnerabilities in Snyk dashboard

### CodeQL Alerts
- Go to Security > Code scanning alerts
- Review and fix identified alerts
- Mark as false positive if applicable

## Future Improvements

- [ ] Add automatic deployment after CI success
- [ ] Implement performance tests
- [ ] Add cyclomatic complexity analysis
- [ ] Implement Dependency Review Action
- [ ] Add integration tests
- [ ] Configure branch protection rules based on CI
- [ ] Add notifications (Slack, Email)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Snyk Documentation](https://docs.snyk.io/)
- [Codecov Documentation](https://docs.codecov.com/)
