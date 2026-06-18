import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { computePostItTransform } from "../../domain/calendar/scatter";
import { MascotPostIt } from "./MascotPostIt";

describe("MascotPostIt", () => {
  test("renders the mascot image with name as alt text", () => {
    render(
      <MascotPostIt
        imageUrl="asset://managed/1.png"
        name="Drink water"
        habitId={1}
        date="2026-06-17"
        indexInDay={0}
        totalInDay={1}
      />,
    );

    const img = screen.getByRole("img", { name: "Drink water" });
    expect(img).toHaveAttribute("src", "asset://managed/1.png");
  });

  test("applies the transform computed by computePostItTransform via inline style", () => {
    render(
      <MascotPostIt
        imageUrl="asset://managed/1.png"
        name="Drink water"
        habitId={1}
        date="2026-06-17"
        indexInDay={0}
        totalInDay={4}
      />,
    );

    const transform = computePostItTransform(1, "2026-06-17", 0, 4);
    const img = screen.getByRole("img", { name: "Drink water" });
    const wrapper = img.closest("[style]");

    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveStyle({
      zIndex: String(transform.zIndex),
      top: `${transform.topPct}%`,
      left: `${transform.leftPct}%`,
    });
    expect(wrapper?.getAttribute("style")).toContain(
      `translate(-50%, -50%) rotate(${transform.rotationDeg}deg)`,
    );
  });

  test("centers on top/left percentages via translate(-50%, -50%)", () => {
    render(
      <MascotPostIt
        imageUrl="asset://managed/1.png"
        name="Drink water"
        habitId={1}
        date="2026-06-17"
        indexInDay={2}
        totalInDay={4}
      />,
    );

    const transform = computePostItTransform(1, "2026-06-17", 2, 4);
    const img = screen.getByRole("img", { name: "Drink water" });
    const wrapper = img.closest("[style]");
    const style = wrapper?.getAttribute("style") ?? "";

    expect(style).toContain(`top: ${transform.topPct}%`);
    expect(style).toContain(`left: ${transform.leftPct}%`);
    expect(style).toContain("translate(-50%, -50%)");
  });

  test("exposes no toggle/edit controls (read-only by construction)", () => {
    render(
      <MascotPostIt
        imageUrl="asset://managed/1.png"
        name="Drink water"
        habitId={1}
        date="2026-06-17"
        indexInDay={0}
        totalInDay={1}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders the mascot image at the bigger 44px (w-11 h-11) size", () => {
    render(
      <MascotPostIt
        imageUrl="asset://managed/1.png"
        name="Drink water"
        habitId={1}
        date="2026-06-17"
        indexInDay={0}
        totalInDay={1}
      />,
    );

    const img = screen.getByRole("img", { name: "Drink water" });
    const wrapper = img.closest("[style]");
    expect(wrapper).toHaveClass("h-11", "w-11");
  });
});
