import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FakeHabitTrackerApp } from "../tests/fakes/FakeHabitTrackerApp";

vi.mock("./infrastructure/composition/createHabitTrackerApp", () => ({
  createHabitTrackerApp: vi.fn(),
}));

import { createHabitTrackerApp } from "./infrastructure/composition/createHabitTrackerApp";
import App from "./App";

describe("App", () => {
  test("defaults to Today view and shows the existing today UI", async () => {
    const app = new FakeHabitTrackerApp();
    vi.mocked(createHabitTrackerApp).mockResolvedValue(app);

    render(<App />);

    await waitFor(() => expect(app.loadTodayCalls).toBe(1));
    expect(screen.getByRole("button", { name: "Today" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
  });

  test("switching to Week renders the calendar week view", async () => {
    const app = new FakeHabitTrackerApp();
    vi.mocked(createHabitTrackerApp).mockResolvedValue(app);
    const user = userEvent.setup();

    render(<App />);
    await waitFor(() => expect(app.loadTodayCalls).toBe(1));

    await user.click(screen.getByRole("button", { name: "Week" }));

    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));
    expect(screen.getAllByTestId("day-cell")).toHaveLength(7);
  });

  test("switching to Month renders the calendar month view", async () => {
    const app = new FakeHabitTrackerApp();
    vi.mocked(createHabitTrackerApp).mockResolvedValue(app);
    const user = userEvent.setup();

    render(<App />);
    await waitFor(() => expect(app.loadTodayCalls).toBe(1));

    await user.click(screen.getByRole("button", { name: "Month" }));

    await waitFor(() => expect(app.loadCalendarCalls.length).toBe(1));
    const cellCount = screen.getAllByTestId("day-cell").length;
    expect([35, 42]).toContain(cellCount);
  });

  test("switching back to Today restores the unmodified today view", async () => {
    const app = new FakeHabitTrackerApp();
    app.habits = [
      { id: 1, name: "Drink water", imagePath: "/managed/1.png", currentStreak: 3, completedToday: false, skipWeekends: false },
    ];
    vi.mocked(createHabitTrackerApp).mockResolvedValue(app);
    const user = userEvent.setup();

    render(<App />);
    await waitFor(() => expect(app.loadTodayCalls).toBe(1));

    await user.click(screen.getByRole("button", { name: "Week" }));
    await user.click(screen.getByRole("button", { name: "Today" }));

    expect(await screen.findByText("Drink water")).toBeInTheDocument();
  });
});
