import { useState, useEffect } from 'react'
import { Pokemon } from '../../logic/pokemon'
import '../styles/PokemonPanels.css'
import { imagePathsNew } from '../../utils/constants'

const IMAGE_PATHS = imagePathsNew

export function PokemonEnemyPanel( { pokemon }: { pokemon: Pokemon } ) {

  const [name, setName] = useState<string>('')
  const [level, setLevel] = useState<number>(0)
  const [healthPorcentage, setHealthPorcentage] = useState<number>(0)

  useEffect( () => {
    setName(pokemon.name)
    setLevel(pokemon.level)
    setHealthPorcentage(pokemon.currentHp / pokemon.getStats().hp * 100)
  }, [pokemon.level])

  return (
    <div
    className='pokemon-panel'
    id='pokemon-enemy-panel'>
      <img
        src={IMAGE_PATHS.enemyPokPanelImgPath}
        alt='Enemy Panel'
      />
      <p id='name'>{name}</p>
      <p id='level'>Lv{level}</p>
      <div className="health-bar" id='health-bar'>
        <div className="default-health-bar"></div>
        <div className="current-health-bar" 
             id='enemy-current-health-bar'  style={{width: healthPorcentage + '%'}}></div>
      </div>
    </div>
  )

}