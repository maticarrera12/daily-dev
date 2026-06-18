import { describe, expect, test, beforeEach } from "vitest";
import { FakeHabitTrackerApp } from "../../tests/fakes/FakeHabitTrackerApp";
import { createCalendarStore } from "./calendarStore";

describe("calendarStore", () => {
  let app: FakeHabitTrackerApp;
  let useCalendarStore: ReturnType<typeof createCalendarStore>;

  beforeEach(() => {
    app = new FakeHabitTrackerApp();
    useCalendarStore = createCalendarStore(app);
  });

  test("defaults to week mode with empty days", () => {
    const state = useCalendarStore.getState();
    expect(state.mode).toBe("week");
    expect(state.days.size).toBe(0);
  });

  test("load(anchorDate) in week mode fetches a 7-day range and populates days", async () => {
    await useCalendarStore.getState().load("2026-06-17");

    const state = useCalendarStore.getState();
    expect(state.anchorDate).toBe("2026-06-17");
    expect(state.days.size).toBe(7);
    expect(app.loadCalendarCalls).toEqual([
      { from: "2026-06-15", to: "2026-06-21" },
    ]);
  });

  test("load(anchorDate) in month mode fetches the full month grid range", async () => {
    useCalendarStore.setState({ mode: "month" });
    await useCalendarStore.getState().load("2026-06-17");

    const state = useCalendarStore.getState();
    expect(state.days.size).toBeGreaterThanOrEqual(35);
  });

  test("setMode switches mode and reloads using the current anchorDate", async () => {
    await useCalendarStore.getState().load("2026-06-17");
    app.loadCalendarCalls = [];

    useCalendarStore.getState().setMode("month");
    await Promise.resolve();
    await Promise.resolve();

    expect(useCalendarStore.getState().mode).toBe("month");
    expect(app.loadCalendarCalls.length).toBeGreaterThan(0);
  });

  test("goToNext advances the anchorDate by 7 days in week mode and reloads", async () => {
    await useCalendarStore.getState().load("2026-06-17");

    await useCalendarStore.getState().goToNext();

    expect(useCalendarStore.getState().anchorDate).toBe("2026-06-24");
  });

  test("goToPrevious moves the anchorDate back 7 days in week mode and reloads", async () => {
    await useCalendarStore.getState().load("2026-06-17");

    await useCalendarStore.getState().goToPrevious();

    expect(useCalendarStore.getState().anchorDate).toBe("2026-06-10");
  });

  test("goToNext advances by a month in month mode", async () => {
    useCalendarStore.setState({ mode: "month" });
    await useCalendarStore.getState().load("2026-06-17");

    await useCalendarStore.getState().goToNext();

    expect(useCalendarStore.getState().anchorDate).toBe("2026-07-17");
  });

  test("sets an error message when load fails", async () => {
    app.failNextLoadCalendar = true;

    await useCalendarStore.getState().load("2026-06-17");

    expect(useCalendarStore.getState().error).toBeTruthy();
  });

  test("clearError resets the error to null", async () => {
    app.failNextLoadCalendar = true;
    await useCalendarStore.getState().load("2026-06-17");

    useCalendarStore.getState().clearError();

    expect(useCalendarStore.getState().error).toBeNull();
  });
});
