import './styles/Canvas.css'

export function Canvas( 
  { width, height, canvasRef, className }: 
  {width: number; height: number, canvasRef: React.RefObject<HTMLCanvasElement>, className: string } 
  ) {

  return (
    <canvas 
      className={className}
      width={width}
      height={height}
      ref={canvasRef}         
      style={{ width: width, height: height }}  
    />
  )
}