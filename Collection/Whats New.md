
New additions are tracked using Git.
NOTE- not all notes are shared publicly, thus some files will be visible on the git repo but not on the site.


---

## Orchestration
- **Kubernetes**: architecture (control plane, compute nodes, `kubectl`), installing a first cluster (`minikube`, `kind`, `kubeadm`, managed cloud), and running containers as Pods (manifests, labels, namespaces, probes).
- **Kubernetes extras**: local cluster tools (minikube in depth, kind, k3s / k3d, MicroK8s, Helm, k9s and friends) and a `kubectl` cheat sheet.
- **Docker**: images, Dockerfiles, volumes and networking, plus **Docker Compose** for multi-container apps.
- **Container images and build tools**: image anatomy, registries, BuildKit, Podman / Buildah, Kaniko, Buildpacks, Jib, supply-chain security.
- **Orchestration platforms**: Kubernetes vs EKS / GKE / AKS, OpenShift, Rancher, Tanzu, k3s, ECS, Cloud Run, Nomad and more.
- **Camunda**: common use cases and a Camunda 8 Code Studio tutorial.

## Cloud
- **Azure**: core concepts, compute, networking, storage and databases, identity and security, governance and cost management, and application development.
- **GCP**: fundamentals (resource hierarchy, compute, storage, databases, networking, IAM, data and AI, operations and cost).
- **AWS**: cloud concepts, IAM and security, compute, storage and databases, networking, developer services and serverless, and solutions architecture.

## DevOps
- **CI/CD**: pipeline concepts, Jenkins, GitHub Actions, Azure Pipelines and AWS CodePipeline.
- **Infrastructure as Code**: concepts and tool comparison, Terraform, Terraform best practices (from terraform-best-practices.com), and CloudFormation, Bicep and ARM templates.

## Networking
- Network devices and topologies, switching and VLANs, network services (DHCP, NAT, VPNs), network security, troubleshooting, and operations and monitoring.

## AI
- **AI agents and workflows**: how coding agents work, the draft / review / implement / human-gate pipeline, and lessons learned.
- **Kandev**: a multi-agent workflow orchestrator, its two workflows, MCP driving and ops tooling.
- **Claude Code tooling and MCP**: instruction files, skills, MCP servers and running several agents.
- **AI projects and automation**: LLM extraction, a skills-based website builder, Remotion video and n8n.

## More additions
- **Orchestration**: BPMN and workflow engines (Camunda, SpiffArena, n8n).
- **DevOps**: Ansible.
- **Cloud**: cloud portfolio blueprints across Azure, AWS and GCP.
- **Networking**: remote workstation anywhere (Tailscale, Wake-on-LAN, RDP).

## Repos and hands-on projects
- **Linux**: server hardening with SSH, UFW and fail2ban (Terraform on Azure + Lynis), and network device monitoring with NetPulse (capabilities, Celery, nmap).
- **Security**: Siteward, a passive web security scanner, with what each check means and how it is built.
- **Security**: standard practice notes: fundamentals and threat modelling, web application security (OWASP Top 10), HTTP security headers and CSP, cloud security across AWS, Azure and GCP, and secure coding and supply chain.
- **Django in production** (Programming): payments and webhooks, async Django (ASGI, Channels, SSE), Celery and message brokers, subdomain multi-tenancy, data modelling lessons. Also Django on ECS Fargate (AWS), WAF in production (Security) and static sites on Cloudflare (Cloud).
- **Cloud**: smaller platforms for startups, demos and testing (Render, Railway, Fly.io, Heroku, DigitalOcean, Vercel, Netlify, Cloudflare, Supabase, Neon, VPS) with a chooser and a path to the big three.
- **Cloud deep dives**: AWS CloudFront (origins, behaviors, cache keys and TTLs, response header policies, invalidations, domains, edge functions), Route 53, Elastic Load Balancing, API Gateway and S3, plus Azure Front Door / Application Gateway and GCP Cloud CDN / load balancing.
- **Cloud**: VPC Playground, the same network built with CloudFormation, Terraform, ARM and Bicep.
- **AI**: Kandev canvas for step history, and genetic programming, decision trees and MLP compared.
- **System design**: a new Programming section covering the design framework and back-of-the-envelope estimation, building blocks (load balancers, caches, CDNs, queues), data and consistency (replication, sharding, consistent hashing, snowflake IDs), reliability patterns (rate limiting, retries, circuit breakers), container and distributed patterns (sidecar, ambassador, adapter, scatter/gather, FaaS, ownership election, work queues, event-driven and coordinated batch) and worked designs with diagrams (URL shortener, crawler, notifications, news feed, chat, autocomplete, video, file sync).
- **System design, sizing and choices**: capacity estimation expanded into a full photo-app sizing (QPS, storage, bandwidth, cache, servers), a guide to choosing data stores (PostgreSQL by default, when Cassandra, time-series, vector, search and graph fit) and a guide to choosing a language (Python vs Java, Go, Rust, TypeScript and when).
- **Camunda**: expanded from a use-case list into a section: a BPMN modelling guide (events, tasks, gateways, patterns, style), DMN and FEEL, Camunda 8 architecture and comparison with Camunda 7, running Camunda 8 locally with the order example, the Code Studio tutorial (the quarantine process, decision table, form and workers), writing job workers, and troubleshooting and best practices.
- **Refreshed notes**: Programming hub, LaTeX and Research Notes (with a new BibTeX note), Bash intro, Text Editors, SSH setup and What to Program.
- **Open source**: a new Programming section on licences (MIT, Apache, GPL, AGPL and how to choose), contributor etiquette (issues, pull requests, AI-assisted changes), running a project (community files, code of conduct, saying no), versioning and releases (SemVer, Conventional Commits, changelogs) and security and supply-chain hygiene (disclosure, dependencies, Scorecard checks).
- **Sorting visuals**: Sorting Algorithms now has a worked trace or diagram for each algorithm plus an interactive step-by-step visualiser (play, step, speed, shuffle, switch algorithm).
- **Algorithms**: ant colony optimisation, tabu search and simulated annealing.
- **Networking**: Remote workstation note expanded with the security model and troubleshooting.

## Reorganised, new sections
- **Numbering**: every section and its notes are prefixed with numbers (`01.` to `11.`) so the order is logical and does not depend on alphabetical sorting.
- **About**: a page about the author and the site.
- **GitHub Actions and Kubernetes**: deep dive and authoring/testing notes for Actions; resource types, CRDs and operators, packaging, developer experience, secrets, debugging, upgrades and GitOps for Kubernetes.
- **Hardware**: Raspberry Pi and Pi 5, Pi-hole, Tailscale and VPNs, sensors and buses, prototyping from bench to field.
- **Books**: a reading list with bookshop links, including a writing and authorship shelf.
