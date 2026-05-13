import { describe, expect, it } from "vitest";
import { validate_seed } from "../loader/seed_validator.js";

describe("validate_seed", () => {
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
    const result = validate_seed(valid);
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
    const result = validate_seed(invalid);
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
    const result = validate_seed(invalid);
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
    const result = validate_seed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) => e.path === "families[0].id" && e.expected.includes("snake_case"),
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
    const result = validate_seed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) =>
          e.path === "families[1].subfamilies[0].id" &&
          e.expected.includes("unique"),
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
    const result = validate_seed(invalid);
    expect(result.ok).toBe(false);
    expect(
      result.errors.some(
        (e) => e.path === "families[0].subfamilies[0].descriptors",
      ),
    ).toBe(true);
  });

  it("multiple errors accumulated in single result", () => {
    const invalid = { version: "", metadata: { author: "" } };
    const result = validate_seed(invalid);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it("completely invalid seed (non-object) -> clear error", () => {
    const result = validate_seed("not an object");
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.path).toBe("root");
  });
});
