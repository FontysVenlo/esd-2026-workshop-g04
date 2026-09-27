# Understanding GitHub Actions

> **Topic:** GitHub Actions  
> **Purpose:** Explain what it is, why teams use it, and how a workflow runs.  
> **Status:** Initial research notes for the Enterprise Software Development workshop.

## 1. My understanding in one paragraph

GitHub Actions is GitHub's automation platform. I define a **workflow** as a set of jobs described in a YAML file inside a repository. An event, such as a push or pull request, starts a workflow run. GitHub then assigns each job to a **runner**, which executes its steps. Those steps can run ordinary commands or use reusable **actions**. A common result is continuous integration (CI): every proposed change is built and tested in a repeatable environment. The same mechanism can also automate releases, deployments, and repository maintenance. [1][2]

## 2. The problem it solves

Without automation, a developer has to remember to build, test, and check each change manually. Different machines and skipped steps can give inconsistent results. A workflow makes these checks repeatable and shows the result next to the code change. For example, a pull request can run tests before the team merges it. Automation does not prove that the software is correct; its value depends on the checks we configure.

## 3. Core concepts

| Term | Meaning | Example |
| --- | --- | --- |
| **Workflow** | YAML definition of an automated process in `.github/workflows/`. | `ci.yml` |
| **Event / trigger** | What starts a workflow run. | `push`, `pull_request`, or a manual `workflow_dispatch` |
| **Run** | One execution of a workflow after a trigger. | CI run for one pull request update |
| **Job** | Group of steps executed on a runner. Separate jobs can run in parallel unless a dependency is specified. | `test` |
| **Runner** | Machine that executes a job. GitHub-hosted and self-hosted runners are available. | `ubuntu-latest` |
| **Step** | A command or action inside a job. Steps in one job run in order. | `run: npm test` |
| **Action** | Reusable unit called by a step with `uses:`. This is narrower than the name of the overall GitHub Actions platform. | `actions/checkout` |

The relationship is: **event → workflow run → job(s) on runners → ordered steps → commands or reusable actions**. [1][2]

## 4. How a workflow is used

1. Add a YAML file under `.github/workflows/` and commit it.
2. Define the events that should start it with `on`.
3. Define at least one job under `jobs`, including a runner with `runs-on`.
4. Add steps to fetch the code, prepare dependencies, and run useful checks.
5. Push a change or open a pull request, then inspect its result in the repository's **Actions** tab or on the pull request.
6. If a step fails, inspect the job log, fix the underlying issue, and rerun by pushing a correction. [1][3]

### A small CI example

Save this as `.github/workflows/ci.yml` in a **Node.js project** that already has a committed `package-lock.json` and an `npm test` script:

