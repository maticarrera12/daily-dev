import { useEffect, useState } from "react";
import "./App.css";
import { createHabitTrackerApp } from "./infrastructure/composition/createHabitTrackerApp";
import type { HabitTrackerApp } from "./infrastructure/composition/createHabitTrackerApp";
import { createHabitStore } from "./state/habitStore";
import { TodayView } from "./ui/views/TodayView";

interface AppRuntime {
  app: HabitTrackerApp;
  useHabitStore: ReturnType<typeof createHabitStore>;
}

function App() {
  const [runtime, setRuntime] = useState<AppRuntime | null>(null);

  useEffect(() => {
    let isMounted = true;
    createHabitTrackerApp().then((app) => {
      if (!isMounted) return;
      setRuntime({ app, useHabitStore: createHabitStore(app) });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!runtime) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <p className="font-display text-lg text-slate-500">Loading…</p>
      </main>
    );
  }

  return <TodayView useHabitStore={runtime.useHabitStore} app={runtime.app} />;
}

export default App;
