import { Move } from "./move";
import { Pokemon } from "./pokemon";
import _ from 'lodash'
import { criticRate, effectChart, typesMap, dialogues } from "../utils/constants";
import { Battle } from "./battle";
import { format } from "../utils/functions";

/**
 * Clase que se encarga de la logica de la batalla
 */
export class Engine {
  battle: Battle
  ally: Pokemon
  enemy: Pokemon
  /**
   * Constructor de la clase Engine
   * @param battle Instancia de la clase Battle
   */
  constructor(battle: Battle) {
    this.battle = battle
    this.ally = battle.ally
    this.enemy = battle.enemy
  }

  /**
   * Funcion que se encarga de jugar un turno de la batalla
   * @param allyMove Movimiento del pokemon aliado
   * @param enemyMove Movimiento del pokemon enemigo
   */
  playTurn(allyMove: Move, enemyMove: Move) {
    const isAllyTurn = this.isAllyTurn(allyMove, enemyMove)
    if (isAllyTurn) {
      this.battle.game.interfaceManager.actionQueue.push(() => { this.makeMove(allyMove, this.ally, this.enemy) })
      this.battle.game.interfaceManager.actionQueue.push(() => { 
        if (this.enemy.isAlive()) { 
          this.makeMove(enemyMove, this.enemy, this.ally) 
        }
        else {
          this.faint(this.enemy)
          this.battle.game.interfaceManager.actionQueue.push(() => { this.winExperience(this.ally, this.enemy) })
          this.battle.game.interfaceManager.actionQueue.push(() => { this.retreat(this.ally) })
        }
      })
      this.ally.isAlive() 
      ? null 
      :  this.battle.game.interfaceManager.actionQueue.push(() => { this.faint(this.ally) })

    } else {
      this.battle.game.interfaceManager.actionQueue.push(() => { this.makeMove(enemyMove, this.enemy, this.ally) })
      this.battle.game.interfaceManager.actionQueue.push(() => { 
        if (this.ally.isAlive()) { 
          this.makeMove(allyMove, this.ally, this.enemy) 
        }
        else {
          this.faint(this.ally)
          this.battle.game.interfaceManager.actionQueue.push(() => { this.winExperience(this.enemy, this.ally) })
          this.battle.game.interfaceManager.actionQueue.push(() => { this,this.retreat(this.enemy) })
        }
      })
      this.enemy.isAlive() 
      ? null : 
      this.battle.game.interfaceManager.actionQueue.push(() => { this.faint(this.enemy) })

    }
  }

  /**
   * Funcion que se encarga de determinar si es el turno del pokemon aliado o no
   * @param allyMove Movimiento del pokemon aliado
   * @param enemyMove Movimiento del pokemon enemigo
   * @returns Booleano que indica si es el turno del pokemon aliado
   */
  isAllyTurn(allyMove: Move, enemyMove: Move): boolean {
    if (allyMove.priority > enemyMove.priority) return true
    else {
      if (allyMove.priority < enemyMove.priority) return false
      else {
        return this.ally.getStats().speed > this.enemy.getStats().speed
      }
    }
  }

  /**
   * Funcion que se encarga de realizar un movimiento
   * @param move Movimiento a realizar
   * @param user Pokemon que realiza el movimiento
   * @param target Pokemon que recibe el movimiento
   * @returns Retorna nada si el movimiento es de estado o es errado
   */
  makeMove(move: Move, user: Pokemon, target: Pokemon) {
    /**
     * @returns Booleano que indica si el movimiento es errado o no
     */
    const isHit = (): boolean => {
      if (move.accuracy !== null) {
        const acc = (move.accuracy / 100) * (move.accuracy / target.evasion)
        return _.random(0, 1, true) < acc
      } else return true
    }
    // Realizar movimiento
    if (!isHit() || move.damageClass === 'status') return

    const damage = this.getDamage(move, user, target)
    this.animateMove(user, target, move, damage)
    move.currentPP--
    
    this.battle.game.interfaceManager.addDialogue(format(dialogues.attackDialogue, [user.name, move.name]))
    console.log(user.name + ' used ' + move.name + ' and dealt ' + damage + ' damage to ' + target.name + ' (' + target.currentHp + '/' + target.getStats().hp + ')')
  }

