import { Sprite } from '../types'

export class PokemonSprite implements Sprite {
  public position: { x: number, y: number }
  public sprites: { front: string, back: string }
  public imageDir: string
  public image: HTMLImageElement
  public width: number
  public height: number
  public isEnemy: boolean
  public opacity: number

  constructor (id: number, isEnemy: boolean) {
    this.position = isEnemy ? { x: 580, y: -20 } : { x: 100, y: 110 }
    this.sprites = { front: `./assets/sprites/pokemon/front/${id}.png`, back: `./assets/sprites/pokemon/back/${id}.png` }
    this.imageDir = isEnemy ? this.sprites.front : this.sprites.back
    this.width = 0
    this.height = 0
    this.isEnemy = isEnemy
    this.image = new Image()
    this.image.src = this.imageDir
    this.image.onload = () => {
      this.width = this.image.width
      this.height = this.image.height
    }
    this.opacity = 1
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(this.image, this.position.x, this.position.y)
    ctx.restore()
  }
}
