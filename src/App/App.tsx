import React from "react"
import { useState } from "react"
import "./App.scss"
import { getRandomImageWithShowDetails } from "./helpers"
import { VogueShowWithSingleImage } from "../types"

function App() {
  const [imageAndDetails, setImageAndDetails] = useState({} as VogueShowWithSingleImage)
  async function handleClick() {
    const result = await getRandomImageWithShowDetails()
    setImageAndDetails(result)
  }

  return (
    <div className="main-body">
      <header></header>
      <div className="container">
        <div className="info-pane-container">
          {imageAndDetails.image ? (
            <div className="info-card">
              <ul>
                <li>Designer: {imageAndDetails.designer}</li>
                <li>Season: {imageAndDetails.season}</li>
                <li>City: {imageAndDetails.city}</li>
                <li>{imageAndDetails.image.credit}</li>
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="image-container">
          {imageAndDetails.image ? (
            <button className="invisible-button" onClick={handleClick}>
              <img src={imageAndDetails.image.url} alt={imageAndDetails?.name} />
            </button>
          ) : (
            <button onClick={handleClick}>Click me to get a random runway image</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
