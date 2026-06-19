---
phase: 64
slug: canonical-prd-boundary-framing
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-19
---

# Phase 64 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| PRD → planejamento GSD | Linguagem aspiracional cruza para artefatos executáveis; só requirement e fase explícitos podem autorizar trabalho. | PRD seções # 1–# 38 (visão futura) → `.planning/REQUIREMENTS.md`, ROADMAP, documentos de fase |
| Documento de fase → escopo permanente | CONTEXT/RESEARCH/PLAN especializam uma obrigação aberta, mas não podem ampliar PROJECT ou REQUIREMENTS. | Decisões de fase → escopo do repositório |
| Prosa → verdade implementada | Afirmações documentais não substituem código, testes, artefatos oficiais nem contratos técnicos. | PRD prosa → artefatos compilados, contratos de grafo, código |
| Patch documental → staging Git | Checkout contém alterações alheias em `graphify-out/**`; a fase mantém ownership de arquivo estrito. | `git status` / staging → apenas `docs/PRD-tecnico.md` |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-64-01 | Spoofing | Status e corpo aspiracional do PRD | mitigate | Metadados v0.3 e seções 0.1/0.2 distinguem referência canônica de especificação executável e apontam para a verdade implementada (`docs/PRD-tecnico.md` §0.1–0.2) | closed |
| T-64-02 | Elevation of Privilege | Documentos de fase e afirmações futuras | mitigate | Matriz por domínio (§0.3) e regra fail-closed (§0.4) exigem PROJECT, REQUIREMENTS, requirement ID e fase explícita; em dúvida, não implementar | closed |
| T-64-03 | Tampering | Contratos Layer 1 e graph read model | mitigate | Fences (§0.6) preservam artefatos oficiais, node kinds, read model derivado/read-only, trust chain e `{ query_kind, params, result, path? }` | closed |
| T-64-04 | Repudiation | Adoção normativa do PRD | mitigate | Versão 0.3, data 2026-06-19, milestone v2.13, PRD-01/PRD-02 e histórico Git tornam a canonicalização rastreável (§0.1, metadados) | closed |
| T-64-05 | Information Disclosure | Conteúdo futuro de produto | accept | PRD já contém arquitetura futura sem segredos; seção 0.5 classifica como contexto futuro do produto — ver Accepted Risks Log | closed |
| T-64-SC | Tampering | Staging acidental e package scope | mitigate | Fase documental única: sem package install; escopo restrito a `docs/PRD-tecnico.md`; `graphify-out/**` e `tatus --short` excluídos do critério (64-01-PLAN Task 3 verify) | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-64-01 | T-64-05 | O PRD descreve arquitetura futura Alquem.io (SaaS, agente, PostgreSQL, Neo4j) como visão de produto; não contém credenciais, dados pessoais ou configuração operacional. A seção 0.5 classifica explicitamente esse conteúdo como contexto futuro sem prova de estado atual. | gsd-secure-phase orchestrator | 2026-06-19 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-19 | 6 | 6 | 0 | gsd-secure-phase orchestrator (short-circuit: plan-time register, all mitigations verified in `docs/PRD-tecnico.md`) |

### Security Audit 2026-06-19

| Metric | Count |
|--------|-------|
| Threats found | 6 |
| Closed | 6 |
| Open | 0 |

**Verification notes:** Phase 64 is documentation-only; mitigations live in `docs/PRD-tecnico.md` seção `# 0`. No `## Threat Flags` in 64-01-SUMMARY.md. Implementation scope check: only authorized file `docs/PRD-tecnico.md`. No unregistered attack surface detected.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-19
