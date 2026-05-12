# API Reference

## Tipos Principais

### `MaterialInput`

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

### `EngineOutput`

```ts
type EngineOutput = {
  volatility_score: number
  tenacity_score: number
}
```

## Funcoes Publicas

### `calculateMaterialScores(input, options?)`

Calcula `volatility_score` e `tenacity_score` em uma chamada.

```ts
calculateMaterialScores(input: MaterialInput, options?: EngineOptions): EngineOutput
```

Regras:

- sempre retorna numeros validos em `[0, 1]`
- dados ausentes/invalidos sao ignorados
- pesos podem ser customizados por `options`

### `calculateVolatility(input, customWeights?)`

```ts
calculateVolatility(input: MaterialInput, customWeights?: Partial<VolatilityWeights>): number
```

Regras:

- parseia vapor pressure (`string | number`)
- descarta vapor pressure negativo
- aplica `log10(vp + 1e-6)`
- usa fallback neutro (`0.5`) se nenhuma feature valida existir

### `calculateTenacity(input, customWeights?)`

```ts
calculateTenacity(input: MaterialInput, customWeights?: Partial<TenacityWeights>): number
```

Regras:

- combina `xlogp`, `molecular_weight` e `(1 - rotatable_bonds_norm)`
- aplica penalidade opcional por TPSA
- clamp final em `[0, 1]`

### `classifyNote(volatilityScore)`

```ts
classifyNote(volatilityScore: number): 'TOP NOTE' | 'HEART' | 'BASE'
```

Faixas:

- `> 0.7` -> `TOP NOTE`
- `>= 0.3` e `<= 0.7` -> `HEART`
- `< 0.3` -> `BASE`

## Pesos Padrao

### Volatility

```ts
{
  vaporPressure: 0.5,
  molecularWeight: 0.3,
  xlogp: 0.2
}
```

### Tenacity

```ts
{
  xlogp: 0.4,
  molecularWeight: 0.4,
  rotatableBonds: 0.2,
  tpsaPenalty: 0.1
}
```
