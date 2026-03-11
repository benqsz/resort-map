import * as fs from "node:fs/promises"

import { NextResponse } from "next/server"

import { bookings } from "@/lib/bookings"
import parseTiles from "@/lib/parse-tiles"
import type { MapResponseType } from "@/lib/types"

export async function GET(_req: Request) {
  try {
    const map = await fs.readFile(`${process.env.MAP_PATH}`, {
      encoding: "utf8",
    })
    const parsedMap = parseTiles(map)
    const data: MapResponseType = {
      map: parsedMap,
      bookings: bookings,
    }

    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        error: "Failed to load map data",
      },
      { status: 500 }
    )
  }
}
