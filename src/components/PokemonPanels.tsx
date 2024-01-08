import { useEffect, useState } from "react"
import { Pokemon } from "../logic/pokemon"
import { PokemonAllyPanel } from "./sub-components/PokemonAllyPanel"
import { PokemonEnemyPanel } from "./sub-components/PokemonEnemyPanel"
import { Game } from "../logic/game"

export function PokemonPanels( { game, ally, enemy }: { game: Game, ally: Pokemon, enemy: Pokemon } ) {

  const [allyPokemon, setAllyPokemon] = useState<Pokemon>(ally)
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon>(enemy)

  useEffect(() => {
    setAllyPokemon(ally)
    setEnemyPokemon(enemy)
  }, [])

  return (
    <>
      <PokemonAllyPanel game={game} pokemon={allyPokemon} />
      <PokemonEnemyPanel pokemon={enemyPokemon}/>
    </>
  )
}