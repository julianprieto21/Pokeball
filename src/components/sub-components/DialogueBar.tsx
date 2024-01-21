import { useEffect, useState } from 'react'
import { Game } from '../../logic/game'
import '../styles/Bar.css'
import { GAME_SPEED, imagePathsNew } from '../../utils/constants'
import gsap from 'gsap'
gsap.registerPlugin(TextPlugin)

const IMAGE_PATHS = imagePathsNew

export function DialogueBar( { game }: { game: Game } ) {

  const [dialogueText, setDialogueText] = useState('')

  useEffect(() => {
    const text = game.interfaceManager.getDialogue()
    animateText(text)
  }, [])

  const animateText = (text: string) => {
    setDialogueText('')
    gsap.to('#initial-dialogue-text', {
      duration: 0.8 / GAME_SPEED,
      opacity: 1, 
      text: { value: text },
      onComplete: () => {setDialogueText(text)}
    })
  }

  const handleClick = () => {
    game.showPanels = true
    if (!game.canClick) return
    if (game.interfaceManager.dialogueQueue.length > 0 || game.interfaceManager.actionQueue.length > 0) {
      game.interfaceManager.playAction() // Ataque
      setDialogueText('')
      const text = game.interfaceManager.getDialogue()
      animateText(text)
    } else {
      setDialogueText('')
      game.interfaceManager.getSetters().interfaceState(2) // battle menu bar
    }
  }

  return (
    <>
      <img 
        id="dialogue-bar"
        className="bar"
        src={IMAGE_PATHS.dialogueBarImgPath}
        onClick={handleClick}
        alt='Dialogue Bar'
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