import './Canvas.css'

export function Canvas( { width, height, canvasRef }: {width: number; height: number, canvasRef: React.RefObject<HTMLCanvasElement> } ) {

  return (
    <canvas 
      className="game-canvas"
      id='main'
      width={width}
      height={height}
      ref={canvasRef}           
    />
  )
}