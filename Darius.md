# GitHub Actions: Automating Software Development with CI/CD

The purpose of this file is to gather and explain as much information as possible about this topic. 
Let's dive right into it.

## What is CI/CD?

**CI - Continuous integration:** Integrate changes frequently and automatically check that the application builds and
passes the configured tests.

**CD - Continuous delivery:** Build, test, and prepare deployable software continuously. A person may decide
when a validated version enters production.

There is also **Continuous deployment**: Automatically deploy changes that pass the delivery pipeline to production, without a
separate manual release decision.

Basically, CI integrates the little changes made by one person and CD prepares is to be deployed to the rest of the team.

### How does a CI/CD Pipeline work

The course of action is: An EVENT *(push/pull req/merge)* triggers a WORKFLOW -> inside a WORKFLOW there are JOBS (group of STEPS that run on the same runner) ->
inside JOB there are STEPS (functions) that are getting executed sequentially.

**Workflow = entire automated process**

**Job      = major unit of work**

**Step     = individual instruction/action**

STEPS need to be executed sequentially, while JOBS can work simultaneously, even though it's not preferred in most cases.

### Key advantages of using GitHub Actions for CI/CD pipeline

**Simple CI/CD setup**: GitHub Actions allows developers to create CI/CD pipelines directly inside their repositories using YAML workflow files. 
With GitHub-hosted runners, developers don't need to maintain dedicated CI/CD servers or execution infrastructure themselves.


**Event-driven automation**: GitHub Actions is deeply integrated with GitHub and allows workflows to automatically respond to repository events such as 
pushes, pull requests, releases, issues, and many other activities. External tools can also be integrated to trigger automation.


**Reusable and community-driven**: GitHub Actions allows developers to reuse existing actions and workflows instead of building every automation from scratch. 
GitHub Marketplace provides a large ecosystem of pre-built actions, while reusable workflows allow teams to share complete automation processes across projects.


**Technology-independent**: GitHub Actions can automate projects using many programming languages and operating systems and can integrate with different cloud providers and deployment environments. 
This allows teams to use the same CI/CD platform across different technology stacks.


### Some notes

- Understand the purpose of a CI/CD pipeline. A CI pipeline is triggered when changes are made to the code and checks whether those changes can be safely integrated with the existing project. It typically builds the application, runs automated tests, and verifies that everything works correctly. A CD pipeline continues this process by delivering or deploying the validated application to its target environment.


- GitHub Actions provides a flexible approach to building CI/CD pipelines. GitHub offers many pre-built workflow templates based on different programming languages, frameworks, and technologies, making it easy to get started. At the same time, developers have full control and can create their own workflows from scratch when they need a more customized CI/CD process.

### How do we actually build a CI/CD Pipeline with GitHub Actions

![unde trb salvat.png](../../../Desktop/unde%20trb%20salvat.png)

Inside the repository, generally at the path: *.yourepo/ .github/ workflows/ yourfile.yaml* is this file, basically the workflow.
Now inside this file, you will write the code for the workflow. 

Now, in order to build the pipeline, we need to follow 4 steps:

1. Choose or create a GitHub repository: Start with a GitHub repository containing the project you want to automate. You can use an existing repository, fork another project, or create a new one. The technologies used by the project will determine what your CI/CD pipeline needs to do.


2. Create your GitHub Actions workflows: Go to the Actions tab of the repository. GitHub provides workflow templates based on the technologies it detects in your project, or you can create your own workflow from scratch. A project can have multiple workflows for different purposes. You don't need to make your pipeline overly complicated when starting. A small project might only need automated building and testing, while large projects can have many interconnected workflows.


3. Trigger the pipeline: Once workflows are configured, repository events can trigger them. Different workflows can respond to different events. For example, a pull request might trigger tests, while merging into main could trigger building or deployment.


4. Monitor the workflow: After a workflow starts, GitHub Actions provides tools for seeing what is happening. The workflow visualization shows the structure and status of the jobs. This makes it easier to understand which jobs ran, their dependencies, which are still running, and which succeeded or failed.
   GitHub Actions also provides workflow logs. These contain detailed output from individual jobs and steps and are particularly important when something fails. 


### Sources
- [GitHub Actions Tutorial for Beginners](https://www.youtube.com/watch?v=0PbxpIao_EU);
- [CI/CD for Devs](https://dev.to/sfundomhlungu/cicd-for-devs-github-actions-in-5-minutes-446p);
- [How to build a CI/CD pipeline with GitHub Actions](https://github.blog/enterprise-software/ci-cd/build-ci-cd-pipeline-github-actions-four-steps/);
- [Quickstart for GitHub Actions TBD](https://docs.github.com/en/actions/get-started/quickstart);
- [Understanding GitHub Actions TBD](https://docs.github.com/en/actions/get-started/understand-github-actions);
- [Continuous Integration TBD](https://docs.github.com/en/actions/get-started/continuous-integration).
