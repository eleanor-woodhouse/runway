import { fetchAllSeasonsForDesigner, fetchShow } from "./api/vogue"
import { VogueShowWithSingleImage, RunwayImage } from "./types"
import { getDesignersArray } from "./designers"
import { formatImageCredit, formatProperNoun } from "./utils"

export async function getRandomImageWithShowDetails(): Promise<VogueShowWithSingleImage | void> {
  try {
    const showData = await getRandomShow()
    const runwayImages = showData.galleries.collection.slidesV2.slide
    const image = getRandomRunwayImage(runwayImages)
    const formattedCityName = formatProperNoun(showData.city.name)
    const review = {
      author: showData.review?.contributor?.author[0]?.name,
      text: showData.review?.body,
    }
    return {
      name: showData.title,
      designer: showData.brand.name,
      season: showData.season.name,
      city: formattedCityName,
      review,
      image,
      externalLink: showData.url,
    }
  } catch (error) {
    console.error("Could not retrieve runway look, try again")
  }
}

function getRandomRunwayImage(showRunwayImages: any[]): RunwayImage {
  const randomIndex = Math.floor(Math.random() * showRunwayImages.length)
  const imageData = showRunwayImages[randomIndex]
  const uncheckedCredit = imageData?.credit
  const credit = formatImageCredit(uncheckedCredit)

  const image: RunwayImage = {
    url: imageData.photosTout.url,
    credit,
    caption: imageData?.photosTout?.caption,
  }
  return image
}

async function getRandomShow(): Promise<any> {
  const designer = await getRandomDesigner()
  const seasons = await fetchAllSeasonsForDesigner(designer)
  const seasonSlug = getRandomShowSlug(seasons)
  const show = await fetchShow(seasonSlug)
  return show
}

async function getRandomDesigner(): Promise<string> {
  //   const designers = await fetchAllDesigners()
  const designers = getDesignersArray(false)
  const randomIndex = Math.floor(Math.random() * designers.length)
  const randomDesigner = designers[randomIndex]
  return randomDesigner
}

// TODO how to make type a string that matches one value of an object, or one item in an array?
function getRandomShowSlug(seasons: any[]): string {
  const randomIndex = Math.floor(Math.random() * seasons.length)
  const randomShow = seasons[randomIndex]
  return randomShow.slug
}
