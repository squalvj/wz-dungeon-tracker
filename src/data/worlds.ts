export interface Dungeon {
  id: string;
  name: string;
  pointsNormal: number;
  pointsChallenged: number;
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
      {
        id: "1-1",
        name: "1-1 Crabby Crusade",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "1-2",
        name: "1-2 Scarecrow Defense",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "1-3",
        name: "1-3 Dire Problem",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "1-4",
        name: "1-4 Kingslayer",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "1-5",
        name: "1-5 Gravetower Dungeon",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
    ],
  },
  {
    id: "2",
    name: "World 2",
    color: "bg-green-100 border-green-300",
    dungeons: [
      {
        id: "2-1",
        name: "2-1 Temple of Ruin",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "2-2",
        name: "2-2 Mama Trauma",
        pointsNormal: 1,
        pointsChallenged: 2,
      },
      {
        id: "2-3",
        name: "2-3 Volcano Shadow",
        pointsNormal: 2,
        pointsChallenged: 3,
      },
      {
        id: "2-4",
        name: "2-4 Volcano Dungeon",
        pointsNormal: 2,
        pointsChallenged: 3,
      },
    ],
  },
  {
    id: "3",
    name: "World 3",
    color: "bg-sky-100 border-sky-300",
    dungeons: [
      {
        id: "3-1",
        name: "3-1 Mountain Pass",
        pointsNormal: 2,
        pointsChallenged: 3,
      },
      {
        id: "3-2",
        name: "3-2 Winter Cavern",
        pointsNormal: 2,
        pointsChallenged: 3,
      },
      {
        id: "3-3",
        name: "3-3 Winter Dungeon",
        pointsNormal: 2,
        pointsChallenged: 3,
      },
    ],
  },
  {
    id: "4",
    name: "World 4",
    color: "bg-yellow-100 border-yellow-300",
    dungeons: [
      {
        id: "4-1",
        name: "4-1 Scrap Canyon",
        pointsNormal: 3,
        pointsChallenged: 4,
      },
      {
        id: "4-2",
        name: "4-2 Deserted Burrowmine",
        pointsNormal: 3,
        pointsChallenged: 4,
      },
      {
        id: "4-3",
        name: "4-3 Pyramid Dungeon",
        pointsNormal: 3,
        pointsChallenged: 4,
      },
    ],
  },
  {
    id: "5",
    name: "World 5",
    color: "bg-red-100 border-red-300",
    dungeons: [
      {
        id: "5-1",
        name: "5-1 Konoh Heartlands",
        pointsNormal: 3,
        pointsChallenged: 4,
      },
      {
        id: "5-2",
        name: "5-2 Konoh Inferno",
        pointsNormal: 4,
        pointsChallenged: 5,
      },
    ],
  },
  {
    id: "6",
    name: "World 6",
    color: "bg-teal-100 border-teal-300",
    dungeons: [
      {
        id: "6-1",
        name: "6-1 Rough Waters",
        pointsNormal: 4,
        pointsChallenged: 5,
      },
      {
        id: "6-2",
        name: "6-2 Treasure Hunt",
        pointsNormal: 4,
        pointsChallenged: 5,
      },
    ],
  },
  {
    id: "7",
    name: "World 7",
    color: "bg-pink-100 border-pink-300",
    dungeons: [
      {
        id: "7-1",
        name: "7-1 The Underworld",
        pointsNormal: 5,
        pointsChallenged: 6,
      },
      {
        id: "7-2",
        name: "7-2 The Labyrinth",
        pointsNormal: 5,
        pointsChallenged: 6,
      },
    ],
  },
  {
    id: "8",
    name: "World 8",
    color: "bg-orange-100 border-orange-300",
    dungeons: [
      {
        id: "8-1",
        name: "8-1 Rescue in the Ruins",
        pointsNormal: 5,
        pointsChallenged: 6,
      },
      {
        id: "8-2",
        name: "8-2 Ruin Rush",
        pointsNormal: 6,
        pointsChallenged: 7,
      },
    ],
  },
  {
    id: "9",
    name: "World 9",
    color: "bg-purple-100 border-purple-300",
    dungeons: [
      {
        id: "9-1",
        name: "9-1 Treetop Trouble",
        pointsNormal: 6,
        pointsChallenged: 7,
      },
      {
        id: "9-2",
        name: "9-2 Aether Fortress",
        pointsNormal: 6,
        pointsChallenged: 7,
      },
    ],
  },
  {
    id: "10",
    name: "World 10",
    color: "bg-indigo-100 border-indigo-300",
    dungeons: [
      {
        id: "10-1",
        name: "10-1 Crystal Chaos",
        pointsNormal: 7,
        pointsChallenged: 8,
      },
      {
        id: "10-2",
        name: "10-2 Astral Academy",
        pointsNormal: 7,
        pointsChallenged: 8,
      },
    ],
  },
];
