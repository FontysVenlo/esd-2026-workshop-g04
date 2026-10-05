# CI, CD and CI + CD — quick walkthrough

**Branch:** `feature/ci-cd-demo`  
[Live website](https://fontysvenlo.github.io/esd-2026-workshop-g04/) · [GitHub Actions](https://github.com/FontysVenlo/esd-2026-workshop-g04/actions)

Use the **live website**, not localhost. Save each edit and wait for each run to finish before continuing.

## Before starting

```powershell
git switch feature/ci-cd-demo
git status
npm test
```

Start with a clean working tree, passing tests and a working live calculator: **2 + 3 = 5**.

The steps below assume the live site starts at **Version 2.0**. For another demonstration, use higher version numbers.

## 1. CI alone: catch the bug

In `site/calculator.js`, change:

```javascript
return first + second;
```

to:

```javascript
return first - second;
```

Change the label in `site/index.html` to **Version 3.0**.

```powershell
git add site/calculator.js site/index.html
git commit -m "demo: introduce calculator bug"
git push
```

Open **Actions → CI alone → latest run → test**.

**Expected:** Tests fail. The live site stays at Version 2.0 and still returns 5.

**Explain:** “CI checks our code. It caught the bug, but this workflow does not publish anything.”

## 2. CD alone: publish the broken code

Keep the bug. Change the HTML label to **Version 4.0**.

```powershell
git add site/index.html
git commit -m "demo: publish broken calculator [cd-only]"
git push
```

Open **Actions → CD alone → latest run**. After deployment, refresh the live site and calculate 2 + 3.

**Expected:** Deployment succeeds. The live site shows Version 4.0 and returns **-1**.

**Explain:** “CD published the website without checking the calculator. Broken code reached the live site.”

## 3. CI + CD: block the broken release

Keep the bug. Change the HTML label to **Version 5.0**.

```powershell
git add site/index.html
git commit -m "demo: block broken release [ci-cd]"
git push
```

Open **Actions → CI + CD → latest run**.

**Expected:** `test` fails; `deploy` is skipped. The live site stays at Version 4.0, still returning -1.

Show this in `.github/workflows/ci+cd.yml`:

```yaml
deploy:
  needs: test
```

**Explain:** “Deployment requires passing tests. Version 5.0 was blocked. The previous live version stays in place.”

## 4. Fix it: test and deploy successfully

Restore the calculator line:

```javascript
return first + second;
```

Keep Version 5.0. Save, then run:

```powershell
npm test
```

When all four tests pass:

```powershell
git add site/calculator.js
git commit -m "fix: correct calculator [ci-cd]"
git push
```

Open **Actions → CI + CD → latest run**, then refresh the live site after deployment.

**Expected:** Both jobs pass. The live site shows Version 5.0 and returns **5**.

**Explain:** “CI checked the fix. CD published it after the tests passed.”

## Remember

| Demo | Result |
| --- | --- |
| CI alone | Checks code |
| CD alone | Publishes without our tests |
| CI + CD | Publishes only after tests pass |

Our workflows use `[cd-only]` and `[ci-cd]` to select the demo. CI alone also runs on every push independently; open the workflow named in each step. Other jobs being skipped is expected.

If the live page looks old after a successful deployment, press **Ctrl + F5**.

Here, CD means **continuous deployment**.
