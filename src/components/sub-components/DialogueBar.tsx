import { useEffect, useState } from 'react'
import { Game } from '../../logic/game'
import './Bar.css'
import { imagePaths } from '../../utils/constants'

export function DialogueBar( { game }: { game: Game } ) {

  const [dialogueText, setDialogueText] = useState('')

  useEffect(() => {
    setDialogueText(game.interfaceManager.getDialogue())
  }
  , [])

  const handleClick = () => {
    if (!game.canClick) return
    if (game.interfaceManager.dialogueQueue.length > 0 || game.interfaceManager.actionQueue.length > 0) {
      game.interfaceManager.playAction() // Ataque
      // game.interfaceManager.playAction() // Verificar si sigue vivo
      setDialogueText(game.interfaceManager.getDialogue())
    } else {
      setDialogueText('')
      game.interfaceManager.setInterfaceState(2) // battle menu bar
    }
  }

  return (
    <>
      <img 
        id="dialogue-bar"
        className="bar"
        src={imagePaths.dialogueBarImgPath}
        onClick={handleClick}
      />
      <p 
        id="initial-dialogue-text"
        className='text'
        >
        {dialogueText}  
      </p>
    </>
    
  )
}