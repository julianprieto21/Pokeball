import { useEffect, useState } from "react";
import { Game } from "../logic/game";
import { imagePathsNew } from "../utils/constants";
import { PokemonIcon } from "./sub-components/PokemonIcon";
import { Pokemon } from "../logic/pokemon";
import { PokemonInfo } from "./sub-components/PokemonInfo";

const IMAGE_PATHS = imagePathsNew

export function Party( { game }: { game: Game } ) {

    let primaryPok = game.getPlayer().party.getPrimary()
    const [mainPokemon, setMainPokemon] = useState<Pokemon>(primaryPok)
    const [pokemon, setPokemon] = useState<Pokemon>()

    const player = game.getPlayer()
    const playerTeam = player.party

    useEffect(() => {
        if (game.battle && pokemon) {
            game.battle.engine.changePokemon(pokemon)
        }
    }, [pokemon])

    // TODO: #6
    return (
        <>
        <img src={IMAGE_PATHS.bagBackground} alt="Bag Background"/>

        <img id="iconBag" alt="Bag Icon" src={IMAGE_PATHS.pocketIcons + 'backpack.svg'}/> 
        <h1 id="title">PARTY</h1>

        <div id="pokemons">
            {playerTeam.getPrimary()
                    ? <PokemonIcon pokemon={playerTeam.getPrimary()} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                    : null
                }
            {playerTeam.getPokemons()[1]
                ? <PokemonIcon pokemon={playerTeam.getPokemons()[1]} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                : null
            }
            {playerTeam.getPokemons()[2]
                ? <PokemonIcon pokemon={playerTeam.getPokemons()[2]} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                : null
            }
            {playerTeam.getPokemons()[3]
                ? <PokemonIcon pokemon={playerTeam.getPokemons()[3]} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                : null
            }
            {playerTeam.getPokemons()[4]
                ? <PokemonIcon pokemon={playerTeam.getPokemons()[4]} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                : null
            }
            {playerTeam.getPokemons()[5]
                ? <PokemonIcon pokemon={playerTeam.getPokemons()[5]} setSelectedPokemon={setMainPokemon} setPokemon={setPokemon}/>
                : null
            }
        </div>
        
        <PokemonInfo pokemon={mainPokemon}/>

        </>
    )
}