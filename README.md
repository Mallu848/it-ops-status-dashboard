# IT Ops Status Dashboard — CI/CD Pipeline with Azure DevOps

A mock internal IT operations dashboard, automatically built and deployed to Azure App Service through a multistage Azure DevOps YAML pipeline with a staging approval gate.

## Why I built this

As a Senior IT Support Analyst, I spend my day tracking ticket queues, system status, and incidents manually across a few different tools. This project models that workflow as a small API, then automates its deployment end-to-end using the same kind of CI/CD pattern I'm learning to bring into infrastructure and platform work — the skill set I'm actively building toward in my move into Cloud/DevOps engineering.

## What it does

A Node.js/Express API exposing:
- `GET /status` — overall system health snapshot
- `GET /tickets` — open support ticket queue, sorted by priority
- `GET /incidents` — recent incident log

## Architecture

```
Push to main
     │
     ▼
 ┌─────────┐     ┌──────────────────┐     ┌─────────────────┐
 │  Build   │ --> │  Deploy: Staging  │ --> │ Deploy: Production│
 │ npm ci   │     │ (manual approval)  │     │  Azure App Service │
 │ archive  │     │                    │     │                    │
 └─────────┘     └──────────────────┘     └─────────────────┘
```

- **Build stage** — installs Node.js 24, runs `npm install`, archives the app into a deployable zip, publishes it as a pipeline artifact.
- **Staging stage** — deploys the same artifact behind an Azure DevOps Environment with a manual approval check, simulating a real pre-production gate.
- **Deploy stage** — deploys to Azure App Service (Linux, Node 24 LTS) only after staging is approved.

## Tech stack

Node.js, Express, Azure DevOps Pipelines (YAML), Azure App Service, Azure CLI, Git.

## Challenges & fixes

- **F1 App Service quota was 0 in `eastus`** on a fresh subscription — resolved by provisioning the App Service plan in a different region with available free-tier quota.
- **PowerShell mangled `--runtime "NODE|24-LTS"`** — the `|` was being parsed as a pipe operator even inside quotes because `az` shells out through `cmd.exe`. Fixed using PowerShell's `--%` stop-parsing token to pass the argument through literally.
- **`az login` failed with "No subscriptions found"** despite a valid account — root cause was an old free-tier subscription that had expired with zero active subscriptions in the tenant. Resolved by creating/upgrading a subscription and re-authenticating.
- **Push rejected (`fetch first`)** after a direct edit was made in the Azure Repos web UI — resolved with `git pull` to merge remote changes before pushing.

## Live demo

- **Live app:** `https://<your-app-name>.azurewebsites.net`
- **Demo recording:** *(add your Loom/YouTube link here)*

## What I'd add next

- Infrastructure as Code (Bicep) to replace the manual `az cli` resource provisioning
- Automated tests running in the Build stage
- PR-triggered builds with branch protection on `main`
