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

type Props = {
  children: ReactNode
  row: number
  col: number
}

type FormType = {
  guestName: string
  roomNumber: string
}

export default function BookingForm({ children, row, col }: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<FormType>({
    defaultValues: {
      guestName: "",
      roomNumber: "",
    },
  })

  async function onSubmit(data: FormType) {
    console.log(data)

    if (!data.guestName || !data.roomNumber) {
      form.setError("root", {
        type: "manual",
        message: "Guest name and room number are required",
      })
    }

    if (!/^\d+$/.test(data.roomNumber)) {
      form.setError("roomNumber", {
        type: "manual",
        message: "Room number must be a number",
      })
    }

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })

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
