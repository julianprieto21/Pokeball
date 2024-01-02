import { Canvas } from "./components/Canvas"
import { Interface } from "./components/Interface"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/constants'
import { useEffect, useRef, useState } from 'react'
import { Game } from './logic/game'


function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interfaceVisible, setInterfaceVisible] = useState(0)
  const [interfaceState, setInterfaceState] = useState(0)

  const [game, setGame] = useState<Game>()

  const setters = {
    interfaceVisible: setInterfaceVisible,
    interfaceState: setInterfaceState
  }

  useEffect(() => {
    const gameObject = new Game(
      canvasRef,
      setters
    )
    gameObject.start()

    setGame(gameObject)
  }, [])

  return (
    <>
      <Canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} canvasRef={canvasRef} />

      {
        interfaceVisible && game
          ? <Interface game={game} actualState={interfaceState} />
          : null
      }

      <div className='black-screen' style={{backgroundColor: 'black', display: 'none', opacity: 0, width: 1024, height: 576, position: 'absolute', top: 0}}></div>

      {/* <p style={{position: 'absolute'}}>InterfaceVisible: {interfaceVisible}<br/>InterfaceState: {interfaceState}</p> */}
    </>
    )
}

export default App
