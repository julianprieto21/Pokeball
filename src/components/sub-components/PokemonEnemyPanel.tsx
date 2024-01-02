import { useState, useEffect } from 'react'
import { Pokemon } from '../../logic/pokemon'
import '../PokemonPanels.css'
import { imagePaths } from '../../utils/constants'

export function PokemonEnemyPanel( { pokemon }: { pokemon: Pokemon } ) {

  const [name, setName] = useState<string>('')
  const [level, setLevel] = useState<number>(0)

  useEffect( () => {
    setName(pokemon.name)
    setLevel(pokemon.level)
  }, [pokemon.level])

  return (
    <div
    className='pokemon-panel'
    id='pokemon-enemy-panel'>
      <img
        src={imagePaths.enemyPokPanelImgPath}
        alt='Enemy Panel'
      />
      <p id='name'>{name}</p>
      <p id='level'>Lv{level}</p>
      <div className="health-bar" id='health-bar'>
        <div className="default-health-bar"></div>
        <div className="current-health-bar" 
             id='enemy-current-health-bar'></div>
      </div>
    </div>
  )

}