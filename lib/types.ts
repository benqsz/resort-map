export const Tile = {
  Cabana: "W",
  Pool: "p",
  Path: "#",
  Chalet: "c",
  Empty: ".",
} as const

export type TileType = (typeof Tile)[keyof typeof Tile]
