import { PokemonData, MoveData } from '../types'
import { parsePokemonData } from '../utils/functions'
import _ from 'lodash'


export async function getPokemonData (id: number | string): Promise<PokemonData> {
  if (id === 0) id = _.random(1, 650)
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