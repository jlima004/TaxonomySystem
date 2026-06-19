---
phase: 64
slug: canonical-prd-boundary-framing
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-19
validated: 2026-06-19
---

# Phase 64 — Validation Strategy

> Contrato de validação por amostragem para a canonicalização documental do PRD.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Checks documentais com Node.js e ripgrep; TypeScript typecheck como smoke check |
| **Config file** | Nenhum config novo; usa `src/tsconfig.json` e scripts existentes |
| **Quick run command** | `node -e` limitado à seção canônica de `docs/PRD-tecnico.md` |
| **Full suite command** | `TMPDIR=/tmp npm --prefix src run typecheck` + checks documentais + `git diff --check` |
| **Estimated runtime** | ~10-20 segundos |

---

## Sampling Rate

- **Após cada task commit:** executar o check documental específico da task e `git diff --check`.
- **Após cada plan wave:** executar todos os checks documentais e `TMPDIR=/tmp npm --prefix src run typecheck`.
- **Antes de `/gsd-verify-work`:** todos os checks abaixo devem estar verdes e o escopo do commit deve conter somente o arquivo de implementação autorizado.
- **Max feedback latency:** uma task sem verificação automatizada.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 64-01-01 | 64-01 | 1 | PRD-01 | T-64-01 | Canonicalidade é versionada, rastreável e limitada à governança documental da Layer 1. | content | check de metadados, heading e unicidade | ✅ | ⬜ pending |
| 64-01-02 | 64-01 | 1 | PRD-02 | T-64-02, T-64-03 | Autoridade é definida por pergunta e conflitos falham fechados sem ampliar escopo. | content | check da matriz de autoridade e regra de conflito | ✅ | ⬜ pending |
| 64-01-03 | 64-01 | 1 | PRD-01, PRD-02 | T-64-04, T-64-SC | Produto futuro fica separado da norma do repo; nenhuma implementação ou contrato técnico é alterado. | content + scope + typecheck | check de classes/fences, diff autorizado e typecheck | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Required Content Checks

Executar após a edição do PRD:

```bash
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const required=['**Versão do documento:** 0.3','**Rastreabilidade:** PRD-01, PRD-02','# 0. Status canônico, aplicação e precedência']; for (const x of required) { const count=t.split(x).length-1; if (count!==1) throw new Error('count inválido '+count+' para '+x) }"
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const a=t.indexOf('# 0. Status canônico, aplicação e precedência'); const b=t.indexOf('# 1. Visão do produto'); if(a<0||b<=a) throw new Error('limites da seção 0 ausentes'); const s=t.slice(a,b); const refs=['docs/PRD-tecnico.md','.planning/PROJECT.md','.planning/REQUIREMENTS.md','.planning/ROADMAP.md','.planning/STATE.md','NN-CONTEXT.md','NN-PLAN.md','código, testes, artefatos']; for(const x of refs) if(!s.includes(x)) throw new Error('autoridade ausente: '+x)"
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const a=t.indexOf('# 0. Status canônico, aplicação e precedência'); const b=t.indexOf('# 1. Visão do produto'); if(a<0||b<=a) throw new Error('limites da seção 0 ausentes'); const s=t.slice(a,b); const required=['normativo para este repositório','restrição de planejamento','contexto futuro do produto','não autoriza implementação','PostgreSQL','pgvector','Neo4j','Cypher','tools','agente','API','SaaS']; for(const x of required) if(!s.includes(x)) throw new Error('classificação/fence ausente: '+x)"
node -e "const fs=require('node:fs'); const t=fs.readFileSync('docs/PRD-tecnico.md','utf8'); const a=t.indexOf('# 0. Status canônico, aplicação e precedência'); const b=t.indexOf('# 1. Visão do produto'); const s=t.slice(a,b); const rules=['PROJECT.md','REQUIREMENTS.md','requirement','fase explícita','não implementar']; for(const x of rules) if(!s.includes(x)) throw new Error('regra fail-closed ausente: '+x)"
git diff --check
TMPDIR=/tmp npm --prefix src run typecheck
```

Os checks devem recortar apenas a seção `# 0` antes de avaliar termos como PostgreSQL e Neo4j, pois esses termos permanecem legitimamente no corpo como contexto futuro do produto.

---

## Scope Verification

```bash
git status --porcelain=v1 -z --untracked-files=all | node -e "const fs=require('node:fs'); const records=fs.readFileSync(0,'utf8').split('\0').filter(Boolean); const paths=records.map(record=>record.slice(3)); const relevant=paths.filter(path=>!path.startsWith('graphify-out/')&&path!=='tatus --short'); const unexpected=relevant.filter(path=>path!=='docs/PRD-tecnico.md'); if(unexpected.length) throw new Error('arquivo de implementação não autorizado: '+unexpected.join(', ')); if(!relevant.includes('docs/PRD-tecnico.md')) throw new Error('PRD sem alteração')"
git diff -- docs/PRD-tecnico.md
```

O primeiro comando consome o status global, incluindo arquivos novos não rastreados, em formato NUL-safe. Ele exclui somente `graphify-out/**` e o arquivo `tatus --short`, cuja sujeira é preexistente e conhecida, e exige que toda alteração restante seja exatamente `docs/PRD-tecnico.md`. O Git é executado pelo shell e o Node processa apenas stdin, evitando subprocessos bloqueados pelo ambiente.

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Não há instalação, fixture, teste novo, schema push, serviço, dependência runtime ou artefato gerado.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| A canonicalidade não transforma o PRD em autoridade universal. | PRD-01, PRD-02 | Requer julgamento semântico da matriz de autoridade. | Ler a seção `0` e confirmar que cada documento governa somente seu domínio. |
| O corpo futuro foi preservado sem adquirir aparência de implementação atual. | PRD-02 | A distinção depende do enquadramento editorial completo. | Revisar o diff e confirmar que SaaS, banco, agente e Neo4j estão classificados como contexto futuro ou restrição documental. |
| Nenhuma verdade técnica foi duplicada ou reescrita para caber no PRD. | PRD-01, PRD-02 | Exige comparação com contratos existentes. | Conferir referências a `PROJECT.md`, requisitos e docs de grafo; o PRD deve apontar para eles, não reproduzi-los integralmente. |

---

## Validation Sign-Off

- [x] All tasks have automated or source-check verification.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target is documented.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-06-19
