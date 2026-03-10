import Image from "next/image"

import BookingForm from "@/components/booking-form"
import { TileToAlt, TileToImage } from "@/lib/constants"
import parsePath from "@/lib/parse-path"
import { Tile, type TileType } from "@/lib/types"

type Props = {
  tiles: TileType[][]
}

export default function MapView({ tiles }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {tiles.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((tile, j) => {
            if (tile === Tile.Path) {
              const { variant, rotation } = parsePath({ tiles, row: i, col: j })
              return (
                <Image
                  key={`${i}-${j}`}
                  src={TileToImage["#"][variant]}
                  alt={TileToAlt[tile]}
                  width={32}
                  height={32}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              )
            }

            if (tile === Tile.Cabana) {
              return (
                <BookingForm key={`${i}-${j}`} row={i} col={j}>
                  <Image
                    src={TileToImage[tile]}
                    alt={TileToAlt[tile]}
                    width={32}
                    height={32}
                  />
                </BookingForm>
              )
            }

            return (
              <Image
                key={`${i}-${j}`}
                src={TileToImage[tile]}
                alt={TileToAlt[tile]}
                width={32}
                height={32}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
