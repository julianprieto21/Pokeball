import { Canvas } from "./components/Canvas";
import { Interface } from "./components/Interface";
import { useEffect, useRef, useState } from "react";
import { Game } from "./lib/logic/game";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG_MODE } from "./lib/config";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [interfaceVisible, setInterfaceVisible] = useState(0);
  const [interfaceState, setInterfaceState] = useState(0);
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    if (!canvasRef.current || game) return;
    // Instancia el juego // Es necesario en un useEffect?
    const gameObject = new Game(canvasRef, interfaceState, {
      interfaceVisible: setInterfaceVisible,
      interfaceState: setInterfaceState,
    });
    gameObject.start();
    setGame(gameObject);
  }, [game, interfaceState]);

  useEffect(() => {
    // Actualiza el state del juego
    if (!game) return;
    game.interfaceState = interfaceState;
  }, [interfaceState]);

  return (
    <main className="relative size-full">
      <Canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        canvasRef={canvasRef}
        className="game-canvas w-screen sm:h-screen sm:w-auto lg:h-auto"
      />
      {interfaceVisible && game ? (
        <Interface game={game} actualState={interfaceState} />
      ) : null}

      <div className="black-screen bg-black hidden opacity-0 size-full absolute top-0"></div>

      {DEBUG_MODE ? (
        <div className="absolute bottom-0 text-xs font-thin p-3 flex flex-row sm:flex-col gap-2">
          <p>InterfaceVisible: {interfaceVisible}</p>
          <p>interfaceState: {interfaceState}</p>
        </div>
      ) : null}
    </main>
  );
}

export default App;
