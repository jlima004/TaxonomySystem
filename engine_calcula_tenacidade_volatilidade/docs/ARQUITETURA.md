# Arquitetura

## Visao Geral

O engine usa funcoes puras e modulos focados para transformar entrada parcial em scores robustos.

Pipeline geral:

1. parse numerico seguro
2. normalizacao por faixa
3. ponderacao com rebalanceamento dinamico
4. clamp final para `[0, 1]`

## Modulos

### `src/utils.ts`

- `toFiniteNumber`: converte para numero finito ou retorna `undefined`
- `clamp01`: garante limite em `[0, 1]`

### `src/engine/normalization.ts`

- `NORMALIZATION_RANGES` com limites padrao
- `normalize` para converter valor em faixa normalizada
- `normalizeFinite` para normalizar apenas quando o valor e valido

### `src/engine/weights.ts`

- pesos padrao de volatilidade e tenacidade
- merge de pesos customizados validos
- `weightedAverage` com rebalanceamento automatico quando faltam features

### `src/engine/volatility.ts`

- parse e normalizacao de vapor pressure em escala logaritmica
- combinacao de vapor pressure + inversos de MW e xlogp

### `src/engine/tenacity.ts`

- combinacao de xlogp, MW e inverso de rotatable bonds
- penalidade opcional por TPSA

### `src/engine/index.ts`

- API publica do pacote
- `calculateMaterialScores`
- `classifyNote`
- re-export de utilitarios e tipos

## Decisoes de Robustez

- campos ausentes nao quebram calculo
- valores invalidos sao descartados
- fallback neutro quando nao ha feature utilizavel
- retorno final sempre valido para consumo em producao
