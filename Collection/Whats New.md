
New additions are tracked using Git.
NOTE- not all notes are shared publicly, thus some files will be visible on the git repo but not on the site.


---

## Web3
- **Chaining in depth**: a PDU-style byte layout of Bitcoin and Ethereum transactions, block headers, receipts and P2P messages, plus how the chain moves (a runnable toy chain, transaction and block propagation, compact blocks, reorgs, light clients). Both sit in a new **Blockchain** sub-section with Blockchain Fundamentals.
- **Web3 section** (new): blockchains, keys, tokens and smart contracts, with recall questions on each note.
- **Blockchain Fundamentals**: hash chains, Proof of Work vs Proof of Stake, UTXO vs account models, finality and node types.
- **Keys, Wallets and Signatures**: private key to address, signing, seed phrases and HD wallets, custody options and safe habits.
- **Cryptocurrencies and Tokens**: coins vs tokens, gas, ERC standards, stablecoins, DeFi building blocks, layer 2 and bridges.
- **Smart Contracts**: how the EVM runs code, a Solidity example, Foundry tooling, deployment checklist and upgradeability.
- **Smart Contract Security**: reentrancy, access control, oracle manipulation, signature and approval risks, MEV, and a pre-launch process.
- **Web3 Development Workflow**: RPC, client libraries, wallets, events and indexing, IPFS, ENS and sign-in with Ethereum.
- **DAOs and Governance**: Governor lifecycle, voting power and delegation, timelocks, treasury roles and governance attacks.
- **Zero-Knowledge Proofs**: completeness, soundness and zero-knowledge, SNARK vs STARK, trusted setup, circuits with Circom, and under-constrained circuit bugs.
- **Non-EVM Chains**: Solana accounts and PDAs, Cosmos and IBC, Move resources, Cardano eUTXO, with a comparison table.
- **Bitcoin Internals**: transaction anatomy, Script, address types, SegWit and Taproot, block headers, Bitcoin Core and Lightning.
- **MEV and Transaction Ordering**: searchers, builders and relays, sandwich attacks, private order flow and protocol-level defences.
- **Node Operation and Infrastructure**: execution and consensus clients, a Docker Compose example, ports and hardening, monitoring and validators.
- **Contract Testing and Auditing**: unit, fuzz, invariant and fork tests in Foundry, static analysis and formal tools, audit preparation and a reviewer checklist.
- **On-Chain Forensics and Reverse Engineering**: reading transactions and traces with cast, storage layout and proxy slots, bytecode and decompilers, incident response and following funds.
- **Exploit Case Studies**: The DAO, Parity, Wormhole, Ronin, Nomad, Beanstalk, Mango, Euler and Bybit, grouped by root cause.
- **DeFi Mechanics and Risks**: AMM maths and impermanent loss, lending and liquidation, perpetuals, ERC-4626 vaults, stablecoins and attacks by primitive.
- **Oracles and Cross-Chain Messaging**: push, pull and TWAP oracles, safe price-feed reads, randomness, bridge verification models and a receiver checklist.
- **Decentralised Storage**: content addressing, IPFS pinning, Arweave and Filecoin, NFT metadata and security considerations.
- **EVM Bytecode and Low-Level Analysis**: stack, memory and storage, call opcodes, CREATE2 addresses, creation vs runtime code, dispatcher patterns and metadata trailers.
- **Tracing and On-Chain Analytics Tooling**: RPC log queries, debug and trace APIs, callTracer and prestateTracer, SQL warehouses, scripts and forks.
- **Fund Tracing and Attribution**: transaction graphs, Bitcoin clustering heuristics, obfuscation techniques, confidence levels and evidence handling.
- **Wallet Drainers and Token Scam Analysis**: approval and permit drainers, address poisoning, safe site analysis, honeypot and rug-pull checks and recovery steps.
- **Incident Response and Post-Mortems**: a prepare, detect, contain, investigate, recover playbook, communication and a post-mortem template.

