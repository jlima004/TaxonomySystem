# Exemplos

## 1) Material leve e volatil

```ts
import { calculateVolatility } from '../src/engine'

const limonene = {
  physchem: { molecular_weight: 136.24, vapor_pressure: 200 },
  molecular: { xlogp: 4.5 }
}

const score = calculateVolatility(limonene)
console.log(score) // ~0.7961
```

## 2) Material pesado e tenaz

```ts
import { calculateTenacity } from '../src/engine'

const muskLikeMaterial = {
  physchem: { molecular_weight: 294.44, vapor_pressure: 0.0001 },
  molecular: { xlogp: 5.6, rotatable_bonds: 5, tpsa: 0 }
}

const score = calculateTenacity(muskLikeMaterial)
console.log(score) // ~0.7167
```

## 3) Dados faltantes

```ts
import { calculateMaterialScores } from '../src/engine'

const scores = calculateMaterialScores({})
console.log(scores)
// { volatility_score: 0.5, tenacity_score: 0.5 }
```

## 4) Pesos customizados

```ts
import { calculateMaterialScores } from '../src/engine'

const material = {
  physchem: { molecular_weight: 225, vapor_pressure: 0 },
  molecular: { xlogp: 3, rotatable_bonds: 0, tpsa: 0 }
}

const scores = calculateMaterialScores(material, {
  volatilityWeights: { vaporPressure: 1, molecularWeight: 0, xlogp: 0 },
  tenacityWeights: { rotatableBonds: 1, xlogp: 0, molecularWeight: 0 }
})

console.log(scores)
// { volatility_score: 0, tenacity_score: 1 }
```

## 5) Classificacao de nota

```ts
import { classifyNote } from '../src/engine'

console.log(classifyNote(0.71)) // TOP NOTE
console.log(classifyNote(0.7))  // HEART
console.log(classifyNote(0.29)) // BASE
```
