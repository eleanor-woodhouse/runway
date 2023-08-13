import React, { useEffect, useRef } from "react"
import { useState } from "react"
import "../styles/App.scss"
import { getRandomImageWithShowDetails } from "../runway"
import { VogueShowWithSingleImage } from "../types"

function App() {
  const [imageAndDetails, setImageAndDetails] = useState({} as VogueShowWithSingleImage)

  const [transitionGridIsVisible, setTransitionGridIsVisible] = useState(false)
  const [transitionGridSizes, setTransitionGridSizes] = useState({})
  const [transitionEndCount, setTransitionEndCount] = useState(0)
  const [gridIsClosed, setGridIsClosed] = useState(false)

  const [instructionsAreVisible, setInstructionsAreVisible] = useState(true)
  const [welcomeCardIsVisible, setWelcomeCardIsVisible] = useState(true)
  const [loadingCardIsVisible, setLoadingCardIsVisible] = useState(false)
  const [animationIsPaused, setAnimationIsPaused] = useState(false)

  const leftGutterRef = useRef<HTMLDivElement | null>(null)
  const topGutterRef = useRef<HTMLDivElement | null>(null)
  const rightGutterRef = useRef<HTMLDivElement | null>(null)
  const bottomGutterRef = useRef<HTMLDivElement | null>(null)
  const middleCellRef = useRef<HTMLDivElement | null>(null)

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
      setTransitionGridSizes({
        gridTemplateColumns: `${leftGutterRef.current.offsetWidth}px ${middleCellRef.current.offsetWidth}px 400vw`,
        gridTemplateRows: `${topGutterRef.current.offsetHeight}px ${middleCellRef.current.offsetHeight}px 400vh`,
      })
    }
    startTransition()
  }

  function startTransition() {
    setTransitionGridIsVisible(true)
    closeGrid()
  }

  const handleTransitionEnd = () => {
    setTransitionEndCount((prevCount) => {
      return prevCount + 1
    })
  }

  function closeGrid() {
    setTimeout(() => {
      setTransitionGridSizes({
        gridTemplateColumns: "50vw 0px 400vw",
        gridTemplateRows: "50vh 0px 400vh",
      })
      setTimeout(() => {
        setGridIsClosed(true)
        fetchVogueData()
        startLoading()
      }, 3000)
    })
  }

  function startLoading() {
    setWelcomeCardIsVisible(false)
    setLoadingCardIsVisible(true)
  }

  useEffect(() => {
    if (transitionEndCount === 2 && gridIsClosed) {
      openGridToLoadingCard()
    } else if (transitionEndCount === 6 && gridIsClosed) {
      openGridToMainView()
    }
  }, [transitionEndCount, gridIsClosed])

  async function fetchVogueData() {
    const result = await getRandomImageWithShowDetails()
    setImageAndDetails(result)
  }

  function openGridToLoadingCard() {
    setGridIsClosed(false)
    setTransitionGridSizes((prevGridStage) => {
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
          // gridTemplateColumns: `${columnSize}px 300px ${columnSize}px`,
          // gridTemplateRows: `${rowSize}px 220px ${rowSize}px`,
          // gridTemplateColumns: `${columnSize}px ${columnSize}px ${columnSize}px`,
          // gridTemplateRows: `${rowSize}px ${rowSize}px ${rowSize}px`,
          gridTemplateColumns: `33vw 34vw 400vw`,
          gridTemplateRows: `33vh 34vh 400vh`,
        }
      }
      return prevGridStage
    })
    setTimeout(() => {
      setAnimationIsPaused(true)
    }, 3000)
  }

  function imageLoaded() {
    setAnimationIsPaused(false)
    closeLoadingCard()
    // An overried in case window is resized during transition (throwing count out of sync)
    setTimeout(() => {
      openGridToMainView()
    }, 4000)
  }

  function closeLoadingCard() {
    setTransitionGridSizes({
      gridTemplateColumns: "50vw 0px 400vw",
      gridTemplateRows: "50vh 0px 400vh",
    })
    setTimeout(() => {
      setGridIsClosed(true)
    }, 3000)
  }

  function openGridToMainView() {
    setLoadingCardIsVisible(false)
    setGridIsClosed(false)
    setTransitionGridSizes((prevGridStage) => {
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
      setTransitionGridIsVisible(false)
      setInstructionsAreVisible(false)
      setTransitionEndCount(0)
    }, 3100)
  }

  return (
    <div className="main-body">
      <div
        className={`transition-grid ${transitionGridIsVisible ? "visible" : "invisible"} ${
          animationIsPaused ? "no-transition" : ""
        }`}
        style={transitionGridSizes}
        onTransitionEnd={handleTransitionEnd}
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
            Welcome to the Random Runway Look Generator<br></br>click to begin
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
                  <p>click image to retrieve a new look from the archives</p>
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