```yaml
name: CI

on:
  push:
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

**Reading the file:** `on` selects events; `permissions` limits the workflow token; `jobs.test` defines a job; `runs-on` selects a runner; `uses` calls a reusable action; and `run` executes a shell command. `npm ci` installs from the lockfile. The version choices here are illustrative; verify supported versions and pin third-party actions to full commit SHAs when preparing a real repository. [2][4]

## 5. CI, delivery, and deployment

| Practice | What the workflow does | Typical trigger |
| --- | --- | --- |
| **Continuous integration (CI)** | Builds, tests, and checks incoming code. | Push or pull request |
| **Continuous delivery** | Produces a release-ready artifact, often with a deliberate approval before release. | Merge or release event |
| **Continuous deployment** | Automatically releases a change after the required checks pass. | Successful checks on an approved branch |

GitHub Actions is the automation mechanism; the quality gates and release policy are decisions made by the team.

## 6. Where it helps, and where it costs effort

**Strengths:** workflow definitions live with the code; repository events can trigger checks automatically; runs and logs are visible to collaborators; reusable actions reduce repeated setup; and hosted runners simplify getting started. [1][2]

**Trade-offs:** YAML and CI failures require maintenance; workflows consume runner time; external actions are dependencies that must be reviewed; tests can be slow or flaky; and a self-hosted runner requires the team to manage its machine and access. Costs, limits, and availability depend on the current GitHub plan and runner setup, so I would check the current pricing before sizing a real project. [2][4]

## 7. Security and sensible starting practices

- Give `GITHUB_TOKEN` only the permissions each workflow or job needs; a test job generally needs read access to repository contents. [4]
- Treat third-party actions as code dependencies: review their source and pin a full commit SHA for stronger protection against a changed tag. [4]
- Store required sensitive values in GitHub secrets; do not put credentials in a workflow file or print them to logs. For cloud deployments, consider OpenID Connect (OIDC) to obtain short-lived credentials instead of storing long-lived cloud keys. [4][5]
- Review workflows that run on untrusted pull requests before granting write permissions or access to protected resources. [4]

## 8. Alternatives and choice of tool

| Option | Where it fits | Main difference from GitHub Actions |
| --- | --- | --- |
| **GitHub Actions** | Repository and pull request automation in GitHub. | Configuration and execution integrate directly with GitHub events. |
| **GitLab CI/CD** | Repositories hosted on GitLab. | Pipelines integrate directly with GitLab; migration or cross-platform use adds setup. [6] |
| **Jenkins** | Teams that want to operate and customize their own automation server. | Greater responsibility for hosting, upgrades, plugins, and access control. [7] |

These tools solve overlapping problems. The best choice depends on where the repository lives, infrastructure constraints, security requirements, and how much the team wants to operate itself.

## 10. Proposed 60-minute workshop

| Time | Segment | What happens | Owner |
| --- | --- | --- | --- |
| 0–5 min | Hook and goal | Show a failed pull-request check; ask what information we need before merging. | Lead |
| 5–12 min | Core model | Explain event → workflow → job → runner → steps; distinguish `uses` from `run`. | Lead |
| 12–20 min | Read a workflow | Walk through the example in section 4 and ask learners what triggers it and what a failing test means. | Lead, colleague fields questions |
| 20–25 min | Live demonstration | Show the prepared exercise repository, a pull request, the Actions tab, and one log. | Lead |
| 25–40 min | Hands-on exercise | Groups make a branch, open a PR, find a failing check, fix it, and observe a passing rerun. | Colleague supports groups; lead monitors progress |
| 40–50 min | Debrief and design | Ask each group which step failed, why, and which check they would require before merge. | Colleague leads |
| 50–57 min | Evaluation | Compare GitHub Actions with GitLab CI/CD and Jenkins; discuss maintenance, permissions, and runner choice. | Lead |
| 57–60 min | Exit check | Ask learners to name the trigger, runner, and failing step in the exercise. Capture unanswered questions. | Both |

**Learning objectives:** By the end, learners should (1) identify the main workflow parts, (2) create or inspect a pull request that triggers a workflow, (3) diagnose and fix a failing step using logs, and (4) name one benefit and one limitation of using GitHub Actions.

### A browser-only exercise we can prepare

Create a small workshop repository with these three files before the session. The repository owner should allow participants to create branches and pull requests. If participants cannot write to the shared repository, prepare a template or individual copies ahead of time and verify that each group can open its own PR. Do not have multiple groups edit the same branch.

**`.github/workflows/check.yml`**

```yaml
name: Check greeting

on:
  push:
  pull_request:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Get repository files
        uses: actions/checkout@v4
      - name: Check greeting
        run: bash test.sh
```

**`greeting.txt`**

```text
Hello, workshop!
```

**`test.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail

actual=$(cat greeting.txt)
expected='Hello, GitHub Actions!'

if [[ "$actual" != "$expected" ]]; then
  printf 'Expected: %s\nActual: %s\n' "$expected" "$actual" >&2
  exit 1
fi

printf 'Greeting is correct.\n'
```

**Participant task:** Create a group branch in the web interface, change `greeting.txt` in that branch, and open a pull request against the default branch. The initial check fails because the text is different from what `test.sh` expects. Open the job log, find the expected and actual values, change the text to `Hello, GitHub Actions!`, commit to the same branch, and observe the check pass. Then identify `pull_request` as the trigger, `ubuntu-latest` as the runner selection, and `bash test.sh` as the checking command.

**Presenters' setup check:** Run the exercise once in a fresh test branch and PR; confirm both the failing and passing results, participant permissions, and that the Actions tab is available. This intentionally failing starter exercise should live in a dedicated workshop repository or exercise branch, not a protected production branch. For a production workflow, follow GitHub's guidance on pinning actions by full commit SHA. [4]

**Fallback if a group cannot access GitHub:** Show a prepared failed run and let them identify the trigger, failed step, and log message; then ask them to propose the one-line fix. The co-presenter can use a prepared passing run to show the outcome. This still tests the central learning objective without requiring every attendee to edit the repository.

## 11. What I still want to investigate

- When should a team split a workflow into separate jobs or reusable workflows?
- How do caches and artifacts change run time and what should be retained?
- Which checks should block a pull request in a real team repository?
- When is a self-hosted runner justified, and who maintains it?

## Sources

1. GitHub Docs, [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions).
2. GitHub Docs, [Workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows).
3. GitHub Docs, [Quickstart for GitHub Actions](https://docs.github.com/en/actions/get-started/quickstart).
4. GitHub Docs, [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use).
5. GitHub Docs, [OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect).
6. GitLab Docs, [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/).
7. Jenkins Documentation, [Pipeline](https://www.jenkins.io/doc/book/pipeline/).
8. Course slides, *Enterprise Software Development*, supplied PDF (workshop structure and learning goals).


> **Note:** : I have used AI to help me structure the md file better and to enhance my wording && to make notes (e.g bullet points into continuous wording) 