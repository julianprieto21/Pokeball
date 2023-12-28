import { PokemonData } from '../types'
import { natureNameMap } from './constants'
import _ from 'lodash'

/**
 * Funcion que se encarga de calcular el valor de una estadistica
 * @param data Datos necesarios para calcular el valor de la estadistica
 * @returns Valor de la estadistica
 */
export function statValue (data: { base: { value: number, effort: number }, iv: number, nature: number, level: number, isHp: boolean }): number {
  const stat = 2 * data.base.value
  const effort = data.base.effort / 4
  if (data.isHp) {
    return Math.floor((((stat + effort + data.iv) * data.level) / 100) + data.level + 10)
  }
  return Math.floor(((((stat + effort + data.iv) * data.level) / 100) + 5) * data.nature)
}

/**
 * Funcion que se encarga de mapear las estadisticas de un pokemon 
 * @param stats Estadisticas del pokemon
 * @returns Estadisticas del pokemon mapeadas
 */
function parseStats (stats: any): PokemonData['baseStats'] {
  return {
    hp: {
      value: stats[0].base_stat,
      effort: stats[0].effort
    },
    attack: {
      value: stats[1].base_stat,
      effort: stats[1].effort
    },
    defense: {
      value: stats[2].base_stat,
      effort: stats[2].effort
    },
    spAttack: {
      value: stats[3].base_stat,
      effort: stats[3].effort
    },
    spDefense: {
      value: stats[4].base_stat,
      effort: stats[4].effort
    },
    speed: {
      value: stats[5].base_stat,
      effort: stats[5].effort
    }
  }
}

/**
 * Funcion que se encarga de parsear los datos de un pokemon
 * @param main Parte principal de la data de un pokemon (API)
 * @param specie Parte de la data de un pokemon que contiene la informacion de la especie (API)
 * @param evolution Parte de la data de un pokemon que contiene la informacion de la evolucion (API)
 * @param nature Parte de la data de un pokemon que contiene la informacion de la naturaleza (API)
 * @returns Datos del pokemon
 */
export function parsePokemonData (main: any, specie: any, evolution: any, nature: any): PokemonData {
  return {
    id: main.id,
    name: main.name,
    spriteFront: main.sprites.front_default ?? undefined,
    spriteBack: main.sprites.back_default ?? undefined,
    ability: main.abilities[0].ability.name,
    baseStats: parseStats(main.stats),
    baseExperience: main.base_experience,
    types: {
      primary: main.types[0].type.name,
      second: main.types[1]?.type.name
    },
    growthRate: specie.growth_rate.name,
    evolution: {
      first: { name: evolution.chain.evolves_to[0]?.species.name, level: evolution.chain.evolves_to[0]?.evolution_details[0].min_level },
      second: { name: evolution.chain.evolves_to[0]?.evolves_to[0]?.species.name, level: evolution.chain.evolves_to[0]?.evolves_to[0]?.evolution_details[0].min_level }
    },
    nature: {
      id: nature.id,
      name: nature.name,
      decreasedStat: natureNameMap[nature.decreased_stat?.name.replace('-', '_')],
      increasedStat: natureNameMap[nature.increased_stat?.name.replace('-', '_')]
    }
  }
}

/**
 * Funcion que se encarga de formatear dialogos
 * @param dialogue Dialogo a formatear
 * @param list Lista de elementos a reemplazar
 * @returns Dialogo formateado
 */
export function format (dialogue: string, list: string[] | string) {
  let result = dialogue
  for (let i = 0; i < list.length; i++) {
    result = result.replace('{' + i + '}', list[i])
  }
  return result
}