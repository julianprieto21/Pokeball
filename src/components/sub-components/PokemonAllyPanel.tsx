import { useEffect, useState } from 'react'
import { Pokemon } from '../../logic/pokemon'
import '../PokemonPanels.css'
import { imagePaths } from '../../utils/constants'

export function PokemonAllyPanel( { pokemon }: { pokemon: Pokemon } ) {

  const [name, setName] = useState<string>('')
  const [level, setLevel] = useState<number>(0)
  const [health, setHealth] = useState<number>(0)
  const [currentHealth, setCurrentHP] = useState<number>(0)
  const [healthPorcentage, setHealthPorcentage] = useState<number>(0)
  const [experiencePorcentage, setExperiencePorcentage] = useState<number>(0)

  useEffect( () => {
    console.log('ally panel updated')
    setName(pokemon.name)
    setLevel(pokemon.level)
    setHealth(pokemon.getStats().hp)
    setCurrentHP(pokemon.currentHp)
    setHealthPorcentage(pokemon.currentHp / pokemon.getStats().hp * 100)
    setExperiencePorcentage(pokemon.currentXp / pokemon.getNextLevelXp() * 100)


  }, [pokemon.level, pokemon.currentHp])

  return (
    <div
    className='pokemon-panel'
    id='pokemon-ally-panel'>
      <img
        id="ally-panel"
        className="panel"
        src={imagePaths.allyPokPanelImgPath}
      />

      <p id='name'>{name}</p>
      <p id='level'>Lv{level}</p>

      <div className="health-bar" id='health-bar'>
        <div className="default-health-bar"></div>
        <div className="current-health-bar" 
             id='ally-current-health-bar' style={{width: healthPorcentage + '%'}}></div>
      </div>
      <p id='health'>{currentHealth}/{health}</p>

      <div className='experience-bar'>
        <div className='current-experience-bar'
             id='ally-current-experience-bar' style={{width: experiencePorcentage + '%'}}></div>
      </div>

    </div>
  )
}