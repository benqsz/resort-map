import { Tile, type TileType } from "@/lib/types"

export default function parseTiles(ascii: string): TileType[][] {
  return ascii
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split("")
        .map((char) =>
          (Object.values(Tile) as string[]).includes(char)
            ? (char as TileType)
            : Tile.Empty
        )
    )
}
