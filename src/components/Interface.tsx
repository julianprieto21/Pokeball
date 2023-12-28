import './Interface.css'
import { DialogueBar } from './sub-components/DialogueBar'
import { BattleMenuBar } from './sub-components/BattleMenuBar'
import { BattleFightBar } from './sub-components/BattleFightBar'
import { PokemonPanels } from './PokemonPanels'
import { Game } from '../logic/game'
import { useEffect, useState } from 'react'
import { Pokemon } from '../logic/pokemon'

export function Interface( { game, actualState }: { game: Game, actualState: number } ) {

  const [ally, setAlly] = useState<Pokemon>()
  const [enemy, setEnemy] = useState<Pokemon>()

  useEffect( () => {
    const battle = game.interfaceManager.getBattle()
    if (!battle || actualState === 1) return
    const ally = battle.ally
    const enemy = battle.enemy
    setAlly(ally)
    setEnemy(enemy)
  }, [actualState, game, ally, enemy])
  // actualState permite visualizar los paneles
  // game permite actualizar la animacion de cuando mueren

  return (
    <div 
      className="interface"
    >
      {
        actualState === 0
          ? null // TODO: Aca iria el menu principal (fuera de la batalla)
          : actualState === 1
            ? <DialogueBar game={game} />
            : actualState === 2
              ? <BattleMenuBar game={game} />
              : actualState === 3
                ? <BattleFightBar game={game} />
                : actualState === 4
                  ? null
                  : null
      }

      {
        actualState !== 0 && ally && enemy
          ? <PokemonPanels ally={ally} enemy={enemy} />
          : null
      }
    </div>
  )
}