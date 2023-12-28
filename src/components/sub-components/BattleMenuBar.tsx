import { Game } from '../../logic/game'
import './Bar.css'
import './Buttons.css'
import { imagePaths } from '../../utils/constants'

export function BattleMenuBar( { game }: { game: Game } ) {

  const text = game.interfaceManager.getMenuText()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.target as HTMLButtonElement
    const buttonText = button.textContent
    console.log(buttonText)
    if (buttonText === 'RUN') game.interfaceManager.quitBattle()
    if (buttonText === 'FIGHT') game.interfaceManager.setInterfaceState(3)
  }

  return (
    <>
      <img 
        id="battle-menu-bar"
        className="bar"
        src={imagePaths.battleMenuBarImgPath}
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