// Path: src\utils\utils.ts
// Purpose: To create a file that will hold all the functions that are used in the logic of the app

import { Move } from './dataClasses/move'
import { movesByType, natureNameMap, tileSize } from './constants'
import { PokemonNatureStats, PokemonData, MoveData } from './types'
import { Boundary } from './main/engine'
import _ from 'lodash'
import { gsap } from 'gsap'
import { Item } from './dataClasses/item'

export function blackScreenIn (): void {
  gsap.to('.blackScreen', {
    display: 'block',
    opacity: 1,
    duration: 1
  })
}
export function blackScreenOut (): void {
  gsap.to('.blackScreen', {
    display: 'none',
    opacity: 0,
    duration: 1
  })
}

export function statValue (data: { base: { value: number, effort: number }, iv: number, nature: number, level: number, isHp: boolean }): number {
  const stat = 2 * data.base.value
  const effort = data.base.effort / 4
  if (data.isHp) {
    return Math.floor((((stat + effort + data.iv) * data.level) / 100) + data.level + 10)
  }
  return Math.floor(((((stat + effort + data.iv) * data.level) / 100) + 5) * data.nature)
}
export function setMovesByType (type: string): Move[] {
  let movesIds: number[] = []
  const moves: Move[] = []
  movesIds = movesByType[type]
  let identifier = 1
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  movesIds.forEach(async (id: number) => {
    const data = await getMoveData(id)
    const move = new Move(data, identifier)
    moves.push(move)
    identifier++
  })
  return moves
}
export function setNatureStats (nature: PokemonData['nature']): PokemonNatureStats {
  const natureStats: PokemonNatureStats = {
    attack: 1,
    defense: 1,
    spAttack: 1,
    spDefense: 1,
    speed: 1
  }
  if (nature.increasedStat != null) {
    natureStats[nature.increasedStat] *= 1.1
  }
  if (nature.decreasedStat != null) {
    natureStats[nature.decreasedStat] *= 0.9
  }
  return natureStats
}

export async function getPokemonData (id: number | string): Promise<PokemonData> {
  if (typeof id === 'string' && id === 'random') id = _.random(1, 650)
  let response
  const urlMain = 'https://pokeapi.co/api/v2/pokemon/'
  const urlSpecies = 'https://pokeapi.co/api/v2/pokemon-species/'
  const urlEvolution = 'https://pokeapi.co/api/v2/evolution-chain/'
  const urlNature = 'https://pokeapi.co/api/v2/nature/'

  response = await fetch(`${urlMain}${id}`)
  const mainData = await response.json()
  response = await fetch(`${urlSpecies}${id}`)
  const speciesData = await response.json()
  const evolutionChain = speciesData.evolution_chain.url.split('/')[6] as string
  response = await fetch(`${urlEvolution}${evolutionChain}`)
  const evolutionData = await response.json()
  response = await fetch(`${urlNature}${_.random(1, 25)}`)
  const natureData = await response.json()

  const pokemonData: PokemonData = parsePokemonData(mainData, speciesData, evolutionData, natureData)
  return pokemonData
}
export async function getMoveData (id: number): Promise<MoveData> {
  const url = 'https://pokeapi.co/api/v2/move/'
  const response = await fetch(`${url}${id}`)
  const data: MoveData = await response.json()
  return data
}
export async function getItemData (name: string): Promise<{ main: any, category: any }> { // Modificar el tipo de retorno
  let response
  const url = 'https://pokeapi.co/api/v2/item/'
  response = await fetch(url + name)
  const itemData = await response.json()
  response = await fetch(itemData.category.url)
  const categoryData = await response.json()

  return { main: itemData, category: categoryData }
}

export function mapCollisionsArrays (array: number[], offset: { x: number, y: number }): Boundary[] {
  const map: number[][] = []
  const list: Boundary[] = []
  for (let i = 0; i < array.length; i += tileSize) {
    map.push(array.slice(i, i + tileSize))
  }
  map.forEach((row: number[], i: number) => {
    row.forEach((value: number, j: number) => {
      if (value === 14759) {
        list.push(new Boundary({ x: j * tileSize + offset.x, y: i * tileSize + offset.y }))
      }
    })
  })
  return list
}
export function checkCollision (
  rect1: { position: { x: number, y: number }, width: number, height: number },
  rect2: { position: { x: number, y: number }, width: number, height: number }): boolean {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + tileSize &&
    rect1.position.y <= rect2.position.y &&
    rect1.position.y + rect1.height >= rect2.position.y)
}
export async function mapItems (mapInfo: any): Promise<Item[]> {
  const x: number = mapInfo.offset.x
  const y: number = mapInfo.offset.y
  const map: number[][] = []
  const list: Item[] = []
  for (let i = 0; i < mapInfo.itemsArray.length; i += tileSize) {
    map.push(mapInfo.itemsArray.slice(i, i + tileSize))
  }
  for (const row of map) {
    const i: number = map.indexOf(row)
    for (const value of row) {
      const j: number = row.indexOf(value)
      if (value === 14760) {
        const sample = _.sample(mapInfo.possibleItems)
        const itemData = await getItemData(sample)
        const item = new Item(itemData)
        item.setSprite({ x: j * tileSize + x, y: i * tileSize + y })
        list.push(item)
      }
    }
  }
  return list
}

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

function parsePokemonData (main: any, specie: any, evolution: any, nature: any): PokemonData {
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

export function getInfoElements (): any {
  const allyName = document.getElementById('ally-name')
  const enemyName = document.getElementById('enemy-name')
  const allyLevel = document.getElementById('ally-level')
  const enemyLevel = document.getElementById('enemy-level')
  const allyHealth = document.getElementById('ally-current-health')
  const allyHealthBar = document.getElementById('ally-current-health-bar')
  const enemyHealthBar = document.getElementById('enemy-current-health-bar')
  const allyExp = document.getElementById('ally-current-experience-bar')
  if (allyName != null && enemyName != null && allyLevel != null && enemyLevel != null && allyHealthBar != null && enemyHealthBar != null && allyHealth != null && allyExp != null) {
    return { allyName, enemyName, allyLevel, enemyLevel, allyHealthBar, enemyHealthBar, allyHealth, allyExp }
  }
  return undefined
}
