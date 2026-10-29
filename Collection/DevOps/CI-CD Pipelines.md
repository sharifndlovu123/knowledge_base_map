**CI/CD** automates taking code from a commit to running software. This note covers the concepts and compares the main tools, with detail in the per-tool notes.

## Tools at a glance

| Tool | Type | Config | Note |
| ---- | ---- | ------ | ---- |
| **Jenkins** | Self-hosted automation server | `Jenkinsfile` (Groovy) | [[Jenkins]] |
| **GitHub Actions** | Hosted CI/CD inside GitHub | `.github/workflows/*.yml` | [[GitHub Actions]] |
| **Azure Pipelines** (Azure DevOps) | Hosted / self-hosted agents | `azure-pipelines.yml` | [[Azure Pipelines]] |
| **AWS CodePipeline / CodeBuild / CodeDeploy** | AWS-native | `buildspec.yml`, `appspec.yml` | [[AWS CodePipeline]] |
| GitLab CI, CircleCI, Argo CD, Flux | Others | | GitOps tools for Kubernetes |

---

# Definitions

- **Continuous Integration (CI)**: merge small changes often; every change is **built and tested automatically**
- **Continuous Delivery**: every passing build is **ready to release** at the click of a button
- **Continuous Deployment**: every passing build is **released automatically** to production

```
Commit → Build → Unit tests → Package (image/artifact) → Deploy to staging → Integration/E2E tests → Approve → Deploy to production → Monitor
```

---

# Core Vocabulary

| Term | Meaning |
| ---- | ------- |
| **Pipeline** | The whole automated flow |
| **Stage** | A phase (build, test, deploy) |
| **Job / step** | A unit of work and its commands |
| **Trigger** | What starts it: push, pull request, tag, schedule, manual |
| **Runner / agent / node** | The machine executing jobs |
| **Artifact** | Build output (binary, image, package) passed between stages |
| **Cache** | Reused dependencies to speed builds |
| **Secret** | Credential stored outside the repo, injected at runtime |
| **Environment** | Deployment target (dev, staging, prod) with its own rules |
| **Matrix** | Run the same job across versions / OSes |

---

# What a Good Pipeline Does

1. **Fast feedback**: fail early (lint, unit tests first)
2. **Build once, deploy many**: build one artifact/image and promote the *same* one through environments
3. **Immutable, versioned artifacts**: tag images with the commit SHA, not only `latest`
4. **Everything as code**: pipeline definition lives in the repo
5. **Security gates**: dependency scanning (Dependabot, `npm audit`), SAST (CodeQL, SonarQube), secret scanning, image scanning (Trivy), SBOM
6. **Environment parity**: containers and IaC ([[1. Docker]], Terraform, Bicep, CloudFormation)
7. **Safe releases** and **fast rollback**
8. **Observability**: deployments appear in metrics and alerts

## Deployment strategies

| Strategy | How | Trade-off |
| -------- | --- | --------- |
| **Recreate** | Stop old, start new | Downtime |
| **Rolling** | Replace instances gradually | Mixed versions briefly |
| **Blue/green** | Two environments, switch traffic | Instant rollback, double capacity |
| **Canary** | Send small % of traffic to new version | Safer, needs good metrics |
| **Feature flags** | Ship code dark, enable per user | Decouples deploy from release |

Kubernetes does rolling updates by default ([[4. Running Your Containers in Kubernetes]]).

## Branching and triggers
- **Trunk-based**: short-lived branches, pipeline on every PR and on `main`
- **GitFlow**: long-lived `develop` / `release` branches
- Typical: **PR** → build + test; **merge to main** → build image, deploy to staging; **tag / approval** → deploy to production

---

# Example Flow: Containerised App to the Cloud

```
GitHub push
   └─► CI: lint → test → docker build → scan → push to registry (ECR / ACR / GHCR)
         └─► CD: deploy to staging (ECS / App Service / AKS)
               └─► smoke tests → manual approval → deploy to production
```

Authentication from pipeline to cloud: use **OIDC federation / workload identity** (short-lived tokens) instead of stored long-term keys.

---

# Choosing a Tool

| If you... | Consider |
| --------- | -------- |
| Already host code on GitHub | **GitHub Actions** |
| Use Azure DevOps boards/repos or deploy mainly to Azure | **Azure Pipelines** |
| Need full control, on-prem, heavy plugins | **Jenkins** |
| Are all-in on AWS services | **CodePipeline + CodeBuild** (or Actions deploying to AWS) |
| Run Kubernetes and want GitOps | **Argo CD / Flux** with any CI |

Related: [[7. Azure Application Development]], [[6. AWS Developer Services and Serverless]], [[2. Docker Compose]]
