import { useState } from "react";
import { Game } from "../logic/game";
import { imagePathsNew } from "../utils/constants";
import "./styles/Bag.css";
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
        id="iconBag"
        alt="Bag Icon"
        src={IMAGE_PATHS.pocketIcons + "backpack.svg"}
      />
      <h1 id="title">BAG</h1>

      <div id="pokemons">
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

      <div id="bag">
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
