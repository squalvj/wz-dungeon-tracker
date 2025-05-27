import { useEffect, useState } from "react";
import { worlds } from "./data/worlds";
import { towers } from "./data/towers";
import { worldEvents } from "./data/worldEvents";

type DungeonState = {
  normal: boolean;
  challenged: boolean;
};

type WorldId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

// World color mapping
const worldColors = {
  light: {
    "1": "bg-blue-50",
    "2": "bg-green-50",
    "3": "bg-yellow-50",
    "4": "bg-red-50",
    "5": "bg-purple-50",
    "6": "bg-pink-50",
    "7": "bg-indigo-50",
    "8": "bg-cyan-50",
    "9": "bg-orange-50",
    "10": "bg-emerald-50",
  } as const,
  dark: {
    "1": "bg-blue-900/20",
    "2": "bg-green-900/20",
    "3": "bg-yellow-900/20",
    "4": "bg-red-900/20",
    "5": "bg-purple-900/20",
    "6": "bg-pink-900/20",
    "7": "bg-indigo-900/20",
    "8": "bg-cyan-900/20",
    "9": "bg-orange-900/20",
    "10": "bg-emerald-900/20",
  } as const,
};

export default function App() {
  // Initialize state with localStorage data
  const [checklist, setChecklist] = useState<{ [key: string]: DungeonState }>(
    () => {
      const saved = localStorage.getItem("dungeonTracker");
      if (saved) {
        const parsed = JSON.parse(saved);
        const newFormat: { [key: string]: DungeonState } = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "boolean") {
            newFormat[key] = { normal: value, challenged: false };
          } else {
            newFormat[key] = value as DungeonState;
          }
        });
        return newFormat;
      }
      return {};
    }
  );

  const [towerChecklist, setTowerChecklist] = useState<{
    [key: string]: boolean;
  }>(() => {
    const saved = localStorage.getItem("towerTracker");
    return saved ? JSON.parse(saved) : {};
  });

  const [worldEventChecklist, setWorldEventChecklist] = useState<{
    [key: string]: boolean;
  }>(() => {
    const saved = localStorage.getItem("worldEventTracker");
    return saved ? JSON.parse(saved) : {};
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [showUntickedOnly, setShowUntickedOnly] = useState(false);

  // Save checklist changes
  useEffect(() => {
    console.log("Saving to localStorage:", checklist);
    localStorage.setItem("dungeonTracker", JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem("towerTracker", JSON.stringify(towerChecklist));
  }, [towerChecklist]);

  useEffect(() => {
    localStorage.setItem(
      "worldEventTracker",
      JSON.stringify(worldEventChecklist)
    );
  }, [worldEventChecklist]);

  // Handle dark mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.replace("bg-gray-50", "bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.replace("bg-gray-900", "bg-gray-50");
    }
  }, [isDarkMode]);

  const toggleDungeon = (
    dungeonId: string,
    difficulty: "normal" | "challenged"
  ) => {
    setChecklist((prev) => {
      const currentState = prev[dungeonId] || {
        normal: false,
        challenged: false,
      };
      const newState = {
        ...prev,
        [dungeonId]: {
          ...currentState,
          [difficulty]: !currentState[difficulty],
        },
      };
      console.log("New state:", newState);
      return newState;
    });
  };

  const toggleTower = (towerId: string) => {
    setTowerChecklist((prev) => ({
      ...prev,
      [towerId]: !prev[towerId],
    }));
  };

  const toggleWorldEvent = (worldId: string, eventIndex: number) => {
    const eventId = `${worldId}-event-${eventIndex}`;
    setWorldEventChecklist((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setChecklist({});
      setTowerChecklist({});
      setWorldEventChecklist({});
      localStorage.removeItem("dungeonTracker");
      localStorage.removeItem("towerTracker");
      localStorage.removeItem("worldEventTracker");
    }
  };

  const getWorldProgress = (worldId: string) => {
    const worldDungeons = worlds.find((w) => w.id === worldId)?.dungeons || [];
    const totalDungeons = worldDungeons.length * 2; // 2 difficulties per dungeon
    const completed = worldDungeons.reduce((acc, dungeon) => {
      const state = checklist[dungeon.id] || {
        normal: false,
        challenged: false,
      };
      return acc + (state.normal ? 1 : 0) + (state.challenged ? 1 : 0);
    }, 0);
    return { completed, total: totalDungeons };
  };

  const isDungeonVisible = (dungeonId: string) => {
    if (!showUntickedOnly) return true;
    const state = checklist[dungeonId] || { normal: false, challenged: false };
    return !state.normal || !state.challenged;
  };

  const isTowerVisible = (towerId: string) => {
    if (!showUntickedOnly) return true;
    return !towerChecklist[towerId];
  };

  const isWorldEventVisible = (worldId: string, eventIndex: number) => {
    if (!showUntickedOnly) return true;
    const eventId = `${worldId}-event-${eventIndex}`;
    return !worldEventChecklist[eventId];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold tracking-tight">Dungeon Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="bg-red-500/30 px-3 py-1 rounded hover:bg-red-500/40 transition"
            >
              Reset All
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white/30 px-3 py-1 rounded hover:bg-white/40 transition"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter:
              </span>
              <button
                onClick={() => setShowUntickedOnly(!showUntickedOnly)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  showUntickedOnly
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {showUntickedOnly ? "Show All Items" : "Show Incomplete Only"}
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {showUntickedOnly
                ? "Showing incomplete items"
                : "Showing all items"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex flex-col gap-6 flex-grow">
        {/* Dungeons Section */}
        {worlds.map((world) => {
          const progress = getWorldProgress(world.id);
          const worldColor = isDarkMode
            ? worldColors.dark[world.id as WorldId]
            : worldColors.light[world.id as WorldId];

          // Filter dungeons if needed
          const visibleDungeons = world.dungeons.filter((dungeon) =>
            isDungeonVisible(dungeon.id)
          );

          // Skip world if no dungeons are visible
          if (showUntickedOnly && visibleDungeons.length === 0) return null;

          return (
            <section
              key={world.id}
              className={`rounded-xl border shadow-lg overflow-hidden ${worldColor} transition-all hover:shadow-xl`}
            >
              {/* World Header */}
              <div className="p-4 border-b border-gray-400 dark:border-gray-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {world.name}
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {progress.completed}/{progress.total} Completed
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${(progress.completed / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Dungeons Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleDungeons.map((dungeon) => (
                  <div
                    key={dungeon.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      {dungeon.name}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!checklist[dungeon.id]?.normal}
                          onChange={() => toggleDungeon(dungeon.id, "normal")}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Normal
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!checklist[dungeon.id]?.challenged}
                          onChange={() =>
                            toggleDungeon(dungeon.id, "challenged")
                          }
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Challenged
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Towers Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-400 dark:border-gray-500">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Towers
            </h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {towers
              .filter((tower) => isTowerVisible(tower.id))
              .map((tower) => (
                <div
                  key={tower.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!towerChecklist[tower.id]}
                      onChange={() => toggleTower(tower.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {tower.name}
                    </span>
                  </label>
                </div>
              ))}
          </div>
        </section>

        {/* World Events Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-400 dark:border-gray-500">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              World Events
            </h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worldEvents.map((world) => {
              const worldData = worlds.find((w) => w.id === world.worldId);
              const visibleEvents = Array.from({ length: world.count })
                .map((_, index) => ({
                  index,
                  visible: isWorldEventVisible(world.worldId, index),
                }))
                .filter((event) => event.visible);

              if (showUntickedOnly && visibleEvents.length === 0) return null;

              return (
                <div
                  key={world.worldId}
                  className={`rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
                    worldColors.light[world.worldId as WorldId]
                  } dark:${worldColors.dark[world.worldId as WorldId]}`}
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    {worldData?.name} Events
                  </h3>
                  <div className="flex flex-col gap-2">
                    {visibleEvents.map(({ index }) => (
                      <label key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            !!worldEventChecklist[
                              `${world.worldId}-event-${index}`
                            ]
                          }
                          onChange={() =>
                            toggleWorldEvent(world.worldId, index)
                          }
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Event {index + 1}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
