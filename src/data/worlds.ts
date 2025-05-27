export interface Dungeon {
  id: string;
  name: string;
}

export interface World {
  id: string;
  name: string;
  color: string;
  dungeons: Dungeon[];
}

export const worlds: World[] = [
  {
    id: "1",
    name: "World 1",
    color: "bg-blue-100 border-blue-300",
    dungeons: [
      { id: "1-1", name: "1-1 Crabby Crusade" },
      { id: "1-2", name: "1-2 Scarecrow Defense" },
      { id: "1-3", name: "1-3 Dire Problem" },
      { id: "1-4", name: "1-4 Kingslayer" },
      { id: "1-5", name: "1-5 Gravetower Dungeon" },
    ],
  },
  {
    id: "2",
    name: "World 2",
    color: "bg-green-100 border-green-300",
    dungeons: [
      { id: "2-1", name: "2-1 Temple of Ruin" },
      { id: "2-2", name: "2-2 Mama Trauma" },
      { id: "2-3", name: "2-3 Volcano Shadow" },
      { id: "2-4", name: "2-4 Volcano Dungeon" },
    ],
  },
  {
    id: "3",
    name: "World 3",
    color: "bg-sky-100 border-sky-300",
    dungeons: [
      { id: "3-1", name: "3-1 Mountain Pass" },
      { id: "3-2", name: "3-2 Winter Cavern" },
      { id: "3-3", name: "3-3 Winter Dungeon" },
    ],
  },
  {
    id: "4",
    name: "World 4",
    color: "bg-yellow-100 border-yellow-300",
    dungeons: [
      { id: "4-1", name: "4-1 Scrap Canyon" },
      { id: "4-2", name: "4-2 Deserted Burrowmine" },
      { id: "4-3", name: "4-3 Pyramid Dungeon" },
    ],
  },
  {
    id: "5",
    name: "World 5",
    color: "bg-red-100 border-red-300",
    dungeons: [
      { id: "5-1", name: "5-1 Konoh Heartlands" },
      { id: "5-2", name: "5-2 Konoh Inferno" },
    ],
  },
  {
    id: "6",
    name: "World 6",
    color: "bg-teal-100 border-teal-300",
    dungeons: [
      { id: "6-1", name: "6-1 Rough Waters" },
      { id: "6-2", name: "6-2 Treasure Hunt" },
    ],
  },
  {
    id: "7",
    name: "World 7",
    color: "bg-pink-100 border-pink-300",
    dungeons: [
      { id: "7-1", name: "7-1 The Underworld" },
      { id: "7-2", name: "7-2 The Labyrinth" },
    ],
  },
  {
    id: "8",
    name: "World 8",
    color: "bg-orange-100 border-orange-300",
    dungeons: [
      { id: "8-1", name: "8-1 Rescue in the Ruins" },
      { id: "8-2", name: "8-2 Ruin Rush" },
    ],
  },
  {
    id: "9",
    name: "World 9",
    color: "bg-purple-100 border-purple-300",
    dungeons: [
      { id: "9-1", name: "9-1 Treetop Trouble" },
      { id: "9-2", name: "9-2 Aether Fortress" },
    ],
  },
  {
    id: "10",
    name: "World 10",
    color: "bg-indigo-100 border-indigo-300",
    dungeons: [
      { id: "10-1", name: "10-1 Crystal Chaos" },
      { id: "10-2", name: "10-2 Astral Academy" },
    ],
  },
];
