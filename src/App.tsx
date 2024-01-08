import { Canvas } from "./components/Canvas"
import { Interface } from "./components/Interface"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/constants'
import { useEffect, useRef, useState } from 'react'
import { Game } from './logic/game'
import { Setters } from "./types"


function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interfaceVisible, setInterfaceVisible] = useState(0)
  const [interfaceState, setInterfaceState] = useState(0)

  const [game, setGame] = useState<Game>()

  const setters: Setters = {
    interfaceVisible: setInterfaceVisible,
    interfaceState: setInterfaceState
  }

  useEffect(() => { // Instancia el juego // Es necesario en un useEffect?
    const gameObject = new Game(
      canvasRef,
      interfaceState,
      setters
    )
    gameObject.start()

    setGame(gameObject)
  }, [])

  useEffect(() => { // Actualiza el state del juego
    if (!game) return
    game.interfaceState = interfaceState
  }, [interfaceState])

  return (
    <>
      <Canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} canvasRef={canvasRef} className="game-canvas" />

      {
        interfaceVisible && game
          ? <Interface game={game} actualState={interfaceState} />
          : null
      }

      <div className='black-screen' style={{backgroundColor: 'black', display: 'none', opacity: 0, width: 1024, height: 576, position: 'absolute', top: 0}}></div>

      <p style={{position: 'absolute'}}>InterfaceVisible: {interfaceVisible}<br/> interfaceState: {interfaceState}</p>
    </>
    )
}

export default App
