import MapView from "@/components/map-view"
import type { TileType } from "@/lib/types"

export default async function HomePage() {
  const res = await fetch(`${process.env.PAGE_URL}/api/map`)
  const tiles = (await res.json()) as TileType[][]

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-lg mb-2 font-semibold">Resort map</h1>
      <MapView tiles={tiles} />
    </div>
  )
}
