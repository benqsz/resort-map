import type { StaticImageData } from "next/image"

import { Tile, type TileType } from "@/lib/types"
import PathImage from "@/public/arrowStraight.png"
import CabanaImage from "@/public/cabana.png"
import ChaletImage from "@/public/houseChimney.png"
import EmptyImage from "@/public/parchmentBasic.png"
import PoolImage from "@/public/pool.png"

export const TileToImage: Record<TileType, StaticImageData> = {
  [Tile.Cabana]: CabanaImage,
  [Tile.Pool]: PoolImage,
  [Tile.Path]: PathImage,
  [Tile.Chalet]: ChaletImage,
  [Tile.Empty]: EmptyImage,
}
