# Welcome to PEC ACM Website contributing guide

Thank you for investing your time in contributing to PEC ACM Website! Any contribution you make will be amazing ✨.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

> [!IMPORTANT]
> We don't really care if you use LLMs/Coding Agents to **help** with your PRs (_keyword: help_), but we expect you to fully understand the code in your PR, as we might question some design decision while reviewing the PR.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Issues](#reporting-issues)

## Getting Started

The PEC ACM Website repo is using [pnpm](https://pnpm.io). Make sure you have the [latest version of pnpm](https://pnpm.io/installation) installed in your system. To run PEC ACM Website locally:

- Fork this repository on GitHub.
- Clone your fork to your local machine:

```bash
git clone https://github.com/yourusername/acm-website-tanstack.git
```

- Create a new branch for your contributions:

```bash
git checkout -b {name}/{my-feature-branch}
```

- In the root of this project, run `pnpm install` to install all of the necessary dependencies
- To run the development version, run `pnpm run dev`
- Make your changes and test them.
- Commit your changes with descriptive commit messages:

```bash
git commit -m "Add feature X"
```

- Push your changes to your fork:

```bash
git push origin {name}/{my-feature-branch}
```

Create a pull request from your fork to the main PEC ACM Website repository on GitHub.

## How to Contribute

You can contribute to our Website in various ways:

- Add new features.
- Fix bugs and issues.
- Improve documentation.
- Review and improve code.
- Provide feedback on pull requests and issues.

## Pull Request Guidelines

- Checkout a topic branch from a base branch (e.g. `main`), and merge back against that branch.
  - feel free to name the branch whatever you want, but we prefer `name/feature` style.
- If adding a new feature:
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.
- If fixing a bug:
  - If you are resolving a special issue, please add the issues number in the PR's description.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.
- It's OK to have multiple small commits as you work on the PR. GitHub can automatically squash them before merging.
- Make sure to request a review from either PEC ACM Webmaster or one of the maintainers of the Website, so that we get give you feedback on your PR as soon as possible.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository. When reporting issues, please provide as much detail as possible, including your operating system, browser, and a step-by-step description of the problem.

## Thanks 🩷

Thanks for all your contributions and efforts towards improving PEC ACM Website. We thank you for being part of our ✨ community ✨!
