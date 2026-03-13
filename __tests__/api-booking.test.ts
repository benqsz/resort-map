import fs from "node:fs/promises"

import { revalidateTag } from "next/cache"

import { POST } from "@/app/api/booking/route"
import { bookings } from "@/lib/bookings"

jest.mock("node:fs/promises", () => {
  const readFile = jest.fn()
  return {
    __esModule: true,
    default: { readFile },
    readFile,
  }
})

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}))

const mockedReadFile = jest.mocked(fs.readFile)
const mockedRevalidateTag = jest.mocked(revalidateTag)

const createRequest = (body: unknown) =>
  new Request(`${process.env.NEXT_PUBLIC_PAGE_URL}/api/booking`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })

describe("POST /api/booking", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PAGE_URL = "https://localhost:3000"
    process.env.BOOKINGS_PATH = "bookings.json"
    bookings.length = 0
    jest.clearAllMocks()
  })

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(createRequest({ id: "cabana-1", room: "101" }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toBe(
      "Guest name and room number are required"
    )
    expect(mockedReadFile).not.toHaveBeenCalled()
  })

  it("returns 400 when room is not number", async () => {
    const response = await POST(
      createRequest({ id: "cabana-1", room: "A12", guestName: "Jane" })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toBe("Room number must be a number")
    expect(mockedReadFile).not.toHaveBeenCalled()
  })

  it("returns 500 when bookings file is invalid JSON", async () => {
    mockedReadFile.mockResolvedValue('[{"room":101,"guestName":"Jane"}]')

    const response = await POST(
      createRequest({ id: "cabana-1", room: "101", guestName: "Jane" })
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toBe(
      "Unknow error while processing booking"
    )
  })

  it("returns false when no matching booking exists", async () => {
    mockedReadFile.mockResolvedValue('[{"room":"101","guestName":"Jane"}]')

    const response = await POST(
      createRequest({ id: "cabana-1", room: "202", guestName: "Alex" })
    )

    expect(mockedReadFile).toHaveBeenCalledWith("bookings.json", {
      encoding: "utf8",
    })
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toBe(false)
    expect(mockedRevalidateTag).not.toHaveBeenCalled()
  })

  it("creates a booking and revalidates map tag", async () => {
    mockedReadFile.mockResolvedValue('[{"room":"101","guestName":"Jane"}]')

    const response = await POST(
      createRequest({ id: "cabana-1", room: "101", guestName: "Jane" })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toBe(true)
    expect(bookings).toEqual([
      {
        id: "cabana-1",
        room: "101",
        guestName: "Jane",
      },
    ])
    expect(mockedRevalidateTag).toHaveBeenCalledWith("map", "max")
  })

  it("returns 400 when cabana id is already reserved", async () => {
    bookings.push({ id: "cabana-1", room: "999", guestName: "Other" })
    mockedReadFile.mockResolvedValue('[{"room":"101","guestName":"Jane"}]')

    const response = await POST(
      createRequest({ id: "cabana-1", room: "101", guestName: "Jane" })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toBe(
      "This cabana is already reserved"
    )
  })

  it("returns 400 when room is already booked for the guest", async () => {
    bookings.push({ id: "cabana-1", room: "101", guestName: "Jane" })
    mockedReadFile.mockResolvedValue('[{"room":"101","guestName":"Jane"}]')

    const response = await POST(
      createRequest({ id: "cabana-2", room: "101", guestName: "Jane" })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toBe("This room is already booked")
  })
})
