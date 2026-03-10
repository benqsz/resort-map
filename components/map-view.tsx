import Image from "next/image"

import { TileToImage } from "@/lib/constants"
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
                  alt={variant}
                  width={32}
                  height={32}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              )
            }
            return (
              <Image
                key={`${i}-${j}`}
                src={TileToImage[tile]}
                alt={tile}
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
