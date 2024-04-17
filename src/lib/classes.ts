const DEBUG_MODE = process.env.DEBUG_MODE as string;
const TILESIZE = parseInt(process.env.TILESIZE as string);

/**
 * Clase que se encarga de crear un rectangulo que representa un limite
 */
export class Boundary {
  initialPos: { x: number; y: number };
  position: { x: number; y: number };
  width: number;
  height: number;
  constructor(position: { x: number; y: number }) {
    this.initialPos = position;
    this.position = position;
    this.width = TILESIZE;
    this.height = TILESIZE;
  }

  /**
   * Metodo que se encarga de dibujar el rectangulo
   * @param ctx Contexto del canvas
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(255, 0, 0, .3)";
    if (DEBUG_MODE)
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

/**
 * Clase que se encarga de crear objetos que se pueden mover
 */
export class Movable {
  position: { x: number; y: number };
  image: HTMLImageElement;
  constructor(position: { x: number; y: number }, image: HTMLImageElement) {
    this.position = position;
    this.image = image;
  }

  /**
   * Metodo que se encarga de dibujar el objeto
   * @param ctx Contexto del canvas
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
