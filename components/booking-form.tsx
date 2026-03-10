"use client"

import { useState, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { BookingFormType } from "@/lib/types"

type Props = {
  children: ReactNode
  row: number
  col: number
}

export default function BookingForm({ children, row, col }: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<BookingFormType>({
    defaultValues: {
      guestName: "",
      roomNumber: "",
    },
  })

  async function onSubmit(formData: BookingFormType) {
    if (!formData.guestName || !formData.roomNumber) {
      form.setError("root", {
        message: "Guest name and room number are required",
      })
    }

    if (!/^\d+$/.test(formData.roomNumber)) {
      form.setError("roomNumber", {
        message: "Room number must be a number",
      })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_PAGE_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      form.setError("root", {
        message: errorData || "Failed to book the cabana",
      })
      return
    }

    const data: boolean = await res.json()

    if (!data) {
      form.setError("root", {
        message: "Invalid guest name or room number",
      })
      return
    }

    setOpen(false)
  }

  function handleChange(nextOpen: boolean) {
    if (form.formState.isSubmitting) return
    if (nextOpen) form.reset()
    setOpen(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogTrigger className="cursor-pointer" aria-label="Book this cabana">
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Booking cabana no. #{`${row}-${col}`}</DialogTitle>
          <DialogDescription className="mb-6">
            Please provide guest name and room number to book this cabana.
          </DialogDescription>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md w-full mx-auto"
          >
            <Controller
              name="guestName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Guest name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="roomNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Room number</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="number"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {form.formState.errors.root?.message && (
              <FieldError errors={[form.formState.errors.root]} />
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner aria-label="Form submitting" />
              ) : (
                "Confirm booking"
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
