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
  attemptsToRun: number
  /**
   * Constructor de la clase Engine
   * @param battle Instancia de la clase Battle
   */
  constructor(battle: Battle) {
    this.battle = battle
    this.ally = battle.ally
    this.enemy = battle.enemy
    this.attemptsToRun = 0
  }

  /**
   * Funcion que se encarga de jugar un turno de la batalla
   * @param allyMove Movimiento del pokemon aliado
   * @param enemyMove Movimiento del pokemon enemigo
   */
  playTurn(allyMove: Move, enemyMove: Move) {
    const isAllyTurn = this.isAllyTurn(allyMove, enemyMove)
    let first: Pokemon, second: Pokemon, first_move: Move, second_move: Move
    if (isAllyTurn) {
      first = this.ally
      first_move = allyMove
      second = this.enemy
      second_move = enemyMove
    } else {
      first = this.enemy
      first_move = enemyMove
      second = this.ally
      second_move = allyMove
    }

    this.battle.game.interfaceManager.actionQueue.push(() => { this.makeMove(first_move, first, second) })
    this.battle.game.interfaceManager.actionQueue.push(() => { 
      if (second.isAlive()) { 
        this.makeMove(second_move, second, first)
        if (!first.isAlive()) this.battle.game.interfaceManager.actionQueue.push(() => { 
          this.faint(first)
          if (!second.isEnemy) this.battle.game.interfaceManager.actionQueue.push(() => { this.winExperience(second, first) })
          this.battle.game.interfaceManager.actionQueue.push(() => { this.retreat(second, true) })
        })
      } else {
        this.faint(second)
        if (!first.isEnemy) this.battle.game.interfaceManager.actionQueue.push(() => { this.winExperience(first, second) })
        this.battle.game.interfaceManager.actionQueue.push(() => { this.retreat(first, true); console.log(first.isAlive()) })
      }
    })
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
        return this.ally.getStats().speed >= this.enemy.getStats().speed
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
    if (!isHit() || move.damageClass === 'status') {
      this.battle.game.interfaceManager.addDialogue(format(dialogues.failAttackDialogue, [user.name]))
      return
    }
    const damage = this.getDamage(move, user, target)
    target.receiveDamage(damage)
    move.currentPP--

    // Animacion de movimiento
    const xMove = user.isEnemy ? -20 : 20
    if (move.damageClass === "physical" || move.damageClass === "special") {
      const healthPercentage = target.currentHp / target.getStats().hp * 100
      this.battle.game.animationManager.animateMove(user.mainSprite, target.mainSprite, xMove, healthPercentage)
    }
    
    // Dialogo de movimiento
    this.battle.game.interfaceManager.addDialogue(format(dialogues.attackDialogue, [user.name, move.name]))
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
   * Funcion que se encarga de otorgar/animar la experiencia que gana un pokemon al ganar una batalla
   * @param winner Pokemon ganador
   * @param looser Pokemon perdedor
   */
  winExperience(winner: Pokemon, looser: Pokemon) {
    const xp = this.getExperience(looser)
    this.battle.game.interfaceManager.addDialogue(format(dialogues.winExperienceDialogue, [winner.name, xp.toString()]))
    this._winExperience(xp, winner)
  }

  /**
   * Funcion recursiva que se encarga en mas detalle la carga de xp y aumento de nivel
   * @param xp Experiencia a cargar
   * @param winner Pokemon que recibe
   */
  _winExperience(xp: number, winner: Pokemon) {
    const getPercentage = (xp: number, winner: Pokemon) => {
      const xpLeft = winner.getNextLevelXp()
      const percentage = xp * 100 / xpLeft
      return percentage
    }
    const _ = winner.getNextLevelXp() - winner.currentXp // Exp necesaria para siguiente nivel, teniendo en cuenta la cantidad actual
    if (xp >= _) {
      const xpLeft = xp - _
      winner.receiveExperience(_)
      this.battle.game.animationManager.animateExperience(100)
      this._winExperience(xpLeft, winner)
    } else {
      winner.receiveExperience(xp)
      const percentage = getPercentage(winner.currentXp, winner)
      this.battle.game.animationManager.animateExperience(percentage)
    }
  }

  /**
   * Funcion que se encarga de retirar a un pokemon
   * @param pokemon Pokemon que se retira
   */
  retreat(pokemon: Pokemon, win: boolean = false) {
    this.battle.game.interfaceManager.getSetters().interfaceState(1)
    if (this.canRetreat() || win) {
      const text = win ? format(dialogues.winReatreatDialogue, [pokemon.name]) : format(dialogues.retreatDialogue, [pokemon.name])
      this.battle.game.interfaceManager.addDialogue(text)
      this.battle.game.animationManager.retreatAnimation(pokemon.mainSprite)
      // this.battle.game.animationManager.blackScreenIn() // TODO: Modificar para que si es escape, sea sin titilar
    } else {
      this.battle.game.interfaceManager.addDialogue(format(dialogues.failRetreatDialogue, [pokemon.name]))
    }
    
  }

  /**
   * Funcion que se encarga de calcular si es posible la retirada
   */
  canRetreat() {
    const a = this.ally.getStats().speed
    const b = this.enemy.getStats().speed;
    const c = this.attemptsToRun;
    const f = (a * 128 / b) + 30 * c;
    if (f < 255) {
        const randomNum = _.random(0, 255);
        if (randomNum < f) return true;
        else {
            this.attemptsToRun++;
            return false;
        }
    } else return true;

  }
}
