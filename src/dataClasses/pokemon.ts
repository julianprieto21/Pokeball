// Path: src\utils\dataClasses\move.ts
// Purpose: To create a class that will hold the data for a pokemon

import { PokemonSprite } from '../drawClasses/pokemonSprite'
import { PokemonData, PokemonNatureStats, PokemonStats, PokemonTypes } from '../types'
import { statValue, setMovesByType, setNatureStats, getPokemonData } from '../utils'
import _ from 'lodash'
import { Move } from './move'

export class Pokemon {
  public id: number
  public name: string
  public types: PokemonTypes
  public level: number
  public nature: PokemonData['nature']
  public isEnemy: boolean

  public sprites: { front: string, back: string }
  public mainSprite: PokemonSprite

  public baseStats: PokemonData['baseStats']
  public baseExperience: number
  public ivs: PokemonStats
  public natureStats: PokemonNatureStats
  public growthRate: string
  public ability: string
  public stats: PokemonStats
  public evolutionChain: PokemonData['evolution']

  public accuracy: number
  public evasion: number
  public currentHp: number
  public currentXp: number
  public attempsToRun: number

  public moves: Move[]

  constructor (data: PokemonData, isEnemy: boolean = false, level: number = 5) {
    this.id = data.id
    this.name = data.name.toUpperCase()
    this.types = { primary: data.types.primary, second: data.types.second }
    this.level = level
    this.nature = data.nature
    this.isEnemy = isEnemy

    this.sprites = { front: data.spriteFront, back: data.spriteBack }
    this.mainSprite = new PokemonSprite(this.id, this.isEnemy)

    this.baseStats = data.baseStats
    this.baseExperience = data.baseExperience
    this.ivs = this._setIVs()
    this.natureStats = this._setNature()
    this.growthRate = data.growthRate.replace('-', '_')
    this.ability = data.ability.toUpperCase()
    this.stats = this._setStats()
    this.evolutionChain = data.evolution

    this.accuracy = 100
    this.evasion = 100
    this.currentHp = this.stats.hp
    this.currentXp = 0
    this.attempsToRun = 0

    this.moves = this._setMoves()
  }

  private _setIVs (): PokemonStats {
    const ivs: PokemonStats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
    for (const key in ivs) {
      ivs[key as keyof PokemonStats] = _.random(1, 32)
    }
    return ivs
  }

  public getIVs (): PokemonStats {
    return this.ivs
  }

  private _setStats (): PokemonStats {
    const stats: PokemonStats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
    for (const key in stats) {
      stats[key as keyof PokemonStats] = statValue({
        base: this.baseStats[key as keyof PokemonStats],
        iv: this.ivs[key as keyof PokemonStats],
        nature: this.natureStats[key as keyof PokemonStats],
        level: this.level,
        isHp: key === 'hp'
      }) ?? 0
    }
    return stats
  }

  public getStats (): PokemonStats {
    return this.stats
  }

  private _setMoves (): Move[] {
    return setMovesByType(this.types.primary)
  }

  public getMoves (): Move[] {
    return this.moves
  }

  private _setNature (): PokemonNatureStats {
    return setNatureStats(this.nature)
  }

  public getNature (): { name: string, stats: PokemonNatureStats } {
    return { name: this.nature.name.toUpperCase(), stats: this.natureStats }
  }

  public getTotalXp (level: number | null = null): number {
    const p = (i: number): number => {
      if (i === 0) return 0
      else if (i === 1) return 0.008
      else if (i === 2) return 0.014
      else return 1
    }
    let n: number
    if (level != null) n = level
    else n = this.level
    // const n = level || this.level
    const GrowthRateDict: Record<string, number> = {
      slow: (5 * (n ** 3)) / 4,
      medium: n ** 3,
      fast: (4 * (n ** 3)) / 5,
      medium_slow: (1.2 * (n ** 3)) - (15 * (n ** 2)) + 100 * n - 140,
      slow_then_very_fast: (n ** 3) * (2 - 0.02 * n) > 0 && n <= 50
        ? (n ** 3) * (2 - 0.02 * n)
        : (n ** 3) * (1.5 - 0.01 * n) > 0 && n <= 68
            ? (n ** 3) * (1.5 - 0.01 * n)
            : (n ** 3) * (1.274 - 0.02 * (n / 3) - p(n % 3)) > 0
                ? (n ** 3) * (1.274 - 0.02 * (n / 3) - p(n % 3))
                : (n ** 3) * (1.6 - 0.01 * n),
      fast_then_very_slow: (n ** 3) * (24 + (n + 1) / 3) / 50 > 0 && n <= 15
        ? (n ** 3) * (24 + (n + 1) / 3) / 50
        : (n ** 3) * (14 + n) / 50 > 0 && n <= 35
            ? (n ** 3) * (14 + n) / 50
            : (n ** 3) * (32 + (n / 2)) / 50
    }

    return Math.floor(GrowthRateDict[this.growthRate])
  }

  public getNextLevelXp (): number {
    return this.getTotalXp(this.level + 1) - this.getTotalXp()
  }

  public levelUp (xpLeft: number): void {
    this.level++
    if (this.level === this.evolutionChain.first?.level) {
      void this.evolve(this.evolutionChain.first.name) // operador "void" para ignorar error al no poner await en funcion asincrona evolve
    } else if (this.level === this.evolutionChain.second?.level) {
      void this.evolve(this.evolutionChain.second.name)
    }
    this.stats = this._setStats()
    this.currentHp = this.stats.hp
    this.currentXp = xpLeft
  }

  public async evolve (evolutionName: string): Promise<void> {
    return await getPokemonData(evolutionName)
      .then((data: PokemonData) => {
        this.id = data.id
        this.name = data.name.toUpperCase()
        this.types = { primary: data.types.primary, second: data.types.second }
        this.sprites = { front: data.spriteFront, back: data.spriteBack }
        this.mainSprite = new PokemonSprite(this.id, this.isEnemy)
        this.baseStats = data.baseStats
        this.stats = this._setStats()
      })
      .catch((e: Error) => {
        console.error(e)
      })
  }
}
