import { PokemonSprite } from '../spritesClasses/pokemonSprite'
import { PokemonData, PokemonNatureStats, PokemonStats, PokemonTypes } from '../types'
import { movesByType } from '../utils/constants'
import { statValue } from '../utils/functions'
import { getPokemonData, getMoveData } from '../api/getData'
import _ from 'lodash'
import { Move } from './move'


/**
 * Clase que representa a un pokemon
 */
export class Pokemon {
  public id: number
  public name: string
  public types: PokemonTypes
  public level: number
  private nature: PokemonData['nature']
  public isEnemy: boolean

  public sprites: { front: string, back: string }
  public mainSprite: PokemonSprite

  public baseStats: PokemonData['baseStats']
  public baseExperience: number
  private ivs: PokemonStats
  public natureStats: PokemonNatureStats
  public growthRate: string
  public ability: string
  private stats: PokemonStats
  public evolutionChain: PokemonData['evolution']

  public accuracy: number
  public evasion: number
  public currentHp: number
  public currentXp: number
  public attempsToRun: number

  private moves: Move[]
  /**
   * Constructor de la clase Pokemon
   * @param data Datos del pokemon
   * @param isEnemy Flag que indica si el pokemon es enemigo
   * @param level Nivel del pokemon. Por defecto es 5
   */
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

  /**
   * Funcion setter que se encarga de setear los IVs del pokemon
   * @returns Retorna un objeto con los IVs del pokemon
   */
  private _setIVs (): PokemonStats {
    const ivs: PokemonStats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
    for (const key in ivs) {
      ivs[key as keyof PokemonStats] = _.random(1, 32)
    }
    return ivs
  }

  /**
   * Funcion getter que se encarga de obtener los IVs del pokemon
   * @returns Retorna un objeto con los IVs del pokemon
   */
  public getIVs (): PokemonStats {
    return this.ivs
  }

  /** 
  * Funcion setter que se encarga de setear los stats del pokemon
  */
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

  /**
   * Funcion getter que se encarga de obtener los stats del pokemon
   * @returns Retorna un objeto con los stats del pokemon
   */
  public getStats (): PokemonStats {
    return this.stats
  }

  /**
   * Funcion setter que se encarga de setear los movimientos del pokemon
   * @returns Retorna un array con los movimientos del pokemon
   */
  private _setMoves (): Move[] {
    let movesIds: number[] = []
    const moves: Move[] = []
    movesIds = movesByType[this.types.primary]
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    movesIds.forEach(async (id: number) => {
      const data = await getMoveData(id)
      const move = new Move(data)
      moves.push(move)
    })
    return moves
  }

  /**
   * Funcion getter que se encarga de obtener los movimientos del pokemon
   * @returns Retorna un array con los movimientos del pokemon
   */
  public getMoves (): Move[] {
    return this.moves
  }

  /**
   * Funcion setter que se encarga de setear la naturaleza del pokemon
   * @returns Retorna un objeto con los stats del pokemon
   */
  private _setNature (): PokemonNatureStats {
    const natureStats: PokemonNatureStats = {
      attack: 1,
      defense: 1,
      spAttack: 1,
      spDefense: 1,
      speed: 1
    }
    if (this.nature.increasedStat != null) {
      natureStats[this.nature.increasedStat] *= 1.1
    }
    if (this.nature.decreasedStat != null) {
      natureStats[this.nature.decreasedStat] *= 0.9
    }
    return natureStats
  }

  /**
   * Funcion getter que se encarga de obtener la naturaleza del pokemon
   * @returns Retorna un objeto con la naturaleza del pokemon
   */
  public getNature (): { name: string, stats: PokemonNatureStats } {
    return { name: this.nature.name.toUpperCase(), stats: this.natureStats }
  }

  /**
   * Funcion que se encarga de calcular la experiencia necesaria para llegar al nivel indicado
   * @param level Nivel del pokemon. Por defecto es el nivel actual
   * @returns Total de experiencia necesaria para llegar al nivel indicado
   */
  public getTotalXp (level: number = this.level): number {
    const p = (i: number): number => {
      if (i === 0) return 0
      else if (i === 1) return 0.008
      else if (i === 2) return 0.014
      else return 1
    }
    const n: number = level
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

  /**
   * Funcion que se encarga de calcular la experiencia necesaria para llegar al siguiente nivel
   * @returns Total de experiencia necesaria para llegar al siguiente nivel
   */
  public getNextLevelXp (): number {
    return this.getTotalXp(this.level + 1) - this.getTotalXp()
  }

  /**
   * Funcion que se encarga de subir de nivel al pokemon
   * @param xpLeft Cantidad de experiencia sobrante al subir de nivel
   */
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

  /**
   * Funcion que se encarga de evolucionar al pokemon
   * @param evolutionName Nombre de la evolucion
   * @returns Promesa que se resuelve cuando se termina de evolucionar
   */
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

  /**
   * Funcion que se encarga de recibir daño
   * @param damage Cantidad de daño recibido
   */
  receiveDamage (damage: number): void {
    this.currentHp -= damage
    if (this.currentHp < 0) this.currentHp = 0
  }

  /**
   * Funcion que se encarga de recibir experiencia
   * @param xp Cantidad de experiencia recibida
   */
  receiveExperience (xp: number): void {
    this.currentXp += xp
    if (this.currentXp >= this.getNextLevelXp()) {
      console.log('level up')
      this.levelUp(this.currentXp - this.getNextLevelXp()) // TODO: Revisar logica
    }
  }

  /**
   * Funcion que se encarga chequear si el pokemon esta vivo
   * @returns Booleano que indica si el pokemon esta vivo o no
   */
  isAlive() {
    return this.currentHp > 0
  }
}
