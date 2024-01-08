import { Pokemon } from "../../logic/pokemon";
import { typesMap } from "../../utils/constants";
import '../styles/PokemonInfo.css'
import { StatsGraphic } from "./StatsGraphic";


export function PokemonInfo( { pokemon }: { pokemon: Pokemon } ) {

    if (pokemon === undefined) return
    const name = pokemon.name
    const id = pokemon.id
    const level = pokemon.level
    const typePrimary = typesMap[pokemon.types.primary].name
    const typeSecond = pokemon.types.second ? `- ${typesMap[pokemon.types.second].name}` : ''
    const nature = pokemon.getNature().name
    const ability = pokemon.ability
    const height = pokemon.height
    const weight = pokemon.weight
    const stats = pokemon.getStats()
    const natureStats = pokemon.getNature().stats

    const color = (stat: number) => {
        if (stat > 1) return 'green'
        else if (stat < 1) return 'red'
        else return ''
    }




    return (
        <div id="main-pokemon">

            <img id="main-pokemon-img" src={pokemon.mainSprite.sprites.front} alt="Main Pokemon" style={{borderColor: typesMap[pokemon.types.primary].color}}/>
            
            <div id="main-pokemon-info">
                <h2 id="main-pokemon-name">{id} - {name}</h2>
                <p>LEVEL: {level}</p>
                <p>TYPE: {typePrimary} {typeSecond}</p>
                <p>NATURE: {nature}</p>
                <p>ABILITY: {ability.replace('-', ' ')}</p>
                <p>WEIGHT: {weight} KG</p>
                <p>HEIGHT: {height} M</p>
            </div>

            
            <div id="main-pokemon-stats">
                <div id="stats">
                    <p className="stat" style={{ color: color(natureStats.hp)}}>HEALTH: {stats.hp}</p>
                    <p className="stat" style={{ color: color(natureStats.speed)}}>SPEED: {stats.speed}</p>
                    <p className="stat" style={{ color: color(natureStats.attack)}}>ATTACK: {stats.attack}</p>
                    <p className="stat" style={{ color: color(natureStats.spAttack)}}>SP. ATK: {stats.spAttack}</p>
                    <p className="stat" style={{ color: color(natureStats.defense)}}>DEFENSE: {stats.defense}</p>
                    <p className="stat" style={{ color: color(natureStats.spDefense)}}>SP. DEF: {stats.spDefense}</p>
                </div>

                <StatsGraphic pokemon={pokemon}/>
            </div>
        </div>
    )
}