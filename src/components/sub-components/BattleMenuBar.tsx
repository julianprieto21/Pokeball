import { Game } from '../../logic/game'
import '../styles/Bar.css'
import '../styles/Buttons.css'
import { imagePaths } from '../../utils/constants'

export function BattleMenuBar( { game }: { game: Game } ) {

  const text = game.interfaceManager.getMenuText()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.target as HTMLButtonElement
    const buttonText = button.textContent
    console.log(buttonText)
    if (buttonText === 'RUN') game.battle?.engine.retreat(game.battle.ally)
  
    if (buttonText === 'FIGHT') game.interfaceManager.getSetters().interfaceState(3)
  
    if (buttonText === 'BAG') game.interfaceManager.getSetters().interfaceState(4)

    if (buttonText === 'POKEMON') game.interfaceManager.getSetters().interfaceState(5)
  
  }

  return (
    <>
      <img 
        id="battle-menu-bar"
        className="bar"
        src={imagePaths.battleMenuBarImgPath}
        alt='Battle Menu Bar'
      />

      <p 
        id="initial-dialogue-text"
        className='text'
        >
        {text}  
      </p>

      <div
        id='battle-menu-buttons'
        className='buttons'
        onClick={handleClick}
        >
          <button
            id='battle-menu-button'
            className='button'>FIGHT
          </button>
          <button
            id='battle-menu-button'
            className='button'>BAG
          </button>
          <button
            id='battle-menu-button'
            className='button'>POKEMON
          </button>
          <button
            id='battle-menu-button'
            className='button'>RUN
          </button>
      </div>
    </>
    
  )
}