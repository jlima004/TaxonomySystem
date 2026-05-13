import { describe, expect, it } from "vitest";
import { validateSeed } from "../loader/seed_validator.js";

describe("validateSeed", () => {
  it("valid seed returns ok=true", () => {
    const valid = {
      version: "1.0.0",
      metadata: { created_at: "now", author: "test", description: "test" },
      families: [
        {
          id: "test_family",
          name: "Test Family",
          subfamilies: [
            {
              id: "test_subfamily",
              name: "Test Sub",
              descriptors: ["desc"],
            },
          ],
        },
      ],
    };
    const result = validateSeed(valid);
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('missing version -> error in path "version"', () => {
    const invalid = {
      metadata: { created_at: "now", author: "test", description: "test" },
      families: [
        {
          id: "test",
          name: "test",
          subfamilies: [{ id: "test", name: "test", descriptors: ["test"] }],
        },
      ],
    };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.path === "version")).toBe(true);
  });

  it('empty metadata.author -> error in path "metadata.author"', () => {
    const invalid = {
      version: "1",
      metadata: { created_at: "now", author: "", description: "test" },
      families: [
        {
          id: "test",
          name: "test",
          subfamilies: [{ id: "test", name: "test", descriptors: ["test"] }],
        },
      ],
    };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.path === "metadata.author")).toBe(true);
  });

  it("family.id non-snake_case -> error with expected: snake_case", () => {
    const invalid = {
      version: "1",
      metadata: { created_at: "now", author: "t", description: "t" },
      families: [
        {
          id: "Not Snake",
          name: "test",
          subfamilies: [{ id: "test", name: "test", descriptors: ["test"] }],
        },
      ],
    };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) => e.path === "Family test (id)" && e.expected.includes("snake_case"),
      ),
    ).toBe(true);
  });

  it("subfamily.id duplicate global -> error detected", () => {
    const invalid = {
      version: "1",
      metadata: { created_at: "now", author: "t", description: "t" },
      families: [
        {
          id: "f1",
          name: "t",
          subfamilies: [{ id: "duplicate", name: "t", descriptors: ["t"] }],
        },
        {
          id: "f2",
          name: "t",
          subfamilies: [{ id: "duplicate", name: "t", descriptors: ["t"] }],
        },
      ],
    };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) =>
          e.path === "Family t > Subfamily t (id)" &&
          e.expected.includes("unique global subfamily id"),
      ),
    ).toBe(true);
  });

  it("empty descriptors array -> error in correct path", () => {
    const invalid = {
      version: "1",
      metadata: { created_at: "now", author: "t", description: "t" },
      families: [
        {
          id: "test",
          name: "test",
          subfamilies: [{ id: "test", name: "test", descriptors: [] }],
        },
      ],
    };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) => e.path === "Family test > Subfamily test > descriptors",
      ),
    ).toBe(true);
  });

  it("multiple errors accumulated in single result", () => {
    const invalid = { version: "", metadata: { author: "" } };
    const result = validateSeed(invalid);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it("completely invalid seed (non-object) -> clear error", () => {
    const result = validateSeed("not an object");
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.path).toBe("root");
  });
});
