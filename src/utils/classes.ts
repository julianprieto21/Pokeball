import { TILESIZE } from './constants'
import { Pokemon } from '../logic/pokemon'
import { getPokemonData } from '../api/getData'

/**
 * Clase que se encarga de crear un rectangulo que representa un limite
 */
export class Boundary {
  position: { x: number, y: number }
  width: number
  height: number
  constructor (position: { x: number, y: number }) {
    this.position = position
    this.width = TILESIZE
    this.height = TILESIZE
  }

  /**
   * Metodo que se encarga de dibujar el rectangulo
   * @param ctx Contexto del canvas
   */
  draw (ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 0, 0, .0)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

/**
 * Clase que se encarga de crear objetos que se pueden mover
 */
export class Movable {
  position: { x: number, y: number }
  image: HTMLImageElement
  constructor (position: { x: number, y: number }, image: HTMLImageElement) {
    this.position = position
    this.image = image
  }

  /**
   * Metodo que se encarga de dibujar el objeto
   * @param ctx Contexto del canvas
   */
  draw (ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x, this.position.y)
  }
}

/**
 * Clase que se encarga del manejo de los equipos del player
 */
export class Team {
  public pokemon: Pokemon[]
  public primary: Pokemon
  constructor (teamNames: Array<string | number>) {
    this.pokemon = []
    this.primary = this.pokemon[0]
    void this.setTeam(teamNames)
  }

  /**
   * Metodo que se encarga de crear el equipo del player
   * @param names Nombres de los pokemon
   */
  public async setTeam (names: Array<string | number>): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      const data = await getPokemonData(names[i])
      const pokemon = new Pokemon(data)
      this.pokemon.push(pokemon)
    }
    this.primary = this.pokemon[0]
  }

  /**
   * Metodo que se encarga de cambiar el pokemon principal
   * @param pokemon Pokemon a cambiar
   */
  public switchFirstPokemon (pokemon: Pokemon): void {
    this.primary = pokemon
  }
}