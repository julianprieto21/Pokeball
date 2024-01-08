import { Pokemon } from "../../logic/pokemon";
import '../styles/PokemonIcon.css'


export function PokemonIcon( {pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon>>}) {
    const healthPixels = pokemon.currentHp * 160 / pokemon.getStats().hp

    return <div id={pokemon.id.toString()} className="pokemon" onClick={() => setSelectedPokemon(pokemon)} tabIndex={0}>
        <img id="icon" src={pokemon.mainSprite.sprites.front} alt="Pokemon Icon" tabIndex={0}/>
        <h2 id="name">{pokemon.name}</h2>
        <div id="healthBar" style={{width: `${healthPixels}px`}}></div>
        <h2 id="health">{pokemon.currentHp}/{pokemon.getStats().hp}</h2>
        <h2 id="level">Lv. {pokemon.level}</h2>
    </div>
}
