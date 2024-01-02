import { Sprite } from '../types'
import { CANVAS_HEIGHT, CANVAS_WIDTH, imagePaths } from '../utils/constants'

/**
 * Clase que se encarga de crear un sprite de un jugador
 */
export class PlayerSprite implements Sprite {
  public position: { x: number, y: number }
  public imagePaths: { up: string, left: string, down: string, right: string }
  public image: HTMLImageElement
  public width: number
  public height: number
  public frames: { max: number, hold: number, val: number, elapsed: number }
  public animate: boolean
  MAX_FRAMES = 4
  HOLD_FRAMES = 10
  SPEED = 5
  /**
   * Constructor de la clase PlayerSprite
   */
  constructor () {
    this.position = { x: 0, y: 0 }
    this.imagePaths = {
      up: imagePaths.playerUpImgPath,
      left: imagePaths.playerLeftImgPath,
      down: imagePaths.playerDownImgPath,
      right: imagePaths.playerRightImgPath
    }
    this.width = 0
    this.height = 0
    this.frames = { max: this.MAX_FRAMES, hold: this.HOLD_FRAMES, val: 0, elapsed: 0 }
    this.animate = false
    this.image = new Image()
    this.image.src = this.imagePaths.down
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      this.position = { x: CANVAS_WIDTH / 2 - this.image.width / 4 / 2, y: CANVAS_HEIGHT / 2 - this.image.height / 2 }
    }
  }

  /**
   * Funcion que se encarga de dibujar el sprite
   * @param ctx Contexto del canvas
   */
  draw (ctx: CanvasRenderingContext2D): void {
    // console.log(this.width, this.height)
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
    )
    if (!this.animate) {
      this.frames = { max: this.MAX_FRAMES, hold: this.HOLD_FRAMES, val: 0, elapsed: 0 }
      return
    }
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}
