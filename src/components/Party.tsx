import { useState } from "react";
import { Game } from "../logic/game";
import { imagePaths } from "../utils/constants";
import { PokemonIcon } from "./sub-components/PokemonIcon";
import { Pokemon } from "../logic/pokemon";
import { PokemonInfo } from "./sub-components/PokemonInfo";


export function Party( { game }: { game: Game } ) {

    let primaryPok = game.getPlayer().party.getPrimary()
    const [mainPokemon, setMainPokemon] = useState<Pokemon>(primaryPok)

    const player = game.getPlayer()
    const playerTeam = player.party

    const handleBackClick = () => {
        game.battle
            ? game.interfaceManager.getSetters().interfaceState(2)
            : game.mainMenu()
    }

    // TODO: Conseguir imagen de pokeball para interfaz
    return (
        <>
        <img src={imagePaths.bagBackground} alt="Bag Background"/>

        <img id="iconBag" alt="Bag Icon" src={imagePaths.pocketIcons + 'backpack.svg'}/> 
        <h1 id="title">PARTY</h1>

        <div id="pokemons">
            <PokemonIcon pokemon={playerTeam.getPrimary()} setSelectedPokemon={setMainPokemon}/>
            <PokemonIcon pokemon={playerTeam.getPokemons()[1]} setSelectedPokemon={setMainPokemon}/>
            <PokemonIcon pokemon={playerTeam.getPokemons()[2]} setSelectedPokemon={setMainPokemon}/>
            <PokemonIcon pokemon={playerTeam.getPokemons()[3]} setSelectedPokemon={setMainPokemon}/>
            <PokemonIcon pokemon={playerTeam.getPokemons()[4]} setSelectedPokemon={setMainPokemon}/>
            <PokemonIcon pokemon={playerTeam.getPokemons()[5]} setSelectedPokemon={setMainPokemon}/>
        </div>
        
        <PokemonInfo pokemon={mainPokemon}/>

        <button id="backButton"
        onClick={handleBackClick}>BACK</button>
        </>
    )
}