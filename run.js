#!/usr/bin/env node
import { spawn } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import commandLineArgs from "command-line-args"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const optionDefinitions = [
  { name: "map", alias: "m", type: String },
  {
    name: "bookings",
    alias: "b",
    type: String,
  },
]

const options = commandLineArgs(optionDefinitions)

const mapPath = path.resolve(process.cwd(), options.map || "./map.ascii")
const bookingsPath = path.resolve(
  process.cwd(),
  options.bookings || "./bookings.json"
)

function main() {
  if (!fs.existsSync(mapPath)) {
    console.error(`Error: Map file not found at ${mapPath}`)
    process.exit(1)
  }

  if (!fs.existsSync(bookingsPath)) {
    console.error(`Error: Bookings file not found at ${bookingsPath}`)
    process.exit(1)
  }

  console.log("Starting Resort Map App")

  process.env.MAP_PATH = mapPath
  process.env.BOOKINGS_PATH = bookingsPath
  if (!process.env.NEXT_PUBLIC_PAGE_URL) {
    process.env.NEXT_PUBLIC_PAGE_URL = "http://localhost:3000"
  }

  const dev = spawn("pnpm run dev", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  })

  dev.on("close", (code) => {
    if (code !== 0) {
      console.error("Starting failed")
      process.exit(1)
    }
  })
}

main()
