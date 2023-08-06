export type RunwayImage = {
  url: string
  credit: string | null
  caption: string | null
}

export type Review = {
  author: string | null
  text: string | null
}

export type VogueShowWithSingleImage = {
  name: string
  designer: string
  season: string
  city: string
  review: Review
  image: RunwayImage
}
