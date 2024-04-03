import { Game } from "../../logic/game";
import "../styles/Bar.css";
import "../styles/Buttons.css";
import { imagePathsNew } from "../../utils/constants";

const IMAGE_PATHS = imagePathsNew;

export function BattleMenuBar({ game }: { game: Game }) {
  const text = game.interfaceManager.getMenuText();
  const textButtons = ["FIGHT", "BAG", "POKEMON", "RUN"];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.target as HTMLButtonElement;
    const buttonText = button.textContent;

    if (buttonText === "RUN") game.battle?.engine.retreat(game.battle.ally);

    if (buttonText === "FIGHT")
      game.interfaceManager.getSetters().interfaceState(3);

    if (buttonText === "BAG")
      game.interfaceManager.getSetters().interfaceState(4);

    if (buttonText === "POKEMON")
      game.interfaceManager.getSetters().interfaceState(5);
  };

  return (
    <>
      <img
        id="battle-menu-bar"
        className="bar"
        src={IMAGE_PATHS.battleMenuBarImgPath}
        alt="Battle Menu Bar"
      />

      <p id="initial-dialogue-text" className="text">
        {text}
      </p>

      <div id="battle-menu-buttons" className="buttons" onClick={handleClick}>
        {textButtons.map((button, index) => {
          return (
            <button
              type="button"
              key={index}
              id="battle-menu-button"
              className="button"
            >
              {button}
            </button>
          );
        })}
      </div>
    </>
  );
}
