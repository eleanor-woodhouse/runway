import React, { MouseEvent, useEffect, useRef } from "react"
import { useState } from "react"
import "../styles/App.scss"
import { getRandomImageWithShowDetails } from "../runway"
import { VogueShowWithSingleImage } from "../types"

function App() {
  const [imageAndDetails, setImageAndDetails] = useState({} as VogueShowWithSingleImage)

  const [transitionStage, setTransitionStage] = useState("loading")
  const [transitionEnded, setTransitionEnded] = useState(0)

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

  useEffect(() => {
    if (window.innerWidth < 450) {
      setIsMobileScreen(true)
    }
    fetchVogueData()
  }, [])

  function handleClick(event: MouseEvent) {
    fetchVogueData()
    setTransitionGridIsVisible(true)
    setTimeout(() => {
      closeGrid()
    })
  }

  function handleInfoClick(event: MouseEvent) {
    event.stopPropagation()
    if (isMobileScreen) {
      setVogueLinkIsVisible(true)
    }
  }

  function handleAboutClick(event: MouseEvent) {
    event.stopPropagation()
    if (isMobileScreen) {
      aboutIsVisible ? setAboutIsVisible(false) : setAboutIsVisible(true)
    }
    setVogueLinkIsVisible(false)
  }

  function handleVogueLinkClick(event: MouseEvent) {
    event.stopPropagation()
  }

  function handleTransitionEnd() {
    const newCount = transitionEnded + 1
    setTransitionEnded(newCount)
  }

  useEffect(() => {
    if (transitionStage === "loading closing") {
      setTransitionStage("loading closed")
      setGridIsClosed(true)
    } else if (transitionStage === "main closing") {
      setTransitionStage("main closed")
      setGridIsClosed(true)
    } else if (transitionStage === "main") {
      setTransitionGridIsVisible(false)
    }
  }, [transitionEnded])

  useEffect(() => {
    if (transitionStage === "loading closed") {
      setTransitionStage("main opening")
      openGridToMainView()
    } else if (transitionStage === "main closed") {
      setTransitionStage("loading opening")
      openGridToLoadingCard()
    }
  }, [gridIsClosed])

  function closeGrid() {
    setTransitionStage("main closing")
    setTransitionGridSizes({
      gridTemplateColumns: "50vw 0px 400vw",
      gridTemplateRows: "50svh 0px 400svh",
    })
  }

  async function fetchVogueData() {
    const result = await getRandomImageWithShowDetails()
    if (result) {
      if (transitionStage === "main" || "main closing") {
        setTimeout(() => {
          setImageAndDetails(result)
        }, 2500)
      } else if (transitionStage === "main closed") {
        setTimeout(() => {
          setImageAndDetails(result)
        }, 1000)
      } else if (transitionStage === "loading opening") {
        setTimeout(() => {
          setImageAndDetails(result)
        }, 500)
      } else {
        setImageAndDetails(result)
      }
    } else {
      setAnimationIsPaused(false)
      closeLoadingCard() // will eventually open to an error message informing the user to try again
    }
  }

  function openGridToLoadingCard() {
    if (vogueLinkIsVisible) {
      setVogueLinkIsVisible(false)
    }
    setLoadingCardIsVisible(true)
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
      setTransitionStage("loading")
    }, 2000)
  }

  function imageLoaded() {
    setAnimationIsPaused(false)
    closeLoadingCard()
  }

  function closeLoadingCard() {
    setTransitionStage("loading closing")
    setTransitionGridSizes({
      gridTemplateColumns: "50vw 0px 400vw",
      gridTemplateRows: "50svh 0px 400svh",
    })
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
    setTransitionStage("main")
    setTimeout(() => {
      setTransitionGridIsVisible(false)
    }, 2000)
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
      <div className="container" onClick={handleClick}>
        <div className="left-gutter" ref={leftGutterRef}></div>
        <div className="top-gutter" ref={topGutterRef}></div>
        <div className="middle-cell" ref={middleCellRef}>
          {imageAndDetails.image ? (
            <>
              <div className={`info-pane ${vogueLinkIsVisible ? "mobile-click" : ""}`}>
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
              </div>
              <img src={imageAndDetails.image.url} alt={imageAndDetails?.name} onLoad={imageLoaded} />
            </>
          ) : (
            <div className="error-message">something went wrong, please try again</div>
          )}
          <div className={`about-text ${aboutIsVisible ? "visible-about-text" : ""}`} onClick={handleAboutClick}>
            <p>Welcome</p>
            <p> I am a runway-look random image generator</p>
            <p>
              Click anywhere on the screen to retrieve a completely new look from vogue.com
              <br></br>
              The archive is vast, so it may take a moment or two for a new image to be decided upon during each journey
            </p>
            <p>I am not sure how long it will take Vogue to notice I exist - please enjoy me while you can</p>
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
