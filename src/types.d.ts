// Path: src\utils\utils.d.ts
// Purpose: To store all the types used in the project

import { Item } from './dataClasses/item'

export interface PokemonData {
  id: number
  name: string
  spriteFront: string
  spriteBack: string
  ability: string
  baseStats: {
    hp: {
      value: number
      effort: 0 | 1
    }
    attack: {
      value: number
      effort: 0 | 1
    }
    defense: {
      value: number
      effort: 0 | 1
    }
    spAttack: {
      value: number
      effort: 0 | 1
    }
    spDefense:
    {
      value: number
      effort: 0 | 1
    }
    speed: {
      value: number
      effort: 0 | 1
    }
  }
  baseExperience: number
  types: {
    primary: string
    second: string | undefined
  }
  growthRate: string
  evolution: {
    first: { name: string, level: number } | undefined
    second: { name: string, level: number } | undefined
  }
  nature: {
    id: number
    name: string
    decreasedStat: string | undefined
    increasedStat: string | undefined
  }
}
export interface MoveData {
  id: number
  name: string
  power: number | null
  pp: number
  accuracy: number | null
  priority: number
  meta: {
    crit_rate: number
  }
  type: {
    name: string
  }
  target: {
    name: string
  }
  damage_class: {
    name: string
  }
  effect_chance: number | null
  effect_entries: {
    0: {
      short_effect: string
    }
  }
}
export interface ItemData {
  main: {
    id: number
    name: string
    cost: number
    effect_entries: {
      0: {
        effect: string
        short_effect: string
      }
    }
    sprites: {
      default: string
    }
    category: {
      url: string
    }
  }
  category: {
    pocket: {
      name: string
    }
  }
}
export interface PokemonStats {
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}
export interface PokemonTypes {
  primary: string
  second: string | undefined
}
export interface PokemonNatureStats {
  [key: string]: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}
export interface NatureNames {
  [key: string]: string
  attack: string
  defense: string
  special_attack: string
  special_defense: string
  speed: string
}
export interface Pockets {
  [key: string]: Item[]
  items: Item[]
  medicine: Item[]
  pokeballs: Item[]
  machines: Item[]
  berries: Item[]
  mail: Item[]
  battleItems: Item[]
  keyItems: Item[]
}
export interface Sprite {
  position: { x: number, y: number }
  imageDir: string
  image: HTMLImageElement
  width: number
  height: number
}
