import { useEffect, useState, useRef } from "react";
import { worlds } from "./data/worlds";
import { towers } from "./data/towers";
import { worldEvents } from "./data/worldEvents";
import { guildQuests } from "./data/guildQuests";
import Confetti from "react-confetti";
import {
  FaDungeon,
  FaChessRook,
  FaCalendarAlt,
  FaMoon,
  FaSun,
  FaTrash,
  FaFire,
  FaBars,
  FaTimes,
  FaCheckSquare,
  FaScroll,
} from "react-icons/fa";
import wzLogo from "/wz_logo.png";

const LAST_UPDATED = "29 May 2025";

const ENGAGING_MESSAGES = [
  "Hey there! Ready to conquer some dungeons? 💪",
  "These bosses? Cooked. 🍳",
  "You're eatin' these dungeons for breakfast! 🥞",
  "Yo, the bosses don't even know what hit 'em! 💥",
  "Another one? Already? Bro, you're wild. 🔥",
  "They thought they had a chance—nah, they're toast! 🍞",
  "You're rollin' through like a wrecking ball! 🏗️",
  "Bosses lookin' like they need a break. 💀",
  "You're snackin' on these dungeons like chips! 🥔",
  "They shoulda stayed home, you're too cold! 🥶",
  "Man, you're turning these dungeons into a highlight reel! 🎥",
  "You're crushing it! More dungeons await! ⚔️",
  "Dungeons don't stand a chance against you! 🛡️",
  "You're on fire! Nothing can stop you now! 🔥",
  "Bosses in the lobby, tryna find a new game. 🎮",
];

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

  const [guildQuestChecklist, setGuildQuestChecklist] = useState<{
    [key: string]: boolean;
  }>(() => {
    const saved = localStorage.getItem("guildQuestTracker");
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(ENGAGING_MESSAGES[0]);
  const [showChad, setShowChad] = useState(true);
  const [currentChadImage, setCurrentChadImage] = useState(1);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  ); // Fix type and provide initial value

  // Function to handle showing chad
  const showChadWithTimer = () => {
    // Clear any existing timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    // Show chad
    setShowChad(true);
    // Set new timer
    hideTimerRef.current = setTimeout(() => {
      setShowChad(false);
    }, 5000);
  };

  // Add effect for initial show/hide
  useEffect(() => {
    showChadWithTimer();
    // Cleanup on unmount
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []); // Run only once on mount

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

  // Save guild quest changes
  useEffect(() => {
    localStorage.setItem(
      "guildQuestTracker",
      JSON.stringify(guildQuestChecklist)
    );
  }, [guildQuestChecklist]);

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

  // Modify triggerCelebration to use the new show function
  const triggerCelebration = () => {
    if (confettiEnabled) {
      setShowConfetti(true);
      // Select random message
      const randomIndex = Math.floor(Math.random() * ENGAGING_MESSAGES.length);
      setCurrentMessage(ENGAGING_MESSAGES[randomIndex]);
      // Randomly select chad image (1 or 2)
      setCurrentChadImage(Math.random() < 0.5 ? 1 : 2);
      // Show chad with new message and start timer
      showChadWithTimer();
      setTimeout(() => setShowConfetti(false), 6000);
    }
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setChecklist({});
      setTowerChecklist({});
      setWorldEventChecklist({});
      setGuildQuestChecklist({});
      localStorage.removeItem("dungeonTracker");
      localStorage.removeItem("towerTracker");
      localStorage.removeItem("worldEventTracker");
      localStorage.removeItem("guildQuestTracker");
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

  const isGuildQuestVisible = (questId: string) => {
    if (!showUntickedOnly) return true;
    return !guildQuestChecklist[questId];
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
          (_, index) => newState[`${world.worldId}-event-${index}`]
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

  const toggleGuildQuest = (questId: string) => {
    setGuildQuestChecklist((prev) => {
      const newState = {
        ...prev,
        [questId]: !prev[questId],
      };

      // Check if all quests are now completed
      const isCompleted = guildQuests.every((quest) => newState[quest.id]);
      if (isCompleted) {
        triggerCelebration();
        // Add flash effect to all quests
        guildQuests.forEach((quest) => {
          const element = document.getElementById(`guild-quest-${quest.id}`);
          if (element) {
            element.classList.add("completion-flash");
            setTimeout(() => element.classList.remove("completion-flash"), 800);
          }
        });
      }

      return newState;
    });
  };

  // Add scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
  };

  const calculatePoints = () => {
    let dungeonPoints = 0;
    worlds.forEach((world) => {
      world.dungeons.forEach((dungeon) => {
        if (checklist[dungeon.id]?.normal)
          dungeonPoints += dungeon.pointsNormal;
        if (checklist[dungeon.id]?.challenged)
          dungeonPoints += dungeon.pointsChallenged;
      });
    });
    let towerPoints = 0;
    towers.forEach((tower) => {
      if (towerChecklist[tower.id] && !/infinite/i.test(tower.name)) {
        towerPoints += tower.points;
      }
    });
    let eventPoints = 0;
    worldEvents.forEach((world) => {
      for (let i = 0; i < world.count; i++) {
        if (worldEventChecklist[`${world.worldId}-event-${i}`]) {
          eventPoints += world.points;
        }
      }
    });
    let guildQuestPoints = 0;
    guildQuests.forEach((quest) => {
      if (guildQuestChecklist[quest.id]) {
        guildQuestPoints += quest.points;
      }
    });
    return dungeonPoints + towerPoints + eventPoints + guildQuestPoints;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 relative">
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
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center px-4">
          {/* Logo/Title (left, grows) */}
          <div className="flex flex-col items-start min-w-0 flex-1 justify-center mx-auto">
            <img
              src={wzLogo}
              alt="World // Zero Logo"
              className="h-8 md:h-10 object-contain flex-shrink-0"
            />
            <span className="mt-1 text-lg md:text-2xl font-bold tracking-tight truncate drop-shadow text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Dungeon Tracker
            </span>
            <span className="text-xs md:text-base font-medium bg-gradient-to-r from-amber-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
              Guild Season XV
            </span>
          </div>
          {/* Right buttons (right) */}
          <div className="flex gap-2 flex-shrink-0 items-center">
            <button
              onClick={resetAll}
              className="bg-gradient-to-r from-red-500/30 to-red-600/30 px-3 py-1 rounded hover:from-red-500/40 hover:to-red-600/40 transition-all duration-300 items-center gap-1 text-sm md:text-base hidden sm:flex"
            >
              <FaTrash className="text-sm md:text-base" />
              <span className="hidden sm:inline">Reset All</span>
            </button>
            {/* Confetti and Dark Mode toggles: only show on desktop */}
            <button
              onClick={() => setConfettiEnabled(!confettiEnabled)}
              className={`${
                confettiEnabled
                  ? "bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 hover:from-yellow-500/40 hover:to-yellow-600/40"
                  : "bg-gradient-to-r from-gray-500/30 to-gray-600/30 hover:from-gray-500/40 hover:to-gray-600/40"
              } px-3 py-1 rounded transition-all duration-300 items-center gap-1 text-sm md:text-base hidden sm:flex`}
            >
              <FaFire className="text-sm md:text-base" />
              <span className="hidden sm:inline">
                {confettiEnabled ? "Confetti On" : "Confetti Off"}
              </span>
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-white/30 to-white/40 px-3 py-1 rounded hover:from-white/40 hover:to-white/50 transition-all duration-300 items-center gap-1 text-sm md:text-base hidden sm:flex"
            >
              {isDarkMode ? (
                <FaSun className="text-sm md:text-base" />
              ) : (
                <FaMoon className="text-sm md:text-base" />
              )}
              <span className="hidden sm:inline">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            {/* Hamburger (right, always visible on mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div
        className={`z-[99] md:hidden fixed inset-0 bg-gray-900/95 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
          <nav className="mt-8 flex-1">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => scrollToSection("guild-quests-section")}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 dark:from-amber-900/20 dark:to-yellow-900/20 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 text-white transition-all duration-300 flex items-center gap-2 text-lg"
                >
                  <FaScroll className="text-xl" />
                  Guild Quests
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("dungeons-section")}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-white transition-all duration-300 flex items-center gap-2 text-lg"
                >
                  <FaDungeon className="text-xl" />
                  Dungeons
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("towers-section")}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 dark:from-purple-900/20 dark:to-pink-900/20 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-white transition-all duration-300 flex items-center gap-2 text-lg"
                >
                  <FaChessRook className="text-xl" />
                  Towers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("world-events-section")}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 dark:from-emerald-900/20 dark:to-teal-900/20 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 text-white transition-all duration-300 flex items-center gap-2 text-lg"
                >
                  <FaCalendarAlt className="text-xl" />
                  World Events
                </button>
              </li>
            </ul>
            <hr className="my-6 border-t border-gray-400 dark:border-gray-600 opacity-50" />
            {/* Mobile-only toggles */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={resetAll}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center gap-2 text-base"
              >
                <FaTrash className="text-base" />
                Reset All
              </button>
              <button
                onClick={() => setConfettiEnabled(!confettiEnabled)}
                className={`bg-gradient-to-r ${
                  confettiEnabled
                    ? "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    : "from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800"
                } text-white px-4 py-2 rounded transition-all duration-300 flex items-center gap-2 text-base`}
              >
                <FaFire className="text-base" />
                {confettiEnabled ? "Confetti On" : "Confetti Off"}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-2 rounded hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 flex items-center gap-2 text-base"
              >
                {isDarkMode ? (
                  <FaSun className="text-base" />
                ) : (
                  <FaMoon className="text-base" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Navigation Sidebar - Hidden on mobile */}
        <nav className="hidden md:block w-64 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/10 dark:to-purple-900/10 border-r border-gray-200 dark:border-gray-700 sticky sm:top-[132px] h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex flex-col h-full p-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Navigation
            </h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("guild-quests-section")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 dark:from-amber-900/20 dark:to-yellow-900/20 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-2 text-base md:text-lg"
                >
                  <FaScroll className="text-lg md:text-xl" />
                  Guild Quests
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("dungeons-section")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-2 text-base md:text-lg"
                >
                  <FaDungeon className="text-lg md:text-xl" />
                  Dungeons
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("towers-section")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 dark:from-purple-900/20 dark:to-pink-900/20 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-2 text-base md:text-lg"
                >
                  <FaChessRook className="text-lg md:text-xl" />
                  Towers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("world-events-section")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 dark:from-emerald-900/20 dark:to-teal-900/20 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-2 text-base md:text-lg"
                >
                  <FaCalendarAlt className="text-lg md:text-xl" />
                  World Events
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto p-4 flex flex-col gap-6">
          {/* Filter Section */}
          <div className=" z-40">
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                      Filter:
                    </span>
                    <button
                      onClick={() => setShowUntickedOnly(!showUntickedOnly)}
                      className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 w-full sm:w-auto ${
                        showUntickedOnly
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700"
                      }`}
                    >
                      {showUntickedOnly
                        ? "Show All Items"
                        : "Show Incomplete Only"}
                    </button>
                  </div>
                  <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center sm:text-right">
                    {showUntickedOnly
                      ? "Showing incomplete items"
                      : "Showing all items"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Points Display */}
          <div className="w-full flex justify-start items-center gap-4">
            <div
              className={`relative rounded-xl shadow-lg px-6 py-3 flex items-center gap-3 text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 border-2 border-transparent overflow-hidden group ${(() => {
                const points = calculatePoints();

                if (points >= 500) {
                  return "bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 dark:from-yellow-900 dark:via-amber-900 dark:to-yellow-900 animate-float";
                }
                if (points >= 250) {
                  return "bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 dark:from-blue-900 dark:via-indigo-900 dark:to-blue-900 animate-float";
                }
                if (points >= 210) {
                  return "bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-200 dark:from-emerald-900 dark:via-teal-900 dark:to-emerald-900 animate-float";
                }
                if (points >= 180) {
                  return "bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 dark:from-pink-900 dark:via-rose-900 dark:to-pink-900 animate-float";
                }
                return "bg-gradient-to-r from-gray-200 via-slate-200 to-gray-200 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900";
              })()}`}
            >
              {/* Intense fire background */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "" : "hidden";
                })()}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,100,0,0.4),transparent_70%)] animate-fire"></div>
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(255,200,0,0.4),transparent_70%)] animate-fire"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,150,0,0.4),transparent_70%)] animate-fire"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,rgba(255,50,0,0.4),transparent_70%)] animate-fire"
                  style={{ animationDelay: "0.6s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_80%_120%,rgba(255,100,0,0.4),transparent_70%)] animate-fire"
                  style={{ animationDelay: "0.8s" }}
                ></div>
              </div>

              {/* Pulsing border effect */}
              <div
                className={`absolute inset-0 rounded-xl animate-pulse-border ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "" : "hidden";
                })()}`}
              ></div>

              {/* Bright glow effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "" : "hidden";
                })()}`}
                style={{
                  background: `radial-gradient(circle at center, ${(() => {
                    const points = calculatePoints();

                    if (points >= 300) return "rgba(255,215,0,0.5)"; // Gold
                    if (points >= 250) return "rgba(192,192,192,0.5)"; // Silver
                    if (points >= 210) return "rgba(205,127,50,0.5)"; // Bronze
                    if (points >= 180) return "rgba(255,255,255,0.4)"; // White
                    return "transparent";
                  })()} 0%, transparent 70%)`,
                }}
              ></div>

              {/* Floating particles */}
              <div
                className={`absolute inset-0 overflow-hidden ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "" : "hidden";
                })()}`}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full animate-float-particle ${(() => {
                      const points = calculatePoints();

                      if (points >= 300)
                        return "bg-yellow-400/80 dark:bg-yellow-300/80";
                      if (points >= 150)
                        return "bg-blue-400/80 dark:bg-blue-300/80";
                      if (points >= 85)
                        return "bg-emerald-400/80 dark:bg-emerald-300/80";
                      if (points >= 50)
                        return "bg-pink-400/80 dark:bg-pink-300/80";
                      return "bg-gray-400/80 dark:bg-gray-300/80";
                    })()}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              <span
                className={`drop-shadow text-yellow-800 dark:text-yellow-300 relative z-10 ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "animate-shake" : "";
                })()}`}
              >
                Points:
              </span>
              <span
                data-testid="points-value"
                className={`drop-shadow relative z-10 transition-all duration-300 ${(() => {
                  const points = calculatePoints();

                  if (points >= 500)
                    return "text-yellow-700 dark:text-yellow-300 animate-shake animate-glow";
                  if (points >= 250)
                    return "text-gray-700 dark:text-gray-300 animate-shake animate-glow";
                  if (points >= 210)
                    return "text-amber-800 dark:text-amber-400 animate-shake";
                  if (points >= 180)
                    return "text-pink-800 dark:text-pink-400 animate-shake";
                  return "text-pink-900 dark:text-pink-200";
                })()}`}
              >
                {calculatePoints()}
              </span>

              {/* Fire particles */}
              <div
                className={`absolute -right-2 -top-2 flex gap-1 ${(() => {
                  const points = calculatePoints();
                  return points >= 180 ? "" : "hidden";
                })()}`}
              >
                {(() => {
                  const points = calculatePoints();

                  return (
                    <>
                      {points >= 180 && (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-b from-pink-400 to-rose-500 animate-fire-particle"
                          style={{ animationDelay: "0s" }}
                        ></div>
                      )}
                      {points >= 210 && (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 animate-fire-particle"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      )}
                      {points >= 250 && (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 animate-fire-particle"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      )}
                      {points >= 500 && (
                        <div
                          className="w-4 h-4 rounded-full bg-gradient-to-b from-yellow-400 to-amber-500 animate-fire-particle"
                          style={{ animationDelay: "0.6s" }}
                        ></div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Tier Title */}
            {(() => {
              const points = calculatePoints();

              if (points >= 500) {
                return (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold text-lg md:text-xl animate-pulse">
                      <span className="drop-shadow-lg">Top Grinder</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
                    </div>
                  </div>
                );
              }
              if (points >= 250) {
                return (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg md:text-xl animate-bounce">
                      <span className="drop-shadow-lg">Reliable</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
                    </div>
                  </div>
                );
              }
              if (points >= 210) {
                return (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg md:text-xl animate-pulse">
                      <span className="drop-shadow-lg">Decent</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
                    </div>
                  </div>
                );
              }
              if (points >= 180) {
                return (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg md:text-xl animate-bounce">
                      <span className="drop-shadow-lg">Sidekick</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] animate-pulse"></div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-700 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold text-lg md:text-xl">
                    <span className="drop-shadow-lg">Normies</span>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]"></div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Guild Quests Section */}
          <div id="guild-quests-section" className="scroll-mt-[180px]">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 dark:from-amber-700 dark:via-yellow-700 dark:to-amber-700 rounded-xl border shadow-lg overflow-hidden sticky top-[111px] sm:top-[131px] z-30">
              <div className="p-4 border-b border-amber-500/20 dark:border-amber-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white via-yellow-200 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    <FaScroll className="text-xl md:text-2xl text-amber-100 dark:text-amber-200" />
                    Guild Quests
                  </h2>
                  <div className="text-sm md:text-base bg-gradient-to-r from-white via-yellow-200 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    {(() => {
                      const total = guildQuests.length;
                      const completed = guildQuests.filter(
                        (quest) => guildQuestChecklist[quest.id]
                      ).length;
                      return `${completed}/${total} Completed`;
                    })()}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${(() => {
                        const total = guildQuests.length;
                        const completed = guildQuests.filter(
                          (quest) => guildQuestChecklist[quest.id]
                        ).length;
                        return (completed / total) * 100;
                      })()}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${
                guildQuests.filter((quest) => isGuildQuestVisible(quest.id))
                  .length > 0
                  ? "mt-4 p-4"
                  : ""
              } grid grid-cols-1 md:grid-cols-3 gap-4`}
            >
              {guildQuests
                .filter((quest) => isGuildQuestVisible(quest.id))
                .map((quest) => (
                  <div
                    key={quest.id}
                    id={`guild-quest-${quest.id}`}
                    className={`${
                      quest.id === "easy"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : quest.id === "medium"
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    } backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all border ${
                      quest.id === "easy"
                        ? "border-green-200 dark:border-green-800"
                        : quest.id === "medium"
                        ? "border-yellow-200 dark:border-yellow-800"
                        : "border-red-200 dark:border-red-800"
                    } ${guildQuestChecklist[quest.id] ? "opacity-50" : ""}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {quest.name}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {quest.points} Points
                        </span>
                      </div>
                      <label
                        className={`flex items-center gap-2 ${
                          guildQuestChecklist[quest.id] ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!guildQuestChecklist[quest.id]}
                          onChange={() => toggleGuildQuest(quest.id)}
                          className="h-4 w-4 md:h-5 md:w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                          Complete
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Dungeons Section */}
          <div id="dungeons-section">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-700 dark:via-indigo-700 dark:to-blue-700 rounded-xl border shadow-lg overflow-hidden sticky top-[111px] sm:top-[131px] z-30">
              <div className="p-4 border-b border-blue-500/20 dark:border-blue-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    <FaDungeon className="text-xl md:text-2xl text-blue-100 dark:text-blue-200" />
                    Dungeons
                  </h2>
                  <div className="text-sm md:text-base bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    {(() => {
                      let total = 0;
                      let completed = 0;
                      worlds.forEach((world) => {
                        world.dungeons.forEach((dungeon) => {
                          total += 2; // normal and challenged
                          if (checklist[dungeon.id]?.normal) completed++;
                          if (checklist[dungeon.id]?.challenged) completed++;
                        });
                      });
                      return `${completed}/${total} Completed`;
                    })()}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${(() => {
                        let total = 0;
                        let completed = 0;
                        worlds.forEach((world) => {
                          world.dungeons.forEach((dungeon) => {
                            total += 2; // normal and challenged
                            if (checklist[dungeon.id]?.normal) completed++;
                            if (checklist[dungeon.id]?.challenged) completed++;
                          });
                        });
                        return (completed / total) * 100;
                      })()}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${
                worlds.some((world) => {
                  const visibleDungeons = world.dungeons.filter((dungeon) =>
                    isDungeonVisible(dungeon.id)
                  );
                  return visibleDungeons.length > 0;
                })
                  ? "mt-4 space-y-6"
                  : ""
              }`}
            >
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h3
                          className={`text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 ${
                            progress.completed === progress.total
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          {world.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div
                            className={`text-sm md:text-base text-gray-600 dark:text-gray-300 ${
                              progress.completed === progress.total
                                ? "opacity-50"
                                : ""
                            }`}
                          >
                            {progress.completed}/{progress.total} Completed
                          </div>
                          <button
                            type="button"
                            className={`px-2 py-1 rounded text-xs md:text-sm font-medium flex items-center gap-1 border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 text-green-900 dark:text-green-100 hover:from-green-300 hover:to-green-500 dark:hover:from-green-700 dark:hover:to-green-500 transition-all ${
                              progress.completed === progress.total
                                ? "opacity-70"
                                : ""
                            }`}
                            onClick={() => {
                              const allChecked = world.dungeons.every(
                                (dungeon) =>
                                  checklist[dungeon.id]?.normal &&
                                  checklist[dungeon.id]?.challenged
                              );
                              setChecklist((prev) => {
                                const newState = { ...prev };
                                world.dungeons.forEach((dungeon) => {
                                  newState[dungeon.id] = allChecked
                                    ? { normal: false, challenged: false }
                                    : { normal: true, challenged: true };
                                });
                                return newState;
                              });
                              if (!allChecked) triggerCelebration();
                            }}
                            aria-label={
                              world.dungeons.every(
                                (dungeon) =>
                                  checklist[dungeon.id]?.normal &&
                                  checklist[dungeon.id]?.challenged
                              )
                                ? "Uncheck all dungeons"
                                : "Check all dungeons"
                            }
                          >
                            <FaCheckSquare />
                            {world.dungeons.every(
                              (dungeon) =>
                                checklist[dungeon.id]?.normal &&
                                checklist[dungeon.id]?.challenged
                            )
                              ? "Uncheck All"
                              : "Check All"}
                          </button>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 shadow-sm ${
                            progress.completed === progress.total
                              ? "opacity-50"
                              : ""
                          }`}
                          style={{
                            width: `${
                              (progress.completed / progress.total) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Dungeons Grid */}
                    <div
                      className={`${
                        visibleDungeons.length > 0 ? "p-4" : ""
                      } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
                        progress.completed === progress.total
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      {visibleDungeons.map((dungeon) => {
                        const isDungeonCompleted =
                          checklist[dungeon.id]?.normal &&
                          checklist[dungeon.id]?.challenged;
                        return (
                          <div
                            key={dungeon.id}
                            id={`dungeon-${dungeon.id}`}
                            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 ${
                              isDungeonCompleted ? "opacity-50" : ""
                            }`}
                          >
                            <h4
                              className={`font-semibold text-gray-800 dark:text-gray-100 mb-3 text-base md:text-lg ${
                                isDungeonCompleted ? "opacity-50" : ""
                              }`}
                            >
                              {dungeon.name}
                            </h4>
                            <div className="flex flex-col gap-3">
                              <label
                                className={`flex items-center gap-2 ${
                                  checklist[dungeon.id]?.normal
                                    ? "opacity-50"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!checklist[dungeon.id]?.normal}
                                  onChange={() =>
                                    toggleDungeon(dungeon.id, "normal")
                                  }
                                  className="h-4 w-4 md:h-5 md:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm md:text-base text-green-600 dark:text-green-400">
                                  Normal
                                </span>
                              </label>
                              <label
                                className={`flex items-center gap-2 ${
                                  checklist[dungeon.id]?.challenged
                                    ? "opacity-50"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!checklist[dungeon.id]?.challenged}
                                  onChange={() =>
                                    toggleDungeon(dungeon.id, "challenged")
                                  }
                                  className="h-4 w-4 md:h-5 md:w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="text-sm md:text-base text-red-600 dark:text-red-400">
                                  Challenge
                                </span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Towers Section */}
          <div id="towers-section" className="scroll-mt-[180px]">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-700 dark:via-pink-700 dark:to-purple-700 rounded-xl border shadow-lg overflow-hidden sticky top-[111px] sm:top-[131px] z-30">
              <div className="p-4 border-b border-purple-500/20 dark:border-purple-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white via-pink-200 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    <FaChessRook className="text-xl md:text-2xl text-purple-100 dark:text-purple-200" />
                    Towers
                  </h2>
                  <div className="text-sm md:text-base bg-gradient-to-r from-white via-pink-200 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    {(() => {
                      const total = towers.length;
                      const completed = towers.filter(
                        (tower) => towerChecklist[tower.id]
                      ).length;
                      return `${completed}/${total} Completed`;
                    })()}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${(() => {
                        const total = towers.length;
                        const completed = towers.filter(
                          (tower) => towerChecklist[tower.id]
                        ).length;
                        return (completed / total) * 100;
                      })()}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${
                towers.filter((tower) => isTowerVisible(tower.id)).length > 0
                  ? "mt-4 p-4"
                  : ""
              } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}
            >
              {towers
                .filter((tower) => isTowerVisible(tower.id))
                .map((tower) => (
                  <div
                    key={tower.id}
                    id={`tower-${tower.id}`}
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 ${
                      towerChecklist[tower.id] ? "opacity-50" : ""
                    }`}
                  >
                    <label
                      className={`flex items-center gap-2 ${
                        towerChecklist[tower.id] ? "opacity-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!towerChecklist[tower.id]}
                        onChange={() => toggleTower(tower.id)}
                        className="h-4 w-4 md:h-5 md:w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-100">
                        {tower.name}
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* World Events Section */}
          <div id="world-events-section" className="scroll-mt-[180px]">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-700 dark:via-teal-700 dark:to-emerald-700 rounded-xl border shadow-lg overflow-hidden sticky top-[111px] sm:top-[131px] z-30">
              <div className="p-4 border-b border-emerald-500/20 dark:border-emerald-400/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-white via-teal-200 to-emerald-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    <FaCalendarAlt className="text-xl md:text-2xl text-emerald-100 dark:text-emerald-200" />
                    World Events
                  </h2>
                  <div className="text-sm md:text-base bg-gradient-to-r from-white via-teal-200 to-emerald-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    {(() => {
                      let total = 0;
                      let completed = 0;
                      worldEvents.forEach((world) => {
                        for (let i = 0; i < world.count; i++) {
                          total++;
                          if (
                            worldEventChecklist[`${world.worldId}-event-${i}`]
                          )
                            completed++;
                        }
                      });
                      return `${completed}/${total} Completed`;
                    })()}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${(() => {
                        let total = 0;
                        let completed = 0;
                        worldEvents.forEach((world) => {
                          for (let i = 0; i < world.count; i++) {
                            total++;
                            if (
                              worldEventChecklist[`${world.worldId}-event-${i}`]
                            )
                              completed++;
                          }
                        });
                        return (completed / total) * 100;
                      })()}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${
                worldEvents.some((world) => {
                  const visibleEvents = Array.from({ length: world.count })
                    .map((_, index) => ({
                      index,
                      visible: isWorldEventVisible(world.worldId, index),
                    }))
                    .filter((event) => event.visible);
                  return visibleEvents.length > 0;
                })
                  ? "mt-4 p-4"
                  : ""
              } grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
            >
              {worldEvents.map((world) => {
                const worldData = worlds.find((w) => w.id === world.worldId);
                const visibleEvents = Array.from({ length: world.count })
                  .map((_, index) => ({
                    index,
                    visible: isWorldEventVisible(world.worldId, index),
                  }))
                  .filter((event) => event.visible);

                if (showUntickedOnly && visibleEvents.length === 0) return null;

                const isWorldEventsCompleted = Array.from({
                  length: world.count,
                }).every(
                  (_, index) =>
                    worldEventChecklist[`${world.worldId}-event-${index}`]
                );

                return (
                  <div
                    key={world.worldId}
                    id={`world-event-${world.worldId}`}
                    className={`${
                      isDarkMode
                        ? worldColors.dark[world.worldId as WorldId]
                        : worldColors.light[world.worldId as WorldId]
                    } rounded-lg p-4 shadow-sm hover:shadow-md transition-all backdrop-blur-sm border border-gray-200 dark:border-gray-700 ${
                      isWorldEventsCompleted ? "opacity-50" : ""
                    }`}
                  >
                    <h3
                      className={`font-semibold text-gray-800 dark:text-gray-100 mb-3 text-base md:text-lg ${
                        isWorldEventsCompleted ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span>{worldData?.name} Events</span>
                        <button
                          type="button"
                          className={`px-2 py-1 rounded text-xs md:text-sm font-medium flex items-center gap-1 border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 text-green-900 dark:text-green-100 hover:from-green-300 hover:to-green-500 dark:hover:from-green-700 dark:hover:to-green-500 transition-all ${
                            isWorldEventsCompleted ? "opacity-70" : ""
                          }`}
                          onClick={() => {
                            const allChecked = Array.from({
                              length: world.count,
                            }).every(
                              (_, index) =>
                                worldEventChecklist[
                                  `${world.worldId}-event-${index}`
                                ]
                            );
                            setWorldEventChecklist((prev) => {
                              const newState = { ...prev };
                              for (let i = 0; i < world.count; i++) {
                                newState[`${world.worldId}-event-${i}`] =
                                  !allChecked;
                              }
                              return newState;
                            });
                            if (!allChecked) triggerCelebration();
                          }}
                          aria-label={
                            Array.from({ length: world.count }).every(
                              (_, index) =>
                                worldEventChecklist[
                                  `${world.worldId}-event-${index}`
                                ]
                            )
                              ? "Uncheck all events"
                              : "Check all events"
                          }
                        >
                          <FaCheckSquare />
                          {Array.from({ length: world.count }).every(
                            (_, index) =>
                              worldEventChecklist[
                                `${world.worldId}-event-${index}`
                              ]
                          )
                            ? "Uncheck All"
                            : "Check All"}
                        </button>
                      </div>
                    </h3>
                    <div className="flex flex-col gap-2">
                      {visibleEvents.map(({ index }) => {
                        const isEventCompleted =
                          worldEventChecklist[
                            `${world.worldId}-event-${index}`
                          ];
                        return (
                          <label
                            key={index}
                            className={`flex items-center gap-2 ${
                              isEventCompleted ? "opacity-50" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isEventCompleted}
                              onChange={() =>
                                toggleWorldEvent(world.worldId, index)
                              }
                              className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                              Event {index + 1}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <footer className="mt-auto mb-2 text-xs text-gray-400 dark:text-gray-500 text-center select-none fixed bottom-4 left-4 hidden sm:block">
        <p>
          Made with love{" "}
          <span className="inline-block align-middle text-red-500">❤️</span> by
          <a
            href="https://www.roblox.com/users/4956994994/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            squalvj
          </a>
        </p>
        <p className="text-left">Last updated: {LAST_UPDATED}</p>
      </footer>

      <div
        className="hidden sm:block fixed bottom-0 right-0 z-[99] pointer-events-none transition-all duration-500"
        style={{
          transform: showChad ? "translateY(0)" : "translateY(200%)",
        }}
      >
        <div className="relative">
          {/* Speech Bubble */}
          <div className="absolute bottom-[100%] right-[20%] bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-[200px] animate-fade-in-up z-[10]">
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {currentMessage}
            </div>
            {/* Speech bubble triangle */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
          </div>
          {/* Chad Image with animation */}
          <img
            src={`/chad-${currentChadImage}.webp`}
            alt="chad"
            className="w-full h-auto animate-slide-up"
          />
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes slide-up {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
          }
          @keyframes fade-in-up {
            0% { 
              opacity: 0;
              transform: translateY(20px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
          @keyframes glow {
            0% { filter: brightness(1) drop-shadow(0 0 2px rgba(255,255,255,0.7)); }
            50% { filter: brightness(1.5) drop-shadow(0 0 8px rgba(255,255,255,0.9)); }
            100% { filter: brightness(1) drop-shadow(0 0 2px rgba(255,255,255,0.7)); }
          }
          @keyframes fire {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-5px) scale(1.1); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 0.8; }
          }
          @keyframes fire-particle {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-8px) scale(1.2); opacity: 0.8; }
            100% { transform: translateY(-16px) scale(0.8); opacity: 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
            100% { transform: translateY(-40px) translateX(-10px); opacity: 0; }
          }
          @keyframes pulse-border {
            0% { border-color: rgba(255,255,255,0.1); }
            50% { border-color: rgba(255,255,255,0.5); }
            100% { border-color: rgba(255,255,255,0.1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out 0.3s forwards;
            opacity: 0;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out infinite;
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
          .animate-fire {
            animation: fire 2s ease-in-out infinite;
          }
          .animate-fire-particle {
            animation: fire-particle 1.5s ease-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-particle {
            animation: float-particle 3s ease-out infinite;
          }
          .animate-pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
          .animate-bounce {
            animation: bounce 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
