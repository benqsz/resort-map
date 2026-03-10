import { Nunito_Sans } from "next/font/google"

import "./globals.css"

import { cn } from "@/lib/utils"

const nunitoSans = Nunito_Sans({ variable: "--font-sans" })

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", nunitoSans.variable)}
    >
      <body>{children}</body>
    </html>
  )
}
