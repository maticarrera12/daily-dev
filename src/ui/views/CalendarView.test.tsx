import { describe, expect, test, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FakeHabitTrackerApp } from "../../../tests/fakes/FakeHabitTrackerApp";
import { createCalendarStore } from "../../state/calendarStore";
import { CalendarView } from "./CalendarView";

describe("CalendarView", () => {
  let app: FakeHabitTrackerApp;
  let useCalendarStore: ReturnType<typeof createCalendarStore>;

  beforeEach(() => {
    app = new FakeHabitTrackerApp();
    useCalendarStore = createCalendarStore(app);
  });

  test("week mode renders 7 day cells and loads on mount", async () => {
    render(
      <CalendarView useCalendarStore={useCalendarStore} app={app} mode="week" />,
    );

    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));
    expect(screen.getAllByTestId("day-cell")).toHaveLength(7);
  });

  test("month mode renders 35 or 42 day cells", async () => {
    render(
      <CalendarView useCalendarStore={useCalendarStore} app={app} mode="month" />,
    );

    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));
    const cellCount = screen.getAllByTestId("day-cell").length;
    expect([35, 42]).toContain(cellCount);
  });

  test("clicking next/previous navigates and reloads", async () => {
    const user = userEvent.setup();
    render(
      <CalendarView useCalendarStore={useCalendarStore} app={app} mode="week" />,
    );
    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));

    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(2));

    await user.click(screen.getByRole("button", { name: /previous/i }));
    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(3));
  });

  test("renders no edit/toggle controls anywhere in the view (read-only)", async () => {
    render(
      <CalendarView useCalendarStore={useCalendarStore} app={app} mode="week" />,
    );
    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));

    const buttons = screen.getAllByRole("button");
    const buttonNames = buttons.map((button) => button.getAttribute("aria-label") ?? button.textContent);
    for (const name of buttonNames) {
      expect(name).not.toMatch(/edit|toggle/i);
    }
  });
});
