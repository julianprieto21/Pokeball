// Path: src\utils\dataClasses\move.ts
// Purpose: To create a class that will hold the data for a pokemon

import { PokemonSprite } from "../drawClasses/pokemonSprite";
import { PokemonData, PokemonBaseStats, PokemonStats, PokemonTypes, PokemonNatureStats } from "../types";
import { statValue, setMovesByType, setNatureStats, getPokemonData } from "../utils";
import _ from "lodash";
import { Move } from "./move";

export class Pokemon {
  public id: number;
  public name: string;
  public types: PokemonTypes;
  public level: number;
  public nature: PokemonData["nature"];
  public isEnemy: boolean;

  public sprites: { front: string, back: string }
  public mainSprite: PokemonSprite;

  public baseStats: PokemonBaseStats;
  public ivs: PokemonStats;
  public natureStats: PokemonNatureStats;
  public growthRate: string;
  public ability: string;
  public stats: PokemonStats;
  public evolutionChain: string[];
  public evolutionLevels: number[];

  public accuracy: number;
  public evasion: number;
  public currentHp: number;
  public currentXp: number;
  public attempsToRun: number;

  public moves: Move[];

  constructor(data: PokemonData, isEnemy: boolean = false, level: number = 5) {
    this.id = data.main.id;
    this.name = data.main.name.toUpperCase();
    this.types = { first: data.main.types[0].type.name, second: data.main.types[1]?.type.name };
    this.level = level;
    this.nature = data.nature;
    this.isEnemy = isEnemy;

    this.sprites = { front: data.main.sprites.front_default, back: data.main.sprites.back_default };
    this.mainSprite = new PokemonSprite(this.id, this.isEnemy);

    this.baseStats = {
      hp: { value: data.main.stats[0].base_stat, effort: data.main.stats[0].effort },
      attack: { value: data.main.stats[1].base_stat, effort: data.main.stats[1].effort },
      defense: { value: data.main.stats[2].base_stat, effort: data.main.stats[2].effort },
      spAttack: { value: data.main.stats[3].base_stat, effort: data.main.stats[3].effort },
      spDefense: { value: data.main.stats[4].base_stat, effort: data.main.stats[4].effort },
      speed: { value: data.main.stats[5].base_stat, effort: data.main.stats[5].effort },
      xp: { value: data.main.base_experience }
    };
    this.ivs = this._setIVs();
    this.natureStats = this._setNature();
    this.growthRate = data.specie.growth_rate.name.replace("-", "_");
    this.ability = data.main.abilities[0].ability.name.toUpperCase();
    this.stats = this._setStats();
    this.evolutionChain = [this.name, data.evolution.chain.evolves_to[0]?.species.name ?? "", data.evolution.chain.evolves_to[0]?.evolves_to[0]?.species.name ?? ""];
    this.evolutionLevels = [1, data.evolution.chain.evolves_to[0]?.evolution_details[0].min_level ?? 0, data.evolution.chain.evolves_to[0]?.evolves_to[0]?.evolution_details[0].min_level ?? 0]

    this.accuracy = 100;
    this.evasion = 100;
    this.currentHp = this.stats.hp;
    this.currentXp = 0;
    this.attempsToRun = 0;

    this.moves = this._setMoves();
  }
  private _setIVs() {
    const ivs: PokemonStats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    for (const key in ivs) {
      ivs[key as keyof PokemonStats] = _.random(1, 32)
    }
    return ivs;
  }
  public getIVs() {
    return this.ivs;
  }
  private _setStats() {
    const stats: PokemonStats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    for (const key in stats) {
      stats[key as keyof PokemonStats] = statValue({
        base: this.baseStats[key as keyof PokemonStats],
        iv: this.ivs[key as keyof PokemonStats],
        nature: 1,
        level: this.level,
        isHp: key === "hp"
      }) ?? 0;
    }
    return stats;
  }
  public getStats() {
    return this.stats;
  }
  private _setMoves() {
    return setMovesByType(this.types.first);
  }
  public getMoves() {
    return this.moves;
  }
  private _setNature() {
    return setNatureStats(this.nature);
  }
  public getNature() {
    return { name: this.nature.name.toUpperCase(), stats: this.natureStats };
  }
  // TODO: Refactorizar getTotalXp y getNextLevelXp para que no se repita tanto código / hacerlo más legible / más eficiente
  // Para guardar la formula en una variable y no tener que repetirla
  public getTotalXp(level: number | undefined = undefined) {
    const p = (i: number) => {
      if (i === 0) return 0
      else if (i === 1) return 0.008
      else if (i === 2) return 0.014
      else return 1;
    };
    const n = level ? level : this.level;
    const GrowthRateDict: Record<string, number> = {
      slow: (5 * (n ** 3)) / 4,
      medium: n ** 3,
      fast: (4 * (n ** 3)) / 5,
      medium_slow: (1.2 * (n ** 3)) - (15 * (n ** 2)) + 100 * n - 140,
      slow_then_very_fast: (n ** 3) * (2 - 0.02 * n) > 0 && n <= 50 ?
        (n ** 3) * (2 - 0.02 * n) :
        (n ** 3) * (1.5 - 0.01 * n) > 0 && n <= 68 ?
          (n ** 3) * (1.5 - 0.01 * n) :
          (n ** 3) * (1.274 - 0.02 * (n / 3) - p(n % 3)) > 0 ?
            (n ** 3) * (1.274 - 0.02 * (n / 3) - p(n % 3)) :
            (n ** 3) * (1.6 - 0.01 * n),
      fast_then_very_slow: (n ** 3) * (24 + (n + 1) / 3) / 50 > 0 && n <= 15 ?
        (n ** 3) * (24 + (n + 1) / 3) / 50 :
        (n ** 3) * (14 + n) / 50 > 0 && n <= 35 ?
          (n ** 3) * (14 + n) / 50 :
          (n ** 3) * (32 + (n / 2)) / 50
    };
    return Math.floor(GrowthRateDict[this.growthRate] || 0);
  }
  public getNextLevelXp() {
    return this.getTotalXp(this.level + 1) - this.getTotalXp();
  }
  public levelUp(xpLeft: number) {
    this.level++;
    if (this.level === this.getEvolutionsLevels()[1]) {
      this.evolve(this.getEvolutionName()[1]);
      return;
    } else if (this.level === this.getEvolutionsLevels()[2]) {
      this.evolve(this.getEvolutionName()[2]);
      return;
    }
    this.stats = this._setStats();
    this.currentHp = this.stats.hp;
    this.currentXp = xpLeft;
  }
  private getEvolutionName() {
    return this.evolutionChain;
  }
  private getEvolutionsLevels() {
    return this.evolutionLevels;
  }
  public async evolve(evolutionName: string) {
    const data: PokemonData = await getPokemonData(evolutionName);
    this.name = data.main.name.toUpperCase();
    this.types = { first: data.main.types[0].type.name.toUpperCase(), second: data.main.types[1]?.type.name.toUpperCase() };
    this.baseStats = {
      hp: { value: data.main.stats[0].base_stat, effort: data.main.stats[0].effort },
      attack: { value: data.main.stats[1].base_stat, effort: data.main.stats[1].effort },
      defense: { value: data.main.stats[2].base_stat, effort: data.main.stats[2].effort },
      spAttack: { value: data.main.stats[3].base_stat, effort: data.main.stats[3].effort },
      spDefense: { value: data.main.stats[4].base_stat, effort: data.main.stats[4].effort },
      speed: { value: data.main.stats[5].base_stat, effort: data.main.stats[5].effort },
      xp: { value: data.main.base_experience }
    };
    this.stats = this._setStats();
  }
}
