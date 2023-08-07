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
      <div className="container">
        <div className="left-gutter"></div>
        <div className="top-gutter"></div>
        <div className="middle-cell">
          <div className="info-pane">
            {imageAndDetails.image ? (
              <div className="info-card">
                <a href={imageAndDetails.externalLink} target="_blank" rel="noopener noreferrer">
                  <ul>
                    <li>Designer: {imageAndDetails.designer}</li>
                    <li>Season: {imageAndDetails.season}</li>
                    <li>City: {imageAndDetails.city}</li>
                    <br></br>
                    <li className="smaller">Photo: {imageAndDetails.image.credit}</li>
                  </ul>
                </a>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="image-pane" onClick={handleClick}>
            {imageAndDetails.image && <img src={imageAndDetails.image.url} alt={imageAndDetails?.name} />}
          </div>
        </div>
        <div className="right-gutter"></div>
        <div className="bottom-gutter"></div>
      </div>
    </div>
  )
}

export default App
