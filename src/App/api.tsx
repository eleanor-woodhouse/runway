import fetch from "cross-fetch"

export async function fetchAllDesigners(): Promise<any[]> {
  const queryUrl = "https://graphql.vogue.com/graphql?query=query{allBrands{Brand{slug}}}"
  const allDesigners = await fetchFromVogue(queryUrl)
  return allDesigners.allBrands.Brand
}

export async function fetchAllSeasonsForDesigner(designer: string): Promise<any[]> {
  //   const queryUrl = `https://graphql.vogue.com/graphql?query=query{ allContent(type: ["FashionShowV2"], first: 1000, filter: { brand: { slug: "${designer}" } }) { Content { id GMTPubDate url title slug _cursor_ ... on FashionShowV2 { instantShow brand { name slug } season { name slug year } photosTout { ... on Image { url } } } } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }`
  const queryUrl = `https://graphql.vogue.com/graphql?query=query{ allContent(type: ["FashionShowV2"], first: 1000, filter: { brand: { slug: "${designer}" } }) { Content { slug  } } } `
  const allSeasons = await fetchFromVogue(queryUrl)
  return allSeasons.allContent.Content
}

export async function fetchShow(showSlug: string) {
  const queryUrl = `https://graphql.vogue.com/graphql?query=query{ fashionShowV2(slug: "${showSlug}") { GMTPubDate url title slug id instantShow city { name } brand { name slug } season { name slug year } photosTout { ... on Image { url } } review { pubDate body contributor { author { name photosTout { ... on Image { url } } } } } galleries { collection { ... GalleryFragment } atmosphere { ... GalleryFragment } beauty { ... GalleryFragment } detail { ... GalleryFragment } frontRow { ... GalleryFragment } } video { url cneId title } } } fragment GalleryFragment on FashionShowGallery { title meta { ...metaFields } slidesV2 { ... on GallerySlidesConnection { slide { ... on Slide { id credit photosTout { ...imageFields } } ... on CollectionSlide { id type credit title photosTout { ...imageFields } }  __typename } } } } fragment imageFields on Image { id url caption credit width height } fragment metaFields on Meta { facebook { title description } twitter { title description } }`
  const showData = await fetchFromVogue(queryUrl)
  return showData.fashionShowV2
}

export async function fetchFromVogue(url: string) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Host: "graphql.vogue.com",
      //   "User-Agent":
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    referrerPolicy: "origin",
  })
  const json = await res.json()
  return json.data
}
