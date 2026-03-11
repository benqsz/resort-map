import * as fs from "node:fs/promises"

import { NextResponse } from "next/server"

import parseTiles from "@/lib/parse-tiles"

export async function GET(_req: Request) {
  try {
    const map = await fs.readFile(`${process.env.MAP_PATH}`, {
      encoding: "utf8",
    })
    const parsedMap = parseTiles(map)

    return NextResponse.json(parsedMap, { status: 200 })
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
