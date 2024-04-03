import { useEffect, useState } from "react";
import { Game } from "../logic/game";
import { imagePathsNew } from "../utils/constants";
import { PokemonIcon } from "./sub-components/PokemonIcon";
import { Pokemon } from "../logic/pokemon";
import { PokemonInfo } from "./sub-components/PokemonInfo";

const IMAGE_PATHS = imagePathsNew;

export function Party({ game }: { game: Game }) {
  let primaryPok = game.getPlayer().party.getPrimary();
  const [mainPokemon, setMainPokemon] = useState<Pokemon>(primaryPok);
  const [pokemon, setPokemon] = useState<Pokemon>();

  const player = game.getPlayer();
  const playerTeam = player.party;

  useEffect(() => {
    if (game.battle && pokemon) {
      game.battle.engine.changePokemon(pokemon);
    }
  }, [pokemon]);

  return (
    <>
      <img src={IMAGE_PATHS.bagBackground} alt="Bag Background" />

      <img
        id="iconBag"
        alt="Bag Icon"
        src={IMAGE_PATHS.pocketIcons + "backpack.svg"}
      />
      <h1 id="title">PARTY</h1>

      <div id="pokemons">
        {playerTeam.getPokemons().map((pokemon, index) => {
          return (
            <PokemonIcon
              key={index}
              pokemon={pokemon}
              setSelectedPokemon={setMainPokemon}
              setPokemon={setPokemon}
            />
          );
        })}
      </div>

      <PokemonInfo pokemon={mainPokemon} />
    </>
  );
}
