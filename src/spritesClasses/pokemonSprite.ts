import { Sprite } from '../types'
import { imagePathsNew, CANVAS_WIDTH } from '../utils/constants'

const IMAGE_PATHS = imagePathsNew

/**
 * Clase que se encarga de crear un sprite de un pokemon
 */
export class PokemonSprite implements Sprite {
  public position: { x: number, y: number }
  public sprites: { front: string, back: string }
  public image: HTMLImageElement
  public width: number
  public height: number
  public isEnemy: boolean
  public opacity: number
  private initialPos: { x: number, y: number }
  /**
   * Constructor de la clase PokemonSprite
   * @param id Id del pokemon
   * @param isEnemy Indica si el pokemon es enemigo o no
   */
  constructor (id: number, isEnemy: boolean) {
    this.initialPos = isEnemy ? { x: CANVAS_WIDTH, y: -20 } : { x: -400, y: 110 }
    this.position = this.initialPos
    this.sprites = { front: `${IMAGE_PATHS.pokemonFrontImgPath}${id}.png`, back: `${IMAGE_PATHS.pokemonBackImgPath}${id}.png` }
    this.width = 0
    this.height = 0
    this.isEnemy = isEnemy
    this.image = new Image()
    this.image.src = isEnemy ? this.sprites.front : this.sprites.back
    this.image.onload = () => {
      this.width = this.image.width
      this.height = this.image.height
    }
    this.opacity = 1
  }

  /**
   * Metodo que se encarga de dibujar el sprite
   * @param ctx Contexto del canvas
   */
  draw (ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(this.image, this.position.x, this.position.y)
    ctx.restore()
  }

  // reset (): void {
  //   this.position = this.initialPos
  // }
}