## Business
- **Business section** (new): study notes for running a small services or software business, filed by subject, each crediting its source books, with recall questions and a one-page frameworks cheat sheet.
- **Foundations**: how a business works as a whole (the five parts, value, markets, marketing, sales, delivery, finance), what a formal business education teaches, and mental models for thinking, working with others and improving systems.
- **Strategy**: what separates good strategy from bad (the kernel of diagnosis, guiding policy and coherent action), the seven sources of lasting advantage with their benefit and barrier, and deciding well under uncertainty (resulting, calibration, truth-seeking groups, premortems).
- **Finance**: reading the income statement, balance sheet and cash flow, ratios and the cash cycle, the Profit First money system, plus accounting basics, corporate finance and valuation, and South African tax and compliance (dated and sourced).
- **Marketing**: positioning, talking to customers without being misled, and marketing fundamentals.
- **Sales and Negotiation**: consultative selling and its question types, tactical negotiation (mirroring, labels, calibrated questions, the Ackerman model) and trust-based advisory relationships.
- **Pricing**: value-based pricing against hourly billing, conversations with the economic buyer, anchoring, options, proposals, retainers and terms.
- **Operations and Management**: managerial output and leverage, running a business on systems, an operating rhythm of quarterly priorities and weekly meetings, building a business that can be sold, and operations basics.
- **People**: a four-step hiring method (scorecard, source, select, sell) and leadership and organisational behaviour.
- **Economics and Innovation**: economics essentials and innovation and entrepreneurship (lean startup, disruption, jobs to be done).
- **Books**: a Business and Management shelf with bookshop links, and an Honorable Mentions page of curated creators by subject.

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
- **Security, staying current**: where to follow new vulnerabilities, exploits and news (CVE, CWE, CVSS, EPSS, CISA KEV, NVD, OSV, Exploit-DB, advisories, research blogs, news sites), a triage flowchart, hands-on lookup commands, a table of landmark incidents (Heartbleed, Log4Shell, xz and others) and safe practice labs.
- **Security, deeper reading**: the OWASP Top 10 table updated to the 2025 edition (supply chain failures and mishandling of exceptional conditions, with what changed from 2021), threat modelling extended (data-flow diagrams, STRIDE-per-element, responses to a threat), passwords and human factors, and access control models (Bell-LaPadula and Biba, with a diagram). New notes: zero trust networks (control and data plane, trust scoring, device, user, application and traffic trust, mutual TLS, single packet authorisation), designing secure and reliable systems (least privilege, resilience, recovery, provenance and deployment choke points, plus a security-incident section added to the fundamentals), security engineering themes (protocol attacks, concurrency, economics, assurance), cloud security practice (asset pipeline, identity lifecycle, vulnerability metrics, detection and response) and CIS Controls and Benchmarks. Five security books added to the Books list.
- **Networking**: Speedward, a self-hostable website speed tester that measures from many cities on a world map: where page-load time goes (DNS, TCP, TLS, first byte, download), CDN edges versus origin, how server positions are placed and why uncertain ones are not drawn, and how to read the results.
- **PHP**: a new language note covering how PHP runs (request lifecycle, PHP-FPM, OPcache), syntax and types, `match`, OOP (traits, enums, readonly), Composer and PSR-4, PDO, a security checklist, common gotchas and frameworks.
- **RAID**: expanded with RAID 6, RAID 10 and 01, nested RAID 50 and 60, JBOD, the legacy levels, degraded and rebuild states, ZFS and Btrfs equivalents, a level chooser, capacity examples and mdadm worked examples (including a practice array from files), with diagrams.
- **Sorting visuals**: Sorting Algorithms now has a worked trace or diagram for each algorithm plus an interactive step-by-step visualiser (play, step, speed, shuffle, switch algorithm).
- **Algorithms**: ant colony optimisation, tabu search and simulated annealing.
- **DevOps**: Just, a command runner for project tasks (justfile recipes, parameters, dependencies, versus make), with Speedward's justfile as the worked example.
- **Networking**: Remote workstation note expanded with the security model and troubleshooting.

## Reorganised, new sections
- **Linux Tools Cheatsheet** (new): a section for quick-reference notes on everyday command line tools. The Vi, Vim, NeoVim and Nano notes moved here from Text Editors; tmux was added in a new Terminals and Multiplexers sub-section.
- **Numbering**: every section and its notes are prefixed with numbers (`01.` to `11.`) so the order is logical and does not depend on alphabetical sorting.
- **About**: a page about the author and the site.
- **GitHub Actions and Kubernetes**: deep dive and authoring/testing notes for Actions; resource types, CRDs and operators, packaging, developer experience, secrets, debugging, upgrades and GitOps for Kubernetes.
- **Hardware**: Raspberry Pi and Pi 5, Pi-hole, Tailscale and VPNs, sensors and buses, prototyping from bench to field.
- **Books**: a reading list with bookshop links, including a writing and authorship shelf.
