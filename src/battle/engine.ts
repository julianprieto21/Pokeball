import { typesMap, effectChart } from '../constants'

import { Move } from '../dataClasses/move'
import { Pokemon } from '../dataClasses/pokemon'
import { gsap } from 'gsap'
import _ from 'lodash'

export class Engine {
  ally: Pokemon
  enemy: Pokemon
  tl: GSAPTimeline
  constructor (ally: Pokemon, enemy: Pokemon, tl: GSAPTimeline) {
    this.ally = ally
    this.enemy = enemy
    this.tl = tl
  }

  allyTurn (allyMove: Move, enemyMove: Move): boolean {
    if (allyMove.priority > enemyMove.priority) return true
    else {
      if (allyMove.priority < enemyMove.priority) return false
      else {
        return this.ally.stats.speed > this.enemy.stats.speed
      }
    }
  }

  getExperience (): number {
    const e = this.enemy.baseExperience
    const l = this.enemy.level
    const c = 1
    return _.floor((e * l * c) / 7)
  }

  getDamage (maker: Pokemon, move: Move, receiver: Pokemon): number {
    // check if the move is critic
    const isCritic = (): boolean => {
      const criticRate: Record<number, number> = {
        0: 0.0625,
        1: 0.125,
        2: 0.25,
        3: 0.333,
        4: 0.5
      }
      return _.random(0, 1, true) < criticRate[move.critRate]
    }
    // calculate bonus and effectivity
    const getBonusEffect = (): { e: number, b: number } => {
      let b
      if (move.type === maker.types.primary || move.type === maker.types.second) b = 1.5
      else b = 1
      const e = effectChart[typesMap[move.type].id][typesMap[receiver.types.primary].id]
      return { e, b }
    }
    // get attack and defense values
    const getAttDefValues = (): { a: number, d: number } => {
      let a, d
      if (move.damageClass === 'physical') {
        a = maker.baseStats.attack.value
        d = receiver.baseStats.defense.value
      } else if (move.damageClass === 'special') {
        a = maker.baseStats.spAttack.value
        d = receiver.baseStats.spDefense.value
      } else {
        a = maker.baseStats.attack.value
        d = receiver.baseStats.defense.value
      }
      return { a, d }
    }
    // calculate damage
    const v = _.random(85, 100)
    const n = maker.level
    const { e, b } = getBonusEffect()
    const p = move.power ?? 0 // Power del move es 0 si el movimiento es de estado (osea power = null)
    const { a, d } = getAttDefValues()
    const damage = 0.01 * b * e * v * ((((0.2 * n + 1) * a * p) / (25 * d)) + 2)
    const critic = isCritic() ? 1.5 : 1
    return _.floor(damage * critic)
  }

  attack (maker: Pokemon, move: Move, receiver: Pokemon): void {
    // check if the move hits
    const moveHits = (): boolean => {
      if (move.accuracy !== null) {
        const acc = (move.accuracy / 100) * (move.accuracy / receiver.evasion)
        return _.random(0, 1, true) < acc
      } else return true
    }
    // animate damage
    const animateDamage = (percentage: number, healthBar: HTMLElement): void => {
      this.tl
        .to(healthBar, {
          width: `${percentage}%`,
          onStart: () => {
            // receiver.currentHp = health;
            if (maker.isEnemy) {
              const allyHealth = document.getElementById('ally-current-health') ?? null
              if (allyHealth != null) allyHealth.innerText = `${receiver.currentHp}/${receiver.stats.hp}`
            }
          }
        }, '<')
        .to(receiver.mainSprite.position, {
          x: receiver.mainSprite.position.x + 10,
          yoyo: true,
          repeat: 3,
          duration: 0.09
        }, '<')
        .to(receiver.mainSprite, {
          opacity: 0.4,
          yoyo: true,
          repeat: 3,
          duration: 0.09
        }, '<')
    }
    // animate the move
    const animateMove = (percentage: number, healthBar: HTMLElement): void => {
      const xMove = maker.isEnemy
        ? -20
        : 20
      if (move.damageClass === 'physical' || move.damageClass === 'special') {
        this.tl
          .to(maker.mainSprite.position, {
            x: maker.mainSprite.position.x - xMove
          })
          .to(maker.mainSprite.position, {
            x: maker.mainSprite.position.x + xMove * 2,
            duration: 0.1,
            onComplete: () => {
              animateDamage(percentage, healthBar)
            }
          })
          .to(maker.mainSprite.position, {
            x: maker.mainSprite.position.x
          })
      }
    }
    // makes the damage
    const makeMove = (): void => {
      const damage = this.getDamage(maker, move, receiver)
      const healthBar = maker.isEnemy
        ? document.getElementById('ally-current-health-bar') ?? null
        : document.getElementById('enemy-current-health-bar') ?? null
      let updateHealth = receiver.currentHp - damage
      if (updateHealth < 0) updateHealth = 0
      receiver.currentHp = updateHealth

      const percentage = updateHealth * 100 / receiver.stats.hp
      if (healthBar != null) animateMove(percentage, healthBar)
      move.currentPp--
    }

    // is dont hit (or is a status move), do nothing
    if (!moveHits() || move.damageClass === 'status') return
    // calculate and make damage
    makeMove()
  }

  faint (pokemon: Pokemon): void {
    this.tl
      .to(pokemon.mainSprite.position, {
        y: pokemon.mainSprite.position.y + 20
      })
      .to(pokemon.mainSprite, {
        opacity: 0
      }, '<')
  }

  winExperience (): number {
    const updatePanel = (): void => {
      const level = document.getElementById('ally-level') ?? null
      const health = document.getElementById('ally-current-health') ?? null

      if (level != null && health != null) {
        level.innerText = `Lv ${this.ally.level}`
        health.innerText = `${this.ally.currentHp}/${this.ally.stats.hp}`
      }

      if (XPBar != null) XPBar.style.width = '0'
      gsap.to(document.getElementById('ally-current-health-bar'), {
        width: '100%'
      })
    }

    const XP = this.getExperience()
    const XPBar = document.getElementById('ally-current-experience-bar') ?? null
    const nextLevelXP = this.ally.getNextLevelXp()
    this.ally.currentXp += XP
    let XPLeft: number
    let percentage = this.ally.currentXp * 100 / nextLevelXP

    if (percentage > 100) {
      percentage = 100
      XPLeft = this.ally.currentXp - nextLevelXP
    } else XPLeft = this.ally.currentXp

    this.tl
      .to(XPBar, {
        width: `${percentage}%`,
        duration: 1,
        onComplete: () => {
          if (percentage === 100) {
            this.ally.levelUp(XPLeft)
            updatePanel()
            this.winExperience()
          }
        }
      })
    return XP
  }
}
