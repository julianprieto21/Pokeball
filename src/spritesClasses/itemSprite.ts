import { Sprite } from '../types'


/**
 * Clase que se encarga de crear un sprite de un item
 */
export class ItemSprite implements Sprite {
  public position: { x: number, y: number }
  public name: string
  public imageDir: string
  public image: HTMLImageElement
  public width: number
  public height: number
  /**
   * Constructor de la clase ItemSprite
   * @param position Posicion del sprite
   * @param name Nombre del item
   */
  constructor (position: { x: number, y: number }, name: string) {
    this.position = position
    this.name = name
    this.imageDir = `./assets/sprites/items/${name.replace('-', '')}.png`
    this.width = 0
    this.height = 0
    this.image = new Image()
    this.image.src = this.imageDir
    this.image.onload = () => {
      this.width = this.image.width
      this.height = this.image.height
    }
  }

  /**
   * Metodo que se encarga de dibujar el sprite
   * @param ctx Contexto del canvas
   */
  draw (ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x, this.position.y)
  }
}
