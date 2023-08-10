import React, { useRef } from "react"
import { useState } from "react"
import "../styles/AppWithSimplerLoading.scss"
import { getRandomImageWithShowDetails } from "../runway"
import { VogueShowWithSingleImage } from "../types"

function App() {
  // General state
  const [imageAndDetails, setImageAndDetails] = useState({} as VogueShowWithSingleImage)

  const [transitionGridIsVisible, setTransitionGridIsVisibile] = useState(false)
  const [gridStage, setGridStage] = useState({})
  const [gridIsClosed, setGridIsClosed] = useState(false)

  const [instructionsAreVisible, setInstructionsAreVisible] = useState(true)
  const [welcomeCardIsVisible, setWelcomeCardIsVisible] = useState(true)
  const [loadingCardIsVisible, setLoadingCardIsVisible] = useState(false)

  const leftGutterRef = useRef<HTMLDivElement | null>(null)
  const topGutterRef = useRef<HTMLDivElement | null>(null)
  const rightGutterRef = useRef<HTMLDivElement | null>(null)
  const bottomGutterRef = useRef<HTMLDivElement | null>(null)
  const middleCellRef = useRef<HTMLDivElement | null>(null)
  const transitionRef = useRef<HTMLDivElement | null>(null)
  const windowSize = useRef([window.innerWidth, window.innerHeight])

  async function handleClick() {
    if (
      leftGutterRef &&
      leftGutterRef.current &&
      topGutterRef &&
      topGutterRef.current &&
      rightGutterRef &&
      rightGutterRef.current &&
      bottomGutterRef &&
      bottomGutterRef.current &&
      middleCellRef &&
      middleCellRef.current
    ) {
      setGridStage({
        gridTemplateColumns: `${leftGutterRef.current.offsetWidth}px ${middleCellRef.current.offsetWidth}px ${rightGutterRef.current.offsetWidth}px`,
        gridTemplateRows: `${topGutterRef.current.offsetHeight}px ${middleCellRef.current.offsetHeight}px ${bottomGutterRef.current.offsetHeight}px`,
      })
    }
    triggerFirstGutterTransition()
  }

  function triggerFirstGutterTransition() {
    setTransitionGridIsVisibile(true)
    triggerFirstGridClosing()
  }

  // Give the grid its closed dimensions, thus starting the first closing transition
  function triggerFirstGridClosing() {
    setTimeout(() => {
      setGridStage({
        gridTemplateColumns: "50vw 0px 50vw",
        gridTemplateRows: "50vh 0px 50vh",
      })
      setTimeout(() => {
        //removes thick lines
        setGridIsClosed(true)
        triggerSecondStage()
      }, 3000)
    })
  }

  function triggerSecondStage() {
    fetchVogueData()
    setWelcomeCardIsVisible(false) // this doesn't get reset as we want to see it once
    setLoadingCardIsVisible(true)
    openGridToLoadingCard()
  }

  async function fetchVogueData() {
    const result = await getRandomImageWithShowDetails()
    setImageAndDetails(result)
  }

  function openGridToLoadingCard() {
    setGridIsClosed(false)
    const columnSize = (windowSize.current[0] - 300) / 2
    const rowSize = (windowSize.current[1] - 220) / 2
    setGridStage((prevGridStage) => {
      if (
        leftGutterRef &&
        leftGutterRef.current &&
        topGutterRef &&
        topGutterRef.current &&
        rightGutterRef &&
        rightGutterRef.current &&
        bottomGutterRef &&
        bottomGutterRef.current &&
        middleCellRef &&
        middleCellRef.current
      ) {
        return {
          ...prevGridStage,
          // FIX sizing is sometimes wrong – is this just when dev tools are open?
          gridTemplateColumns: `${columnSize}px 300px ${columnSize}px`,
          gridTemplateRows: `${rowSize}px 220px ${rowSize}px`,
        }
      }
      return prevGridStage
    })
  }

  // Wait for data to be fetched, then trigger the grid to be closed again
  function imageLoaded() {
    // WARNING Need to make sure this doesn't start until loading card has fully opened
    // How can we check it has fully opened? Because the transition count isn't working
    // closeGridAgain()
  }

  function closeGridAgain() {
    setGridStage({
      gridTemplateColumns: "50vw 0px 50vw",
      gridTemplateRows: "50vh 0px 50vh",
    })
    setTimeout(() => {
      setGridIsClosed(true)
      openGridToMainView()
    }, 3000)
  }

  function openGridToMainView() {
    setLoadingCardIsVisible(false)
    setGridIsClosed(false)
    setGridStage((prevGridStage) => {
      if (
        leftGutterRef &&
        leftGutterRef.current &&
        topGutterRef &&
        topGutterRef.current &&
        rightGutterRef &&
        rightGutterRef.current &&
        bottomGutterRef &&
        bottomGutterRef.current &&
        middleCellRef &&
        middleCellRef.current
      ) {
        return {
          ...prevGridStage,
          gridTemplateColumns: `${leftGutterRef.current.offsetWidth}px ${middleCellRef.current.offsetWidth}px ${rightGutterRef.current.offsetWidth}px`,
          gridTemplateRows: `${topGutterRef.current.offsetHeight}px ${middleCellRef.current.offsetHeight}px ${bottomGutterRef.current.offsetHeight}px`,
        }
      }
      return prevGridStage
    })
    setTimeout(() => {
      setTransitionGridIsVisibile(false)
      setInstructionsAreVisible(false)
    }, 3000)
  }

  return (
    <div className="main-body">
      <div
        className={`transition-grid ${transitionGridIsVisible ? "visible" : "invisible"}`}
        style={gridStage}
        ref={transitionRef}
      >
        <div className="cell-one"></div>
        <div className="cell-two"></div>
        <div className="cell-three"></div>
        <div className="cell-four"></div>
        <div className="cell-five"></div>
        <div className="cell-six"></div>
        <div className="cell-seven"></div>
        <div className="cell-eight"></div>
        <div className="left-gutter"></div>
        <div className="top-gutter"></div>
        <div className="middle-cell"></div>
        <div className={`right-gutter ${gridIsClosed ? "closed" : ""}`}></div>
        <div className={`bottom-gutter ${gridIsClosed ? "closed" : ""}`}></div>
      </div>
      <div className={`loading ${loadingCardIsVisible ? "visible-loading" : "invisible-loading"}`}>
        <div className={`loading-card ${loadingCardIsVisible ? "visible-loading-card" : "invisible-loading-card"}`}>
          <div className="loading-text">Loading</div>
        </div>
      </div>
      <div className="container">
        <div className="left-gutter" ref={leftGutterRef}></div>
        <div className="top-gutter" ref={topGutterRef}></div>
        <div
          className={`welcome-card ${welcomeCardIsVisible ? "visible-welcome-card" : "invisible-welcome-card"}`}
          onClick={handleClick}
        >
          <p>
            Welcome to the runway archive random image generator<br></br>click to begin
          </p>
        </div>
        <div className="middle-cell" ref={middleCellRef}>
          <div className="info-pane">
            {imageAndDetails.image ? (
              <>
                <div
                  className={`instructions ${
                    instructionsAreVisible ? "visible-instructions" : "invisible-instructions"
                  }`}
                >
                  <p>click image for a new look</p>
                </div>
                <div className="card-container">
                  <div className="info-card">
                    <a href={imageAndDetails.externalLink} target="_blank" rel="noopener noreferrer">
                      <ul>
                        <li>Designer: {imageAndDetails.designer}</li>
                        <li>Season: {imageAndDetails.season}</li>
                        <li>City: {imageAndDetails.city}</li>
                        <li className="smaller">Photo: {imageAndDetails.image.credit}</li>
                      </ul>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {imageAndDetails.image ? (
            <div className="image-pane" onClick={handleClick}>
              <img src={imageAndDetails.image.url} alt={imageAndDetails?.name} onLoad={imageLoaded} />
            </div>
          ) : (
            <div className="placeholder" onClick={handleClick}></div>
          )}
        </div>
        <div className="right-gutter" ref={rightGutterRef}></div>
        <div className="bottom-gutter" ref={bottomGutterRef}></div>
      </div>
    </div>
  )
}

export default App
