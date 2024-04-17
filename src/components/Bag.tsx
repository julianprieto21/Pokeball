import { useState } from "react";
import { Game } from "../logic/game";
import { imagePathsNew } from "../utils/constants";
import { ItemList } from "./sub-components/ItemList";
import { PocketBar } from "./sub-components/PocketBar";
import { PokemonIcon } from "./sub-components/PokemonIcon";
import { Item } from "../logic/item";
import { ItemDescription } from "./sub-components/ItemDescription";
import { ItemActionButtons } from "./sub-components/ItemActionButtons";
import { Pokemon } from "../logic/pokemon";

const IMAGE_PATHS = imagePathsNew;

export function Bag({ game }: { game: Game }) {
  const [pocketOpen, setPocketOpen] = useState<string>("misc");
  const [itemHover, setItemHover] = useState<Item>();
  const [itemSelected, setItemSelected] = useState<Item>();
  const [, setSelectedPokemon] = useState<Pokemon>(
    game.getPlayer().party.getPrimary()
  );

  const player = game.getPlayer();
  const playerTeam = player.party;
  const playerBag = player.bag;

  return (
    <>
      <img src={IMAGE_PATHS.bagBackground} alt="Bag Background" />

      <img
        alt="Bag Icon"
        src={IMAGE_PATHS.pocketIcons + "backpack.svg"}
        className="size-8 sm:size-14 lg:size-20 -rotate-[30deg] absolute top-1 sm:top-4 left-4"
      />
      <h1 className="text-2xl sm:text-5xl lg:text-7xl top-1 sm:top-4 left-16 sm:left-24 lg:left-28 absolute">
        BAG
      </h1>

      <div className="absolute top-11 sm:top-20 lg:top-28 flex flex-col gap-1 sm:gap-2 lg:gap-3 left-8 sm:left-16 lg:left-16">
        {playerTeam.getPokemons().map((pokemon, index) => {
          return (
            <PokemonIcon
              key={index}
              pokemon={pokemon}
              setSelectedPokemon={setSelectedPokemon}
            />
          );
        })}
      </div>

      <div className="h-full absolute top-0 right-0 w-[230px] sm:w-1/2 sm:right-4 lg:right-14">
        <PocketBar setPocket={setPocketOpen} />

        <ItemList
          bag={playerBag}
          pocket={pocketOpen}
          setItemHover={setItemHover}
          setItemSelected={setItemSelected}
        />

        {itemSelected ? (
          <ItemActionButtons item={itemSelected} />
        ) : itemHover ? (
          <ItemDescription item={itemHover} />
        ) : null}
      </div>
    </>
  );
}