  /**
   * Funcion que se encarga de calcular el daño de un movimiento
   * @param move Movimiento a realizar
   * @param user Pokemon que realiza el movimiento
   * @param target Pokemon que recibe el movimiento
   * @returns Total de daño a realizar
   */
  getDamage(move: Move, user: Pokemon, target: Pokemon) {
    /**
     * @returns Booleano que indica si el movimiento es critico o no
     */
    const isCritical = (): boolean => {
      return _.random(0, 1, true) < criticRate[move.critRate]
    }
    /**
     * @returns Efectividad y bonificacion del movimiento
     */
    const getBonusEffectiveness = (): { e: number, b: number } => {
      const type = move.type
      const userTypes = user.types
      const targetTypes = target.types
      const e = effectChart[typesMap[type].id][typesMap[targetTypes.primary].id]
      const b = (type === userTypes.primary || type === userTypes.second) ? 1.5 : 1
      return { e, b }
    }
    const isPhysical = move.damageClass === 'physical'
    // Calculo de daño
    const a = isPhysical ? user.getStats().attack : user.getStats().spAttack
    const d = isPhysical ? target.getStats().defense : target.getStats().spDefense
    const p = move.power ?? 0
    const n = user.level
    const v = _.random(85, 100)
    const {e, b} = getBonusEffectiveness()

    const damage = 0.01 * b * e * v * ((((0.2 * n + 1) * a * p) / (25 * d)) + 2)
    const critic = isCritical() ? 1.5 : 1
    return _.floor(damage * critic)
  }

  /**
   * Funcion que se encarga de calcular la experiencia que gana un pokemon al ganar una batalla
   * @param looser Pokemon que perdió
   * @returns Cantidad de experiencia que gana el ganador
   */
  getExperience (looser: Pokemon): number {
    const e = looser.baseExperience
    const l = looser.level
    const c = 1
    return _.floor((e * l * c) / 7)
  }

  /**
   * Funcion que se encarga de debilitar a un pokemon
   * @param pokemon Pokemon que se debilitó
   */
  faint(pokemon: Pokemon) {
    this.battle.game.animationManager.animateFaint(pokemon.mainSprite)
    this.battle.game.interfaceManager.addDialogue(format(dialogues.faintDialogue, [pokemon.name]))
  }

  /**
   * Funcion que se encarga de realizar/animar el movimiento de un pokemon
   * @param user Pokemon que realiza el movimiento
   * @param target Pokemon que recibe el movimiento
   * @param move Movimiento a realizar
   * @param damage Daño a realizar
   */
  animateMove(user: Pokemon, target: Pokemon, move: Move, damage: number) {
    const xMove = user.isEnemy ? -20 : 20
    const moveClass = move.damageClass === 'physical' ? 'physical' : 'special' // Esto capaz se puede poner diferente. Por ahora solo se anima los fisicos y especiales
    if (moveClass === "physical" || moveClass === "special") {
      target.receiveDamage(damage)
      const healthPercentage = target.currentHp / target.getStats().hp * 100
      this.battle.game.animationManager.animateMove(user.mainSprite, target.mainSprite, xMove, healthPercentage)
    }
  }

  /**
   * Funcion que se encarga de otorgar/animar la experiencia que gana un pokemon al ganar una batalla
   * @param winner Pokemon ganador
   * @param looser Pokemon perdedor
   */
  winExperience(winner: Pokemon, looser: Pokemon) {
    const winnerXPLeft = winner.getNextLevelXp()
    const xp = this.getExperience(looser)
    const XPpercentage = (winner.currentXp + xp) * 100 / winnerXPLeft

    winner.receiveExperience(xp)
    
    if (!winner.isEnemy) this.battle.game.animationManager.animateExperience(XPpercentage)
    this.battle.game.interfaceManager.addDialogue(format(dialogues.winExperienceDialogue, [winner.name, xp.toString()]))
  }

  /**
   * Funcion que se encarga de retirar a un pokemon
   * @param pokemon Pokemon que se retira
   */
  retreat(pokemon: Pokemon) {
    this.battle.game.interfaceManager.addDialogue('[TEXTO DE RETIRADA]') // TODO: Agregar texto de retirada
    this.battle.game.animationManager.retreatAnimation(pokemon.mainSprite)
  }
}
