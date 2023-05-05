// Path: src\utils\dataClasses\move.ts
// Purpose: To create a class that will hold the data for a move

import { MoveSprite } from '../drawClasses/moveSprite'
import { MoveData } from '../types'

export class Move {
  public identifier: number // Numero para determinar orden en la lista de movimientos
  public id: number
  public name: string
  public type: string

  public mainSprite: MoveSprite

  public power: number | null
  public accuracy: number | null
  public pp: number
  public effect: string
  public effectChance: number | null
  public priority: number
  public damageClass: string
  public target: string
  public critRate: number
  public priotity: number

  public currentPp: number

  constructor (data: MoveData, identifier: number) {
    this.identifier = identifier
    this.id = data.id
    this.name = data.name.toUpperCase()
    this.type = data.type.name

    this.mainSprite = new MoveSprite({ x: 0, y: 0 }, this.name)

    this.power = data.power
    this.accuracy = data.accuracy
    this.pp = data.pp
    this.effect = data.effect_entries[0].short_effect
    this.effectChance = data.effect_chance
    this.priority = data.priority
    this.damageClass = data.damage_class.name
    this.target = data.target.name
    this.critRate = data.meta.crit_rate
    this.priotity = data.priority

    this.currentPp = this.pp
  }
}
