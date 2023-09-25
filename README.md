# Vogue Runway Random Image Generator

Brute-forcing the technically-not-public Vogue graphql api to create a random image generator.

## Setup

The usual.

#### Terminal

```bash
npm i
npm start
```

## TODOS

#### Minor

If I can ever be bothered, finish checks for the photo credit text to filter out funky characters.

Fix for mobile: when "About" text is visible, clicking anywhere should only return to normal view. It should NOT return
to normal view & trigger a new image.

#### Bigger

Cache multiple images instead of new API calls every time?

Refactor the component?

#### Feature

Create an autoplay version, which could also be turned into a screensaver
