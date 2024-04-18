import { useEffect, useState } from "react";
import { Game } from "../../lib/logic/game";

import gsap from "gsap";
import { GAME_SPEED } from "../../lib/config";
gsap.registerPlugin(TextPlugin);

export function DialogueBar({ game }: { game: Game }) {
  const [dialogueText, setDialogueText] = useState("");

  useEffect(() => {
    const text = game.interfaceManager.getDialogue();
    animateText(text);
  }, []);

  const animateText = (text: string) => {
    setDialogueText("");
    gsap.to("#dialogue-text", {
      duration: 0.8 / GAME_SPEED,
      opacity: 1,
      text: { value: text },
      onComplete: () => {
        setDialogueText(text);
      },
    });
  };

  const handleClick = () => {
    game.showPanels = true;
    if (!game.canClick) return;
    if (
      game.interfaceManager.dialogueQueue.length > 0 ||
      game.interfaceManager.actionQueue.length > 0
    ) {
      game.interfaceManager.playAction(); // Ataque
      setDialogueText("");
      const text = game.interfaceManager.getDialogue();
      animateText(text);
    } else {
      setDialogueText("");
      game.interfaceManager.getSetters().interfaceState(2); // battle menu bar
    }
  };

  return (
    <div
      className="bg-[#282828] w-full h-20 sm:h-28 lg:h-48 bottom-0 absolute border-8 outline outline-2 -outline-offset-8 outline-[#404048] border-[#181818]"
      onClick={handleClick}
    >
      <p
        id="dialogue-text"
        className="pl-2 pt-1 sm:pl-4 sm:pt-2 lg:pl-6 lg:pt-4 text-md lg:text-3xl"
      >
        {dialogueText}
      </p>
    </div>
  );
}
