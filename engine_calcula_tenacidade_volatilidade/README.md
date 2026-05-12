# Calcula Formula Engine

Engine deterministico em Node.js + TypeScript para calcular:

- `volatility_score` (0 a 1)
- `tenacity_score` (0 a 1)

Comportamentos principais:

- aceita dados fisico-quimicos e moleculares opcionais
- ignora valores invalidos (`NaN`, strings nao numericas, vapor pressure negativo)
- rebalanceia pesos dinamicamente quando features faltam
- garante scores finais no intervalo `[0, 1]`

## Requisitos

- Node.js 20+
- npm 10+

## Instalacao

```bash
npm install
```

## Comandos

```bash
npm test
npm run build
```

## Status de qualidade

- `npm test`: valida comportamento do engine (22 testes)
- `npm run build`: valida tipagem com `tsc --noEmit`

## Tutorial

### Passo 1: Calcule os scores do material

```ts
import { calculateMaterialScores } from './src/engine'

const material = {
  physchem: { molecular_weight: 136.24, vapor_pressure: 200 },
  molecular: { xlogp: 4.5, rotatable_bonds: 1, tpsa: 0 }
}

const scores = calculateMaterialScores(material)
console.log(scores)
// { volatility_score: 0.79..., tenacity_score: 0.61... }
```

### Passo 2: Use funcoes individuais (opcional)

```ts
import { calculateVolatility, calculateTenacity } from './src/engine'

const material = {
  physchem: { molecular_weight: 294.44, vapor_pressure: 0.0001 },
  molecular: { xlogp: 5.6, rotatable_bonds: 5, tpsa: 0 }
}

const volatility = calculateVolatility(material)
const tenacity = calculateTenacity(material)

console.log(volatility, tenacity)
```

### Passo 3: Classifique a nota olfativa

```ts
import { classifyNote } from './src/engine'

console.log(classifyNote(0.8))  // TOP NOTE (alta volatilidade)
console.log(classifyNote(0.5))  // HEART (nota media)
console.log(classifyNote(0.2))  // BASE (baixa volatilidade)
```

### Passo 4: Customize os pesos (opcional)

```ts
import { calculateMaterialScores } from './src/engine'

const material = {
  physchem: { molecular_weight: 225, vapor_pressure: 0 },
  molecular: { xlogp: 3, rotatable_bonds: 0, tpsa: 0 }
}

const scores = calculateMaterialScores(material, {
  volatilityWeights: { vaporPressure: 1 },
  tenacityWeights: { rotatableBonds: 1 }
})

console.log(scores)
```

### Dados faltantes

O engine ignora automaticamente valores invalidos e usa fallback neutro (0.5):

```ts
import { calculateMaterialScores } from './src/engine'

const scores = calculateMaterialScores({})
// { volatility_score: 0.5, tenacity_score: 0.5 }
```

## Referencia Rapida

| Funcao | Descricao |
|--------|------------|
| `calculateMaterialScores(input, options?)` | Calcula ambos os scores |
| `calculateVolatility(input, weights?)` | Calcula apenas volatility_score |
| `calculateTenacity(input, weights?)` | Calcula apenas tenacity_score |
| `classifyNote(score)` | Classifica: TOP NOTE / HEART / BASE |

### Estrutura de entrada

```ts
type MaterialInput = {
  physchem?: {
    molecular_weight?: number
    vapor_pressure?: string | number
  }
  molecular?: {
    xlogp?: number
    rotatable_bonds?: number
    tpsa?: number
  }
}
```

## Documentacao detalhada

- [API](docs/API.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Exemplos](docs/EXEMPLOS.md)
- [Validacao](docs/VALIDACAO.md)
