import { PathVariant, Tile } from "@/lib/types"
import PathCornerImage from "@/public/arrowCornerSquare.png"
import PathCrossingImage from "@/public/arrowCrossing.png"
import PathEndImage from "@/public/arrowEnd.png"
import PathSplitImage from "@/public/arrowSplit.png"
import PathStraightImage from "@/public/arrowStraight.png"
import CabanaImage from "@/public/cabana.png"
import ChaletImage from "@/public/houseChimney.png"
import EmptyImage from "@/public/parchmentBasic.png"
import PoolImage from "@/public/pool.png"

export const TileToImage = {
  [Tile.Cabana]: CabanaImage,
  [Tile.Pool]: PoolImage,
  [Tile.Chalet]: ChaletImage,
  [Tile.Empty]: EmptyImage,
  [Tile.Path]: {
    [PathVariant.Straight]: PathStraightImage,
    [PathVariant.Corner]: PathCornerImage,
    [PathVariant.Split]: PathSplitImage,
    [PathVariant.Crossing]: PathCrossingImage,
    [PathVariant.End]: PathEndImage,
  },
} as const
