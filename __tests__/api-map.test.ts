import * as fs from "node:fs/promises"

import { GET } from "@/app/api/map/route"
import { bookings } from "@/lib/bookings"
import { Tile } from "@/lib/types"

jest.mock("node:fs/promises", () => {
  const readFile = jest.fn()
  return {
    __esModule: true,
    default: { readFile },
    readFile,
  }
})

const mockedReadFile = jest.mocked(fs.readFile)

describe("GET /api/map", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PAGE_URL = "https://localhost:3000"
    process.env.MAP_PATH = "map.ascii"
    bookings.length = 0
    jest.clearAllMocks()
  })

  it("returns parsed map and bookings", async () => {
    mockedReadFile.mockResolvedValue(".#\nWc")

    const res = await GET(
      new Request(`${process.env.NEXT_PUBLIC_PAGE_URL}/api/map`)
    )

    expect(mockedReadFile).toHaveBeenCalledWith("map.ascii", {
      encoding: "utf8",
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      map: [
        [Tile.Empty, Tile.Path],
        [Tile.Cabana, Tile.Chalet],
      ],
      bookings: [],
    })
  })

  it("returns 500 when map file cannot be loaded", async () => {
    mockedReadFile.mockRejectedValue(new Error("cannot read file"))

    const res = await GET(
      new Request(`${process.env.NEXT_PUBLIC_PAGE_URL}/api/map`)
    )

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      error: "Failed to load map data",
    })
  })
})
