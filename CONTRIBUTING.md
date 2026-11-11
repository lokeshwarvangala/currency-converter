# Contributing to Currency Converter

Thank you for your interest in contributing to the **Currency Converter** project! We appreciate contributions of all kinds: bug fixes, new features, performance improvements, documentation updates, and feedback.

Please take a few moments to review these guidelines before submitting a contribution.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How to Contribute](#-how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Workflow](#-development-workflow)
  - [1. Fork & Clone](#1-fork--clone)
  - [2. Create a Feature Branch](#2-create-a-feature-branch)
  - [3. Local Development](#3-local-development)
  - [4. Coding Standards](#4-coding-standards)
  - [5. Commit Messages](#5-commit-messages)
  - [6. Pre-PR Checklist](#6-pre-pr-checklist)
- [Testing Guidelines](#-testing-guidelines)
- [Getting Help](#-getting-help)

---

## 🕊 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and considerate in all communications and reviews.

---

## 💡 How to Contribute

### Reporting Bugs
If you find a bug, please create a new GitHub Issue with:
1. **Clear description**: A clear and concise title and summary of the issue.
2. **Steps to reproduce**: Numbered steps to reproduce the behavior.
3. **Expected vs. actual behavior**: What you expected to happen versus what actually happened.
4. **Environment**: Browser name/version, OS, and Node.js version.

### Suggesting Features
Feature requests are welcomed! When opening an issue for a feature, describe:
- The problem your feature solves or the user experience it improves.
- Any alternative solutions or workarounds you've considered.
- Mockups, screenshots, or examples if applicable.

---

## 🔄 Development Workflow

### 1. Fork & Clone
1. Fork the repository to your own GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/currency-converter.git
   cd currency-converter
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 2. Create a Feature Branch
Create a new branch from `main` using descriptive naming:
```bash
git checkout -b <type>/<short-description>
```

**Branch Prefix Conventions:**
- `feat/` — New feature or capability (e.g. `feat/historical-rate-charts`)
- `fix/` — Bug fix (e.g. `fix/swap-button-animation-delay`)
- `docs/` — Documentation updates (e.g. `docs/api-caching-guide`)
- `refactor/` — Code changes that neither fix a bug nor add a feature
- `test/` — Adding or updating test cases
- `chore/` — Build process, dependency updates, or tooling

### 3. Local Development
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Any changes you make in `src/` will instantly hot-reload in the browser.

### 4. Coding Standards
- **TypeScript Strict Mode**: Keep code fully typed. Avoid using `any`; define explicit interfaces in `src/types/`.
- **Component Architecture**: Keep components small, focused, and presentational where possible. Complex state should be encapsulated in custom hooks under `src/hooks/`.
- **Styling**: Use standard Tailwind CSS utility classes. Avoid arbitrary CSS inline styles unless required for dynamic runtime properties.
- **Accessibility (a11y)**:
  - Form inputs must have accessible labels (`htmlFor` matching `id`).
  - Interactive buttons must have meaningful text or `aria-label` attributes.
  - Rate updates should maintain screen-reader accessibility (`aria-live="polite"`).

### 5. Commit Messages
Follow conventional commits syntax:
```
<type>(<scope>): <short imperative description>

[optional body]
```

**Examples:**
- `feat(currencies): add support for additional cryptocurrency pairs`
- `fix(rates): handle network timeout gracefully when offline`
- `test(cache): add test coverage for 24h expiration threshold`
- `docs(readme): update setup prerequisites and node version requirements`

### 6. Pre-PR Checklist

Before pushing your branch and opening a Pull Request, ensure that all checks pass:

1. **Run TypeScript Check**:
   ```bash
   npm run lint
   ```
2. **Run All Unit Tests**:
   ```bash
   npm test
   ```
   *(All tests must pass with 0 errors).*
3. **Verify Production Build**:
   ```bash
   npm run build
   ```
   *(Ensure Vite builds the production bundle in `dist/` with zero warnings).*

---

## 🧪 Testing Guidelines

- All tests use **[Vitest](https://vitest.dev/)**.
- Test files should be placed inside `__tests__/` directories adjacent to the code they test or named `*.test.ts` / `*.test.tsx`.
- Test business logic thoroughly:
  - Boundary conditions (0 amounts, negative amounts, identical currencies).
  - Cache storage, cache invalidation, and network timeouts.
  - Error branches and fallback behavior.

Run tests in watch mode while coding:
```bash
npx vitest
```

---

## 🚀 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin <type>/<short-description>
   ```
2. Go to the original repository on GitHub and click **"Compare & pull request"**.
3. Fill out the PR template:
   - Provide a concise summary of the changes made.
   - Reference any relevant Issue numbers (e.g. `Fixes #12`).
   - Mention how the changes were verified.
4. Maintainers will review your PR and provide feedback!

Thank you for contributing to make Currency Converter better! 🌟
