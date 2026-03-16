# Contributing Guide

Thank you for your interest in collaborating on this project! 🎉
This document describes how to effectively contribute to monorepo development while maintaining code consistency and quality.

--

## 1. General Rules

- All changes should be made via **separate branches** (feature, fix, chore, docs).
- Each branch should be based on the latest main state.
- We create **Pull Requests (PRs)** with clear change descriptions.
- The code must be **linted and tested** before the merge.
- Commit names should be descriptive and follow convention (e.g., _feat: authorization module added_).

---

## 2. Monorepo Structure

The project is organized using Turborepo:

- \`apps/frontend\` — frontend application (REACT + TYPESCRIPT + TANSTACK)
- \`apps/backend\` — backend (NestJS)
- \`packages/shared\` — shared types and models

Each application has its own \`package.json\`, but all dependencies are controlled by \`npm workspaces\`.

---

## 3. Workflow for creating changes

1. Create a new branch:
   \`\`\`bash
   git checkout -b feature/change-name
   \`\`\`

2. Make your changes and run local tests:
   \`\`\`bash
   npm run lint
   npm run test
   \`\`\`

3. Make a commit:
   \`\`\`bash
   git add .
   git commit -m "feat: change description"
   \`\`\`

4. Push the branch:
   \`\`\`bash
   git push origin feature/change-name
   \`\`\`

5. Create a **Pull Request** and request a review.

---

## 4. Code Standards

- Use the ESLint + Prettier configuration.
- Adhere to the code style established by the repo.

- Type all data in TypeScript.
- Do not commit \`node_modules\`, \`dist\`, or \`.env\` files.

--

## 5. Tests

- Backend: use **Gherkin**
- Run tests before every commit.

--

## 6. Security Rules

- Do not publish any API keys or sensitive data.
- Use \`.env\` files (added to \`.gitignore\`).
- If you find a vulnerability, report it privately to the project maintainers.

--

## 7. Documentation

If your change introduces a new feature or module, add the appropriate snippet to the README or a separate documentation section.

--

Thank you for your contribution to the project 💚
