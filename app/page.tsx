import MapView from "@/components/map-view"
import type { MapResponseType } from "@/lib/types"

export default async function HomePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAGE_URL}/api/map`, {
    next: { tags: ["map"] },
  })
  const { map, bookings } = (await res.json()) as MapResponseType

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-lg mb-2 font-semibold">Resort map</h1>
      <MapView tiles={map} bookings={bookings} />
    </div>
  )
}
