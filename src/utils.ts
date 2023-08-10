export function formatImageCredit(credit: string): string {
  if (credit && credit.startsWith("Photo: ")) {
    const remainingString = credit.substring("Photo: ".length)
    return remainingString.trim()
  } else if (credit && credit.startsWith("Photographed by ")) {
    const remainingString = credit.substring("Photographed by ".length)
    return remainingString.trim()
  }
  return credit
}

export function formatProperNoun(cityName: string): string {
  return cityName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// TODO: finish

export function checkAndFormatDecimalCodes(text: string): string {
  if (text.indexOf("&") !== -1) {
    return formatUnicodes(text)
  }
  return text
}

function formatUnicodes(text: string): string {
  const checkedForHexCode = checkForHexCode(text)
  const checkedForDecimalCode = checkForDecimalCode(checkedForHexCode)
  const fullyCheckedString = checkForEntityCode(checkedForDecimalCode)
  return fullyCheckedString
}

function checkForHexCode(text: string): string {
  if (text.includes("&#x")) {
    // return fixed string
  }
  return text
}

function checkForDecimalCode(text: string): string {
  if (text.includes("&#")) {
    // return fixed string
  }
  return text
}

function checkForEntityCode(text: string): string {
  if (text.includes("&")) {
    // return fixed string
  }
  return text
}
