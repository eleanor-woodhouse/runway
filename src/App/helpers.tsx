import { fetchAllDesigners, fetchAllSeasonsForDesigner, fetchShow } from "./api"
import { VogueShowWithSingleImage, RunwayImage } from "../types"

export async function getRandomImageWithShowDetails(): Promise<VogueShowWithSingleImage> {
  const showData = await getRandomShow()
  const showRunwayImages = showData.galleries.collection.slidesV2.slide
  const image = getRandomRunwayImage(showRunwayImages)
  const review = {
    author: showData.review?.contributor.author[0].name,
    text: showData.review?.body,
  }
  return {
    name: showData.title,
    designer: showData.brand.name,
    season: showData.season.name,
    city: showData.city.name,
    review,
    image,
  }
}

function getRandomRunwayImage(showRunwayImages: any[]): RunwayImage {
  const randomIndex = Math.floor(Math.random() * showRunwayImages.length)
  const imageData = showRunwayImages[randomIndex]

  const image: RunwayImage = {
    url: imageData.photosTout.url,
    credit: imageData?.credit,
    caption: imageData?.photosTout?.caption,
  }
  return image
}

async function getRandomShow() {
  const designer = await getRandomDesigner()
  const seasons = await fetchAllSeasonsForDesigner(designer)
  const seasonSlug = getRandomShowSlug(seasons)
  const show = await fetchShow(seasonSlug)
  return show
}

async function getRandomDesigner(): Promise<string> {
  const designers = await fetchAllDesigners()
  const randomIndex = Math.floor(Math.random() * designers.length)
  const randomDesigner = designers[randomIndex]
  return randomDesigner.slug
}

// TODO how to make type a string that matches one value of an object, or one item in an array?
function getRandomShowSlug(seasons: any[]): string {
  const randomIndex = Math.floor(Math.random() * seasons.length)
  const randomShow = seasons[randomIndex]
  return randomShow.slug
}
