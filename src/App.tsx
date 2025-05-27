import { useEffect, useState } from "react";
import { worlds } from "./data/worlds";
import { towers } from "./data/towers";
import { worldEvents } from "./data/worldEvents";
import Confetti from "react-confetti";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiEnabled, setConfettiEnabled] = useState(() => {
    return localStorage.getItem("confettiEnabled") !== "false";
  });

  // Save checklist changes
  useEffect(() => {
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

  // Save confetti preference
  useEffect(() => {
    localStorage.setItem("confettiEnabled", confettiEnabled.toString());
  }, [confettiEnabled]);

  // Simple confetti trigger
  const triggerCelebration = () => {
    if (confettiEnabled) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
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

      // Check if dungeon is now completed
      const isCompleted =
        newState[dungeonId].normal && newState[dungeonId].challenged;
      if (isCompleted) {
        triggerCelebration();
        // Add flash effect to the completed dungeon
        const element = document.getElementById(`dungeon-${dungeonId}`);
        if (element) {
          element.classList.add("completion-flash");
          setTimeout(() => element.classList.remove("completion-flash"), 800);
        }
      }

      return newState;
    });
  };

  const toggleTower = (towerId: string) => {
    setTowerChecklist((prev) => {
      const newState = {
        ...prev,
        [towerId]: !prev[towerId],
      };

      // Check if all towers are now completed
      const isCompleted = towers.every((tower) => newState[tower.id]);
      if (isCompleted) {
        triggerCelebration();
        // Add flash effect to all towers
        towers.forEach((tower) => {
          const element = document.getElementById(`tower-${tower.id}`);
          if (element) {
            element.classList.add("completion-flash");
            setTimeout(() => element.classList.remove("completion-flash"), 800);
          }
        });
      }

      return newState;
    });
  };

  const toggleWorldEvent = (worldId: string, eventIndex: number) => {
    const eventId = `${worldId}-event-${eventIndex}`;
    setWorldEventChecklist((prev) => {
      const newState = {
        ...prev,
        [eventId]: !prev[eventId],
      };

      // Check if all events for this world are completed
      const world = worldEvents.find((w) => w.worldId === worldId);
      if (world) {
        const isCompleted = Array.from({ length: world.count }).every(
          (_, index) => newState[`${worldId}-event-${index}`]
        );
        if (isCompleted) {
          triggerCelebration();
          // Add flash effect to the completed world events
          const element = document.getElementById(`world-event-${worldId}`);
          if (element) {
            element.classList.add("completion-flash");
            setTimeout(() => element.classList.remove("completion-flash"), 800);
          }
        }
      }

      return newState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {showConfetti && (
        <Confetti
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          numberOfPieces={2000}
          recycle={false}
          gravity={0.15}
          initialVelocityY={50}
          initialVelocityX={25}
          tweenDuration={8000}
          colors={[
            "#FF0000", // Red
            "#00FF00", // Green
            "#0000FF", // Blue
            "#FFFF00", // Yellow
            "#FF00FF", // Magenta
            "#00FFFF", // Cyan
            "#FFA500", // Orange
            "#FF1493", // Pink
            "#7FFF00", // Chartreuse
            "#FFD700", // Gold
            "#FF4500", // Orange Red
            "#4169E1", // Royal Blue
            "#9400D3", // Dark Violet
            "#FF1493", // Deep Pink
            "#00FFFF", // Cyan
            "#FFA500", // Orange
            "#7FFF00", // Chartreuse
          ]}
          confettiSource={{
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: 0,
          }}
          drawShape={(ctx) => {
            // Randomly choose between different shapes for more variety
            const shape = Math.random();
            if (shape < 0.4) {
              // Star shape
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                  Math.cos(((18 + i * 72) * Math.PI) / 180) * 20,
                  Math.sin(((18 + i * 72) * Math.PI) / 180) * 20
                );
                ctx.lineTo(
                  Math.cos(((54 + i * 72) * Math.PI) / 180) * 10,
                  Math.sin(((54 + i * 72) * Math.PI) / 180) * 10
                );
              }
              ctx.closePath();
              ctx.fill();
            } else if (shape < 0.7) {
              // Circle shape
              ctx.beginPath();
              ctx.arc(0, 0, 15, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Square shape
              ctx.fillRect(-12, -12, 24, 24);
            }
          }}
        />
      )}

      {/* Add a completion flash effect */}
      <style>
        {`
          @keyframes completion-flash {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5); }
            100% { transform: scale(1); filter: brightness(1); }
          }
          .completion-flash {
            animation: completion-flash 0.8s ease-in-out;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-lg sticky top-0 z-50">
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
              onClick={() => setConfettiEnabled(!confettiEnabled)}
              className={`${
                confettiEnabled
                  ? "bg-yellow-500/30 hover:bg-yellow-500/40"
                  : "bg-gray-500/30 hover:bg-gray-500/40"
              } px-3 py-1 rounded transition`}
            >
              {confettiEnabled ? "🎉 Confetti On" : "🎉 Confetti Off"}
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[64px] z-40">
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-[129px] h-[calc(100vh-129px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Navigation
            </h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 transition-colors">
                  Dungeons
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 transition-colors">
                  Towers
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 transition-colors">
                  World Events
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto p-4 flex flex-col gap-6">
          {/* Dungeons Section */}
          <div className="scroll-mt-[129px]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl border shadow-lg overflow-hidden sticky top-[120px] z-30">
              <div className="p-4 border-b border-blue-500/20 dark:border-blue-400/20">
                <h2 className="text-xl font-bold text-white">Dungeons</h2>
              </div>
            </div>
            <div className="mt-4 space-y-6">
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
                if (showUntickedOnly && visibleDungeons.length === 0)
                  return null;

                return (
                  <section
                    key={world.id}
                    id={`world-${world.id}`}
                    className={`rounded-xl border shadow-lg overflow-hidden ${worldColor} transition-all hover:shadow-xl`}
                  >
                    {/* World Header */}
                    <div className="p-4 border-b border-gray-400 dark:border-gray-500">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                          {world.name}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {progress.completed}/{progress.total} Completed
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 shadow-sm"
                          style={{
                            width: `${
                              (progress.completed / progress.total) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Dungeons Grid */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {visibleDungeons.map((dungeon) => (
                        <div
                          key={dungeon.id}
                          id={`dungeon-${dungeon.id}`}
                          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700`}
                        >
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                            {dungeon.name}
                          </h4>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!checklist[dungeon.id]?.normal}
                                onChange={() =>
                                  toggleDungeon(dungeon.id, "normal")
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
            </div>
          </div>

          {/* Towers Section */}
          <div className="scroll-mt-[129px]">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-xl border shadow-lg overflow-hidden sticky top-[120px] z-30">
              <div className="p-4 border-b border-purple-500/20 dark:border-purple-400/20">
                <h2 className="text-xl font-bold text-white">Towers</h2>
              </div>
            </div>
            <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {towers
                .filter((tower) => isTowerVisible(tower.id))
                .map((tower) => (
                  <div
                    key={tower.id}
                    id={`tower-${tower.id}`}
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700`}
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!towerChecklist[tower.id]}
                        onChange={() => toggleTower(tower.id)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {tower.name}
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* World Events Section */}
          <div className="scroll-mt-[129px]">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-xl border shadow-lg overflow-hidden sticky top-[120px] z-30">
              <div className="p-4 border-b border-emerald-500/20 dark:border-emerald-400/20">
                <h2 className="text-xl font-bold text-white">World Events</h2>
              </div>
            </div>
            <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    id={`world-event-${world.worldId}`}
                    className={`${
                      isDarkMode
                        ? worldColors.dark[world.worldId as WorldId]
                        : worldColors.light[world.worldId as WorldId]
                    } rounded-lg p-4 shadow-sm hover:shadow-md transition-all backdrop-blur-sm border border-gray-200 dark:border-gray-700`}
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
                            className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
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
          </div>
        </main>
      </div>
    </div>
  );
}
