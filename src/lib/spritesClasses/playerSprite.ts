import { Sprite } from "../../types";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG_MODE } from "../config";
import { imagePathsNew } from "../constants";

const IMAGE_PATHS = imagePathsNew;

/**
 * Clase que se encarga de crear un sprite de un jugador
 */
export class PlayerSprite implements Sprite {
  public position: { x: number; y: number };
  public imagePaths: { up: string; left: string; down: string; right: string };
  public images = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image(),
  };
  public image: HTMLImageElement = new Image();
  public width: number;
  public height: number;
  public frames: { max: number; hold: number; val: number; elapsed: number };
  public animate: boolean;
  MAX_FRAMES = 4;
  HOLD_FRAMES = 10;
  SPEED = 5;
  /**
   * Constructor de la clase PlayerSprite
   */
  constructor() {
    this.position = { x: 0, y: 0 };
    this.imagePaths = {
      up: IMAGE_PATHS.playerUpImgPath,
      left: IMAGE_PATHS.playerLeftImgPath,
      down: IMAGE_PATHS.playerDownImgPath,
      right: IMAGE_PATHS.playerRightImgPath,
    };
    this.width = 0;
    this.height = 0;
    this.frames = {
      max: this.MAX_FRAMES,
      hold: this.HOLD_FRAMES,
      val: 0,
      elapsed: 0,
    };
    this.animate = false;
    this.images.up.src = this.imagePaths.up;
    this.images.left.src = this.imagePaths.left;
    this.images.right.src = this.imagePaths.right;
    this.images.down.src = this.imagePaths.down;

    this.images.down.onload = () => {
      this.image = this.images.down;
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      this.position = {
        x: CANVAS_WIDTH / 2 - this.image.width / 4 / 2,
        y: CANVAS_HEIGHT / 2 - this.image.height / 2,
      };
    };
  }

  /**
   * Funcion que se encarga de dibujar el sprite
   * @param ctx Contexto del canvas
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 3;
    if (DEBUG_MODE)
      ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frames.val * this.width, // Sx
      0, // Sy
      this.width, // Sw
      this.height, // Sh
      this.position.x, // Dx
      this.position.y, // Dy
      this.width, // Dw
      this.height // Dh
    );
    if (!this.animate) {
      this.frames = {
        max: this.MAX_FRAMES,
        hold: this.HOLD_FRAMES,
        val: 0,
        elapsed: 0,
      };
      return;
    }
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}
