interface Props {
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  className: string;
}

export function Canvas({ width, height, canvasRef, className }: Props) {
  return (
    <canvas
      className={className}
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}
