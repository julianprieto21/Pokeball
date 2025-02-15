import { useState } from "react";
import { Game } from "../lib/logic/game";
import { imagePathsNew } from "../lib/constants";
import { ItemList } from "./item/ItemList";
import { PocketBar } from "./item/PocketBar";
import { PokemonIcon } from "./pokemon/PokemonIcon";
import { Item } from "../lib/dataClasses/item";
import { ItemDescription } from "./item/ItemDescription";
import { ItemActionButtons } from "./item/ItemActionButtons";
import { Pokemon } from "../lib/dataClasses/pokemon";

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
    <section className="relative size-full">
      <img src={IMAGE_PATHS.bagBackground} alt="Bag Background" />
      <div className="absolute flex flex-col top-0 gap-5 w-1/2">
        <h1 className="text-2xl sm:text-5xl lg:text-7xl flex gap-6 mt-4 ml-6">
          <img
            alt="Bag Icon"
            src={IMAGE_PATHS.pocketIcons + "backpack.svg"}
            className="size-8 sm:size-14 lg:size-20 -rotate-[30deg]"
          />
          BAG
        </h1>

        <div className="flex flex-col gap-1 sm:gap-2 lg:gap-3 items-center">
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
      </div>

      <div className="w-1/2 h-full absolute top-0 right-0">
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
    </section>
  );
}
