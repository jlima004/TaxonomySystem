You are a senior ontology engineer, perfumery data architect, and semantic systems designer.

Your task is to design the first production-ready version of an **olfactory taxonomy system (Taxonomy v1)** for an AI-powered fragrance intelligence platform.

The taxonomy will power:

- accord generation
- similarity engine
- semantic search
- recommendation systems
- descriptor normalization
- future embeddings

This taxonomy is NOT academic.

It must be:

- computational
- scalable
- pragmatic
- production-oriented

---

# 🎯 OBJECTIVE

Create a hierarchical olfactory taxonomy with:

```txt id="9m5ow9"
family
  └── subfamily
        └── descriptors
```

The output must be:

- machine-readable
- normalized
- extensible
- JSON-based

---

# ⚠️ IMPORTANT CONSTRAINT

DO NOT attempt to model the entire perfumery universe.

This is a **Taxonomy v1** focused on:

- operational usefulness
- semantic consistency
- similarity calculations
- accord generation

Prefer clarity and normalization over complexity.

---

# 📦 REQUIRED OUTPUTS

Generate:

1. `taxonomy.json`
2. `descriptor_aliases.json`
3. `similarity_matrix.json`

---

# 🧠 1. TAXONOMY STRUCTURE

The taxonomy must contain:

- 12–20 top-level families
- 60–120 subfamilies
- 300–800 normalized descriptors

---

# 🥇 TOP-LEVEL FAMILIES

Use pragmatic perfumery families such as:

```txt id="2tb0za"
floral
woody
citrus
green
fruity
amber
musk
spicy
gourmand
resinous
aldehydic
aquatic
animalic
herbal
earthy
leather
smoky
powdery
aromatic
```

You may refine or expand slightly if justified.

---

# 🥈 SUBFAMILY RULES

Subfamilies MUST:

- inherit from a parent family
- be normalized using snake_case
- be semantically distinct
- remain computationally useful

Examples:

```txt id="nm7ff9"
floral_white
floral_powdery
floral_green

woody_dry
woody_creamy
woody_smoky

green_leafy
green_galbanum

musk_clean
musk_skin
```

---

# 🥉 DESCRIPTOR RULES

Descriptors must:

- be lowercase
- be normalized
- avoid duplicates
- avoid punctuation
- be semantically grouped

Examples:

```txt id="cav4u9"
powdery
clean
radiant
sparkling
warm
cold
creamy
juicy
metallic
watery
dry
dirty
soft
sharp
```

---

# 📄 taxonomy.json FORMAT

```json id="r51d1r"
{
  "floral": {
    "floral_white": ["white floral", "jasmine", "indolic", "radiant"],
    "floral_powdery": ["powdery", "soft", "cosmetic"]
  }
}
```

---

# 🔄 2. DESCRIPTOR ALIAS SYSTEM

Create a descriptor normalization map.

Goal:
Normalize noisy descriptors into canonical semantic forms.

---

# 📄 descriptor_aliases.json FORMAT

```json id="vrl9o7"
{
  "fresh green": "green_fresh",
  "green fresh": "green_fresh",
  "leafy": "green_leafy",
  "watery": "aquatic_watery",
  "clean musk": "musk_clean"
}
```

---

# ⚠️ ALIAS RULES

Aliases should handle:

- plural/singular
- inverted phrases
- descriptor variants
- spelling variations
- semantic duplicates

---

# 🧠 3. SIMILARITY MATRIX

Create a semantic similarity matrix between subfamilies.

Values:

```txt id="gwwn6f"
0.0 → completely unrelated
1.0 → nearly identical
```

---

# 📄 similarity_matrix.json FORMAT

```json id="ewyjlwm"
{
  "floral_white::floral_powdery": 0.7,
  "floral_white::animalic": 0.1,
  "woody_dry::woody_smoky": 0.8
}
```

---

# ⚠️ SIMILARITY RULES

Similarity should consider:

- semantic proximity
- traditional perfumery harmony
- shared descriptors
- accord compatibility

---

# 🧠 DESIGN PRINCIPLES

The taxonomy must optimize for:

- accord generation
- similarity scoring
- recommendation engines
- semantic clustering
- descriptor normalization

NOT for academic completeness.

---

# 🚫 DO NOT

- create excessively deep hierarchies
- use highly obscure descriptors
- generate thousands of categories
- model chemistry here
- overfit to one perfume house taxonomy

---

# ✅ DO

- prioritize semantic clarity
- prioritize computational usefulness
- normalize aggressively
- keep naming consistent
- design for future embeddings

---

# 🎯 FINAL GOAL

Produce a practical olfactory semantic system capable of powering:

- AI fragrance assistants
- accord engines
- semantic search
- ingredient similarity
- recommendation systems

The result should feel like a lightweight semantic operating system for perfumery AI.

---
