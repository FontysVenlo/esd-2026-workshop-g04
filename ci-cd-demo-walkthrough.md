# CI / CD Guide



**Branch:** `feature/ci-cd-demo`  
**[Actions](https://github.com/FontysVenlo/esd-2026-workshop-g04/actions)** · **[Live calculator](https://fontysvenlo.github.io/esd-2026-workshop-g04/)**

> **Demo storyline:** CI catches a bug → CD deploys the bug → CI + CD blocks it → CI + CD deploys the fix.
>
> **Important:** You do **not** need to start a Python server or localhost. The website is hosted on GitHub Pages.

---

## Preparation

- [ ] Open project in VS Code.
- [ ] Open **Actions** and **Live calculator** in browser tabs.
- [ ] Open terminal at **repository root**, then run:

```powershell
git switch feature/ci-cd-demo
git pull
git status --short
npm test
```

- [ ] Confirm Git has no unexpected changes and tests pass (currently **4 tests**).
- [ ] Confirm live calculator works: `2 + 3 = 5`.
- [ ] Confirm the live site starts at **Version 5.0**. **If it does not, use four successive labels instead of 6.0, 7.0 and 8.0 below.**


### Quick tour (show files)

- [ ] `.github/workflows/ci.yml` → point at `npm test`.
- [ ] `.github/workflows/cd.yml` → point at `upload-pages-artifact` and `deploy-pages`.
- [ ]  `.github/workflows/ci+cd.yml` → point at `needs: test`.

 >CI checks code. CD publishes code. `needs: test` makes deployment wait for successful tests.

---

## 1 CI ONLY: detect a bug

**GOAL:** Show a red test run while the live site remains fine.

**EDIT** `site/calculator.js`:

```javascript
// BEFORE
return first + second;

// AFTER
return first - second;
```

**EDIT** `site/index.html`: `Version 5.0` → `Version 6.0`.

**RUN** (do not run local tests before pushing):

```powershell
git add site/calculator.js site/index.html
git commit -m "demo: introduce calculator bug"
git push
```

**SHOW:** [Actions](https://github.com/FontysVenlo/esd-2026-workshop-g04/actions) → **CI alone** → latest run → **test**.

- [ ] Test job **fails** (addition expected `5`, actual `-1`).
- [ ] Refresh [live calculator](https://fontysvenlo.github.io/esd-2026-workshop-g04/): still **Version 5.0**, `2 + 3 = 5`.

> “CI caught our bug automatically. It checks the change, but doesn't deploy it.”

>>**CI = test / verify.**

---

## 2  CD ONLY: deploy broken code

>  a deployment may succeed even when the application is broken.

**KEEP** `return first - second;` in `site/calculator.js`.

**EDIT** `site/index.html`: `Version 6.0` → `Version 7.0`.

**RUN:**

```powershell
git add site/index.html
git commit -m "demo: deploy broken calculator [cd-only]"
git push
```

**SHOW:** **Actions → CD alone → latest run → deploy**.

- [ ] CD deployment **succeeds**.
- [ ] Refresh live site (use **Ctrl + F5** if needed).
- [ ] Site displays **Version 7.0**; `2 + 3 = -1`.
- [ ] Optional: point out **CI alone fails** on the same push, while **CD alone passes**.

> “CD published the website, even though the code is wrong. This deployment has no dependency on the test results.”

>>**REMEMBER:** **CD alone = publish no quality gate here.**

---

## 3  CI + CD: block broken code

**GOAL:** Show deployment being skipped when testing fails.

**KEEP** the broken subtraction line.

**EDIT** `site/index.html`: `Version 7.0` → `Version 8.0`.

**RUN:**

```powershell
git add site/index.html
git commit -m "demo: attempt protected deployment [ci-cd]"
git push
```

**SHOW:** **Actions → CI + CD → latest run**.

- [ ] **test** = failed.
- [ ] **deploy** = skipped.
- [ ] Open `.github/workflows/ci+cd.yml` and highlight:

```yaml
deploy:
  needs: test
```

- [ ] Refresh live site: still **Version 7.0** (still broken, because it was already deployed in stage 2). **Version 8.0 never deployed.**

>“Now the deployment depends on CI. The tests failed, so GitHub skipped the deploy job. Notice that this doesn't automatically repair an already broken website.”

**REMEMBER:** **CI + CD = deploy only after tests pass.**

---

## 4 CI + CD: deploy the fix

**GOAL:** Show green testing followed by green deployment.

**EDIT** `site/calculator.js` to restore:

```javascript
return first + second;
```

**KEEP** `Version 8.0` in `site/index.html`.

**RUN:**

```powershell
npm test
git add site/calculator.js
git commit -m "fix: restore calculator addition [ci-cd]"
git push
```

**SHOW:** **Actions → CI + CD → latest run**.

- [ ] Local tests **pass**.
- [ ] GitHub **test** job **passes**.
- [ ] GitHub **deploy** job **passes**.
- [ ] Refresh live calculator: **Version 8.0**, `2 + 3 = 5`.

> “We fixed the bug. GitHub tested our change, and only after success did it deploy the new working website.”

---

## Finish  20-second recap

| Mode | Checks code? | Deploys? | Our result |
|---|:---:|:---:|---|
| **CI only** | Yes | No | Bug detected; live site unchanged |
| **CD only** | No | Yes | Broken code went live |
| **CI + CD** | Yes | Only on pass | Broken release blocked; fix deployed |

> “CI tells us whether our change passes automated checks. CD publishes it. CI plus CD connects these steps so a failed test prevents the next deployment.”

### Possible questions

**“Why are multiple runs shown after a push?”**  
`ci.yml` runs independently on pushes. The demo commit markers choose the additional flows: `[cd-only]` for standalone deployment and `[ci-cd]` for the combined pipeline.

**“Why is deployment skipped?”**  
Because `deploy` has `needs: test`. It cannot run if the prerequisite job fails.

**“Does CI alone stop a release?”**  
Not by itself. It reports the failed tests. A deployment workflow or branch protection must actually enforce the check.

**“Do we need a local server?”**  
No. GitHub Pages hosts the live static website; local `npm test` is just for checking code.

**“What is workflow / job / step?”**  
Workflow = YAML automation; job = group of work on a runner; step = individual action or command.

### Safety / recovery

- **No run appears?** Confirm you pushed `feature/ci-cd-demo` and that the commit contains the exact marker when needed.
- **Site shows old version?** Wait until **deploy** completes successfully, then hard-refresh.
- **Unexpected files in `git status`?** Do not use `git add .`; use only the file paths shown in each stage.
- **Demo interrupted after stage 2 or 3?** Fix `site/calculator.js` to `return first + second;` and push a commit with `[ci-cd]` to restore the working website.

**Final state:** code fixed, tests green, site **Version 8.0** and working.
