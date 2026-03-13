import parseTiles from "@/lib/parse-tiles"
import { Tile } from "@/lib/types"

describe("parseTiles", () => {
  it("parses known tile characters", () => {
    const ascii = "Wpc#.\n.#cWp"

    expect(parseTiles(ascii)).toEqual([
      [Tile.Cabana, Tile.Pool, Tile.Chalet, Tile.Path, Tile.Empty],
      [Tile.Empty, Tile.Path, Tile.Chalet, Tile.Cabana, Tile.Pool],
    ])
  })

  it("maps unknown characters to Tile.Empty", () => {
    const ascii = "X?\n#@"

    expect(parseTiles(ascii)).toEqual([
      [Tile.Empty, Tile.Empty],
      [Tile.Path, Tile.Empty],
    ])
  })

  it("skips blank lines", () => {
    const ascii = "W\n\n#\n"

    expect(parseTiles(ascii)).toEqual([[Tile.Cabana], [Tile.Path]])
  })
})
