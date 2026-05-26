---
phase: 18
slug: phase-18-docs-help-current-state-cleanup
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-26
completed: 2026-05-26
---

# Phase 18 — Validation Strategy

> Estratégia de validação da Fase 18 para garantir que as alterações no README.md principal descrevem o estado atual do projeto de forma correta e sem introduzir mutações em arquivos protegidos.

---

## Test Infrastructure

| Propriedade | Valor |
|-------------|-------|
| **Framework** | Verificação visual/leitura do README.md + Execução do Safety Guard + Testes do Builder |
| **Config file** | n/a |
| **Quick run command** | `./scripts/check-safety-guards.sh` (na raiz) ou `npm run safety:guard` (em `src/`) |
| **Full suite command** | No diretório `src/`: `npm run typecheck` e `npm run test` |
| **Tempo estimado** | < 15 segundos |

---

## Sampling Rate

- **A cada commit de tarefa:** Confirmar que nenhum arquivo protegido foi alterado via `git diff --name-only`.
- **Após cada onda de plano:** Rodar o safety guard local e os testes do builder para validar integridade do runtime.
- **Antes de fechar a fase:** Fazer uma revisão visual rigorosa da legibilidade e exatidão técnica do README.md.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requisito | Comportamento Seguro | Tipo de Teste | Comando Automatizado | File Exists | Status |
|---------|------|------|-----------|----------------------|---------------|----------------------|-------------|--------|
| 18-01-01 | 18-01 | 1 | DOCS18-01 | README.md descreve a v2 default e v1 baseline. | verificação visual | Visualizar README.md atualizado e conferir seções. | ✅ | ✅ green |
| 18-01-02 | 18-01 | 1 | DOCS18-02 | README.md descreve safety-guards.sh e wrapper npm. | verificação visual | Visualizar README.md atualizado e verificar seções do safety guard. | ✅ | ✅ green |
| 18-01-03 | 18-01 | 1 | DOCS18-03 | Nenhum arquivo de código/dados protegido foi alterado. | automação git | `git status --short` e `git diff --cached --name-only` contra diretórios protegidos. | ✅ | ✅ green |
| 18-01-04 | 18-01 | 1 | DOCS18-03 | O projeto continua compilando e passando nos testes de regressão. | automação build | No diretório `src/`: `npm run typecheck && npm run test` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] [README.md](file:///home/jlima/Projetos/TaxonomySystem/README.md) atualizado na raiz contendo referências corretas.
- [x] Saída do comando `scripts/check-safety-guards.sh` deve continuar reportando `PASS`.
- [x] Saída dos testes vitest (`npm run test` na pasta `src/`) deve continuar reportando 100% de sucesso.
- [x] `git diff` não deve apontar qualquer alteração nos arquivos ou pastas protegidas.

---

## Manual-Only Verifications

| Comportamento | Requisito | Razão do Teste Manual | Instruções de Validação |
|---------------|-----------|------------------------|-------------------------|
| O README.md descreve com exatidão como e onde executar os scripts de segurança. | DOCS18-02 | Verificação de clareza textual e exatidão das direções de diretório. | Ler a seção "Safety Guards" do README.md e atestar se os caminhos relativos e as instruções de execução (a partir de `src/` ou da raiz) estão corretas. |
| O README.md reflete adequadamente o arquivamento da v1.0.0 e a v2 ativa por padrão. | DOCS18-01 | Qualidade da redação de contexto técnico. | Confirmar que o README diferencia v2 como o default ativo e v1 como histórico intocado. |

---

## Validation Sign-Off

- [x] Todas as tarefas possuem verificação `<automated>` ou dependências de Wave 0
- [x] Continuidade de amostragem: sem tarefas consecutivas sem verificação automatizada
- [x] Wave 0 cobre todas as referências ausentes
- [x] Sem flags de modo de observação (watch-mode) nos comandos
- [x] Latência de feedback < 15 segundos
- [x] `nyquist_compliant: true` configurado no frontmatter

**Approval:** complete — 2026-05-26
