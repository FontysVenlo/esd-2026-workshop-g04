# CI, CD and CI + CD — quick walkthrough

**Branch:** `feature/ci-cd-demo`  
[Live website](https://fontysvenlo.github.io/esd-2026-workshop-g04/) · [GitHub Actions](https://github.com/FontysVenlo/esd-2026-workshop-g04/actions)


```powershell
git switch feature/ci-cd-demo
git status
npm test
```


## 1. CI alone: catch the bug

```powershell
git add site/calculator.js site/index.html
git commit -m "demo: introduce calculator bug"
git push
```

## 2. CD alone: publish the broken code


```powershell
git add site/index.html
git commit -m "demo: [cd-only]"
git push
```





## 3. CI + CD: block the broken release

Keep the bug. Change the HTML label to **Version 5.0**.

```powershell
git add site/index.html
git commit -m "demo: block broken release [ci-cd]"
git push
```


## 4. Fix it: test and deploy successfully



```powershell
git add site/calculator.js
git add site/index.html
git commit -m "fix: correct calculator [ci-cd]"
git push
```


