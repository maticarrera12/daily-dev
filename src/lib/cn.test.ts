import { describe, expect, test } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  test("merges static class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  test("drops falsy conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  test("resolves conflicting tailwind utility classes with last-wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
