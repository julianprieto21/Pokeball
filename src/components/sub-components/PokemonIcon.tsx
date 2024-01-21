import { Pokemon } from "../../logic/pokemon";
import '../styles/PokemonIcon.css'


export function PokemonIcon( {pokemon, setSelectedPokemon, setPokemon }: { 
    pokemon: Pokemon, 
    setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon>>
    setPokemon?: React.Dispatch<React.SetStateAction<Pokemon | undefined>> }) {

    const healthPixels = pokemon.currentHp * 160 / pokemon.getStats().hp
    const handleClick = () => {
        setSelectedPokemon(pokemon)
    }
    const handleDoubleClick = () => {
        if (setPokemon) setPokemon(pokemon)
    }

    return (
        <>
            <div id={pokemon.id.toString()} className="pokemon" onClick={handleClick} onDoubleClick={handleDoubleClick} tabIndex={0}>
                <img id="icon" src={pokemon.mainSprite.sprites.front} alt="Pokemon Icon" tabIndex={0}/>
                <h2 id="name">{pokemon.name}</h2>
                <div id="healthBar" style={{width: `${healthPixels}px`}}></div>
                <h2 id="health">{pokemon.currentHp}/{pokemon.getStats().hp}</h2>
                <h2 id="level">Lv. {pokemon.level}</h2>
            </div>        
        </>
        
    )
}
