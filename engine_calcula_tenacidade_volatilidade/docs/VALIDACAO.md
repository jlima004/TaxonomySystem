# Validacao

## Comandos de verificacao

```bash
npm test
npm run build
```

## Resultado esperado

- testes passam sem falhas
- TypeScript compila sem erros (`tsc --noEmit`)

## Garantias funcionais

- scores retornados sempre em `[0, 1]`
- valores invalidos sao ignorados (`NaN`, strings invalidas)
- vapor pressure negativo e descartado
- features faltantes nao quebram o calculo
- pesos sao rebalanceados dinamicamente
- classificacao de nota segue thresholds definidos

## Checklist rapido

1. Rodar `npm test`.
2. Rodar `npm run build`.
3. Confirmar docs/API.md alinhado com `src/engine/index.ts`.
4. Confirmar exemplos em docs/EXEMPLOS.md coerentes com testes.
