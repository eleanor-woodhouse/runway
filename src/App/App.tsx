import React, { MouseEvent, useEffect, useRef } from "react"
import { useState } from "react"
import "../styles/App.scss"
import { getRandomImageWithShowDetails } from "../runway"
import { VogueShowWithSingleImage } from "../types"

function App() {
  const [imageAndDetails, setImageAndDetails] = useState({} as VogueShowWithSingleImage)

  const [transitionGridIsVisible, setTransitionGridIsVisible] = useState(true)
  const [transitionGridSizes, setTransitionGridSizes] = useState({
    gridTemplateColumns: "33vw 34vw 33vw",
    gridTemplateRows: "33svh 34svh 33svh",
  })
  const [gridIsClosed, setGridIsClosed] = useState(false)

  const [aboutIsVisible, setAboutIsVisible] = useState(false)
  const [loadingCardIsVisible, setLoadingCardIsVisible] = useState(true)
  const [animationIsPaused, setAnimationIsPaused] = useState(false)
  const [isMobileScreen, setIsMobileScreen] = useState(false)
  const [vogueLinkIsVisible, setVogueLinkIsVisible] = useState(false)

  const leftGutterRef = useRef<HTMLDivElement | null>(null)
  const topGutterRef = useRef<HTMLDivElement | null>(null)
  const rightGutterRef = useRef<HTMLDivElement | null>(null)
  const bottomGutterRef = useRef<HTMLDivElement | null>(null)
  const middleCellRef = useRef<HTMLDivElement | null>(null)

  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

  useEffect(() => {
    if (windowSize[0] < 450) {
      console.log("1")

      setIsMobileScreen(true)
    }

    if (windowSize[0] >= 450) {
      console.log("2")

      setIsMobileScreen(false)
    }

    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight])
      if (windowSize[0] < 450) {
        console.log("3")

        setIsMobileScreen(true)
      }

      if (windowSize[0] >= 450) {
        console.log("4")
        setIsMobileScreen(false)
      }
    }

    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  useEffect(() => {
    fetchVogueData()
  }, [])

  async function handleClick(event: MouseEvent) {
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

  function handleInfoClick(event: MouseEvent) {
    event.stopPropagation()
    if (isMobileScreen) {
      console.log("sooo are we getting here")

      setVogueLinkIsVisible(true)
    }
  }

  function handleAboutClick(event: MouseEvent) {
    event.stopPropagation()
    if (isMobileScreen) {
      aboutIsVisible ? setAboutIsVisible(false) : setAboutIsVisible(true)
    }
  }

  function handleVogueLinkClick(event: MouseEvent) {
    event.stopPropagation()
  }

  function startTransition() {
    setTransitionGridIsVisible(true)
    closeGrid()
  }

  function closeGrid() {
    setTimeout(() => {
      setTransitionGridSizes({
        gridTemplateColumns: "50vw 0px 400vw",
        gridTemplateRows: "50svh 0px 400vh",
      })
      setTimeout(() => {
        setGridIsClosed(true)
        fetchVogueData()
        startLoading()
      }, 2000)
    })
  }

  function startLoading() {
    setLoadingCardIsVisible(true)
    openGridToLoadingCard()
    if (vogueLinkIsVisible) {
      setVogueLinkIsVisible(false)
    }
  }

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
          gridTemplateColumns: `33vw 34vw 400vw`,
          gridTemplateRows: `33svh 34svh 400svh`,
        }
      }
      return prevGridStage
    })
    setTimeout(() => {
      setAnimationIsPaused(true)
    }, 2000)
  }

  function imageLoaded() {
    setAnimationIsPaused(false)
    closeLoadingCard()
    setTimeout(() => {
      openGridToMainView()
    }, 2000)
  }

  function closeLoadingCard() {
    setTransitionGridSizes({
      gridTemplateColumns: "50vw 0px 400vw",
      gridTemplateRows: "50svh 0px 400vh",
    })
    setTimeout(() => {
      setGridIsClosed(true)
    }, 2000)
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
    }, 2100)
  }

  return (
    <div className="main-body">
      <div
        className={`transition-grid ${transitionGridIsVisible ? "visible" : "invisible"} ${
          animationIsPaused ? "no-transition" : ""
        }`}
        style={transitionGridSizes}
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
      <div className="container" onClick={handleClick}>
        <div className="left-gutter" ref={leftGutterRef}></div>
        <div className="top-gutter" ref={topGutterRef}></div>
        <div className="middle-cell" ref={middleCellRef}>
          <div className={`info-pane ${vogueLinkIsVisible ? "mobile-click" : ""}`}>
            {imageAndDetails.image ? (
              <div className="card-container">
                <button className="info-card" onClick={handleInfoClick}>
                  <a
                    className="info-card-link"
                    href={imageAndDetails.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ul className="info">
                      <li>Designer: {imageAndDetails.designer}</li>
                      <li>Season: {imageAndDetails.season}</li>
                      <li>City: {imageAndDetails.city}</li>
                      <li className="smaller">Photo: {imageAndDetails.image.credit}</li>
                    </ul>
                    <p className="vogue-link">view the show on vogue.com &gt;</p>
                  </a>
                </button>
                <a
                  href={imageAndDetails.externalLink}
                  className={`vogue-link-mobile-container ${vogueLinkIsVisible ? "is-visible" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleVogueLinkClick}
                >
                  <button className="vogue-link-mobile">view the show on vogue.com &gt;</button>
                </a>
              </div>
            ) : (
              <></>
            )}
          </div>
          {imageAndDetails.image ? (
            <img src={imageAndDetails.image.url} alt={imageAndDetails?.name} onLoad={imageLoaded} />
          ) : (
            // TODO handle error situation here
            <div className="placeholder"></div>
          )}
          <div className={`about-text ${aboutIsVisible ? "visible-about-text" : ""}`} onClick={handleAboutClick}>
            <p>Welcome</p>
            <p> I am a runway-look random image generator.</p>
            <p>
              Click anywhere on the screen to retrieve a completely new look from vogue.com. The archive is vast, so it
              may take a moment or two for a new image to be decided upon during each journey.
            </p>
            <p>I am not sure how long it will take Vogue to notice I exist - please enjoy me while you can.</p>
          </div>
        </div>
        <div
          className="about-cell"
          onClick={handleAboutClick}
          onMouseEnter={() => {
            setAboutIsVisible(true)
          }}
          onMouseLeave={() => {
            setAboutIsVisible(false)
          }}
        >
          ?
        </div>
        <div className="right-gutter" ref={rightGutterRef}></div>
        <div className="bottom-gutter" ref={bottomGutterRef}></div>
      </div>
    </div>
  )
}

export default App
