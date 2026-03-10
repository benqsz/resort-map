import {
  PathVariant,
  Tile,
  type PathVariantType,
  type TileType,
} from "@/lib/types"

type Props = {
  tiles: TileType[][]
  row: number
  col: number
}

type Returns = {
  variant: PathVariantType
  rotation: number
}

export default function parsePath(props: Props): Returns {
  const { tiles, row, col } = props
  const isPath = (r: number, c: number) => tiles[r]?.[c] === Tile.Path

  const N = isPath(row - 1, col)
  const E = isPath(row, col + 1)
  const S = isPath(row + 1, col)
  const W = isPath(row, col - 1)

  const count = [N, E, S, W].filter(Boolean).length

  if (count === 4) return { variant: PathVariant.Crossing, rotation: 0 }

  if (count === 3) {
    if (!W) return { variant: PathVariant.Split, rotation: 0 }
    if (!N) return { variant: PathVariant.Split, rotation: 90 }
    if (!E) return { variant: PathVariant.Split, rotation: 180 }
    if (!S) return { variant: PathVariant.Split, rotation: 270 }
  }

  if (count === 2) {
    if (N && S) return { variant: PathVariant.Straight, rotation: 0 }
    if (E && W) return { variant: PathVariant.Straight, rotation: 90 }

    if (N && E) return { variant: PathVariant.Corner, rotation: 0 }
    if (E && S) return { variant: PathVariant.Corner, rotation: 90 }
    if (S && W) return { variant: PathVariant.Corner, rotation: 180 }
    if (W && N) return { variant: PathVariant.Corner, rotation: 270 }
  }

  if (count === 1) {
    if (N) return { variant: PathVariant.End, rotation: 0 }
    if (W) return { variant: PathVariant.End, rotation: 90 }
    if (S) return { variant: PathVariant.End, rotation: 180 }
    if (E) return { variant: PathVariant.End, rotation: 270 }
  }

  return { variant: PathVariant.End, rotation: 0 }
}
