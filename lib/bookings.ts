import type { BookingType } from "@/lib/types"

const globalForData = global as unknown as { bookings: BookingType[] }

export const bookings = globalForData.bookings || []

if (process.env.NODE_ENV !== "production") globalForData.bookings = bookings
