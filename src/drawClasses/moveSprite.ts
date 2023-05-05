import { Sprite } from '../types'

export class MoveSprite implements Sprite {
  public position: { x: number, y: number }
  public imageDir: string
  public image: HTMLImageElement
  public width: number
  public height: number
  public frames: { max: number, hold: number, val: number, elapsed: number }
  public animate: boolean
  MAX_FRAMES = 4
  HOLD_FRAMES = 5
  name: string

  constructor (position: { x: number, y: number }, moveName: string) {
    this.name = moveName
    this.position = position
    this.imageDir = ''// `./assets/sprites/moves/${moveName}.png`;
    this.width = 0
    this.height = 0
    this.frames = { max: this.MAX_FRAMES, hold: this.HOLD_FRAMES, val: 0, elapsed: 0 }
    this.animate = true
    this.image = new Image()
    this.image.src = this.imageDir
    this.image.onload = () => {
      this.width = this.image.width
      this.height = this.image.height
    }
  }
}
