import { useEffect, useState } from "react";
import { Pokemon } from "../../lib/dataClasses/pokemon";
import { PokemonAllyPanel } from "./PokemonAllyPanel";
import { PokemonEnemyPanel } from "./PokemonEnemyPanel";
import { Game } from "../../lib/logic/game";

export function PokemonPanels({
  game,
  ally,
  enemy,
}: {
  game: Game;
  ally: Pokemon;
  enemy: Pokemon;
}) {
  const [allyPokemon, setAllyPokemon] = useState<Pokemon>(ally);
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon>(enemy);

  useEffect(() => {
    setAllyPokemon(ally);
    setEnemyPokemon(enemy);
  });

  return (
    <>
      <PokemonAllyPanel game={game} pokemon={allyPokemon} />
      <PokemonEnemyPanel pokemon={enemyPokemon} />
    </>
  );
}
