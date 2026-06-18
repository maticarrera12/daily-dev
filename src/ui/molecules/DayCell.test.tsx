import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CalendarMascot } from "../../application/use-cases/loadCalendar";
import { computePostItTransform } from "../../domain/calendar/scatter";
import { DayCell } from "./DayCell";

function mascot(id: number): CalendarMascot {
  return { id, name: `Habit ${id}`, imagePath: `/managed/${id}.png` };
}

describe("DayCell", () => {
  test("renders the day number and no mascots when empty", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("renders exactly 4 MascotPostIt elements and no overflow indicator for 4 completions", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[mascot(1), mascot(2), mascot(3), mascot(4)]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });

  test("renders up to 30 MascotPostIt elements plus a +k overflow badge", () => {
    const mascots = Array.from({ length: 30 }, (_, i) => mascot(i + 1));
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={mascots}
        overflowCount={3}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    expect(screen.getAllByRole("img")).toHaveLength(30);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  test("dims the cell when inMonth is false", () => {
    render(
      <DayCell
        date="2026-05-31"
        dayNumber={31}
        inMonth={false}
        mascots={[]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    expect(screen.getByTestId("day-cell")).toHaveClass("opacity-40");
  });

  test("renders no edit/toggle controls (read-only)", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[mascot(1)]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("the mascot scatter area is positioned relatively with a stable non-zero min-height so cell-relative percentages resolve correctly", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[mascot(1)]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    const scatterArea = screen.getByTestId("mascot-scatter-area");
    expect(scatterArea).toHaveClass("relative");
    expect(scatterArea.className).toMatch(/min-h-/);
  });

  // NOTE: jsdom cannot validate actual visual layout/overlap. This asserts
  // the intended Tailwind sizing classes only — manual visual verification
  // is required to confirm bigger, more-distributed mascots look right.
  test("the scatter area and cell grow tall enough to host bigger (44px), more-distributed mascots", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[mascot(1)]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    const dayCell = screen.getByTestId("day-cell");
    const scatterArea = screen.getByTestId("mascot-scatter-area");
    expect(dayCell.className).toMatch(/min-h-32/);
    expect(scatterArea.className).toMatch(/min-h-24/);
  });

  test("passes the total mascot count in the day to each MascotPostIt so the scatter distribution scales", () => {
    render(
      <DayCell
        date="2026-06-17"
        dayNumber={17}
        inMonth={true}
        mascots={[mascot(1), mascot(2), mascot(3), mascot(4)]}
        overflowCount={0}
        toImageUrl={(path) => `asset://${path}`}
      />,
    );

    const transform = computePostItTransform(2, "2026-06-17", 1, 4);
    const img = screen.getByRole("img", { name: "Habit 2" });
    const wrapper = img.closest("[style]");

    expect(wrapper).toHaveStyle({
      top: `${transform.topPct}%`,
      left: `${transform.leftPct}%`,
    });
  });
});
