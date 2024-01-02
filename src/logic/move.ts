import { MoveSprite } from '../spritesClasses/moveSprite'
import { MoveData } from '../types'

/**
 * Clase que se encarga de guardar la informacion de un movimiento
 */
export class Move {
  public id: number
  public name: string
  public type: string

  public mainSprite: MoveSprite

  public power: number | null
  public accuracy: number | null
  public maxPP: number
  public effect: string
  public effectChance: number | null
  public priority: number
  public damageClass: string
  public target: string
  public critRate: number

  public currentPP: number
  /**
   * Constructor de la clase Move
   * @param data Datos del movimiento
   */
  constructor (data: MoveData) {
    this.id = data.id
    this.name = data.name.toUpperCase()
    this.type = data.type.name

    this.mainSprite = new MoveSprite({ x: 0, y: 0 }, this.name)

    this.power = data.power
    this.accuracy = data.accuracy
    this.maxPP = data.pp
    this.effect = data.effect_entries[0].short_effect
    this.effectChance = data.effect_chance
    this.priority = data.priority
    this.damageClass = data.damage_class.name
    this.target = data.target.name
    this.critRate = data.meta.crit_rate

    this.currentPP = this.maxPP
  }
}
