# Phase 26: Alias Mutation Patterns

## Invariantes de Aliases

### 1. Target Existente (`Target-Must-Exist`)
Um alias só pode apontar para um `target` (seed) que já existe ativamente na taxonomia base (`taxonomy-seed.v2.json`). Não é permitido criar um alias ("órfão") apontando para um seed inexistente.

### 2. Ausência do Target Preterido
Como descoberto no Research, `ambergris` não existe como seed. Mapear `ambergri` -> `ambergris` falharia no validador.

## Padrões de Resolução
Para lidar com candidatos cujo alvo ideal não existe, devemos seguir um dos padrões aprovados:

1. **`add_target` Primeiro**: Modificar a base de seeds (ex: `data/taxonomy/taxonomy-seed.v2.json`) para incluir `ambergris` na família/subfamília correta (provavelmente `amber_resinous` / `animalic`) e, só então, mapear o alias.
2. **`defer`**: Postergar a decisão e manter `ambergri` na review queue até uma fase futura onde targets ausentes sejam adicionados em lote.
3. **`manual_review_pack`**: Empacotar para curadoria humana especializada.
4. **`accepted_exception` Temporário**: Marcar temporariamente `ambergri` como uma exceção (não recomendado para este caso, dado que é claramente um erro tipográfico/truncamento de "ambergris").

Para este fluxo, o plano adotará uma dessas abordagens antes da mutação.
