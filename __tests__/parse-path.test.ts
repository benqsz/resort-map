import parsePath from "@/lib/parse-path"
import parseTiles from "@/lib/parse-tiles"
import { PathVariant } from "@/lib/types"

describe("parsePath", () => {
  it("returns crossing for 4 neighbors", () => {
    const tiles = parseTiles(".#.\n###\n.#.")

    expect(parsePath({ tiles, row: 1, col: 1 })).toEqual({
      variant: PathVariant.Crossing,
      rotation: 0,
    })
  })

  it.each([
    [".#.\n.##\n.#.", 0],
    ["...\n###\n.#.", 90],
    [".#.\n##.\n.#.", 180],
    [".#.\n###\n...", 270],
  ])("returns split variant for 3 neighbors %#", (ascii, rotation) => {
    const tiles = parseTiles(ascii)

    expect(parsePath({ tiles, row: 1, col: 1 })).toEqual({
      variant: PathVariant.Split,
      rotation,
    })
  })

  it.each([
    [".#.\n.#.\n.#.", PathVariant.Straight, 0],
    ["...\n###\n...", PathVariant.Straight, 90],
    [".#.\n.##\n...", PathVariant.Corner, 0],
    ["...\n.##\n.#.", PathVariant.Corner, 90],
    ["...\n##.\n.#.", PathVariant.Corner, 180],
    [".#.\n##.\n...", PathVariant.Corner, 270],
  ])(
    "returns the right variant and rotation for 2 neighbors %#",
    (ascii, variant, rotation) => {
      const tiles = parseTiles(ascii)

      expect(parsePath({ tiles, row: 1, col: 1 })).toEqual({
        variant,
        rotation,
      })
    }
  )

  it.each([
    [".#.\n.#.\n...", 0],
    ["...\n##.\n...", 90],
    ["...\n.#.\n.#.", 180],
    ["...\n.##\n...", 270],
  ])("returns end variant for 1 neighbor %#", (ascii, rotation) => {
    const tiles = parseTiles(ascii)

    expect(parsePath({ tiles, row: 1, col: 1 })).toEqual({
      variant: PathVariant.End,
      rotation,
    })
  })

  it("falls back to end when there are no neighbors", () => {
    const tiles = parseTiles("...\n.#.\n...")

    expect(parsePath({ tiles, row: 1, col: 1 })).toEqual({
      variant: PathVariant.End,
      rotation: 0,
    })
  })

  it("handles grid edges without throwing", () => {
    const tiles = parseTiles("##")

    expect(parsePath({ tiles, row: 0, col: 0 })).toEqual({
      variant: PathVariant.End,
      rotation: 270,
    })
  })
})
