import { Sprite } from "../../types";

/**
 * Clase que se encarga de crear un sprite de un movimiento
 */
export class MoveSprite implements Sprite {
  public position: { x: number; y: number };
  public image: HTMLImageElement;
  public width: number;
  public height: number;
  public frames: { max: number; hold: number; val: number; elapsed: number };
  public animate: boolean;
  MAX_FRAMES = 4;
  HOLD_FRAMES = 5;
  name: string;
  /**
   * Constructor de la clase MoveSprite
   * @param position Posicion del sprite
   * @param moveName Nombre del movimiento
   */
  constructor(position: { x: number; y: number }, moveName: string) {
    this.name = moveName;
    this.position = position;
    this.width = 0;
    this.height = 0;
    this.frames = {
      max: this.MAX_FRAMES,
      hold: this.HOLD_FRAMES,
      val: 0,
      elapsed: 0,
    };
    this.animate = true;
    this.image = new Image();
    this.image.src = ""; // `./assets/sprites/moves/${moveName}.png`;
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };
  }

  /**
   * Metodo que se encarga de dibujar el sprite
   * @param ctx Contexto del canvas
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
