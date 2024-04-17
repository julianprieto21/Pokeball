import { useEffect, useState } from "react";
import { Game } from "../lib/logic/game";
import { imagePathsNew } from "../lib/constants";
import { PokemonIcon } from "./pokemon/PokemonIcon";
import { Pokemon } from "../lib/dataClasses/pokemon";
import { PokemonInfo } from "./pokemon/PokemonInfo";

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
        className="size-8 sm:size-14 lg:size-20 -rotate-[30deg] absolute top-1 sm:top-4 left-4"
        alt="Bag Icon"
        src={IMAGE_PATHS.pocketIcons + "backpack.svg"}
      />
      <h1 className="text-2xl sm:text-5xl lg:text-7xl top-1 sm:top-4 left-16 sm:left-24 lg:left-28 absolute">
        PARTY
      </h1>

      <div className="absolute top-11 sm:top-20 lg:top-28 flex flex-col gap-1 sm:gap-2 lg:gap-3 left-8 sm:left-16 lg:left-16">
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
