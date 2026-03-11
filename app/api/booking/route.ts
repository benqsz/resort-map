import fs from "node:fs/promises"

import { NextResponse } from "next/server"

import { bookings } from "@/lib/bookings"
import type { BookingFormType, BookingType } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const formData: BookingFormType = await req.json()

    if (!formData.guestName || !formData.roomNumber) {
      return NextResponse.json("Guest name and room number are required", {
        status: 400,
      })
    }

    if (!/^\d+$/.test(formData.roomNumber)) {
      return NextResponse.json("Room number must be a number", { status: 400 })
    }

    const fileContents = await fs.readFile(`${process.env.BOOKINGS_PATH}`, {
      encoding: "utf8",
    })

    const data = JSON.parse(fileContents)

    const isJsonValid =
      Array.isArray(data) &&
      data.every((booking) => {
        return (
          typeof booking.room === "string" &&
          typeof booking.guestName === "string" &&
          !isNaN(Number(booking.room))
        )
      })

    if (!isJsonValid) {
      throw new Error("Invalid JSON format")
    }

    const fileBookings: BookingType[] = data

    const bookingToReserve = fileBookings.find(
      (booking) =>
        Number(booking.room) === Number(formData.roomNumber) &&
        booking.guestName === formData.guestName
    )

    if (bookingToReserve) {
      const isAlreadyBooked = bookings.find(
        (booking) =>
          Number(booking.room) === Number(formData.roomNumber) &&
          booking.guestName === formData.guestName
      )

      if (isAlreadyBooked) {
        return NextResponse.json("This booking is already reserved", {
          status: 400,
        })
      }

      bookings.push(bookingToReserve)
      return NextResponse.json(true, { status: 200 })
    }

    return NextResponse.json(false, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json("Unknow error while processing booking", {
      status: 500,
    })
  }
}
