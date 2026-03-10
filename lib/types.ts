export const Tile = {
  Cabana: "W",
  Pool: "p",
  Path: "#",
  Chalet: "c",
  Empty: ".",
} as const

export type TileType = (typeof Tile)[keyof typeof Tile]

export const PathVariant = {
  Straight: "straight",
  Corner: "corner",
  Split: "split",
  Crossing: "crossing",
  End: "end",
} as const

export type PathVariantType = (typeof PathVariant)[keyof typeof PathVariant]
